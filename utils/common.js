/**
 * ============================================================
 * 涂布工程专家 - 公共工具函数
 * ============================================================
 * 统一管理以下功能:
 * 1. 时间格式化
 * 2. 数值格式化 (科学计数法)
 * 3. 主题管理
 * ============================================================
 */

/**
 * 格式化时间为 YYYY/MM/DD HH:mm 格式
 * @param {Date} date - 日期对象，默认为当前时间
 * @returns {string} 格式化后的时间字符串
 */
function formatTime(date = new Date()) {
    const Y = date.getFullYear();
    const M = (date.getMonth() + 1).toString().padStart(2, '0');
    const D = date.getDate().toString().padStart(2, '0');
    const h = date.getHours().toString().padStart(2, '0');
    const m = date.getMinutes().toString().padStart(2, '0');
    return `${Y}/${M}/${D} ${h}:${m}`;
}

/**
 * 格式化数值，大数/小数自动转为科学计数法显示
 * @param {number} num - 要格式化的数值
 * @param {object} options - 配置选项
 * @returns {string} 格式化后的字符串，如 '1.23×10^6' 或 '123.45'
 */
function formatNumber(num, options = {}) {
    const { precision = 2, largeThreshold = 100000000 } = options;

    if (!isFinite(num) || isNaN(num)) return '-';
    if (Math.abs(num) === 0) return '0';

    if (Math.abs(num) > largeThreshold) {
        const str = num.toExponential(precision);
        const parts = str.split('e');
        return parts[0] + '×10^' + parts[1].replace('+', '');
    }

    return num.toFixed(precision);
}

/**
 * 格式化数值 (返回对象，用于流体力学页面)
 * @param {number} num
 * @returns {object} {b: 基数, p: 指数, s: 是否科学计数法}
 */
function formatNumberObj(num) {
    if (!isFinite(num) || isNaN(num)) return { b: '-', p: 0, s: false };
    const abs = Math.abs(num);
    if (abs === 0) return { b: '0.00', p: 0, s: false };

    if (abs > 10000 || abs < 0.01) {
        const str = num.toExponential(2);
        const parts = str.split('e');
        return { b: parts[0], p: parseInt(parts[1]), s: true };
    }
    return { b: num.toFixed(2), p: 0, s: false };
}

/**
 * 格式化数值 (单位换算专用，更高精度)
 */
function formatNumberConverter(num) {
    if (!isFinite(num) || isNaN(num)) return '';
    const abs = Math.abs(num);
    if (abs === 0) return '';

    if (abs > 100000 || abs < 0.001) {
        const str = num.toExponential(3);
        const parts = str.split('e');
        return parts[0] + '×10^' + parts[1].replace('+', '');
    }
    return Number(num.toPrecision(6)).toString();
}

/**
 * 解析可能包含科学计数法的字符串
 */
function parseNumber(str) {
    if (!str) return NaN;
    const s = str.toString().replace(/×10\^/g, 'e');
    return parseFloat(s);
}

/**
 * 更新导航栏颜色
 */
function updateNavBar(theme) {
    wx.setNavigationBarColor({
        frontColor: theme === 'dark' ? '#ffffff' : '#000000',
        backgroundColor: theme === 'dark' ? '#111827' : '#f3f4f6'
    });
}

/**
 * 切换主题
 */
function toggleTheme(page) {
    const newTheme = page.data.theme === 'dark' ? 'light' : 'dark';
    page.setData({ theme: newTheme });
    updateNavBar(newTheme);
    wx.setStorageSync('theme', newTheme);
    return newTheme;
}

/**
 * 初始化主题
 */
function initTheme(page, defaultTheme = 'dark') {
    const savedTheme = wx.getStorageSync('theme') || defaultTheme;
    page.setData({ theme: savedTheme });
    updateNavBar(savedTheme);
}

/**
 * 震动反馈
 */
function vibrateSuccess() {
    wx.vibrateShort({ type: 'light' });
}

/**
 * 四舍五入
 */
function round(num, scale = 6) {
    if (!num) return 0;
    return Math.round(num * Math.pow(10, scale)) / Math.pow(10, scale);
}

module.exports = {
    formatTime,
    formatNumber,
    formatNumberObj,
    formatNumberConverter,
    parseNumber,
    updateNavBar,
    toggleTheme,
    initTheme,
    vibrateSuccess,
    round
};
