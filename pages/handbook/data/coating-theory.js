/**
 * 涂布工艺理论数据
 */
const Formulas = require('./formula-lib');

module.exports = {
  categories: [
    {
      id: 'slot-die',
      title: '狭缝涂布',
      icon: '/images/icons/slot-die.svg',
      items: [
        { id: 'slot-die-basics', title: '基础参数定义', brief: '间隙/湿膜/流量' },
        { id: 'slot-die-formula', title: '核心理论公式', brief: 'Ca数/We数/Ruschak' },
        { id: 'slot-die-window', title: '涂布窗口图', brief: '稳定涂布区域' },
        { id: 'slot-die-pressure', title: '模头压降计算', brief: '泊肃叶流动' },
        { id: 'slot-die-defects', title: '缺陷与临界条件', brief: 'Ribbing/气泡夹带' }
      ]
    },
    {
      id: 'gravure',
      title: '凹版涂布',
      icon: '/images/icons/gravure.svg',
      items: [
        { id: 'gravure-cell', title: '网穴参数', brief: 'LPI/深度/容积' },
        { id: 'gravure-transfer', title: '涂布量计算', brief: '转移效率' },
        { id: 'gravure-blade', title: '刮刀系统', brief: '角度与压力' }
      ]
    },
    {
      id: 'micro-gravure',
      title: '微凹涂布',
      icon: '/images/icons/micro-gravure.svg',
      items: [
        { id: 'micro-gravure-feature', title: '特点与参数', brief: '高精度薄膜涂布' },
        { id: 'micro-gravure-advantage', title: '应用优势', brief: '精密涂布能力' }
      ]
    },
    {
      id: 'comma',
      title: '逗号刮刀涂布',
      icon: '/images/icons/comma.svg',
      items: [
        { id: 'comma-principle', title: '工作原理', brief: '间隙控制' },
        { id: 'comma-application', title: '适用范围', brief: '中高粘度/厚膜' }
      ]
    }
  ],
  details: {
    'slot-die-basics': {
      sections: [
        { type: 'text', content: '狭缝涂布是精密涂布的首选方式，通过控制供液量和间隙获得精确膜厚。' },
        { type: 'table', title: '核心参数定义', headers: ['参数', '符号', '单位', '说明'], rows: [
          ['涂布间隙', 'G', 'μm', '模唇到基材的距离'],
          ['湿膜厚度', 'H', 'μm', '涂布后未干燥的膜厚'],
          ['间隙比', 'G/H', '-', '稳定涂布的关键参数'],
          ['涂布速度', 'V', 'm/min', '基材运行速度'],
          ['流量', 'Q', 'mL/min', '供液泵的体积流量']
        ]},
        { type: 'formula', title: '湿膜厚度计算', formula: Formulas.WET_FILM_THICKNESS, description: '质量守恒，Q为流量，V为速度，W为涂布宽度' },
        { type: 'tip', tipType: 'info', content: '典型精密涂布精度可达±2%，关键在于流量稳定性和间隙均匀性。' }
      ]
    },
    'slot-die-formula': {
      sections: [
        { type: 'formula', title: '质量守恒方程', formula: Formulas.WET_FILM_THICKNESS, description: '湿膜厚度与供液量的关系', params: [
          { symbol: 'H', desc: '湿膜厚度 (m)' },
          { symbol: 'Q', desc: '体积流量 (m³/s)' },
          { symbol: 'V', desc: '涂布速度 (m/s)' },
          { symbol: 'W', desc: '涂布宽度 (m)' }
        ]},
        { type: 'formula', title: '毛细数 (Capillary Number)', formula: Formulas.CAPILLARY_NUMBER, description: '表征粘性力与表面张力的比值。Ca值决定了涂布流动的控制机制：', params: [
          { symbol: 'Ca < 0.1', desc: '表面张力主导 (易平整，但易断液)' },
          { symbol: 'Ca > 0.5', desc: '粘性力主导 (易稳定，但易出条纹)' },
          { symbol: '\\eta', desc: '动态粘度 (Pa·s)' },
          { symbol: 'V', desc: '涂布线速 (m/s)' },
          { symbol: '\\sigma', desc: '表面张力 (N/m)' }
        ]},
        { type: 'formula', title: '临界最小湿膜厚度', formula: Formulas.CRITICAL_THICKNESS, description: 'Ruschak公式，预测稳定涂布的最小膜厚', params: [
          { symbol: 'H_{min}', desc: '最小湿膜厚度 (μm)' },
          { symbol: 'G', desc: '涂布间隙 (μm)' },
          { symbol: 'Ca', desc: '毛细数 (无量纲)' }
        ]},
        { type: 'tip', tipType: 'info', content: '实际涂布时，Ca值通常在0.01-1范围内，G/H比值在1.5-2.5之间为稳定区。' }
      ]
    },
    'slot-die-window': {
      sections: [
        { type: 'text', content: '涂布窗口图(Coating Window)显示了稳定涂布的操作区域，横轴为毛细数Ca，纵轴为间隙比G/H。' },
        { type: 'custom-coating-window' },
        { type: 'tip', tipType: 'info', content: '使用上方"涂布窗口交互图"组件可实时计算工艺点位置和稳定性。' }
      ]
    },
    'slot-die-pressure': {
      sections: [
        { type: 'text', content: '模头内部液体流动产生压降，主要包括狭缝内压降和入口压降。' },
        { type: 'formula', title: '狭缝内压降 (泊肃叶流动)', formula: Formulas.SLOT_DIE_PRESSURE, description: '牛顿流体在狭缝内的压降计算', params: [
          { symbol: 'ΔP', desc: '压降 (Pa)' },
          { symbol: 'η', desc: '粘度 (Pa·s)' },
          { symbol: 'Q', desc: '流量 (m³/s)' },
          { symbol: 'L', desc: '狭缝长度 (m)' },
          { symbol: 'W', desc: '涂布宽度 (m)' },
          { symbol: 'b', desc: '狭缝间隙 (m)' }
        ]},
        { type: 'tip', tipType: 'warning', content: '狭缝间隙b对压降影响极大（三次方关系），设计时需精确控制。' }
      ]
    },
    'slot-die-defects': {
      sections: [
        { type: 'text', content: '狭缝涂布常见缺陷及其临界条件：' },
        { type: 'table', title: '缺陷类型与机理', headers: ['缺陷', '临界条件', '机理', '解决方案'], rows: [
          ['Ribbing条纹', 'Ca > 0.5 (粘性主导)', '粘性力 > 表面张力导致流平受阻', '降低粘度/增加张力'],
          ['Harringbone', 'Ca > 0.5 (涡流)', '高能流体产生的涡流不稳', '降低间隙/降低速度'],
          ['气泡夹带', 'G/H > 2.5 或 Ca > 2.0', '上游半月面破裂或动态接触线失稳', '提高真空度/减小间隙'],
          ['断液/收缩', 'G/H < 1.2 或 Ca < 0.1', '供液不足或表面张力主导收缩', '增加流量/添加润湿剂'],
          ['边缘增厚', '边缘效应 (Marangoni)', '溶剂挥发导致的表面张力梯度', '优化Shim/使用抽边']
        ]}
      ]
    },
    'gravure-cell': {
      sections: [
        { type: 'text', content: '凹版辊的网穴参数决定了涂布量和膜层质量。' },
        { type: 'table', title: '网穴关键参数', headers: ['参数', '说明', '典型范围'], rows: [
          ['LPI (线数)', '每英寸线数', '80-200 LPI'],
          ['网穴深度', '雕刻深度', '20-80 μm'],
          ['网穴容积', '单位面积容积', '10-50 mL/m²'],
          ['网穴形状', '金字塔/梯形/六角', '影响转移效率']
        ]},
        { type: 'formula', title: '理论涂布量', formula: Formulas.GRAVURE_COATING, description: 'V为网穴容积，ρ为液体密度，η_t为转移效率', params: [
          { symbol: 'W', desc: '理论涂布量 (g/m²)' },
          { symbol: 'V', desc: '网穴容积 (mL/m²)' },
          { symbol: '\\rho', desc: '液体密度 (g/mL)' },
          { symbol: '\\eta_t', desc: '转移效率 (%)' }
        ] }
      ]
    },
    'gravure-transfer': {
      sections: [
        { type: 'text', content: '凹版涂布量取决于网穴参数和转移效率。' },
        { type: 'formula', title: '涂布量计算', formula: Formulas.GRAVURE_COATING, description: '实际涂布量 = 网穴容积 × 密度 × 转移效率', params: [
          { symbol: 'W', desc: '湿涂布量 (g/m²)' },
          { symbol: 'V', desc: '网穴容积 (mL/m²)' },
          { symbol: 'ρ', desc: '液体密度 (g/mL)' },
          { symbol: 'η_t', desc: '转移效率 (30-70%)' }
        ]},
        { type: 'table', title: '转移效率影响因素', headers: ['因素', '影响', '优化方向'], rows: [
          ['粘度', '高粘度→低转移', '适当稀释'],
          ['毛细数Ca', 'Ca过大→丝状条纹', '降低速度或粘度'],
          ['接触压力', '压力大→高转移', '均匀压力'],
          ['网穴深度', '深→高转移', '按需设计']
        ]},
        { type: 'tip', tipType: 'info', content: '虽然凹版涂布主要关注转移率，但高Ca下也会出现类似狭缝的Ribbing缺陷。' }
      ]
    },
    'gravure-blade': {
      sections: [
        { type: 'text', content: '刮刀系统控制凹版辊上的胶量，是涂布精度的关键。' },
        { type: 'table', title: '刮刀参数', headers: ['参数', '典型值', '影响'], rows: [
          ['刮刀角度', '55°-65°', '角度小→残留多'],
          ['刮刀压力', '0.1-0.5 MPa', '压力大→刮净'],
          ['刮刀材质', '钢/陶瓷/塑料', '耐磨性与刮净能力'],
          ['刮刀厚度', '0.15-0.25 mm', '刚性与贴合性']
        ]},
        { type: 'tip', tipType: 'warning', content: '刮刀磨损会导致涂布量增加和条纹缺陷，需定期检查更换。' }
      ]
    },
    'micro-gravure-feature': {
      sections: [
        { type: 'text', content: '微凹涂布(Micro Gravure)是凹版涂布的精密变体，适合超薄膜涂布。' },
        { type: 'table', title: '微凹涂布特点', headers: ['参数', '微凹涂布', '普通凹版'], rows: [
          ['辊径', '20-50 mm', '100-300 mm'],
          ['LPI', '150-300 LPI', '80-150 LPI'],
          ['膜厚范围', '0.5-10 μm', '5-50 μm'],
          ['精度', '±2%', '±5%']
        ]},
        { type: 'list', items: [
          '辊筒小，胶液消耗少',
          '换色快，适合小批量',
          '接触面小，对基材张力敏感'
        ]}
      ]
    },
    'micro-gravure-advantage': {
      sections: [
        { type: 'text', content: '微凹涂布在精密薄膜领域具有独特优势。' },
        { type: 'table', title: '应用领域', headers: ['应用', '膜厚', '要求'], rows: [
          ['光学膜涂布', '1-5 μm', '无缺陷、均匀'],
          ['锂电池隔膜', '2-8 μm', '陶瓷涂层精度'],
          ['导电膜涂布', '0.5-2 μm', '导电层均匀'],
          ['离型涂布', '0.3-1 μm', '超薄离型剂']
        ]}
      ]
    },
    'comma-principle': {
      sections: [
        { type: 'text', content: '逗号刮刀涂布通过逗号形刀口与背辊形成的间隙来控制膜厚。' },
        { type: 'list', items: [
          '工作原理：胶液被刮刀刮平，形成均匀膜层',
          '流变特性：对剪切速率极其敏感 (非牛顿流体效应显着)',
          '适用粘度：500-50000 mPa·s (高粘度)',
          '膜厚范围：10-500 μm'
        ]},
        { type: 'tip', tipType: 'info', content: '区别于狭缝涂布，逗号涂布对Ca数不敏感，因为其工作在低Ca的高粘度区域，主要受流变性控制。' }
      ]
    },
    'comma-application': {
      sections: [
        { type: 'text', content: '逗号涂布在中高粘度、厚涂层场景应用广泛。' },
        { type: 'table', title: '典型应用', headers: ['产品', '粘度', '膜厚', '特点'], rows: [
          ['胶带涂布', '5000-30000 cP', '20-100 μm', '压敏胶涂布'],
          ['保护膜涂布', '3000-20000 cP', '25-75 μm', '热熔胶/丙烯酸'],
          ['泡棉涂布', '10000-50000 cP', '50-200 μm', '高粘度胶'],
          ['转移涂布', '2000-15000 cP', '15-50 μm', '先涂离型再转移']
        ]}
      ]
    }
  }
}
