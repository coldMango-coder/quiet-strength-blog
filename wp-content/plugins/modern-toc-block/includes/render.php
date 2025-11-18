<?php
namespace ModernTOC;

if (!defined('ABSPATH')) { exit; }

function render_toc($content, $opts = []){
    $levelsOpt = isset($opts['levels']) ? (string)$opts['levels'] : '2,3,4';
    $levels = array_map('intval', array_filter(array_map('trim', explode(',', $levelsOpt))));
    if (empty($levels)) $levels = [2,3,4];
    $minLevel = min($levels);
    $maxLevel = max($levels);
    $offset = isset($opts['offset']) ? (int)$opts['offset'] : 96;
    $collapsedMobile = isset($opts['collapsed_mobile']) ? (bool)$opts['collapsed_mobile'] : true;
    $accent = isset($opts['accent']) && $opts['accent'] !== '' ? $opts['accent'] : '';

    $dom = new \DOMDocument();
    libxml_use_internal_errors(true);
    $loaded = $dom->loadHTML('<?xml encoding="utf-8" ?>' . $content, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
    libxml_clear_errors();
    if (!$loaded) return '';

    $xpath = new \DOMXPath($dom);
    $query = [];
    for ($i = $minLevel; $i <= $maxLevel; $i++) { $query[] = '//h'.$i; }
    $nodes = [];
    foreach ($query as $q) {
        foreach ($xpath->query($q) as $n) { $nodes[] = $n; }
    }
    usort($nodes, function($a,$b){ return $a->getLineNo() <=> $b->getLineNo(); });
    if (count($nodes) === 0) return '';

    // Build a nested structure
    $items = [];
    $stack = [&$items];
    $numStack = [0];
    foreach ($nodes as $node){
        /** @var \DOMElement $node */
        $level = (int)substr($node->tagName,1);
        if ($level < $minLevel || $level > $maxLevel) continue;
        $text = trim($node->textContent);
        $id = $node->getAttribute('id');
        if (!$id) { $id = slugify($text); }
        // Adjust nesting
        $currentLevel = $minLevel + (count($stack)-1);
        if ($level > $currentLevel){
            while ($level > $currentLevel){ $stack[] = []; $numStack[] = 0; $currentLevel++; }
        } elseif ($level < $currentLevel){
            while ($level < $currentLevel && count($stack) > 1){ array_pop($stack); array_pop($numStack); $currentLevel--; }
        }
        $numStack[count($numStack)-1]++;
        $numbering = implode('.', $numStack);
        $item = [ 'id'=>$id, 'text'=>$text, 'level'=>$level, 'number'=>$numbering, 'children'=>[] ];
        $ref =& $stack[count($stack)-1];
        $ref[] = &$item;
        $stack[count($stack)-1] = $ref;
        $stack[] = &$item['children'];
        $numStack[] = 0;
        // Pop immediate child context to allow siblings
        array_pop($stack); array_pop($numStack);
    }

    // Build HTML
    $accentStyle = $accent ? '--toc-accent: ' . esc_attr($accent) . ';' : '';
    $attrs = ' class="toc not-prose sticky top-[var(--toc-offset,96px)] max-h-[calc(100vh-120px)] overflow-auto rounded-2xl shadow-sm ring-1 ring-black/5 p-4 md:p-5 bg-[var(--toc-bg)]" aria-label="Table of contents" style="--toc-offset:' . (int)$offset . 'px;' . $accentStyle . '"';

    $critical = critical_css_safety();

    $html = '';
    $html .= "<style>" . $critical . "</style>";
    $html .= '<nav' . $attrs . '>';
    $html .= '<h2 class="text-sm font-semibold tracking-wide uppercase mb-3 text-[var(--toc-text)]">Table of Contents</h2>';
    $html .= build_list_html($items, $minLevel);
    $html .= '</nav>';

    // Mobile collapsible variant via details wrapper (progressive enhancement by CSS)
    if ($collapsedMobile){
        $html = '<details class="md:hidden block rounded-xl overflow-hidden"' . ' ' . ($collapsedMobile ? '' : 'open') . '><summary class="cursor-pointer p-3 text-sm font-medium">Table of Contents</summary><div class="p-0">' . $html . '</div></details>';
    }

    return $html;
}

function build_list_html($items, $minLevel){
    if (empty($items)) return '';
    $out = '<ol class="space-y-1 text-[0.95rem] leading-6">';
    foreach ($items as $it){
        $activeCls = 'block px-2 py-1 rounded hover:underline data-[active=true]:font-semibold data-[active=true]:border-l-2 data-[active=true]:pl-1 data-[active=true]:border-[var(--toc-accent)]';
        $out .= '<li>';
        $out .= '<a class="' . $activeCls . '" href="#' . esc_attr($it['id']) . '" data-active="false">' . esc_html($it['number'] . ' ' . $it['text']) . '</a>';
        if (!empty($it['children'])){
            $out .= '<ol class="mt-1 ml-4 border-l pl-3 space-y-1">';
            foreach ($it['children'] as $child){
                $out .= '<li>';
                $out .= '<a class="block px-2 py-1 text-sm opacity-90 hover:underline" href="#' . esc_attr($child['id']) . '">' . esc_html($child['number'] . ' ' . $child['text']) . '</a>';
                if (!empty($child['children'])){
                    $out .= '<ol class="mt-1 ml-4 border-l pl-3 space-y-1">';
                    foreach ($child['children'] as $g){
                        $out .= '<li><a class="block px-2 py-1 text-sm opacity-80 hover:underline" href="#' . esc_attr($g['id']) . '">' . esc_html($g['number'] . ' ' . $g['text']) . '</a></li>';
                    }
                    $out .= '</ol>';
                }
                $out .= '</li>';
            }
            $out .= '</ol>';
        }
        $out .= '</li>';
    }
    $out .= '</ol>';
    return $out;
}

function critical_css_safety(){
    // Tiny CSS to avoid blocking Tailwind and prevent layout shifts; scoped to .toc only.
    return trim('
:root{--toc-bg: color-mix(in oklab, Canvas, var(--wp--preset--color--primary, #4f46e5) 6%); --toc-accent: var(--wp--preset--color--primary, #4f46e5); --toc-text: var(--wp--preset--color--foreground, #0b1020);} 
@media (prefers-color-scheme: dark){:root{--toc-bg: color-mix(in oklab, Canvas, var(--wp--preset--color--primary, #818cf8) 14%); --toc-text: var(--wp--preset--color--foreground, #e5e7eb);} }
.toc{box-sizing:border-box}
.toc a{text-decoration:none;color:inherit}
.toc ol{list-style:decimal;margin:0;padding:0}
.toc li{margin:0;padding:0}
.toc{min-height:120px}
@media (min-width:1024px){.toc{position:sticky}}
    ');
}

