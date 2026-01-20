/**
 * 测试方法数据
 */
module.exports = {
  categories: [
    {
      id: 'dma',
      title: 'DMA动态热机械分析',
      icon: '📈',
      items: [
        { id: 'dma-principle', title: '基本原理', brief: "储能模量/损耗模量/tanδ" },
        { id: 'dma-tg', title: 'Tg测定方法', brief: '三种判定标准' },
        { id: 'dma-tts', title: '时温等效原理', brief: 'WLF方程' },
        { id: 'dma-crosslink', title: '交联密度计算', brief: '橡胶态平台模量法' }
      ]
    },
    {
      id: 'gel-fraction',
      title: '凝胶分率测试',
      icon: '🧫',
      items: [
        { id: 'gel-method', title: '测试方法', brief: '索氏提取法' },
        { id: 'gel-relation', title: '与性能关系', brief: '交联程度指标' }
      ]
    },
    {
      id: 'rheology',
      title: '流变分析',
      icon: '💧',
      items: [
        { id: 'rheo-steady', title: '稳态剪切', brief: '幂律/Carreau模型' },
        { id: 'rheo-3itt', title: '触变性测试', brief: '3ITT方法' },
        { id: 'rheo-coating', title: '涂布相关参数', brief: '各环节剪切速率' }
      ]
    },
    {
      id: 'adhesion',
      title: '粘着性能测试',
      icon: '📋',
      items: [
        { id: 'peel-180', title: '180°剥离力', brief: 'ASTM D3330' },
        { id: 'peel-90', title: '90°剥离力', brief: 'ASTM D6862' },
        { id: 'shear-test', title: '保持力测试', brief: 'ASTM D3654' },
        { id: 'tack-test', title: '初粘测试', brief: '环形/滚球' }
      ]
    },
    {
      id: 'optical',
      title: '光学性能测试',
      icon: '👁️',
      items: [
        { id: 'transmittance', title: '透光率', brief: '积分球法' },
        { id: 'haze', title: '雾度', brief: '散射光测量' },
        { id: 'yellowness', title: '黄度指数', brief: 'ASTM E313' }
      ]
    },
    {
      id: 'aging',
      title: '老化测试体系',
      icon: '⏳',
      items: [
        { id: 'aging-th', title: '恒温恒湿', brief: '85°C/85%RH' },
        { id: 'aging-thermal', title: '冷热循环', brief: '-40°C↔85°C' },
        { id: 'aging-uv', title: 'UV老化', brief: 'UVA-340' }
      ]
    }
  ],
  details: {
    'dma-principle': {
      sections: [
        { type: 'text', content: 'DMA通过对样品施加正弦应力或应变，测量材料的粘弹性响应。' },
        { type: 'formula', title: '储能模量', formula: "G' = (σ₀/ε₀) × cosδ", description: '表征材料弹性（储存能量）的能力', params: [
          { symbol: "G'", desc: '储能模量 (Pa)' },
          { symbol: 'σ₀', desc: '应力幅值' },
          { symbol: 'ε₀', desc: '应变幅值' },
          { symbol: 'δ', desc: '相位角' }
        ]},
        { type: 'formula', title: '损耗模量', formula: "G'' = (σ₀/ε₀) × sinδ", description: '表征材料粘性（耗散能量）的能力', params: [
          { symbol: "G''", desc: '损耗模量 (Pa)' }
        ]},
        { type: 'formula', title: '损耗因子', formula: "tanδ = G'' / G'", description: '粘性与弹性的比值，Tg处出现峰值' }
      ]
    },
    'dma-tg': {
      sections: [
        { type: 'text', content: 'DMA测定Tg有三种常用判定标准：' },
        { type: 'table', title: 'Tg判定方法', headers: ['方法', '取值点', '特点'], rows: [
          ["G'起始下降", '储能模量开始显著下降的温度', '最保守，最低温度'],
          ["tanδ峰值", '损耗因子的峰值温度', '最常用，与DSC接近'],
          ["G''峰值", '损耗模量的峰值温度', '介于两者之间']
        ]},
        { type: 'tip', tipType: 'info', content: '报告Tg时应注明测试频率和判定方法，不同方法可相差10-20°C。' }
      ]
    },
    'dma-tts': {
      sections: [
        { type: 'text', content: '时温等效原理(TTS)：温度变化和频率变化对聚合物粘弹性的影响可以相互等效。' },
        { type: 'formula', title: 'WLF方程', formula: 'log aₜ = -C₁(T-Tᵣ) / [C₂+(T-Tᵣ)]', description: '描述移位因子与温度的关系', params: [
          { symbol: 'aₜ', desc: '移位因子' },
          { symbol: 'T', desc: '测试温度 (K)' },
          { symbol: 'Tᵣ', desc: '参考温度 (K)' },
          { symbol: 'C₁', desc: 'WLF常数，通用值≈17.4' },
          { symbol: 'C₂', desc: 'WLF常数，通用值≈51.6K' }
        ]},
        { type: 'tip', tipType: 'info', content: '通过TTS可以构建主曲线，预测材料在不同温度/频率下的力学行为。' }
      ]
    },
    'dma-crosslink': {
      sections: [
        { type: 'text', content: '通过DMA的橡胶态平台模量可以估算交联密度。' },
        { type: 'formula', title: '交联密度计算', formula: 'νₑ = G\' / (3RT)', description: '基于橡胶弹性理论', params: [
          { symbol: 'νₑ', desc: '交联密度 (mol/m³)' },
          { symbol: "G'", desc: '橡胶态平台储能模量 (Pa)' },
          { symbol: 'R', desc: '气体常数 8.314 J/(mol·K)' },
          { symbol: 'T', desc: '测试温度 (K)' }
        ]},
        { type: 'tip', tipType: 'warning', content: '该方法假设理想橡胶网络，实际值可能偏差，适合相对比较。' }
      ]
    },
    'gel-method': {
      sections: [
        { type: 'text', content: '凝胶分率通过索氏提取法测定，用溶剂萃取可溶的溶胶部分，剩余为不溶的凝胶。' },
        { type: 'formula', title: '凝胶分率计算', formula: 'Gel% = (m提取后 / m提取前) × 100%', description: '提取前后干重比值' },
        { type: 'table', title: '标准测试条件', headers: ['参数', '推荐值'], rows: [
          ['溶剂', '乙酸乙酯 或 甲苯'],
          ['提取时间', '24-48 小时'],
          ['样品量', '0.5-1.0 g'],
          ['干燥条件', '60°C真空干燥至恒重']
        ]}
      ]
    },
    'gel-relation': {
      sections: [
        { type: 'text', content: '凝胶分率是评价交联程度的直接指标，与压敏胶性能密切相关。' },
        { type: 'table', title: '凝胶分率与性能关系', headers: ['凝胶分率', '交联程度', '初粘', '内聚力'], rows: [
          ['< 30%', '轻交联', '高', '低'],
          ['30-50%', '中等交联', '中', '中'],
          ['50-70%', '较高交联', '低', '高'],
          ['> 70%', '过交联', '很低', '很高']
        ]},
        { type: 'tip', tipType: 'info', content: 'OCA光学胶通常凝胶分率在40-60%，平衡光学透明度和内聚力。' }
      ]
    },
    'rheo-steady': {
      sections: [
        { type: 'text', content: '稳态剪切测试揭示流体的粘度-剪切速率关系。' },
        { type: 'formula', title: '幂律模型', formula: 'η = K × γ̇^(n-1)', description: '描述非牛顿流体行为', params: [
          { symbol: 'η', desc: '表观粘度 (Pa·s)' },
          { symbol: 'K', desc: '稠度系数' },
          { symbol: 'γ̇', desc: '剪切速率 (1/s)' },
          { symbol: 'n', desc: '流动指数 (n<1剪切变稀)' }
        ]},
        { type: 'table', title: '流体类型', headers: ['n值', '类型', '特征'], rows: [
          ['n = 1', '牛顿流体', '粘度不变'],
          ['n < 1', '假塑性(剪切变稀)', '越剪越稀'],
          ['n > 1', '胀塑性(剪切增稠)', '越剪越稠']
        ]}
      ]
    },
    'rheo-3itt': {
      sections: [
        { type: 'text', content: '3ITT (3-Interval Thixotropy Test)测试材料的触变性和结构恢复能力。' },
        { type: 'list', items: [
          '阶段1：低剪切(1/s)建立基线粘度',
          '阶段2：高剪切(1000/s)破坏结构',
          '阶段3：低剪切(1/s)观察恢复'
        ]},
        { type: 'table', title: '评价指标', headers: ['指标', '定义', '意义'], rows: [
          ['恢复率', '(η₃/η₁)×100%', '结构恢复程度'],
          ['恢复时间', '达到80%基线的时间', '恢复速度']
        ]},
        { type: 'tip', tipType: 'info', content: '良好的涂布胶需要快速结构恢复（<30s恢复80%），以防止流挂。' }
      ]
    },
    'rheo-coating': {
      sections: [
        { type: 'text', content: '涂布过程各环节的剪切速率差异很大，需要了解实际工况。' },
        { type: 'table', title: '涂布环节剪切速率', headers: ['环节', '剪切速率 (1/s)', '说明'], rows: [
          ['储罐搅拌', '1-10', '低剪切'],
          ['管路输送', '10-100', '中等剪切'],
          ['狭缝模头', '100-10000', '高剪切'],
          ['涂布后流平', '0.1-10', '低剪切恢复']
        ]},
        { type: 'tip', tipType: 'warning', content: '测试时应覆盖实际涂布的剪切速率范围（通常0.1-10000 1/s）。' }
      ]
    },
    'peel-180': {
      sections: [
        { type: 'text', content: '180°剥离力测试是评价压敏胶粘着力的标准方法。' },
        { type: 'table', title: '测试参数 (ASTM D3330)', headers: ['参数', '标准值'], rows: [
          ['试样宽度', '25 mm'],
          ['剥离速度', '300 mm/min'],
          ['被粘材料', '不锈钢板（标准）'],
          ['贴合压力', '2kg辊压2次'],
          ['停放时间', '20分钟（室温）']
        ]},
        { type: 'formula', title: '剥离力计算', formula: 'F = 力值 / 宽度', description: '结果以N/25mm表示' }
      ]
    },
    'peel-90': {
      sections: [
        { type: 'text', content: '90°剥离力测试更接近实际使用情况，对胶层刚性更敏感。' },
        { type: 'table', title: '测试参数 (ASTM D6862)', headers: ['参数', '标准值'], rows: [
          ['试样宽度', '25 mm'],
          ['剥离速度', '300 mm/min'],
          ['剥离角度', '90°'],
          ['夹具', '90°剥离夹具']
        ]},
        { type: 'tip', tipType: 'info', content: '90°剥离力通常低于180°，约为180°剥离力的50-70%。' }
      ]
    },
    'shear-test': {
      sections: [
        { type: 'text', content: '保持力测试(静态剪切)评价胶带抵抗剪切蠕变的能力。' },
        { type: 'table', title: '测试参数 (ASTM D3654)', headers: ['参数', '标准值'], rows: [
          ['贴合面积', '25×25 mm'],
          ['悬挂重量', '1 kg（标准）'],
          ['测试温度', '室温 或 70°C'],
          ['测试结果', '失效时间（分钟）']
        ]},
        { type: 'tip', tipType: 'info', content: '室温保持力需>10000min，70°C保持力用于评价耐热性。' }
      ]
    },
    'tack-test': {
      sections: [
        { type: 'text', content: '初粘测试评价胶与被粘物初始接触时的粘着力。' },
        { type: 'table', title: '测试方法对比', headers: ['方法', '原理', '结果'], rows: [
          ['环形初粘', '胶环接触钢板后拉起', '力值（N）'],
          ['滚球初粘', '钢球在胶面滚动距离', '停止的最小球号'],
          ['探针初粘', '探针接触分离的力', '力值（N）']
        ]},
        { type: 'tip', tipType: 'info', content: '环形初粘更适合研发评估，滚球法更适合生产质控。' }
      ]
    },
    'transmittance': {
      sections: [
        { type: 'text', content: '透光率是评价OCA等光学胶透明度的关键指标。' },
        { type: 'formula', title: '透光率计算', formula: 'T% = (I_t / I_0) × 100%', description: 'I_t为透射光强，I_0为入射光强' },
        { type: 'table', title: '测试标准', headers: ['标准', '波长', '典型要求'], rows: [
          ['ASTM D1003', '可见光400-700nm', 'OCA > 92%'],
          ['单点550nm', '550nm', 'OCA > 93%']
        ]}
      ]
    },
    'haze': {
      sections: [
        { type: 'text', content: '雾度表征材料对光的散射程度，影响显示清晰度。' },
        { type: 'formula', title: '雾度计算', formula: 'Haze% = (散射光 / 总透射光) × 100%', description: '偏离入射光方向>2.5°的光为散射光' },
        { type: 'table', title: 'OCA雾度要求', headers: ['等级', '雾度', '应用'], rows: [
          ['高端OCA', '< 0.5%', '旗舰显示屏'],
          ['普通OCA', '< 1.0%', '消费类'],
          ['工业级', '< 2.0%', '工业显示']
        ]}
      ]
    },
    'yellowness': {
      sections: [
        { type: 'text', content: '黄度指数(YI)评价材料的泛黄程度，影响显示色彩准确性。' },
        { type: 'formula', title: '黄度指数', formula: 'YI = 100 × (CX - CZ) / Y', description: 'CX、CZ为色度系数，Y为亮度因子' },
        { type: 'table', title: 'OCA黄度要求', headers: ['等级', 'YI值', '备注'], rows: [
          ['高端OCA', '< 1.0', '无可见泛黄'],
          ['普通OCA', '< 2.0', '轻微泛黄'],
          ['老化后', '< 3.0', '2000h老化后']
        ]}
      ]
    },
    'aging-th': {
      sections: [
        { type: 'text', content: '恒温恒湿老化测试是评价胶带耐久性的核心测试。' },
        { type: 'table', title: '测试条件', headers: ['参数', '标准条件', '加速条件'], rows: [
          ['温度', '60°C', '85°C'],
          ['湿度', '90%RH', '85%RH'],
          ['时间', '500h', '1000h']
        ]},
        { type: 'list', items: [
          '评估指标：外观变化、剥离力保持率、YI变化',
          '85°C/85%RH/1000h是行业通用加速老化条件',
          '约等效于室温10年使用寿命（经验值）'
        ]}
      ]
    },
    'aging-thermal': {
      sections: [
        { type: 'text', content: '冷热循环测试评价胶带的热膨胀匹配和界面稳定性。' },
        { type: 'table', title: '测试条件', headers: ['参数', '典型值'], rows: [
          ['低温', '-40°C'],
          ['高温', '+85°C'],
          ['保持时间', '30分钟'],
          ['循环次数', '100-500次'],
          ['升降温速率', '2-5°C/min']
        ]},
        { type: 'tip', tipType: 'warning', content: '冷热循环易导致界面分层和气泡，特别是CTE不匹配的组合。' }
      ]
    },
    'aging-uv': {
      sections: [
        { type: 'text', content: 'UV老化测试评价材料的光稳定性，预测户外使用寿命。' },
        { type: 'table', title: '测试条件 (ASTM G154)', headers: ['参数', '标准值'], rows: [
          ['灯管', 'UVA-340'],
          ['辐照度', '0.89 W/m²@340nm'],
          ['黑板温度', '60°C'],
          ['循环', '4h UV + 4h冷凝（可选）'],
          ['总时间', '500-2000h']
        ]},
        { type: 'tip', tipType: 'info', content: '500h UVA-340约等效于1年户外曝晒（因地区而异）。' }
      ]
    }
  }
}
