/**
 * 测试与质量数据 (Quality & Testing) V6.5 Digital SOP
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
    // === 1. Fluid (V6.5 Localized) ===
    'fluid-viscosity': {
      sections: [
        { type: 'text', content: '粘度 (Viscosity) 是涂布工艺窗口的核心。需区分单点粘度(QC)与流变行为(研发)。' },
        // V6.5 Canvas Diagram
        { type: 'diagram', mode: 'viscosity', caption: 'Brookfield 旋转粘度计原理' },

        { type: 'standard-card', title: '粘度测试 SOP 参数', items: [
           { label: '温度控制', value: '25.0 ± 0.1 °C' },
           { label: '转子选择', value: '使扭矩保持在 10-90%' },
           { label: '转速设定', value: '需检查触变性 (如 10/100 rpm)' },
           { label: '测试容器', value: '标准烧杯 (避免壁效应)' }
        ]},

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

    // === 2. Substrate (V6.5 Localized & Canvas) ===
    'sub-thickness': {
      sections: [
        { type: 'text', content: '厚度 (Thickness) 均一性是精密涂布的基石。不同基材需选用对应的测量原理。' },
        {
          type: 'standard-card',
          title: 'ASTM D374 测厚标准',
          items: [
            { label: '千分尺法', value: '精度: 1μm (接触式)' },
            { label: 'LVDT法', value: '恒定压力: 50kPa' },
            { label: '光谱共焦', value: '精度: 0.01μm (非接触)' },
            { label: '统计要求', value: '报告: 平均值/极差/标准差' }
          ]
        },
        { type: 'table', title: '测量设备对比', headers: ['类型', '精度', '适用场景'], rows: [
          ['千分尺', '1 μm', '硬基材 (PET/Glass)'],
          ['LVDT', '0.1 μm', '软薄膜 (需恒定压力)'],
          ['光谱共焦', '0.01 μm', '在线检测 / 液膜']
        ]}
      ]
    },
    'sub-release': {
      sections: [
        { type: 'text', content: '离型力 (Release Force) 决定了模切排废和客户端解卷的顺畅度。' },
        // V6.5 Canvas Diagram
        { type: 'diagram', mode: 'release', caption: '高速离型力测试 (FTM 3/10)' },

        {
          type: 'standard-card',
          title: 'FTM 3 / FTM 10 标准参数',
          items: [
            { label: '测试胶带', value: 'TESA 7475 (标准测试胶带)' },
            { label: '低速剥离', value: '0.3 m/min (人工手感模拟)' },
            { label: '高速剥离', value: '10-300 m/min (自动化模拟)' },
            { label: '剥离角度', value: '180° (水平剥离)' }
          ]
        },

        { type: 'text', content: '**常见分级标准 (g/25mm)**：' },
        { type: 'list', items: [
          '超轻离型 (Ultra-light): 1-3 g',
          '轻离型 (Light): 3-5 g',
          '中离型 (Medium): 10-15 g',
          '重离型 (Heavy): 30-50 g'
        ]},
        {
          type: 'analysis-block',
          title: '失效模式分析 (Failure Analysis)',
          items: [
             { mode: 'Lock-up', desc: '锁死断裂: 离型力过大导致基材拉断。' },
             { mode: 'Zipping', desc: '拉链声: 涂布不均或固化不全导致的震荡。' },
             { mode: 'Rub-off', desc: '掉硅: 硅油层附着力差，从基材脱落。' }
          ]
        }
      ]
    },
    'sub-sas': {
      sections: [
        { type: 'text', content: 'SAS (残余粘着率) 用于评价离型膜硅油固化程度及转移情况。' },
        {
           type: 'standard-card',
           title: 'FTM 11 测试参数',
           items: [
             { label: '步骤 1', value: '胶带贴合离型膜 (70°C/20h)' },
             { label: '步骤 2', value: '撕下胶带，测试对钢板剥离力' },
             { label: '对照组', value: '未经贴合的空白胶带剥离力' },
             { label: '计算公式', value: 'SAS% = 测试组 / 对照组' }
           ]
        },
        { type: 'formula', title: 'SAS 计算', formula: "SAS% = \\frac{F_{tested}}{F_{initial}} \\times 100%", description: '越接近100%越好', params: [
          { symbol: 'F_{tested}', desc: '接触离型膜后的剥离力' },
          { symbol: 'F_{initial}', desc: '原始胶带剥离力' }
        ]},
        { type: 'tip', tipType: 'warning', content: 'SAS < 85% 通常意味着硅油转移严重，会导致下游产品这一面“甚至粘不住”。' }
      ]
    },
    'sub-dyne': {
      sections: [
         { type: 'text', content: '表面能测试用于确认基材是否经过电晕处理(Corona)，确保涂布液能铺展。' },
         {
           type: 'standard-card',
           title: '表面能测试 SOP',
           items: [
             { label: '达因笔法', value: 'ASTM D2578 (快速检测)' },
             { label: '接触角法', value: 'ASTM D7490 (实验室级)' },
             { label: '判定标准', value: '液体收缩时间 > 2秒' },
             { label: '目标值', value: '> 38-42 dyne (适合涂布)' }
           ]
         }
      ]
    },

    // === 3. PSA (V6.5 Localized & Canvas) ===
    'psa-peel': {
      sections: [
        { type: 'text', content: '剥离强度 (Peel Strength) 是衡量压敏胶粘性最核心的指标，代表破坏粘接界面所需的单位力。' },
        // V6.5 Canvas Diagram
        { type: 'diagram', mode: 'peel-180', caption: 'ASTM D3330 Method A: 180° 剥离测试' },
        // V6.5 Localized Card
        {
          type: 'standard-card',
          title: 'ASTM D3330 关键参数',
          items: [
            { label: '制样宽度', value: '24 mm (标准宽度)' },
            { label: '剥离速度', value: '300 mm/min ± 30' },
            { label: '压滚负载', value: '2040 g (4.5 lb)' },
            { label: '压滚速度', value: '10 mm/s (无气泡)' },
            { label: '停放时间', value: '1 min (初粘) / 20 min (标准)' }
          ]
        },
        { type: 'formula', title: '结果计算', formula: Formulas.PEEL_STRENGTH, description: '取中间80%数据的平均值', params: [
           { symbol: 'F_{peel}', desc: '剥离强度 (N/25mm)' },
           { symbol: 'F_{avg}', desc: '有效行程平均力值 (N)' },
           { symbol: 'Width', desc: '测试条宽度 (mm)' }
        ]},
        // V6.5 Localized Analysis
        {
          type: 'analysis-block',
          title: '失效模式判定 (Failure Modes)',
          items: [
             { mode: 'AF (界面破坏)', desc: '正常模式: 胶带从被贴面干净剥离，无残胶。' },
             { mode: 'CF (内聚破坏)', desc: '异常模式: 胶层内部撕裂，被贴面和背材均有胶。原因：固化不全或分子量太低。' },
             { mode: 'ATB (脱胶)', desc: '异常模式: 胶层全部留在被贴面上。原因：底涂剂(Primer)失效。' }
          ]
        }
      ]
    },
    'psa-tack': {
      sections: [
        { type: 'text', content: '初粘力 (Tack) 指胶面与被粘物以极轻压力瞬间接触后抵抗分离的能力。' },
        { type: 'diagram', mode: 'tack-loop', caption: 'PSTC-16: 环形初粘力测试 (Loop Tack)' },
        {
          type: 'standard-card',
          title: 'Loop Tack 测试参数',
          items: [
            { label: '环形长度', value: '150 mm' },
            { label: '接触面积', value: '25 mm x 25 mm' },
            { label: '测试速度', value: '300 mm/min' },
            { label: '接触时间', value: '< 3 seconds (瞬间接触)' }
          ]
        },
        { type: 'tip', tipType: 'info', content: 'Loop Tack 能更好地反映自动化贴标机的抓取性能，比滚球法(Rolling Ball)更具指导意义。' },
         {
          type: 'analysis-block',
          title: '判定标准',
          items: [
             { mode: '高初粘', desc: '峰值力 > 10 N/25mm (难以重贴)' },
             { mode: '低初粘', desc: '峰值力 < 2 N/25mm (排气性好)' },
             { mode: '震荡(Slip Stick)', desc: '曲线呈现锯齿状: 发生了粘-滑现象' }
          ]
        }
      ]
    },
    'psa-shear': {
      sections: [
        { type: 'text', content: '剪切保持力 (Holding Power) 反映胶体的内聚强度 (Cohesion) 和耐蠕变性。' },
        { type: 'diagram', mode: 'shear-static', caption: 'ASTM D3654: 静态剪切测试' },
        {
          type: 'standard-card',
          title: '静态剪切 (Static Shear) 参数',
          items: [
            { label: '负载重量', value: '1000 g (标准)' },
            { label: '接触面积', value: '25 mm x 25 mm' },
            { label: '倾斜角度', value: '2° (防止剥离分力)' },
            { label: '测试钢板', value: '不锈钢 (抛光处理)' }
          ]
        },
        {
            type: 'standard-card',
            title: 'SAFT (剪切失效温度)',
            items: [
                { label: '起始温度', value: '40 °C' },
                { label: '升温速率', value: '1 °C/min' },
                { label: '失效判定', value: '记录砝码滑落时的温度' }
            ]
        },
        { type: 'tip', tipType: 'warning', content: '高内聚胶水剪切时间应 > 10,000 min (7天不滑落)。若发生滑落，必须记录是CF还是AF模式。' }
      ]
    },

    // === 4. Coating Phys (V6.5 Localized) ===
    'phys-hardness': {
      sections: [
        { type: 'text', content: '铅笔硬度 (Pencil Hardness) 是评价 Hard Coat (HC) 涂层表面抗刮伤能力的标准方法。' },
        {
          type: 'standard-card',
          title: 'ASTM D3363 测试参数',
          items: [
            { label: '标准铅笔', value: 'Mitsubishi Uni (三菱)' },
            { label: '负载', value: '750g (通用) / 1000g (日系)' },
            { label: '测试角度', value: '45° (使用小推车固定)' },
            { label: '判定', value: '未划破涂层的最硬铅笔号' }
          ]
        },
        { type: 'text', content: '等级排序：9H(最硬) ... H, F, HB ... 6B(最软)。常见HC膜要求 2H-3H。' }
      ]
    },
    'phys-adhesion': {
      sections: [
        { type: 'text', content: '百格测试 (Cross-Cut) 评价涂层与基材的结合牢度。' },
        {
          type: 'standard-card',
          title: 'ASTM D3359 Method B',
          items: [
            { label: '刀具选择', value: '1mm间距 x 11刃 (硬基材)' },
            { label: '测试胶带', value: '3M 600 或 3M 610 (关键)' },
            { label: '撕拉操作', value: '180°反向迅速撕下' },
            { label: '观察', value: '使用放大镜 + 光源' }
          ]
        },
        { type: 'table', title: '等级判定', headers: ['等级', '脱落情况', '合格判定'], rows: [
          ['5B', '切口边缘完全光滑，无脱落', '优秀'],
          ['4B', '交叉点微小脱落 (<5%)', '合格'],
          ['3B', '脱落面积 5-15%', '不合格 (通常)'],
          ['0B', '脱落面积 > 65%', '严重失效']
        ]}
      ]
    },
    'phys-abrasion': {
      sections: [
        { type: 'text', content: '耐磨测试评价功能涂层（如AF防指纹、疏水层）的耐久性。' },
        {
           type: 'standard-card',
           title: '钢丝绒耐磨 SOP',
           items: [
             { label: '磨料', value: '#0000 号钢丝绒' },
             { label: '负载', value: '1000 g / 1 cm² 磨头' },
             { label: '速率', value: '40-60 次/分钟' },
             { label: '失效点', value: '水接触角 < 100°' }
           ]
        },
        {
           type: 'standard-card',
           title: 'RCA 纸带耐磨 (ASTM F2357)',
           items: [
             { label: '负载', value: '175g (标准) / 275g' },
             { label: '检查频率', value: '每 50-100 次停机检查' },
             { label: '失效', value: '基材裸露 (Substrate Exposure)' }
           ]
        }
      ]
    },

    // === 5. Polymer Phys (V6.5 Localized) ===
    'phys-dma': {
      sections: [
        { type: 'text', content: 'DMA (动态热机械分析) 是高分子物理研究的“透视眼”。' },
        {
          type: 'standard-card',
          title: 'DMA 设置参数 (PSA)',
          items: [
            { label: '模式', value: '剪切三明治 (Shear Sandwich)' },
            { label: '频率', value: '1 Hz (标准) / 10 Hz' },
            { label: '应变', value: '0.1% (线性粘弹区)' },
            { label: '升温程序', value: '3 °C/min (-50 到 150°C)' }
          ]
        },
        { type: 'formula', title: '储能模量', formula: Formulas.STORAGE_MODULUS, description: '弹性部分，代表能量储存' },
        { type: 'formula', title: '损耗模量', formula: Formulas.LOSS_MODULUS, description: '粘性部分，代表能量耗散' },
        { type: 'formula', title: '损耗因子', formula: Formulas.TAN_DELTA, description: 'Tanδ峰值温度常被定义为 Tg' }
      ]
    },
    'phys-tts': {
      sections: [
        { type: 'text', content: '时温等效 (TTS) 利用高温短时数据预测低温长期性能。' },
        {
           type: 'standard-card',
           title: 'WLF 方程参数',
           items: [
             { label: '参考温度 (Tr)', value: '通常取 Tg' },
             { label: '通用常数 C1', value: '17.44' },
             { label: '通用常数 C2', value: '51.6 K' },
             { label: '移位因子 aT', value: '高温时 log(aT) < 0' }
           ]
        },
        { type: 'formula', title: 'WLF 方程', formula: Formulas.WLF_EQUATION, params: [
           { symbol: 'a_T', desc: '移位因子 (Shift Factor)' },
           { symbol: 'C_1', desc: '经验常数' },
           { symbol: 'C_2', desc: '经验常数' },
           { symbol: 'T', desc: '测试温度 (K)' },
           { symbol: 'T_r', desc: '参考温度 (K)' }
        ]}
      ]
    },
    'phys-gel': {
      sections: [
        { type: 'text', content: '凝胶分率 (Gel Fraction) 表征聚合物网络的交联致密程度。' },
        {
          type: 'standard-card',
          title: '凝胶测试 SOP',
          items: [
            { label: '溶剂', value: '甲苯 或 乙酸乙酯' },
            { label: '过滤', value: '200目 不锈钢网' },
            { label: '浸泡时间', value: '24小时 @ 室温' },
            { label: '干燥', value: '120°C 烘烤 1小时' }
           ]
        },
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

    // === 6. Optical (V6.5 Localized) ===
    'opt-trans': {
      sections: [
        { type: 'text', content: '透光率和雾度 (Haze) 是OCA光学胶的关键指标。' },
        {
          type: 'standard-card',
          title: 'ASTM D1003 参数',
          items: [
            { label: '光源', value: 'C光源 或 D65光源' },
            { label: '观察角', value: '2度 (2 Degree)' },
            { label: '制样', value: '贴合在玻璃上 (Film on Glass)' },
            { label: '参比', value: '空气 或 空白玻璃' }
          ]
        },
        { type: 'formula', title: '雾度计算', formula: Formulas.HAZE_CALC, description: '散射光比例', params: [
           { symbol: 'T_{diffuse}', desc: '散射光透射率 (>2.5°)' },
           { symbol: 'T_{total}', desc: '总透射率' }
        ]}
      ]
    },
    'opt-yi': {
      sections: [
        { type: 'text', content: '黄度指数 (YI - Yellowness Index) 评价材料的“泛黄”程度。' },
        { type: 'standard-card', title: 'ASTM E313 参数', items: [
             { label: '标准', value: 'ASTM E313-20' },
             { label: '几何结构', value: 'd/8 (积分球)' },
             { label: 'UV分量', value: '包含UV / 排除UV' },
             { label: '合格判据', value: 'ΔYI < 1.0 (通常)' }
        ]},
        { type: 'formula', title: 'YI E313', formula: Formulas.YI_CALC, description: '基于CIE三刺激值', params: [
          { symbol: 'X, Y, Z', desc: 'CIE 三刺激值' }
        ]}
      ]
    },
    'opt-gloss': {
       sections: [
         { type: 'text', content: '光泽度 (Gloss) 评价表面的镜面反射能力 (ASTM D523)。' },
         { type: 'standard-card', title: '角度选择建议', items: [
           { label: '20°角', value: '高光泽 (>70 GU)' },
           { label: '60°角', value: '中光泽 (10-70 GU)' },
           { label: '85°角', value: '低光泽/哑光 (<10 GU)' }
         ]},
         { type: 'list', items: [
           '高光泽：60°角测试值 > 70GU (如钢琴黑)',
           '哑光 (Matte)：< 10GU (如AG防眩光膜)'
         ]}
       ]
    },

    // === 7. Reliability (V6.5 Localized) ===
    'rel-env': {
      sections: [
        { type: 'text', content: '环境老化测试用于模拟产品在极端气候下的可靠性。' },
        {
          type: 'standard-card',
          title: '常用信赖性条件',
          items: [
            { label: '双85 (Double 85)', value: '85°C / 85% RH / 1000h' },
            { label: '冷热冲击', value: '-40°C (30min) ↔ 85°C (30min)' },
            { label: '高温高湿', value: '60°C / 90% RH (消费电子常见)' },
            { label: '低温存储', value: '-40°C / 1000h' }
          ]
        },
        {
           type: 'analysis-block',
           title: '常见老化失效',
           items: [
              { mode: 'Delamination', desc: '分层/起泡: 湿气侵入或应力失配' },
              { mode: 'Whitening', desc: '白化/发雾: 聚合物吸水微相分离' },
              { mode: 'Yellowing', desc: '黄变: 氧化或UV降解' }
           ]
        }
      ]
    },
    'rel-weather': {
      sections: [
        { type: 'text', content: '耐候性测试 (QUV/Xenon) 模拟阳光照射导致的老化。' },
        {
          type: 'standard-card',
          title: 'ASTM G154 (QUV) SOP',
          items: [
            { label: '灯管', value: 'UVA-340 (模拟户外阳光)' },
            { label: '辐照度', value: '0.89 W/m² @ 340nm' },
            { label: '循环条件', value: '8h UV @60°C / 4h 冷凝 @50°C' },
            { label: '测试时长', value: '500h / 1000h' }
          ]
        }
      ]
    },
    'rel-pct': {
      sections: [
        { type: 'text', content: 'PCT (Pressure Cooker Test) 高压蒸煮测试，极端苛刻的湿热老化。' },
        {
          type: 'standard-card',
          title: 'JEDEC JESD22-A102 参数',
          items: [
            { label: '温度', value: '121 °C' },
            { label: '湿度', value: '100% RH' },
            { label: '压力', value: '2 atm (205 kPa)' },
            { label: '时长', value: '96 hrs (典型值)' }
          ]
        },
        { type: 'tip', tipType: 'warning', content: 'PCT 是破坏性极强的测试，通常用于评估材料的耐水解性能极限。' }
      ]
    }
  }
};
