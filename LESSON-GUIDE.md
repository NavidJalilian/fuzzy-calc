# How a lesson is written

Lessons use the same animated-teacher player as the Digital Logic Design course (`~/Documents/code/madar`).
A good model of the style is `~/Documents/code/madar/lessons/01-number-systems.html`: copy its structure —
same `<head>`, the `teacher.js` include, one inline script that calls `Teacher.start({...})`.

In this course every lesson page also loads the graph helper, right after `teacher.js`:

```html
<script src="../assets/teacher.js"></script>
<script src="../assets/graph.js"></script>
<script>
  // the lesson
</script>
```

The inline lesson script must be a plain `<script>` tag (no attributes) — the checker only reads those.

## Sources
- The slides: `source/slides.pdf` (324 pages) and its text `source/slides.txt` (pages are separated by
  form feeds `\f`; page N is chunk N−1). Slide numbers in lessons are **PDF page numbers**.
- Many slides are pictures with little or no text. Render the ones you need and look at them:
  `pdftoppm -f 210 -l 210 -r 70 -png source/slides.pdf source/pages/s` → `source/pages/s-210.png`.
- Homework: `source/hw1.pdf` … `source/hw4.pdf`; solutions for 3 and 4: `source/hw3-solution.pdf`,
  `source/hw3-answer.pdf`, `source/hw4-solution.pdf`, `source/hw4-answer.pdf`.
- Lessons 1–11 existed before as static pages. Their full old content (explanations, worked examples,
  practice questions with solutions, exam traps) is in git: `git show 5ba235c:lessons/0004-union-intersection-complement.html`.
  Read the old version first and carry its substance over; it was checked against the slides.
- `NOTES.md` records what confused the student before (e.g. the `(x, μ)` vs `μ/x` order flip). Address it.
- `source/` is not committed (it is in `.gitignore`).

## Language
- The teacher's explanations (`say`, quiz `hint` / `explain`, Persian board labels) are **Persian**.
- Technical terms stay **English** inside the Persian sentence: membership function, fuzzification,
  max-min, centroid, overfitting, gradient descent, bias… Use the slides' Persian word next to it the
  first time (e.g. "*fuzzification* یا فازی‌سازی").
- **Numbers are normal western digits** (1, 2, 0.6). Never Persian digits — the checker rejects them.
- Math on the board is plain text: `^` for superscripts and `_` for subscripts, e.g. `μ_A(x)`, `x^2`,
  `e^{-(x-c)^2}`. Use `{…}` for multi-character scripts, and braces when letters follow: `x_{1}w_{1}`
  (plain `x_1w_1` makes "1w" the subscript).
- To check text order in a browser, measure character positions (`getStartPositionOfChar` on board
  text, a `Range` in HTML); small screenshots of mixed Persian / English are easy to misread.
- Persian board text uses `{ fa: true }`. **English words, numbers and math inside Persian text keep
  their order automatically** — on the board, in `say`, quiz choices, hints, titles. The player groups each
  run of non-Persian words into one left-to-right piece (punctuation between English words stays inside
  the run; `.` `،` `؛` at the end of a run stays on the Persian side). No `LTR()` wrapping needed.
- Inside `{ fa: true }` board text, `^` and `_` are NOT turned into super/subscripts. Use Unicode
  (`w₁`, `x²`) or write the math as its own non-`fa` `write`.
- Keep one English run from being split by a Persian word if it must read as one unit
  (write `[0, 1]`, not `[0، 1]`).

## Teaching style — a teacher, not a slide
- One idea per step. Explain the *mechanism* step by step, then the result. 15–28 steps per lesson.
- Follow the slides' own examples, in the slides' order, with the slides' numbers. Say "مثال اسلاید"
  when using one. Add your own extra example only when it helps, and mark exam tips with `tip: true`.
- If a slide has an error, teach the correct version and say plainly that the slide has it wrong.
- Each step's `draw` animates what the teacher is saying *right now* — write, highlight (`pulse`,
  `ring`, `recolor`), cross out (`line` + `dim`), move. Clear the board (`b.clear()`) when the topic changes.
- Add `term: ['English term', 'واژه‌ی فارسی']` the first time a key exam term appears.
- **One running example that grows.** Pick one example (in part 4: the wind / pressure / rain rules)
  and build every section on it, each section adding one new piece and reusing the numbers found
  before ("از بخش 1"). Don't jump between unrelated pictures. A roadmap step near the start names the
  sections. Lesson 13 is the reference.
