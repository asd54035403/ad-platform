# AdMatch — 廣告媒合平台 規劃文件

##  專案概念簡介

AdMatch 是一個媒合「廣告主」與「可提供廣告位的使用者」的網路平台。  
靈感類似於 Airbnb — 不出租房，而是出租自己的 **廣告空間**（如：IG、YouTube 頻道、網站、餐廳店面、戶外看板等）。

### 用戶角色

- **廣告主 (Advertiser)**：有廣告要投放，尋找合適的曝光平台。
- **媒體主 (Publisher)**：有可供廣告投放的資源，願意提供空間換取收益。

---

## 🔧 系統核心功能

### 1. 註冊 / 登入功能
- 使用者可選擇角色（廣告主或媒體主）
- 可用 Email 密碼註冊，日後可加入社群登入

### 2. 媒體主上架廣告位
- 填寫表單上架自己的廣告空間
  - 標題、平台類型（IG、網站、餐廳看板…）
  - 圖片
  - 廣告接受類型（食品、3C、教育…）
  - 收費方式（一次性、每週、每月）
  - 地點（可選）

### 3. 廣告主瀏覽與媒合
- 瀏覽廣告位清單
- 可用關鍵字 / 類型 / 價格篩選
- 可留言或提出合作意願

### 4. 發佈廣告需求
- 廣告主可張貼廣告需求
  - 想找什麼平台曝光、預算範圍、廣告內容類型
- 媒體主也能主動去找有趣的廣告案

 ###  使用者系統補充
 權限與驗證邏輯
每個 API 需確認使用者是否為「登入狀態」

某些 API 需檢查角色（如廣告主不能上架 listing）

Password 使用 bcrypt 雜湊加密儲存




---

## ⚙️ 技術實作規劃

### 前端

- **框架**：Next.js 14
- **樣式**：SCSS + module / RWD
- **API 呼叫**：Fetch API 或 SWR
- **路由建議**：
 - → 首頁
 - login → 登入註冊
 - dashboard → 控制台（角色分流）
 - listing → 廣告空間瀏覽
 - listing/[id] → 廣告空間詳細頁
 - post-ad → 廣告主發案頁



 
### 後端

- **架構**：Node.js + Express + SQLite
- **資料庫 Schema**
### 使用者 Schema 
Users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT CHECK(role IN ('advertiser', 'publisher')) NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
### Listings Schema 
Listings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  owner_id INTEGER REFERENCES Users(id),
  title TEXT,
  type TEXT, -- e.g., 'Instagram', 'Website', 'Restaurant'
  description TEXT,
  platform_url TEXT,
  price INTEGER,
  categories TEXT,
  tags TEXT,
  location TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
### 訊息系統
建議先採 簡訊箱式非即時 留言方式
建議支援多則訊息（可變成聊天紀錄）
Messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  listing_id INTEGER REFERENCES Listings(id),
  from_user_id INTEGER REFERENCES Users(id),
  to_user_id INTEGER REFERENCES Users(id),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
日後可用 Socket.io 轉為即時聊天。

### 廣告需求發文（AdPosts）
廣告主需求類型範例：品牌曝光、短期活動、長期合作
可上傳範例素材、Logo

AdPosts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  advertiser_id INTEGER REFERENCES Users(id),
  title TEXT,
  budget INTEGER,
  target_type TEXT, -- 媒體平台需求，如「有實體餐廳」或「IG 追蹤數超過5k」
  content TEXT,
  attachments TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)


### API 路由（RESTful）

POST /api/login

POST /api/register

GET /api/listings

GET /api/listings/:id

POST /api/listings （新增）

POST /api/ads （發案）

GET /api/messages

POST /api/messages

上傳圖片
POST /api/upload
FormData: { file: image }
→ 回傳 image_url 給其他欄位使用

Session 管理

可先用 JWT + Cookie 或 Express Session 儲存登入資訊

