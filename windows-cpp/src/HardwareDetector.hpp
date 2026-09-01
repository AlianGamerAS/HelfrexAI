#pragma once
#include <string>
#include <vector>
#include <cstdint>

namespace Helfrex {

struct GpuInfo {
    std::wstring name;
    uint64_t dedicatedVramBytes{ 0 };
    uint64_t sharedSystemMemoryBytes{ 0 };
    uint32_t vramGB{ 0 };
};

struct SystemHardware {
    uint64_t totalRamBytes{ 0 };
    uint64_t availableRamBytes{ 0 };
    uint32_t ramTotalGB{ 0 };
    uint32_t ramAvailableGB{ 0 };
    std::vector<GpuInfo> gpus;
    uint32_t primaryVramGB{ 0 };
    std::wstring primaryGpuName;
};

class HardwareDetector {
public:
    static SystemHardware Detect();
    static std::string ToJsonString(const SystemHardware& hw);
};

} // namespace Helfrex
