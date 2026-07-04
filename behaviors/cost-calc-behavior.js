/**
 * ============================================================
 * 成本计算 Behavior - 核心计算逻辑
 * ============================================================
 * 包含材料成本、工艺成本、累计成本的计算方法
 * ============================================================
 */

const { calcGlueCost, calcFilmCost, calcProcessCost, getTaxFactor } = require('../utils/cost-calc')
const { validateRequired, validatePercentage: vPercent } = require('../utils/validator')

module.exports = Behavior({
  methods: {
    // 使用 validator.js 的函数
    validateField(val, key, errObj) {
      return validateRequired(val, key, errObj)
    },

    validatePercentage(val, key, errObj) {
      return vPercent(val, key, errObj)
    },

    // ★★★ 辅助函数：实时更新材料小计 ★★★
    _updateStageMatSum(stageIdx) {
      const list = this.data.stages
      const stage = list[stageIdx]
      let sum = 0
      stage.materials.forEach(m => {
        if (m.cost && !isNaN(parseFloat(m.cost))) {
          sum += parseFloat(m.cost)
        }
      })
      const key = `stages[${stageIdx}].stageMatCost`
      this.setData({ [key]: sum.toFixed(2) })
    },

    // ★★★ 计算单个材料成本 ★★★
    calcMaterialItem(e) {
      const { stage, index } = e.currentTarget.dataset
      const list = this.data.stages
      const item = list[stage].materials[index]
      const toExFactor = getTaxFactor(this.data.taxMode, this.data.vatRate)

      let currentErrors = {}
      let isValid = true
      let cost = 0

      // 1. 基础价格校验
      if (!this.validateField(item.price, `s${stage}_m${index}_price`, currentErrors)) isValid = false

      if (item.type === 'glue') {
        // 2. 胶水参数校验
        if (!this.validatePercentage(item.solid, `s${stage}_m${index}_solid`, currentErrors)) isValid = false
        if (!this.validateField(item.gsm, `s${stage}_m${index}_gsm`, currentErrors)) isValid = false
        if (!this.validatePercentage(item.eff, `s${stage}_m${index}_eff`, currentErrors)) isValid = false

        if (isValid) {
          cost = calcGlueCost({ price: item.price, solid: item.solid, gsm: item.gsm, eff: item.eff, toExFactor })
        }
      } else {
        // 3. 膜材参数校验
        if (!this.validateField(item.widthRaw, `s${stage}_m${index}_widthRaw`, currentErrors)) isValid = false
        if (!this.validateField(item.widthValid, `s${stage}_m${index}_widthValid`, currentErrors)) isValid = false
        if (isValid) {
          cost = calcFilmCost({ price: item.price, widthRaw: item.widthRaw, widthValid: item.widthValid, toExFactor })
        }
      }

      this.setData({ errors: currentErrors })

      // 4. 错误处理与级联重置
      if (!isValid) {
        this.setData({
          [`stages[${stage}].materials[${index}].cost`]: '-',
          [`stages[${stage}].stageTotalCost`]: '-',
          [`stages[${stage}].accumCost`]: '-'
        }, () => {
          this._updateStageMatSum(stage)
        })

        const errorValues = Object.values(currentErrors)
        if (errorValues.includes('range')) {
          return wx.showToast({ title: '数值需在0-100之间', icon: 'none' })
        } else {
          return wx.showToast({ title: '红色项必填', icon: 'none' })
        }
      }

      const costStr = cost.toFixed(2)
      const key = `stages[${stage}].materials[${index}].cost`

      this.setData({ [key]: costStr }, () => {
        this._updateStageMatSum(stage)
      })

      wx.showToast({ title: '已更新', icon: 'success', duration: 800 })
    },

    // ★★★ 计算单个工艺成本 ★★★
    calcProcessItem(e) {
      const { stage } = e.currentTarget.dataset
      const list = this.data.stages
      const p = list[stage].process

      // 1. 基础校验
      let currentErrors = {}
      let isValid = true

      if (!this.validateField(p.machRate, `s${stage}_proc_machRate`, currentErrors)) isValid = false
      if (!this.validateField(p.laborRate, `s${stage}_proc_laborRate`, currentErrors)) isValid = false
      if (!this.validateField(p.speed, `s${stage}_proc_speed`, currentErrors)) isValid = false
      if (!this.validateField(p.orderLen, `s${stage}_proc_orderLen`, currentErrors)) isValid = false
      if (!this.validateField(p.wasteLen, `s${stage}_proc_wasteLen`, currentErrors)) isValid = false

      this.setData({ errors: currentErrors })

      // 错误弹窗提示
      const errorValues = Object.values(currentErrors)
      if (errorValues.includes('range')) {
        this.setData({ [`stages[${stage}].stageProcCost`]: '-' })
        return wx.showToast({ title: '数值需在0-100之间', icon: 'none' })
      } else if (!isValid) {
        this.setData({ [`stages[${stage}].stageProcCost`]: '-' })
        return wx.showToast({ title: '红色项必填', icon: 'none' })
      }

      // 2. 向上寻找有效的"膜宽"
      let refWidth = 0
      for (let i = parseInt(stage); i >= 0; i--) {
        const foundMat = list[i].materials.find(m => m.type === 'film' && m.widthValid && parseFloat(m.widthValid) > 0)
        if (foundMat) {
          refWidth = parseFloat(foundMat.widthValid)
          break
        }
      }

      if (refWidth === 0) {
        this.setData({ [`stages[${stage}].stageProcCost`]: '-' })
        return wx.showToast({ title: '未找到有效涂宽(膜宽)', icon: 'none' })
      }

      // 3. 计算逻辑
      const Rm = parseFloat(p.machRate) || 0
      const Rl = parseFloat(p.laborRate) || 0
      const V = parseFloat(p.speed) || 0
      const Lo = parseFloat(p.orderLen) || 0
      const Lw = parseFloat(p.wasteLen) || 0

      const hourlyOutput = V * 60 * (refWidth / 1000)

      let cost = 0
      if (hourlyOutput > 0 && Lo > 0) {
        const baseCost = (Rm + Rl) / hourlyOutput
        const scale = (Lo + Lw) / Lo
        cost = baseCost * scale

        const costStr = cost.toFixed(2)
        this.setData({ [`stages[${stage}].stageProcCost`]: costStr })
        wx.showToast({ title: '已更新', icon: 'success', duration: 800 })
      } else {
        this.setData({
          [`stages[${stage}].stageProcCost`]: '-',
          [`stages[${stage}].stageTotalCost`]: '-',
          [`stages[${stage}].accumCost`]: '-'
        })
        wx.showToast({ title: '参数无效(速度/长度需>0)', icon: 'none' })
      }
    },

    // ★★★ 寻找有效膜宽的辅助方法 ★★★
    _findRefWidth(stages, fromStageIdx) {
      for (let i = fromStageIdx; i >= 0; i--) {
        const foundMat = stages[i].materials.find(m => m.type === 'film' && m.widthValid && parseFloat(m.widthValid) > 0)
        if (foundMat) {
          return parseFloat(foundMat.widthValid)
        }
      }
      return 0
    },

    // ★★★ 计算单个工序的材料+工艺总成本 ★★★
    _calcSingleStageCost(stage, stageIdx, toExFactor) {
      let matHasError = false
      let stageMatSum = 0

      // 计算材料成本
      stage.materials.forEach((m) => {
        let c = 0
        let valid = true

        if (!m.price || m.price === '') valid = false

        if (m.type === 'glue') {
          if (!m.solid || !m.gsm || !m.eff) valid = false
          const solidVal = parseFloat(m.solid)
          const effVal = parseFloat(m.eff)
          if (valid && (solidVal <= 0 || solidVal > 100 || effVal <= 0 || effVal > 100)) valid = false

          if (valid) {
            const E = effVal / 100
            c = (parseFloat(m.gsm) / (solidVal / 100) / 1000 / E) * parseFloat(m.price) * toExFactor
          }
        } else {
          if (!m.widthRaw || !m.widthValid) valid = false
          if (valid) {
            c = (parseFloat(m.price) * toExFactor) / (parseFloat(m.widthValid) / parseFloat(m.widthRaw))
          }
        }

        if (!valid) {
          matHasError = true
          m.cost = '-'
        } else {
          m.cost = c.toFixed(2)
          stageMatSum += c
        }
      })

      // 计算工艺成本
      const p = stage.process
      let procHasError = false
      let procCost = 0

      if (!p.machRate || !p.laborRate || !p.speed || !p.orderLen || p.wasteLen === undefined || p.wasteLen === '') {
        procHasError = true
      }

      const refW = this._findRefWidth([stage], 0) || this._findRefWidth(this.data.stages, stageIdx)

      if (!procHasError && refW > 0) {
        const output = parseFloat(p.speed) * 60 * (refW / 1000)
        const scale = (parseFloat(p.orderLen) + parseFloat(p.wasteLen)) / parseFloat(p.orderLen)
        if (output > 0 && parseFloat(p.orderLen) > 0) {
          procCost = ((parseFloat(p.machRate) + parseFloat(p.laborRate)) / output) * scale
          stage.stageProcCost = procCost.toFixed(2)
        } else {
          procHasError = true
          stage.stageProcCost = '-'
        }
      } else {
        procHasError = true
        stage.stageProcCost = '-'
      }

      // 更新小计
      stage.stageMatCost = matHasError ? '-' : stageMatSum.toFixed(2)
      const stageTotal = (matHasError || procHasError) ? 0 : stageMatSum + procCost
      stage.stageTotalCost = (matHasError || procHasError) ? '-' : stageTotal.toFixed(2)

      return {
        hasError: matHasError || procHasError,
        total: stageTotal
      }
    }
  }
})
