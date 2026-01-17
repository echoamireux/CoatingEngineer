const { initTheme, toggleTheme: commonToggleTheme, vibrateSuccess, formatNumber, formatTime } = require('../../utils/common')

Page({
  data: {
    theme: 'dark',
    currentTab: 'composite',

    // --- 悬浮公式条 ---
    showFormulaBar: false,
    currentFormula: null,
    currentFormulaTarget: '',

    // --- 历史弹窗 ---
    showHistoryModal: false,
    historyList: [],
    historyType: '',

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

    formulas: {
      comp_diameter: { type: 'text', val: '卷径 D = √[ (i+2c)² + (4·L·Σt)/π ]' },
      comp_weight: { type: 'frac', title: '重量 M =', up: 'L · Σ(W·t·ρ)', down: '10⁶' },
      pump_t: { type: 'frac', title: '泵速 N =', up: 't_dry · ρ_dry · W · v', down: '10 · S · ρ_wet · Dp' },
      pump_m: { type: 'frac', title: '泵速 N =', up: 'm_dry · W · v', down: '10 · S · ρ_wet · Dp' },
      weight_t: { type: 'frac', title: '湿重 Mw =', up: 't_dry · ρ_dry · W · L', down: '10000 · S' },
      weight_m: { type: 'frac', title: '湿重 Mw =', up: 'm_dry · W · L', down: '10000 · S' }
    }
  },

  onLoad() { initTheme(this); },

  toggleTheme() {
    commonToggleTheme(this);
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
  showFormula(e) {
    const target = e.currentTarget.dataset.target;
    this.setData({ currentFormulaTarget: target });
    this.updateFormulaBarDisplay();
    this.setData({ showFormulaBar: true });
    vibrateSuccess();
  },

  updateFormulaBarDisplay() {
    const target = this.data.currentFormulaTarget;
    const type = this.data.glueCalcType;
    const f = this.data.formulas;
    let data = null;

    if (target === 'diameter') data = f.comp_diameter;
    else if (target === 'c_weight') data = f.comp_weight;
    else if (target === 'pump') data = (type === 'thickness') ? f.pump_t : f.pump_m;
    else if (target === 'weight') data = (type === 'thickness') ? f.weight_t : f.weight_m;

    this.setData({ currentFormula: data });
  },

  closeFormulaBar() { this.setData({ showFormulaBar: false }); },

  // === 历史记录 ===
  openHistory() {
    const type = this.data.currentTab;
    const key = type === 'composite' ? 'history_comp' : 'history_glue';
    const list = wx.getStorageSync(key) || [];
    this.setData({ historyType: type, historyList: list, showHistoryModal: true });
  },
  closeHistory() { this.setData({ showHistoryModal: false }); },

  loadHistoryItem(e) {
    const item = e.currentTarget.dataset.item;
    const p = item.params;

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
    vibrateSuccess();
  },

  deleteHistoryItem(e) {
    const ts = e.currentTarget.dataset.ts;
    const type = this.data.historyType;
    const key = type === 'composite' ? 'history_comp' : 'history_glue';
    let list = this.data.historyList.filter(i => i.ts !== ts);
    wx.setStorageSync(key, list);
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
    this.setData({
      comp_i: '', comp_c: '', comp_L: '',
      layers: [{ width: '', thickness: '', density: '', err_w: false, err_t: false, err_d: false }],
      result_diameter: '-', result_weight: '-', errors: {}
    });
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
    const item = {
      ts: new Date().getTime(),
      dateStr: formatTime(),
      desc: `${tag} L:${d.comp_L}m | ${d.layers.length}层`,
      params: { comp_i: d.comp_i, comp_c: d.comp_c, comp_L: d.comp_L, layers: d.layers }
    };
    /* 👆👆👆 替换结束 👆👆👆 */
    let list = wx.getStorageSync('history_comp') || [];
    list.unshift(item); if (list.length > 20) list.pop();
    wx.setStorageSync('history_comp', list);
    vibrateSuccess();
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
    this.setData({
      glue_t_dry: '', glue_rho_dry: '', glue_m_dry: '',
      glue_S: '', glue_rho_wet: '', glue_W: '', glue_v: '', glue_Dp: '', glue_L: '',
      result_pump_speed: '-', result_wet_weight: '-', errors: {}
    });
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
    const item = {
      ts: new Date().getTime(),
      dateStr: formatTime(),
      type: d.glueCalcType,
      desc: `${tag} ${d.glueCalcType === 'thickness' ? '干厚:' + d.glue_t_dry : '干涂量:' + d.glue_m_dry}`,
      params: { ...d }
    };
    /* 👆👆👆 替换结束 👆👆👆 */
    let list = wx.getStorageSync('history_glue') || [];
    list.unshift(item); if (list.length > 20) list.pop();
    wx.setStorageSync('history_glue', list);
    vibrateSuccess();
    wx.showToast({ title: '已保存', icon: 'success' });
  }
})