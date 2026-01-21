Component({
  properties: {
    theme: {
      type: String,
      value: 'dark',
      observer() {
        if (this.canvas) this.calculateState() // Re-draw when theme changes
      }
    }
  },

  data: {
    // 物理参数初始值
    params: {
      viscosity: 100, // cP (mPa.s)
      tension: 30,    // mN/m (dyn/cm)
      speed: 10,      // m/min
      gap: 100,       // μm
      flow: 100,      // mL/min
      width: 200,     // mm (涂布宽度，用于计算H)
      solid: 30       // % (固含量)
    },

    // 计算出的无量纲数
    currentCa: 0,
    currentGH: 0,
    currentH: 0, // 湿膜厚度
    currentDryH: 0, // 干膜厚度

    // 状态
    statusText: '初始化中',
    statusClass: '',
    showAdvanced: false,
    controlMode: 'flow', // 'flow' | 'thickness'
    targetDryH: 9        // 目标干厚用于滑块显示 (默认30*0.3=9)
  },

  lifetimes: {
    attached() {
      this.initChart()
    }
  },

  methods: {
    initChart() {
      const query = this.createSelectorQuery()
      query.select('#coatingCanvas')
        .fields({ node: true, size: true })
        .exec((res) => {
          const canvas = res[0].node
          const ctx = canvas.getContext('2d')

          // 处理高清屏缩放
          const dpr = wx.getSystemInfoSync().pixelRatio
          canvas.width = res[0].width * dpr
          canvas.height = res[0].height * dpr
          ctx.scale(dpr, dpr)

          this.canvas = canvas
          this.ctx = ctx
          this.dpr = dpr
          this.width = res[0].width
          this.height = res[0].height

          this.calculateState()
        })
    },

    // 核心计算逻辑
    calculatePhysics() {
      const p = this.data.params

      // 1. 计算毛细数 Ca = η * V / σ
      // 单位换算:
      // η: cP = mPa.s = 1e-3 Pa.s
      // V: m/min = 1/60 m/s
      // σ: mN/m = 1e-3 N/m
      const eta = p.viscosity * 1e-3
      const v = p.speed / 60
      const sigma = p.tension * 1e-3

      let Ca = (eta * v) / sigma

      // 2. 计算湿膜厚度 H = Q / (V * W)
      // Q: mL/min = 1e-6 m3 / 60 s
      // W: mm = 1e-3 m
      const Q_si = (p.flow * 1e-6) / 60
      const W_si = p.width * 1e-3
      const H_m = Q_si / (v * W_si)
      const H_um = H_m * 1e6

      // 3. 计算间隙比 G/H
      const GH = p.gap / H_um

      return {
        Ca: parseFloat(Ca.toFixed(3)),
        GH: parseFloat(GH.toFixed(2)),
        H_um: parseFloat(H_um.toFixed(1)),
        DryH_um: parseFloat((H_um * (p.solid || 30) / 100).toFixed(1))
      }
    },

    calculateState() {
      if (!this.canvas) return

      const { Ca, GH, H_um, DryH_um } = this.calculatePhysics()
      this.setData({
        currentCa: Ca,
        currentGH: GH,
        currentH: H_um.toFixed(1),
        currentDryH: DryH_um // 添加到 Data 以便显示
      })

      // 如果是流量控制模式，同步更新目标干厚显示
      if (this.data.controlMode === 'flow') {
        this.setData({ targetDryH: DryH_um }) // 已是固定小数位数值
      }

      // 判定状态
      let statusText = '稳定涂布'
      let statusClass = 'stable'

      if (GH > 2.5) {
        statusText = '气泡夹带 (G/H过大)'
        statusClass = 'danger'
      } else if (GH < 1.2) {
        statusText = '断液/空洞 (G/H过小)'
        statusClass = 'danger'
      } else if (Ca > 0.5) { // 简化阈值，实际是曲线
        statusText = 'Ribbing条纹 (Ca过大)'
        statusClass = 'warning'
      }

      this.setData({ statusText, statusClass })
      this.draw(Ca, GH)
    },

    draw(Ca, GH) {
      const { ctx, width, height } = this
      ctx.clearRect(0, 0, width, height)

      // 边距
      const padding = { top: 40, right: 40, bottom: 40, left: 50 }
      const plotW = width - padding.left - padding.right
      const plotH = height - padding.top - padding.bottom

      // 坐标轴范围
      const minCa = 0, maxCa = 1.0
      const minGH = 0.5, maxGH = 3.5

      // 坐标映射帮助函数
      const mapX = (val) => padding.left + (val - minCa) / (maxCa - minCa) * plotW
      const mapY = (val) => height - padding.bottom - (val - minGH) / (maxGH - minGH) * plotH

      // 1. 绘制稳定窗口区域 (根据 Ruschak & Viscous limit 近似)
      // 简化模型：Low flow limit (G/H ~ 1/Ca? No, simplified typically)
      // 这里画一个典型的梯形窗口示意
      ctx.beginPath()
      ctx.moveTo(mapX(0.01), mapY(1.5))
      ctx.lineTo(mapX(0.01), mapY(2.5)) // 左边界 (低速)
      ctx.lineTo(mapX(0.8), mapY(2.5))  // 上边界 (Air Entrainment Limit approx const)
      ctx.quadraticCurveTo(mapX(0.5), mapY(2.0), mapX(0.2), mapY(1.5)) // 右下边界 (Ribbing?) 示意
      ctx.lineTo(mapX(0.01), mapY(1.5))
      ctx.fillStyle = 'rgba(16, 185, 129, 0.1)'
      ctx.fill()
      ctx.strokeStyle = '#10b981'
      ctx.lineWidth = 2
      ctx.stroke()

      // 标注区域
      ctx.fillStyle = '#10b981'
      ctx.font = 'bold 14px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('Stable Window', mapX(0.3), mapY(2.0))

      // 3. 绘制 - 主题颜色定义
      const isLight = this.data.theme === 'light'
      const colors = {
        axis: isLight ? '#e5e7eb' : '#374151',
        text: isLight ? '#6b7280' : '#9ca3af',
        title: isLight ? '#9ca3af' : '#6b7280',
        grid: isLight ? '#f3f4f6' : '#1f2937'
      }

      // 坐标轴
      ctx.beginPath()
      ctx.strokeStyle = colors.axis
      ctx.lineWidth = 1
      // Y轴
      ctx.moveTo(padding.left, padding.top)
      ctx.lineTo(padding.left, height - padding.bottom)
      // X轴
      ctx.moveTo(padding.left, height - padding.bottom)
      ctx.lineTo(width - padding.right, height - padding.bottom)
      ctx.stroke()

      // 刻度文本
      ctx.fillStyle = colors.text
      ctx.font = '10px sans-serif'
      ctx.textAlign = 'right'
      ctx.textBaseline = 'middle'
      // Y轴刻度
      for(let y=1.0; y<=3.0; y+=0.5) {
        ctx.fillText(y.toFixed(1), padding.left - 5, mapY(y))
      }
      // X轴刻度
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      for(let x=0.2; x<=0.8; x+=0.2) {
        ctx.fillText(x.toFixed(1), mapX(x), height - padding.bottom + 5)
      }

      // 轴标题
      ctx.save()
      ctx.translate(15, height/2)
      ctx.rotate(-Math.PI/2)
      ctx.textAlign = 'center'
      ctx.fillText('Gap / Thickness (G/H)', 0, 0)
      ctx.restore()

      ctx.textAlign = 'center'
      ctx.fillText('Capillary Number (Ca)', width/2, height - 10)

      // 3. 绘制当前点
      const px = mapX(Math.min(Math.max(Ca, minCa), maxCa))
      const py = mapY(Math.min(Math.max(GH, minGH), maxGH))

      // 辅助线
      ctx.beginPath()
      ctx.strokeStyle = '#6366f1'
      ctx.setLineDash([4, 4])
      ctx.moveTo(padding.left, py)
      ctx.lineTo(px, py)
      ctx.lineTo(px, height - padding.bottom)
      ctx.stroke()
      ctx.setLineDash([])

      // 点
      ctx.beginPath()
      ctx.arc(px, py, 6, 0, Math.PI * 2)
      ctx.fillStyle = '#6366f1'
      ctx.fill()
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 2
      ctx.stroke()

      // 拖拽提示（如果是触控中则不显示）
      // ...
    },

    onParamChange(e) {
      const key = e.currentTarget.dataset.key
      const value = Number(e.detail.value)

      this.setData({
        [`params.${key}`]: value
      })
      this.calculateState()
    },

    onInputParam(e) {
      const key = e.currentTarget.dataset.key
      let value = Number(e.detail.value)
      if (isNaN(value)) return

      this.setData({
        [`params.${key}`]: value
      })

      // 联动：如果是干厚模式，改变速度/幅宽/固含量时，需要调整流量Q以保持干厚不变
      if (this.data.controlMode === 'thickness' && (key === 'speed' || key === 'width' || key === 'solid')) {
        this.updateFlowFromThickness()
      } else {
        this.calculateState()
      }
    },

    switchMode(e) {
      const mode = e.currentTarget.dataset.mode
      this.setData({ controlMode: mode })
    },

    onThicknessChange(e) {
      const targetDryH = Number(e.detail.value)
      this.setData({ targetDryH })
      this.updateFlowFromThickness()
    },

    updateFlowFromThickness() {
      const { targetDryH } = this.data
      const p = this.data.params
      const solid = p.solid || 30 // 默认30%

      // 反算逻辑:
      // DryH = WetH * Solid%
      // WetH = DryH / (Solid/100)
      // Q = WetH * V * W
      const targetWetH = targetDryH / (solid / 100)
      // Q (mL/min) = WetH(um) * Speed(m/min) * Width(mm) / 1000
      const reqFlow = (targetWetH * p.speed * p.width) / 1000

      this.setData({
        'params.flow': parseFloat(reqFlow.toFixed(1))
      })
      this.calculateState()
    },

    toggleAdvanced() {
      this.setData({
        showAdvanced: !this.data.showAdvanced
      })
    }
  }
})
