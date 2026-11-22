# Principles of Computational Intelligence — animated teacher

Animated lessons for the Persian "Principles of Computational Intelligence" course (Dr. Habibi, 324 slides):
fuzzy logic, fuzzy inference, linear algebra, machine learning, neural networks and optimization — 30 lessons in 8 parts.
Each lesson plays like a teacher at a whiteboard: one idea per step, spoken and drawn, then exam-style quiz questions.
It uses the same player as the Digital Logic Design course.

Explanations are in Persian (right-to-left); numbers, math and technical terms stay in English, and keep
their left-to-right order inside Persian sentences automatically.

## Open it

```bash
python3 -m http.server 8765
```

Then open http://localhost:8765 (the course outline). Lessons also open straight from disk.

## Layout

- `index.html` — course outline
- `assets/teacher.js` — the lesson player (whiteboard helpers, narration, quizzes, Persian/English text order)
- `assets/teacher.css` — shared look, light (whiteboard) and dark (chalkboard)
- `assets/graph.js` — graph helper for membership, activation and loss curves
- `lessons/00NN-*.html` — one file per lesson: a list of steps (`say`, `draw`, `term`, `quiz`)
- `reference/` — formula sheet and Persian–English glossary (parts 1–3)
- `tools/check-lesson.mjs` — checks a lesson without a browser; `tools/layout-audit.js` — overlap check in a browser
- `LESSON-GUIDE.md` — how a lesson is written
- `source/` — slides and homework PDFs (not committed)
