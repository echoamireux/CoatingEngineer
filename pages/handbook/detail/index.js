const { initTheme } = require('../../../utils/common')

// 引入详情数据
const adhesiveData = require('../data/adhesive')
const coatingTheoryData = require('../data/coating-theory')
const testingData = require('../data/testing')
const troubleshootData = require('../data/troubleshoot')

const dataMap = {
  adhesive: adhesiveData,
  'coating-theory': coatingTheoryData,
  testing: testingData,
  troubleshoot: troubleshootData
}

Page({
  data: {
    theme: 'dark',
    category: '',
    itemId: '',
    sections: [],
    statusBarHeight: 44
  },

  onLoad(options) {
    initTheme(this)
    const { id, title, category } = options
    this.setData({
      itemId: id,
      title: decodeURIComponent(title || ''),
      category: category
    })
    this.loadDetailData(category, id)

    // 获取状态栏高度
    const systemInfo = wx.getSystemInfoSync()
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight || 44
    })
  },

  onShow() {
    initTheme(this)
  },

  loadDetailData(category, itemId) {
    const categoryData = dataMap[category]
    if (!categoryData || !categoryData.details) {
      return
    }

    const detail = categoryData.details[itemId]
    if (detail) {
      this.setData({ sections: detail.sections || [] })
    }
  },

  goBack() {
    wx.navigateBack({ delta: 1 })
  },

  goHome() {
    // 智能返回手册首页 (pages/handbook/index)
    const pages = getCurrentPages()
    const handbookIndex = pages.findIndex(p => p.route.includes('pages/handbook/index'))

    if (handbookIndex > -1) {
      // 如果栈中已有手册首页，则回退到该层级
      const delta = pages.length - 1 - handbookIndex
      wx.navigateBack({ delta: delta })
    } else {
      // 降级策略
      wx.redirectTo({
        url: '/pages/handbook/index'
      })
    }
  },


})
