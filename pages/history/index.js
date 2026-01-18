const app = getApp()
const { initTheme } = require('../../utils/common')
const { getHistory, getModuleOptions, deleteHistory, clearHistory, migrateOldHistory } = require('../../utils/history')

Page({
  data: {
    theme: 'dark',
    historyList: [],
    filteredList: [],
    showResetModal: false,

    // 模块筛选
    moduleOptions: [],
    currentModule: 'all'  // 'all' 表示全部
  },

  onShow() {
    initTheme(this);
    // 首次加载时迁移旧数据
    migrateOldHistory();
    this.initModules();
    this.loadHistory();
  },

  initModules() {
    let options = [{ id: 'all', name: '全部', icon: '📋' }, ...getModuleOptions()];
    // 移除 工程单位换算(converter)
    options = options.filter(o => o.id !== 'converter');
    this.setData({ moduleOptions: options });
  },

  loadHistory() {
    const module = this.data.currentModule === 'all' ? null : this.data.currentModule;
    const list = getHistory(module);
    this.setData({
      historyList: list,
      filteredList: list
    });
  },

  // 切换模块筛选
  switchModule(e) {
    const moduleId = e.currentTarget.dataset.module;
    this.setData({ currentModule: moduleId });
    this.loadHistory();
  },

  // 点击记录回填
  onItemTap(e) {
    const item = e.currentTarget.dataset.item;
    const module = item.module;

    // 根据模块跳转到对应页面
    const routes = {
      coating: '/pages/coating/index',
      fluid: '/pages/fluid/index',
      cost: '/pages/cost/index',
      converter: '/pages/tools/converter/index'
    };

    const url = routes[module];
    if (url) {
      // 将数据存入临时存储，目标页面读取
      wx.setStorageSync('history_restore_data', item.rawData);
      wx.setStorageSync('history_restore_module', module);
      wx.setStorageSync('history_restore_type', item.type);
      wx.navigateTo({ url });
    }
  },

  clearAll() {
    this.setData({ showResetModal: true });
  },

  cancelReset() {
    this.setData({ showResetModal: false });
  },

  execReset() {
    const module = this.data.currentModule === 'all' ? null : this.data.currentModule;
    clearHistory(module);
    this.setData({
      historyList: [],
      filteredList: [],
      showResetModal: false
    });
    wx.showToast({ title: '已清空', icon: 'success' });
  },

  deleteItem(e) {
    const id = e.currentTarget.dataset.id;
    deleteHistory(id);
    this.loadHistory();
    wx.showToast({ title: '已删除', icon: 'success', duration: 800 });
  }
})