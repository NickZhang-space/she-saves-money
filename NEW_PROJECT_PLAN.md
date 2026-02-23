# "她存钱" - 完整项目开发计划

## 📋 项目概述
- **项目名称**：她存钱
- **产品定位**：女性梦想目标管理小程序
- **核心价值**：通过可视化进度、AI陪伴和社交互动，帮助18-35岁女性实现变美梦想
- **开发周期**：1周（按方案要求）

## 👥 团队分工（按方案）
### 小D（我）- 技术负责人
- 项目管理和进度把控
- 后端架构设计
- 云函数开发
- 数据库设计和优化
- 核心业务逻辑
- 代码审查

### 小C - 技术开发 + AI功能
- 前端页面开发
- AI相关功能
- 海报生成
- 辅助后端开发

### Gemini - 内容策划
- 产品文案
- AI陪伴语设计
- 用户协议和隐私政策

### 豆包 - UI设计
- 所有页面UI设计
- 视觉规范

## 🗓️ 开发计划（1周）

### Day 1（今天：2026-02-23）
**目标**：需求确认 + 架构设计 + 基础框架

#### 上午（已完成）
- ✅ 阅读完整项目方案
- ✅ 理解功能需求
- ✅ 调整项目名称（她存钱）

#### 下午（进行中）
- 🔄 根据新方案调整数据库设计
- 🔄 重新规划功能模块
- 🔄 更新开发进度计划

#### 晚上（计划中）
- 📋 完成详细技术架构设计
- 📋 创建数据库表结构
- 📋 分配具体开发任务

### Day 2（明天：2026-02-24）
**目标**：核心功能开发

#### 小D任务：
- 用户系统（登录、注册、邀请码）
- 梦想管理（CRUD + 预设类型）
- 梦想分系统（获取、消费、记录）
- 邀请裂变系统

#### 小C任务：
- 首页页面重设计
- 梦想详情页开发
- AI陪伴文案库接入
- 基础动画效果

### Day 3（2026-02-25）
**目标**：社交功能开发

#### 小D任务：
- 好友系统（添加、列表、关系）
- 梦想花园（浇花逻辑）
- 排行榜系统（计算、排名）
- 组队挑战功能

#### 小C任务：
- 社交页面开发
- 梦想花园前端
- 排行榜页面
- 组队挑战前端

### Day 4（2026-02-26）
**目标**：高级功能开发

#### 小D任务：
- 打卡系统（连续奖励）
- 成就系统（徽章、奖励）
- 分享系统（海报生成）
- 广告接入准备

#### 小C任务：
- 打卡页面开发
- 成就页面开发
- 海报生成功能
- AI陪伴交互优化

### Day 5（2026-02-27）
**目标**：集成测试

#### 团队任务：
- 功能集成测试
- Bug修复
- 性能优化
- 用户体验测试

### Day 6（2026-02-28）
**目标**：上线准备

#### 团队任务：
- 准备审核材料
- 编写用户协议
- 隐私政策文档
- 提交微信审核

### Day 7（2026-03-01）
**目标**：正式上线
- 审核通过后发布
- 邀请种子用户
- 收集反馈

## 🏗️ 技术架构调整

### 数据库设计（根据新方案）
```javascript
// 用户表
users: {
  _id: string,
  _openid: string,
  nickName: string,
  avatarUrl: string,
  totalSaved: number,
  totalDreams: number,
  dreamPoints: number, // 梦想分
  level: number,
  experience: number,
  inviteCode: string, // 邀请码
  invitedBy: string, // 被谁邀请
  createTime: Date,
  updateTime: Date
}

// 梦想表（新增字段）
dreams: {
  _id: string,
  userId: string,
  name: string,
  target: number,
  current: number,
  progress: number,
  category: string, // 医美、奢侈品、旅行等
  description: string,
  coverImage: string,
  color: string,
  isActive: boolean,
  createTime: Date,
  updateTime: Date,
  completeTime?: Date,
  // 新增字段
  whyWant: string, // 为什么想要这个梦想
  milestoneCelebrated: [number], // 已庆祝的里程碑
  lastWaterTime?: Date // 上次被浇花时间
}

// 记录表（改为打卡记录）
checkins: {
  _id: string,
  userId: string,
  dreamId?: string,
  amount?: number, // 更新的金额
  points: number, // 获得的梦想分
  type: string, // daily/update/water/team
  description: string,
  createTime: Date
}

// 好友关系表
friends: {
  _id: string,
  userId: string,
  friendId: string,
  status: string, // pending/accepted
  createTime: Date
}

// 浇花记录表
waterings: {
  _id: string,
  fromUserId: string,
  toUserId: string,
  dreamId: string,
  pointsGiven: number, // 给对方的分数
  pointsReceived: number, // 自己获得的分数
  createTime: Date
}

// 组队挑战表
teamChallenges: {
  _id: string,
  name: string,
  target: number, // 团队总目标
  duration: number, // 天数
  status: string, // active/completed/failed
  members: [{
    userId: string,
    progress: number,
    status: string // active/completed
  }],
  createTime: Date,
  endTime: Date
}

// 成就表
achievements: {
  _id: string,
  userId: string,
  achievementId: string, // 成就ID
  name: string,
  description: string,
  icon: string,
  unlocked: boolean,
  unlockTime?: Date
}
```

