const { initTheme } = require('../../../utils/common')

// 引入数据
const glossaryData = require('../data/glossary')
const adhesiveData = require('../data/adhesive')
const coatingTheoryData = require('../data/coating-theory')
const testingData = require('../data/testing')
const troubleshootData = require('../data/troubleshoot')

const dataMap = {
  glossary: glossaryData,
  adhesive: adhesiveData,
  'coating-theory': coatingTheoryData,
  testing: testingData,
  troubleshoot: troubleshootData
}

Page({
  data: {
    theme: 'dark',
    categoryId: '',
    title: '',
    showSearch: true,
    searchKeyword: '',
    loading: true,
    subcategories: [],
    filteredTerms: [],
    showTermModal: false,
    currentTerm: {},
    statusBarHeight: 44
  },

  onLoad(options) {
    initTheme(this)
    const { id, title } = options
    this.setData({
      categoryId: id,
      title: decodeURIComponent(title || '')
    })
    this.loadCategoryData(id)

    // 获取状态栏高度
    const systemInfo = wx.getSystemInfoSync()
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight || 44
    })
  },

  onShow() {
    initTheme(this)
  },

  loadCategoryData(categoryId) {
    const data = dataMap[categoryId]
    if (!data) {
      this.setData({ loading: false })
      return
    }

    // 名词库使用 terms 格式
    if (categoryId === 'glossary' && data.terms) {
      this.setData({
        terms: data.terms,
        showSearch: true,
        loading: false
      })
    }
    // 其他分类使用 subcategories 格式
    else if (data.categories) {
      this.setData({
        subcategories: data.categories,
        showSearch: false,
        loading: false
      })
    }
  },

  goBack() {
    wx.navigateBack({ delta: 1 })
  },

  goHome() {
    const pages = getCurrentPages()
    const handbookIndex = pages.findIndex(p => p.route.includes('pages/handbook/index'))

    if (handbookIndex > -1) {
      const delta = pages.length - 1 - handbookIndex
      wx.navigateBack({ delta: delta })
    } else {
      wx.redirectTo({
        url: '/pages/handbook/index'
      })
    }
  },



  onSearchInput(e) {
    const keyword = e.detail.value.toLowerCase()
    this.setData({ searchKeyword: keyword })

    if (!keyword) {
      this.setData({ filteredTerms: [] })
      return
    }

    const filtered = this.data.terms.filter(item =>
      item.term.toLowerCase().includes(keyword) ||
      (item.english && item.english.toLowerCase().includes(keyword)) ||
      item.definition.toLowerCase().includes(keyword)
    )
    this.setData({ filteredTerms: filtered })
  },

  clearSearch() {
    this.setData({ searchKeyword: '', filteredTerms: [] })
  },

  showTermDetail(e) {
    const term = e.currentTarget.dataset.term
    this.setData({
      currentTerm: term,
      showTermModal: true
    })
  },

  closeTermModal() {
    this.setData({ showTermModal: false })
  },

  navigateToDetail(e) {
    const { id, title, category } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/handbook/detail/index?id=${id}&title=${encodeURIComponent(title)}&category=${category}`
    })
  }
})
