#include "HardwareDetector.hpp"
#include <windows.h>
#include <dxgi.h>
#include <d3d11.h>
#include <sstream>
#include <iomanip>

#pragma comment(lib, "dxgi.lib")
#pragma comment(lib, "d3d11.lib")

namespace Helfrex {

SystemHardware HardwareDetector::Detect() {
    SystemHardware hw{};

    // 1. Detect System RAM
    MEMORYSTATUSEX memStatus;
    memStatus.dwLength = sizeof(MEMORYSTATUSEX);
    if (GlobalMemoryStatusEx(&memStatus)) {
        hw.totalRamBytes = memStatus.ullTotalPhys;
        hw.availableRamBytes = memStatus.ullAvailPhys;
        hw.ramTotalGB = static_cast<uint32_t>((hw.totalRamBytes + (1024ULL * 1024ULL * 512ULL)) / (1024ULL * 1024ULL * 1024ULL));
        hw.ramAvailableGB = static_cast<uint32_t>((hw.availableRamBytes + (1024ULL * 1024ULL * 512ULL)) / (1024ULL * 1024ULL * 1024ULL));
    }

    // 2. Detect GPU & VRAM via DXGI
    IDXGIFactory* pFactory = nullptr;
    if (SUCCEEDED(CreateDXGIFactory(__uuidof(IDXGIFactory), (void**)&pFactory)) && pFactory) {
        IDXGIAdapter* pAdapter = nullptr;
        UINT i = 0;
        while (pFactory->EnumAdapters(i, &pAdapter) != DXGI_ERROR_NOT_FOUND) {
            DXGI_ADAPTER_DESC desc;
            if (SUCCEEDED(pAdapter->GetDesc(&desc))) {
                // Skip Microsoft Basic Render Driver software adapters
                if (desc.VendorId != 0x1414) {
                    GpuInfo gpu{};
                    gpu.name = desc.Description;
                    gpu.dedicatedVramBytes = desc.DedicatedVideoMemory;
                    gpu.sharedSystemMemoryBytes = desc.SharedSystemMemory;
                    gpu.vramGB = static_cast<uint32_t>((desc.DedicatedVideoMemory + (1024ULL * 1024ULL * 512ULL)) / (1024ULL * 1024ULL * 1024ULL));

                    hw.gpus.push_back(gpu);

                    if (gpu.dedicatedVramBytes > 0 && hw.primaryGpuName.empty()) {
                        hw.primaryGpuName = gpu.name;
                        hw.primaryVramGB = gpu.vramGB;
                    }
                }
            }
            pAdapter->Release();
            i++;
        }
        pFactory->Release();
    }

    // Fallback if primary GPU has integrated graphics
    if (hw.primaryGpuName.empty() && !hw.gpus.empty()) {
        hw.primaryGpuName = hw.gpus[0].name;
        hw.primaryVramGB = hw.gpus[0].vramGB;
    } else if (hw.primaryGpuName.empty()) {
        hw.primaryGpuName = L"Integrated Graphics (CPU RAM Fallback)";
        hw.primaryVramGB = 0;
    }

    return hw;
}

static std::string WStringToString(const std::wstring& wstr) {
    if (wstr.empty()) return "";
    int sizeNeeded = WideCharToMultiByte(CP_UTF8, 0, &wstr[0], (int)wstr.size(), NULL, 0, NULL, NULL);
    std::string strTo(sizeNeeded, 0);
    WideCharToMultiByte(CP_UTF8, 0, &wstr[0], (int)wstr.size(), &strTo[0], sizeNeeded, NULL, NULL);
    return strTo;
}

std::string HardwareDetector::ToJsonString(const SystemHardware& hw) {
    std::ostringstream ss;
    ss << "{\n";
    ss << "  \"totalRamGB\": " << hw.ramTotalGB << ",\n";
    ss << "  \"availableRamGB\": " << hw.ramAvailableGB << ",\n";
    ss << "  \"primaryVramGB\": " << hw.primaryVramGB << ",\n";
    ss << "  \"primaryGpuName\": \"" << WStringToString(hw.primaryGpuName) << "\",\n";
    ss << "  \"gpus\": [\n";
    for (size_t i = 0; i < hw.gpus.size(); ++i) {
        ss << "    {\n";
        ss << "      \"name\": \"" << WStringToString(hw.gpus[i].name) << "\",\n";
        ss << "      \"vramGB\": " << hw.gpus[i].vramGB << "\n";
        ss << "    }" << (i + 1 < hw.gpus.size() ? "," : "") << "\n";
    }
    ss << "  ]\n";
    ss << "}";
    return ss.str();
}

} // namespace Helfrex
