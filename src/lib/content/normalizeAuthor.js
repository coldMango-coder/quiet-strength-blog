// normalizeAuthor: fixes mojibake and ensures correct diacritics for author name
export function normalizeAuthor(name) {
  if (!name || typeof name !== 'string') return name;
  let n = name.normalize('NFC');
  n = n
    .replace(/A\u030A\s*inko/gi, 'Šinko')
    .replace(/A.(?:\s|\u00A0)Šinko/gi, 'Šinko')
    .replace(/A\.\s*inko/gi, 'Šinko')
    .replace(/\bSinko\b/gi, 'Šinko');
  n = n.replace(/Marica\s+Šinko/i, 'Marica Šinko');
  return n;
}

// DOM helper to normalize any rendered author text inside a root element
export function normalizeAuthorInDOM(rootSelector = 'article') {
  try {
    const root = document.querySelector(rootSelector) || document;
    const apply = (scope) => {
      const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT, null);
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach((node) => {
        const v = String(node.nodeValue || '');
        if (/Marica|Šinko|inko/i.test(v)) {
          const fixed = normalizeAuthor(v);
          if (fixed !== v) node.nodeValue = fixed;
        }
      });
    };
    apply(root);
    const obs = new MutationObserver((muts) => {
      muts.forEach((m) => {
        m.addedNodes && m.addedNodes.forEach((n) => {
          if (n.nodeType === Node.TEXT_NODE) {
            const v = String(n.nodeValue || '');
            const f = normalizeAuthor(v);
            if (f !== v) n.nodeValue = f;
          } else if (n.nodeType === Node.ELEMENT_NODE) {
            apply(n);
          }
        });
      });
    });
    obs.observe(root, { childList: true, subtree: true, characterData: true });
    setTimeout(() => obs.disconnect(), 3000);
  } catch {}
}

