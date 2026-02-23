// AI 文案库
const { randomPick, templateReplace } = require('./util.js');
const { PROGRESS_RANGES } = require('./constants.js');

// 1. 每日问候
const morningGreetings = [
  "早安，今天也要为梦想努力哦 ☀️",
  "新的一天开始了，你的梦想在等你 🌅",
  "早上好！今天又是充满希望的一天",
  "美好的早晨，记得为梦想存一点点 💰",
  "早安！坚持就是胜利，加油 💪",
  "新的一天，新的开始，继续加油 🌟",
  "早上好！你离梦想又近了一步",
  "早安！今天也要做最棒的自己 ✨",
  "美好的一天从打卡开始 📅",
  "早上好！你的努力不会白费 🌈"
];

const eveningReminders = [
  "今天你存钱了吗？💰",
  "睡前别忘了打卡哦 🌙",
  "今天有为梦想努力吗？",
  "晚安，记得打卡再睡 😴",
  "今天的进度更新了吗？",
  "睡前看看你的梦想进度吧 ✨",
  "今天又是充实的一天吗？",
  "晚安，明天继续加油 🌟",
  "今天的小目标完成了吗？",
  "睡前打个卡，明天更有动力 💪"
];

// 2. 打卡文案
const checkinMessages = [
  "打卡成功！+5梦想分 ✨",
  "今天也很棒！继续保持 💪",
  "又坚持了一天，真棒 🎉",
  "你的坚持让我感动 ❤️",
  "每一天的努力都算数 📈",
  "打卡成功！梦想又近了一步",
  "坚持就是胜利！加油 🔥",
  "你做得很好，继续加油",
  "又是充实的一天 ⭐",
  "你的努力我都看到了 👀"
];

const streakMessages = {
  3: [
    "连续3天！你真棒！+10分 🎉",
    "3天连续打卡达成！继续保持 💪",
    "坚持3天了，习惯正在养成 ✨"
  ],
  7: [
    "连续7天！太厉害了！+30分 🏆",
    "一周连续打卡！你是最棒的 🌟",
    "7天坚持不懈，你做到了 🎊"
  ],
  30: [
    "连续30天！你是真正的追梦人！+100分 👑",
    "一个月的坚持，你创造了奇迹 🎆",
    "30天连续打卡，你太强了 💎"
  ]
};

// 3. 进度更新文案
const progressMessages = {
  start: [
    "梦想的种子已发芽 🌱",
    "万事开头难，你已经迈出第一步了",
    "好的开始是成功的一半 ✨",
    "种子已经种下，静待花开 🌸",
    "起步阶段，慢慢来不着急"
  ],
  early: [
    "你比80%的人更接近梦想 📊",
    "进度不错，继续保持 💪",
    "你已经超越了大多数人",
    "这个速度很棒，加油 🚀",
    "你的努力开始有回报了"
  ],
  middle: [
    "已经过半了，加油！💪",
    "坚持到现在真的不容易 ❤️",
    "你已经走了一半的路了",
    "继续保持，胜利在望 🎯",
    "你的坚持让我佩服"
  ],
  late: [
    "胜利在望，别放弃 🏁",
    "你已经走了大半路程了",
    "坚持住，马上就要成功了 💎",
    "最后的冲刺阶段，加油 🔥",
    "你离梦想越来越近了"
  ],
  final: [
    "马上就能实现了！🎉",
    "最后一点点了，冲刺！🚀",
    "胜利就在眼前，加油 👑",
    "你马上就要成功了 ✨",
    "再坚持一下，梦想触手可及"
  ]
};

const amountUpdateMessages = [
  "太棒了！今天又存了{amount}元 💰",
  "我看到你的努力了，继续加油 ❤️",
  "又进步了{amount}元，真棒 ✨",
  "每一分钱都是你的努力 💪",
  "你的坚持会有回报的 🌟",
  "又向梦想靠近了一步 📈",
  "这个速度很不错 🚀",
  "你做得很好，继续保持 👍",
  "又存了{amount}元，真棒 🎉",
  "你的努力我都看在眼里 👀"
];

// 4. 里程碑庆祝
const milestoneMessages = {
  10: [
    "10%达成！梦想启航 🚀",
    "第一个里程碑！继续加油 🎉",
    "10%完成，你真棒 ⭐"
  ],
  25: [
    "四分之一完成！你太棒了 🎊",
    "25%达成！继续保持 💪",
    "已经完成四分之一了 ✨"
  ],
  50: [
    "过半了！你做到了 🎆",
    "50%达成！胜利在望 🏆",
    "一半完成，继续冲刺 🔥"
  ],
  75: [
    "75%达成！马上就要成功了 👑",
    "四分之三完成！最后冲刺 🚀",
    "你离梦想只差一步了 💎"
  ],
  90: [
    "90%达成！胜利就在眼前 🎉",
    "最后10%了，加油 💪",
    "你马上就要成功了 ✨"
  ],
  100: [
    "恭喜你！梦想成真了！🎊🎉",
    "你做到了，我为你骄傲 👑",
    "梦想实现！你太棒了 💎",
    "成功了！你的努力没有白费 🌟",
    "梦想成真的感觉怎么样？🎆"
  ]
};

