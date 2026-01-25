App({
  onLaunch() {
    // 初始化云开发
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        // env 参数决定接下来小程序发起的云开发调用的默认环境
        // 可以填写已有的云环境 ID，或者填 'default' 使用默认环境
        traceUser: true
      })
      console.log('✅ 云开发初始化成功')

      // ★ 临时：运行单元测试（验证后请删除此行）
      console.log('🧪 开始运行单元测试...')
      require('./tests/unit.test.js')
    }
  },

  /**
   * 全局错误捕获
   * @param {string} error - 错误信息
   */
  onError(error) {
    console.error('🚨 全局错误捕获:', error)
    // 显示友好提示，避免用户困惑
    wx.showToast({
      title: '操作异常，请重试',
      icon: 'none',
      duration: 2000
    })
    // 可选：错误上报
    // this.reportError(error, 'onError')
  },

  /**
   * 未处理的 Promise 拒绝
   * @param {object} res - 包含 reason 和 promise 的对象
   */
  onUnhandledRejection(res) {
    console.error('🚨 未处理的 Promise 拒绝:', res.reason)
    // 网络错误特殊处理
    if (res.reason && res.reason.errMsg && res.reason.errMsg.includes('request:fail')) {
      wx.showToast({
        title: '网络连接失败',
        icon: 'none',
        duration: 2000
      })
    }
    // 可选：错误上报
    // this.reportError(res.reason, 'onUnhandledRejection')
  },

  /**
   * 错误上报（预留）
   * @param {*} error - 错误对象
   * @param {string} source - 错误来源
   */
  reportError(error, source) {
    // TODO: 实现错误上报到云端
    console.log('错误上报:', { source, error })
  },

  globalData: {
    theme: 'dark'
  }
})