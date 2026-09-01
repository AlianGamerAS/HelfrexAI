#include "NativeBridge.hpp"
#include <sstream>
#include <iostream>

namespace Helfrex {

NativeBridge::NativeBridge(HWND hWnd, Microsoft::WRL::ComPtr<ICoreWebView2> webview)
    : m_hWnd(hWnd), m_webview(webview), m_modelEngine(std::make_unique<ModelEngine>()) {
}

NativeBridge::~NativeBridge() {
}

static std::wstring StringToWString(const std::string& str) {
    if (str.empty()) return L"";
    int sizeNeeded = MultiByteToWideChar(CP_UTF8, 0, &str[0], (int)str.size(), NULL, 0);
    std::wstring wstrTo(sizeNeeded, 0);
    MultiByteToWideChar(CP_UTF8, 0, &str[0], (int)str.size(), &wstrTo[0], sizeNeeded);
    return wstrTo;
}

static std::string WStringToString(const std::wstring& wstr) {
    if (wstr.empty()) return "";
    int sizeNeeded = WideCharToMultiByte(CP_UTF8, 0, &wstr[0], (int)wstr.size(), NULL, 0, NULL, NULL);
    std::string strTo(sizeNeeded, 0);
    WideCharToMultiByte(CP_UTF8, 0, &wstr[0], (int)wstr.size(), &strTo[0], sizeNeeded, NULL, NULL);
    return strTo;
}

void NativeBridge::SendJsonToUI(const std::string& jsonString) {
    if (!m_webview) return;
    std::wstring wjson = StringToWString(jsonString);
    m_webview->PostWebMessageAsJson(wjson.c_str());
}

void NativeBridge::HandleWebMessage(const std::wstring& messageJson) {
    std::string rawJson = WStringToString(messageJson);

    // 1. Hardware detection request
    if (rawJson.find("\"action\":\"GET_HARDWARE\"") != std::string::npos ||
        rawJson.find("\"action\": \"GET_HARDWARE\"") != std::string::npos) {
        SystemHardware hw = HardwareDetector::Detect();
        std::string jsonHw = HardwareDetector::ToJsonString(hw);
        std::string response = "{\"event\":\"HARDWARE_INFO\",\"data\":" + jsonHw + "}";
        SendJsonToUI(response);
    }
    // 2. Open models directory in Windows Explorer
    else if (rawJson.find("\"action\":\"OPEN_MODELS_FOLDER\"") != std::string::npos ||
             rawJson.find("\"action\": \"OPEN_MODELS_FOLDER\"") != std::string::npos) {
        if (m_modelEngine) {
            m_modelEngine->OpenModelsFolder();
        }
    }
    // 3. Start Model Download
    else if (rawJson.find("\"action\":\"START_DOWNLOAD\"") != std::string::npos ||
             rawJson.find("\"action\": \"START_DOWNLOAD\"") != std::string::npos) {
        // Extract modelId
        size_t idPos = rawJson.find("\"modelId\":");
        if (idPos != std::string::npos) {
            size_t start = rawJson.find("\"", idPos + 10);
            size_t end = rawJson.find("\"", start + 1);
            if (start != std::string::npos && end != std::string::npos) {
                std::string modelId = rawJson.substr(start + 1, end - start - 1);
                m_modelEngine->StartDownload(modelId, L"https://huggingface.co/models", [this](const std::string& id, int progress, bool completed, bool failed) {
                    std::ostringstream ss;
                    ss << "{\"event\":\"DOWNLOAD_PROGRESS\",\"modelId\":\"" << id << "\",\"progress\":" << progress << ",\"completed\":" << (completed ? "true" : "false") << ",\"failed\":" << (failed ? "true" : "false") << "}";
                    SendJsonToUI(ss.str());
                });
            }
        }
    }
}

} // namespace Helfrex
