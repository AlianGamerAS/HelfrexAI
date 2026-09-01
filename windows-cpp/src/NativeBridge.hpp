#pragma once
#include <windows.h>
#include <wrl.h>
#include <string>
#include <memory>
#include "WebView2.h"
#include "HardwareDetector.hpp"
#include "ModelEngine.hpp"

namespace Helfrex {

class NativeBridge {
public:
    NativeBridge(HWND hWnd, Microsoft::WRL::ComPtr<ICoreWebView2> webview);
    ~NativeBridge();

    void HandleWebMessage(const std::wstring& messageJson);
    void SendJsonToUI(const std::string& jsonString);

private:
    HWND m_hWnd;
    Microsoft::WRL::ComPtr<ICoreWebView2> m_webview;
    std::unique_ptr<ModelEngine> m_modelEngine;
};

} // namespace Helfrex
