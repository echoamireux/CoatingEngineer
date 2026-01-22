/**
 * 材料科学数据 (Materials Science)
 * 包含：胶黏剂体系(原Adhesive)、基材科学、界面科学
 */
module.exports = {
  categories: [
    // --- 胶黏剂体系 (Migrated from adhesive.js) ---
    {
      id: 'acrylic',
      title: '丙烯酸酯压敏胶',
      icon: '🧪',
      items: [
        { id: 'acrylic-monomer', title: '单体体系', brief: '软单体/硬单体/功能单体' },
        { id: 'acrylic-tg', title: 'Tg调控理论', brief: 'Fox方程与配方设计' },
        { id: 'acrylic-crosslink', title: '交联体系', brief: '金属螯合/异氰酸酯/环氧' },
        { id: 'acrylic-type', title: '乳液vs溶剂型', brief: '溶剂/乳液 性能对比' }
      ]
    },
    {
      id: 'silicone',
      title: '有机硅压敏胶',
      icon: '🔬',
      items: [
        { id: 'silicone-resin', title: 'MQ树脂体系', brief: '胶/树脂比 (M/Q Ratio)' },
        { id: 'silicone-cure', title: '固化体系', brief: '加成/过氧化物/缩合' },
        { id: 'silicone-hightemp', title: '高温特性', brief: 'Si-O键能 / 耐温应用' }
      ]
    },
    {
      id: 'uv-curable',
      title: 'UV/光固化胶系',
      icon: '☀️',
      items: [
        { id: 'uv-prepolymer', title: '预聚物体系', brief: 'PUA/EA/聚酯丙烯酸酯' },
        { id: 'uv-initiator', title: '光引发剂', brief: '自由基/阳离子型' },
        { id: 'uv-cure', title: '固化工艺', brief: '能量剂量与深层固化' }
      ]
    },
    {
      id: 'hotmelt',
      title: '热熔压敏胶',
      icon: '🔥',
      items: [
        { id: 'hmpsa-polymer', title: '基础聚合物', brief: 'SIS/SBS/SEBS' },
        { id: 'hmpsa-tackifier', title: '增粘树脂', brief: '松香酯/萜烯/石油树脂' },
        { id: 'hmpsa-formula', title: '配方设计', brief: '配比与开放时间' }
      ]
    },
    {
      id: 'rubber',
      title: '橡胶型压敏胶',
      icon: '⚫',
      items: [
        { id: 'rubber-nr', title: '天然橡胶', brief: 'NR体系与塑炼' },
        { id: 'rubber-sr', title: '合成橡胶', brief: 'SBR/CR/NBR' }
      ]
    },

    // --- 新增章节 (New Chapters) ---
    {
      id: 'substrate',
      title: '基材科学',
      icon: '📄',
      items: [
        { id: 'sub-types', title: '常见基材', brief: 'PET/PI/COP特性对比' },
        { id: 'sub-treatment', title: '表面处理', brief: '电晕/底涂/化学刻蚀' },
        { id: 'sub-quality', title: '基材质量管控', brief: '厚度/收缩率/粗糙度' }
      ]
    },
    {
      id: 'interface',
      title: '界面与润湿',
      icon: '💧',
      items: [
        { id: 'surf-wetting', title: '接触角与润湿', brief: '杨氏方程与判据' },
        { id: 'surf-energy', title: '表面能与达因值', brief: '测试方法与匹配原则' },
        { id: 'surf-hsp', title: '溶解度参数', brief: 'HSP相似相溶原理' }
      ]
    }
  ],
  details: {
    // --- Migrated Details (Adhesive) ---
    'acrylic-monomer': {
      sections: [
        { type: 'text', content: '丙烯酸酯压敏胶的单体选择是配方设计的基础，不同单体赋予胶不同的性能特征。' },
        { type: 'table', title: '软单体（主单体，占60-90%）', headers: ['单体', '简称', 'Tg(°C)', '特点'], rows: [
          ['丙烯酸丁酯', 'BA', '-54', '成本低，通用性好'],
          ['丙烯酸-2-乙基己酯', '2-EHA', '-70', '更柔软，耐水性好'],
          ['丙烯酸异辛酯', 'IOA', '-58', '低Tg，优异初粘']
        ]},
        { type: 'table', title: '硬单体（调节Tg，占5-30%）', headers: ['单体', '简称', 'Tg(°C)', '特点'], rows: [
          ['甲基丙烯酸甲酯', 'MMA', '+105', '提高内聚力'],
          ['苯乙烯', 'St', '+100', '提高硬度'],
          ['丙烯腈', 'AN', '+97', '耐油性']
        ]},
        { type: 'table', title: '功能单体（交联/极性，占1-10%）', headers: ['单体', '简称', '功能'], rows: [
          ['丙烯酸', 'AA', '提供-COOH，交联位点'],
          ['丙烯酸羟乙酯', 'HEA', '提供-OH，异氰酸酯交联'],
          ['甲基丙烯酸缩水甘油酯', 'GMA', '环氧交联']
        ]},
        { type: 'tip', tipType: 'info', content: 'OCA光学胶通常采用纯2-EHA或IOA体系，减少极性单体以提高光学透明度。' }
      ]
    },
    'acrylic-tg': {
      sections: [
        { type: 'text', content: 'Tg（玻璃化转变温度）是压敏胶配方设计的核心参数，直接影响胶的粘弹性窗口和使用性能。' },
        { type: 'formula', title: 'Fox方程', formula: '1/Tg = \\sum (W_i / Tg_i)', description: '用于预测共聚物的玻璃化转变温度', params: [
          { symbol: 'Tg', desc: '共聚物玻璃化转变温度 (K)' },
          { symbol: 'W_i', desc: '第i种单体的质量分数' },
          { symbol: 'Tg_i', desc: '第i种单体均聚物的Tg (K)' }
        ]},
        { type: 'table', title: '常用单体Tg参考值', headers: ['单体', '简称', 'Tg (°C)'], rows: [
          ['丙烯酸丁酯', 'BA', '-54'],
          ['丙烯酸-2-乙基己酯', '2-EHA', '-70'],
          ['甲基丙烯酸甲酯', 'MMA', '+105'],
          ['丙烯酸', 'AA', '+106'],
          ['丙烯酸羟乙酯', 'HEA', '-15']
        ]},
        { type: 'tip', tipType: 'info', content: '压敏胶的Tg通常设计在-30~-50°C范围，以获得良好的初粘力和常温粘弹性。' }
      ]
    },
    'acrylic-crosslink': {
      sections: [
        { type: 'text', content: '交联是提高压敏胶内聚力和耐温性能的关键手段，常见交联体系包括：' },
        { type: 'list', items: [
          '金属螯合交联：Al³⁺、Zn²⁺与-COOH形成配位键，用量0.1-0.5%',
          '异氰酸酯交联：HDI、IPDI与-OH反应，需要熟化时间',
          '环氧交联：与-COOH反应，常用于乳液型胶',
          'UV后交联：光引发剂+多官能单体，可控交联'
        ]},
        { type: 'tip', tipType: 'warning', content: '交联程度过高会导致初粘力下降，需在初粘与内聚力之间寻求平衡。' }
      ]
    },
    'acrylic-type': {
      sections: [
        { type: 'text', content: '丙烯酸酯胶按聚合方式分为溶剂型和乳液型两大类，各有优缺点。' },
        { type: 'table', title: '溶剂型 vs 乳液型对比', headers: ['特性', '溶剂型', '乳液型'], rows: [
          ['介质', '有机溶剂', '水'],
          ['固含量', '40-60%', '50-65%'],
          ['粘度', '可调范围大', '相对固定'],
          ['干燥', '较快', '依赖水分蒸发'],
          ['环保', 'VOC排放高', '环保友好'],
          ['耐水性', '较好', '略差'],
          ['成本', '溶剂回收成本', '相对较低']
        ]},
        { type: 'tip', tipType: 'info', content: '高端光学胶多采用溶剂型或UV固化型，乳液型在标签、胶带领域应用广泛。' }
      ]
    },
    'silicone-resin': {
      sections: [
        { type: 'text', content: '有机硅压敏胶由硅橡胶和MQ硅树脂共混组成，两者比例决定性能特征。' },
        { type: 'list', items: [
          '硅橡胶：提供柔软性和粘着力（PDMS主链）',
          'MQ树脂：提供内聚力和粘性（M单元(CH₃)₃SiO₁/₂ + Q单元SiO₄/₂）',
          '典型配比：硅橡胶:MQ = 50:50 ~ 60:40'
        ]},
        { type: 'table', title: 'MQ树脂影响', headers: ['MQ含量', '初粘', '剥离力', '内聚力'], rows: [
          ['40%', '高', '中', '低'],
          ['50%', '中', '高', '中'],
          ['60%', '低', '中', '高']
        ]}
      ]
    },
    'silicone-cure': {
      sections: [
        { type: 'text', content: '有机硅压敏胶的固化体系决定其加工工艺和最终性能。' },
        { type: 'table', title: '三种固化体系对比', headers: ['固化类型', '机理', '特点', '应用'], rows: [
          ['加成固化', 'Pt催化Si-H加成', '快速、无副产物', '高端电子'],
          ['过氧化物', '自由基交联', '耐热性好', '高温胶带'],
          ['缩合固化', 'Si-OH缩合', '室温固化', '密封胶']
        ]},
        { type: 'tip', tipType: 'warning', content: '加成型硅胶对Pt毒化敏感，避免接触S、N、P等杂质。' }
      ]
    },
    'silicone-hightemp': {
      sections: [
        { type: 'text', content: '有机硅压敏胶的高温特性源于Si-O-Si主链的高键能和低活化能。' },
        { type: 'list', items: [
          'Si-O键能：452 kJ/mol（C-C为347 kJ/mol）',
          '连续使用温度：-60°C ~ +250°C',
          '短期耐温：可达300°C以上',
          '热失重起始温度：>300°C（TGA测试）'
        ]},
        { type: 'table', title: '高温应用举例', headers: ['应用', '使用温度', '要求'], rows: [
          ['烤漆遮蔽', '200°C/30min', '无残胶'],
          ['PCB高温标签', '260°C/10s', '回流焊'],
          ['散热界面', '150°C长期', '导热+绝缘']
        ]}
      ]
    },
    'uv-prepolymer': {
      sections: [
        { type: 'text', content: 'UV固化胶的预聚物决定了固化后的主体性能，常用类型包括：' },
        { type: 'table', title: '预聚物类型', headers: ['类型', '全称', '特点'], rows: [
          ['PUA', '聚氨酯丙烯酸酯', '柔韧、耐磨、附着力好'],
          ['EA', '环氧丙烯酸酯', '硬度高、耐化学'],
          ['PEA', '聚酯丙烯酸酯', '柔韧性好、光泽'],
          ['PETA', '季戊四醇三丙烯酸酯', '高交联、硬固化']
        ]},
        { type: 'tip', tipType: 'info', content: 'OCA光学胶多采用低官能度PUA，获得高柔韧和光学透明。' }
      ]
    },
    'uv-initiator': {
      sections: [
        { type: 'text', content: '光引发剂吸收UV光产生活性物种，引发聚合反应。' },
        { type: 'table', title: '光引发剂类型', headers: ['类型', '机理', '常用种类', '特点'], rows: [
          ['自由基Ⅰ型', 'α裂解', 'Irgacure 184/1173', '高效、通用'],
          ['自由基Ⅱ型', '夺氢', 'BP/ITX+胺', '表干好'],
          ['阳离子型', '光酸产生', '三芳基硫盐', '低收缩、耐水']
        ]},
        { type: 'formula', title: '引发剂用量', formula: 'C = 1-5% (相对于预聚物)', description: '用量过多会导致黄变和固化不均' }
      ]
    },
    'uv-cure': {
      sections: [
        { type: 'text', content: 'UV固化工艺的关键是能量剂量和穿透深度的平衡。' },
        { type: 'formula', title: '能量剂量计算', formula: 'E = I × t', description: '固化能量 = 光强 × 曝光时间', params: [
          { symbol: 'E', desc: '能量剂量 (mJ/cm²)' },
          { symbol: 'I', desc: '光强 (mW/cm²)' },
          { symbol: 't', desc: '曝光时间 (s)' }
        ]},
        { type: 'table', title: '典型固化参数', headers: ['胶层厚度', '能量剂量', '光强'], rows: [
          ['<50μm', '200-500 mJ/cm²', '100-200 mW/cm²'],
          ['50-100μm', '500-1000 mJ/cm²', '200-500 mW/cm²'],
          ['>100μm', '>1000 mJ/cm²', '分步固化']
        ]},
        { type: 'tip', tipType: 'warning', content: '厚膜固化需注意氧阻聚和深层固化问题，可采用氮气保护或分层固化。' }
      ]
    },
    'hmpsa-polymer': {
      sections: [
        { type: 'text', content: '热熔压敏胶的基础聚合物是苯乙烯嵌段共聚物，赋予胶弹性和强度。' },
        { type: 'table', title: '常用弹性体', headers: ['类型', '结构', '特点'], rows: [
          ['SIS', '苯乙烯-异戊二烯-苯乙烯', '透明、初粘好、不耐老化'],
          ['SBS', '苯乙烯-丁二烯-苯乙烯', '成本低、耐老化略差'],
          ['SEBS', 'SBS氢化物', '耐老化、耐热、UV稳定']
        ]},
        { type: 'tip', tipType: 'info', content: 'SEBS热熔胶用于高端医疗和卫生用品，但价格是SIS的2-3倍。' }
      ]
    },
    'hmpsa-tackifier': {
      sections: [
        { type: 'text', content: '增粘树脂与弹性体相容，提高初粘力和润湿能力。' },
        { type: 'table', title: '增粘树脂类型', headers: ['类型', '来源', '特点', '相容性'], rows: [
          ['C5石油树脂', '石脑油C5馏分', '浅色、相容性好', 'SIS中间段'],
          ['C9石油树脂', 'C9芳烃', '粘性强、颜色深', 'SIS末端'],
          ['萜烯树脂', '松节油', '天然、FDA级', '通用'],
          ['松香酯', '松香酯化', '初粘好', '乳液型']
        ]}
      ]
    },
    'hmpsa-formula': {
      sections: [
        { type: 'text', content: '热熔胶配方设计需平衡粘性、内聚力和加工性。' },
        { type: 'table', title: '典型配方结构', headers: ['组分', '用量', '作用'], rows: [
          ['弹性体', '25-40%', '骨架、弹性'],
          ['增粘树脂', '40-55%', '粘性、润湿'],
          ['增塑剂/油', '0-20%', '降粘度、柔软'],
          ['抗氧剂', '0.5-1%', '热稳定性']
        ]},
        { type: 'formula', title: '开放时间', formula: 't ∝ η × Tsp', description: '开放时间与粘度和树脂软化点相关' },
        { type: 'tip', tipType: 'info', content: '增粘树脂软化点越高，开放时间越短，内聚力越好。' }
      ]
    },
    'rubber-nr': {
      sections: [
        { type: 'text', content: '天然橡胶(NR)是最早的压敏胶基体，具有优异的粘着性能。' },
        { type: 'list', items: [
          '来源：橡胶树乳胶，聚异戊二烯结构',
          '塑炼：降低分子量，提高流动性和粘性',
          '配合：增粘树脂 + 软化剂 + 抗氧剂',
          '应用：美纹纸胶带、医用胶带、工业胶带'
        ]},
        { type: 'tip', tipType: 'warning', content: 'NR含蛋白质，可能引起过敏；双键结构易老化黄变。' }
      ]
    },
    'rubber-sr': {
      sections: [
        { type: 'text', content: '合成橡胶可针对性设计，克服天然橡胶的某些缺陷。' },
        { type: 'table', title: '合成橡胶类型', headers: ['类型', '全称', '特点', '应用'], rows: [
          ['SBR', '丁苯橡胶', '成本低、通用', '普通胶带'],
          ['CR', '氯丁橡胶', '耐油、阻燃', '电工胶带'],
          ['NBR', '丁腈橡胶', '耐油性优', '密封胶带'],
          ['BR', '顺丁橡胶', '低温性好', '冷库胶带']
        ]}
      ]
    },

    // --- New Details (Substrate & Interface) ---
    'sub-types': {
      sections: [
        { type: 'text', content: '基材不仅是载体，更是产品性能（光学、机械）的重要组成部分。' },
        { type: 'table', title: '常用基材特性对比', headers: ['基材', '全称', '耐温', '特点/应用'], rows: [
          ['PET', '聚对苯二甲酸乙二醇酯', '120°C', '透明、强韧、通用性强'],
          ['PI', '聚酰亚胺', '260°C', '黄金薄膜，耐高温绝缘'],
          ['BOPP', '双向拉伸聚丙烯', '100°C', '成本低，封箱胶带'],
          ['COP/CPI', '环烯烃聚合物', '140°C', '低双折射，折叠屏专用'],
          ['铜箔/铝箔', '金属箔', '300°C+', '锂电池集流体']
        ]},
        { type: 'tip', tipType: 'info', content: 'PET薄膜通常经过双向拉伸(BO-PET)，在纵向(MD)和横向(TD)的物理性能可能存在差异。' }
      ]
    },
    'sub-treatment': {
      sections: [
        { type: 'text', content: '基材表面处理是解决附着力不足、涂布缺陷的第一道工序。' },
        { type: 'table', title: '表面处理方式', headers: ['方式', '原理', '优缺点'], rows: [
          ['电晕 (Corona)', '高压放电产生极性基团', '成本低、在线处理 / 有时效性'],
          ['底涂 (Primer)', '涂布一层化学亲和层', '附着力极佳 / 增加工序'],
          ['火焰处理', '高温火焰轻扫表面', '适合异形件 / 安全风险'],
          ['化学刻蚀', '酸/碱腐蚀微孔', '物理锚定 / 环保压力']
        ]},
        { type: 'tip', tipType: 'warning', content: '电晕处理后的达因值会随时间衰减，建议在涂布前在线处理。' }
      ]
    },
    'sub-quality': {
      sections: [
        { type: 'text', content: '基材来料质量直接决定涂布这一环节的良率上限。' },
        { type: 'list', items: [
          '厚度公差：直接叠加到最终总厚度公差中。',
          '热收缩率：干燥时高温可能导致基材收缩、起皱（MD方向尤甚）。',
          '表面粗糙度(Ra)：影响涂层的平整度和光泽。',
          '接头质量：接头过厚会打坏模头，接头强度不足会断带。'
        ]}
      ]
    },
    'surf-wetting': {
      sections: [
        { type: 'text', content: '润湿是涂布的第一步。只有液体在固体表面良好铺展，才能形成均匀的涂层。' },
        { type: 'formula', title: '杨氏方程 (Young Equation)', formula: '\\gamma_{sv} = \\gamma_{sl} + \\gamma_{lv} \\cdot \\cos\\theta', description: '描述气-液-固三相界面的平衡关系', params: [
          { symbol: '\\theta', desc: '接触角 (Contact Angle)' },
          { symbol: '\\gamma_{sv}', desc: '固-气表面张力 (固体表面能)' },
          { symbol: '\\gamma_{lv}', desc: '液-气表面张力 (液体表面张力)' },
          { symbol: '\\gamma_{sl}', desc: '固-液界面张力' }
        ]},
        { type: 'table', title: '润湿判据', headers: ['接触角 θ', '润湿状态', '涂布结果'], rows: [
          ['θ < 0°', '完全润湿', '理想铺展'],
          ['θ < 90°', '润湿', '形成涂层'],
          ['θ > 90°', '不润湿', '缩孔、断液'],
          ['θ > 150°', '超疏水', '荷叶效应']
        ]}
      ]
    },
    'surf-energy': {
      sections: [
        { type: 'text', content: '表面能(固体)与表面张力(液体)的匹配是涂布成败的关键。' },
        { type: 'list', items: [
          '匹配原则：液体表面张力 < 固体表面能 (最好低 10 mN/m 以上)',
          '测试方法：达因笔 (Dyne Pen) 划痕测试 / 接触角测量仪',
          '典型值：水(72)、PET(42)、处理后PET(>50)、Teflon(18)'
        ]},
        { type: 'tip', tipType: 'info', content: '如果液体张力高于基材能，液体会自动收缩成球，无法成膜（缩孔）。' }
      ]
    },
    'surf-hsp': {
      sections: [
        { type: 'text', content: '汉森溶解度参数(HSP)用于预测溶剂对聚合物的溶解性及树脂间的相容性。' },
        { type: 'formula', title: 'HSP距离公式', formula: 'Ra^2 = 4(\\delta d_1 - \\delta d_2)^2 + (\\delta p_1 - \\delta p_2)^2 + (\\delta h_1 - \\delta h_2)^2', description: 'Ra越小，相容性越好', params: [
          { symbol: '\\delta d', desc: '色散力分量' },
          { symbol: '\\delta p', desc: '极性力分量' },
          { symbol: '\\delta h', desc: '氢键力分量' }
        ]},
        { type: 'tip', tipType: 'info', content: '传统的“相似相溶”原理的量化版。Ra < R0 (溶解半径) 时判定为可溶。' }
      ]
    }
  }
}
