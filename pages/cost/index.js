const app = getApp()
const { initTheme, round, formatTime } = require('../../utils/common')
const { calcGlueCost, calcFilmCost, calcProcessCost, getTaxFactor } = require('../../utils/cost-calc')
const { validateRequired, validatePercentage: vPercent, hasRangeError } = require('../../utils/validator')
const { saveHistory, getHistory, deleteHistory } = require('../../utils/history')

// 引入 Behaviors
const costCalcBehavior = require('../../behaviors/cost-calc-behavior')
const formBehavior = require('../../behaviors/form-behavior')

Page({
  behaviors: [costCalcBehavior, formBehavior],

  data: {
    theme: 'dark',
    statusBarHeight: 44,
    errors: {},
    focus: {},

    showFormulaModal: false,
    formulaTitle: '',
    formulaContent: [],
    showMixModal: false,
    mixList: [],
    mixTargetStageIdx: -1,
    mixTargetMatIdx: -1,
    savedRecipeList: [],
    currentRecipeName: '',
    showClearModal: false,
    showSaveModal: false,
    showLoadModal: false,
    showDeleteModal: false,
    showOverwriteModal: false,
    pendingSaveName: '',
    pendingDeleteType: '', // 'history' | 'stage' | 'material' | 'recipe'
    pendingDeleteTarget: null,

    showHistoryModal: false,
    localHistory: [],

    tempRecipeName: '',
    deleteTargetIndex: -1,
    taxMode: 'ex',
    vatRate: '13',
    stages: [],
    final_yield: '-',
    res_final_cost: '-',

    showMachModal: false,
    machCalcTargetIdx: -1,
    machCalc: { fixCost: '', lines: '1', days: '26', hours: '24', util: '80', runCost: '', result: '-' },

    showLaborModal: false,
    laborCalcTargetIdx: -1,
    laborCalc: { headcount: '5', salary: '10000', days: '26', hours: '12', result: '-' }
  },

  onLoad() {
    initTheme(this);
    this.loadRecipesFromStorage();
    if (this.data.stages.length === 0) this.addStage('');
    // 获取状态栏高度
    const systemInfo = wx.getSystemInfoSync();
    this.setData({ statusBarHeight: systemInfo.statusBarHeight || 44 });
  },

  goBack() {
    wx.navigateBack({ delta: 1 });
  },

  onShow() {
    this.restoreFromHistory();
    this.loadLocalHistory();
  },

  loadLocalHistory() {
    const history = getHistory('cost');
    this.setData({ localHistory: history });
  },

  openHistoryModal() {
    wx.navigateTo({
      url: '/pages/history/index?type=cost'
    });
  },

  closeHistoryModal() {
    this.setData({ showHistoryModal: false });
  },

  deleteHistoryItem(e) {
    const id = e.currentTarget.dataset.id;
    if (id) {
      this.setData({
        showDeleteModal: true,
        pendingDeleteType: 'history',
        pendingDeleteTarget: { id }
      });
    }
  },

  confirmDelete() {
    const type = this.data.pendingDeleteType;
    const target = this.data.pendingDeleteTarget;
    if (!type || !target) return;

    if (type === 'history') {
      deleteHistory(target.id);
      this.loadLocalHistory();
      wx.showToast({ title: '已删除', icon: 'success' });
    } else if (type === 'stage') {
      const list = this.data.stages;
      list.splice(target.stageIdx, 1);
      this.setData({ stages: list });
    } else if (type === 'material') {
      const { stageIdx, matIdx } = target;
      const list = this.data.stages;
      list[stageIdx].materials.splice(matIdx, 1);
      this.setData({ stages: list });
      // 重新计算该工序的小计
      this.calculateAll(); // 简单起见，重新触发全量计算
    } else if (type === 'recipe') {
      this.doDeleteRecipe(target.index);
      return;
    }

    this.setData({ showDeleteModal: false, pendingDeleteType: '', pendingDeleteTarget: null });
  },
  cancelDelete() {
    this.setData({ showDeleteModal: false, pendingDeleteType: '', pendingDeleteTarget: null });
  },

  restoreHistory(e) {
    const index = e.currentTarget.dataset.index;
    const item = this.data.localHistory[index];

    if (item && item.rawData) {
      this.setData({
        taxMode: item.rawData.taxMode || 'ex',
        vatRate: item.rawData.vatRate || '13',
        stages: item.rawData.stages || [],
        final_yield: item.rawData.final_yield || '-',
        res_final_cost: item.rawData.res_final_cost || '-',
        showHistoryModal: false
      });
      wx.showToast({ title: '已回填', icon: 'success' });
    }
  },

  restoreFromHistory() {
    const restoreData = wx.getStorageSync('history_restore_data');
    const restoreModule = wx.getStorageSync('history_restore_module');

    if (restoreData && restoreModule === 'cost') {
      // 清除标记
      wx.removeStorageSync('history_restore_data');
      wx.removeStorageSync('history_restore_module');
      wx.removeStorageSync('history_restore_type');

      // 回填数据
      this.setData({
        taxMode: restoreData.taxMode || 'ex',
        vatRate: restoreData.vatRate || '13',
        stages: restoreData.stages || [],
        final_yield: restoreData.final_yield || '-',
        res_final_cost: restoreData.res_final_cost || '-'
      });

      wx.showToast({ title: '已回填历史数据', icon: 'success' });
    }
  },

  // 使用 validator.js 的函数
  validateField(val, key, errObj) {
    return validateRequired(val, key, errObj);
  },

  validatePercentage(val, key, errObj) {
    return vPercent(val, key, errObj);
  },

  clearError(key) {
    if (this.data.errors[key]) {
      const newErr = { ...this.data.errors };
      delete newErr[key];
      this.setData({ errors: newErr });
    }
  },

  // 输入框焦点状态管理
  onInputFocus(e) {
    const { type, stage, index, field } = e.currentTarget.dataset;
    let key = field;
    if (type === 'material') {
      key = `s${stage}_m${index}_${field}`;
    } else if (type === 'process') {
      key = `s${stage}_proc_${field}`;
    } else if (type === 'stage_yield') {
      key = `s${stage}_yield`;
    }
    // global 类型直接使用 field 作为 key
    this.setData({ [`focus.${key}`]: true });
  },

  onInputBlur(e) {
    const { type, stage, index, field } = e.currentTarget.dataset;
    let key = field;
    if (type === 'material') {
      key = `s${stage}_m${index}_${field}`;
    } else if (type === 'process') {
      key = `s${stage}_proc_${field}`;
    } else if (type === 'stage_yield') {
      key = `s${stage}_yield`;
    }
    this.setData({ [`focus.${key}`]: false });
  },

  // 弹窗输入框焦点状态管理
  onModalFocus(e) {
    const { modal, field } = e.currentTarget.dataset;
    const key = `${modal}_${field}`;
    this.setData({ [`focus.${key}`]: true });
  },

  onModalBlur(e) {
    const { modal, field } = e.currentTarget.dataset;
    const key = `${modal}_${field}`;
    this.setData({ [`focus.${key}`]: false });
  },

  // 配方弹窗输入框焦点管理
  onMixFocus(e) {
    const { index, field } = e.currentTarget.dataset;
    const key = `mix_${index}_${field}`;
    this.setData({ [`focus.${key}`]: true });
  },

  onMixBlur(e) {
    const { index, field } = e.currentTarget.dataset;
    const key = `mix_${index}_${field}`;
    this.setData({ [`focus.${key}`]: false });
  },

  preventBubble() {
    // 阻止冒泡专用
  },

  toggleStageFold(e) {
    const idx = e.currentTarget.dataset.index;
    const list = this.data.stages;
    list[idx].folded = !list[idx].folded;
    this.setData({ stages: list });
  },

  toggleSectionFold(e) {
    const { stage, section } = e.currentTarget.dataset;
    const list = this.data.stages;
    if (section === 'mat') list[stage].matFolded = !list[stage].matFolded;
    else if (section === 'proc') list[stage].procFolded = !list[stage].procFolded;
    this.setData({ stages: list });
  },

  // ★★★ 辅助函数：实时更新材料小计 ★★★
  _updateStageMatSum(stageIdx) {
    const list = this.data.stages;
    const stage = list[stageIdx];
    let sum = 0;
    stage.materials.forEach(m => {
      if (m.cost && !isNaN(parseFloat(m.cost))) {
        sum += parseFloat(m.cost);
      }
    });
    // 更新数据，保留2位小数
    const key = `stages[${stageIdx}].stageMatCost`;
    this.setData({ [key]: sum.toFixed(2) });
  },

  calcMaterialItem(e) {
    const { stage, index } = e.currentTarget.dataset;
    const list = this.data.stages;
    const item = list[stage].materials[index];
    const toExFactor = getTaxFactor(this.data.taxMode, this.data.vatRate);

    let currentErrors = {};
    let isValid = true;
    let cost = 0;

    // 1. 基础价格校验
    if (!this.validateField(item.price, `s${stage}_m${index}_price`, currentErrors)) isValid = false;

    if (item.type === 'glue') {
      // 2. 胶水参数校验
      if (!this.validatePercentage(item.solid, `s${stage}_m${index}_solid`, currentErrors)) isValid = false;
      if (!this.validateField(item.gsm, `s${stage}_m${index}_gsm`, currentErrors)) isValid = false;
      if (!this.validatePercentage(item.eff, `s${stage}_m${index}_eff`, currentErrors)) isValid = false;

      if (isValid) {
        cost = calcGlueCost({ price: item.price, solid: item.solid, gsm: item.gsm, eff: item.eff, toExFactor });
      }
    } else {
      // 3. 膜材参数校验
      if (!this.validateField(item.widthRaw, `s${stage}_m${index}_widthRaw`, currentErrors)) isValid = false;
      if (!this.validateField(item.widthValid, `s${stage}_m${index}_widthValid`, currentErrors)) isValid = false;
      if (isValid) {
        cost = calcFilmCost({ price: item.price, widthRaw: item.widthRaw, widthValid: item.widthValid, toExFactor });
      }
    }

    this.setData({ errors: currentErrors });

    // 4. ★★★ 核心修复：更精准的报错提示
    if (!isValid) {
      // ★ 级联重置：材料失败时，本工序总成本和累计都需要重置
      this.setData({
        [`stages[${stage}].materials[${index}].cost`]: '-',
        [`stages[${stage}].stageTotalCost`]: '-',
        [`stages[${stage}].accumCost`]: '-'
      }, () => {
        this._updateStageMatSum(stage);
      });

      const errorValues = Object.values(currentErrors);
      if (errorValues.includes('range')) {
        return wx.showToast({ title: '数值需在0-100之间', icon: 'none' });
      } else {
        return wx.showToast({ title: '红色项必填', icon: 'none' });
      }
    }

    const costStr = cost.toFixed(2);
    const key = `stages[${stage}].materials[${index}].cost`;

    this.setData({ [key]: costStr }, () => {
      this._updateStageMatSum(stage);
    });

    wx.showToast({ title: '已更新', icon: 'success', duration: 800 });
  },

  // ★★★ 局部计算：控制工艺卡片右边的小刷新按钮 ★★★
  calcProcessItem(e) {
    const { stage } = e.currentTarget.dataset;
    const list = this.data.stages;
    const p = list[stage].process;

    // 1. 基础校验
    let currentErrors = {};
    let isValid = true;

    if (!this.validateField(p.machRate, `s${stage}_proc_machRate`, currentErrors)) isValid = false;
    if (!this.validateField(p.laborRate, `s${stage}_proc_laborRate`, currentErrors)) isValid = false;
    if (!this.validateField(p.speed, `s${stage}_proc_speed`, currentErrors)) isValid = false;
    if (!this.validateField(p.orderLen, `s${stage}_proc_orderLen`, currentErrors)) isValid = false;

    // 👇 这一行就是你之前缺少的，一定要加上！
    if (!this.validateField(p.wasteLen, `s${stage}_proc_wasteLen`, currentErrors)) isValid = false;

    this.setData({ errors: currentErrors });

    // 错误弹窗提示
    const errorValues = Object.values(currentErrors);
    if (errorValues.includes('range')) {
      // ★ 重置结果为'-'
      this.setData({ [`stages[${stage}].stageProcCost`]: '-' });
      return wx.showToast({ title: '数值需在0-100之间', icon: 'none' });
    } else if (!isValid) {
      // ★ 重置结果为'-'
      this.setData({ [`stages[${stage}].stageProcCost`]: '-' });
      return wx.showToast({ title: '红色项必填', icon: 'none' });
    }

    // 2. 向上寻找有效的“膜宽”
    let refWidth = 0;
    for (let i = parseInt(stage); i >= 0; i--) {
      const foundMat = list[i].materials.find(m => m.type === 'film' && m.widthValid && parseFloat(m.widthValid) > 0);
      if (foundMat) {
        refWidth = parseFloat(foundMat.widthValid);
        break;
      }
    }

    if (refWidth === 0) {
      // ★ 重置结果为'-'
      this.setData({ [`stages[${stage}].stageProcCost`]: '-' });
      return wx.showToast({ title: '未找到有效涂宽(膜宽)', icon: 'none' });
    }

    // 3. 计算逻辑
    const Rm = parseFloat(p.machRate) || 0;
    const Rl = parseFloat(p.laborRate) || 0;
    const V = parseFloat(p.speed) || 0;
    const Lo = parseFloat(p.orderLen) || 0;
    const Lw = parseFloat(p.wasteLen) || 0;

    // 小时产能 m²/h = 速度 * 60 * (涂宽mm / 1000)
    const hourlyOutput = V * 60 * (refWidth / 1000);

    let cost = 0;
    if (hourlyOutput > 0 && Lo > 0) {
      const baseCost = (Rm + Rl) / hourlyOutput;
      const scale = (Lo + Lw) / Lo; // 摊销系数
      cost = baseCost * scale;

      const costStr = cost.toFixed(2);
      this.setData({ [`stages[${stage}].stageProcCost`]: costStr });
      wx.showToast({ title: '已更新', icon: 'success', duration: 800 });
    } else {
      // ★ 级联重置
      this.setData({
        [`stages[${stage}].stageProcCost`]: '-',
        [`stages[${stage}].stageTotalCost`]: '-',
        [`stages[${stage}].accumCost`]: '-'
      });
      wx.showToast({ title: '参数无效(速度/长度需>0)', icon: 'none' });
    }
  },

  // ★★★ 本工序总成本计算：只算投入，不校验良率，不依赖前序 ★★★
  calcStageTotal(e) {
    const { stage } = e.currentTarget.dataset;
    const list = this.data.stages;
    const sData = list[stage];
    const vat = parseFloat(this.data.vatRate) / 100 || 0.13;
    const toExFactor = this.data.taxMode === 'inc' ? (1 / (1 + vat)) : 1;

    let currentErrors = {};
    let hasError = false;
    let totalMatCost = 0;

    // 1. 重新计算所有材料成本 (确保数据是最新的)
    sData.materials.forEach((m, mIdx) => {
      let c = 0; let valid = true;

      // 校验材料必填项
      if (!this.validateField(m.price, `s${stage}_m${mIdx}_price`, currentErrors)) valid = false;

      if (m.type === 'glue') {
        if (!this.validatePercentage(m.solid, `s${stage}_m${mIdx}_solid`, currentErrors)) valid = false;
        if (!this.validateField(m.gsm, `s${stage}_m${mIdx}_gsm`, currentErrors)) valid = false;
        if (!this.validatePercentage(m.eff, `s${stage}_m${mIdx}_eff`, currentErrors)) valid = false;

        if (valid) {
          const E = parseFloat(m.eff) / 100;
          // 胶水成本计算
          c = (parseFloat(m.gsm) / (parseFloat(m.solid) / 100) / 1000 / E) * parseFloat(m.price) * toExFactor;
        }
      } else {
        if (!this.validateField(m.widthRaw, `s${stage}_m${mIdx}_widthRaw`, currentErrors)) valid = false;
        if (!this.validateField(m.widthValid, `s${stage}_m${mIdx}_widthValid`, currentErrors)) valid = false;

        if (valid) {
          // 膜材成本计算
          c = (parseFloat(m.price) * toExFactor) / (parseFloat(m.widthValid) / parseFloat(m.widthRaw));
        }
      }

      if (!valid) {
        hasError = true;
        // ★ 级联重置：校验失败的材料，成本重置为'-'
        m.cost = '-';
      } else {
        // 更新单项显示
        m.cost = c.toFixed(2);
        totalMatCost += c;
      }
    });

    // 2. 重新计算工艺成本
    const p = sData.process;
    let procCost = 0;
    let procValid = true;

    // 校验工艺必填项
    if (!this.validateField(p.machRate, `s${stage}_proc_machRate`, currentErrors)) procValid = false;
    if (!this.validateField(p.laborRate, `s${stage}_proc_laborRate`, currentErrors)) procValid = false;
    if (!this.validateField(p.speed, `s${stage}_proc_speed`, currentErrors)) procValid = false;
    if (!this.validateField(p.orderLen, `s${stage}_proc_orderLen`, currentErrors)) procValid = false;
    if (!this.validateField(p.wasteLen, `s${stage}_proc_wasteLen`, currentErrors)) procValid = false;

    if (!procValid) hasError = true;

    // 寻找膜宽 (用于工艺计算)
    let refWidth = 0;
    for (let i = parseInt(stage); i >= 0; i--) {
      const foundMat = list[i].materials.find(m => m.type === 'film' && m.widthValid && parseFloat(m.widthValid) > 0);
      if (foundMat) { refWidth = parseFloat(foundMat.widthValid); break; }
    }

    // ★ 级联重置：工艺校验失败时，工艺成本重置为'-'
    if (!procValid || refWidth === 0) {
      sData.stageProcCost = '-';
    } else {
      const output = parseFloat(p.speed) * 60 * (refWidth / 1000);
      const scale = (parseFloat(p.orderLen) + parseFloat(p.wasteLen)) / parseFloat(p.orderLen);
      if (output > 0) {
        procCost = ((parseFloat(p.machRate) + parseFloat(p.laborRate)) / output) * scale;
        sData.stageProcCost = procCost.toFixed(2);
      } else {
        sData.stageProcCost = '-';
      }
    }

    // 更新材料小计（考虑失败的材料）
    sData.stageMatCost = hasError ? '-' : totalMatCost.toFixed(2);

    // 3. 计算本工序总和
    const stageTotal = hasError ? 0 : totalMatCost + procCost;
    sData.stageTotalCost = hasError ? '-' : stageTotal.toFixed(2);

    // ★★★ 关键修复：无论是否有错误，都先更新所有数据 ★★★
    const key = `stages[${stage}]`;
    this.setData({
      errors: currentErrors,
      [`${key}.materials`]: sData.materials, // 更新材料单价显示（含'-'）
      [`${key}.stageMatCost`]: sData.stageMatCost,
      [`${key}.stageProcCost`]: sData.stageProcCost,
      [`${key}.stageTotalCost`]: sData.stageTotalCost,
      [`${key}.accumCost`]: '-' // 因为 Cstage 变了，累计也需要重新计算
    });

    // 4. 错误处理
    const errorValues = Object.values(currentErrors);
    if (errorValues.includes('range')) {
      return wx.showToast({ title: '数值需在0-100之间', icon: 'none' });
    } else if (hasError) {
      return wx.showToast({ title: '红色项必填', icon: 'none' });
    }

    wx.showToast({ title: '已更新 Cstage', icon: 'success', duration: 800 });
  },

  // ★★★ 计算累计成本（一键计算：自动计算所有前序Cstage + 累计） ★★★
  calcAccumCost(e) {
    const targetStage = parseInt(e.currentTarget.dataset.stage);
    const stages = JSON.parse(JSON.stringify(this.data.stages)); // 深拷贝
    const vat = parseFloat(this.data.vatRate) / 100 || 0.13;
    const toExFactor = this.data.taxMode === 'inc' ? (1 / (1 + vat)) : 1;

    let runningAccum = 0;
    let hasError = false;
    let firstErrorMsg = '';

    // 1. 遍历从第0道到当前道，自动计算每道的Cstage和Caccum
    for (let i = 0; i <= targetStage; i++) {
      const stage = stages[i];
      let stageMatSum = 0;
      let matHasError = false;
      let procHasError = false;

      // 1.1 计算材料成本
      stage.materials.forEach((m) => {
        let c = 0;
        let valid = true;

        if (!m.price || m.price === '') valid = false;

        if (m.type === 'glue') {
          if (!m.solid || !m.gsm || !m.eff) valid = false;
          const solidVal = parseFloat(m.solid);
          const effVal = parseFloat(m.eff);
          if (valid && (solidVal <= 0 || solidVal > 100 || effVal <= 0 || effVal > 100)) valid = false;

          if (valid) {
            const E = effVal / 100;
            c = (parseFloat(m.gsm) / (solidVal / 100) / 1000 / E) * parseFloat(m.price) * toExFactor;
          }
        } else {
          if (!m.widthRaw || !m.widthValid) valid = false;
          if (valid) {
            c = (parseFloat(m.price) * toExFactor) / (parseFloat(m.widthValid) / parseFloat(m.widthRaw));
          }
        }

        if (!valid) {
          matHasError = true;
          m.cost = '-';
        } else {
          m.cost = c.toFixed(2);
          stageMatSum += c;
        }
      });

      // 1.2 计算工艺成本
      const p = stage.process;
      let procCost = 0;

      if (!p.machRate || !p.laborRate || !p.speed || !p.orderLen || p.wasteLen === undefined || p.wasteLen === '') {
        procHasError = true;
      }

      // 寻找膜宽
      let refW = 0;
      for (let k = i; k >= 0; k--) {
        const found = stages[k].materials.find(m => m.type === 'film' && m.widthValid && parseFloat(m.widthValid) > 0);
        if (found) { refW = parseFloat(found.widthValid); break; }
      }

      if (!procHasError && refW > 0) {
        const output = parseFloat(p.speed) * 60 * (refW / 1000);
        const scale = (parseFloat(p.orderLen) + parseFloat(p.wasteLen)) / parseFloat(p.orderLen);
        if (output > 0) {
          procCost = ((parseFloat(p.machRate) + parseFloat(p.laborRate)) / output) * scale;
          stage.stageProcCost = procCost.toFixed(2);
        } else {
          procHasError = true;
          stage.stageProcCost = '-';
        }
      } else {
        procHasError = true;
        stage.stageProcCost = '-';
      }

      // 1.3 更新材料小计和本工序总成本
      stage.stageMatCost = matHasError ? '-' : stageMatSum.toFixed(2);
      const stageTotal = (matHasError || procHasError) ? 0 : stageMatSum + procCost;
      stage.stageTotalCost = (matHasError || procHasError) ? '-' : stageTotal.toFixed(2);

      // 1.4 检查良率
      const yieldVal = parseFloat(stage.yield);
      const yieldValid = !isNaN(yieldVal) && yieldVal > 0 && yieldVal <= 100;

      // 1.5 计算累计成本
      if (matHasError || procHasError || !yieldValid) {
        stage.accumCost = '-';
        if (!hasError) {
          hasError = true;
          if (matHasError) firstErrorMsg = `工序${i + 1}材料数据不完整`;
          else if (procHasError) firstErrorMsg = `工序${i + 1}工艺数据不完整`;
          else firstErrorMsg = `工序${i + 1}良率无效(1-100)`;
        }
      } else {
        const y = yieldVal / 100;
        runningAccum = (runningAccum + stageTotal) / y;
        stage.accumCost = runningAccum.toFixed(2);
      }
    }

    // 2. 更新所有数据到界面
    const updates = {};
    for (let i = 0; i <= targetStage; i++) {
      const s = stages[i];
      updates[`stages[${i}].materials`] = s.materials;
      updates[`stages[${i}].stageMatCost`] = s.stageMatCost;
      updates[`stages[${i}].stageProcCost`] = s.stageProcCost;
      updates[`stages[${i}].stageTotalCost`] = s.stageTotalCost;
      updates[`stages[${i}].accumCost`] = s.accumCost;
    }
    this.setData(updates);

    // 3. 显示结果
    if (hasError) {
      wx.showToast({ title: firstErrorMsg, icon: 'none', duration: 2000 });
    } else {
      wx.showToast({ title: '已更新累计成本', icon: 'success', duration: 800 });
    }
  },

  calculateAll() {
    const d = this.data;
    const vat = parseFloat(d.vatRate) / 100 || 0.13;
    const toExFactor = d.taxMode === 'inc' ? (1 / (1 + vat)) : 1;

    let runningTotal = 0;
    let totalYield = 1;
    let errs = {};
    let hasError = false;

    const newStages = JSON.parse(JSON.stringify(d.stages));

    newStages.forEach((stage, sIdx) => {
      let stageHasError = false;
      if (!this.validatePercentage(stage.yield, `s${sIdx}_yield`, errs)) {
        hasError = true;
        stageHasError = true;
      }

      let stageMatSum = 0;
      let matHasError = false;

      stage.materials.forEach((m, mIdx) => {
        let c = 0; let valid = true;
        if (!this.validateField(m.price, `s${sIdx}_m${mIdx}_price`, errs)) valid = false;

        if (m.type === 'glue') {
          if (!this.validatePercentage(m.solid, `s${sIdx}_m${mIdx}_solid`, errs)) valid = false;
          if (!this.validateField(m.gsm, `s${sIdx}_m${mIdx}_gsm`, errs)) valid = false;
          if (!this.validatePercentage(m.eff, `s${sIdx}_m${mIdx}_eff`, errs)) valid = false;

          if (valid) {
            const E = parseFloat(m.eff) / 100;
            c = (parseFloat(m.gsm) / (parseFloat(m.solid) / 100) / 1000 / E) * parseFloat(m.price) * toExFactor;
          }
        } else {
          if (!this.validateField(m.widthRaw, `s${sIdx}_m${mIdx}_widthRaw`, errs)) valid = false;
          if (!this.validateField(m.widthValid, `s${sIdx}_m${mIdx}_widthValid`, errs)) valid = false;

          if (valid) {
            c = (parseFloat(m.price) * toExFactor) / (parseFloat(m.widthValid) / parseFloat(m.widthRaw));
          }
        }

        if (!valid) {
          hasError = true;
          matHasError = true;
          // ★ 级联重置：校验失败的材料显示'-'
          m.cost = '-';
        } else {
          m.cost = c.toFixed(2);
          stageMatSum += c;
        }
      });

      const p = stage.process;
      let pCost = 0;

      let procValid = true;
      if (!this.validateField(p.machRate, `s${sIdx}_proc_machRate`, errs)) procValid = false;
      if (!this.validateField(p.laborRate, `s${sIdx}_proc_laborRate`, errs)) procValid = false;
      if (!this.validateField(p.speed, `s${sIdx}_proc_speed`, errs)) procValid = false;
      if (!this.validateField(p.orderLen, `s${sIdx}_proc_orderLen`, errs)) procValid = false;
      if (!this.validateField(p.wasteLen, `s${sIdx}_proc_wasteLen`, errs)) procValid = false;

      if (!procValid) hasError = true;

      let refW = 0;
      for (let i = sIdx; i >= 0; i--) {
        const found = newStages[i].materials.find(m => m.type === 'film' && m.widthValid);
        if (found) { refW = parseFloat(found.widthValid); break; }
      }

      // ★ 级联重置：工艺校验失败或无膜宽时显示'-'
      if (!procValid || refW === 0) {
        stage.stageProcCost = '-';
      } else {
        const output = parseFloat(p.speed) * 60 * (refW / 1000);
        const scale = (parseFloat(p.orderLen) + parseFloat(p.wasteLen)) / parseFloat(p.orderLen);
        if (output > 0) {
          pCost = ((parseFloat(p.machRate) + parseFloat(p.laborRate)) / output) * scale;
          stage.stageProcCost = pCost.toFixed(2);
        } else {
          stage.stageProcCost = '-';
        }
      }

      // ★ 级联重置：材料有错误时小计显示'-'
      stage.stageMatCost = matHasError ? '-' : stageMatSum.toFixed(2);

      // 本工序总成本
      let currentStageTotal = matHasError || !procValid ? 0 : stageMatSum + pCost;

      stage.stageTotalCost = (matHasError || !procValid || refW === 0) ? '-' : currentStageTotal.toFixed(2);

      // ★ 级联重置：如果本工序有任何错误，accumCost也显示'-'
      if (matHasError || !procValid || refW === 0 || stageHasError) {
        stage.accumCost = '-';
        // 后续工序的累计也无法计算，但继续循环以显示各工序的错误
      } else {
        const y = parseFloat(stage.yield) / 100 || 1;
        if (y > 0) {
          totalYield *= y;
          runningTotal = (runningTotal + currentStageTotal) / y;
        }
        stage.accumCost = runningTotal.toFixed(2);
      }
    });

    // ★★★ 关键修复：无论是否有错误，都先更新 stages 数据（显示 '-' 的部分）
    this.setData({ errors: errs, stages: newStages });

    if (hasError) {
      // 有错误时，重置最终结果为 '-'
      this.setData({ res_final_cost: '-', final_yield: '-' });

      const errorValues = Object.values(errs);
      if (errorValues.includes('range')) {
        return wx.showToast({ title: '存在数值超出0-100范围，请检查', icon: 'none', duration: 2500 });
      } else {
        return wx.showToast({ title: '请补全红色必填项', icon: 'none' });
      }
    }

    let final = runningTotal;
    if (d.taxMode === 'inc') final *= (1 + vat);

    // ★★★ 最终良率保留2位小数，防止显示过长 ★★★
    const finalYieldStr = (totalYield * 100).toFixed(2);

    this.setData({
      res_final_cost: final.toFixed(2),
      final_yield: finalYieldStr
    });

    wx.showToast({ title: '计算完成', icon: 'success' });
  },

  saveCostHistory() {
    if (this.data.res_final_cost === '-') {
      wx.showToast({ title: '请先计算成本', icon: 'none' });
      return;
    }

    const displayData = [
      { k: '总成本', v: `¥${this.data.res_final_cost}/m²` },
      { k: '直通率', v: `${this.data.final_yield}%` },
      { k: '工序数', v: `${this.data.stages.length}个` },
      { k: '计价模式', v: this.data.taxMode === 'ex' ? '未税' : '含税' }
    ];

    const rawData = {
      taxMode: this.data.taxMode,
      vatRate: this.data.vatRate,
      stages: this.data.stages,
      final_yield: this.data.final_yield,
      res_final_cost: this.data.res_final_cost
    };

    saveHistory('cost', 'costing', displayData, rawData);
    this.loadLocalHistory(); // 重新加载本地历史
    wx.showToast({ title: '已保存', icon: 'success' });
  },

  addStage(name) {
    const list = this.data.stages;
    list.forEach(s => s.folded = true);
    list.push({
      name: typeof name === 'string' ? name : '',
      yield: '', materials: [], process: { speed: '', machRate: '', laborRate: '', orderLen: '', wasteLen: '' },
      stageMatCost: 0, stageProcCost: 0, stageTotalCost: 0, accumCost: 0,
      folded: false, matFolded: false, procFolded: false
    });
    this.setData({ stages: list });
    this.addMaterialToStage(list.length - 1, 'film');
  },
  removeStage(e) {
    const idx = e.currentTarget.dataset.index;
    if (this.data.stages.length <= 1) {
       return wx.showToast({ title: '至少保留一道工序', icon: 'none' });
    }
    this.setData({
      showDeleteModal: true,
      pendingDeleteType: 'stage',
      pendingDeleteTarget: { stageIdx: idx }
    });
  },
  addMaterial(e) { this.addMaterialToStage(e.currentTarget.dataset.stage, e.currentTarget.dataset.type); },
  addMaterialToStage(sIdx, type) {
    const list = this.data.stages;
    const stage = list[sIdx];
    const existingCount = stage.materials.filter(m => m.type === type).length;
    const nextNum = existingCount + 1;
    const item = type === 'glue'
      ? { type: 'glue', name: `胶层-${nextNum}`, price: '', solid: '', gsm: '', eff: '' }
      : { type: 'film', name: `膜材-${nextNum}`, unitMode: 'area', price: '', widthRaw: '', widthValid: '' };
    list[sIdx].materials.push(item);
    this.setData({ stages: list });
  },

  removeMaterial(e) {
    const { stage, index } = e.currentTarget.dataset;
    this.setData({
      showDeleteModal: true,
      pendingDeleteType: 'material',
      pendingDeleteTarget: { stageIdx: stage, matIdx: index }
    });
  },

  moveMaterial(e) { const { stage, index, dir } = e.currentTarget.dataset; const list = this.data.stages; const mats = list[stage].materials; const t = index + dir; if (t >= 0 && t < mats.length) { [mats[index], mats[t]] = [mats[t], mats[index]]; this.setData({ stages: list }); } },

  onInput(e) {
    const { field, stage, index, type } = e.currentTarget.dataset; const val = e.detail.value;
    let k = '';
    if (type === 'material') k = `s${stage}_m${index}_${field}`; else if (type === 'process') k = `s${stage}_proc_${field}`; else if (type === 'stage_yield') k = `s${stage}_yield`;

    if (k) this.clearError(k);

    const list = this.data.stages;
    if (type === 'global') this.setData({ [field]: val }); else if (type === 'stage_name' || type === 'stage_yield') list[stage][field === 'stage_name' ? 'name' : 'yield'] = val; else if (type === 'process') list[stage].process[field] = val; else if (type === 'material') list[stage].materials[index][field] = val;
    else if (type === 'save_name') this.setData({ tempRecipeName: val });
    if (type !== 'global' && type !== 'save_name') this.setData({ stages: list });
  },

  // ... (其余代码：mixCal, formula, machCalc, laborCalc 等保持不变) ...
  setTaxMode(e) { this.setData({ taxMode: e.currentTarget.dataset.mode }); },
  loadRecipesFromStorage() { this.setData({ savedRecipeList: wx.getStorageSync('my_recipes') || [] }); },
  openMixCal(e) { this.setData({ showMixModal: true, mixTargetStageIdx: e.currentTarget.dataset.stage, mixTargetMatIdx: e.currentTarget.dataset.index, mixList: [{ name: '', ratio: '', price: '', solid: '' }], mixResultPrice: 0, mixResultSolid: 0, currentRecipeName: '' }); },
  closeMixModal() { this.setData({ showMixModal: false }); },
  addMixItem() { this.setData({ mixList: [...this.data.mixList, { name: '', ratio: '', price: '', solid: '' }] }); },
  removeMixItem(e) { const idx = e.currentTarget.dataset.index; const list = this.data.mixList; if (list.length > 1) { list.splice(idx, 1); this.setData({ mixList: list }); this.reCalcMix(list); } else { wx.showToast({ title: '至少保留一项', icon: 'none' }); } },
  onMixInput(e) {
    const { index, field } = e.currentTarget.dataset;
    const list = this.data.mixList;
    const val = e.detail.value;

    // 1. 先更新数据，保证能输入
    list[index][field] = val;
    this.setData({ mixList: list });

    // 2. ★★★ 新增：针对固含量的实时校验
    if (field === 'solid') {
      const num = parseFloat(val);
      if (num < 0 || num > 100) {
        // 这里用 Toast 提示稍微有点打扰，但这是最直接的方法
        // 建议加个防抖，或者简单的判定
        wx.showToast({ title: '固含量需0-100%', icon: 'none' });
      }
    }

    // 3. 重新计算加权结果
    this.reCalcMix(list);
  },
  reCalcMix(list) { let tr = 0, wp = 0, ws = 0; list.forEach(i => { const r = parseFloat(i.ratio) || 0; tr += r; wp += r * (parseFloat(i.price) || 0); ws += r * (parseFloat(i.solid) || 0); }); this.setData({ mixList: list, mixResultPrice: tr ? (wp / tr).toFixed(2) : 0, mixResultSolid: tr ? (ws / tr).toFixed(2) : 0 }); },
  openLoadModal() { if (!this.data.savedRecipeList.length) return wx.showToast({ title: '无保存记录', icon: 'none' }); this.setData({ showLoadModal: true }); },
  closeLoadModal() { this.setData({ showLoadModal: false }); },
  requestDeleteRecipe(e) {
    const idx = e.currentTarget.dataset.index;
    this.setData({
      showDeleteModal: true,
      pendingDeleteType: 'recipe',
      pendingDeleteTarget: { index: idx }
    });
  },

  closeDeleteModal() {
    this.setData({ showDeleteModal: false, pendingDeleteType: '', pendingDeleteTarget: null });
  },

  doDeleteRecipe(idx) {
    const list = this.data.savedRecipeList;
    if (idx !== undefined && idx >= 0 && idx < list.length) {
      list.splice(idx, 1);
      wx.setStorageSync('my_recipes', list);
      this.setData({ savedRecipeList: list });
      if (list.length === 0) this.setData({ showLoadModal: false });
      wx.showToast({ title: '已删除', icon: 'none' });
    }
    // 关闭 Modal 交给 confirmDelete 统一处理，或者这里处理
    // Note: confirmDelete returns early for recipe, so we must reset state here if modal wasn't closed by confirmDelete?
    // Wait, confirmDelete logic: } else if (type === 'recipe') { this.doDeleteRecipe(target.index); return; }
    // So confirmDelete Returns! It does NOT clear state.
    // So doDeleteRecipe MUST clear state.
    this.setData({ showDeleteModal: false, pendingDeleteType: '', pendingDeleteTarget: null });
  },
  doLoadRecipe(e) { const idx = e.currentTarget.dataset.index; const s = this.data.savedRecipeList[idx]; let newList = []; if (s.details && s.details.length > 0) { newList = JSON.parse(JSON.stringify(s.details)); } else { newList = [{ name: s.name, ratio: '100', price: s.price, solid: s.solid }]; } this.setData({ mixList: newList, showLoadModal: false, currentRecipeName: s.name }); this.reCalcMix(newList); wx.showToast({ title: '数据已回填', icon: 'none' }); },
  openSaveModal() {
    // ★★★ 新增：保存前的最后一道安检
    const hasInvalidSolid = this.data.mixList.some(item => {
      const s = parseFloat(item.solid);
      return s < 0 || s > 100;
    });
    if (hasInvalidSolid) {
      return wx.showToast({ title: '配方中固含量需在0-100之间', icon: 'none' });
    }

    // ... 原来的代码 ...
    if (this.data.mixResultPrice == 0 && this.data.mixList.every(i => !i.name && !i.ratio)) {
      return wx.showToast({ title: '请先输入配方数据', icon: 'none' });
    }
    this.setData({ showSaveModal: true, tempRecipeName: this.data.currentRecipeName || '' });
  },
  closeSaveModal() { this.setData({ showSaveModal: false }); },
  doSaveRecipe() { const name = this.data.tempRecipeName; if (!name) return wx.showToast({ title: '请输入名称', icon: 'none' }); let list = wx.getStorageSync('my_recipes') || []; const existIdx = list.findIndex(r => r.name === name); if (existIdx > -1) { this.setData({ showOverwriteModal: true, pendingSaveName: name }); } else { this._executeSave(name); } },
  _executeSave(finalName) { const s = { name: finalName, price: this.data.mixResultPrice, solid: this.data.mixResultSolid, details: this.data.mixList }; let currentList = wx.getStorageSync('my_recipes') || []; const idx = currentList.findIndex(r => r.name === finalName); if (idx > -1) { currentList[idx] = s; } else { currentList.push(s); } wx.setStorageSync('my_recipes', currentList); this.loadRecipesFromStorage(); this.applyRecipe(s.name, s.price, s.solid); this.setData({ showSaveModal: false, showOverwriteModal: false, currentRecipeName: finalName }); wx.showToast({ title: '保存成功', icon: 'success' }); },
  closeOverwriteModal() { this.setData({ showOverwriteModal: false }); },
  confirmOverwrite() { this._executeSave(this.data.pendingSaveName); },
  confirmSaveAsNew() { const originalName = this.data.pendingSaveName; const copyName = `${originalName}_副本${Math.floor(Math.random() * 100)}`; this._executeSave(copyName); },
  applyMixResult() { this.applyRecipe('临时配方', this.data.mixResultPrice, this.data.mixResultSolid); },
  applyRecipe(name, p, s) { const { mixTargetStageIdx: si, mixTargetMatIdx: mi } = this.data; const list = this.data.stages; list[si].materials[mi].price = p; list[si].materials[mi].solid = s; if (!list[si].materials[mi].name.includes('胶')) list[si].materials[mi].name = name; this.setData({ stages: list }); this.clearError(`s${si}_m${mi}_price`); this.clearError(`s${si}_m${mi}_solid`); },
  handleApplyOnly() { this.applyMixResult(); this.setData({ showMixModal: false }); },
  showFormula(e) {
    const t = e.currentTarget.dataset.type;
    let list = [];
    if (t === 'global') { list.push({ title: '去税价格折算', lhs: [{ v: 'P', s: 'ex' }], f: { n: [{ v: 'P', s: 'inc' }], d: [{ v: '1 + ' }, { v: 'Tax' }, { v: '%' }] }, vars: [{ k: [{ v: 'P', s: 'ex' }], desc: '未税价格', u: '' }, { k: [{ v: 'P', s: 'inc' }], desc: '含税输入价', u: '' }, { k: [{ v: 'Tax' }], desc: '增值税率', u: '%' }], logic: ['制造业核算基准：所有物料与加工费必须先剥离增值税，还原为“净价”进行内部流转计算。', '最终报价输出：在计算出总净成本后，再根据客户的开票要求（含税/未税）乘回对应的税率。'] }); }
    else if (t === 'glue') { list.push({ title: '胶层单位成本', lhs: [{ v: 'C', s: 'glue' }], f: { n: [{ v: 'GSM' }, { v: ' · ' }, { v: 'P', s: 'wet' }], d: [{ v: 'S' }, { v: ' · ' }, { v: 'η' }] }, vars: [{ k: [{ v: 'C', s: 'glue' }], desc: '胶层单位成本', u: '元/m²' }, { k: [{ v: 'GSM' }], desc: '目标干涂量', u: 'g/m²' }, { k: [{ v: 'P', s: 'wet' }], desc: '湿胶单价', u: '元/kg' }, { k: [{ v: 'S' }], desc: '固含量', u: '%' }, { k: [{ v: 'η' }], desc: '利用率', u: '%' }], logic: ['固含量折算（干湿转换）：采购的是液体湿胶，但留在产品上的是固体。需通过固含量(S)将目标干重反推回湿胶耗用量。', '制程损耗补偿：配胶残留、管路清洗、滤芯拦截等必然损耗，必须除以利用率(η)进行成本补偿，否则会算亏。'] }); }
    else if (t === 'film') { list.push({ title: '膜材单位成本', lhs: [{ v: 'C', s: 'film' }], f: { n: [{ v: 'P', s: 'area' }], d: [{ v: 'W', s: 'coat' }, { v: ' / ' }, { v: 'W', s: 'film' }] }, vars: [{ k: [{ v: 'C', s: 'film' }], desc: '膜材单位成本', u: '元/m²' }, { k: [{ v: 'P', s: 'area' }], desc: '基材单价', u: '元/m²' }, { k: [{ v: 'W', s: 'coat' }], desc: '涂布幅宽', u: 'mm' }, { k: [{ v: 'W', s: 'film' }], desc: '膜材幅宽', u: 'mm' }], logic: ['宽幅摊销（买宽用窄）：采购原膜通常较宽(W_film)，而实际涂布有效宽度(W_coat)较窄。', '废边成本转嫁：分切过程中切除的废边成本不能消失，必须全部摊销到成品的有效面积成本中。'] }); }
    else if (t === 'process') {
      // 1. 第一部分：删掉了 vars 字段，只保留公式和逻辑
      list.push({
        title: '加工单位成本',
        inlineMath: [{ v: 'C', s: 'proc' }, { v: '=' }, { v: 'C', s: 'base' }, { v: '×' }, { v: 'K', s: 'scale' }],
        // vars: [...],  <-- 这一行被我们删掉了，节省空间！
        logic: [
          '核心逻辑：总成本 = 基础加工费 × 规模效应系数。',
          '基础加工费：由机台和人工的时薪除以“小时产能”得出。产能越高（速度越快、涂宽越宽），单价越低。',
          '规模效应：订单越短，调机损耗占比越大，单价越高（即“隐性亏损”）。'
        ]
      });

      // 2. 第二部分：保持不变
      list.push({
        title: '基础加工费',
        lhs: [{ v: 'C', s: 'base' }],
        f: {
          n: [{ v: 'R', s: 'm' }, { v: '+' }, { v: 'R', s: 'l' }],
          d: [{ v: 'V' }, { v: '·' }, { v: '60' }, { v: '·' }, { v: '(' }, { v: 'W', s: 'coat' }, { v: '/', s: '' }, { v: '1000' }, { v: ')' }]
        },
        vars: [
          { k: [{ v: 'R', s: 'm' }], desc: '机台费率', u: '元/h' },
          { k: [{ v: 'R', s: 'l' }], desc: '人工费率', u: '元/h' },
          { k: [{ v: 'V' }], desc: '涂布速度', u: 'm/min' },
          { k: [{ v: 'W', s: 'coat' }], desc: '涂布幅宽', u: 'mm' }
        ]
      });

      // 3. 第三部分：保持不变
      list.push({
        title: '规模效应系数',
        lhs: [{ v: 'K', s: 'scale' }],
        f: {
          n: [{ v: 'L', s: 'odr' }, { v: '+' }, { v: 'L', s: 'wst' }],
          d: [{ v: 'L', s: 'odr' }]
        },
        vars: [
          { k: [{ v: 'L', s: 'odr' }], desc: '排产长度', u: 'm' },
          { k: [{ v: 'L', s: 'wst' }], desc: '调机损耗', u: 'm' }
        ]
      });
    }
    else if (t === 'accum') { list.push({ title: '累计单位成本', lhs: [{ v: 'C', s: 'acc' }], f: { n: [{ v: 'C', s: 'prev' }, { v: '+' }, { v: 'C', s: 'curr' }], d: [{ v: 'Yield' }] }, vars: [{ k: [{ v: 'C', s: 'acc' }], desc: '累计单位成本', u: '元' }, { k: [{ v: 'C', s: 'prev' }], desc: '上道累计', u: '元' }, { k: [{ v: 'C', s: 'curr' }], desc: '本道新增', u: '元' }, { k: [{ v: 'Yield' }], desc: '直通率', u: '%' }], logic: ['价值链累积：本工序成本 = (上一道工序累计转入成本 + 本道新增材料与加工费)。', '良率放大效应（滚雪球）：当前工序的报废，不仅损失了当下的投入，更连带损失了之前所有工序已投入的真金白银。工序越靠后，报废代价越大。'] }); }
    this.setData({ formulaTitle: t === 'global' ? '税率转换' : '计算原理', formulaContent: list, showFormulaModal: true });
  },
  closeFormula() { this.setData({ showFormulaModal: false }); },
  openClearModal() { this.setData({ showClearModal: true }); },
  closeClearModal() { this.setData({ showClearModal: false }); },
  doClearAll() { this.setData({ stages: [], res_final_cost: '-', final_yield: '-', errors: {}, showClearModal: false }); this.addStage(''); wx.showToast({ title: '已重置', icon: 'none' }); },
  openMachCal(e) { const idx = e.currentTarget.dataset.stage; this.setData({ showMachModal: true, machCalcTargetIdx: idx, machCalc: { fixCost: '', lines: '1', days: '26', hours: '24', util: '80', runCost: '', result: '-' } }); },
  closeMachModal() { this.setData({ showMachModal: false }); },
  onMachInput(e) {
    const f = e.currentTarget.dataset.field;
    const val = e.detail.value;

    // 1. 先把用户输入的字上屏
    const newData = { ...this.data.machCalc, [f]: val };
    this.setData({ machCalc: newData });

    // 2. 实时校验逻辑 (物理限制)
    const v = parseFloat(val);
    if (!isNaN(v)) {
      if (f === 'days' && v > 31) {
        wx.showToast({ title: '月工作天数不能超过31', icon: 'none' });
      }
      if (f === 'hours' && v > 24) {
        wx.showToast({ title: '日排班小时不能超过24', icon: 'none' });
      }
      if (f === 'util' && (v < 0 || v > 100)) {
        wx.showToast({ title: '稼动率需在0-100之间', icon: 'none' });
      }
    }

    // 3. 计算结果
    const C_fix = parseFloat(newData.fixCost) || 0;
    const N = parseFloat(newData.lines) || 1;
    const D = parseFloat(newData.days) || 0;
    const H = parseFloat(newData.hours) || 0;
    const U = parseFloat(newData.util) / 100 || 0; // 如果没填默认为0，填了就除以100
    const C_run = parseFloat(newData.runCost) || 0;

    let res = '-';
    // 只有当参数都“合理”时才计算，避免出现分母过大导致结果为0的情况
    // 增加了对 D<=31, H<=24, U<=1 的逻辑判断，防止天文数字导致计算偏差
    if (N > 0 && D > 0 && D <= 31 && H > 0 && H <= 24 && U > 0 && U <= 1.01) { // U放宽一点点容错
      const totalHours = D * H * U;
      const fixPerHour = C_fix / (totalHours * N);
      res = (fixPerHour + C_run).toFixed(2);
    } else if (N > 0 && (D > 31 || H > 24 || U > 1.01)) {
      res = '参数异常'; // 如果输入太离谱，直接显示异常，而不是显示错误的计算结果
    }

    this.setData({ ['machCalc.result']: res });
  },
  applyMachResult() { if (this.data.machCalc.result === '-') return wx.showToast({ title: '参数不全', icon: 'none' }); const idx = this.data.machCalcTargetIdx; const list = this.data.stages; list[idx].process.machRate = this.data.machCalc.result; this.setData({ stages: list, showMachModal: false }); this.clearError(`s${idx}_proc_machRate`); },
  openLaborCal(e) { const idx = e.currentTarget.dataset.stage; this.setData({ showLaborModal: true, laborCalcTargetIdx: idx, laborCalc: { headcount: '5', salary: '10000', days: '26', hours: '12', result: '-' } }); this.reCalcLabor({ headcount: '5', salary: '10000', days: '26', hours: '12', result: '-' }); },
  closeLaborModal() { this.setData({ showLaborModal: false }); },
  // ★★★ 人工费计算器：增加天数和小时的物理限制校验 ★★★
  onLaborInput(e) {
    const f = e.currentTarget.dataset.field;
    const val = e.detail.value;

    // 1. 优先上屏：保证用户能打字
    const newData = { ...this.data.laborCalc, [f]: val };
    this.setData({ laborCalc: newData });

    // 2. 实时校验：物理限制 (与机台费保持一致)
    const v = parseFloat(val);
    if (!isNaN(v)) {
      if (f === 'days' && v > 31) {
        wx.showToast({ title: '月工作天数不能超过31', icon: 'none' });
      }
      if (f === 'hours' && v > 24) {
        wx.showToast({ title: '日排班小时不能超过24', icon: 'none' });
      }
    }

    // 3. 实时计算
    const P = parseFloat(newData.headcount) || 0;
    const S = parseFloat(newData.salary) || 0;
    const D = parseFloat(newData.days) || 0;
    const H = parseFloat(newData.hours) || 0;

    let res = '-';
    // 同样加上 D<=31 和 H<=24 的防呆判断
    if (P > 0 && S > 0 && D > 0 && D <= 31 && H > 0 && H <= 24) {
      const totalCost = P * S;
      const totalHours = D * H;
      res = (totalCost / totalHours).toFixed(2);
    } else if (P > 0 && S > 0 && (D > 31 || H > 24)) {
      res = '参数异常';
    }

    this.setData({ ['laborCalc.result']: res });
  },
  reCalcLabor(data) { const P = parseFloat(data.headcount) || 0; const S = parseFloat(data.salary) || 0; const D = parseFloat(data.days) || 0; const H = parseFloat(data.hours) || 0; let res = '-'; if (D > 0 && H > 0) { res = ((P * S) / (D * H)).toFixed(2); } this.setData({ laborCalc: { ...data, result: res } }); },
  applyLaborResult() { if (this.data.laborCalc.result === '-') return wx.showToast({ title: '参数不全', icon: 'none' }); const idx = this.data.laborCalcTargetIdx; const list = this.data.stages; list[idx].process.laborRate = this.data.laborCalc.result; this.setData({ stages: list, showLaborModal: false }); this.clearError(`s${idx}_proc_laborRate`); }
})