# 部署到 Vercel 指南

## 前置準備

1. **GitHub 帳號** - 確保您有 GitHub 帳號
2. **Vercel 帳號** - 確保您有 Vercel 帳號
3. **PostgreSQL 資料庫** - 需要準備生產環境的資料庫

## 步驟 1: 推送到 GitHub

1. 在 GitHub 建立新的 repository
2. 將本地專案推送到 GitHub：

```bash
# 安裝新的依賴
npm install

# 初始化 git (如果尚未初始化)
git init

# 加入 GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 推送到 GitHub
git add .
git commit -m "Prepare for Vercel deployment"
git push -u origin main
```

## 步驟 2: 設置 PostgreSQL 資料庫

### 選項 A: 使用 Vercel Postgres (推薦)
1. 登入 Vercel Dashboard
2. 前往 Storage → Create Database
3. 選擇 Postgres
4. 記下連接字串

### 選項 B: 使用 Railway
1. 前往 [Railway](https://railway.app)
2. 建立新專案，加入 PostgreSQL
3. 複製連接字串

### 選項 C: 使用 Supabase
1. 前往 [Supabase](https://supabase.com)
2. 建立新專案
3. 在 Settings → Database 找到連接字串

## 步驟 3: 部署到 Vercel

1. 登入 [Vercel](https://vercel.com)
2. 點擊 "New Project"
3. 選擇您的 GitHub repository
4. 在 "Environment Variables" 設置以下變數：

```
NODE_ENV=production
JWT_SECRET=your-super-secure-jwt-secret-key-at-least-32-characters-long
POSTGRES_URL=your-postgresql-connection-string
```

5. 點擊 "Deploy"

## 步驟 4: 初始化生產資料庫

部署完成後，您需要初始化資料庫：

1. 前往您的 Vercel 部署網址
2. 訪問 `https://your-app.vercel.app/api/init` 來初始化資料庫
3. 訪問 `https://your-app.vercel.app/api/seed` 來建立測試資料

## 步驟 5: 測試

1. 前往您的應用網址
2. 使用測試帳號登入：
   - **廣告主**: advertiser@test.com / advertiser123
   - **媒體主**: publisher@test.com / publisher123

## 環境變數說明

| 變數名稱 | 說明 | 範例 |
|---------|-----|-----|
| `NODE_ENV` | 執行環境 | `production` |
| `JWT_SECRET` | JWT 密鑰 | `your-super-secure-jwt-secret-key` |
| `POSTGRES_URL` | PostgreSQL 連接字串 | `postgres://user:pass@host:5432/db` |

## 常見問題

### Q: 部署失敗怎麼辦？
A: 檢查 Vercel 的 Functions 日誌，確保環境變數設置正確。

### Q: 資料庫連接失敗？
A: 確認 PostgreSQL 連接字串正確，並且資料庫允許外部連接。

### Q: 如何更新部署？
A: 推送新的 commit 到 GitHub，Vercel 會自動重新部署。

## 開發與生產環境

- **開發環境**: 使用 SQLite 資料庫
- **生產環境**: 使用 PostgreSQL 資料庫
- 程式碼會自動根據 `NODE_ENV` 選擇適當的資料庫

## 需要協助？

如果在部署過程中遇到問題，請檢查：
1. 環境變數是否正確設置
2. PostgreSQL 資料庫是否可以連接
3. GitHub repository 是否包含所有必要文件