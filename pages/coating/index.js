const { initTheme, formatNumber, formatTime } = require('../../utils/common')
const { saveHistory, getHistory, deleteHistory } = require('../../utils/history')

Page({
  data: {
    theme: 'dark',
    currentTab: 'composite',

    // --- 悬浮公式条 ---
    showFormulaModal: false,

    // --- 历史弹窗 ---
    showHistoryModal: false,
    historyList: [],
    historyType: '',
    // --- 确认弹窗 ---
    showResetModal: false,

    // --- 复合卷材 ---
    comp_i: '', comp_c: '', comp_L: '',
    layers: [{ width: '', thickness: '', density: '', err_w: false, err_t: false, err_d: false }],
    result_diameter: '-', result_weight: '-',

    // --- 涂布工艺 ---
    glueCalcType: 'thickness',
    glue_t_dry: '', glue_rho_dry: '', glue_m_dry: '',
    glue_S: '', glue_rho_wet: '', glue_W: '', glue_v: '', glue_Dp: '', glue_L: '',
    result_pump_speed: '-', result_wet_weight: '-',

    errors: {},


  },

  onLoad() { initTheme(this); },

  onShow() {
    this.restoreFromHistory();
  },

  restoreFromHistory() {
    const restoreData = wx.getStorageSync('history_restore_data');
    const restoreModule = wx.getStorageSync('history_restore_module');
    const restoreType = wx.getStorageSync('history_restore_type');

    if (restoreData && restoreModule === 'coating') {
      // 清除标记
      wx.removeStorageSync('history_restore_data');
      wx.removeStorageSync('history_restore_module');
      wx.removeStorageSync('history_restore_type');

      if (restoreType === 'composite') {
        // 回填复合卷材数据
        this.setData({
          currentTab: 'composite',
          comp_i: restoreData.comp_i || '',
          comp_c: restoreData.comp_c || '',
          comp_L: restoreData.comp_L || '',
          layers: restoreData.layers || [{ width: '', thickness: '', density: '', err_w: false, err_t: false, err_d: false }],
          result_diameter: restoreData.result_diameter || '-',
          result_weight: restoreData.result_weight || '-'
        });
      } else if (restoreType === 'glue') {
        // 回填涂布工艺数据
        this.setData({
          currentTab: 'glue',
          glueCalcType: restoreData.glueCalcType || 'thickness',
          glue_t_dry: restoreData.glue_t_dry || '',
          glue_rho_dry: restoreData.glue_rho_dry || '',
          glue_m_dry: restoreData.glue_m_dry || '',
          glue_S: restoreData.glue_S || '',
          glue_rho_wet: restoreData.glue_rho_wet || '',
          glue_W: restoreData.glue_W || '',
          glue_v: restoreData.glue_v || '',
          glue_Dp: restoreData.glue_Dp || '',
          glue_L: restoreData.glue_L || '',
          result_pump_speed: restoreData.result_pump_speed || '-',
          result_wet_weight: restoreData.result_wet_weight || '-'
        });
      }

      wx.showToast({ title: '已回填历史数据', icon: 'success' });
    }
  },

  switchTab(e) {
    this.setData({
      currentTab: e.currentTarget.dataset.tab,
      showHistoryModal: false,
      showFormulaBar: false
    });
  },

  bindInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [field]: e.detail.value, [`errors.${field}`]: false });
  },

  // === 公式条 ===
  toggleFormula() {
    this.setData({
      showFormulaModal: !this.data.showFormulaModal
    });
  },

  // === 历史记录 ===
  // === 历史记录 ===
  openHistory() {
    const tab = this.data.currentTab;
    const all = getHistory('coating') || [];
    const list = all.filter(item => item.type === tab);

    this.setData({
      historyType: tab,
      historyList: list,
      showHistoryModal: true
    });
  },

  closeHistory() { this.setData({ showHistoryModal: false }); },

  loadHistoryItem(e) {
    const item = e.currentTarget.dataset.item;
    const p = item.rawData;

    if (this.data.historyType === 'composite') {
      this.setData({
        comp_i: p.comp_i, comp_c: p.comp_c, comp_L: p.comp_L,
        layers: p.layers,
        result_diameter: '-', result_weight: '-', errors: {}
      }, () => {
        this.calcCompDiameter(true);
        this.calcCompWeight(true);
      });
    } else {
      this.setData({
        glueCalcType: p.glueCalcType,
        glue_t_dry: p.glue_t_dry, glue_rho_dry: p.glue_rho_dry, glue_m_dry: p.glue_m_dry,
        glue_S: p.glue_S, glue_rho_wet: p.glue_rho_wet, glue_W: p.glue_W,
        glue_v: p.glue_v, glue_Dp: p.glue_Dp, glue_L: p.glue_L,
        result_pump_speed: '-', result_wet_weight: '-', errors: {}
      }, () => {
        this.updateFormulas(p.glueCalcType);
        this.calcGluePump(true);
        this.calcGlueWetWeight(true);
      });
    }
    this.setData({ showHistoryModal: false });
    // vibrateSuccess();
  },

  deleteHistoryItem(e) {
    const id = e.currentTarget.dataset.id;
    deleteHistory(id);

    // Refresh list
    const tab = this.data.currentTab;
    const all = getHistory('coating') || [];
    const list = all.filter(item => item.type === tab);
    this.setData({ historyList: list });
  },

  // ================= 1. 复合卷材 =================
  setCoreSize(e) {
    const size = String(e.currentTarget.dataset.size);
    this.setData({ comp_i: size === '0' ? '' : size, 'errors.comp_i': false });
  },
  addLayer() {
    const l = this.data.layers;
    l.push({ width: '', thickness: '', density: '', err_w: false, err_t: false, err_d: false });
    this.setData({ layers: l });
  },
  removeLayer(e) {
    const l = this.data.layers;
    if (l.length > 1) { l.splice(e.currentTarget.dataset.index, 1); this.setData({ layers: l }); }
  },
  bindLayerInput(e) {
    const idx = e.currentTarget.dataset.index;
    const field = e.currentTarget.dataset.field;
    const l = this.data.layers;
    l[idx][field] = e.detail.value;
    if (field === 'width') l[idx].err_w = false;
    if (field === 'thickness') l[idx].err_t = false;
    if (field === 'density') l[idx].err_d = false;
    this.setData({ layers: l });
  },

  _isSilent(e) { return typeof e === 'boolean' ? e : false; },

  _checkComp(fields, isSilent) {
    if (!isSilent) {
      const resetLayers = this.data.layers.map(l => ({ ...l, err_w: false, err_t: false, err_d: false }));
      this.setData({ errors: {}, layers: resetLayers });
    }
    let errs = {};
    let isValid = true;
    let l = this.data.layers;
    fields.forEach(f => {
      if (f.startsWith('layer_')) return;
      if (!this.data[f] || isNaN(parseFloat(this.data[f])) || parseFloat(this.data[f]) < 0) {
        errs[f] = true; isValid = false;
      }
    });
    l.forEach(layer => {
      if (fields.includes('layer_w')) { if (!layer.width || parseFloat(layer.width) < 0) { layer.err_w = true; isValid = false; } }
      if (fields.includes('layer_t')) { if (!layer.thickness || parseFloat(layer.thickness) < 0) { layer.err_t = true; isValid = false; } }
      if (fields.includes('layer_d')) { if (!layer.density || parseFloat(layer.density) < 0) { layer.err_d = true; isValid = false; } }
    });
    if (!isSilent) {
      this.setData({ layers: l, errors: errs });
    }
    return isValid;
  },

  calcCompDiameter(e) {
    const isSilent = this._isSilent(e);
    if (!this._checkComp(['comp_i', 'comp_c', 'comp_L', 'layer_t'], isSilent)) return;
    const { comp_i, comp_c, comp_L, layers } = this.data;
    let t_total = layers.reduce((acc, cur) => acc + parseFloat(cur.thickness || 0), 0);
    const D = Math.sqrt(Math.pow(parseFloat(comp_i) + 2 * parseFloat(comp_c), 2) + (4 * parseFloat(comp_L) * t_total) / Math.PI);

    const showD = formatNumber(D);
    this.setData({ result_diameter: showD });
  },

  calcCompWeight(e) {
    const isSilent = this._isSilent(e);
    if (!this._checkComp(['comp_L', 'layer_w', 'layer_t', 'layer_d'], isSilent)) return;
    const { comp_L, layers } = this.data;
    let total = 0;
    layers.forEach(l => total += (parseFloat(l.width) * parseFloat(l.thickness) * parseFloat(l.density)));
    const M = (parseFloat(comp_L) * total) / 1000000;

    const showM = formatNumber(M);
    this.setData({ result_weight: showM });
  },

  calculateComposite(e) {
    const isSilent = this._isSilent(e);
    if (!this._checkComp(['comp_i', 'comp_c', 'comp_L', 'layer_w', 'layer_t', 'layer_d'], isSilent)) return;
    this.calcCompDiameter(true);
    this.calcCompWeight(true);
  },

  resetComposite() {
    this.setData({ showResetModal: true });
  },

  confirmClear() {
    if (this.data.currentTab === 'composite') {
      this.setData({
        comp_i: '', comp_c: '', comp_L: '',
        layers: [{ width: '', thickness: '', density: '', err_w: false, err_t: false, err_d: false }],
        result_diameter: '-', result_weight: '-', errors: {}
      });
    } else {
      this.setData({
        glue_t_dry: '', glue_rho_dry: '', glue_m_dry: '',
        glue_S: '', glue_rho_wet: '', glue_W: '', glue_v: '', glue_Dp: '', glue_L: '',
        result_pump_speed: '-', result_wet_weight: '-', errors: {}
      });
    }
    this.setData({ showResetModal: false });
    wx.showToast({ title: '已清空', icon: 'success' });
  },

  cancelClear() {
    this.setData({ showResetModal: false });
  },

  saveCompHistory() {
    if (this.data.result_diameter == '-' && this.data.result_weight == '-') {
      wx.showToast({ title: '请先计算结果', icon: 'none' });
      return;
    }
    let tag = '[全套]';
    const hasR = this.data.result_diameter != '-';
    const hasM = this.data.result_weight != '-';
    if (hasR && !hasM) tag = '[仅卷径]';
    if (!hasR && hasM) tag = '[仅重量]';

    const d = this.data;
    const displayData = [
      { k: '计算类型', v: tag },
      { k: '卷材长度', v: `${d.comp_L}m` },
      { k: '层数', v: `${d.layers.length}层` }
    ];
    if (hasR) displayData.push({ k: '卷径', v: `${this.data.result_diameter}mm` });
    if (hasM) displayData.push({ k: '重量', v: `${this.data.result_weight}kg` });

    const rawData = {
      comp_i: d.comp_i,
      comp_c: d.comp_c,
      comp_L: d.comp_L,
      layers: d.layers,
      result_diameter: this.data.result_diameter,
      result_weight: this.data.result_weight
    };

    saveHistory('coating', 'composite', displayData, rawData);
    wx.showToast({ title: '已保存', icon: 'success' });
  },


  // ================= 2. 涂布工艺 =================
  switchGlueType(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({ glueCalcType: type, errors: {} });
    if (this.data.showFormulaBar) {
      this.updateFormulaBarDisplay();
    }
  },
  updateFormulas(type) { },

  resetGlue() {
    this.setData({ showResetModal: true });
  },

  _validateGlue(specificFields, isSilent) {
    if (!isSilent) this.setData({ errors: {} });
    let errs = {};
    let isValid = true;
    const d = this.data;
    if (d.glueCalcType === 'thickness') {
      if (!d.glue_t_dry) { errs.glue_t_dry = true; isValid = false; }
      if (!d.glue_rho_dry) { errs.glue_rho_dry = true; isValid = false; }
    } else {
      if (!d.glue_m_dry) { errs.glue_m_dry = true; isValid = false; }
    }
    specificFields.forEach(f => {
      if (!d[f]) { errs[f] = true; isValid = false; }
    });
    if (!isSilent) {
      this.setData({ errors: errs });
    }
    return isValid;
  },

  _getMDry() {
    const d = this.data;
    if (d.glueCalcType === 'thickness') return parseFloat(d.glue_t_dry) * parseFloat(d.glue_rho_dry);
    return parseFloat(d.glue_m_dry);
  },

  calcGluePump(e) {
    const isSilent = this._isSilent(e);
    if (!this._validateGlue(['glue_v', 'glue_W', 'glue_S', 'glue_rho_wet', 'glue_Dp'], isSilent)) return;
    const m_dry = this._getMDry();
    const d = this.data;
    const Q = (parseFloat(d.glue_v) * parseFloat(d.glue_W) * m_dry) / (10 * parseFloat(d.glue_S) * parseFloat(d.glue_rho_wet));

    const showVal = formatNumber(Q / parseFloat(d.glue_Dp));
    this.setData({ result_pump_speed: showVal });
  },

  calcGlueWetWeight(e) {
    const isSilent = this._isSilent(e);
    if (!this._validateGlue(['glue_L', 'glue_W', 'glue_S'], isSilent)) return;
    const m_dry = this._getMDry();
    const d = this.data;
    const M = (m_dry * parseFloat(d.glue_L) * parseFloat(d.glue_W)) / (10000 * parseFloat(d.glue_S));

    const showM = formatNumber(M);
    this.setData({ result_wet_weight: showM });
  },

  calculateGlue(e) {
    const isSilent = this._isSilent(e);
    if (!this._validateGlue(['glue_v', 'glue_W', 'glue_S', 'glue_rho_wet', 'glue_Dp', 'glue_L'], isSilent)) return;
    this.calcGluePump(true);
    this.calcGlueWetWeight(true);
  },

  saveGlueHistory() {
    const hasN = this.data.result_pump_speed != '-';
    const hasM = this.data.result_wet_weight != '-';
    if (!hasN && !hasM) {
      wx.showToast({ title: '请先计算结果', icon: 'none' });
      return;
    }
    let tag = '[全套]';
    if (hasN && !hasM) tag = '[仅泵速]';
    if (!hasN && hasM) tag = '[仅湿重]';

    const d = this.data;
    const displayData = [
      { k: '计算类型', v: tag },
      { k: '计算基准', v: d.glueCalcType === 'thickness' ? '干厚' : '干涂量' }
    ];
    if (d.glueCalcType === 'thickness') {
      displayData.push({ k: '干厚', v: `${d.glue_t_dry}μm` });
    } else {
      displayData.push({ k: '干涂量', v: `${d.glue_m_dry}g/m²` });
    }
    if (hasN) displayData.push({ k: '泵速', v: `${this.data.result_pump_speed}rpm` });
    if (hasM) displayData.push({ k: '湿重', v: `${this.data.result_wet_weight}kg` });

    const rawData = {
      glueCalcType: d.glueCalcType,
      glue_t_dry: d.glue_t_dry,
      glue_rho_dry: d.glue_rho_dry,
      glue_m_dry: d.glue_m_dry,
      glue_S: d.glue_S,
      glue_rho_wet: d.glue_rho_wet,
      glue_W: d.glue_W,
      glue_v: d.glue_v,
      glue_Dp: d.glue_Dp,
      glue_L: d.glue_L,
      result_pump_speed: this.data.result_pump_speed,
      result_wet_weight: this.data.result_wet_weight
    };

    saveHistory('coating', 'glue', displayData, rawData);
    wx.showToast({ title: '已保存', icon: 'success' });
  }
})