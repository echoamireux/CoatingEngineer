/**
 * ============================================================
 * 涂布工程专家 - 表单验证工具
 * ============================================================
 * 统一的表单验证功能
 * ============================================================
 */

/**
 * 验证字段是否为空
 * @param {*} val - 要验证的值
 * @returns {boolean} - true 为有效，false 为无效
 */
function isEmpty(val) {
    return val === undefined || val === null || val === '';
}

/**
 * 验证必填字段并记录错误
 * @param {*} val - 要验证的值
 * @param {string} key - 错误标识键
 * @param {object} errObj - 错误对象（会被修改）
 * @returns {boolean} - true 为有效，false 为无效
 */
function validateRequired(val, key, errObj) {
    if (isEmpty(val)) {
        errObj[key] = true;
        return false;
    }
    return true;
}

/**
 * 验证百分比字段 (0-100)
 * @param {*} val - 要验证的值
 * @param {string} key - 错误标识键
 * @param {object} errObj - 错误对象（会被修改）
 * @returns {boolean} - true 为有效，false 为无效
 */
function validatePercentage(val, key, errObj) {
    // 先检查是否为空
    if (isEmpty(val)) {
        errObj[key] = true;
        return false;
    }

    // 检查数值范围
    const num = parseFloat(val);
    if (isNaN(num) || num < 0 || num > 100) {
        errObj[key] = 'range'; // 标记为范围错误
        return false;
    }
    return true;
}

/**
 * 验证正数
 * @param {*} val - 要验证的值
 * @param {string} key - 错误标识键
 * @param {object} errObj - 错误对象（会被修改）
 * @returns {boolean} - true 为有效，false 为无效
 */
function validatePositive(val, key, errObj) {
    if (isEmpty(val)) {
        errObj[key] = true;
        return false;
    }

    const num = parseFloat(val);
    if (isNaN(num) || num <= 0) {
        errObj[key] = 'positive';
        return false;
    }
    return true;
}

/**
 * 检查错误对象中是否包含范围错误
 * @param {object} errObj - 错误对象
 * @returns {boolean}
 */
function hasRangeError(errObj) {
    return Object.values(errObj).includes('range');
}

/**
 * 检查错误对象中是否有任何错误
 * @param {object} errObj - 错误对象
 * @returns {boolean}
 */
function hasAnyError(errObj) {
    return Object.keys(errObj).length > 0;
}

/**
 * 批量验证多个字段
 * @param {object} data - 数据对象
 * @param {Array<{field: string, key: string, type: string}>} rules - 验证规则
 * @param {object} errObj - 错误对象
 * @returns {boolean} - 所有字段是否都有效
 */
function validateFields(data, rules, errObj) {
    let allValid = true;

    rules.forEach(rule => {
        const val = data[rule.field];
        let valid = true;

        switch (rule.type) {
            case 'required':
                valid = validateRequired(val, rule.key, errObj);
                break;
            case 'percentage':
                valid = validatePercentage(val, rule.key, errObj);
                break;
            case 'positive':
                valid = validatePositive(val, rule.key, errObj);
                break;
            default:
                valid = validateRequired(val, rule.key, errObj);
        }

        if (!valid) allValid = false;
    });

    return allValid;
}

module.exports = {
    isEmpty,
    validateRequired,
    validatePercentage,
    validatePositive,
    hasRangeError,
    hasAnyError,
    validateFields
};
