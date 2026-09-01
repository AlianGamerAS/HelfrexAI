#include <windows.h>
#include <wrl.h>
#include <dwmapi.h>
#include <shlwapi.h>
#include <string>
#include <memory>
#include "WebView2.h"
#include "NativeBridge.hpp"
#include "HardwareDetector.hpp"

#pragma comment(lib, "dwmapi.lib")
#pragma comment(lib, "shlwapi.lib")

using namespace Microsoft::WRL;

// Global State
HINSTANCE g_hInstance = NULL;
HWND g_hWnd = NULL;
ComPtr<ICoreWebView2Controller> g_webviewController;
ComPtr<ICoreWebView2> g_webviewWindow;
std::unique_ptr<Helfrex::NativeBridge> g_bridge;

const WCHAR* CLASS_NAME = L"HelfrexAI_WindowClass";
const WCHAR* WINDOW_TITLE = L"HelfrexAI - Yerel Yapay Zeka Stüdyosu";

LRESULT CALLBACK WndProc(HWND hWnd, UINT message, WPARAM wParam, LPARAM lParam) {
    switch (message) {
    case WM_SIZE:
        if (g_webviewController != nullptr) {
            RECT bounds;
            GetClientRect(hWnd, &bounds);
            g_webviewController->put_Bounds(bounds);
        }
        break;

    case WM_DESTROY:
        PostQuitMessage(0);
        break;

    default:
        return DefWindowProcW(hWnd, message, wParam, lParam);
    }
    return 0;
}

void InitializeWebView(HWND hWnd) {
    // Determine the local web assets directory
    WCHAR currentPath[MAX_PATH];
    GetModuleFileNameW(NULL, currentPath, MAX_PATH);
    PathRemoveFileSpecW(currentPath);

    std::wstring localHtmlPath = std::wstring(currentPath) + L"\\ui\\index.html";
    
    // User data folder under %LOCALAPPDATA%\HelfrexAI\WebView2
    WCHAR appData[MAX_PATH];
    SHGetFolderPathW(NULL, CSIDL_LOCAL_APPDATA, NULL, 0, appData);
    std::wstring userDataFolder = std::wstring(appData) + L"\\HelfrexAI\\WebView2Cache";

    CreateCoreWebView2EnvironmentWithOptions(
        nullptr,
        userDataFolder.c_str(),
        nullptr,
        Callback<ICoreWebView2CreateCoreWebView2EnvironmentCompletedHandler>(
            [hWnd, localHtmlPath](HRESULT result, ICoreWebView2Environment* env) -> HRESULT {
                if (FAILED(result) || !env) return result;

                env->CreateCoreWebView2Controller(
                    hWnd,
                    Callback<ICoreWebView2CreateCoreWebView2ControllerCompletedHandler>(
                        [hWnd, localHtmlPath](HRESULT result, ICoreWebView2Controller* controller) -> HRESULT {
                            if (FAILED(result) || !controller) return result;

                            g_webviewController = controller;
                            g_webviewController->get_CoreWebView2(&g_webviewWindow);

                            // Configure UI bounds
                            RECT bounds;
                            GetClientRect(hWnd, &bounds);
                            g_webviewController->put_Bounds(bounds);

                            // Disable default browser context menus and accelerators for native app feel
                            ComPtr<ICoreWebView2Settings> settings;
                            g_webviewWindow->get_Settings(&settings);
                            if (settings) {
                                settings->put_IsScriptEnabled(TRUE);
                                settings->put_AreDefaultScriptDialogsEnabled(TRUE);
                                settings->put_IsWebMessageEnabled(TRUE);
                                settings->put_AreDevToolsEnabled(TRUE);
                                settings->put_IsStatusBarEnabled(FALSE);
                            }

                            // Initialize C++ <-> JavaScript Native Bridge
                            g_bridge = std::make_unique<Helfrex::NativeBridge>(hWnd, g_webviewWindow);

                            // Listen for messages from UI
                            EventRegistrationToken token;
                            g_webviewWindow->add_WebMessageReceived(
                                Callback<ICoreWebView2WebMessageReceivedEventHandler>(
                                    [](ICoreWebView2* sender, ICoreWebView2WebMessageReceivedEventArgs* args) -> HRESULT {
                                        LPWSTR message;
                                        args->TryGetWebMessageAsString(&message);
                                        if (message && g_bridge) {
                                            g_bridge->HandleWebMessage(message);
                                            CoTaskMemFree(message);
                                        }
                                        return S_OK;
                                    }).Get(),
                                &token);

                            // Load UI (If local dist/index.html exists, navigate to it, otherwise dev preview URL)
                            if (PathFileExistsW(localHtmlPath.c_str())) {
                                g_webviewWindow->Navigate(localHtmlPath.c_str());
                            } else {
                                g_webviewWindow->Navigate(L"http://localhost:3000");
                            }

                            return S_OK;
                        }).Get());
                return S_OK;
            }).Get());
}

int WINAPI wWinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, PWSTR pCmdLine, int nCmdShow) {
    g_hInstance = hInstance;

    // Enable Per-Monitor High DPI awareness
    SetProcessDpiAwarenessContext(DPI_AWARENESS_CONTEXT_PER_MONITOR_AWARE_V2);

    // Register Win32 Window Class
    WNDCLASSEXW wcex = {};
    wcex.cbSize = sizeof(WNDCLASSEXW);
    wcex.style = CS_HREDRAW | CS_VREDRAW;
    wcex.lpfnWndProc = WndProc;
    wcex.hInstance = hInstance;
    wcex.hCursor = LoadCursor(NULL, IDC_ARROW);
    wcex.hbrBackground = (HBRUSH)GetStockObject(BLACK_BRUSH);
    wcex.lpszClassName = CLASS_NAME;

    RegisterClassExW(&wcex);

    // Window dimensions (1360 x 860)
    int windowWidth = 1360;
    int windowHeight = 860;
    int screenWidth = GetSystemMetrics(SM_CXSCREEN);
    int screenHeight = GetSystemMetrics(SM_CYSCREEN);
    int posX = (screenWidth - windowWidth) / 2;
    int posY = (screenHeight - windowHeight) / 2;

    HWND hWnd = CreateWindowExW(
        0,
        CLASS_NAME,
        WINDOW_TITLE,
        WS_OVERLAPPEDWINDOW,
        posX, posY, windowWidth, windowHeight,
        NULL, NULL, hInstance, NULL);

    if (!hWnd) return FALSE;
    g_hWnd = hWnd;

    // Enable Windows 10/11 Immersive Dark Titlebar
    BOOL darkMode = TRUE;
    DwmSetWindowAttribute(hWnd, DWMWA_USE_IMMERSIVE_DARK_MODE, &darkMode, sizeof(darkMode));

    ShowWindow(hWnd, nCmdShow);
    UpdateWindow(hWnd);

    // Initialize WebView2 Runtime
    InitializeWebView(hWnd);

    // Main Win32 Event Loop
    MSG msg;
    while (GetMessageW(&msg, NULL, 0, 0)) {
        TranslateMessage(&msg);
        DispatchMessageW(&msg);
    }

    return (int)msg.wParam;
}
