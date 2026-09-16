# AI Code Evaluation Lab

AI Code Evaluation Lab is a benchmark-style portfolio project for evaluating AI-generated code and data-analysis solutions. It is designed to show how code can be reviewed, tested, scored, and explained in a repeatable way across multiple programming contexts.

This project is directly aligned with AI Trainer, AI Code Evaluator, and DataAnnotation-style roles, where the work often involves comparing model outputs, identifying subtle correctness issues, writing clear feedback, and judging whether generated code satisfies a task prompt.

## Tracks

- Python data analysis
- JavaScript / TypeScript functions
- React UI tasks
- C++ algorithms

## Repeated Task Pattern

Each task will follow a consistent evaluation workflow:

1. Task prompt
2. Correct solution
3. Flawed AI-style solution
4. Tests
5. Rubric-based written evaluation

This structure makes each task useful as both a coding benchmark and a reviewer artifact.

## Planned Repository Structure

```text
ai-code-evaluation-lab/
├── README.md
├── .gitignore
├── LICENSE
├── requirements.txt
├── data/
├── rubrics/
│   ├── scoring_rubric.md
│   └── evaluation_template.md
├── evaluator/
│   └── score_task.py
├── python-data-analysis/
├── javascript-functions/
├── react-ui-tasks/
└── cpp-algorithms/
```

## MVP Roadmap

1. Project scaffold
2. Python data analysis task
3. JavaScript suspicious refunds task
4. React KPI card task
5. C++ top-k frequent task
6. Unified evaluator helper
7. Final portfolio polish

## Running the Evaluator

Use the unified evaluator helper from the repository root. The helper reads each task's `task.json`, verifies required files, prints the task metadata, and runs the configured test command from inside the task directory.

```bash
python evaluator/score_task.py python-data-analysis/task_01_monthly_revenue
python evaluator/score_task.py javascript-functions/task_01_suspicious_refunds
python evaluator/score_task.py react-ui-tasks/task_01_kpi_card
python evaluator/score_task.py cpp-algorithms/task_01_top_k_frequent
```

## What This Demonstrates

For recruiters and hiring teams, this project demonstrates practical skill in code evaluation, bug identification, test design, rubric-based scoring, and technical communication. It also shows the ability to reason across data analysis, frontend behavior, general-purpose scripting, and algorithmic code.
