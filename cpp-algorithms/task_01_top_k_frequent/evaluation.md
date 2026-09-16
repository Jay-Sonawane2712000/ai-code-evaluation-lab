# Evaluation: Task 01 Top K Frequent Integers

## Task Summary

The task asks for a C++17 function that returns the top `k` most frequent integers from an input vector. The required behavior includes counting integer frequencies, ordering by frequency descending, applying a deterministic tie-break by smaller integer first, returning all unique integers when `k` is too large, and handling empty input, nonpositive `k`, and negative numbers.

## Submitted Solution Reviewed

`flawed_solution.cpp` was reviewed. The solution counts integer frequencies and returns a vector of selected values. The implementation is compact and plausible, but it sorts by numeric value rather than by frequency and mishandles cases where `k` exceeds the number of unique values.

## Verdict

Partially correct, but not acceptable for the task. The code performs frequency counting, but its selection logic does not implement the central ranking requirement. It also pads the result with zeroes when `k` is larger than the number of unique integers, which violates the output contract and can introduce values that were never present in the input.

## Rubric Score Table

| Category | Score | Notes |
| --- | ---: | --- |
| Correctness | 2/5 | Counts frequencies but sorts by value, mishandles oversized `k`, and uses the wrong tie behavior. |
| Efficiency | 4/5 | Uses hashing and sorting, which would be efficient enough if the comparator and output size logic were correct. |
| Code Quality | 3/5 | The code is readable, but the comparator is misleading and the padding behavior is not justified. |
| Edge Cases | 2/5 | Handles empty input and `k <= 0`, but fails oversized `k` and deterministic tie cases. |
| Explanation / Communication | 2/5 | The implementation does not clarify tie behavior or the intended behavior when `k` exceeds unique count. |
| Total | 13/25 | Structurally plausible but materially incorrect on core algorithm requirements. |

## Bugs Found

- BUG-001, Critical issue: The comparator sorts primarily by integer value instead of frequency, so the returned values are not necessarily the most frequent.
- BUG-002, Major issue: When `k` is larger than the number of unique integers, the solution pads the result with `0` instead of returning only unique input values.
- BUG-003, Major issue: Tie handling is incorrect. Equal-frequency values should be ordered smaller integer first, but the flawed solution prefers larger values because it sorts by value descending.

## Bug-to-Test Mapping Table

| Bug ID | Bug Description | Test Name | Input / Scenario | Expected Behavior | Actual Flawed Behavior |
| --- | --- | --- | --- | --- | --- |
| BUG-001 | Sorts by numeric value instead of frequency. | `flawed_sorts_by_value_instead_of_frequency` | `nums = {9, 1, 1, 2, 2, 2}`, `k = 2`. | Return `{2, 1}` because `2` appears 3 times and `1` appears 2 times. | Returns `{9, 2}` because larger numeric values are prioritized. |
| BUG-002 | Pads output when `k` exceeds unique count. | `flawed_fails_when_k_exceeds_unique_count` | `nums = {5, 5, 6}`, `k = 4`. | Return `{5, 6}` only. | Returns `{6, 5, 0, 0}`, adding values that were not valid results. |
| BUG-003 | Uses incorrect tie handling. | `flawed_has_wrong_tie_behavior` | `nums = {4, 4, 2, 2}`, `k = 2`. | Return `{2, 4}` because both appear twice and `2` is smaller. | Returns `{4, 2}`, preferring the larger value. |

## Edge Cases Considered

- Empty input should return an empty vector.
- `k <= 0` should return an empty vector.
- `k` larger than the number of unique values should return all unique values only.
- Negative integers should be counted and ranked normally.
- Equal-frequency values require deterministic smaller-value-first ordering.
- Inputs with one high numeric value but low frequency should still rank by frequency, not by value.

## Feedback to the AI Model

The implementation has the right broad outline, but the comparator does not match the prompt. In ranking problems, the sort criteria are the core of the solution and should be translated directly from the requirements: frequency descending first, value ascending second. Also avoid padding result vectors unless the prompt explicitly asks for fixed-length output.

## Suggested Fixes

- Store `(value, frequency)` pairs and sort by frequency descending.
- Add a tie-breaker that sorts equal frequencies by value ascending.
- Limit the number of returned values to `min(k, unique_count)`.
- Do not insert placeholder values such as `0`.
- Keep tests for oversized `k`, tie cases, and negative integers.

## Final Notes

This flawed solution is useful for evaluator training because it appears interview-like and uses common containers, yet it fails the most important ranking rule. A strong review should catch that the comparator is optimizing the wrong criterion.
