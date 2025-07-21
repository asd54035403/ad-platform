# AdMatch - 廣告媒合平台

一個連接廣告主與媒體主的現代化前端平台，讓廣告投放變得更簡單有效。

## 🚀 功能特色

- **雙角色系統**: 支援廣告主和媒體主兩種用戶角色
- **廣告位管理**: 媒體主可以輕鬆上架和管理廣告位
- **需求發布**: 廣告主可以發布廣告需求，讓媒體主主動接洽
- **即時訊息**: 內建訊息系統，方便雙方溝通
- **智能搜尋**: 支援關鍵字、類別、地區等多維度搜尋
- **本地儲存**: 使用 localStorage 持久化數據

## 🛠️ 技術棧

- **框架**: Next.js 15 (靜態導出)
- **前端**: React 19, TypeScript, SCSS
- **數據**: Mock數據 + localStorage
- **部署**: Vercel (零配置)

## 🎯 預設帳號

### 📱 廣告主
- Email: `advertiser@example.com`
- 名稱: 創新科技公司

### 📺 媒體主
- Email: `publisher@example.com`
- 名稱: 小明出版社

## 🏃‍♂️ 快速開始

1. **安裝依賴**
```bash
npm install
```

2. **啟動開發服務器**
```bash
npm run dev
```

3. **開始使用**
   - 前往 http://localhost:3000
   - 首次訪問會自動初始化mock數據
   - 使用預設帳號登入體驗

## 📚 專案結構

```
src/
├── app/                    # Next.js App Router
│   ├── components/        # 共用組件
│   ├── dashboard/         # 儀表板頁面
│   ├── listings/          # 廣告位相關頁面
│   ├── messages/          # 訊息中心
│   └── ...
├── lib/                   # 工具函數
│   ├── mockData.ts        # Mock數據定義
│   └── localStorage.ts    # 本地儲存工具
└── styles/                # SCSS 樣式
    ├── variables.scss     # 全域變數
    └── global.scss        # 全域樣式
```

## 🚀 部署

項目已配置為靜態導出，可直接部署到 Vercel：

1. Push 代碼到 GitHub
2. 在 Vercel 導入項目
3. 零配置自動部署完成

## 🎨 主要頁面

- **首頁**: 平台介紹和快速註冊
- **儀表板**: 用戶控制台，顯示統計數據
- **廣告位列表**: 瀏覽所有可用的廣告位
- **發布需求**: 廣告主發布廣告需求
- **訊息中心**: 用戶間溝通交流
- **個人管理**: 管理個人廣告位或需求

## 🔧 開發指令

```bash
# 開發模式
npm run dev

# 建置專案 (靜態導出)
npm run build

# 代碼檢查
npm run lint
```

## 💾 數據說明

- 所有數據存儲在瀏覽器 localStorage 中
- 首次訪問自動初始化示例數據
- 數據在瀏覽器間不共享 (純前端演示)
- 清除瀏覽器數據將重置所有內容

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

## 📄 授權

MIT License