# AdMatch - 廣告媒合平台

一個連接廣告主與媒體主的現代化平台，讓廣告投放變得更簡單有效。

## 🚀 功能特色

- **雙角色系統**: 支援廣告主和媒體主兩種用戶角色
- **廣告位管理**: 媒體主可以輕鬆上架和管理廣告位
- **需求發布**: 廣告主可以發布廣告需求，讓媒體主主動接洽
- **即時訊息**: 內建訊息系統，方便雙方溝通
- **智能搜尋**: 支援關鍵字、類別、地區等多維度搜尋
- **數據統計**: 提供詳細的數據分析和統計

## 🛠️ 技術棧

- **前端**: Next.js 15, React 19, TypeScript, SCSS
- **後端**: Next.js API Routes, Node.js
- **資料庫**: SQLite (開發) / PostgreSQL (生產)
- **認證**: JWT + bcrypt
- **部署**: Vercel

## 🎯 測試帳號

### 📱 廣告主帳號
- Email: `advertiser@test.com`
- 密碼: `advertiser123`
- 名稱: 小明科技

### 📺 媒體主帳號
- Email: `publisher@test.com`
- 密碼: `publisher123`
- 名稱: 小華媒體

## 🏃‍♂️ 快速開始

1. **安裝依賴**
```bash
npm install
```

2. **啟動開發服務器**
```bash
npm run dev
```

3. **初始化資料庫**
```bash
# 訪問 http://localhost:3000/api/init
# 然後訪問 http://localhost:3000/api/seed
```

4. **開始使用**
   - 前往 http://localhost:3000
   - 使用測試帳號登入體驗

## 📚 專案結構

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   ├── components/        # 共用組件
│   ├── dashboard/         # 儀表板頁面
│   ├── listings/          # 廣告位相關頁面
│   ├── messages/          # 訊息中心
│   └── ...
├── styles/                # SCSS 樣式
│   ├── variables.scss     # 全域變數
│   └── global.scss        # 全域樣式
└── lib/                   # 工具函數
    ├── auth.ts            # 認證相關
    ├── db.ts              # 資料庫連接
    └── db-adapter.ts      # 資料庫適配器
```

## 🚀 部署到 Vercel

詳細的部署說明請參考 [DEPLOYMENT.md](./DEPLOYMENT.md)

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

# 建置專案
npm run build

# 啟動生產服務器
npm start

# 代碼檢查
npm run lint
```

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

## 📄 授權

MIT License