const app = getApp()

// ★★★ 团队访问口令 ★★★
const ACCESS_CODE = '2300';

Page({
  data: {
    theme: 'dark',

    // --- 弹窗控制状态 ---
    showModal: false,
    modalType: '',         // 'login' | 'dev'
    modalTitle: '',
    modalDesc: '',
    pendingPath: '',
    inputCode: '',

    menuList: [
      {
        id: 'cost',
        title: '生产成本核算',
        desc: '精益成本核算 / 辅助费率计算',
        path: '/pages/cost/index',
        icon: '💰',
        color: '#10b981',
        isDev: true // 标记为开发中
      },
      {
        id: 'coating',
        title: '涂布与卷材计算',
        desc: '卷径计算 / 卷材重量估算 / 泵速计算 / 湿胶重计算',
        path: '/pages/coating/index',
        icon: '⚙️',
        color: '#6366f1'
      },
      {
        id: 'fluid',
        title: '流体力学计算',
        desc: '供液管路 / 狭缝模头压降',
        path: '/pages/fluid/index',
        icon: '💧',
        color: '#3b82f6'
      },
      {
        id: 'converter',
        title: '工程单位换算',
        desc: '粘度 / 压力 / 涂布干重',
        path: '/pages/tools/converter/index',
        icon: '🔄',
        color: '#8b5cf6'
      },
      {
        id: 'history',
        title: '历史记录',
        desc: '查看过往计算数据',
        path: '/pages/history/index',
        icon: '📜',
        color: '#10b981'
      },
    ]
  },

  onLoad() {
    const savedTheme = wx.getStorageSync('theme');
    if (savedTheme) {
      this.setData({ theme: savedTheme });
    }
  },

  toggleTheme() {
    const newTheme = this.data.theme === 'dark' ? 'light' : 'dark';
    this.setData({ theme: newTheme });
    wx.setStorageSync('theme', newTheme);
    wx.setNavigationBarColor({
      frontColor: newTheme === 'dark' ? '#ffffff' : '#000000',
      backgroundColor: newTheme === 'dark' ? '#111827' : '#f3f4f6'
    });
  },

  // --- 核心跳转逻辑 ---
  navigateTo(e) {
    const path = e.currentTarget.dataset.path;
    const targetItem = this.data.menuList.find(item => item.path === path);

    // ★★★ 第一关：先检查是否开发中 ★★★
    if (targetItem && targetItem.isDev) {
      this.setData({
        showModal: true,
        modalType: 'dev', // 设置为敬请期待模式
        modalTitle: '功能升级中',
        modalDesc: '该模块正在进行 v2.0 算法重构，\n将包含更精准的费率估算模型。\n敬请期待！'
      });
      return; // 直接拦截，不查登录
    }

    // ★★★ 第二关：检查登录状态 ★★★
    const isLogin = wx.getStorageSync('isLogin');

    if (!isLogin) {
      // 没登录 -> 呼出登录弹窗
      this.setData({
        showModal: true,
        modalType: 'login', // 设置为登录模式
        modalTitle: '访问受限',
        modalDesc: '为保护核心工艺数据，请输入团队访问口令。',
        pendingPath: path,
        inputCode: ''
      });
      return;
    }

    // ★★★ 第三关：通关跳转 ★★★
    if (path) {
      wx.navigateTo({
        url: path,
        fail: (err) => {
          console.error('跳转失败:', err);
          wx.showToast({ title: '路径配置错误', icon: 'none' });
        }
      });
    }
  },

  closeModal() {
    this.setData({ showModal: false });
  },

  onLoginInput(e) {
    this.setData({ inputCode: e.detail.value });
  },

  // --- 处理弹窗确认按钮 ---
  handleModalConfirm() {
    // 只有登录模式下，确认按钮才执行验证逻辑
    if (this.data.modalType === 'login') {
      if (this.data.inputCode === ACCESS_CODE) {
        wx.setStorageSync('isLogin', true);
        wx.showToast({ title: '验证通过', icon: 'success' });
        this.setData({ showModal: false });

        // 登录成功后，自动跳转
        const path = this.data.pendingPath;
        if (path) {
          setTimeout(() => { wx.navigateTo({ url: path }); }, 500);
        }
      } else {
        wx.vibrateShort();
        wx.showToast({ title: '口令错误', icon: 'error' });
        this.setData({ inputCode: '' });
      }
    }
    // 开发提示模式下，确认按钮只是关闭弹窗
    else {
      this.setData({ showModal: false });
    }
  }
})