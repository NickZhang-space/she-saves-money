// 常量定义

// 梦想类型
const DREAM_CATEGORIES = {
  MEDICAL: { id: 'medical', name: '医美项目', icon: '💄', emoji: '💄' },
  LUXURY: { id: 'luxury', name: '奢侈品', icon: '👜', emoji: '👜' },
  TRAVEL: { id: 'travel', name: '旅行', icon: '✈️', emoji: '✈️' },
  STUDY: { id: 'study', name: '学习提升', icon: '📚', emoji: '📚' },
  FITNESS: { id: 'fitness', name: '健身塑形', icon: '💪', emoji: '💪' },
  BEAUTY: { id: 'beauty', name: '形象改造', icon: '🦷', emoji: '🦷' },
  CUSTOM: { id: 'custom', name: '自定义', icon: '🎨', emoji: '🎨' }
};

// 梦想分获取规则
const POINTS_RULES = {
  DAILY_CHECKIN: 5,           // 每日打卡
  STREAK_3_DAYS: 10,          // 连续3天
  STREAK_7_DAYS: 30,          // 连续7天
  STREAK_30_DAYS: 100,        // 连续30天
  UPDATE_PROGRESS: 10,        // 更新进度
  WATCH_VIDEO: 10,            // 看视频
  WATERING_GIVE: 5,           // 浇花（给予）
  WATERING_RECEIVE: 10,       // 浇花（接收）
  INVITE_FRIEND: 100,         // 邀请好友
  INVITEE_CHECKIN: 50,        // 被邀请人首次打卡
  ACHIEVEMENT: 50             // 成就奖励（基础）
};

// 成就列表
const ACHIEVEMENTS = {
  FIRST_DREAM: {
    id: 'first_dream',
    name: '初心者',
    desc: '创建第一个梦想',
    icon: '🌱',
    points: 50
  },
  STREAK_7: {
    id: 'streak_7',
    name: '坚持者',
    desc: '连续打卡7天',
    icon: '💪',
    points: 100
  },
  STREAK_30: {
    id: 'streak_30',
    name: '追梦人',
    desc: '连续打卡30天',
    icon: '🏆',
    points: 200
  },
  INVITE_5: {
    id: 'invite_5',
    name: '社交达人',
    desc: '邀请5位好友',
    icon: '🎉',
    points: 150
  },
  SKINS_10: {
    id: 'skins_10',
    name: '收藏家',
    desc: '解锁10个皮肤',
    icon: '✨',
    points: 100
  },
  WATERING_50: {
    id: 'watering_50',
    name: '助人为乐',
    desc: '给好友浇花50次',
    icon: '❤️',
    points: 100
  },
  DREAM_COMPLETE: {
    id: 'dream_complete',
    name: '梦想成真',
    desc: '完成一个梦想',
    icon: '👑',
    points: 200
  }
};

// 里程碑节点
const MILESTONES = [10, 25, 50, 75, 90, 100];

// 进度区间
const PROGRESS_RANGES = {
  START: { min: 0, max: 10, key: 'start' },
  EARLY: { min: 10, max: 30, key: 'early' },
  MIDDLE: { min: 30, max: 50, key: 'middle' },
  LATE: { min: 50, max: 80, key: 'late' },
  FINAL: { min: 80, max: 100, key: 'final' }
};

// 停滞提醒天数
const STAGNANT_DAYS = {
  WARNING: 7,      // 7天提醒
  ALERT: 14,       // 14天警告
  CRITICAL: 30     // 30天严重
};

// 浇花限制
const WATERING_LIMITS = {
  DAILY_GIVE: 3,      // 每天最多给3个好友浇花
  DAILY_RECEIVE: 3    // 每天最多被浇花3次
};

// 邀请码长度
const INVITE_CODE_LENGTH = 6;

// 排行榜类型
const LEADERBOARD_TYPES = {
  WEEK: 'week',
  MONTH: 'month',
  FRIENDS: 'friends'
};

module.exports = {
  DREAM_CATEGORIES,
  POINTS_RULES,
  ACHIEVEMENTS,
  MILESTONES,
  PROGRESS_RANGES,
  STAGNANT_DAYS,
  WATERING_LIMITS,
  INVITE_CODE_LENGTH,
  LEADERBOARD_TYPES
};
