const { initTheme } = require('../../../utils/common')

// 引入数据
const glossaryData = require('../data/glossary')
const materialsData = require('../data/materials')
const equipmentData = require('../data/equipment')
const processData = require('../data/process')
const coatingTheoryData = require('../data/coating-theory')
const testingData = require('../data/testing')
const troubleshootData = require('../data/troubleshoot')

const dataMap = {
  glossary: glossaryData,
  materials: materialsData,
  equipment: equipmentData,
  process: processData,
  // adhesive: adhesiveData, // Migrated to materials
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
    scrollToId: '',
    statusBarHeight: 44
  },

  onLoad(options) {
    initTheme(this)
    const { id, title, anchor } = options
    this.setData({
      categoryId: id,
      title: decodeURIComponent(title || '')
    })
    this.loadCategoryData(id, anchor)

    // 获取状态栏高度
    const systemInfo = wx.getSystemInfoSync()
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight || 44
    })
  },

  onShow() {
    initTheme(this)
  },

  loadCategoryData(categoryId, anchor) {
    const data = dataMap[categoryId]
    if (!data) {
      this.setData({ loading: false })
      return
    }

    // 名词库: 无论结构如何，始终开启搜索
    if (categoryId === 'glossary') {
      let flatTerms = [];
      // 兼容两种结构：1. flat terms 2. categories (flatten them)
      if (data.terms) {
        flatTerms = data.terms;
      } else if (data.categories) {
        data.categories.forEach(cat => {
          if (cat.items) flatTerms = flatTerms.concat(cat.items);
        });
      }

      this.setData({
        terms: flatTerms, // Flatten for easier finding/display if needed, or just use subcategories
        subcategories: data.categories || [], // Keep categories for default view
        showSearch: true,
        loading: false
      });
    }
    // 其他分类: 默认隐藏搜索，除非以后有需求
    else if (data.categories) {
      let displayCategories = data.categories

      // 核心逻辑：如果有 anchor (过滤模式)，只显示该分类
      if (anchor) {
        displayCategories = data.categories.filter(c => c.id === anchor)
        // 自动修正标题：如果找到了对应的分类，让页面标题变成该分类的标题
        if (displayCategories.length > 0) {
           wx.setNavigationBarTitle({ title: displayCategories[0].title })
           this.setData({ title: displayCategories[0].title })
        }
      }

      this.setData({
        subcategories: displayCategories,
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



  // 统一搜索逻辑：仅限当前分类
  onSearchInput(e) {
    const keyword = e.detail.value.trim().toLowerCase()

    // 如果关键词为空，清空搜索结果
    if (!keyword) {
      this.setData({
        searchKeyword: '',
        searchResults: [],
        filteredTerms: [] // Cleaning up old logic
      })
      return
    }

    this.setData({
      searchKeyword: keyword,
      scrollToId: 'top' // Utilizes scroll-into-view or scrollTop if bound
    })

    let results = []

    // 逻辑：在当前 subcategories 或 terms 中查找
    // 1. 查找扁平 Terms
    if (this.data.terms && this.data.terms.length > 0) {
       const matches = this.data.terms.filter(t =>
         t.term.toLowerCase().includes(keyword) ||
         (t.english && t.english.toLowerCase().includes(keyword))
       )
       results = matches.map(t => ({
         id: t.id || t.term,
         title: t.term,
         desc: t.definition || t.brief || '暂无简介',
         originalData: t
       }))
    }
    // 2. 查找分类 Subcategories
    else if (this.data.subcategories && this.data.subcategories.length > 0) {
      this.data.subcategories.forEach(cat => {
        if (cat.items) {
          const matches = cat.items.filter(item =>
             (item.title && item.title.toLowerCase().includes(keyword)) ||
             (item.term && item.term.toLowerCase().includes(keyword))
          )
          const mapped = matches.map(item => ({
            id: item.id,
            title: item.title || item.term,
            desc: item.brief || item.definition || '暂无简介',
            originalData: item
          }))
          results = results.concat(mapped)
        }
      })
    }

    this.setData({
      searchResults: results
    })
  },

  clearSearch() {
    this.setData({ searchKeyword: '', filteredTerms: [], searchResults: [] })
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
  },

  // 点击相关术语 --> 无限跳转
  onRelatedTap(e) {
    const keyword = e.currentTarget.dataset.keyword
    if (!keyword) return

    // 1. 尝试在当前分类中查找
    let target = this.findTerm(keyword)

    // 2. 如果没找到，尝试在全局 Glossary 中查找 (需要引入全量数据)
    if (!target) {
       // 简易查找：遍历所有分类
       if (dataMap.glossary && dataMap.glossary.categories) {
         for (const cat of dataMap.glossary.categories) {
           // 模糊匹配：只要包含关键词即可（适配 "基材" -> "基材 (Substrate)"）
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

  findTerm(keyword) {
    // 扁平查找 (terms)
    if (this.data.terms) {
      return this.data.terms.find(t =>
        t.term === keyword || (t.term && t.term.includes(keyword))
      )
    }
    // 分类查找 (subcategories)
    if (this.data.subcategories) {
      for (const cat of this.data.subcategories) {
        if (cat.items) {
          const found = cat.items.find(t =>
            t.term === keyword ||
            t.title === keyword ||
            (t.term && t.term.includes(keyword))
          )
          if (found) return found
        }
      }
    }
    return null
  },

  navToModule(e) {
    const link = e.currentTarget.dataset.link
    if (!link || !link.id) return

    // 深度学习：跳转到对应模块的分类列表页
    let url = `/pages/handbook/category/index?id=${link.id}&title=${encodeURIComponent(link.title)}`
    if (link.anchor) {
      url += `&anchor=${link.anchor}`
    }

    wx.navigateTo({
      url: url
    })
  }
})
