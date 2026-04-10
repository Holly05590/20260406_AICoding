# 質感與功能兼具的純前端待辦清單 (Todo List) 計畫

這份計畫旨在為您打造一個輕量、無需後端與框架，但外觀極具現代感且功能完整的待辦清單系統。

## 核心功能目標

1. **純粹前端 (No Frameworks)**: 使用原生的 HTML5, Vanilla JavaScript, 以及包含精緻動畫的 CSS3 進行開發，確保專案極度輕量、載入快速且無過多依賴。
2. **資料持久化 (Persistence)**: 利用瀏覽端 `localStorage` 保存待辦清單資料，因此即便重新整理或下次開啟網頁，先前的任務與狀態皆會保留。
3. **時間與日期管理 (Date & Time)**: 除了輸入任務名稱，新增時亦可挑選特定的提醒/預定執行時間 (Date & Time Picker)。
4. **行事曆整合 (Calendar Integration)**: 每筆任務提供「加入行事曆」按鈕，點擊後會自動產生並將任務跳轉加入至使用者的 Google Calendar。
5. **頂級質感設計 (Premium Design)**: 完全遵照現代 UI/UX 設計標準 (Modern Web Design)，包含玻璃擬物化 (Glassmorphism) 特效、平滑的漸變背景、深色/淺色和諧配色，與精細的微動畫 (Micro-animations)，為使用者帶來 WOW 的驚艷體驗。

## User Review Required

> [!IMPORTANT]
> **視覺與功能細節確認**
> 1. **深色模式 (Dark/Light Theme)**：目前計畫以預設現代深色調 (如深邃藍、紫漸層結合玻璃特效) 為基準，您希望有特別指定的色系或是要有切換亮/暗主題的功能嗎？
> 2. **行事曆預設 (Calendar Type)**：預計採用最通用的 Google Calendar URL 跳轉，這能滿足您的需求，還是需要支援下載通用 `.ics` 行事曆檔案 (給 Apple Calendar / Outlook 使用) 呢？

## Proposed Changes

這是一個全新的專案，因此大部分皆為新增的檔案。模組化的結構讓維護更輕鬆。

---

### Core Files

#### [NEW] [index.html](file:///c:/YACHI_DATA/AI_Design/20260406_AICoding/index.html)
整個 SPA (Single Page Application) 的主架構，使用語意化標籤，包含：
- 優美的標題區塊與動態背景設定。
- 任務輸入區(文字輸入框、日期時間選取器以及新增按鈕)。
- 任務清單顯示區塊(Pending Tasks & Completed Tasks 分切)。

#### [NEW] [styles.css](file:///c:/YACHI_DATA/AI_Design/20260406_AICoding/styles.css)
核心樣式檔，負責打造極致的視覺盛宴：
- **Design Tokens**: 定義統一色彩變數，如背景漸變、卡片內陰影與玻璃霧面透明度變數。
- **Animations**: 設計滑入 (Slide-in)、任務完成劃掉與淡出 (Fade-out)、按鈕 Hover 光暈與點擊反饋。
- **Layout**: RWD 響應式佈局，並優化在各種螢幕大小的卡片式設計體驗。

#### [NEW] [app.js](file:///c:/YACHI_DATA/AI_Design/20260406_AICoding/app.js)
核心邏輯檔，負責 DOM 操作與狀態管理：
- ** State Management**: 負責載入與寫入 `localStorage` 的邏輯。
- ** Event Handlers**: 綁定新增、刪除、切換勾選狀態的事件。
- ** Calendar Helper**: 封裝專屬的 Google Schema URL Builder 機制，根據使用者選的時間字串自動轉換相應的 UTC 日期格式並開啟新分頁以新增行事曆。

## Open Questions

請在上方回覆您的確認事項，若沒有其他額外需求，批准此計畫後，我就會立即開始執行程式碼的撰寫！

## Verification Plan

### Manual Verification
1. 開啟首頁，確認優美的漸變背景或玻璃特效有正確渲染，且切換順暢。
2. 新增多筆待辦任務（包含設定特定的日期與時間）。
3. 關閉瀏覽器或重新整理，再次開啟時確認所有未完成與已完成待辦事項仍被保留。
4. 點選任一待辦事項旁的「加入行事曆」按鈕，確認是否能順利開啟 Google Calendar 的新增事件畫面，且標題與時間等欄位均預先填寫正確。
