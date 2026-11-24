// Paste into any lesson page's console (or run through the browser tool). Loads each listed lesson's
// steps, renders every quiz `given` / `find` card with the real player, and reports cards whose
// English / math runs come out in the wrong order, break across lines, or leave a stray bracket or '*'.
// Usage: await auditCards(['0013-reasoning-fuzzy-inputs.html', ...])  → array of problems
window.auditCards = async function auditCards(files) {
  const problems = [];
  const host = document.createElement('div');
  host.className = 'bubble'; host.dir = 'rtl';
  host.style.cssText = 'position:fixed;left:0;top:0;width:560px;z-index:99;background:#fff';
  host.innerHTML = '<div class="quiz"></div>';
  document.body.append(host);
  const box = host.firstChild;
  for (const f of files) {
    const html = await (await fetch(f, { cache: 'reload' })).text();
    const code = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]).join('\n;\n');
    let def;
    new Function('Teacher', code)({ start: d => { def = d; } });
    for (const [i, s] of def.steps.entries()) {
      const q = s.quiz;
      if (!q || !(q.given || q.find)) continue;
      const lines = [...(q.given || []), ...(q.find ? [q.find] : [])];
      for (const l of lines) {
        if (/(^|\s)[\])](\s|$)|\*/.test(l)) problems.push(`${f} step ${i + 1}: stray bracket or '*' in "${l}"`);
        box.innerHTML = `<div class="given"><ul><li>${Teacher.html(l)}</li></ul></div>`;
        for (const sp of box.querySelectorAll('[dir=ltr]')) {
          if (sp.getClientRects().length > 1) problems.push(`${f} step ${i + 1}: "${sp.textContent}" breaks across lines`);
          const t = [...sp.childNodes].find(n => n.nodeType === 3);
          if (!t) continue;
          let prev = -Infinity;
          for (let k = 0; k < t.length; k++) {
            if (t.textContent[k] === ' ') continue;
            const r = document.createRange(); r.setStart(t, k); r.setEnd(t, k + 1);
            const x = r.getBoundingClientRect().x;
            if (x < prev - 0.5) { problems.push(`${f} step ${i + 1}: "${sp.textContent}" out of order`); break; }
            prev = x;
          }
        }
        const opens = (l.match(/[([]/g) || []).length, closes = (l.match(/[)\]]/g) || []).length;
        if (opens !== closes) problems.push(`${f} step ${i + 1}: unbalanced brackets in "${l}"`);
      }
    }
  }
  host.remove();
  return problems;
};
