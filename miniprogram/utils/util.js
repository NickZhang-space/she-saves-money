// 工具函数

/**
 * 格式化日期
 * @param {Date|string|number} date - 日期对象、时间戳或日期字符串
 * @param {string} format - 格式化模板，默认 'YYYY-MM-DD'
 * @returns {string} 格式化后的日期字符串
 */
function formatDate(date, format = 'YYYY-MM-DD') {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hour = String(d.getHours()).padStart(2, '0');
  const minute = String(d.getMinutes()).padStart(2, '0');
  const second = String(d.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hour)
    .replace('mm', minute)
    .replace('ss', second);
}

/**
 * 格式化金额（分转元）
 * @param {number} amount - 金额（分）
 * @param {boolean} showSymbol - 是否显示货币符号
 * @returns {string} 格式化后的金额
 */
function formatAmount(amount, showSymbol = true) {
  const yuan = (amount / 100).toFixed(2);
  return showSymbol ? `¥${yuan}` : yuan;
}

/**
 * 金额转分
 * @param {number} yuan - 金额（元）
 * @returns {number} 金额（分）
 */
function yuanToFen(yuan) {
  return Math.round(yuan * 100);
}

/**
 * 计算进度百分比
 * @param {number} current - 当前金额
 * @param {number} target - 目标金额
 * @returns {number} 进度百分比（0-100）
 */
function calculateProgress(current, target) {
  if (target <= 0) return 0;
  const progress = (current / target) * 100;
  return Math.min(Math.round(progress), 100);
}

/**
 * 计算预计实现天数
 * @param {number} remaining - 剩余金额
 * @param {number} avgDaily - 平均每日存入金额
 * @returns {number} 预计天数
 */
function calculateEstimatedDays(remaining, avgDaily) {
  if (avgDaily <= 0) return 999;
  return Math.ceil(remaining / avgDaily);
}

/**
 * 计算预计实现日期
 * @param {number} days - 预计天数
 * @returns {string} 预计日期 YYYY-MM-DD
 */
function calculateEstimatedDate(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return formatDate(date);
}

/**
 * 生活化金额对比
 * @param {number} amount - 金额（分）
 * @returns {string} 对比文案
 */
function amountComparison(amount) {
  const yuan = amount / 100;
  
  if (yuan >= 10000) {
    return `还差一部iPhone的价格`;
  } else if (yuan >= 5000) {
    return `还差一台MacBook的钱`;
  } else if (yuan >= 1000) {
    return `还差${Math.round(yuan / 500)}个口红的价格`;
  } else if (yuan >= 100) {
    return `还差${Math.round(yuan / 30)}杯奶茶的钱`;
  } else {
    return `还差一点点就能实现了`;
  }
}

/**
 * 随机选择数组元素
 * @param {Array} array - 数组
 * @returns {*} 随机元素
 */
function randomPick(array) {
  if (!array || array.length === 0) return null;
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * 模板字符串替换
 * @param {string} template - 模板字符串，如 "还有{days}天"
 * @param {Object} data - 数据对象，如 { days: 3 }
 * @returns {string} 替换后的字符串
 */
function templateReplace(template, data) {
  return template.replace(/{(\w+)}/g, (match, key) => {
    return data[key] !== undefined ? data[key] : match;
  });
}

/**
 * 生成随机邀请码
 * @param {number} length - 长度，默认6位
 * @returns {string} 邀请码
 */
function generateInviteCode(length = 6) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 去掉易混淆字符
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * 判断是否是今天
 * @param {Date|string} date - 日期
 * @returns {boolean}
 */
function isToday(date) {
  const d = new Date(date);
  const today = new Date();
  return d.getFullYear() === today.getFullYear() &&
         d.getMonth() === today.getMonth() &&
         d.getDate() === today.getDate();
}

/**
 * 计算两个日期之间的天数
 * @param {Date|string} date1 - 日期1
 * @param {Date|string} date2 - 日期2
 * @returns {number} 天数差
 */
function daysBetween(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diff = Math.abs(d2 - d1);
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/**
 * 获取本月第一天
 * @returns {string} YYYY-MM-DD
 */
function getMonthFirstDay() {
  const date = new Date();
  date.setDate(1);
  return formatDate(date);
}

/**
 * 获取本月最后一天
 * @returns {string} YYYY-MM-DD
 */
function getMonthLastDay() {
  const date = new Date();
  date.setMonth(date.getMonth() + 1);
  date.setDate(0);
  return formatDate(date);
}

/**
 * 获取本周第一天（周一）
 * @returns {string} YYYY-MM-DD
 */
function getWeekFirstDay() {
  const date = new Date();
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  return formatDate(date);
}

/**
 * 防抖函数
 * @param {Function} func - 要执行的函数
 * @param {number} wait - 等待时间（毫秒）
 * @returns {Function}
 */
function debounce(func, wait = 300) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

/**
 * 节流函数
 * @param {Function} func - 要执行的函数
 * @param {number} wait - 等待时间（毫秒）
 * @returns {Function}
 */
function throttle(func, wait = 300) {
  let timeout;
  return function(...args) {
    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null;
        func.apply(this, args);
      }, wait);
    }
  };
}

/**
 * 显示加载提示
 * @param {string} title - 提示文字
 */
function showLoading(title = '加载中...') {
  wx.showLoading({
    title,
    mask: true
  });
}

/**
 * 隐藏加载提示
 */
function hideLoading() {
  wx.hideLoading();
}

/**
 * 显示成功提示
 * @param {string} title - 提示文字
 */
function showSuccess(title) {
  wx.showToast({
    title,
    icon: 'success',
    duration: 2000
  });
}

/**
 * 显示错误提示
 * @param {string} title - 提示文字
 */
function showError(title) {
  wx.showToast({
    title,
    icon: 'none',
    duration: 2000
  });
}

module.exports = {
  formatDate,
  formatAmount,
  yuanToFen,
  calculateProgress,
  calculateEstimatedDays,
  calculateEstimatedDate,
  amountComparison,
  randomPick,
  templateReplace,
  generateInviteCode,
  isToday,
  daysBetween,
  getMonthFirstDay,
  getMonthLastDay,
  getWeekFirstDay,
  debounce,
  throttle,
  showLoading,
  hideLoading,
  showSuccess,
  showError
};
