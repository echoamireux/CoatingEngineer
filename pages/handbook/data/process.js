/**
 * 工艺控制数据 (Process Control)
 */
module.exports = {
  categories: [
    {
      id: 'drying-process',
      title: '干燥工艺',
      icon: '🌬️',
      items: [
        { id: 'proc-curve', title: '干燥曲线设计', brief: '三段式升温策略' },
        { id: 'proc-solvent', title: '残留溶剂控制', brief: '扩散原理与检测' },
        { id: 'proc-leidenfrost', title: '莱顿弗罗斯特现象', brief: '剧烈沸腾与浮起' }
      ]
    },
    {
      id: 'coating-control',
      title: '涂布品质控制',
      icon: '📐',
      items: [
        { id: 'proc-weight', title: '涂布量/面密度', brief: '闭环控制逻辑' },
        { id: 'proc-window', title: '涂布窗口实操', brief: '如何拓宽稳定区' },
        { id: 'proc-cpk', title: '过程能力(CPK)', brief: '稳定性统计分析' }
      ]
    },
    {
      id: 'web-handling',
      title: '卷材控制',
      icon: '⚙️',
      items: [
        { id: 'proc-tension', title: '张力控制原理', brief: 'PID与浮动辊' },
        { id: 'proc-taper', title: '收卷锥度', brief: '内紧外松防止菜心' },
        { id: 'proc-splice', title: '接带工艺', brief: '不停机换卷技巧' }
      ]
    },
    {
      id: 'curing-process',
      title: '固化与熟化',
      icon: '⏳',
      items: [
        { id: 'proc-uv', title: 'UV能量管理', brief: '焦耳计与光衰监控' },
        { id: 'proc-aging', title: '熟化(Aging)管理', brief: '温度时间与交联度' }
      ]
    }
  ],
  details: {
    'proc-curve': {
      sections: [
        { type: 'text', content: '合理的干燥曲线应分为升温段、恒速干燥段和降速干燥段，以避免结皮和气泡。' },
        { type: 'table', title: '三段式干燥策略', headers: ['阶段', '目的', '温度设置', '风速'], rows: [
          ['升温段', '加热胶液，慢速挥发', '低 (50-70°C)', '低'],
          ['恒速段', '大量溶剂挥发', '中高 (80-100°C)', '高'],
          ['降速段', '去除微量残留溶剂', '高 (100-120°C)', '中']
        ]},
        { type: 'tip', tipType: 'warning', content: '第一温区温度过高是导致“结皮”和“气泡”的最常见原因。' }
      ]
    },
    'proc-solvent': {
      sections: [
        { type: 'text', content: '残留溶剂主要受降速干燥阶段控制，此时溶剂通过聚合物层的扩散是限速步骤。' },
        { type: 'formula', title: '扩散公式', formula: 'D = D₀ · exp(-Ea/RT)', description: '扩散系数随温度升高呈指数增加' },
        { type: 'tip', tipType: 'info', content: '提高最后两个温区的温度比增加烘箱长度对降低残留溶剂更有效。' }
      ]
    },
    'proc-weight': {
      sections: [
        { type: 'text', content: '精密涂布需要建立“泵速-线速-厚度”的联动控制。' },
        { type: 'formula', title: '面密度控制', formula: '泵速(RPM) = K · 线速 · 目标面密度 / 泵排量', description: '前馈控制基础' },
        { type: 'list', items: [
          '前馈控制(Feedforward)：线速变化时，泵速自动跟随（比例联动）。',
          '反馈控制(Feedback)：扫描架测厚仪发现偏差，自动修泵速。'
        ]}
      ]
    },
    'proc-tension': {
      sections: [
        { type: 'text', content: '张力控制通过这传感器（张力传感器/浮动辊）反馈给驱动电机或磁粉制动器。' },
        { type: 'list', items: [
          '放卷段：目的是产生阻力，通常用制动器或电机发电模式。张力随卷径减小而降低力矩（恒张力）。',
          '涂布段：需张力隔离（S辊或压辊），防止涂布头受张力波动影响。',
          '烘箱段：最长的一段，通常采用级联张力控制。'
        ]}
      ]
    },
    'proc-taper': {
      sections: [
        { type: 'text', content: '收卷锥度(Taper Tension)是指收卷张力随卷径增大而逐渐减小的控制逻辑。' },
        { type: 'formula', title: '线性锥度公式', formula: 'F = F₀ × [1 - Taper% × (D - D₀)/D]', description: 'F为当前张力，F₀为初始张力' },
        { type: 'list', items: [
          '目的：防止内部受挤压变形（菜心/暴筋）和外部太松（跑偏）。',
          '典型值：胶带类 15-25%，光学膜类 10-20%。'
        ]},
        { type: 'tip', tipType: 'info', content: '对于压敏胶带，收卷压辊(Touch Roll)的压力控制比张力控制更关键，用于排除层间空气。' }
      ]
    },
    'proc-aging': {
      sections: [
        { type: 'text', content: '熟化(Aging/Curing)是让胶黏剂（特别是异氰酸酯体系）完成交联反应的过程。' },
        { type: 'table', title: '熟化条件', headers: ['体系', '温度', '时间', '目的'], rows: [
          ['普通压敏胶', '40-50°C', '24-48小时', '交联平衡/内应力消除'],
          ['光学胶OCA', '60°C', '72小时', '气泡消散/性能稳定'],
          ['保护膜', '室温/40°C', '3-7天', '防止残胶']
        ]}
      ]
    }
  }
}
