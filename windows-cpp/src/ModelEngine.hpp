#pragma once
#include <string>
#include <vector>
#include <functional>
#include <atomic>
#include <memory>
#include <thread>
#include <map>

namespace Helfrex {

struct DownloadTask {
    std::string modelId;
    std::wstring url;
    std::wstring destPath;
    std::atomic<bool> isCancelled{ false };
    std::atomic<int> progressPercent{ 0 };
    std::atomic<uint64_t> bytesDownloaded{ 0 };
    std::atomic<uint64_t> totalBytes{ 0 };
};

using ProgressCallback = std::function<void(const std::string& modelId, int progress, bool completed, bool failed)>;

class ModelEngine {
public:
    ModelEngine();
    ~ModelEngine();

    std::wstring GetModelsDirectory() const;
    bool IsModelDownloaded(const std::string& modelId) const;
    void StartDownload(const std::string& modelId, const std::wstring& downloadUrl, ProgressCallback callback);
    void CancelDownload(const std::string& modelId);
    void OpenModelsFolder();

    // Local model runner integration (llama.cpp / diffusion server)
    bool LaunchLocalInference(const std::string& modelId, int allocatedRamGB, int allocatedVramGB);
    void StopLocalInference();

private:
    std::wstring m_modelsDir;
    std::map<std::string, std::shared_ptr<DownloadTask>> m_activeTasks;
};

} // namespace Helfrex
