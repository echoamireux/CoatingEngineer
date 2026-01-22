const app = getApp()
const { initTheme, toggleTheme: commonToggleTheme } = require('../../utils/common')
const { SHOW_REWARD, REWARD_IMAGE_PATH } = require('../../utils/config')

// 尝试加载本地私有配置（不提交到远程仓库）
let FALLBACK_CODE = null
try {
  const localConfig = require('../../utils/config.local')
  FALLBACK_CODE = localConfig.FALLBACK_CODE
} catch (e) {
  console.warn('未找到 config.local.js，本地备用验证已禁用')
}

Page({
  data: {
    theme: 'dark',
    statusBarHeight: 44,
    showReward: SHOW_REWARD,
    requirePasscode: true,    // 是否需要口令验证（从云端读取）
    passcodeHint: '流体力学临界雷诺数 (Re)',  // 口令提示词（从云端读取）

    // --- 弹窗控制状态 ---
    showModal: false,
    modalType: '',
    modalTitle: '',
    modalDesc: '',
    pendingPath: '',
    inputCode: '',
    adminTapCount: 0, // 管理员入口点击计数

    menuList: [
      {
        id: 'cost',
        title: '生产成本核算',
        desc: '多层级成本流 / 智能报价模拟',
        path: '/pages/cost/index',
        icon: '💰',
        color: '#10b981', // Emerald
        isDev: false
      },
      {
        id: 'coating',
        title: '涂布生产计算', /* Professional Functional Title */
        desc: '卷径 / 重量 / 泵速 / 湿胶重',
        path: '/pages/coating/index',
        icon: '🏭', /* Factory Icon */
        color: '#f59e0b', // Amber
      },
      {
        id: 'handbook',
        title: '涂布工程师手册',
        desc: '术语 / 材料 / 设备 / 工艺 / 诊断',
        path: '/pages/handbook/index',
        icon: '📚',
        color: '#6366f1' // Indigo - 手册专属色
      },
      {
        id: 'fluid',
        title: '流体力学计算',
        desc: '供液管路压降 / 狭缝模头压降',
        path: '/pages/fluid/index',
        icon: '💧',
        color: '#3b82f6' // Ocean
      },
      {
        id: 'converter',
        title: '工程单位换算',
        desc: '粘度 / 压力 / 涂布干重',
        path: '/pages/tools/converter/index',
        icon: '🔄',
        color: '#8b5cf6' // Violet
      },
      {
        id: 'history',
        title: '历史记录',
        desc: '查看过往计算数据',
        path: '/pages/history/index',
        icon: '📜',
        color: '#64748b' // Slate Blue
      },
    ]
  },

  onLoad() {
    initTheme(this);
    // 获取状态栏高度用于沉浸式适配
    const systemInfo = wx.getSystemInfoSync();
    this.setData({ statusBarHeight: systemInfo.statusBarHeight || 44 });
  },

  onShow() {
    // 每次页面显示时刷新应用设置（支持云端即时生效）
    this.loadAppSettings();
  },

  // 从云端加载应用设置
  async loadAppSettings() {
    try {
      const db = wx.cloud.database()
      // 一次性获取所有应用设置
      const res = await db.collection('app_settings').get()

      // 遍历设置并应用
      const settings = {}
      res.data.forEach(item => {
        if (item.key === 'require_passcode') {
          settings.requirePasscode = item.value
        } else if (item.key === 'show_reward') {
          settings.showReward = item.value
        } else if (item.key === 'passcode_hint') {
          settings.passcodeHint = item.value
        }
      })

      // 应用设置（未配置的使用默认值）
      // passcodeHint: 空字符串 = 隐藏提示, undefined = 使用默认值
      const hintValue = settings.passcodeHint !== undefined
        ? settings.passcodeHint
        : '流体力学临界雷诺数 (Re)'

      this.setData({
        requirePasscode: settings.requirePasscode !== undefined ? settings.requirePasscode : true,
        showReward: settings.showReward !== undefined ? settings.showReward : false,
        passcodeHint: hintValue
      })

      console.log('✅ 应用设置加载成功:', settings)
    } catch (err) {
      console.warn('获取应用设置失败，使用默认值:', err)
      this.setData({ requirePasscode: true, showReward: false, passcodeHint: '流体力学临界雷诺数 (Re)' })
    }
  },

  toggleTheme() {
    commonToggleTheme(this);
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
    // 依赖云端配置的状态
    if (!this.data.showReward) return;

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

    // 2. 登录拦截（可通过云端开关控制）
    const isLogin = wx.getStorageSync('isLogin');
    if (this.data.requirePasscode && !isLogin) {
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

  async handleModalConfirm() {
    if (this.data.modalType === 'login') {
      // 显示加载提示
      wx.showLoading({ title: '验证中...' })

      try {
        // 优先使用云端验证
        const res = await wx.cloud.callFunction({
          name: 'verifyPasscode',
          data: { code: this.data.inputCode }
        })

        wx.hideLoading()

        if (res.result.success) {
          wx.setStorageSync('isLogin', true)
          wx.showToast({ title: '验证通过', icon: 'success' })
          this.setData({ showModal: false })
          if (this.data.pendingPath) {
            setTimeout(() => { wx.navigateTo({ url: this.data.pendingPath }) }, 500)
          }
        } else {
          wx.vibrateShort()
          wx.showToast({ title: res.result.message || '口令错误', icon: 'error' })
          this.setData({ inputCode: '' })
        }
      } catch (err) {
        wx.hideLoading()
        console.warn('云函数调用失败:', err)

        // 本地备用口令（仅在云端不可用且配置了备用口令时使用）
        if (FALLBACK_CODE && this.data.inputCode === FALLBACK_CODE) {
          console.log('使用本地备用验证')
          wx.setStorageSync('isLogin', true)
          wx.showToast({ title: '验证通过', icon: 'success' })
          this.setData({ showModal: false })
          if (this.data.pendingPath) {
            setTimeout(() => { wx.navigateTo({ url: this.data.pendingPath }) }, 500)
          }
        } else if (FALLBACK_CODE) {
          // 有备用口令但输入错误
          wx.vibrateShort()
          wx.showToast({ title: '口令错误', icon: 'error' })
          this.setData({ inputCode: '' })
        } else {
          // 没有配置备用口令，直接提示网络异常
          wx.showToast({ title: '网络异常', icon: 'error' })
        }
      }
    } else {
      this.setData({ showModal: false })
    }
  },

  // 隐蔽入口：5秒内点击5次
  onAdminTitleTap() {
    const now = Date.now()
    if (this.lastTapTime && (now - this.lastTapTime > 5000)) {
      this.setData({ adminTapCount: 0 }) // 超时重置
    }

    this.lastTapTime = now
    let count = this.data.adminTapCount + 1
    this.setData({ adminTapCount: count })

    if (count >= 5) {
      this.setData({ showModal: false, adminTapCount: 0 }) // 关闭弹窗并重置
      wx.vibrateLong()
      wx.navigateTo({
        url: '/pages/admin/index',
        fail: (err) => {
          console.error('跳转管理员页面失败:', err)
          wx.showToast({ title: '无法打开后台', icon: 'none' })
        }
      })
    } else if (count >= 3) {
      wx.vibrateShort() // 3次后开始震动反馈
    }
  }
})