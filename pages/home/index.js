const app = getApp()

// ★★★ 团队访问口令 ★★★
const ACCESS_CODE = '2300';

// ★★★ 审核模式开关 ★★★
// true = 显示赞赏（上线后改为true）； false = 隐藏赞赏（审核时用）
const SHOW_REWARD = true;

// ★★★ 赞赏码路径 ★★★
const REWARD_IMAGE_PATH = '/images/reward.jpg'; 

Page({
  data: {
    theme: 'dark', 
    showReward: SHOW_REWARD, // 注入到页面数据中

    // --- 弹窗控制状态 ---
    showModal: false,
    modalType: '', 
    modalTitle: '',
    modalDesc: '',
    pendingPath: '',
    inputCode: '',

    menuList: [
      {
        id: 'cost',
        title: '生产成本核算',
        desc: '多层级成本流 / 智能报价模拟',
        path: '/pages/cost/index',
        icon: '💰',
        color: '#10b981',
        isDev: false // 标记为开发中
      },
      {
        id: 'coating',
        title: '涂布与卷材计算',
        desc: '卷径 / 重量 / 泵速 / 湿胶重',
        path: '/pages/coating/index',
        icon: '⚙️',
        color: '#6366f1'
      },
      {
        id: 'fluid',
        title: '流体力学计算',
        desc: '供液管路压降 / 狭缝模头压降',
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
    const savedTheme = wx.getStorageSync('theme') || 'dark';
    this.setData({ theme: savedTheme });
    this.updateStatusBar(savedTheme);
  },

  toggleTheme() {
    const newTheme = this.data.theme === 'dark' ? 'light' : 'dark';
    this.setData({ theme: newTheme });
    wx.setStorageSync('theme', newTheme);
    this.updateStatusBar(newTheme);
  },

  updateStatusBar(theme) {
    wx.setNavigationBarColor({
      frontColor: theme === 'dark' ? '#ffffff' : '#000000',
      backgroundColor: theme === 'dark' ? '#111827' : '#f3f4f6'
    });
  },

  openAbout() {
    this.setData({
      showModal: true,
      modalType: 'about',
      modalTitle: '关于作者',
      modalDesc: ''
    });
  },

  // ★★★ 优化后的赞赏逻辑 (为以后开启做准备) ★★★
  previewReward() {
    // 如果是审核模式，直接拦截（双重保险）
    if (!SHOW_REWARD) return;

    wx.previewImage({
      urls: [REWARD_IMAGE_PATH],
      current: REWARD_IMAGE_PATH,
      fail: () => {
        // 如果预览失败，尝试提示用户保存
        wx.showModal({
          title: '提示',
          content: '无法预览图片，是否保存赞赏码到相册？',
          success: (res) => {
            if (res.confirm) {
              wx.saveImageToPhotosAlbum({ filePath: REWARD_IMAGE_PATH });
            }
          }
        });
      }
    });
  },

  navigateTo(e) {
    const path = e.currentTarget.dataset.path;
    const targetItem = this.data.menuList.find(item => item.path === path);

    // 1. 开发中拦截
    if (targetItem && targetItem.isDev) {
      this.setData({
        showModal: true,
        modalType: 'dev',
        modalTitle: '功能完善中',
        modalDesc: '该模块正在进行最终算法校准，\n将随正式版一同发布。\n敬请期待！'
      });
      return;
    }

    // 2. 登录拦截
    const isLogin = wx.getStorageSync('isLogin');
    if (!isLogin) {
      this.setData({
        showModal: true,
        modalType: 'login',
        modalTitle: '访问受限',
        modalDesc: '为保护核心工艺数据，请输入团队访问口令。',
        pendingPath: path,
        inputCode: ''
      });
      return;
    }

    if (path) {
      wx.navigateTo({
        url: path,
        fail: () => wx.showToast({ title: '路径配置错误', icon: 'none' })
      });
    }
  },

  closeModal() {
    this.setData({ showModal: false });
  },

  onLoginInput(e) {
    this.setData({ inputCode: e.detail.value });
  },

  handleModalConfirm() {
    if (this.data.modalType === 'login') {
      if (this.data.inputCode === ACCESS_CODE) {
        wx.setStorageSync('isLogin', true);
        wx.showToast({ title: '验证通过', icon: 'success' });
        this.setData({ showModal: false });
        if (this.data.pendingPath) {
          setTimeout(() => { wx.navigateTo({ url: this.data.pendingPath }); }, 500);
        }
      } else {
        wx.vibrateShort();
        wx.showToast({ title: '口令错误', icon: 'error' });
        this.setData({ inputCode: '' });
      }
    } else {
      this.setData({ showModal: false });
    }
  }
})