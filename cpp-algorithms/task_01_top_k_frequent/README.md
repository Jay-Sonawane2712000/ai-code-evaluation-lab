# Task 01: Top K Frequent Integers

## Objective

Write a C++17 function that returns the `k` most frequent integers from an input vector. The function should be deterministic, efficient, and easy to test.

## Function Signature

```cpp
std::vector<int> topKFrequent(const std::vector<int>& nums, int k);
```

## Input and Output Examples

Example 1:

```text
nums = [1, 1, 1, 2, 2, 3], k = 2
output = [1, 2]
```

Example 2:

```text
nums = [4, 4, 2, 2, 3], k = 2
output = [2, 4]
```

`2` and `4` both appear twice, so the smaller integer comes first.

Example 3:

```text
nums = [-1, -1, -2, -3, -3, -3], k = 2
output = [-3, -1]
```

## Algorithm Rules

1. Count the frequency of each integer.
2. Return the `k` integers with the highest frequency.
3. If `k` is larger than the number of unique integers, return all unique integers.
4. Handle empty input.
5. Handle `k <= 0` by returning an empty vector.
6. Handle negative integers.
7. The solution should be reasonably efficient. `O(n log m)` is acceptable, where `m` is the number of unique values.

## Tie-Breaking Rule

Results must be deterministic:

1. Higher frequency first.
2. For equal frequency, smaller integer first.

## Edge Cases to Consider

- Empty `nums`.
- `k` is `0` or negative.
- `k` is larger than the number of unique integers.
- Multiple integers have the same frequency.
- Input contains negative integers.
- Input contains one unique value repeated many times.

## Expected Deliverables

- A clean C++17 implementation.
- A plausible flawed implementation for evaluator testing.
- A dependency-free C++ test runner that verifies the correct solution and exposes flawed behavior.
- A written evaluation using the shared 25-point rubric.
