const { initTheme, formatNumberObj, formatTime } = require('../../utils/common')
const { saveHistory, deleteHistory } = require('../../utils/history')

Page({
  data: {
    theme: 'dark',
    statusBarHeight: 44,
    showFormula: false, showRPMModal: false, showKModal: false,
    showResetModal: false,
    showHistoryModal: false,

    localHistory: [],

    temp_rpm: '', temp_disp: '',
    errors: {}, pipeMissingText: '', slotMissingText: '',

    rho_wet: '', isPowerLaw: false, viscosity: '', K_val: '', n_val: '',
    pipe_Q: '', pipe_D: '', pipe_L: '', pipe_dz: '', pipe_K_loss: '',
    slot_W: '', slot_H: '', slot_Ls: '',

    result: {
      hasResult: false, layoutMode: '',
      total_dp: { b: '-', p: 0, s: false },
      p_dp: { b: '-', p: 0, s: false }, p_re: '-', p_visc: { b: '-', p: 0, s: false }, p_shear: { b: '-', p: 0, s: false }, p_turb: false,
      s_dp: { b: '-', p: 0, s: false }, s_re: '-', s_visc: { b: '-', p: 0, s: false }, s_shear: { b: '-', p: 0, s: false }, s_turb: false
    }
  },

  onShow() {
    initTheme(this);
    this.loadLocalHistory();
    this.restoreFromHistory();
    // 获取状态栏高度
    const systemInfo = wx.getSystemInfoSync();
    this.setData({ statusBarHeight: systemInfo.statusBarHeight || 44 });
  },

  goBack() {
    wx.navigateBack({ delta: 1 });
  },

  restoreFromHistory() {
    const restoreData = wx.getStorageSync('history_restore_data');
    const restoreModule = wx.getStorageSync('history_restore_module');

    if (restoreData && restoreModule === 'fluid') {
      // 清除标记
      wx.removeStorageSync('history_restore_data');
      wx.removeStorageSync('history_restore_module');
      wx.removeStorageSync('history_restore_type');

      // 回填数据
      this.setData({
        rho_wet: restoreData.rho_wet || '',
        isPowerLaw: restoreData.isPowerLaw || false,
        viscosity: restoreData.viscosity || '',
        K_val: restoreData.K_val || '',
        n_val: restoreData.n_val || '',
        pipe_Q: restoreData.pipe_Q || '',
        pipe_D: restoreData.pipe_D || '',
        pipe_L: restoreData.pipe_L || '',
        pipe_dz: restoreData.pipe_dz || '',
        pipe_K_loss: restoreData.pipe_K_loss || '',
        slot_W: restoreData.slot_W || '',
        slot_H: restoreData.slot_H || '',
        slot_Ls: restoreData.slot_Ls || '',
        result: restoreData.resultCache || this.data.result
      });

      wx.showToast({ title: '已回填历史数据', icon: 'success' });
    }
  },


  toggleModel(e) { this.setData({ isPowerLaw: e.detail.value, 'result.hasResult': false }); },
  toggleFormula() { this.setData({ showFormula: !this.data.showFormula }); },

  onInput(e) {
    // For ui-form-field component, value is in e.detail.value
    const field = e.currentTarget.dataset.field;
    const value = e.detail.value;

    this.setData({ [field]: value, [`errors.${field}`]: false, pipeMissingText: '', slotMissingText: '' });
  },

  onInputFocus(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [`focus.${field}`]: true });
  },

  onInputBlur(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [`focus.${field}`]: false });
  },

  fmt(num) {
    return formatNumberObj(num);
  },

  // 🔥 核心：确保使用的是自定义弹窗，避免白色背景 🔥
  confirmReset() {
    this.setData({ showResetModal: true });
  },
  cancelReset() { this.setData({ showResetModal: false }); },
  execReset() {
    this.setData({
      rho_wet: '', viscosity: '', K_val: '', n_val: '',
      pipe_Q: '', pipe_D: '', pipe_L: '', pipe_dz: '', pipe_K_loss: '',
      slot_W: '', slot_H: '', slot_Ls: '',
      errors: {}, pipeMissingText: '', slotMissingText: '',
      result: { hasResult: false },
      showResetModal: false
    });
  },

  openRPMModal() {
    this.setData({
      showRPMModal: true,
      temp_rpm: '',
      temp_disp: '',
      rpmResult: ''
    });
  },
  closeRPMModal() { this.setData({ showRPMModal: false }); },

  // RPM 弹窗输入处理 - 实时计算
  onRPMInput(e) {
    const field = e.currentTarget.dataset.field;
    const value = e.detail.value;
    this.setData({ [field]: value });
    // 实时计算
    this.calcRPMResult();
  },

  // RPM 弹窗焦点管理
  onRPMFocus(e) {
    const field = e.currentTarget.dataset.field;
    const key = field === 'temp_disp' ? 'rpm_dp' : 'rpm_n';
    this.setData({ [`focus.${key}`]: true });
  },

  onRPMBlur(e) {
    const field = e.currentTarget.dataset.field;
    const key = field === 'temp_disp' ? 'rpm_dp' : 'rpm_n';
    this.setData({ [`focus.${key}`]: false });
  },

  preventBubble() {
    // 阻止冒泡专用
  },

  // 实时计算流量结果
  calcRPMResult() {
    const n = parseFloat(this.data.temp_rpm);
    const dp = parseFloat(this.data.temp_disp);
    if (!isNaN(n) && !isNaN(dp) && n > 0 && dp > 0) {
      const val = dp * n / 1000;
      const showVal = parseFloat(val.toPrecision(6)).toString();
      this.setData({ rpmResult: showVal });
    } else {
      this.setData({ rpmResult: '' });
    }
  },

  // 应用结果到表单
  applyRPMResult() {
    if (this.data.rpmResult) {
      this.setData({
        pipe_Q: this.data.rpmResult,
        'errors.pipe_Q': false,
        showRPMModal: false
      });
      wx.showToast({ title: '已应用', icon: 'success' });
    }
  },

  // 保留旧方法兼容性
  onDispInput(e) { this.setData({ temp_disp: e.detail.value }); this.calcRPMResult(); },
  calcRPMToQ() { this.applyRPMResult(); },

  openKModal() { this.setData({ showKModal: true }); },
  closeKModal() { this.setData({ showKModal: false }); },
  addKFactor(e) {
    const kAdd = parseFloat(e.currentTarget.dataset.k);
    let cur = parseFloat(this.data.pipe_K_loss) || 0;
    this.setData({ pipe_K_loss: (cur + kAdd).toFixed(2), 'errors.pipe_K_loss': false, showKModal: false });
  },

  openHistoryModal() {
    wx.navigateTo({
      url: '/pages/history/index?type=fluid'
    });
  },
  closeHistoryModal() { this.setData({ showHistoryModal: false }); },

  loadLocalHistory() {
    const all = wx.getStorageSync('calc_history') || [];
    const myHist = all.filter(i => i.module === 'fluid').reverse();
    this.setData({ localHistory: myHist });
  },

  deleteHistoryItem(e) {
    const id = e.currentTarget.dataset.id;
    if (id) {
      this.setData({
        showDeleteModal: true,
        pendingDeleteId: id
      });
    }
  },

  confirmDelete() {
    const id = this.data.pendingDeleteId;
    if (id) {
      deleteHistory(id);
      this.loadLocalHistory();
      if (wx.vibrateShort) wx.vibrateShort();
      wx.showToast({ title: '已删除', icon: 'success' });
    }
    this.setData({ showDeleteModal: false, pendingDeleteId: null });
  },

  cancelDelete() {
    this.setData({ showDeleteModal: false, pendingDeleteId: null });
  },

  restoreHistory(e) {
    const idx = e.currentTarget.dataset.index;
    const item = this.data.localHistory[idx];
    const raw = item.rawData;

    if (raw) {
      this.setData({
        rho_wet: raw.rho_wet,
        isPowerLaw: raw.isPowerLaw,
        viscosity: raw.viscosity,
        K_val: raw.K_val,
        n_val: raw.n_val,
        pipe_Q: raw.pipe_Q,
        pipe_D: raw.pipe_D,
        pipe_L: raw.pipe_L,
        pipe_dz: raw.pipe_dz,
        pipe_K_loss: raw.pipe_K_loss,
        slot_W: raw.slot_W,
        slot_H: raw.slot_H,
        slot_Ls: raw.slot_Ls,
        result: raw.resultCache || { hasResult: false }
      });
      this.closeHistoryModal();
      wx.showToast({ title: '参数已填入', icon: 'success' });
    }
  },

  saveHistory() {
    const d = this.data;
    const r = d.result;
    if (!r.hasResult) return;

    const fmtStr = (obj) => obj.s ? (obj.b + 'e' + obj.p) : obj.b;

    const displayData = [
      { k: '【结果】总压降', v: fmtStr(r.total_dp) + ' kPa' },
      { k: '【输入】流量Q', v: d.pipe_Q + ' L/min' },
      { k: '【输入】密度ρ', v: d.rho_wet + ' g/cm³' }
    ];
    if (d.pipe_D) displayData.push({ k: '【输入】管径D', v: d.pipe_D + ' mm' });
    if (d.slot_H) displayData.push({ k: '【输入】模头H', v: d.slot_H + ' μm' });

    const rawData = {
      rho_wet: d.rho_wet, isPowerLaw: d.isPowerLaw, viscosity: d.viscosity,
      K_val: d.K_val, n_val: d.n_val,
      pipe_Q: d.pipe_Q, pipe_D: d.pipe_D, pipe_L: d.pipe_L, pipe_dz: d.pipe_dz, pipe_K_loss: d.pipe_K_loss,
      slot_W: d.slot_W, slot_H: d.slot_H, slot_Ls: d.slot_Ls,
      resultCache: d.result
    };

    // 使用统一历史管理
    saveHistory('fluid', 'pressure', displayData, rawData);

    this.loadLocalHistory();
    wx.showToast({ title: '已保存', icon: 'success' });
  },


  handleCalc(e) {
    const mode = e.currentTarget.dataset.mode;
    const d = this.data;
    let err = {};
    let missingP = [], missingS = [];

    if (!d.rho_wet) { err.rho_wet = true; missingP.push('ρ'); missingS.push('ρ'); }
    if (d.isPowerLaw) {
      if (!d.K_val) { err.K_val = true; missingP.push('K'); missingS.push('K'); }
      if (!d.n_val) { err.n_val = true; missingP.push('n'); missingS.push('n'); }
    } else {
      if (!d.viscosity) { err.viscosity = true; missingP.push('μ'); missingS.push('μ'); }
    }
    if (!d.pipe_Q) { err.pipe_Q = true; missingP.push('Q'); missingS.push('Q'); }

    if (mode === 'pipe' || mode === 'total') {
      if (!d.pipe_D) { err.pipe_D = true; missingP.push('D'); }
      if (!d.pipe_L) { err.pipe_L = true; missingP.push('L'); }
      if (d.pipe_dz === '') { err.pipe_dz = true; missingP.push('Δz'); }
      if (d.pipe_K_loss === '') { err.pipe_K_loss = true; missingP.push('ΣK'); }
    }

    if (mode === 'slot' || mode === 'total') {
      if (!d.slot_W) { err.slot_W = true; missingS.push('W'); }
      if (!d.slot_H) { err.slot_H = true; missingS.push('H'); }
      if (!d.slot_Ls) { err.slot_Ls = true; missingS.push('Ls'); }
    }

    this.setData({ errors: err });
    let pText = missingP.length > 0 ? `* 缺: ${missingP.join(', ')}` : '';
    let sText = missingS.length > 0 ? `* 缺: ${missingS.join(', ')}` : '';

    if (mode === 'pipe' && pText) { this.setData({ pipeMissingText: pText }); return; }
    if (mode === 'slot' && sText) { this.setData({ slotMissingText: sText }); return; }
    if (mode === 'total' && (pText || sText)) {
      this.setData({ pipeMissingText: pText, slotMissingText: sText });
      return;
    }

    this.runMath(mode);
  },

  runMath(mode) {
    const d = this.data;
    const rho = parseFloat(d.rho_wet) * 1000;
    let K = 0, n = 1;
    if (d.isPowerLaw) { K = parseFloat(d.K_val); n = parseFloat(d.n_val); }
    else { K = parseFloat(d.viscosity) / 1000; n = 1; }
    const Q = parseFloat(d.pipe_Q) / 60000;

    let p_dp = 0, p_re = 0, p_visc = 0, p_shear = 0, p_turb = false;
    if (mode === 'pipe' || mode === 'total') {
      const D = parseFloat(d.pipe_D) / 1000;
      const L = parseFloat(d.pipe_L);
      const dz = parseFloat(d.pipe_dz);
      const Kl = parseFloat(d.pipe_K_loss);
      const factor = (3 * n + 1) / (4 * n);
      const shear = factor * (32 * Q) / (Math.PI * Math.pow(D, 3));
      const mu_eff = K * Math.pow(shear, n - 1);
      const v = Q / (Math.PI * Math.pow(D / 2, 2));
      const re = (rho * v * D) / mu_eff;
      const dp = (128 * mu_eff * L * Q) / (Math.PI * Math.pow(D, 4)) + rho * 9.81 * dz + Kl * 0.5 * rho * v * v;
      p_dp = dp / 1000; p_re = re; p_visc = mu_eff * 1000; p_shear = shear; p_turb = re > 2300;
    }

    let s_dp = 0, s_re = 0, s_visc = 0, s_shear = 0, s_turb = false;
    if (mode === 'slot' || mode === 'total') {
      const W = parseFloat(d.slot_W) / 1000;
      const H = parseFloat(d.slot_H) / 1e6;
      const Ls = parseFloat(d.slot_Ls) / 1000;
      const factor = (2 * n + 1) / (3 * n);
      const shear = factor * (6 * Q) / (W * H * H);
      const mu_eff = K * Math.pow(shear, n - 1);
      const v = Q / (W * H);
      const re = (rho * v * (2 * H)) / mu_eff;
      const dp = (12 * mu_eff * Ls * Q) / (W * Math.pow(H, 3));
      s_dp = dp / 1000; s_re = re; s_visc = mu_eff * 1000; s_shear = shear; s_turb = re > 2300;
    }

    let layout = 'dual';
    if (mode === 'pipe') layout = 'single-pipe';
    if (mode === 'slot') layout = 'single-slot';

    this.setData({
      result: {
        hasResult: true, layoutMode: layout,
        total_dp: this.fmt(p_dp + s_dp),
        p_dp: this.fmt(p_dp), p_re: this.fmt(p_re), p_visc: this.fmt(p_visc), p_shear: this.fmt(p_shear), p_turb: p_turb,
        s_dp: this.fmt(s_dp), s_re: this.fmt(s_re), s_visc: this.fmt(s_visc), s_shear: this.fmt(s_shear), s_turb: s_turb
      },
      pipeMissingText: '', slotMissingText: ''
    });
  }
})