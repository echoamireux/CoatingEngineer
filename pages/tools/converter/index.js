const { initTheme, toggleTheme: commonToggleTheme, formatNumberConverter, parseNumber } = require('../../../utils/common')

Page({
  data: {
    theme: 'dark',
    currentTab: 0,

    tabs: [
      { name: '涂布专用', id: 'coating', icon: '🎨' },
      { name: '粘度', id: 'vis', icon: '💧' },
      { name: '压力', id: 'press', icon: '🌪️' },
      { name: '长度', id: 'len', icon: '📏' },
      { name: '流量', id: 'flow', icon: '🚰' },
      { name: '密度', id: 'rho', icon: '🧱' },
      { name: '速度', id: 'spd', icon: '🚀' }
    ],

    density: '', gsm: '', thick: '',
    unitList: []
  },

  onLoad() {
    initTheme(this);
    this.initUnits(0);
  },

  toggleTheme() { commonToggleTheme(this); },

  switchTab(e) {
    const idx = Number(e.currentTarget.dataset.index);
    this.setData({ currentTab: idx });
    this.initUnits(idx);
  },

  fmt(num) {
    return formatNumberConverter(num);
  },

  parseVal(str) {
    return parseNumber(str);
  },


  // === 初始化单位 (修正：SI严谨性 + 补全单位) ===
  // === 初始化单位 (已修正：使用分数提升精度) ===
  initUnits(idx) {
    let list = [];
    switch (idx) {
      case 1: // 粘度 (基准: cP)
        list = [
          { name: '厘泊', unit: 'cP', factor: 1, isSI: false },
          { name: '帕秒', unit: 'Pa·s', factor: 0.001, isSI: true },
          { name: '毫帕秒', unit: 'mPa·s', factor: 1, isSI: false },
          { name: '英制粘度', unit: 'lb/(ft·s)', factor: 0.00067197, isSI: false }
        ];
        break;
      case 2: // 压力 (基准: MPa)
        list = [
          { name: '兆帕', unit: 'MPa', factor: 1, isSI: false },
          { name: '巴', unit: 'bar', factor: 10, isSI: false },
          { name: '千帕', unit: 'kPa', factor: 1000, isSI: false },
          { name: '帕', unit: 'Pa', factor: 1000000, isSI: true },
          { name: '磅力', unit: 'psi', factor: 145.038, isSI: false },
          { name: '公斤力', unit: 'kgf/cm²', factor: 10.1972, isSI: false }
        ];
        break;
      case 3: // 长度 (基准: mm)
        // 🌟 修复：用 1/25.4 代替 0.03937，解决 25.4mm != 1inch 的问题
        list = [
          { name: '毫米', unit: 'mm', factor: 1, isSI: false },
          { name: '微米', unit: 'μm', factor: 1000, isSI: false },
          { name: '米', unit: 'm', factor: 0.001, isSI: true },
          { name: '英寸', unit: 'in', factor: 1 / 25.4, isSI: false },
          { name: '密耳', unit: 'mil', factor: 1000 / 25.4, isSI: false }
        ];
        break;
      case 4: // 流量 (基准: L/min)
        // 🌟 修复：用 1/60000 代替 0.000016667
        list = [
          { name: '升/分', unit: 'L/min', factor: 1, isSI: false },
          { name: '毫升/分', unit: 'mL/min', factor: 1000, isSI: false },
          { name: '立方/时', unit: 'm³/h', factor: 0.06, isSI: false },
          { name: '立方/秒', unit: 'm³/s', factor: 1 / 60000, isSI: true },
          { name: '加仑/分', unit: 'gpm', factor: 0.26417, isSI: false }
        ];
        break;
      case 5: // 密度 (基准: g/cm³)
        list = [
          { name: '克/立方', unit: 'g/cm³', factor: 1, isSI: false },
          { name: '千克/立方', unit: 'kg/m³', factor: 1000, isSI: true },
          { name: '磅/加仑', unit: 'lb/gal', factor: 8.345, isSI: false }
        ];
        break;
      case 6: // 速度 (基准: m/min)
        // 🌟 修复：用 1/60 代替 0.016667，解决 60m/min != 1m/s 的问题
        list = [
          { name: '米/分', unit: 'm/min', factor: 1, isSI: false },
          { name: '米/秒', unit: 'm/s', factor: 1 / 60, isSI: true },
          { name: '千米/时', unit: 'km/h', factor: 0.06, isSI: false },
          { name: '英尺/分', unit: 'ft/min', factor: 3.28084, isSI: false }
        ];
        break;
    }
    this.setData({ unitList: list.map(i => ({ ...i, val: '' })) });
  },

  // === 涂布计算 (保持 V2.4) ===
  /* 👇👇👇 找到 onCoatingInput 函数，整段替换 👇👇👇 */
  onCoatingInput(e) {
    const field = e.currentTarget.dataset.field;
    const val = e.detail.value;
    this.setData({ [field]: val });

    // 🌟 关键修改：用 this.parseVal 代替 parseFloat
    const rho = this.parseVal(field === 'density' ? val : this.data.density);
    if (!val || !rho) return;

    // 获取当前的数据（也需要解析，因为可能是之前计算出的 ×10^ 格式）
    const curGsm = this.parseVal(this.data.gsm);
    const curThick = this.parseVal(this.data.thick);
    const curVal = this.parseVal(val);

    if (field === 'density') {
      if (curGsm) this.setData({ thick: this.fmt(curGsm / rho) });
      else if (curThick) this.setData({ gsm: this.fmt(curThick * rho) });
    } else if (field === 'gsm') {
      this.setData({ thick: this.fmt(curVal / rho) });
    } else if (field === 'thick') {
      this.setData({ gsm: this.fmt(curVal * rho) });
    }
  },
  /* 👆👆👆 替换结束 👆👆👆 */

  clearCoating() { this.setData({ density: '', gsm: '', thick: '' }); },

  /* 👇👇👇 找到 onUnitInput 函数，整段替换 👇👇👇 */
  onUnitInput(e) {
    const valStr = e.detail.value;
    const idx = e.currentTarget.dataset.index;
    const list = this.data.unitList;

    let newList = [...list];
    newList[idx].val = valStr;

    if (!valStr) {
      this.setData({ unitList: list.map(i => ({ ...i, val: '' })) });
      return;
    }

    // 🌟 关键修改：用 this.parseVal 识别 ×10^
    const val = this.parseVal(valStr);

    if (isNaN(val)) return; // 如果解析失败就不计算

    const baseVal = val / list[idx].factor;
    newList = newList.map((item, i) => {
      if (i === idx) return item;
      // 计算其他单位的值，并格式化
      return { ...item, val: this.fmt(baseVal * item.factor) };
    });

    this.setData({ unitList: newList });
  },
  /* 👆👆👆 替换结束 👆👆👆 */

  clearCommon() {
    const list = this.data.unitList.map(i => ({ ...i, val: '' }));
    this.setData({ unitList: list });
  }
})
