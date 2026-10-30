# 2026 AI 芳療活動

活動報名網站以 GitHub Pages 提供，報名資料由 Google Apps Script 寫入 Google 試算表。試算表檔名為 `2026_AI芳療活動`，電話欄以純文字格式保存。

## Apps Script 與 Google Sheet

1. 安裝 Node.js 後執行 `npm install --global @google/clasp`，再執行 `clasp login` 並在瀏覽器完成 Google 授權。
2. 在此資料夾執行 `clasp create --type standalone --title "2026_AI芳療活動"`，依提示選擇 Apps Script 專案位置。
3. 執行 `clasp push` 上傳 `Code.gs` 和 `appsscript.json`。
4. 在 Apps Script 編輯器選取 `setup` 並執行一次，授權後會建立試算表並將第一列設為標題列。執行記錄會顯示試算表網址。
5. 選擇「部署」→「新增部署」→「網頁應用程式」，設定「執行身分」為自己、「誰可以存取」為任何人，然後部署並複製網頁應用程式網址。
6. 將 `site/index.html` 中的 `SCRIPT_URL` 設為該網址，提交這項變更。

重新部署 Apps Script 程式碼時，請管理部署並編輯現有網頁應用程式部署至新版本。

## GitHub Pages

1. 建立名稱為 `2026_AI芳療活動` 的 GitHub repository。`spec/` 已加入 `.gitignore`，不會納入提交。
2. 將目前資料夾初始化為 Git repository，提交網站與 Apps Script 檔案，並推送到 `main` 分支。
3. 在 repository 的 **Settings → Pages** 將建置來源設為 **GitHub Actions**。工作流程會部署 `site/`，不會發布規格或 Apps Script 原始碼。
4. 等待 **Actions** 中的 Pages 工作流程完成，即可從 Pages 設定頁取得網站網址。

## 本機預覽

可直接以瀏覽器開啟 `site/index.html` 檢查版面。尚未設定 `SCRIPT_URL` 前，表單會提示報名服務尚未設定，不會假裝報名成功。

活動日期為 2026 年 11 月 15 日。
