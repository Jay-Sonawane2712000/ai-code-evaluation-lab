#include <algorithm>
#include <unordered_map>
#include <utility>
#include <vector>

namespace flawed {

std::vector<int> topKFrequent(const std::vector<int>& nums, int k) {
    if (k <= 0 || nums.empty()) {
        return {};
    }

    std::unordered_map<int, int> frequencies;
    for (int value : nums) {
        frequencies[value]++;
    }

    std::vector<std::pair<int, int>> entries;
    for (const auto& item : frequencies) {
        entries.push_back({item.first, item.second});
    }

    std::sort(entries.begin(), entries.end(), [](const auto& left, const auto& right) {
        if (left.first != right.first) {
            return left.first > right.first;
        }
        return left.second > right.second;
    });

    std::vector<int> result;
    for (int i = 0; i < k; ++i) {
        if (i < static_cast<int>(entries.size())) {
            result.push_back(entries[i].first);
        } else {
            result.push_back(0);
        }
    }

    return result;
}

}  // namespace flawed
