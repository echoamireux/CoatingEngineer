const app = getApp()
const { initTheme } = require('../../utils/common')
const { getHistory, getModuleOptions, deleteHistory, clearHistory, migrateOldHistory } = require('../../utils/history')

Page({
  data: {
    theme: 'dark',
    themeClass: '', // 智能主题跟随
    historyList: [],
    filteredList: [],
    showResetModal: false,

    // 模块筛选
    moduleOptions: [],
    currentModule: 'cost' /* Default to Cost (first in list) */
  },

  onLoad(options) {
    if (options && options.type) {
      this.setData({
        themeClass: `theme-${options.type}`,
        currentModule: options.type
      });
      // 动态设置标题 - 设为空以避免显式冗余
      wx.setNavigationBarTitle({ title: '' });
    }
  },

  onShow() {
    initTheme(this);
    // 首次加载时迁移旧数据
    migrateOldHistory();
    this.initModules();
    this.loadHistory();
  },

  initModules() {
    /* Remove 'All' option */
    let options = [...getModuleOptions()];
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
    this.setData({
      showDeleteModal: true,
      pendingDeleteId: id
    });
  },

  confirmDelete() {
    const id = this.data.pendingDeleteId;
    if (id) {
      deleteHistory(id);
      this.loadHistory();
      wx.showToast({ title: '已删除', icon: 'success', duration: 800 });
    }
    this.setData({ showDeleteModal: false, pendingDeleteId: null });
  },

  cancelDelete() {
    this.setData({ showDeleteModal: false, pendingDeleteId: null });
  }
})