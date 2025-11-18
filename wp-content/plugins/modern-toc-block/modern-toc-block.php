<?php
/*
Plugin Name: Modern TOC Block
Description: Gutenberg block and server-rendered Table of Contents with zero-CWV-regression guarantees.
Version: 1.0.0
Author: Quiet Strength
*/

namespace ModernTOC;

if (!defined('ABSPATH')) { exit; }

require_once __DIR__ . '/includes/render.php';

const PLUGIN_SLUG = 'modern-toc';
const PLUGIN_DIR  = __DIR__;

// Add IDs to headings H2-H4 if missing using deterministic slugs
add_filter('the_content', __NAMESPACE__ . '\filter_add_heading_ids', 20);
function filter_add_heading_ids($content){
    if (is_admin()) return $content;
    if (stripos($content, '<h2') === false && stripos($content, '<h3') === false && stripos($content, '<h4') === false) {
        return $content;
    }
    $dom = new \DOMDocument();
    libxml_use_internal_errors(true);
    $loaded = $dom->loadHTML('<?xml encoding="utf-8" ?>' . $content, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
    libxml_clear_errors();
    if (!$loaded) return $content;

    $xpath = new \DOMXPath($dom);
    $seen = [];
    foreach (['h2','h3','h4'] as $tag) {
        foreach ($xpath->query('//' . $tag) as $h) {
            /** @var \DOMElement $h */
            $id = $h->getAttribute('id');
            if (!$id) {
                $txt = trim($h->textContent);
                $slug = slugify($txt);
                $base = $slug;
                $i = 2;
                while (isset($seen[$slug])) { $slug = $base . '-' . $i; $i++; }
                $id = $slug;
                $h->setAttribute('id', $id);
            }
            $seen[$id] = true;
        }
    }
    $html = $dom->saveHTML();
    // remove the XML encoding node we prefixed
    $html = preg_replace('/^<\?xml.*?\?>/','', $html);
    return $html;
}

function slugify($text){
    $text = iconv('UTF-8','ASCII//TRANSLIT//IGNORE',$text);
    $text = strtolower($text);
    $text = preg_replace('/[^a-z0-9\s-]/','', $text);
    $text = preg_replace('/[\s-]+/','-', $text);
    $text = trim($text,'-');
    if ($text === '') $text = 'section';
    return $text;
}

// Shortcode alternative
add_shortcode('modern_toc', __NAMESPACE__ . '\shortcode_render');
function shortcode_render($atts){
    $a = shortcode_atts([
        'levels' => '2,3,4',
        'offset' => '96',
        'collapsed_mobile' => 'true',
        'accent' => '',
    ], $atts, 'modern_toc');
    return render_toc(get_the_content(null,false), [
        'levels' => $a['levels'],
        'offset' => (int)$a['offset'],
        'collapsed_mobile' => $a['collapsed_mobile'] === 'true',
        'accent' => $a['accent'],
    ]);
}

// Gutenberg block registration
add_action('init', function(){
    // Editor script (minimal) and front assets
    wp_register_style(PLUGIN_SLUG . '-style', plugins_url('assets/toc.css', __FILE__), [], '1.0.0');
    wp_register_script(PLUGIN_SLUG . '-script', plugins_url('assets/toc.js', __FILE__), [], '1.0.0', [ 'in_footer' => true ]);
    // Ensure type="module" and defer
    add_filter('script_loader_tag', function($tag, $handle){
        if ($handle === PLUGIN_SLUG . '-script'){
            $tag = str_replace('<script ', '<script type="module" defer ', $tag);
        }
        return $tag;
    }, 10, 2);

    register_block_type('modern-toc/auto', [
        'render_callback' => function($attributes){
            wp_enqueue_style(PLUGIN_SLUG . '-style');
            wp_enqueue_script(PLUGIN_SLUG . '-script');
            $levels = isset($attributes['levels']) ? $attributes['levels'] : '2,3,4';
            $offset = isset($attributes['offset']) ? (int)$attributes['offset'] : 96;
            $collapsed = !isset($attributes['collapsed_mobile']) ? true : (bool)$attributes['collapsed_mobile'];
            $accent = isset($attributes['accent']) ? $attributes['accent'] : '';
            return render_toc(get_the_content(null,false), [
                'levels' => $levels,
                'offset' => $offset,
                'collapsed_mobile' => $collapsed,
                'accent' => $accent,
            ]);
        },
        'attributes' => [
            'levels' => [ 'type' => 'string', 'default' => '2,3,4' ],
            'offset' => [ 'type' => 'number', 'default' => 96 ],
            'collapsed_mobile' => [ 'type' => 'boolean', 'default' => true ],
            'accent' => [ 'type' => 'string', 'default' => '' ],
        ],
        'editor_script' => PLUGIN_SLUG . '-script',
        'style' => PLUGIN_SLUG . '-style',
    ]);
});

