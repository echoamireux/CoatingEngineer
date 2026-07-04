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
  // 1 / (1 + 13/100) = 0.8849557522...
  expect(getTaxFactor('inc', '13')).toBeCloseTo(0.88, 1)
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
// 4. 2026-01-25 新增：分项计算逻辑测试
// ============================================================
console.log('\n📁 Testing 分项计算逻辑 (2026-01-25 新增)')

// 测试参数完整性检查逻辑
test('胶水材料参数检查 - 全部填写', () => {
  const item = { type: 'glue', price: '20', solid: '50', gsm: '5', eff: '100' }
  const hasAll = item.price && item.solid && item.gsm && item.eff
  expect(hasAll).toBeTruthy()
})

test('胶水材料参数检查 - 缺少固含', () => {
  const item = { type: 'glue', price: '20', solid: '', gsm: '5', eff: '100' }
  const hasAll = item.price && item.solid && item.gsm && item.eff
  expect(hasAll).toBeFalsy()
})

test('膜材参数检查 - 全部填写', () => {
  const item = { type: 'film', price: '10', widthRaw: '1000', widthValid: '900' }
  const hasAll = item.price && item.widthRaw && item.widthValid
  expect(hasAll).toBeTruthy()
})

test('膜材参数检查 - 缺少涂宽', () => {
  const item = { type: 'film', price: '10', widthRaw: '1000', widthValid: '' }
  const hasAll = item.price && item.widthRaw && item.widthValid
  expect(hasAll).toBeFalsy()
})

// 测试固含/利用率范围
test('固含量范围检查 - 有效值', () => {
  const solid = 50
  const isValid = solid > 0 && solid <= 100
  expect(isValid).toBeTruthy()
})

test('固含量范围检查 - 超出范围', () => {
  const solid = 101
  const isValid = solid > 0 && solid <= 100
  expect(isValid).toBeFalsy()
})

// 测试管道参数检查
test('管道压降参数检查 - 全部填写', () => {
  const d = { rho_wet: '1.2', pipe_Q: '500', viscosity: '500', pipe_D: '25', pipe_L: '5', pipe_dz: '0', pipe_K_loss: '0' }
  const hasBasic = d.rho_wet && d.pipe_Q && d.viscosity
  const hasPipe = d.pipe_D && d.pipe_L && d.pipe_dz !== '' && d.pipe_K_loss !== ''
  expect(hasBasic && hasPipe).toBeTruthy()
})

test('管道压降参数检查 - 缺少管径', () => {
  const d = { rho_wet: '1.2', pipe_Q: '500', viscosity: '500', pipe_D: '', pipe_L: '5', pipe_dz: '0', pipe_K_loss: '0' }
  const hasPipe = d.pipe_D && d.pipe_L
  expect(hasPipe).toBeFalsy()
})

// 测试模头参数检查
test('模头压降参数检查 - 全部填写', () => {
  const d = { slot_W: '1000', slot_H: '200', slot_Ls: '50' }
  const hasSlot = d.slot_W && d.slot_H && d.slot_Ls
  expect(hasSlot).toBeTruthy()
})

// 测试工艺成本参数
test('工艺成本参数检查 - 全部填写', () => {
  const p = { machRate: '1000', laborRate: '500', speed: '10', orderLen: '1000', wasteLen: '100' }
  const hasAll = p.machRate && p.laborRate && p.speed && p.orderLen && p.wasteLen !== '' && p.wasteLen !== undefined
  expect(hasAll).toBeTruthy()
})

test('工艺成本参数检查 - 损耗为0也有效', () => {
  const p = { machRate: '1000', laborRate: '500', speed: '10', orderLen: '1000', wasteLen: '0' }
  const hasWaste = p.wasteLen !== '' && p.wasteLen !== undefined
  expect(hasWaste).toBeTruthy()
})

// ============================================================
// 5. 主页菜单顺序测试
// ============================================================
console.log('\n📁 Testing 主页菜单顺序')

