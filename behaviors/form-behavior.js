/**
 * ============================================================
 * 表单交互 Behavior - 通用表单处理逻辑
 * ============================================================
 * 可被 coating, fluid, cost 等页面复用
 * ============================================================
 */

module.exports = Behavior({
  data: {
    focus: {},
    errors: {}
  },

  methods: {
    // 通用输入处理
    bindInput(e) {
      const field = e.detail.field || e.currentTarget.dataset.field
      const value = e.detail.value
      this.setData({ [field]: value, [`errors.${field}`]: false })
    },

    // 输入框焦点状态管理
    onInputFocus(e) {
      const field = e.detail.field || e.currentTarget.dataset.field
      this.setData({ [`focus.${field}`]: true })
    },

    onInputBlur(e) {
      const field = e.detail.field || e.currentTarget.dataset.field
      this.setData({ [`focus.${field}`]: false })
    },

    // 弹窗输入框焦点状态管理
    onModalFocus(e) {
      const { modal, field } = e.currentTarget.dataset
      const key = `${modal}_${field}`
      this.setData({ [`focus.${key}`]: true })
    },

    onModalBlur(e) {
      const { modal, field } = e.currentTarget.dataset
      const key = `${modal}_${field}`
      this.setData({ [`focus.${key}`]: false })
    },

    // 清除特定字段的错误
    clearError(key) {
      if (this.data.errors[key]) {
        const newErr = { ...this.data.errors }
        delete newErr[key]
        this.setData({ errors: newErr })
      }
    },

    // 阻止冒泡专用
    preventBubble() {
      // 阻止冒泡专用
    }
  }
})