### API 改善與擴充建議
API 錯誤處理與回應格式統一
{
  "success": false,
  "message": "Invalid token",
  "data": null
}

### API 的 Request / Response 範例格式，如：
POST /api/listings
Authorization: Bearer <token>

{
  "title": "我家門口的大型看板",
  "type": "Billboard",
  "description": "位於台北市中心，每日人流破萬",
  "price": 5000,
  "categories": ["科技", "美妝"],
  "tags": ["台北", "戶外", "熱門"],
  "image_url": "https://cdn.admatch.com/board01.jpg"
}



### 專案目錄建議
/AD_PLATFORM/
├── app/                    # ✅ Next.js App Router 入口，取代 pages/
│   ├── layout.tsx          # 共用 layout，含 <html>、<body>
│   ├── page.tsx            # 首頁 (原本的 pages/index.tsx)
│   ├── login/
│   │   └── page.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   ├── listing/
│   │   ├── page.tsx        # 列表頁
│   │   └── [id]/           # 動態路由
│   │       └── page.tsx
│   ├── post-ad/
│   │   └── page.tsx
│   └── api/                # ✅ 放置 API Route
│       ├── auth/
│       │   └── route.ts
│       ├── listings/
│       │   └── route.ts
│       ├── ads/
│       │   └── route.ts
│       └── messages/
│           └── route.ts
│
├── components/             # 共用元件
│   ├── ListingCard.tsx
│   ├── AdForm.tsx
│   └── MessageThread.tsx
│
├── styles/                 # SCSS 架構
│   ├── global.scss
│   └── components/
│       ├── listing-card.scss
│       ├── ad-form.scss
│       └── ...
│
├── lib/                    # 工具類，像 fetch wrapper、驗證工具
│   ├── auth.ts
│   ├── db.ts
│   └── utils.ts
│
├── public/                 # 靜態資源 (圖片、favicon...)
├── middleware.ts          # ✅ 中介層，可做 auth 檢查等
├── tailwind.config.js     # 如有使用 Tailwind
├── tsconfig.json
└── next.config.js

/styles/
├── global.scss          # 全域變數、reset
├── abstracts/           # variables, mixins, functions
│   ├── _variables.scss
│   └── _mixins.scss
├── components/
│   ├── _listing-card.scss
│   ├── _ad-form.scss
│   └── ...
├── layout/              # header/footer/sidebar 等
├── pages/               # 特定頁面樣式
│   ├── _login.scss
│   └── _dashboard.scss
└── main.scss            # 主要引入點


Server / Backend 建議
/server/
├── index.js              # 啟動 server
├── db/
│   ├── init.sql
│   └── sqlite.js         # DB 初始化與連線管理
├── routes/
│   ├── auth.js
│   ├── listings.js
│   ├── ads.js
│   └── messages.js
├── controllers/          # 拆分邏輯層
│   ├── authController.js
│   ├── listingController.js
│   └── ...
├── middleware/           # 驗證、錯誤處理
│   ├── authMiddleware.js
│   └── errorHandler.js
└── utils/
    └── logger.js



### UX / UI 流程
### 使用者流程（User Flow）
廣告主流程
註冊登入 → 瀏覽 Listing → 搜尋篩選 → 私訊平台主 → 提出合作意願 → 建立訂單（未來功能）

### 媒體主流程
註冊登入 → 上架廣告位 → 管理 Listing → 接收留言 → 交易（未來）

### 雙方共用功能
編輯個人頁面

查看訊息通知

可查看自己角色歷史紀錄（瀏覽紀錄 / 發案紀錄）

### 表單驗證邏輯（如：email 格式、價格為正整數、圖片檢查）

### RWD 建議
採用 CSS Grid 或 Flex 排版 + Media Query

Mobile 第一層優先呈現：圖片 + 標題 + 價格

Desktop 顯示更多資訊欄位（如類別、平台連結）