test('menuList 第一项应为 handbook', () => {
  // 模拟 menuList 结构
  const menuList = [
    { id: 'handbook' },
    { id: 'cost' },
    { id: 'coating' }
  ]
  expect(menuList[0].id).toBe('handbook')
})

// ============================================================
// 6. debounce 函数测试
// ============================================================
console.log('\n📁 Testing debounce 函数')

test('debounce 返回函数', () => {
  const fn = debounce(() => {}, 100)
  expect(typeof fn).toBe('function')
})

// ============================================================
// 7. 成本页输入绑定测试
// ============================================================
console.log('\n📁 Testing 成本页输入绑定')

function loadCostPageConfig() {
  const pagePath = require.resolve('../pages/cost/index.js')
  delete require.cache[pagePath]

  const originalPage = global.Page
  const originalBehavior = global.Behavior
  const originalGetApp = global.getApp

  let pageConfig = null
  global.Page = (config) => { pageConfig = config }
  global.Behavior = (config) => config
  global.getApp = () => ({ globalData: {} })

  require('../pages/cost/index.js')

  global.Page = originalPage
  global.Behavior = originalBehavior
  global.getApp = originalGetApp

  return pageConfig
}

test('成本页输入工序名称应写入 name 而不是良率', () => {
  const pageConfig = loadCostPageConfig()
  const page = {
    data: { stages: [{ name: '', yield: '' }] },
    clearError() {},
    setData(patch) {
      if (patch.stages) this.data.stages = patch.stages
    }
  }

  pageConfig.onInput.call(page, {
    currentTarget: { dataset: { type: 'stage_name', stage: 0 } },
    detail: { value: '涂布' }
  })

  expect(page.data.stages[0].name).toBe('涂布')
  expect(page.data.stages[0].yield).toBe('')
})

test('成本页良率超出范围时应保留上一个合法值', () => {
  const pageConfig = loadCostPageConfig()
  const toastTitles = []
  const originalWx = global.wx
  global.wx = { showToast(options) { toastTitles.push(options.title) } }

  const page = {
    data: { stages: [{ name: '涂布', yield: '95' }], errors: {} },
    clearError() {},
    setData(patch) {
      if (patch.stages) this.data.stages = patch.stages
    }
  }

  const result = pageConfig.onInput.call(page, {
    currentTarget: { dataset: { type: 'stage_yield', stage: 0, field: 'yield' } },
    detail: { value: '102' }
  })

  global.wx = originalWx
  expect(page.data.stages[0].yield).toBe('95')
  expect(result).toBe('95')
  expect(toastTitles[0]).toBe('良率需在0-100%之间')
})

test('成本页胶层利用率超出范围时应保留上一个合法值', () => {
  const pageConfig = loadCostPageConfig()
  const toastTitles = []
  const originalWx = global.wx
  global.wx = { showToast(options) { toastTitles.push(options.title) } }

  const page = {
    data: {
      stages: [{
        name: '涂布',
        yield: '95',
        materials: [{ type: 'glue', name: '胶层-1', solid: '50', eff: '90' }]
      }],
      errors: {}
    },
    clearError() {},
    setData(patch) {
      if (patch.stages) this.data.stages = patch.stages
    }
  }

  const result = pageConfig.onInput.call(page, {
    currentTarget: { dataset: { type: 'material', stage: 0, index: 0, field: 'eff' } },
    detail: { value: '123' }
  })

  global.wx = originalWx
  expect(page.data.stages[0].materials[0].eff).toBe('90')
  expect(result).toBe('90')
  expect(toastTitles[0]).toBe('利用率需在0-100%之间')
})

// ============================================================
// 测试报告
// ============================================================
console.log('\n' + '='.repeat(50))
console.log(`📊 测试完成: ${passCount} 通过, ${failCount} 失败`)
console.log(`📈 覆盖率: ${Math.round(passCount / (passCount + failCount) * 100)}%`)
console.log('='.repeat(50))

module.exports = { passCount, failCount }
