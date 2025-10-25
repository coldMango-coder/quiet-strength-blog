export default function sanitizeArticleStart(rootSelector = 'article') {
  try {
    const root = document.querySelector(rootSelector);
    if (!root) return;
    // Clean leading stray characters in the first few text nodes
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    const targets = [];
    while (walker.nextNode() && targets.length < 10) {
      const node = walker.currentNode;
      if (node.nodeValue && node.nodeValue.trim().length) targets.push(node);
    }
    const fix = (s) =>
      s
        .replace(/^\s*[â�]+/g, '') // leading weird bytes
        .replace(/â€¢/g, '•')
        .replace(/Å /g, 'Š')
        .replace(/Marica Sinko/g, 'Marica Šinko');
    targets.forEach((node) => {
      const v = node.nodeValue || '';
      const f = fix(v);
      if (v !== f) node.nodeValue = f;
    });
  } catch {}
}

