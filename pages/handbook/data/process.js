/**
 * 工艺控制数据 (Process Control)
 */
const Formulas = require('./formula-lib');

module.exports = {
  categories: [
    {
      id: "drying-process",
      title: "干燥工艺",
      icon: "🌬️",
      items: [
        { id: "proc-curve", title: "干燥曲线设计", brief: "三段式升温策略" },
        { id: "proc-solvent", title: "残留溶剂控制", brief: "扩散原理与检测" },
        {
          id: "proc-leidenfrost",
          title: "莱顿弗罗斯特现象",
          brief: "剧烈沸腾与浮起",
        },
      ],
    },
    {
      id: "coating-control",
      title: "涂布品质控制",
      icon: "📐",
      items: [
        { id: "proc-weight", title: "涂布量/面密度", brief: "闭环控制逻辑" },
        { id: "proc-window", title: "涂布窗口实操", brief: "如何拓宽稳定区" },
        { id: "proc-cpk", title: "过程能力(CPK)", brief: "稳定性统计分析" },
      ],
    },
    {
      id: "web-handling",
      title: "卷材控制",
      icon: "⚙️",
      items: [
        { id: "proc-tension", title: "张力控制原理", brief: "PID与浮动辊" },
        { id: "proc-taper", title: "收卷锥度", brief: "内紧外松防止菜心" },
        { id: "proc-splice", title: "接带工艺", brief: "不停机换卷技巧" },
      ],
    },
    {
      id: "curing-process",
      title: "固化与熟化",
      icon: "⏳",
      items: [
        { id: "proc-uv", title: "UV能量管理", brief: "焦耳计与光衰监控" },
        {
          id: "proc-aging",
          title: "熟化(Aging)管理",
          brief: "温度时间与交联度",
        },
      ],
    },
  ],
  details: {
    "proc-curve": {
      sections: [
        {
          type: "text",
          content:
            "合理的干燥曲线应分为升温段、恒速干燥段和降速干燥段，以避免结皮和气泡。",
        },
        {
          type: "table",
          title: "三段式干燥策略",
          headers: ["阶段", "目的", "温度设置", "风速"],
          rows: [
            ["升温段", "加热胶液，慢速挥发", "低 (50-70°C)", "低"],
            ["恒速段", "大量溶剂挥发", "中高 (80-100°C)", "高"],
            ["降速段", "去除微量残留溶剂", "高 (100-120°C)", "中"],
          ],
        },
        {
          type: "tip",
          tipType: "warning",
          content: "第一温区温度过高是导致“结皮”和“气泡”的最常见原因。",
        },
      ],
    },
    "proc-leidenfrost": {
      sections: [
        {
          type: "text",
          content:
            "莱顿弗罗斯特现象(Leidenfrost Effect)是指当液体接触远超其沸点的表面时，产生的剧烈蒸发层将液体托起，导致换热效率骤降或涂层缺陷。",
        },
        {
          type: "list",
          items: [
            "现象：溶剂在接触高温基材瞬间剧烈沸腾，使液滴/液膜悬浮。",
            "后果：干燥效率反而下降（气膜隔热），且涂层表面出现微小火山口或橘皮。",
            "临界点：通常比溶剂沸点高100°C以上。",
          ],
        },
        {
          type: "tip",
          tipType: "error",
          content:
            "在PVDF等高沸点溶剂体系中，若第一节烘箱设置过高（如>150°C），极易发生此问题，表现为涂层与基材脱离。",
        },
      ],
    },
    "proc-solvent": {
      sections: [
        {
          type: "text",
          content:
            "残留溶剂主要受降速干燥阶段控制，此时溶剂通过聚合物层的扩散是限速步骤。",
        },
        {
          type: "formula",
          title: "扩散公式",
          formula: Formulas.DIFFUSION,
          description: "扩散系数随温度升高呈指数增加",
          params: [
            { symbol: 'D', desc: '扩散系数' },
            { symbol: 'D₀', desc: '前指因子' },
            { symbol: 'Ea', desc: '活化能' },
            { symbol: 'R', desc: '气体常数' },
            { symbol: 'T', desc: '绝对温度 (K)' }
          ]
        },
        {
          type: "tip",
          tipType: "info",
          content: "提高最后两个温区的温度比增加烘箱长度对降低残留溶剂更有效。",
        },
      ],
    },
    "proc-weight": {
      sections: [
        {
          type: "text",
          content: "精密涂布需要建立“泵速-线速-厚度”的联动控制。",
        },
        {
          type: "formula",
          title: "面密度控制",
          formula: Formulas.AREA_DENSITY,
          description: "前馈控制基础：泵速与线速、涂布量成正比",
          params: [
            { symbol: 'RPM', desc: '供液泵转速' },
            { symbol: 'K', desc: '泵排量系数' },
            { symbol: 'V', desc: '涂布线速' },
            { symbol: 'Target', desc: '目标面密度' },
            { symbol: 'Pump', desc: '泵校准量' }
          ]
        },
        {
          type: "list",
          items: [
            "前馈控制(Feedforward)：线速变化时，泵速自动跟随（比例联动）。",
            "反馈控制(Feedback)：扫描架测厚仪发现偏差，自动修泵速。",
          ],
        },
      ],
    },
    "proc-window": {
      sections: [
        {
          type: "text",
          content:
            "涂布窗口(Coating Window)是稳定涂布的操作范围集合，实际上也是一种“博弈”结果。",
        },
        {
          type: "table",
          title: "窗口限制因素",
          headers: ["边界", "物理现象", "解决方法"],
          rows: [
            ["低流量界限", "断液 (Break-up)", "增加流量 / 减小间隙 (G)"],
            ["高流量界限", "溢胶 (Bleeding)", "增加真空度 / 降低流量"],
            [
              "高速度界限",
              "空气夹带 (Air Entrainment)",
              "提高真空度 / 降低粘度",
            ],
            ["低粘度界限", "高雷诺数涡流", "增加粘度 / 优化腔体"],
          ],
        },
        {
          type: "tip",
          tipType: "info",
          content:
            "拓宽窗口最有效的手段是：1. 优化真空箱设计；2. 使用剪切稀化特性明显的流体。",
        },
      ],
    },
    "proc-cpk": {
      sections: [
        {
          type: "text",
          content:
            "CPK (Process Capability Index) 是衡量涂布过程稳定性的核心指标。",
        },
        {
          type: "formula",
          title: "CPK计算公式",
          formula: Formulas.CPK,
          description: "衡量制程满足规格能力的指标 (越大越好)",
          params: [
             { symbol: 'USL', desc: '规格上限' },
             { symbol: 'LSL', desc: '规格下限' },
             { symbol: 'μ', desc: '制程均值' },
             { symbol: 'σ', desc: '标准差 (制程波动)' }
          ]
        },
        {
          type: "table",
          title: "CPK等级判定",
          headers: ["CPK值", "等级", "对策"],
          rows: [
            ["< 1.0", "差", "必须改进工艺"],
            ["1.0 - 1.33", "一般", "需加强检验"],
            ["1.33 - 1.67", "良好", "理想状态"],
            ["> 2.0", "优秀", "考虑放宽公差以降低成本"],
          ],
        },
      ],
    },
    "proc-tension": {
      sections: [
        {
          type: "text",
          content:
            "张力控制通过张力传感器（Load Cell）或浮动辊（Dancer Roll）反馈给驱动电机。",
        },
        {
          type: "list",
          items: [
            "放卷段：目的是产生阻力，通常用制动器或电机发电模式。张力随卷径减小而降低力矩（恒张力）。",
            "涂布段：需张力隔离（S辊或压辊），防止涂布头受张力波动影响。",
            "烘箱段：最长的一段，通常采用级联张力控制，以抵消基材热胀冷缩引起的张力变化。",
          ],
        },
      ],
    },
    "proc-splice": {
      sections: [
        {
          type: "text",
          content:
            "不停机自动接带(Flying Splice)是保证涂布连续性的关键工艺，分为搭接(Lap)和对接(Butt)两种。",
        },
        {
          type: "list",
          items: [
            "搭接 (Lap Splice)：旧卷与新卷重叠，接头处厚度加倍。优点是成功率高，缺点是过模头需抬刀，产生未涂布区。",
            "对接 (Butt Splice)：旧卷新卷端面对接，需贴单面或双面胶带。优点是厚度无变化，不过模头，缺点是控制难度极大。",
          ],
        },
        {
          type: "tip",
          tipType: "warning",
          content:
            "接带时储料架(Accumulator)负责供料，其容量决定了接带操作的允许时间窗口。",
        },
      ],
    },
    "proc-taper": {
      sections: [
        {
          type: "text",
          content:
            "收卷锥度(Taper Tension)是指收卷张力随卷径增大而逐渐减小的控制逻辑。",
        },
        {
          type: "formula",
          title: "线性锥度公式",
          formula: Formulas.TAPER_TENSION,
          description: "内卷紧外卷松，防止因应力累积产生菜心皱纹",
          params: [
            { symbol: 'F', desc: '当前实际张力' },
            { symbol: 'F₀', desc: '起卷初始张力' },
            { symbol: 'Taper%', desc: '锥度百分比 (通常10-30%)' },
            { symbol: 'D', desc: '当前卷径' },
            { symbol: 'D₀', desc: '卷芯直径' }
          ]
        },
        {
          type: "list",
          items: [
            "目的：防止内部受挤压变形（菜心/暴筋）和外部太松（跑偏）。",
            "典型值：胶带类 15-25%，光学膜类 10-20%。",
          ],
        },
        {
          type: "tip",
          tipType: "info",
          content:
            "对于压敏胶带，收卷压辊(Touch Roll)的压力控制比张力控制更关键，用于排除层间空气。",
        },
      ],
    },
    "proc-uv": {
      sections: [
        {
          type: "text",
          content:
            "UV能量管理的核心是确保到达光引发剂的特定波长能量足够引发聚合，同时避免过热。",
        },
        {
          type: "table",
          title: "UV系统维护",
          headers: ["项目", "标准", "频率"],
          rows: [
            ["能量计读数", "衰减 < 10%", "每班"],
            ["反射罩清理", "无挥发物冷凝", "每周"],
            ["灯管老化", "累计使用 < 1000h", "按需"],
            ["石英玻璃", "透光率 > 90%", "每月"],
          ],
        },
        {
          type: "tip",
          tipType: "warning",
          content:
            "不要只看瓦数(W/cm)，要看焦耳数(mJ/cm²)以及光谱匹配度（如365nm vs 395nm）。",
        },
      ],
    },
    "proc-aging": {
      sections: [
        {
          type: "text",
          content:
            "熟化(Aging/Curing)是让胶黏剂（特别是异氰酸酯体系）完成交联反应的过程。",
        },
        {
          type: "table",
          title: "熟化条件",
          headers: ["体系", "温度", "时间", "目的"],
          rows: [
            ["普通压敏胶", "40-50°C", "24-48小时", "交联平衡/内应力消除"],
            ["光学胶OCA", "60°C", "72小时", "气泡消散/性能稳定"],
            ["保护膜", "室温/40°C", "3-7天", "防止残胶"],
          ],
        },
      ],
    },
  },
};
