import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '../../../../lib/db';
import { hashPassword } from '../../../../lib/auth';

export async function POST(request: NextRequest) {
  try {
    const db = await getDb();
    
    // 清空現有資料
    await db.run('DELETE FROM Messages');
    await db.run('DELETE FROM Listings');
    await db.run('DELETE FROM AdPosts');
    await db.run('DELETE FROM Users');
    
    // 創建測試帳號
    const advertiserPassword = await hashPassword('advertiser123');
    const publisherPassword = await hashPassword('publisher123');
    
    // 廣告主帳號
    const advertiserResult = await db.run(
      'INSERT INTO Users (email, password, name, role, bio) VALUES (?, ?, ?, ?, ?)',
      [
        'advertiser@test.com',
        advertiserPassword,
        '小明科技',
        'advertiser',
        '專業的科技產品廣告商，致力於推廣最新的數位產品和服務。'
      ]
    );
    
    // 媒體主帳號
    const publisherResult = await db.run(
      'INSERT INTO Users (email, password, name, role, bio) VALUES (?, ?, ?, ?, ?)',
      [
        'publisher@test.com',
        publisherPassword,
        '小華媒體',
        'publisher',
        '擁有多個社群媒體平台和網站，提供優質的廣告曝光服務。'
      ]
    );
    
    const publisherId = publisherResult.lastID;
    
    // 創建測試廣告位資料
    const listings = [
      {
        title: 'Instagram 美食帳號廣告位',
        type: 'Instagram',
        description: '專業美食 Instagram 帳號，擁有 50,000 活躍粉絲，主要受眾為 25-35 歲的都市女性。每日平均貼文觸及率 15%，適合美食、餐廳、廚具等相關產品廣告。',
        platform_url: 'https://instagram.com/foodlover_tw',
        price: 8000,
        categories: '美食,餐廳,廚具,生活',
        tags: 'Instagram,美食,女性,都市',
        location: '台北市',
        image_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop'
      },
      {
        title: 'YouTube 科技頻道廣告位',
        type: 'YouTube',
        description: '科技評測 YouTube 頻道，訂閱者 120,000 人，主要觀眾為 18-35 歲的科技愛好者。月平均觀看時數 50 萬分鐘，適合 3C 產品、軟體、遊戲等廣告。',
        platform_url: 'https://youtube.com/c/TechReviewTW',
        price: 15000,
        categories: '科技,3C,軟體,遊戲',
        tags: 'YouTube,科技,男性,評測',
        location: '新北市',
        image_url: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=300&fit=crop'
      },
      {
        title: '咖啡廳店面廣告看板',
        type: 'Billboard',
        description: '位於信義區熱門咖啡廳的店面廣告看板，每日人流約 2,000 人次。客群以上班族和學生為主，適合咖啡、甜點、書籍、文具等產品廣告。',
        platform_url: '',
        price: 12000,
        categories: '咖啡,甜點,書籍,文具',
        tags: '實體店面,上班族,學生,信義區',
        location: '台北市信義區',
        image_url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop'
      },
      {
        title: 'Facebook 旅遊社團廣告',
        type: 'Facebook',
        description: '台灣旅遊愛好者 Facebook 社團，成員 80,000 人，每日活躍用戶約 5,000 人。適合旅遊、住宿、交通、戶外用品等相關廣告。',
        platform_url: 'https://facebook.com/groups/traveltaiwan',
        price: 6000,
        categories: '旅遊,住宿,交通,戶外',
        tags: 'Facebook,旅遊,社團,台灣',
        location: '全台灣',
        image_url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop'
      },
      {
        title: '部落格網站廣告位',
        type: 'Website',
        description: '生活風格部落格網站，月訪問量 200,000 人次，讀者以 25-45 歲女性為主。內容涵蓋時尚、美妝、家居、親子等主題，適合相關產品廣告。',
        platform_url: 'https://lifestyleblog.tw',
        price: 10000,
        categories: '時尚,美妝,家居,親子',
        tags: '部落格,女性,生活,時尚',
        location: '線上',
        image_url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop'
      },
      {
        title: '健身房電視廣告播放',
        type: 'TV',
        description: '連鎖健身房電視廣告播放，覆蓋 15 間分店，每日觀看人次約 3,000 人。客群為注重健康的上班族，適合健身用品、營養品、運動服飾等廣告。',
        platform_url: '',
        price: 20000,
        categories: '健身,營養品,運動,服飾',
        tags: '健身房,電視,運動,健康',
        location: '台北市、新北市',
        image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'
      },
      {
        title: 'TikTok 舞蹈創作者廣告',
        type: 'TikTok',
        description: '人氣舞蹈創作者 TikTok 帳號，粉絲 300,000 人，平均每支影片觀看數 50,000 次。受眾以 16-25 歲年輕族群為主，適合時尚、音樂、飲料等年輕化品牌。',
        platform_url: 'https://tiktok.com/@dance_creator_tw',
        price: 18000,
        categories: '時尚,音樂,飲料,娛樂',
        tags: 'TikTok,舞蹈,年輕,創作者',
        location: '台中市',
        image_url: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=400&h=300&fit=crop'
      },
      {
        title: 'Podcast 財經節目廣告',
        type: 'Podcast',
        description: '財經投資 Podcast 節目，每集平均下載量 25,000 次，聽眾以 30-50 歲的專業人士為主。適合金融服務、投資產品、商業書籍等廣告。',
        platform_url: 'https://podcasts.apple.com/tw/podcast/finance-talk',
        price: 14000,
        categories: '金融,投資,商業,書籍',
        tags: 'Podcast,財經,專業,投資',
        location: '線上',
        image_url: 'https://images.unsplash.com/photo-1590479773265-7464e5d48118?w=400&h=300&fit=crop'
      }
    ];
    
    // 插入廣告位資料
    for (const listing of listings) {
      await db.run(
        `INSERT INTO Listings (owner_id, title, type, description, platform_url, price, categories, tags, location, image_url) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          publisherId,
          listing.title,
          listing.type,
          listing.description,
          listing.platform_url,
          listing.price,
          listing.categories,
          listing.tags,
          listing.location,
          listing.image_url
        ]
      );
    }

    const advertiserId = advertiserResult.lastID;

    // 創建測試廣告需求
    const adPosts = [
      {
        title: '新品手機配件推廣合作',
        budget: 50000,
        target_type: 'Instagram',
        content: '我們是一家專業的手機配件製造商，即將推出新一代無線充電器和手機殼系列產品。尋找 Instagram 科技帳號或 3C 評測者合作推廣。\n\n合作內容：\n1. 產品開箱評測\n2. 使用心得分享\n3. 限時動態推廣\n\n提供產品：免費提供全系列產品供評測使用\n合作期間：2024年1月-3月\n目標受眾：18-35歲科技愛好者',
        attachments: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=300&fit=crop'
      },
      {
        title: '咖啡品牌形象廣告投放',
        budget: 80000,
        target_type: 'YouTube',
        content: '精品咖啡品牌尋找 YouTube 生活風格頻道合作，推廣我們的手沖咖啡豆和咖啡器具。\n\n合作方式：\n1. 頻道置入性廣告\n2. 咖啡沖煮教學影片\n3. 品牌故事分享\n\n預算分配：\n- 影片製作費：50,000\n- 廣告投放費：30,000\n\n目標：提升品牌知名度，增加線上銷售',
        attachments: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop'
      },
      {
        title: '健身房連鎖品牌推廣',
        budget: 120000,
        target_type: 'TikTok',
        content: '連鎖健身房品牌尋找 TikTok 健身創作者合作推廣。我們提供最新的健身器材和專業教練課程。\n\n合作內容：\n1. 健身房環境介紹\n2. 器材使用教學\n3. 教練課程體驗\n4. 會員優惠推廣\n\n合作條件：\n- 粉絲數 10 萬以上\n- 健身相關內容創作者\n- 位於台北或新北地區\n\n提供福利：免費健身房會員資格',
        attachments: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop'
      }
    ];

    // 插入廣告需求資料
    for (const adPost of adPosts) {
      await db.run(
        `INSERT INTO AdPosts (advertiser_id, title, budget, target_type, content, attachments) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          advertiserId,
          adPost.title,
          adPost.budget,
          adPost.target_type,
          adPost.content,
          adPost.attachments
        ]
      );
    }

    // 創建測試訊息
    const messages = [
      {
        listing_id: 1,
        from_user_id: advertiserId,
        to_user_id: publisherId,
        content: '您好！我對您的 Instagram 美食帳號廣告位很感興趣。我們是一家新的有機食品品牌，希望能與您合作推廣我們的產品。請問是否有檔期可以討論？'
      },
      {
        listing_id: 1,
        from_user_id: publisherId,
        to_user_id: advertiserId,
        content: '您好！謝謝您的詢問。我們很樂意與有機食品品牌合作。目前下個月還有檔期，您可以提供更多關於產品和合作方式的資訊嗎？'
      },
      {
        listing_id: 2,
        from_user_id: advertiserId,
        to_user_id: publisherId,
        content: '嗨！我們是一家手機配件公司，看到您的 YouTube 科技頻道很棒。想討論產品評測合作的可能性，請問您的合作流程是什麼？'
      }
    ];

    // 插入訊息資料
    for (const message of messages) {
      await db.run(
        `INSERT INTO Messages (listing_id, from_user_id, to_user_id, content) 
         VALUES (?, ?, ?, ?)`,
        [
          message.listing_id,
          message.from_user_id,
          message.to_user_id,
          message.content
        ]
      );
    }
    
    return NextResponse.json({
      success: true,
      message: '測試資料建立成功',
      data: {
        accounts: {
          advertiser: {
            email: 'advertiser@test.com',
            password: 'advertiser123',
            name: '小明科技',
            role: 'advertiser'
          },
          publisher: {
            email: 'publisher@test.com',
            password: 'publisher123',
            name: '小華媒體',
            role: 'publisher'
          }
        },
        listings_created: listings.length,
        ad_posts_created: adPosts.length,
        messages_created: messages.length
      }
    });
    
  } catch (error) {
    console.error('Seed data error:', error);
    return NextResponse.json(
      { success: false, message: '建立測試資料失敗' },
      { status: 500 }
    );
  }
}