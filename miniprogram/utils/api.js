// API 封装 - 适配小D的 dbOperations 云函数
const { showLoading, hideLoading, showError } = require('./util.js');

// 云开发初始化（在 app.js 中调用）
let cloud;
let db;

function initCloud(envId) {
  cloud = wx.cloud;
  cloud.init({
    env: envId,
    traceUser: true
  });
  db = cloud.database();
}

/**
 * 调用 dbOperations 云函数
 */
async function callDbOperation(action, data = {}) {
  try {
    const res = await cloud.callFunction({
      name: 'dbOperations',
      data: {
        action,
        data
      }
    });
    return res.result;
  } catch (err) {
    console.error(`dbOperations ${action} 调用失败:`, err);
    showError('操作失败，请重试');
    throw err;
  }
}

/**
 * 用户相关 API
 */
const UserAPI = {
  // 获取用户信息
  async getUserInfo(openid) {
    return await callDbOperation('getUser', { openid });
  },

  // 更新用户信息
  async updateUserInfo(openid, userInfo) {
    return await callDbOperation('updateUser', { openid, userInfo });
  }
};

/**
 * 梦想相关 API
 */
const DreamAPI = {
  // 获取梦想列表
  async getDreamList(openid) {
    return await callDbOperation('getUserDreams', { openid });
  },

  // 获取梦想详情
  async getDreamDetail(dreamId) {
    return await callDbOperation('getDream', { dreamId });
  },

  // 创建梦想
  async createDream(openid, dreamData) {
    return await callDbOperation('createDream', { openid, dreamData });
  },

  // 更新进度
  async updateProgress(dreamId, amount) {
    return await callDbOperation('updateDreamProgress', { dreamId, amount });
  },

  // 完成梦想
  async completeDream(dreamId) {
    return await callDbOperation('completeDream', { dreamId });
  },

  // 归档梦想
  async archiveDream(dreamId) {
    return await callDbOperation('archiveDream', { dreamId });
  }
};

/**
 * 打卡相关 API
 */
const CheckinAPI = {
  // 每日打卡
  async checkin(openid, savedAmount = 0, note = '') {
    return await callDbOperation('checkin', { openid, savedAmount, note });
  },

  // 获取打卡记录
  async getCheckinHistory(openid, month) {
    return await callDbOperation('getCheckinHistory', { openid, month });
  },

  // 获取打卡统计
  async getCheckinStats(openid) {
    return await callDbOperation('getCheckinStats', { openid });
  }
};

/**
 * 梦想分相关 API
 */
const PointsAPI = {
  // 获取梦想分流水
  async getPointsLog(openid, page = 1, limit = 20) {
    return await callDbOperation('getPointsLog', { openid, page, limit });
  },

  // 消费梦想分
  async spendPoints(openid, amount, reason, relatedId = null) {
    return await callDbOperation('spendPoints', { openid, amount, reason, relatedId });
  },

  // 看视频赚梦想分
  async watchVideo(openid) {
    return await callDbOperation('watchVideo', { openid });
  }
};

/**
 * 好友相关 API
 */
const FriendAPI = {
  // 获取好友列表
  async getFriendList(openid) {
    return await callDbOperation('getFriends', { openid });
  },

  // 通过邀请码添加好友
  async addFriend(openid, inviteCode) {
    return await callDbOperation('addFriend', { openid, inviteCode });
  },

  // 获取好友梦想进度
  async getFriendDreams(openid, friendOpenid) {
    return await callDbOperation('getFriendDreams', { openid, friendOpenid });
  }
};

/**
 * 浇花相关 API
 */
const WateringAPI = {
  // 给好友浇花
  async watering(openid, friendOpenid) {
    return await callDbOperation('watering', { openid, friendOpenid });
  },

  // 获取今日浇花次数
  async getTodayWateringCount(openid) {
    return await callDbOperation('getTodayWateringCount', { openid });
  },

  // 获取浇花记录
  async getWateringLog(openid, page = 1, limit = 20) {
    return await callDbOperation('getWateringLog', { openid, page, limit });
  }
};

/**
 * 排行榜相关 API
 */
const LeaderboardAPI = {
  // 获取排行榜
  async getLeaderboard(type = 'week', page = 1, limit = 50) {
    return await callDbOperation('getLeaderboard', { type, page, limit });
  },

  // 获取我的排名
  async getMyRank(openid, type = 'week') {
    return await callDbOperation('getMyRank', { openid, type });
  },

  // 获取好友排行榜
  async getFriendsLeaderboard(openid) {
    return await callDbOperation('getFriendsLeaderboard', { openid });
  }
};

/**
 * 成就相关 API
 */
const AchievementAPI = {
  // 获取成就列表
  async getAchievements(openid) {
    return await callDbOperation('getAchievements', { openid });
  },

  // 检查并解锁成就
  async checkAchievements(openid) {
    return await callDbOperation('checkAchievements', { openid });
  }
};

/**
 * 邀请相关 API
 */
const InviteAPI = {
  // 生成邀请码
  async generateInviteCode(openid) {
    return await callDbOperation('generateInviteCode', { openid });
  },

  // 获取邀请统计
  async getInviteStats(openid) {
    return await callDbOperation('getInviteStats', { openid });
  }
};

/**
 * 皮肤相关 API
 */
const SkinAPI = {
  // 获取皮肤列表
  async getSkinList() {
    return await callDbOperation('getSkinList', {});
  },

  // 解锁皮肤
  async unlockSkin(openid, skinId) {
    return await callDbOperation('unlockSkin', { openid, skinId });
  },

  // 切换皮肤
  async switchSkin(openid, skinId) {
    return await callDbOperation('switchSkin', { openid, skinId });
  },

  // 获取我的皮肤
  async getMySkins(openid) {
    return await callDbOperation('getMySkins', { openid });
  }
};

/**
 * 上传图片到云存储
 */
async function uploadImage(filePath, cloudPath) {
  try {
    showLoading('上传中...');
    const res = await cloud.uploadFile({
      cloudPath,
      filePath
    });
    hideLoading();
    return res.fileID;
  } catch (err) {
    hideLoading();
    console.error('图片上传失败:', err);
    showError('图片上传失败');
    throw err;
  }
}

/**
 * 删除云存储文件
 */
async function deleteFile(fileID) {
  try {
    await cloud.deleteFile({
      fileList: [fileID]
    });
  } catch (err) {
    console.error('文件删除失败:', err);
  }
}

module.exports = {
  initCloud,
  callDbOperation,
  UserAPI,
  DreamAPI,
  CheckinAPI,
  PointsAPI,
  FriendAPI,
  WateringAPI,
  LeaderboardAPI,
  AchievementAPI,
  InviteAPI,
  SkinAPI,
  uploadImage,
  deleteFile
};
