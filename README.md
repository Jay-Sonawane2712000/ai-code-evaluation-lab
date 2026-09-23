# AI Code Evaluation Lab

A portfolio project for evaluating AI-generated code across data analysis, JavaScript, TypeScript, React UI components, and C++ algorithms.

AI Code Evaluation Lab exists to demonstrate the work behind high-quality AI code review: designing task prompts, creating reference solutions, seeding realistic model mistakes, writing tests that expose those mistakes, and producing rubric-based feedback. It is built to align with AI Trainer, AI Code Evaluator, and DataAnnotation-style roles where reviewers compare model outputs, identify hidden bugs, and explain quality issues clearly.

## What This Demonstrates

- Designing coding and data-analysis tasks with clear requirements.
- Writing correct reference solutions.
- Creating realistic flawed AI-style solutions.
- Building tests that expose hidden bugs and edge-case failures.
- Evaluating accuracy, efficiency, edge cases, code quality, and communication.
- Writing professional feedback for model improvement.
- Working across Python, JavaScript, TypeScript, React, and C++.

## Repository Structure

```text
ai-code-evaluation-lab/
|-- README.md
|-- requirements.txt
|-- data/
|   `-- ecommerce_orders.csv
|-- rubrics/
|   |-- scoring_rubric.md
|   `-- evaluation_template.md
|-- evaluator/
|   `-- score_task.py
|-- python-data-analysis/
|   `-- task_01_monthly_revenue/
|-- javascript-functions/
|   `-- task_01_suspicious_refunds/
|-- typescript-functions/
|   `-- task_01_risk_score_validator/
|-- react-ui-tasks/
|   `-- task_01_kpi_card/
`-- cpp-algorithms/
    `-- task_01_top_k_frequent/
```

## Task Inventory

| Track | Task | Language/Framework | What It Evaluates | Test Command |
| --- | --- | --- | --- | --- |
| Python data analysis | Monthly revenue analysis | Python, pandas, pytest | Date grouping, signed revenue, refund rates, category ranking, DataFrame testing | `pytest test_solutions.py -v` |
| JavaScript functions | Suspicious refund detection | JavaScript, Jest | Threshold logic, ratios, rolling-window behavior, stable output ordering | `npm test` |
| TypeScript functions | Risk score validator | TypeScript, Jest, ts-jest | Type safety, validation rules, threshold classification, stale-date logic, summary counts | `npm test` |
| React UI tasks | KPI card component | React, Testing Library, Jest | Loading/error precedence, formatting, change states, accessibility checks | `npm test` |
| C++ algorithms | Top K frequent integers | C++17 | Frequency counting, deterministic tie-breaking, edge cases, simple test runner | `g++ -std=c++17 -O2 test_solutions.cpp -o test_solutions.exe && test_solutions.exe` |

## Quick Start

Install Python dependencies from the repository root:

```bash
pip install -r requirements.txt
```

Run the Python task:

```bash
cd python-data-analysis/task_01_monthly_revenue
python -m pytest test_solutions.py -v
```

Run the JavaScript task:

```bash
cd javascript-functions/task_01_suspicious_refunds
npm install
npm test
```

Run the React task:

```bash
cd react-ui-tasks/task_01_kpi_card
npm install
npm test
```

Run the TypeScript task:

```bash
cd typescript-functions/task_01_risk_score_validator
npm install
npm run typecheck
npm test
```

Run the C++ task:

```bash
cd cpp-algorithms/task_01_top_k_frequent
g++ -std=c++17 -O2 test_solutions.cpp -o test_solutions.exe
test_solutions.exe
```

On Unix-like shells, the C++ executable may be run as `./test_solutions`.

## Unified Evaluator

The unified evaluator reads each task's `task.json`, verifies required files, prints task metadata, and runs the configured test command from inside the task directory.

Run these commands from the repository root:

```bash
python evaluator/score_task.py python-data-analysis/task_01_monthly_revenue
python evaluator/score_task.py javascript-functions/task_01_suspicious_refunds
python evaluator/score_task.py typescript-functions/task_01_risk_score_validator
python evaluator/score_task.py react-ui-tasks/task_01_kpi_card
python evaluator/score_task.py cpp-algorithms/task_01_top_k_frequent
```

## Rubric Summary

Each flawed solution is evaluated with a shared 25-point rubric:

| Category | Points |
| --- | ---: |
| Correctness | 0-5 |
| Efficiency | 0-5 |
| Code Quality | 0-5 |
| Edge Cases | 0-5 |
| Explanation / Communication | 0-5 |

Each evaluation also includes severity labels, a bug list, a bug-to-test mapping table, model feedback, and suggested fixes.

## Interview Talking Points

Correct plus flawed plus tests plus evaluation matters because it mirrors real AI code evaluation work: the reviewer needs to know what a good answer looks like, how a plausible model answer can fail, and which tests prove the difference.

This maps directly to AI trainer work because each task includes a prompt, a high-quality reference answer, a flawed model-like answer, automated checks, and written feedback that explains how the model should improve.

The project catches bugs such as incorrect refund math, wrong aggregation levels, threshold equality mistakes, global instead of per-user logic, UI state precedence errors, missing accessibility semantics, incorrect algorithm ranking, and nondeterministic tie handling.

## Roadmap

Near-term additions:

- Add a second Python data-analysis task.
- Add a second TypeScript validation or transformation task.
- Add a second React accessibility-focused task.

Optional later additions:

- Add a SQL/DuckDB task.
- Add GitHub Actions CI.
- Add a Streamlit or React browsing dashboard.
- Add live LLM-generated answer grading.
