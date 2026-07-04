/**
 * 离线存储管理工具
 * 用于缓存手册内容数据，支持离线查阅
 */

const CACHE_KEY = 'handbook_cache'
const CACHE_VERSION = 'v1.0.0'
const CACHE_EXPIRE_DAYS = 30

// 引入所有数据
const glossaryData = require('../data/glossary')
const adhesiveData = require('../data/adhesive')
const coatingTheoryData = require('../data/coating-theory')
const testingData = require('../data/testing')
const troubleshootData = require('../data/troubleshoot')

const allData = {
  glossary: glossaryData,
  adhesive: adhesiveData,
  'coating-theory': coatingTheoryData,
  testing: testingData,
  troubleshoot: troubleshootData
}

/**
 * 初始化缓存
 * 将所有数据写入本地存储
 */
function initCache() {
  try {
    const cacheData = {
      version: CACHE_VERSION,
      timestamp: Date.now(),
      expireAt: Date.now() + CACHE_EXPIRE_DAYS * 24 * 60 * 60 * 1000,
      data: allData
    }
    wx.setStorageSync(CACHE_KEY, cacheData)
    console.log('✅ 手册缓存初始化成功')
    return true
  } catch (e) {
    console.error('❌ 手册缓存初始化失败:', e)
    return false
  }
}

/**
 * 获取缓存的分类数据
 * @param {string} category - 分类ID
 * @returns {object|null}
 */
function getCategoryData(category) {
  try {
    const cache = wx.getStorageSync(CACHE_KEY)
    if (cache && cache.data && cache.data[category]) {
      return cache.data[category]
    }
    // 缓存不存在或无效，返回内存数据并尝试重建缓存
    initCache()
    return allData[category] || null
  } catch (e) {
    console.warn('缓存读取失败，使用内存数据:', e)
    return allData[category] || null
  }
}

/**
 * 检查缓存是否有效
 * @returns {boolean}
 */
function isCacheValid() {
  try {
    const cache = wx.getStorageSync(CACHE_KEY)
    if (!cache) return false
    if (cache.version !== CACHE_VERSION) return false
    if (Date.now() > cache.expireAt) return false
    return true
  } catch (e) {
    return false
  }
}

/**
 * 获取缓存状态信息
 * @returns {object}
 */
function getCacheStatus() {
  try {
    const cache = wx.getStorageSync(CACHE_KEY)
    if (!cache) {
      return { cached: false, version: null, size: 0 }
    }

    const storageInfo = wx.getStorageInfoSync()
    const cacheSize = JSON.stringify(cache).length / 1024 // KB

    return {
      cached: true,
      version: cache.version,
      timestamp: cache.timestamp,
      expireAt: cache.expireAt,
      size: cacheSize.toFixed(2) + ' KB',
      totalStorage: storageInfo.currentSize + ' KB'
    }
  } catch (e) {
    return { cached: false, error: e.message }
  }
}

/**
 * 清除缓存
 */
function clearCache() {
  try {
    wx.removeStorageSync(CACHE_KEY)
    console.log('✅ 手册缓存已清除')
    return true
  } catch (e) {
    console.error('❌ 清除缓存失败:', e)
    return false
  }
}

/**
 * 预加载所有数据到缓存
 * 适合在应用启动时调用
 */
function preloadCache() {
  if (!isCacheValid()) {
    return initCache()
  }
  console.log('📦 手册缓存有效，跳过预加载')
  return true
}

/**
 * 搜索全局内容
 * @param {string} keyword - 搜索关键词
 * @returns {array} - 搜索结果
 */
function searchAll(keyword) {
  if (!keyword || keyword.length < 2) return []

  const results = []
  const lowerKeyword = keyword.toLowerCase()

  // 搜索名词库
  if (allData.glossary && allData.glossary.terms) {
    allData.glossary.terms.forEach(term => {
      if (term.term.toLowerCase().includes(lowerKeyword) ||
          (term.english && term.english.toLowerCase().includes(lowerKeyword)) ||
          term.definition.toLowerCase().includes(lowerKeyword)) {
        results.push({
          type: 'glossary',
          typeName: '名词库',
          id: term.id,
          title: term.term,
          subtitle: term.english,
          content: term.definition
        })
      }
    })
  }

  // 搜索其他分类的标题
  const categories = ['adhesive', 'coating-theory', 'testing', 'troubleshoot']
  const categoryNames = {
    'adhesive': '胶黏剂',
    'coating-theory': '涂布工艺',
    'testing': '测试方法',
    'troubleshoot': '问题诊断'
  }

  categories.forEach(cat => {
    const data = allData[cat]
    if (data && data.categories) {
      data.categories.forEach(category => {
        if (category.items) {
          category.items.forEach(item => {
            if (item.title.toLowerCase().includes(lowerKeyword) ||
                (item.brief && item.brief.toLowerCase().includes(lowerKeyword))) {
              results.push({
                type: cat,
                typeName: categoryNames[cat],
                id: item.id,
                title: item.title,
                subtitle: category.title,
                content: item.brief
              })
            }
          })
        }
      })
    }
  })

  return results.slice(0, 20) // 最多返回20条结果
}

module.exports = {
  initCache,
  getCategoryData,
  isCacheValid,
  getCacheStatus,
  clearCache,
  preloadCache,
  searchAll,
  CACHE_VERSION
}
