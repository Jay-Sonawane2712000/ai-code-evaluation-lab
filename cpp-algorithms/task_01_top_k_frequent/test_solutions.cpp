#include <iostream>
#include <sstream>
#include <string>
#include <vector>

#include "correct_solution.cpp"
#include "flawed_solution.cpp"

namespace {

int failures = 0;

std::string vectorToString(const std::vector<int>& values) {
    std::ostringstream output;
    output << "[";
    for (std::size_t i = 0; i < values.size(); ++i) {
        if (i > 0) {
            output << ", ";
        }
        output << values[i];
    }
    output << "]";
    return output.str();
}

void expectEqual(
    const std::string& testName,
    const std::vector<int>& actual,
    const std::vector<int>& expected
) {
    if (actual == expected) {
        std::cout << "PASS " << testName << "\n";
        return;
    }

    failures++;
    std::cout << "FAIL " << testName << "\n";
    std::cout << "  expected: " << vectorToString(expected) << "\n";
    std::cout << "  actual:   " << vectorToString(actual) << "\n";
}

void expectNotEqual(
    const std::string& testName,
    const std::vector<int>& actual,
    const std::vector<int>& notExpected
) {
    if (actual != notExpected) {
        std::cout << "PASS " << testName << "\n";
        return;
    }

    failures++;
    std::cout << "FAIL " << testName << "\n";
    std::cout << "  did not expect: " << vectorToString(notExpected) << "\n";
}

void correct_returns_top_k_by_frequency() {
    expectEqual(
        "correct_returns_top_k_by_frequency",
        correct::topKFrequent({1, 1, 1, 2, 2, 3}, 2),
        {1, 2}
    );
}

void correct_uses_smaller_value_for_ties() {
    expectEqual(
        "correct_uses_smaller_value_for_ties",
        correct::topKFrequent({4, 4, 2, 2, 3}, 2),
        {2, 4}
    );
}

void correct_handles_k_larger_than_unique_count() {
    expectEqual(
        "correct_handles_k_larger_than_unique_count",
        correct::topKFrequent({5, 5, 6}, 5),
        {5, 6}
    );
}

void correct_handles_empty_input() {
    expectEqual(
        "correct_handles_empty_input",
        correct::topKFrequent({}, 3),
        {}
    );
}

void correct_handles_k_zero() {
    expectEqual(
        "correct_handles_k_zero",
        correct::topKFrequent({1, 1, 2}, 0),
        {}
    );
}

void correct_handles_negative_numbers() {
    expectEqual(
        "correct_handles_negative_numbers",
        correct::topKFrequent({-1, -1, -2, -3, -3, -3}, 2),
        {-3, -1}
    );
}

void flawed_sorts_by_value_instead_of_frequency() {
    const std::vector<int> nums = {9, 1, 1, 2, 2, 2};
    const std::vector<int> expected = {2, 1};
    const auto actual = flawed::topKFrequent(nums, 2);

    expectNotEqual("flawed_sorts_by_value_instead_of_frequency", actual, expected);
    expectEqual("flawed_sorts_by_value_instead_of_frequency_actual", actual, {9, 2});
}

void flawed_fails_when_k_exceeds_unique_count() {
    const std::vector<int> nums = {5, 5, 6};
    const std::vector<int> expected = {5, 6};
    const auto actual = flawed::topKFrequent(nums, 4);

    expectNotEqual("flawed_fails_when_k_exceeds_unique_count", actual, expected);
    expectEqual("flawed_fails_when_k_exceeds_unique_count_actual", actual, {6, 5, 0, 0});
}

void flawed_has_wrong_tie_behavior() {
    const std::vector<int> nums = {4, 4, 2, 2};
    const std::vector<int> expected = {2, 4};
    const auto actual = flawed::topKFrequent(nums, 2);

    expectNotEqual("flawed_has_wrong_tie_behavior", actual, expected);
    expectEqual("flawed_has_wrong_tie_behavior_actual", actual, {4, 2});
}

}  // namespace

int main() {
    correct_returns_top_k_by_frequency();
    correct_uses_smaller_value_for_ties();
    correct_handles_k_larger_than_unique_count();
    correct_handles_empty_input();
    correct_handles_k_zero();
    correct_handles_negative_numbers();
    flawed_sorts_by_value_instead_of_frequency();
    flawed_fails_when_k_exceeds_unique_count();
    flawed_has_wrong_tie_behavior();

    if (failures > 0) {
        std::cout << failures << " test assertion(s) failed.\n";
        return 1;
    }

    std::cout << "All C++ top-k frequency tests passed.\n";
    return 0;
}