### 核心功能模块

#### 1. 梦想管理系统
- 预设梦想类型（医美、奢侈品、旅行等）
- 情感化文案系统（根据进度变化）
- 里程碑庆祝机制
- 生活化对比（还差多少杯奶茶）

#### 2. 每日打卡系统
- 打卡获得梦想分
- 连续打卡奖励
- 打卡日历
- AI陪伴语（每天不同）

#### 3. 梦想分系统
- 获取方式：打卡、更新进度、浇花、邀请等
- 消费方式：皮肤主题、AI陪伴语、徽章、加速卡
- 实物奖励兑换（5000分=美妆小样）

#### 4. AI陪伴系统
- 帅气暖男教练人设
- 不同场景互动（问候、鼓励、提醒）
- 消费提醒功能
- 个性化激励文案

#### 5. 社交互动系统
- 好友系统（邀请码添加）
- 梦想花园（浇花助力）
- 闺蜜组队挑战（3人7天）
- 排行榜（周榜、月榜、好友榜）

#### 6. 分享系统
- 海报生成（梦想进度+激励文案）
- 邀请机制（邀请码+奖励）
- 多种分享模板

#### 7. 成就系统
- 成就徽章（初心者、坚持者、追梦人等）
- 成就奖励
- 个人主页展示

## 🎯 MVP功能优先级

### 第一阶段（必须完成）
1. 用户登录注册
2. 梦想创建和管理
3. 进度更新和展示
4. 每日打卡系统
5. 基础梦想分系统

### 第二阶段（核心亮点）
1. AI陪伴基础功能
2. 好友添加和列表
3. 梦想花园浇花功能
4. 基础分享功能

### 第三阶段（增强留存）
1. 连续打卡奖励
2. 排行榜
3. 组队挑战
4. 成就系统

### 第四阶段（商业化）
1. 广告接入
2. 皮肤主题商店
3. 会员功能
4. 实物奖励兑换

## 🔧 技术实现要点

### 前端技术栈
- 微信小程序原生开发
- 使用云开发能力
- 自定义组件库
- Canvas海报生成

### 后端技术栈
- 微信云开发（云函数、云数据库、云存储）
- Node.js云函数
- 实时数据库监听

### 关键算法
1. **梦想分计算**：根据行为类型计算分数
2. **排行榜算法**：实时排名计算
3. **进度预测**：基于存钱速度预测实现时间
4. **AI文案匹配**：根据场景匹配合适文案

## 📊 开发进度跟踪

### 今日完成情况
- ✅ 项目基础框架搭建
- ✅ 首页基础功能开发
- ✅ 云函数基础搭建
- ✅ 数据库设计初稿

### 明日目标
- 完成梦想管理系统
- 实现打卡系统
- 开发梦想分基础逻辑
- 开始AI陪伴功能

## 🚨 风险与应对

### 技术风险
1. **云开发限制**：注意并发和存储限制
2. **性能问题**：排行榜实时计算可能影响性能
3. **兼容性问题**：不同微信版本兼容性

### 应对措施
1. 使用分页和缓存
2. 优化数据库查询
3. 定期性能测试

### 时间风险
1. **功能过多**：1周时间紧张
2. **团队协作**：需要高效沟通

### 应对措施
1. 优先完成MVP核心功能
2. 每日进度同步
3. 灵活调整开发计划

## 📞 沟通机制

### 每日站会
- 时间：每天上午9:00
- 内容：昨日进度、今日计划、遇到的问题

### 进度汇报
- 时间：每天下午6:00
- 内容：今日完成情况、明日计划

### 问题反馈
- 即时沟通，及时解决
- 重大问题立即上报

---

**最后更新**：2026-02-23 12:45  
**项目状态**：按新方案调整中  
**开发负责人**：小D