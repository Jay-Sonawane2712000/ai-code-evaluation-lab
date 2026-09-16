#include <algorithm>
#include <unordered_map>
#include <utility>
#include <vector>

namespace correct {

std::vector<int> topKFrequent(const std::vector<int>& nums, int k) {
    if (k <= 0 || nums.empty()) {
        return {};
    }

    std::unordered_map<int, int> frequencies;
    for (int value : nums) {
        frequencies[value]++;
    }

    std::vector<std::pair<int, int>> entries;
    entries.reserve(frequencies.size());
    for (const auto& item : frequencies) {
        entries.push_back({item.first, item.second});
    }

    std::sort(entries.begin(), entries.end(), [](const auto& left, const auto& right) {
        if (left.second != right.second) {
            return left.second > right.second;
        }
        return left.first < right.first;
    });

    const int limit = std::min<int>(k, entries.size());
    std::vector<int> result;
    result.reserve(limit);
    for (int i = 0; i < limit; ++i) {
        result.push_back(entries[i].first);
    }

    return result;
}

}  // namespace correct
