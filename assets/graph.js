/*
 * Graph helper for membership-function plots on the teacher's board.
 *
 *   const g = Graph({ x: 120, y: 90, w: 720, h: 300, from: 140, to: 210 });
 *   await g.axes(b, 'ax', { ticks: [140, 160, 180, 200], label: 'cm' });
 *   await g.curve(b, 'tall', h => Math.min(1, Math.max(0, (h - 160) / 25)), { color: 'green' });
 *   await g.poly(b, 'step', [[140, 0], [180, 0], [180, 1], [210, 1]], { color: 'red' });
 *
 * x, y, w, h is the plot rectangle on the 1000 × 560 board (μ = 1 at the top edge y, μ = 0 at y + h).
 * from / to is the data range on the horizontal axis. g.X(v) and g.Y(μ) map data to board points.
 * For graphs that are not membership functions (activation, loss, objective), set the vertical range
 * with min / max (default 0 / 1) and the vertical label with axes(..., { yLabel: 'y', yTicks: [...] }).
 * Leave about 40 px free above y (for the μ label) and 30 px below y + h (for tick numbers).
 */
(() => {
  'use strict';
  window.Graph = function Graph({ x, y, w, h, from, to, min = 0, max = 1 }) {
    const X = v => x + ((v - from) / (to - from)) * w;
    const Y = m => y + h - ((m - min) / (max - min)) * h;
    const all = list => Promise.all(list);
    return {
      X, Y,
      // Axes with tick numbers. ticks: x values to label; yTicks: μ values to label.
      async axes(b, id, { ticks = [], yTicks = [min, (min + max) / 2, max], label = 'x', yLabel = 'μ', size = 18 } = {}) {
        const base = Math.min(max, Math.max(min, 0)); // the x axis sits at value 0 when 0 is in range
        await all([
          b.arrow(`${id}-x`, x, Y(base), x + w + 24, Y(base), { color: 'soft', head: 10 }),
          b.arrow(`${id}-y`, x, y + h, x, y - 20, { color: 'soft', head: 10 }),
        ]);
        await all([
          ...ticks.map(t => b.write(`${id}-t${t}`, X(t), Y(base) + size + 6, String(t), { size, color: 'soft', dur: 120 })),
          ...yTicks.filter(m => m !== base).map(m => b.write(`${id}-m${m}`, x - 10, Y(m) + size / 3, String(m), { size, color: 'soft', anchor: 'end', dur: 120 })),
          b.write(`${id}-xl`, x + w + 30, Y(base) + 6, label, { size: size + 4, color: 'soft', anchor: 'start', dur: 150 }),
          b.write(`${id}-yl`, x, y - 28, yLabel, { size: size + 6, color: 'soft', dur: 150 }),
        ]);
      },
      // A smooth curve μ = f(v) across the whole range (or [lo, hi]).
      curve(b, id, f, { color = 'blue', lo = from, hi = to, steps = 120, width, dur = 900 } = {}) {
        const pts = Array.from({ length: steps + 1 }, (_, k) => {
          const v = lo + ((hi - lo) * k) / steps;
          return [+X(v).toFixed(1), +Y(f(v)).toFixed(1)];
        });
        return b.wire(id, pts, { color, width, dur });
      },
      // Straight segments through data points [[v, μ], ...] (triangles, trapezoids, steps, clipped shapes).
      poly(b, id, pts, { color = 'blue', width, dur = 700 } = {}) {
        return b.wire(id, pts.map(([v, m]) => [X(v), Y(m)]), { color, width, dur });
      },
      // A dashed-looking guide from the x axis up to (v, μ) and across to the μ axis.
      guide(b, id, v, m, { color = 'orange' } = {}) {
        return all([
          b.line(`${id}-v`, X(v), Y(Math.min(max, Math.max(min, 0))), X(v), Y(m), { color, width: 2, dur: 300 }),
          b.line(`${id}-h`, X(v), Y(m), x, Y(m), { color, width: 2, dur: 300 }),
          b.dot(`${id}-d`, X(v), Y(m), { color }),
        ]);
      },
    };
  };
})();
