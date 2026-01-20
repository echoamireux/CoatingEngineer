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
    }
  },

  globalData: {
    theme: 'dark'
  }
})