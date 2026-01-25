/**
 * ============================================================
 * 涂布工程专家 - 核心函数单元测试
 * ============================================================
 * 测试覆盖范围:
 * 1. utils/common.js - formatNumber 系列
 * 2. utils/cost-calc.js - 成本计算函数
 * 3. utils/validator.js - 校验函数
 * ============================================================
 * 运行方式: 在微信开发者工具控制台执行 require('/tests/unit.test.js')
 */

// 导入被测试模块
const { formatNumber, formatNumberObj, debounce, parseNumber } = require('../utils/common')
const { calcGlueCost, calcFilmCost, calcProcessCost, applyYield, getTaxFactor } = require('../utils/cost-calc')
const { isEmpty, validateRequired, validatePercentage, validatePositive } = require('../utils/validator')

// 简易测试框架
let passCount = 0
let failCount = 0

function test(name, fn) {
  try {
    fn()
    passCount++
    console.log(`✅ ${name}`)
  } catch (e) {
    failCount++
    console.error(`❌ ${name}`)
    console.error(`   期望: ${e.expected}, 实际: ${e.actual}`)
  }
}

function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) {
        throw { expected, actual }
      }
    },
    toBeCloseTo(expected, precision = 2) {
      const factor = Math.pow(10, precision)
      if (Math.round(actual * factor) !== Math.round(expected * factor)) {
        throw { expected, actual }
      }
    },
    toBeTruthy() {
      if (!actual) throw { expected: 'truthy', actual }
    },
    toBeFalsy() {
      if (actual) throw { expected: 'falsy', actual }
    }
  }
}

// ============================================================
// 1. common.js 测试
// ============================================================
console.log('\n📁 Testing utils/common.js')

test('formatNumber 正常数值', () => {
  expect(formatNumber(123.456)).toBe('123.46')
})

test('formatNumber 零值', () => {
  expect(formatNumber(0)).toBe('0')
})

test('formatNumber NaN', () => {
  expect(formatNumber(NaN)).toBe('-')
})

test('formatNumber Infinity', () => {
  expect(formatNumber(Infinity)).toBe('-')
})

test('formatNumberObj 正常数值', () => {
  const result = formatNumberObj(123.45)
  expect(result.b).toBe('123.45')
  expect(result.s).toBe(false)
})

test('formatNumberObj 大数值转科学计数法', () => {
  const result = formatNumberObj(12345678)
  expect(result.s).toBe(true)
})

test('parseNumber 正常字符串', () => {
  expect(parseNumber('123.45')).toBe(123.45)
})

test('parseNumber 科学计数法字符串', () => {
  expect(parseNumber('1.23×10^6')).toBeCloseTo(1230000)
})

// ============================================================
// 2. cost-calc.js 测试
// ============================================================
console.log('\n📁 Testing utils/cost-calc.js')

test('calcGlueCost 正常计算', () => {
  const cost = calcGlueCost({
    price: 20,      // 20元/kg
    solid: 50,      // 50% 固含
    gsm: 5,         // 5g/m² 干涂量
    eff: 100,       // 100% 利用率
    toExFactor: 1
  })
  // 预期: (5 / 0.5 / 1000 / 1) * 20 = 0.2 元/m²
  expect(cost).toBeCloseTo(0.2)
})

test('calcGlueCost 固含为0返回0', () => {
  const cost = calcGlueCost({ price: 20, solid: 0, gsm: 5, eff: 100 })
  expect(cost).toBe(0)
})

test('calcFilmCost 正常计算', () => {
  const cost = calcFilmCost({
    price: 10,       // 10元/m²
    widthRaw: 1000,  // 原始宽度 1000mm
    widthValid: 900, // 有效宽度 900mm
    toExFactor: 1
  })
  // 预期: 10 / (900/1000) = 11.11 元/m²
  expect(cost).toBeCloseTo(11.11)
})

test('calcProcessCost 正常计算', () => {
  const cost = calcProcessCost({
    machRate: 1000,   // 1000元/小时 机台费
    laborRate: 500,   // 500元/小时 人工费
    speed: 10,        // 10m/min 线速
    orderLen: 1000,   // 1000m 订单长度
    wasteLen: 100,    // 100m 损耗长度
    refWidth: 1000    // 1000mm 涂宽
  })
  // 产出 = 10 * 60 * 1 = 600 m²/h
  // 放大系数 = 1100/1000 = 1.1
  // 成本 = (1000+500) / 600 * 1.1 = 2.75 元/m²
  expect(cost).toBeCloseTo(2.75)
})

test('applyYield 正常折算', () => {
  const result = applyYield(100, 80) // 80% 良率
  // 预期: 100 / 0.8 = 125
  expect(result).toBeCloseTo(125)
})

test('applyYield 无效良率返回原值', () => {
  expect(applyYield(100, 0)).toBe(100)
  expect(applyYield(100, 101)).toBe(100)
})

test('getTaxFactor 不含税模式', () => {
  expect(getTaxFactor('ex', '13')).toBe(1)
})

test('getTaxFactor 含税模式', () => {
  expect(getTaxFactor('inc', '13')).toBeCloseTo(0.885, 2)
})

// ============================================================
// 3. validator.js 测试
// ============================================================
console.log('\n📁 Testing utils/validator.js')

test('isEmpty 空字符串', () => {
  expect(isEmpty('')).toBeTruthy()
})

test('isEmpty null', () => {
  expect(isEmpty(null)).toBeTruthy()
})

test('isEmpty 非空值', () => {
  expect(isEmpty('hello')).toBeFalsy()
})

test('validateRequired 有效值', () => {
  const errors = {}
  expect(validateRequired('value', 'key', errors)).toBeTruthy()
})

test('validateRequired 空值', () => {
  const errors = {}
  expect(validateRequired('', 'key', errors)).toBeFalsy()
  expect(errors.key).toBeTruthy()
})

test('validatePercentage 有效范围', () => {
  const errors = {}
  expect(validatePercentage(50, 'key', errors)).toBeTruthy()
})

test('validatePercentage 超出范围', () => {
  const errors = {}
  expect(validatePercentage(101, 'key', errors)).toBeFalsy()
  expect(errors.key).toBe('range')
})

test('validatePositive 正数', () => {
  const errors = {}
  expect(validatePositive(10, 'key', errors)).toBeTruthy()
})

test('validatePositive 零', () => {
  const errors = {}
  expect(validatePositive(0, 'key', errors)).toBeFalsy()
})

// ============================================================
// 测试报告
// ============================================================
console.log('\n' + '='.repeat(50))
console.log(`📊 测试完成: ${passCount} 通过, ${failCount} 失败`)
console.log(`📈 覆盖率: ${Math.round(passCount / (passCount + failCount) * 100)}%`)
console.log('='.repeat(50))

module.exports = { passCount, failCount }
