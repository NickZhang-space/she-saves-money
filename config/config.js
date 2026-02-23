// config/config.js - "她存钱"项目配置文件

const config = {
  // 云开发环境ID（需要替换为实际环境ID）
  envId: 'prod-xxxxx',
  
  // 版本信息
  version: '1.0.0',
  versionCode: 1,
  
  // 数据库集合名称
  collections: {
    users: 'users',           // 用户表
    dreams: 'dreams',         // 梦想表
    checkins: 'checkins',     // 打卡记录表
    friends: 'friends',       // 好友关系表
    waterings: 'waterings',   // 浇花记录表
    teamChallenges: 'team_challenges', // 组队挑战表
    achievements: 'achievements', // 成就表
    aiMessages: 'ai_messages' // AI陪伴语库
  },
  
  // 梦想分规则（按方案）
  dreamPoints: {
    // 获取方式
    dailyCheckin: 5,          // 每日打卡 +5分
    checkin3Days: 10,         // 连续打卡3天 +10分
    checkin7Days: 30,         // 连续打卡7天 +30分
    checkin30Days: 100,       // 连续打卡30天 +100分
    updateProgress: 10,       // 更新梦想进度 +10分
    waterFriend: 5,           // 给好友浇花 +5分
    beWatered: 10,            // 被好友浇花 +10分
    inviteFriend: 100,        // 邀请好友注册 +100分
    friendFirstCheckin: 50,   // 好友首次打卡 +50分
    completeTeamChallenge: 200, // 完成组队挑战 +200分
    completeDream: 500,       // 完成一个梦想 +500分
    
    // 消费方式
    basicSkin: 200,           // 基础皮肤主题 200分
    premiumSkin: 500,         // 高级皮肤主题 500分
    aiPremium: 500,           // AI陪伴语高级版 500分
    badge: 100,               // 专属徽章 100分
    speedUpCard: 1000,        // 梦想加速卡 1000分（视觉+10%）
    
    // 实物奖励
    beautySample: 5000,       // 美妆小样礼盒 5000分
    beautyMediumSample: 10000 // 中样礼盒 10000分
  },
  
  // 等级规则
  levels: [
    { level: 1, name: '省钱新人', exp: 0 },
    { level: 2, name: '省钱达人', exp: 100 },
    { level: 3, name: '省钱大师', exp: 500 },
    { level: 4, name: '省钱王者', exp: 1000 },
    { level: 5, name: '省钱之神', exp: 2000 }
  ],
  
  // 梦想分类（按方案）
  dreamCategories: [
    { id: 'medical_beauty', name: '医美项目', icon: '/images/category-medical-beauty.png', color: '#FF6B9D', examples: ['双眼皮', '玻尿酸', '热玛吉', '皮秒'] },
    { id: 'luxury', name: '奢侈品', icon: '/images/category-luxury.png', color: '#9D6BFF', examples: ['包包', '首饰', '手表', '鞋子'] },
    { id: 'travel', name: '旅行度假', icon: '/images/category-travel.png', color: '#6BFF9D', examples: ['日本', '欧洲', '马尔代夫', '迪士尼'] },
    { id: 'study', name: '学习提升', icon: '/images/category-study.png', color: '#6B9DFF', examples: ['化妆课', '形体课', '语言课', '考证'] },
    { id: 'fitness', name: '健身塑形', icon: '/images/category-fitness.png', color: '#FF9D6B', examples: ['私教', '瑜伽年卡', '健身房会员'] },
    { id: 'image', name: '形象改造', icon: '/images/category-image.png', color: '#FF6BFF', examples: ['牙齿矫正', '皮肤管理', '发型设计'] },
    { id: 'other', name: '其他', icon: '/images/category-other.png', color: '#999999', examples: [] }
  ],
  
  // 梦想模板（按方案）
  dreamTemplates: [
    { name: '医美微整', target: 5000, category: 'medical_beauty', icon: '/images/template-medical-beauty.png', defaultWhy: '想要变得更美更自信' },
    { name: '新款包包', target: 3000, category: 'luxury', icon: '/images/template-bag.png', defaultWhy: '看中很久的包包，背上它一定很美' },
    { name: '日本旅行', target: 8000, category: 'travel', icon: '/images/template-japan.png', defaultWhy: '想去日本看樱花，体验和服文化' },
    { name: '化妆课程', target: 3000, category: 'study', icon: '/images/template-makeup.png', defaultWhy: '学会化妆，让自己每天美美的' },
    { name: '健身私教', target: 4000, category: 'fitness', icon: '/images/template-fitness.png', defaultWhy: '想要健康的身材和体态' },
    { name: '牙齿矫正', target: 15000, category: 'image', icon: '/images/template-teeth.png', defaultWhy: '拥有自信的笑容' },
    { name: '欧洲旅行', target: 20000, category: 'travel', icon: '/images/template-europe.png', defaultWhy: '环游欧洲，感受异国风情' },
    { name: '名牌手表', target: 10000, category: 'luxury', icon: '/images/template-watch.png', defaultWhy: '拥有一件有品位的配饰' }
  ],
  
  // 情感化文案（根据进度变化）
  emotionalTexts: {
    0: { min: 0, max: 10, text: '梦想的种子已发芽 🌱', encouragement: '从0到1是最难的，你已经开始了！' },
    1: { min: 10, max: 30, text: '你比80%的人更接近梦想', encouragement: '继续坚持，你已经走在前面了！' },
    2: { min: 30, max: 50, text: '已经过半了，加油！💪', encouragement: '最难的部分已经过去了，胜利在望！' },
    3: { min: 50, max: 80, text: '胜利在望，别放弃', encouragement: '再坚持一下，梦想就要实现了！' },
    4: { min: 80, max: 100, text: '马上就能实现了！🎉', encouragement: '最后冲刺，你就要成功了！' }
  },
  
  // 生活化对比（还差多少钱）
  lifeComparisons: [
    { amount: 25, text: '还差一杯奶茶的钱' },
    { amount: 100, text: '还差一顿火锅的钱' },
    { amount: 500, text: '还差一件衣服的钱' },
    { amount: 1000, text: '还差一部手机的钱' },
    { amount: 3000, text: '还差一个包包的钱' },
    { amount: 5000, text: '还差一次旅行的钱' }
  ],
  
  // AI陪伴配置
  aiCompanion: {
    name: '待定', // Gemini负责取名
    avatar: '/images/ai-avatar.png',
    role: '帅气暖男教练',
    traits: ['温柔', '励志', '懂女生', '会鼓励'],
    
    // AI问候语（按方案）
    greetings: {
      morning: ['早安，今天也要为梦想努力哦 ☀️', '新的一天，新的开始，加油！', '早上好，记得今天也要存钱哦'],
      evening: ['今天你存钱了吗？', '晚安，明天继续为梦想努力', '今天辛苦了，早点休息']
    },
    
    // 进度更新鼓励语
    progressEncouragements: [
      '太棒了！今天又存了{{amount}}元',
      '我看到你的努力了，继续加油',
      '按这个速度，{{months}}个月后你就能实现梦想了',
      '每天进步一点点，梦想就会越来越近'
    ],
    
    // 进度停滞关心语
    progressConcerns: [
      '最近是不是遇到困难了？',
      '要不要调整一下目标？',
      '别灰心，慢慢来也没关系',
      '休息一下，调整好状态再出发'
    ],
    
    // 接近目标激励语
    nearGoalEncouragements: [
      '还有{{amount}}元就能实现了，坚持住！',
      '胜利在望，最后冲刺！',
      '马上就要成功了，别放弃！'
    ],
    
    // 梦想实现祝贺语
    dreamAchievedCongrats: [
      '恭喜你！梦想成真了！',
      '你做到了，我为你骄傲',
      '太厉害了！你真的实现了梦想！'
    ]
  },
  
  // 分享配置
  share: {
    title: '她存钱 - 每次忍住不买，都是离梦想更近一步',
    imageUrl: '/images/share-cover.png',
    path: '/pages/index/index',
    posterTemplates: 5 // 海报模板数量
  },
  
  // 成就系统（按方案）
  achievements: [
    { id: 'first_dream', name: '初心者', description: '创建第一个梦想', icon: '/images/badge-first-dream.png', points: 50 },
    { id: 'checkin_7_days', name: '坚持者', description: '连续打卡7天', icon: '/images/badge-checkin-7.png', points: 100 },
    { id: 'checkin_30_days', name: '追梦人', description: '连续打卡30天', icon: '/images/badge-checkin-30.png', points: 300 },
    { id: 'invite_5_friends', name: '社交达人', description: '邀请5位好友', icon: '/images/badge-invite-5.png', points: 200 },
    { id: 'unlock_10_skins', name: '收藏家', description: '解锁10个皮肤', icon: '/images/badge-skins-10.png', points: 300 },
    { id: 'water_50_times', name: '助人为乐', description: '给好友浇花50次', icon: '/images/badge-water-50.png', points: 250 },
    { id: 'complete_dream', name: '梦想成真', description: '完成一个梦想', icon: '/images/badge-complete-dream.png', points: 500 }
  ],
  
  // 广告配置（按方案）
  ad: {
    // Banner广告ID
    bannerAdId: 'adunit-xxxxxxxxxxxxxxxx',
    // 激励视频广告ID
    rewardAdId: 'adunit-xxxxxxxxxxxxxxxx',
    // 开屏广告ID（可选）
    splashAdId: 'adunit-xxxxxxxxxxxxxxxx',
    
    // 广告位置
    positions: {
      homeBottom: 'home_bottom', // 首页底部
      rankingPage: 'ranking_page', // 排行榜页
      videoReward: 'video_reward' // 看视频赚梦想分
    },
    
    // 收益预估
    revenueEstimate: {
      cpm: 0.5, // 每千次展示收益（元）
      cpc: 0.5, // 每次点击收益（元）
      videoComplete: 0.01 // 激励视频完播收益（元）
    }
  },
  
  // 客服配置
  customerService: {
    enabled: true,
    wechat: 'beautiful_savings',
    email: 'support@beautifulsavings.com'
  },
  
  // 隐私政策链接
  privacyPolicy: 'https://beautifulsavings.com/privacy',
  // 用户协议链接
  userAgreement: 'https://beautifulsavings.com/agreement'
}

module.exports = config