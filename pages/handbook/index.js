const { initTheme } = require('../../utils/common')

// 引入所有手册数据
const glossaryData = require('./data/glossary')
const adhesiveData = require('./data/adhesive')
const coatingTheoryData = require('./data/coating-theory')
const testingData = require('./data/testing')
const troubleshootData = require('./data/troubleshoot')

Page({
  data: {
    theme: 'dark',
    searchKeyword: '',
    statusBarHeight: 44,

    // 原始卡片数据
    categories: [
      {
        id: 'glossary',
        title: '涂布名词库',
        desc: '基础术语 / 设备 / 工艺参数',
        icon: '📖',
        color: '#6366f1',
        count: 128,
        unit: '词条'
      },
      {
        id: 'adhesive',
        title: '胶黏剂体系',
        desc: '丙烯酸 / 有机硅 / UV / 热熔',
        icon: '🧪',
        color: '#6366f1',
        count: 5,
        unit: '类型'
      },
      {
        id: 'coating-theory',
        title: '涂布工艺理论',
        desc: '狭缝涂布 / 凹版 / 微凹',
        icon: '🔬',
        color: '#6366f1',
        count: 4,
        unit: '工艺',
        countColor: '#6366f1'
      },
      {
        id: 'testing',
        title: '测试方法',
        desc: 'DMA / 凝胶分率 / 流变 / 老化',
        icon: '📊',
        color: '#6366f1',
        count: 6,
        unit: '类别'
      },
      {
        id: 'troubleshoot',
        title: '问题诊断手册',
        desc: '快速定位涂布异常根因与处理方案',
        icon: '🛠️',
        color: '#6366f1',
        isWide: true
      }
    ],

    // 搜索结果
    searchResults: [],

    // 词条弹窗相关
    showTermModal: false,
    currentTerm: {}
  },

  onLoad() {
    initTheme(this)
    const systemInfo = wx.getSystemInfoSync()
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight || 44
    })
    // 预加载所有数据到内存（数据量较小，直接放data外或data里均可，这里暂不放在data以减少setData开销，用到时直接引用模块变量）
  },

  onShow() {
    initTheme(this)
  },

  goBack() {
    wx.navigateBack({ delta: 1 })
  },

  onSearchInput(e) {
    const keyword = e.detail.value.trim().toLowerCase()
    this.setData({ searchKeyword: keyword })

    if (!keyword) {
      this.setData({ searchResults: [] })
      return
    }

    this.searchAll(keyword)
  },

  clearSearch() {
    this.setData({
      searchKeyword: '',
      searchResults: []
    })
  },

  // 全局搜索逻辑
  searchAll(keyword) {
    const results = []

    // 1. 搜索名词库 (Glossary)
    if (glossaryData.terms) {
      glossaryData.terms.forEach(item => {
        if (item.term.toLowerCase().includes(keyword) ||
            (item.english && item.english.toLowerCase().includes(keyword)) ||
            item.definition.toLowerCase().includes(keyword)) {
          results.push({
            type: 'term',
            id: item.id,
            title: item.term,
            desc: item.definition, // 词条显示定义
            category: 'glossary',
            categoryTitle: '涂布名词库',
            data: item // 完整词条数据用于弹窗
          })
        }
      })
    }

    // 2. 搜索其他模块 (Articles / Troubleshoot)
    const modules = [
      { id: 'adhesive', title: '胶黏剂体系', data: adhesiveData },
      { id: 'coating-theory', title: '涂布工艺理论', data: coatingTheoryData },
      { id: 'testing', title: '测试方法', data: testingData },
      { id: 'troubleshoot', title: '问题诊断', data: troubleshootData }
    ]

    modules.forEach(mod => {
      if (mod.data && mod.data.categories) {
        mod.data.categories.forEach(cat => {
          // 搜索子分类标题
          if (cat.title.toLowerCase().includes(keyword)) {
             // 作为一个结果条目？或者搜它的items。通常搜items更准。
             // 如果分类本身匹配，也可以加入，但这里优先搜具体的 items
          }

          if (cat.items) {
            cat.items.forEach(item => {
              if (item.title.toLowerCase().includes(keyword) ||
                  (item.brief && item.brief.toLowerCase().includes(keyword))) {
                results.push({
                  type: 'article',
                  id: item.id,
                  title: item.title,
                  desc: item.brief || cat.title, // 显示简介或所属分类
                  category: mod.id,
                  categoryTitle: mod.title
                })
              }
            })
          }
        })
      }
    })

    this.setData({ searchResults: results })
  },

  navigateToCategory(e) {
    const { id, title } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/handbook/category/index?id=${id}&title=${encodeURIComponent(title)}`
    })
  },

  // 处理搜索结果点击
  handleResultClick(e) {
    const { type, id, title, category, index } = e.currentTarget.dataset

    if (type === 'term') {
      // 词条：显示弹窗
      const term = this.data.searchResults[index].data
      this.setData({
        currentTerm: term,
        showTermModal: true
      })
    } else {
      // 文章/分类：跳转到详情页
      // 注意：这里的 category 是模块id（如 coating-theory），详情页需要这个
      wx.navigateTo({
        url: `/pages/handbook/detail/index?id=${id}&title=${encodeURIComponent(title)}&category=${category}`
      })
    }
  },

  closeTermModal() {
    this.setData({ showTermModal: false })
  }
})
