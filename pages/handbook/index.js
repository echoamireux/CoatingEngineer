const { initTheme } = require('../../utils/common')

// 引入所有手册数据
const glossaryData = require('./data/glossary')
const materialsData = require('./data/materials')
const equipmentData = require('./data/equipment')
const processData = require('./data/process')
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
        desc: '专业术语 / 快速查阅',
        icon: '📖',
        color: '#6366f1',
        isWide: true, // Make Glossary prominent as "The One"
        count: 0, // 动态计算
        unit: '词条'
      },
      {
        id: 'materials',
        title: '材料科学',
        desc: '胶黏剂 / 基材 / 界面化学',
        icon: '🧪',
        color: '#3b82f6',
        count: 7,
        unit: '章'
      },
      {
        id: 'equipment',
        title: '设备硬件',
        desc: '模头 / 供料 / 烘箱 / 辅助',
        icon: '⚙️',
        color: '#10b981',
        count: 4,
        unit: '章'
      },
      {
        id: 'process',
        title: '工艺控制',
        desc: '干燥 / 涂布 / 固化 / 卷材',
        icon: '🎛️',
        color: '#f59e0b',
        count: 4,
        unit: '章'
      },
      {
        id: 'coating-theory',
        title: '涂布技术',
        desc: '狭缝 / 凹版 / 微凹 / 逗号',
        icon: '🔬',
        color: '#8b5cf6',
        count: 4,
        unit: '技术'
      },
      {
        id: 'testing',
        title: '测试与质量',
        desc: '流变 / 压敏胶 / 光学 / 可靠性',
        icon: '📊',
        color: '#ec4899',
        count: 7,
        unit: '类别'
      },
      {
        id: 'troubleshoot',
        title: '缺陷诊断',
        desc: '外观 / 干燥 / 性能缺陷',
        icon: '🛠️',
        color: '#ef4444',
        count: 3,
        unit: '大类'
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
    const systemInfo = wx.getWindowInfo()
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight || 44
    })
    // 动态计算名词库词条数
    this._updateGlossaryCount()
  },

  // 动态更新名词库词条数量
  _updateGlossaryCount() {
    let total = 0
    if (glossaryData.categories) {
      glossaryData.categories.forEach(cat => {
        if (cat.items) total += cat.items.length
      })
    }
    const categories = this.data.categories.map(c => {
      if (c.id === 'glossary') {
        return { ...c, count: total, desc: `${total}+ 专业术语 / 快速查阅` }
      }
      return c
    })
    this.setData({ categories })
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

    // 1. 搜索名词库 (Glossary) - 修正：遍历 Categories 结构
    if (glossaryData.categories) {
      glossaryData.categories.forEach(cat => {
        if (cat.items) {
          cat.items.forEach(item => {
             // 匹配：术语名、英文、定义、详情
             if ((item.term && item.term.toLowerCase().includes(keyword)) ||
                 (item.english && item.english.toLowerCase().includes(keyword)) ||
                 (item.definition && item.definition.toLowerCase().includes(keyword))) {
               results.push({
                 type: 'term',
                 id: item.id,
                 title: item.term,
                 desc: item.definition, // 首页简介显示定义
                 category: 'glossary',
                 categoryTitle: '涂布名词库',
                 data: item // 完整数据传给弹窗
               })
             }
          })
        }
      })
    }

    // 2. 搜索其他模块 (Articles / Troubleshoot)
    const modules = [
      { id: 'materials', title: '材料科学', data: materialsData },
      { id: 'equipment', title: '设备硬件', data: equipmentData },
      { id: 'process', title: '工艺控制', data: processData },
      { id: 'coating-theory', title: '涂布技术', data: coatingTheoryData },
      { id: 'testing', title: '测试与质量', data: testingData },
      { id: 'troubleshoot', title: '缺陷诊断', data: troubleshootData }
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
  },

  // 点击相关术语 (Home Page)
  onRelatedTap(e) {
    const keyword = e.currentTarget.dataset.keyword
    if (!keyword) return

    let target = null

    // 在名词库中查找
    if (glossaryData.categories) {
      for (const cat of glossaryData.categories) {
        if (cat.items) {
           // 模糊匹配
           const found = cat.items.find(t =>
             t.term === keyword ||
             t.title === keyword ||
             (t.term && t.term.includes(keyword))
           )
           if (found) {
             target = found
             break
           }
        }
      }
    }

    if (target) {
      this.setData({ currentTerm: target })
    } else {
      wx.showToast({ title: '暂无收录', icon: 'none' })
    }
  },

  navToModule(e) {
    const link = e.currentTarget.dataset.link
    if (!link || !link.id) return
    // 深度学习：跳转到对应模块的分类列表页，并带上 anchor
    let url = `/pages/handbook/category/index?id=${link.id}&title=${encodeURIComponent(link.title)}`
    if (link.anchor) {
      url += `&anchor=${link.anchor}`
    }
    wx.navigateTo({ url })
  }
})
