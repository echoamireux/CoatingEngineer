/**
 * 测试与质量数据 (Quality & Testing) V5.0
 * 架构：7-Pillar Architecture (Fluid, Substrate, PSA, Coating Physics, Polymer Physics, Optical, Reliability)
 */
const Formulas = require('./formula-lib');

module.exports = {
  categories: [
    {
      id: 'fluid',
      title: '流体与流变 (Fluid)',
      icon: '💧',
      items: [
        { id: 'fluid-viscosity', title: '粘度特性', brief: '旋转粘度/流变曲线' },
        { id: 'fluid-solid', title: '固含量', brief: 'ASTM D2369' },
        { id: 'fluid-fineness', title: '细度 (刮板)', brief: 'ASTM D1210' },
        { id: 'fluid-surface', title: '液体表面张力', brief: '悬滴法' }
      ]
    },
    {
      id: 'substrate',
      title: '基材与离型 (Substrate)',
      icon: '📜',
      items: [
        { id: 'sub-thickness', title: '厚度测量', brief: 'ASTM D374 (千分尺)' },
        { id: 'sub-release', title: '离型力', brief: 'FTM 3 / FTM 10' },
        { id: 'sub-sas', title: '残余粘着率 (SAS)', brief: 'FTM 11 (硅油转移)' },
        { id: 'sub-dyne', title: '表面能', brief: 'ASTM D2578 (达因笔)' }
      ]
    },
    {
      id: 'psa',
      title: '压敏胶性能 (PSA)',
      icon: '🤏',
      items: [
        { id: 'psa-peel', title: '剥离强度', brief: '180°/90°/解卷力' },
        { id: 'psa-tack', title: '初粘力', brief: '环形/滚球/探针' },
        { id: 'psa-shear', title: '剪切保持力', brief: '静态剪切/SAFT' }
      ]
    },
    {
      id: 'coating-phys',
      title: '涂层物理性能 (Physicals)',
      icon: '🛡️',
      items: [
        { id: 'phys-hardness', title: '硬度 (铅笔)', brief: 'ASTM D3363' },
        { id: 'phys-adhesion', title: '附着力 (百格)', brief: 'ASTM D3359' },
        { id: 'phys-abrasion', title: '耐磨性', brief: 'RCA/钢丝绒' }
      ]
    },
    {
      id: 'polymer-phys',
      title: '高分子物理深度 (Physics)',
      icon: '🧬',
      items: [
        { id: 'phys-dma', title: 'DMA 动态热机械', brief: 'Tg/模量/损耗' },
        { id: 'phys-tts', title: '时温等效 (TTS)', brief: 'WLF方程预测寿命' },
        { id: 'phys-gel', title: '凝胶分率', brief: '交联度表征' }
      ]
    },
    {
      id: 'optical',
      title: '光学性能 (Optical)',
      icon: '👁️',
      items: [
        { id: 'opt-trans', title: '透光率 & 雾度', brief: 'ASTM D1003' },
        { id: 'opt-yi', title: '黄度指数 (YI)', brief: 'ASTM E313' },
        { id: 'opt-gloss', title: '光泽度', brief: 'ASTM D523' }
      ]
    },
    {
      id: 'reliability',
      title: '可靠性 (Reliability)',
      icon: '⚡',
      items: [
        { id: 'rel-env', title: '环境老化', brief: '双85/冷热冲击' },
        { id: 'rel-weather', title: '耐候性 (UV)', brief: 'ASTM G154' },
        { id: 'rel-pct', title: '高压蒸煮 (PCT)', brief: '121°C/100%RH' }
      ]
    }
  ],
  details: {
    // === 1. Fluid ===
    'fluid-viscosity': {
      sections: [
        { type: 'text', content: '粘度是涂布工艺窗口的核心。需区分单点粘度(QC)与流变行为(研发)。' },
        { type: 'table', title: '常用测试方法', headers: ['方法', '设备', '剪切速率', '用途'], rows: [
          ['旋转法', 'Brookfield', '0.1-100 s⁻¹', '出货QC'],
          ['流变仪', 'Rheometer', '0.01-10⁴ s⁻¹', '触变性分析'],
          ['杯式法', 'Ford/Zahn Cup', '重力流出', '现场粗测']
        ]},
        { type: 'formula', title: '剪切速率估算', formula: Formulas.SHEAR_RATE_ISO || "\\dot{\\gamma} = \\frac{V}{h}", description: '简单剪切模型', params: [
           { symbol: '\\dot{\\gamma}', desc: '剪切速率 (1/s)' },
           { symbol: 'V', desc: '涂布速度 (m/s)' },
           { symbol: 'h', desc: '湿膜厚度 (m)' }
        ]},
        { type: 'tip', tipType: 'warning', content: '狭缝涂布模头内的剪切速率通常高达 1,000-10,000 s⁻¹，仅测低剪粘度不足以预测涂布性。' }
      ]
    },
    'fluid-solid': {
      sections: [
        { type: 'text', content: '固含量 (Solid Content) 决定了干膜厚度与湿膜厚度的换算比例。' },
        { type: 'table', title: '标准程序 (ASTM D2369)', headers: ['步骤', '参数'], rows: [
          ['取样量', '0.5 ± 0.1 g (避免厚膜表面结皮)'],
          ['烘烤温度', '110 ± 5 °C (通用)'],
          ['烘烤时间', '60 min (或至恒重)'],
          ['冷却', '干燥皿中冷却至室温']
        ]},
        { type: 'formula', title: '固含量计算', formula: Formulas.SOLID_CONTENT, description: '质量百分比', params: [
          { symbol: 'W_{dry}', desc: '烘干后质量 (g)' },
          { symbol: 'W_{wet}', desc: '测试前质量 (g)' }
        ]}
      ]
    },
    'fluid-fineness': {
      sections: [
        { type: 'text', content: '刮板细度计 (Hegman Gauge) 用于检测浆料中未分散的颗粒或聚集体。' },
        { type: 'list', items: [
          '标准：ASTM D1210',
          '量程：通常 0-50μm 或 0-100μm',
          '读数：出现连续划痕或密集颗粒点的位置'
        ]},
        { type: 'tip', tipType: 'info', content: '对于精密涂布，颗粒度应小于干膜厚度的 1/2，否则易产生划痕(Streaks)。' }
      ]
    },
    'fluid-surface': {
      sections: [
        { type: 'text', content: '液体表面张力决定了能否润湿基材。' },
        { type: 'table', title: '润湿准则', headers: ['关系', '结果'], rows: [
          ['σ_液 < σ_固', '铺展良好 (Wetting)'],
          ['σ_液 > σ_固', '缩孔 (Dewetting/Cratering)']
        ]},
        { type: 'tip', tipType: 'warning', content: '添加流平剂可以降低液体表面张力，但过量可能导致层间附着力下降。' }
      ]
    },

    // === 2. Substrate ===
    'sub-thickness': {
      sections: [
        { type: 'text', content: '厚度均一性是精密涂布的基石。' },
        { type: 'table', title: '测量方法 (ASTM D374)', headers: ['类型', '精度', '特点'], rows: [
          ['千分尺', '1 μm', '接触式，硬基材准确'],
          ['LVDT测厚仪', '0.1 μm', '接触式，恒定压力，适合薄膜'],
          ['光谱共焦', '0.01 μm', '在线非接触，透明膜首选']
        ]},
        { type: 'tip', tipType: 'info', content: '报告厚度时应包含：平均值、公差范围 (Range) 及标准差 (Stdev)。' }
      ]
    },
    'sub-release': {
      sections: [
        { type: 'text', content: '离型力决定了模切排废和客户端解卷的顺畅度。' },
        { type: 'table', title: 'FTM 3 / FTM 10 标准', headers: ['工况', '速度', '意义'], rows: [
          ['低速剥离', '0.3 m/min', '手工剥离手感，常规QC'],
          ['高速剥离', '10-300 m/min', '模拟自动贴标/分条机解卷']
        ]},
        { type: 'text', content: '**常见判定标准**：' },
        { type: 'list', items: [
          '超轻离型：1-3 g/25mm',
          '轻离型：3-5g/25mm',
          '中离型：10-15g/25mm',
          '重离型：30-50g/25mm'
        ]}
      ]
    },
    'sub-sas': {
      sections: [
        { type: 'text', content: 'SAS (Subsequent Adhesion Strength) 残余粘着率，用于评价离型膜硅油固化程度及转移情况。' },
        { type: 'list', items: [
          '标准：FTM 11',
          '原理：用标准胶带贴合离型膜后撕下，再测试其对钢板的剥离力，与空白样对比。'
        ]},
        { type: 'formula', title: 'SAS 计算', formula: "SAS\\% = \\frac{F_{tested}}{F_{initial}} \\times 100\\%", description: '越接近100%越好', params: [
          { symbol: 'F_{tested}', desc: '接触离型膜后的剥离力' },
          { symbol: 'F_{initial}', desc: '原始胶带剥离力' }
        ]},
        { type: 'tip', tipType: 'warning', content: 'SAS < 85% 通常意味着硅油转移严重，会导致下游产品这一面“甚至粘不住”。' }
      ]
    },
    'sub-dyne': {
      sections: [
         { type: 'text', content: '表面能测试用于确认基材是否经过电晕处理(Corona)。' },
         { type: 'list', items: [
           '达因笔法 (ASTM D2578)：观察液体收缩。若3秒内不收缩为合格。',
           '接触角法 (ASTM D7490)：测水和二碘甲烷接触角，计算色散/极性分量。'
         ]}
      ]
    },

    // === 3. PSA ===
    'psa-peel': {
      sections: [
        { type: 'text', content: '剥离强度是衡量压敏胶粘性的最直观指标。' },
        { type: 'table', title: '常见剥离类型', headers: ['类型', '标准', '应用'], rows: [
          ['180°剥离', 'ASTM D3330', '标准测试，对钢板/玻璃'],
          ['90°剥离', 'ASTM D6862', '刚性背材或易折断材料'],
          ['T型剥离', 'ASTM D1876', '柔性对柔性 (Film-Film)']
        ]},
        { type: 'formula', title: '结果计算', formula: Formulas.PEEL_STRENGTH, description: '单位 N/25mm 或 N/in', params: [
           { symbol: 'F_{peel}', desc: '剥离强度' },
           { symbol: 'F_{avg}', desc: '平均力值 (避开初始/结尾)' }
        ]}
      ]
    },
    'psa-tack': {
      sections: [
        { type: 'text', content: '初粘力 (Tack) 指胶面与被粘物以极轻压力瞬间接触后的抵抗分离的能力。' },
        { type: 'table', title: '测试对比', headers: ['方法', '特点', '适用'], rows: [
          ['环形 Loop', 'ASTM D6195', '定量力值，重复性好，研发首选'],
          ['滚球 Ball', 'PSTC-6', '设备简单，仅能分级(球号)，产线首选'],
          ['探针 Probe', 'ASTM D2979', '微观点接触，研究流变机理']
        ]}
      ]
    },
    'psa-shear': {
      sections: [
        { type: 'text', content: '剪切保持力反映胶体的内聚强度 (Cohesion) 和耐蠕变性。' },
        { type: 'list', items: [
          '**静态剪切 (Static Shear)**: ASTM D3654。在 1kg 负载下记录胶带滑落时间 (min)。',
          '**SAFT (剪切失效温度)**: ASTM D4498。挂重物升温 (如 1°C/min)，记录滑落时的温度。'
        ]},
        { type: 'tip', tipType: 'info', content: '高内聚胶水剪切时间应 > 10,000 min (不滑落)。失效模式应为内聚破坏 (Cohesive Failure)。' }
      ]
    },

    // === 4. Coating Phys ===
    'phys-hardness': {
      sections: [
        { type: 'text', content: '铅笔硬度是评价 Hard Coat (HC) 涂层表面抗刮伤能力的标准方法。' },
        { type: 'table', title: 'ASTM D3363 规范', headers: ['参数', '值'], rows: [
          ['铅笔', '三菱 Uni (标准)'],
          ['负载', '750g 或 1000g (日系)'],
          ['角度', '45°'],
          ['判定', '未划破涂层的最硬铅笔号']
        ]},
        { type: 'text', content: '等级排序：9H(最硬) ... H, F, HB ... 6B(最软)。常见HC膜要求 2H-3H。' }
      ]
    },
    'phys-adhesion': {
      sections: [
        { type: 'text', content: '百格测试 (Cross-Cut) 评价涂层与基材的结合牢度。' },
        { type: 'table', title: 'ASTM D3359 等级', headers: ['等级', '脱落情况', '合格判定'], rows: [
          ['5B', '切口边缘完全光滑，无脱落', '优秀'],
          ['4B', '交叉点微小脱落 (<5%)', '合格'],
          ['3B', '脱落面积 5-15%', '不合格 (通常)'],
          ['0B', '脱落面积 > 65%', '严重失效']
        ]},
        { type: 'tip', tipType: 'warning', content: '测试胶带必须使用标准规定的 3M 600 或 3M 610，否则结果无效。' }
      ]
    },
    'phys-abrasion': {
      sections: [
        { type: 'text', content: '耐磨测试评价功能涂层（如AF防指纹、疏水层）的耐久性。' },
        { type: 'list', items: [
          '钢丝绒耐磨：1kg负载，#0000 钢丝绒，磨擦 2000-5000 次后测水接触角。',
          'RCA 纸带耐磨：ASTM F2357，评估按键/外壳涂层。'
        ]}
      ]
    },

    // === 5. Polymer Phys ===
    'phys-dma': {
      sections: [
        { type: 'text', content: 'DMA (动态热机械分析) 是高分子物理研究的“透视眼”。' },
        { type: 'formula', title: '储能模量', formula: Formulas.STORAGE_MODULUS, description: '弹性部分，代表能量储存' },
        { type: 'formula', title: '损耗模量', formula: Formulas.LOSS_MODULUS, description: '粘性部分，代表能量耗散' },
        { type: 'formula', title: '损耗因子', formula: Formulas.TAN_DELTA, description: 'Tanδ峰值温度常被定义为 Tg' }
      ]
    },
    'phys-tts': {
      sections: [
        { type: 'text', content: '时温等效原理 (TTS) 允许利用高温下的短时数据预测低温下的长期性能。' },
        { type: 'formula', title: 'WLF 方程', formula: Formulas.WLF_EQUATION, params: [
           { symbol: 'a_T', desc: '移位因子 (Shift Factor)' },
           { symbol: 'C_1', desc: '经验常数 (通用值 17.44)' },
           { symbol: 'C_2', desc: '经验常数 (通用值 51.6 K)' },
           { symbol: 'T', desc: '测试温度 (K)' },
           { symbol: 'T_r', desc: '参考温度 (K, 通常即 Tg)' }
        ]},
        { type: 'tip', tipType: 'info', content: '通过 TTS 构建的主曲线 (Master Curve) 可以预测胶带在 10⁻⁵ ~ 10⁵ Hz 极宽频率范围内的表现。' }
      ]
    },
    'phys-gel': {
      sections: [
        { type: 'text', content: '凝胶分率 (Gel Fraction) 宏观表征聚合物网络的交联致密程度。' },
        { type: 'formula', title: '凝胶计算', formula: Formulas.GEL_FRACTION, description: '溶剂萃取24h后的残留比例', params: [
           { symbol: 'W_{gel}', desc: '萃取干燥后质量 (g)' },
           { symbol: 'W_{initial}', desc: '初始质量 (g)' }
        ]},
        { type: 'formula', title: '微观交联密度', formula: Formulas.CROSSLINK_DENSITY, description: '基于橡胶平台模量 G\'', params: [
           { symbol: '\\nu_e', desc: '有效交联密度 (mol/m³)' },
           { symbol: "G'", desc: '橡胶态储能模量 (Pa)' },
           { symbol: 'R', desc: '气体常数 (8.314 J/mol·K)' },
           { symbol: 'T', desc: '绝对温度 (K)' }
        ]}
      ]
    },

    // === 6. Optical ===
    'opt-trans': {
      sections: [
        { type: 'text', content: '透光率和雾度 (Haze) 是OCA光学胶的关键指标。' },
        { type: 'formula', title: '雾度计算', formula: Formulas.HAZE_CALC, description: 'ASTM D1003', params: [
           { symbol: 'T_{diffuse}', desc: '散射光透射率 (>2.5°)' },
           { symbol: 'T_{total}', desc: '总透射率' }
        ]},
        { type: 'text', content: '高端显示用OCA要求：透光率 > 99%，雾度 < 0.5%。' }
      ]
    },
    'opt-yi': {
      sections: [
        { type: 'text', content: '黄度指数 (YI - Yellowness Index) 评价材料的“泛黄”程度。' },
        { type: 'formula', title: 'YI E313', formula: Formulas.YI_CALC, description: '基于CIE三刺激值', params: [
          { symbol: 'X, Y, Z', desc: 'CIE 三刺激值' }
        ]},
        { type: 'tip', tipType: 'warning', content: '耐老化测试后 ΔYI < 1.0 通常作为合格标准。' }
      ]
    },
    'opt-gloss': {
       sections: [
         { type: 'text', content: '光泽度 (Gloss) 评价表面的镜面反射能力 (ASTM D523)。' },
         { type: 'list', items: [
           '高光泽：60°角测试值 > 70GU (如钢琴黑表面)',
           '半光泽：10-70GU',
           '哑光 (Matte)：< 10GU (如AG防眩光膜)'
         ]}
       ]
    },

    // === 7. Reliability ===
    'rel-env': {
      sections: [
        { type: 'text', content: '环境老化测试用于模拟产品在极端气候下的可靠性。' },
        { type: 'table', title: '常用老化条件', headers: ['简称', '条件', '考核点'], rows: [
          ['双85', '85°C / 85%RH', '水解、气泡'],
          ['高温高湿', '60°C / 90%RH', '消费电子常用'],
          ['冷热冲击', '-40°C ↔ 85°C', '界面应力、分层'],
          ['高温存储', '85°C 或 120°C', '耐热、挥发']
        ]}
      ]
    },
    'rel-weather': {
      sections: [
        { type: 'text', content: '耐候性测试 (Quartz/Xenon/UV) 模拟阳光照射导致的老化。' },
        { type: 'table', title: 'ASTM G154 (QUV)', headers: ['光源', '波长', '特点'], rows: [
          ['UVA-340', '340nm 峰值', '模拟户外阳光最佳'],
          ['UVB-313', '313nm 峰值', '加速因子高，但可能导致非自然老化']
        ]}
      ]
    },
    'rel-pct': {
      sections: [
        { type: 'text', content: 'PCT (Pressure Cooker Test) 高压蒸煮测试，极端苛刻的湿热老化。' },
        { type: 'list', items: [
          '条件：121°C / 100% RH / 2 atm (饱和蒸汽压)',
          '时间：24h / 48h / 96h',
          '应用：半导体封装、高端OCA、车规级材料。'
        ]}
      ]
    }
  }
};