- **A check question after every section** (1–2 `quiz` steps on the running example, tagged
  "سؤال بخش k" on the board, drawn on top of the section's picture without clearing). Ask the student
  to compute the next value *before* the teacher shows it, so the answer feeds the next section.
  These are on top of the final quizzes; the step count may go past 28 for this.
- **Every section check is a complete exam question.** Give it `quiz.given` (a list of every value,
  formula and set it needs — including numbers found in earlier sections) and `quiz.find` (what to
  compute). The player shows them as a "داده‌ها / بخواه" card. The student must never have to remember
  or guess what is available. Write math in these lines as plain text without `_` (e.g. `μA1(x) = (x − 5)/5`).
- End with a "یادت باشد" summary step, then **4–6 exam-style quiz steps** (`quiz` + `solve`). Mix typed
  answers (`answer: [...]`, compared ignoring spaces / parentheses) and multiple choice (`choices`,
  `correct`). `solve(b)` animates the full method on the board.
- Typed answers must be short and unambiguous (one number like `0.6`). For a whole fuzzy set, a formula
  or a concept, use multiple choice.
- Practice / mock-exam lessons (11, 16) are mostly worked exam problems: pose, solve step by step on the
  board, then quiz. They may have more quizzes (up to 10).

## Correctness
- Recompute every number, table, max-min product, centroid and gradient step yourself (run a quick
  `node -e` check). The quiz answers must be right.
- Prefer computing values in code over typing them by hand.

## Board
- The board is 1000 × 560. Keep everything inside x 40–960, y 40–540; don't let text overlap.
- Helpers on `b`: `write`, `line`, `arrow`, `box`, `ring`, `path`, `wire`, `dot`, `erase`, `clear`,
  `dim`, `move`, `pulse`, `recolor`, `wait`. See the top of `assets/teacher.js`. (`gate` / `pins` draw
  logic gates; not needed here.)
- `width` on `line` / `path` / `wire` sets the stroke thickness; `fill` on `box` / `ring` / `path`
  tints the inside (`ink`, `blue`, `orange`, `green`, `red`, `purple`, `soft`).
- Colors: `ink`, `blue` (inputs / given values), `orange` (focus), `green` (results), `red` (errors,
  traps), `purple` (labels / indices), `soft` (secondary).
- **Graphs** (membership functions, activation functions, loss curves): use `Graph` from
  `assets/graph.js` — `const g = Graph({ x, y, w, h, from, to })`, then `g.axes(b, id, {...})`,
  `g.curve(b, id, f, {...})`, `g.poly(b, id, [[v, μ], ...], {...})`, `g.guide(b, id, v, μ)`, and
  `g.X(v)` / `g.Y(μ)` to place labels. Read the comment at the top of the file.
- **Tables** (rule matrices, relation matrices, data tables): write each cell at computed coordinates
  and draw grid lines with `b.line`; give cells ids like `m-2-3` so later steps can `pulse` / `recolor` them.
- **Networks / diagrams**: `ring` for neurons, `arrow` for connections, `box` for blocks.
- Every `draw` must work when replayed instantly (going Back redraws all earlier steps with no
  animation), so a step's drawing may only depend on what earlier steps drew.

## File and links
- File `lessons/00NN-slug.html` exactly as listed in `index.html`; `id: 'LNN'` (two digits, e.g. `'L07'`),
  `number: NN`, `chapter: 'بخش K · …'` (the part title from `index.html`), `slides: '96–101'`,
  `next: { href: '00NN+1-slug.html', title: '…' }` (omit `next` on lesson 30).
- Lesson titles and slide ranges come from `index.html`. If you need to change one, say so in your report.

## Check before you finish
```bash
node tools/check-lesson.mjs lessons/00NN-slug.html
```
It replays every step and reports errors, drawings off the board, Persian digits and broken quizzes.
It cannot see overlaps, so lay out coordinates carefully. For overlaps, serve the folder
(`python3 -m http.server 8765`), open the lesson in a browser, paste `tools/layout-audit.js` into the
console and run `await auditLesson()`.
For the exam-question cards (`given` / `find`), paste `tools/card-audit.js` and run
`await auditCards(['00NN-slug.html'])`: it reports formulas that read out of order, break across lines,
or leave a stray `]` / `*` (a `*` turns on bold, so write "centroid", not `z*`). If a card is missing
in the browser, force-reload `assets/teacher.js` — browsers cache the old player.
