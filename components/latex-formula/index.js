/**
 * LaTeX公式渲染组件
 * 使用Canvas 2D绘制数学公式
 */
Component({
  properties: {
    // LaTeX公式字符串
    formula: {
      type: String,
      value: '',
      observer: 'renderFormula'
    },
    // 字体大小 (rpx)
    fontSize: {
      type: Number,
      value: 32
    },
    // 文字颜色
    color: {
      type: String,
      value: '#e5e7eb'
    },
    // 是否居中
    center: {
      type: Boolean,
      value: true
    }
  },

  data: {
    canvasId: '',
    canvasWidth: 300,
    canvasHeight: 50,
    showFallback: true,
    ctx: null
  },

  lifetimes: {
    attached() {
      // 生成唯一ID
      this.setData({
        canvasId: 'latex_' + Math.random().toString(36).substr(2, 9)
      })
    },
    ready() {
      this.initCanvas()
    }
  },

  methods: {
    async initCanvas() {
      try {
        const query = this.createSelectorQuery()
        query.select(`#latex-canvas-${this.data.canvasId}`)
          .fields({ node: true, size: true })
          .exec((res) => {
            if (res[0] && res[0].node) {
              const canvas = res[0].node
              const ctx = canvas.getContext('2d')

              // 设置canvas尺寸
              const dpr = wx.getSystemInfoSync().pixelRatio
              canvas.width = res[0].width * dpr
              canvas.height = res[0].height * dpr
              ctx.scale(dpr, dpr)

              this.canvas = canvas
              this.ctx = ctx

              if (this.properties.formula) {
                this.renderFormula()
              }
            }
          })
      } catch (e) {
        console.warn('Canvas初始化失败，使用文本备用显示', e)
        this.setData({ showFallback: true })
      }
    },

    renderFormula() {
      if (!this.ctx || !this.properties.formula) {
        this.setData({ showFallback: true })
        return
      }

      const ctx = this.ctx
      const formula = this.properties.formula
      const fontSize = this.properties.fontSize / 2 // rpx to px approximate
      const color = this.properties.color

      // 清空画布
      ctx.clearRect(0, 0, this.data.canvasWidth, this.data.canvasHeight)

      // 设置样式
      ctx.fillStyle = color
      ctx.font = `${fontSize}px "Times New Roman", serif`
      ctx.textAlign = this.properties.center ? 'center' : 'left'
      ctx.textBaseline = 'middle'

      // 解析并渲染公式
      const rendered = this.parseAndRender(formula, ctx, fontSize)

      if (rendered) {
        this.setData({ showFallback: false })
      } else {
        this.setData({ showFallback: true })
      }
    },

    /**
     * 简单的LaTeX解析器
     * 支持: 分数(\frac)、上标(^)、下标(_)、希腊字母、特殊符号
     */
    parseAndRender(formula, ctx, fontSize) {
      try {
        // 简化处理：将LaTeX转换为Unicode显示
        let displayText = formula

        // 希腊字母替换
        const greekMap = {
          '\\alpha': 'α', '\\beta': 'β', '\\gamma': 'γ', '\\delta': 'δ',
          '\\epsilon': 'ε', '\\eta': 'η', '\\theta': 'θ', '\\lambda': 'λ',
          '\\mu': 'μ', '\\nu': 'ν', '\\pi': 'π', '\\rho': 'ρ',
          '\\sigma': 'σ', '\\tau': 'τ', '\\omega': 'ω', '\\phi': 'φ',
          '\\varepsilon': 'ε', '\\Delta': 'Δ', '\\Sigma': 'Σ', '\\Omega': 'Ω'
        }

        // 数学符号替换
        const symbolMap = {
          '\\cdot': '·', '\\times': '×', '\\div': '÷', '\\pm': '±',
          '\\leq': '≤', '\\geq': '≥', '\\neq': '≠', '\\approx': '≈',
          '\\infty': '∞', '\\sum': 'Σ', '\\prod': 'Π', '\\int': '∫',
          '\\partial': '∂', '\\nabla': '∇', '\\rightarrow': '→', '\\leftarrow': '←',
          '\\Rightarrow': '⇒', '\\Leftrightarrow': '⇔'
        }

        // 替换希腊字母
        for (const [latex, unicode] of Object.entries(greekMap)) {
          displayText = displayText.replace(new RegExp(latex.replace(/\\/g, '\\\\'), 'g'), unicode)
        }

        // 替换数学符号
        for (const [latex, unicode] of Object.entries(symbolMap)) {
          displayText = displayText.replace(new RegExp(latex.replace(/\\/g, '\\\\'), 'g'), unicode)
        }

        // 处理分数 \frac{a}{b} -> a/b
        displayText = displayText.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1/$2)')

        // 处理上标 ^{x} -> ˣ（简化处理）
        displayText = displayText.replace(/\^(\{[^}]+\}|\w)/g, (match, p1) => {
          const content = p1.startsWith('{') ? p1.slice(1, -1) : p1
          // 常见上标数字
          const superscripts = {'0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹',
            'n':'ⁿ', 'i':'ⁱ', '+':'⁺', '-':'⁻', '(':'⁽', ')':'⁾'}
          return content.split('').map(c => superscripts[c] || `^${c}`).join('')
        })

        // 处理下标 _{x} -> ₓ（简化处理）
        displayText = displayText.replace(/_(\{[^}]+\}|\w)/g, (match, p1) => {
          const content = p1.startsWith('{') ? p1.slice(1, -1) : p1
          // 常见下标
          const subscripts = {'0':'₀','1':'₁','2':'₂','3':'₃','4':'₄','5':'₅','6':'₆','7':'₇','8':'₈','9':'₉',
            'i':'ᵢ', 'j':'ⱼ', 'n':'ₙ', 'm':'ₘ', 'x':'ₓ', 'y':'ᵧ', 'a':'ₐ', 'e':'ₑ', 'o':'ₒ', 'r':'ᵣ', 't':'ₜ'}
          return content.split('').map(c => subscripts[c] || `_${c}`).join('')
        })

        // 清理多余的花括号和反斜杠
        displayText = displayText.replace(/[{}]/g, '')
        displayText = displayText.replace(/\\\\/g, '')

        // 绘制文本
        const x = this.properties.center ? this.data.canvasWidth / 2 : 10
        const y = this.data.canvasHeight / 2

        ctx.fillText(displayText, x, y)

        return true
      } catch (e) {
        console.warn('公式渲染失败', e)
        return false
      }
    }
  }
})
