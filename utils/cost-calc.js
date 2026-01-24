/**
 * ============================================================
 * 涂布工程专家 - 成本计算核心模块
 * ============================================================
 * 纯计算逻辑，不依赖 Page 上下文
 * ============================================================
 */

const { round } = require('./common');

/**
 * 计算胶水材料成本
 * @param {object} params - { price, solid, gsm, eff, toExFactor }
 * @returns {number} 成本 (元/m²)
 */
function calcGlueCost({ price, solid, gsm, eff, toExFactor = 1 }) {
    const P = parseFloat(price);
    const S = parseFloat(solid);
    const G = parseFloat(gsm);
    const E = parseFloat(eff) / 100;

    if (S <= 0 || E <= 0) return 0;

    // 公式: (干涂量 / 固含量% / 1000 / 利用率) × 单价 × 税率因子
    return (G / (S / 100) / 1000 / E) * P * toExFactor;
}

/**
 * 计算膜材成本
 * @param {object} params - { price, widthRaw, widthValid, toExFactor }
 * @returns {number} 成本 (元/m²)
 */
function calcFilmCost({ price, widthRaw, widthValid, toExFactor = 1 }) {
    const P = parseFloat(price) * toExFactor;
    const Wraw = parseFloat(widthRaw);
    const Wvalid = parseFloat(widthValid);

    if (Wraw <= 0 || Wvalid <= 0) return 0;

    // 公式: 单价 / (有效宽度 / 原始宽度)
    return P / (Wvalid / Wraw);
}

/**
 * 计算工艺成本
 * @param {object} params - { machRate, laborRate, speed, orderLen, wasteLen, refWidth }
 * @returns {number} 工艺成本 (元/m²)
 */
function calcProcessCost({ machRate, laborRate, speed, orderLen, wasteLen, refWidth }) {
    const mRate = parseFloat(machRate);
    const lRate = parseFloat(laborRate);
    const spd = parseFloat(speed);
    const oLen = parseFloat(orderLen);
    const wLen = parseFloat(wasteLen);
    const rw = parseFloat(refWidth);

    if (rw <= 0 || spd <= 0 || oLen <= 0) return 0;

    // 产出: 速度(m/min) × 60 × 宽度(m)
    const output = spd * 60 * (rw / 1000);
    // 损耗放大系数
    const scale = (oLen + wLen) / oLen;

    // 公式: (机台费 + 人工费) / 产出 × 放大系数
    return ((mRate + lRate) / output) * scale;
}

/**
 * 应用良率折算
 * @param {number} cost - 当前成本
 * @param {number} yieldPercent - 良率百分比 (0-100)
 * @returns {number} 折算后的成本
 */
function applyYield(cost, yieldPercent) {
    const yVal = parseFloat(yieldPercent);
    // 先校验原始值（0-100范围），再转换
    if (isNaN(yVal) || yVal <= 0 || yVal > 100) return cost;
    const y = yVal / 100;
    return cost / y;
}

/**
 * 计算税率转换因子
 * @param {string} taxMode - 'ex' 为不含税, 'inc' 为含税
 * @param {string} vatRate - 税率百分比
 * @returns {number} 转换因子
 */
function getTaxFactor(taxMode, vatRate) {
    const vat = parseFloat(vatRate) / 100 || 0.13;
    return taxMode === 'inc' ? (1 / (1 + vat)) : 1;
}

/**
 * 验证字段是否为空
 */
function validateField(val) {
    return !(val === undefined || val === null || val === '');
}

/**
 * 验证百分比字段 (0-100)
 * @returns {string|boolean} - true 有效, 'empty' 为空, 'range' 超范围
 */
function validatePercentage(val) {
    if (val === undefined || val === null || val === '') return 'empty';
    const num = parseFloat(val);
    if (isNaN(num) || num < 0 || num > 100) return 'range';
    return true;
}

module.exports = {
    calcGlueCost,
    calcFilmCost,
    calcProcessCost,
    applyYield,
    getTaxFactor,
    validateField,
    validatePercentage
};
