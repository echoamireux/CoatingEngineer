/**
 * ============================================================
 * 涂布工程专家 - 统一历史记录管理
 * ============================================================
 * 集中管理所有模块的历史记录
 * ============================================================
 */

const STORAGE_KEY = 'app_history';
const MAX_RECORDS = 50; // 最大记录数

/**
 * 模块定义
 */
const MODULES = {
    cost: { name: '成本核算', icon: '💰' },
    coating: { name: '涂布生产计算', icon: '🏭' },
    fluid: { name: '流体力学', icon: '💧' },
    converter: { name: '单位换算', icon: '🔄' }
};

/**
 * 生成唯一 ID
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

/**
 * 格式化时间
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
 * 保存历史记录
 * @param {string} module - 模块标识 (coating/fluid/cost/converter)
 * @param {string} type - 计算类型
 * @param {Array} displayData - 显示用的 [{k, v}] 数组
 * @param {string} moduleNameOverride - 可选，自定义模块名称
 * @returns {string} 记录 ID
 */
function saveHistory(module, type, displayData, rawData, moduleNameOverride) {
    const record = {
        id: generateId(),
        module: module,
        type: type,
        moduleName: moduleNameOverride || MODULES[module]?.name || module,
        time: formatTime(),
        timestamp: Date.now(),
        data: displayData,
        rawData: rawData
    };

    let history = wx.getStorageSync(STORAGE_KEY) || [];
    history.unshift(record);

    // 限制最大记录数
    if (history.length > MAX_RECORDS) {
        history = history.slice(0, MAX_RECORDS);
    }

    wx.setStorageSync(STORAGE_KEY, history);
    return record.id;
}

/**
 * 获取历史记录
 * @param {string} module - 可选，按模块筛选
 * @returns {Array} 历史记录数组
 */
function getHistory(module) {
    const history = wx.getStorageSync(STORAGE_KEY) || [];
    if (module) {
        return history.filter(r => r.module === module);
    }
    return history;
}

/**
 * 获取所有模块选项（用于筛选 UI）
 */
function getModuleOptions() {
    return Object.entries(MODULES).map(([key, val]) => ({
        id: key,
        name: val.name,
        icon: val.icon
    }));
}

/**
 * 删除单条记录
 * @param {string} id - 记录 ID
 */
function deleteHistory(id) {
    let history = wx.getStorageSync(STORAGE_KEY) || [];
    history = history.filter(r => r.id !== id);
    wx.setStorageSync(STORAGE_KEY, history);
}

/**
 * 清空历史记录
 * @param {string} module - 可选，只清空指定模块
 */
function clearHistory(module) {
    if (module) {
        let history = wx.getStorageSync(STORAGE_KEY) || [];
        history = history.filter(r => r.module !== module);
        wx.setStorageSync(STORAGE_KEY, history);
    } else {
        wx.removeStorageSync(STORAGE_KEY);
    }
}

/**
 * 迁移旧数据到新格式
 * 用于兼容旧版本的历史记录
 */
function migrateOldHistory() {
    const migrated = wx.getStorageSync('history_migrated');
    if (migrated) return;

    let newHistory = [];

    // 迁移 calc_history (fluid)
    const fluidHistory = wx.getStorageSync('calc_history') || [];
    fluidHistory.forEach(r => {
        newHistory.push({
            id: generateId(),
            module: 'fluid',
            type: 'pressure',
            moduleName: '流体力学',
            time: r.time || formatTime(new Date(r.ts || Date.now())),
            timestamp: r.ts || Date.now(),
            data: r.data || [],
            rawData: r.rawData || r
        });
    });

    // 迁移 history_comp (coating)
    const compHistory = wx.getStorageSync('history_comp') || [];
    compHistory.forEach(r => {
        newHistory.push({
            id: generateId(),
            module: 'coating',
            type: 'composite',
            moduleName: '涂布卷材',
            time: r.dateStr || formatTime(new Date(r.ts || Date.now())),
            timestamp: r.ts || Date.now(),
            data: [{ k: '描述', v: r.desc }],
            rawData: r.params || r
        });
    });

    // 迁移 history_glue (coating)
    const glueHistory = wx.getStorageSync('history_glue') || [];
    glueHistory.forEach(r => {
        newHistory.push({
            id: generateId(),
            module: 'coating',
            type: 'glue',
            moduleName: '涂布卷材',
            time: r.dateStr || formatTime(new Date(r.ts || Date.now())),
            timestamp: r.ts || Date.now(),
            data: [{ k: '描述', v: r.desc }],
            rawData: r.params || r
        });
    });

    // 按时间排序
    newHistory.sort((a, b) => b.timestamp - a.timestamp);

    // 保存
    if (newHistory.length > 0) {
        wx.setStorageSync(STORAGE_KEY, newHistory);
    }

    // 标记已迁移
    wx.setStorageSync('history_migrated', true);
}

module.exports = {
    MODULES,
    saveHistory,
    getHistory,
    getModuleOptions,
    deleteHistory,
    clearHistory,
    migrateOldHistory
};
