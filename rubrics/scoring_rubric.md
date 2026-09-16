# Shared Scoring Rubric

Each reviewed solution is scored out of 25 points across five categories. Use this rubric with the task prompt, tests, and written evaluation so the score is grounded in observable behavior.

| Category | Points | Description |
| --- | ---: | --- |
| Correctness | 0-5 | Does the solution satisfy the required behavior and produce the expected results? |
| Efficiency | 0-5 | Does the solution use appropriate time and space complexity for the task size and constraints? |
| Code Quality | 0-5 | Is the code readable, organized, maintainable, idiomatic, and appropriately scoped? |
| Edge Cases | 0-5 | Does the solution handle boundary conditions, invalid or empty inputs, duplicates, missing values, ties, and other likely edge cases? |
| Explanation / Communication | 0-5 | Are assumptions, reasoning, limitations, and tradeoffs explained clearly enough for a reviewer or user? |

## Score Guidance

| Score | Meaning |
| ---: | --- |
| 5 | Excellent; fully satisfies the category with no meaningful issues. |
| 4 | Strong; minor issues exist but the category is mostly satisfied. |
| 3 | Mixed; works in common cases but has notable gaps. |
| 2 | Weak; significant issues affect important scenarios. |
| 1 | Very weak; only a small part of the category is satisfied. |
| 0 | Missing, nonfunctional, or not applicable because the solution fails before this category can be assessed. |

## Severity Definitions

### Critical Issue

A critical issue makes the solution unusable for the core task. Examples include failing to run, returning fundamentally incorrect results for common inputs, corrupting data, or ignoring a required part of the prompt.

### Major Issue

A major issue causes incorrect behavior for important scenarios but does not completely invalidate the solution. Examples include mishandling common edge cases, using an inefficient approach that fails at realistic scale, or omitting meaningful requirements.

### Minor Issue

A minor issue affects less common scenarios or creates limited confusion without changing the main outcome for typical cases. Examples include incomplete validation, unclear naming in a small area, or a slightly incomplete explanation.

### Style Issue

A style issue does not materially affect correctness but reduces clarity, consistency, or polish. Examples include inconsistent formatting, overly verbose code, weak naming, or avoidable duplication.
