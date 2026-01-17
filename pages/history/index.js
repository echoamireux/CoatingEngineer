const app = getApp()
const { initTheme } = require('../../utils/common')

Page({
  data: {
    theme: 'dark',
    historyList: [],
    showResetModal: false
  },

  onShow() {
    initTheme(this);
    this.loadHistory();
  },

  loadHistory() {
    const list = wx.getStorageSync('calc_history') || [];
    this.setData({ historyList: list.reverse() });
  },

  // 🔥 修改 1：点击垃圾桶，只显示弹窗，不直接调用系统弹窗
  clearAll() {
    this.setData({ showResetModal: true });
  },

  // 🔥 新增：点击取消
  cancelReset() {
    this.setData({ showResetModal: false });
  },

  // 🔥 新增：点击确定（真正的删除逻辑移到这里）
  execReset() {
    wx.removeStorageSync('calc_history');
    this.setData({
      historyList: [],
      showResetModal: false // 删完关闭弹窗
    });
    wx.showToast({ title: '已清空', icon: 'success' });
  },

  deleteItem(e) {
    const idx = e.currentTarget.dataset.index;
    let list = this.data.historyList;
    list.splice(idx, 1);
    this.setData({ historyList: list });
    wx.setStorageSync('calc_history', list.reverse());
    this.loadHistory();
  }
})