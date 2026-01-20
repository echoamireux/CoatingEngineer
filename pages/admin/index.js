const app = getApp()

Page({
  data: {
    isLoggedIn: false,
    inputPass: '',
    loading: false,

    // 数据
    requirePasscode: true,
    showReward: false,
    currentAccessCode: '',
    passcodeHint: '',

    // 临时输入状态
    newAccessCode: '',
    newHint: ''
  },

  onLoad() {
    this.setData({ isLoggedIn: false })
  },

  // === 登录逻辑 ===
  onAdminPassInput(e) {
    this.setData({ inputPass: e.detail.value })
  },

  async verifyAdmin() {
    const password = this.data.inputPass.trim()
    if (!password) return

    this.setData({ loading: true })

    try {
      // 调用云函数验证密码并获取数据
      const res = await wx.cloud.callFunction({
        name: 'updateSettings',
        data: {
          password: password,
          type: 'get_all_settings' // 直接尝试获取数据作为验证
        }
      })

      this.setData({ loading: false })

      if (res.result.success) {
        this.setData({ isLoggedIn: true })
        // 填充数据
        const { settings, currentAccessCode } = res.result.data
        this.applySettings(settings, currentAccessCode)
        wx.showToast({ title: '欢迎回来', icon: 'success' })
      } else {
        wx.vibrateShort()
        wx.showToast({ title: '密码错误', icon: 'error' })
      }
    } catch (err) {
      this.setData({ loading: false })
      console.error(err)
      wx.showToast({ title: '验证失败', icon: 'none' })
    }
  },

  logout() {
    this.setData({ isLoggedIn: false, inputPass: '' })
  },

  // === 数据加载 ===
  // === 数据加载 ===
  // === 数据加载 ===
  async refreshData() {
    if (!this.data.isLoggedIn) return

    wx.showLoading({ title: '加载配置...' })
    try {
      const res = await wx.cloud.callFunction({
        name: 'updateSettings',
        data: {
          password: this.data.inputPass, // 保持使用当前输入的密码
          type: 'get_all_settings'
        }
      })
      wx.hideLoading()
      if (res.result.success) {
        const { settings, currentAccessCode } = res.result.data
        this.applySettings(settings, currentAccessCode)
        wx.showToast({ title: '已刷新', icon: 'success' })
      } else {
         wx.showToast({ title: '刷新失败', icon: 'none' })
      }
    } catch (err) {
      wx.hideLoading()
      console.error(err)
    }
  },

  applySettings(settings, code) {
    this.setData({
      requirePasscode: settings.require_passcode,
      showReward: settings.show_reward,
      passcodeHint: settings.passcode_hint || '',
      currentAccessCode: code,

      // 同步输入框初始值
      newAccessCode: code,
      newHint: settings.passcode_hint || ''
    })
  },

  // === 操作逻辑 ===
  async onSwitchChange(e) {
    const key = e.currentTarget.dataset.key
    const value = e.detail.value

    // 更新本地状态显示
    if (key === 'require_passcode') this.setData({ requirePasscode: value })
    if (key === 'show_reward') this.setData({ showReward: value })

    // 调用云函数更新
    await this.callUpdateFunction('update_app_setting', { key, value })
  },

  onAccessCodeInput(e) {
    this.setData({ newAccessCode: e.detail.value })
  },

  async saveAccessCode() {
    if (!this.data.newAccessCode) return
    await this.callUpdateFunction('update_access_code', { newCode: this.data.newAccessCode })
  },

  onHintInput(e) {
    this.setData({ newHint: e.detail.value })
  },

  async saveHint() {
    await this.callUpdateFunction('update_app_setting', { key: 'passcode_hint', value: this.data.newHint })
  },

  // === 通用云函数调用 ===
  async callUpdateFunction(type, payload) {
    wx.showLoading({ title: '保存中...' })
    try {
      const res = await wx.cloud.callFunction({
        name: 'updateSettings',
        data: {
          password: this.data.inputPass, // 修复：使用用户输入的密码
          type,
          payload
        }
      })

      wx.hideLoading()

      if (res.result.success) {
        wx.showToast({ title: '保存成功', icon: 'success' })
      } else {
        wx.showToast({ title: '保存失败: ' + res.result.message, icon: 'none' })
      }
    } catch (err) {
      wx.hideLoading()
      wx.showToast({ title: '网络异常', icon: 'none' })
      console.error(err)
    }
  }
})
