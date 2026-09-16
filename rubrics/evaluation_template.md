# Evaluation Template

Use this template for each task-level `evaluation.md`. Keep the evaluation specific to the submitted flawed solution and connect every major bug to an executable test when possible.

## Task Summary

Summarize the task prompt, expected behavior, business or algorithm rules, and relevant constraints.

## Submitted Solution Reviewed

Identify the submitted solution being evaluated and briefly summarize its approach.

## Verdict

State whether the solution is correct, partially correct, or incorrect. Include a concise rationale.

## Rubric Score Table

| Category | Score | Notes |
| --- | ---: | --- |
| Correctness | _/5 |  |
| Efficiency | _/5 |  |
| Code Quality | _/5 |  |
| Edge Cases | _/5 |  |
| Explanation / Communication | _/5 |  |
| Total | _/25 |  |

## Bugs Found

List each bug with an ID, severity, location if useful, and a clear explanation of the impact.

## Bug-to-Test Mapping Table

| Bug ID | Bug Description | Test Name | Input / Scenario | Expected Behavior | Actual Flawed Behavior |
| --- | --- | --- | --- | --- | --- |
| BUG-001 | Short description of the bug. | `test_name` | Minimal scenario that exposes it. | Correct expected behavior. | Observed flawed behavior. |

## Edge Cases Considered

List the edge cases reviewed and note whether the submitted solution handles them correctly.

## Feedback to the AI Model

Provide direct, actionable feedback that would help the model improve the solution.

## Suggested Fixes

Describe the changes needed to correct the solution. Keep the suggestions concrete and tied to the bugs above.

## Final Notes

Add any closing observations, assumptions, or limitations of the evaluation.