// 5. 进度停滞提醒
const stagnantMessages = {
  7: [
    "最近是不是遇到困难了？💭",
    "好久没看到你更新了，还好吗？",
    "需要调整一下目标吗？",
    "别灰心，慢慢来也没关系 ❤️",
    "遇到困难了吗？我陪你一起面对"
  ],
  14: [
    "两周没更新了，要不要调整一下计划？",
    "梦想还在，只是暂时休息一下对吗？",
    "需要帮助吗？我一直在这里 💙",
    "别放弃，你已经走了这么远了",
    "休息够了就继续吧，我等你 ⏰"
  ],
  30: [
    "一个月了，梦想还在等你回来 🌙",
    "要不要换个更适合的目标？",
    "没关系，重新开始也不晚 🌅",
    "你的梦想一直在这里，随时可以继续",
    "别给自己太大压力，慢慢来 🌸"
  ]
};

// 6. 接近目标文案
const nearGoalMessages = [
  "还有{amount}元就能实现了，坚持住！💪",
  "胜利在望，最后冲刺！🚀",
  "就差一点点了，加油 🔥",
  "你马上就要成功了 ✨",
  "最后的关头，别放弃 👑"
];

const nearDateMessages = [
  "还有{days}天，你能做到的 💪",
  "最后{days}天了，冲刺 🚀",
  "倒计时{days}天，加油 ⏰",
  "就快到了，坚持住 ✨"
];

// 7. 社交互动文案
const wateringMessages = {
  giver: [
    "你给{friend}浇了花 +5分 💧",
    "帮助好友也能获得奖励 ✨",
    "你的鼓励很温暖 ❤️"
  ],
  receiver: [
    "{friend}给你浇了花 +10分 🌸",
    "好友的鼓励让你更有动力 💪",
    "有人在默默支持你 ❤️"
  ]
};

const inviteMessages = {
  inviter: [
    "成功邀请{friend} +100分 🎉",
    "又多了一个追梦伙伴 ✨",
    "你的分享很有价值 👍"
  ],
  invitee: [
    "通过{friend}的邀请加入 +50分 🎁",
    "开始你的追梦之旅吧 🚀",
    "欢迎加入我们 ❤️"
  ]
};

// 8. 成就解锁文案
const achievementMessages = {
  first_dream: "解锁成就：初心者 🌱 创建了第一个梦想",
  streak_7: "解锁成就：坚持者 💪 连续打卡7天",
  streak_30: "解锁成就：追梦人 🏆 连续打卡30天",
  invite_5: "解锁成就：社交达人 🎉 邀请5位好友",
  skins_10: "解锁成就：收藏家 ✨ 解锁10个皮肤",
  watering_50: "解锁成就：助人为乐 ❤️ 给好友浇花50次",
  dream_complete: "解锁成就：梦想成真 👑 完成一个梦想"
};

/**
 * 获取进度区间
 */
function getProgressRange(progress) {
  if (progress < 10) return 'start';
  if (progress < 30) return 'early';
  if (progress < 50) return 'middle';
  if (progress < 80) return 'late';
  return 'final';
}

/**
 * 获取打卡文案
 */
function getCheckinMessage(streakDays) {
  if (streakDays === 3 || streakDays === 7 || streakDays === 30) {
    return randomPick(streakMessages[streakDays]);
  }
  return randomPick(checkinMessages);
}

/**
 * 获取进度更新文案
 */
function getProgressMessage(progress, amount) {
  const range = getProgressRange(progress);
  const message = randomPick(progressMessages[range]);
  
  if (amount) {
    const amountMessage = randomPick(amountUpdateMessages);
    return templateReplace(amountMessage, { amount: (amount / 100).toFixed(0) });
  }
  
  return message;
}

/**
 * 获取里程碑文案
 */
function getMilestoneMessage(percent) {
  return randomPick(milestoneMessages[percent]);
}

/**
 * 获取停滞提醒文案
 */
function getStagnantMessage(days) {
  if (days >= 30) return randomPick(stagnantMessages[30]);
  if (days >= 14) return randomPick(stagnantMessages[14]);
  return randomPick(stagnantMessages[7]);
}

/**
 * 获取接近目标文案
 */
function getNearGoalMessage(remainingAmount, remainingDays) {
  if (remainingAmount < 100000) { // 小于1000元
    const message = randomPick(nearGoalMessages);
    return templateReplace(message, { amount: (remainingAmount / 100).toFixed(0) });
  }
  
  if (remainingDays < 3) {
    const message = randomPick(nearDateMessages);
    return templateReplace(message, { days: remainingDays });
  }
  
  return null;
}

/**
 * 获取浇花文案
 */
function getWateringMessage(type, friendName) {
  const message = randomPick(wateringMessages[type]);
  return templateReplace(message, { friend: friendName });
}

/**
 * 获取邀请文案
 */
function getInviteMessage(type, friendName) {
  const message = randomPick(inviteMessages[type]);
  return templateReplace(message, { friend: friendName });
}

/**
 * 获取成就文案
 */
function getAchievementMessage(achievementId) {
  return achievementMessages[achievementId];
}

/**
 * 获取早安问候
 */
function getMorningGreeting() {
  return randomPick(morningGreetings);
}

/**
 * 获取晚安提醒
 */
function getEveningReminder() {
  return randomPick(eveningReminders);
}

module.exports = {
  getCheckinMessage,
  getProgressMessage,
  getMilestoneMessage,
  getStagnantMessage,
  getNearGoalMessage,
  getWateringMessage,
  getInviteMessage,
  getAchievementMessage,
  getMorningGreeting,
  getEveningReminder
};
