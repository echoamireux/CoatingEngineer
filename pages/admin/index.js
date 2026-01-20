const app = getApp()

// 管理员密码 (⚠️ 这里只是前端第一道校验，真正的修改会调用云函数校验)
const ADMIN_PASSWORD = 'admin0416'

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

  verifyAdmin() {
    if (this.data.inputPass === ADMIN_PASSWORD) {
      this.setData({ isLoggedIn: true })
      this.refreshData()
    } else {
      wx.showToast({ title: '密码错误', icon: 'error' })
    }
  },

  logout() {
    this.setData({ isLoggedIn: false, inputPass: '' })
  },

  // === 数据加载 ===
  // === 数据加载 ===
  async refreshData() {
    wx.showLoading({ title: '加载配置...' })
    try {
      // 改为调用云函数获取（避免前端数据库权限问题）
      const res = await wx.cloud.callFunction({
        name: 'updateSettings',
        data: {
          password: ADMIN_PASSWORD,
          type: 'get_all_settings'
        }
      })

      wx.hideLoading()

      if (res.result.success) {
        const { settings, currentAccessCode } = res.result.data

        this.setData({
          requirePasscode: settings.require_passcode,
          showReward: settings.show_reward,
          passcodeHint: settings.passcode_hint || '',
          currentAccessCode: currentAccessCode,

          // 同步输入框初始值
          newAccessCode: currentAccessCode,
          newHint: settings.passcode_hint || ''
        })
      } else {
        wx.showToast({ title: '加载失败: ' + res.result.message, icon: 'none' })
      }
    } catch (err) {
      wx.hideLoading()
      console.error(err)
      wx.showToast({ title: '加载失败', icon: 'none' })
    }
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
          password: ADMIN_PASSWORD, // 传递密码给云函数做二次校验
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
