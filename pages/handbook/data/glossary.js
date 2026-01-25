/**
 * 涂布工程师名词库 - V3.0 (Structured Engineering Edition)
 * 结构升级：定义 + 工程意义(Impact) + 关键管控(Control) + 深度链接(Link)
 */
module.exports = {
  categories: [
    {
      id: 'basics',
      title: '基础概念',
      icon: '🔰',
      items: [
        {
          id: 'b01',
          term: '涂布 (Coating)',
          definition: '将流体覆盖在基材表面的工艺过程。',
          impact: '决定产品的最终功能层结构。任何微小的厚度波动都可能导致电池容量不一致或光学膜视觉缺陷。',
          control: '厚度均匀性(MD/TD)、面密度一致性、缺陷率。',
          detail: '核心目的是赋予基材新的功能（如隔膜涂胶、极片涂敷）。关键在于控制厚度均匀性。',
          related: ['流体', '基材', '涂布窗口']
        },
        {
          id: 'b02',
          term: '基材 (Substrate)',
          definition: '被涂布流体覆盖的固体载体。',
          impact: '基材表面能决定润湿成败；基材厚度均匀性直接遗传给最终涂层；接头质量影响连续生产。',
          control: '表面张力(达因值)、厚度偏差、静电消除、边缘平整度。',
          related: ['表面能', '润湿', '电晕'],
          moduleLink: { id: 'materials', title: '基材科学', anchor: 'substrate' }
        },
        {
          id: 'b02a',
          term: '离型膜 (Release Film)',
          english: 'Release Liner / Release Film',
          definition: '表面涂覆有低表面能离型剂（如硅油）的薄膜，用于保护胶面或作为涂布载体。',
          impact: '胶带/保护膜生产的必需品。离型力是核心指标，过轻导致转移（胶粘到离型膜），过重导致剥离破坏或张力波动。',
          control: '离型力控制（轻/中/重离型）、残余接着力、硅油迁移量（硅转移）。',
          related: ['剥离力', '表面张力', '硅油'],
          moduleLink: { id: 'materials', title: '基材科学', anchor: 'substrate' }
        },
        {
          id: 'b03',
          term: '涂层 (Layer)',
          definition: '涂布形成的膜层结构。',
          impact: '涂层是产品的灵魂。其微观结构（孔隙率、颗粒分布）直接决定电化学性能或光学性能。',
          control: '干膜厚度、附着力、表面粗糙度、无缺陷。',
          related: ['干膜厚度', '附着力', '内聚力']
        },
        {
          id: 'b04',
          term: '附着力 (Adhesion)',
          definition: '涂层与基材之间的界面结合力。',
          impact: '致命指标。附着力不足会导致极片分层（电池失效）、保护膜残胶或脱落。',
          control: '基材清洗、电晕处理、底涂(Primer)使用、干燥温度控制。',
          related: ['剥离力', '电晕'],
          moduleLink: { id: 'testing', title: '粘着性能测试', anchor: 'adhesion' }
        },
        {
          id: 'b05',
          term: '内聚力 (Cohesion)',
          definition: '涂层材料内部分子间的相互作用力。',
          impact: '决定涂层自身的机械强度。内聚力过低会导致胶层内部断裂（内聚破坏），如胶带撕除后残留。',
          control: '交联密度（固化剂比例）、分子量设计、干燥程度。',
          related: ['保持力', '干燥', '交联剂'],
          moduleLink: { id: 'testing', title: '粘着性能测试', anchor: 'adhesion' }
        },
        {
          id: 'b06',
          term: '界面 (Interface)',
          definition: '两相物质接触的边界层。',
          impact: '涂布就是在操纵界面。气-液界面决定流平，液-固界面决定润湿和附着。',
          control: '界面张力匹配、界面清洁度、消除界面气泡。',
          related: ['表面张力', '润湿', '马兰戈尼效应']
        },
        {
          id: 'b07',
          term: '润湿 (Wetting)',
          definition: '液体在固体表面铺展的能力。',
          impact: '涂布的第一步。润湿不良直接导致缩孔、漏涂、厚边等缺陷。',
          control: '确保液体表面张力 < 固体表面能（通常差值>10mN/m为佳）。',
          related: ['接触角', '表面张力', '缩孔'],
          moduleLink: { id: 'materials', title: '界面与润湿', anchor: 'interface' }
        },
        {
          id: 'b08',
          term: '流平 (Leveling)',
          definition: '湿涂层在表面张力驱动下消除表面不平整的过程。',
          impact: '决定最终涂层的平整度和光泽度。流平不足导致橘皮、刷痕。',
          control: '流平时间、低剪切粘度、溶剂挥发速率、表面张力控制。',
          related: ['橘皮', '粘度', '表面张力'],
          moduleLink: { id: 'troubleshoot', title: '缺陷诊断-外观', anchor: 'appearance' }
        },
        {
          id: 'b09',
          term: '固化 (Curing)',
          definition: '液体涂层通过物理挥发或化学反应转变为固体的过程。',
          impact: '锁定涂层结构的最后一步。固化不完全会导致发粘、耐性差；固化过快可能导致应力开裂。',
          control: '能量输入（热/UV）、引发剂含量、氧阻聚控制。',
          related: ['干燥', '交联剂', 'Tg']
        },
        {
          id: 'b10',
          term: '涂布窗口 (Coating Window)',
          definition: '能够获得均匀、无缺陷涂层的工艺参数操作范围。',
          impact: '工艺稳定性的核心。窗口越宽，生产越容易抗干扰。超出窗口必定产生缺陷（起泡、断液）。',
          control: '毛细数(Ca)、间隙比(G/H)、真空度、流变特性优化。',
          related: ['毛细数', '空气夹带', '狭缝模头'],
          moduleLink: { id: 'coating-theory', title: '狭缝涂布理论', anchor: 'slot-die' }
        }
      ]
    },
    {
      id: 'rheology',
      title: '流体与理论',
      icon: '📖',
      items: [
        {
          id: 'r01',
          term: '粘度 (Viscosity)',
          definition: '流体内部阻碍流动的摩擦特性。',
          impact: '涂布窗口的决定性参数。粘度过高导致供液压力过大或流平差；粘度过低引起湍流或边缘流淌。',
          control: '温度控制（±0.5℃）、固含量波动、在线粘度监测。',
          related: ['剪切变稀', '触变性'],
          moduleLink: { id: 'testing', title: '流变分析', anchor: 'rheology' }
        },
        {
          id: 'r02',
          term: '剪切变稀 (Shear Thinning)',
          definition: '粘度随剪切速率增加而降低的非牛顿流体特性。',
          impact: '涂布工艺的福音。高剪切（模头内）低粘度利于涂布；低剪切（上辊后）高粘度防止流挂。',
          control: '配方设计时调节高低剪切粘度比。',
          related: ['粘度', '触变性']
        },
        {
          id: 'r03',
          term: '触变性 (Thixotropy)',
          definition: '粘度的时间依赖性：剪切下变稀，静止后粘度逐渐恢复。',
          impact: '影响流平与流挂的平衡。触变性过大，恢复慢，容易流平但也易流挂；触变性过小，流平纹难以消除。',
          control: '触变剂（如气硅）添加量。',
          related: ['粘度', '流平', '流挂']
        },
        {
          id: 'r04',
          term: '屈服应力 (Yield Stress)',
          definition: '流体发生流动所需的最小外部应力。',
          impact: '决定颗粒悬浮稳定性。有屈服值可防止沉降，但过高会导致流平困难（表面留痕）。',
          control: '分散剂与增稠剂平衡。',
          related: ['流平', '悬浮']
        },
        {
          id: 'r05',
          term: '表面张力 (Surface Tension)',
          definition: '液体表面分子企图缩小表面积的收缩力。',
          impact: '流平的动力，也是缺陷的根源。高张力利于流平，但易导致缩孔；低张力利于润湿，但易爬边。',
          control: '润湿剂/流平剂添加，溶剂选择。',
          related: ['润湿', '接触角', '缩孔']
        },
        {
          id: 'r06',
          term: '毛细数 (Ca)',
          definition: '粘性力与表面张力的比值 (Ca = μV/σ)。',
          impact: '衡量高速涂布稳定性的核心无量纲数。Ca过大（速度快/粘度高）会导致严重的空气夹带。',
          control: '通过降低粘度或提高表面张力来允许更高的涂布速度。',
          related: ['空气夹带', '涂布窗口'],
          moduleLink: { id: 'coating-theory', title: '狭缝涂布理论', anchor: 'slot-die' }
        },
        {
          id: 'r07',
          term: '粘弹性 (Viscoelasticity)',
          definition: '材料同时表现出粘性流动和弹性记忆的特性。',
          impact: '高分子的典型特征。弹性效应会导致Weissenberg爬杆效应、挤出胀大，影响模头出料稳定性。',
          control: '聚合物分子量分布、德雷数(De)控制。',
          related: ['模量', '德雷数']
        },
        {
          id: 'r08',
          term: '雷诺数 (Re)',
          definition: '惯性力与粘性力的比值。',
          impact: '判断流体是层流还是湍流。涂布通常要求在层流区操作，避免湍流引起微观不均。',
          control: '模腔流道设计，避免死角和急剧变径。',
          related: ['层流', '湍流']
        },
        {
          id: 'r09',
          term: '马兰戈尼效应 (Marangoni)',
          definition: '表面张力梯度驱动的流体流动现象。',
          impact: '干燥过程中最主要的扰动源。溶剂挥发不均造成张力差，引发对流，形成贝纳德涡（橘皮）。',
          control: '慢干溶剂平衡，降低风速，添加表面活性剂。',
          related: ['橘皮', '干燥', '厚边']
        },
        {
          id: 'r10',
          term: 'Zeta电位',
          definition: '胶体颗粒剪切面的电位差。',
          impact: '衡量浆料分散稳定性的指标。绝对值>30mV通常视为稳定，否则颗粒易团聚沉降。',
          control: 'pH值调节，分散剂类型选择。',
          related: ['分散', '团聚']
        },
        {
          id: 'r11',
          term: '韦伯数 (We)',
          definition: '惯性力与表面张力的比值。',
          impact: '涉及高速喷涂、液滴破碎雾化的关键参数。',
          control: '喷嘴压力、孔径。',
          related: ['喷涂', '表面张力']
        },
        {
          id: 'r12',
          term: '德雷数 (De)',
          definition: '材料松弛时间与流动时间尺度的比值。',
          impact: '表征粘弹性效应的强弱。De>>1时表现出明显的弹性固体行为，涂布易出现裂纹或不稳定。',
          control: '降低涂布速度，降低高分子松弛时间。',
          related: ['粘弹性', '松弛时间']
        }
      ]
    },
    {
      id: 'materials',
      title: '材料体系',
      icon: '⚗️',
      items: [
        {
          id: 'm01',
          term: '粘结剂 (Binder)',
          definition: '提供涂层内聚力和对基材附着力的聚合物树脂。',
          impact: '涂层性能的基石。决定机械强度、耐温性、化学稳定性。',
          control: '分子量大小、官能团类型、玻璃化温度(Tg)。',
          related: ['内聚力', '附着力']
        },
        {
          id: 'm02',
          term: '溶剂 (Solvent)',
          definition: '用于分散或溶解树脂的挥发性载体。',
          impact: '决定浆料粘度、润湿性及干燥速度。溶剂残留是VOC来源，且影响安全（LEL）。',
          control: '溶解参数(HSP)匹配、挥发速率搭配（真溶剂/助溶剂/稀释剂）。',
          related: ['溶解度参数', '干燥', 'LEL']
        },
        {
          id: 'm03',
          term: '分散剂 (Dispersant)',
          definition: '吸附在颗粒表面防止团聚的表面活性剂。',
          impact: '决定浆料细度和稳定性。分散不好会导致涂层颗粒感、光泽度低、甚至划伤模头。',
          control: '锚定基团匹配、最佳添加量测试（粘度曲线法）。',
          related: ['Zeta电位', '粘度', '团聚']
        },
        {
          id: 'm04',
          term: '润湿剂 (Wetting Agent)',
          definition: '显著降低流体表面张力的助剂。',
          impact: '解决缩孔问题的特效药。但过量使用会引起泡沫问题或层间附着力下降。',
          control: '动态表面张力、泡沫高度。',
          related: ['表面张力', '缩孔', '消泡剂']
        },
        {
          id: 'm05',
          term: '交联剂 (Crosslinker)',
          definition: '连接线性分子链形成网状立体结构的化学物质。',
          impact: '将“粘性液体”变为“弹性固体”的关键。提高耐热、耐溶剂、内聚力。',
          control: '交联程度（凝胶分率）、适用期(Pot life)管理。',
          related: ['固化', '交联度', '内聚力']
        },
        {
          id: 'm06',
          term: '颜填料 (Pigment)',
          definition: '赋予涂层特定功能（颜色、导电、补强）的固体颗粒。',
          impact: '功能实现的核心。填料的粒径分布(D50/D90)直接限制最小涂布厚度。',
          control: '细度、分散稳定性、吸油量。',
          related: ['固含量', '细度', 'PVC']
        },
        {
          id: 'm07',
          term: 'Tg (玻化温度)',
          definition: '高分子从坚硬玻璃态转变为柔性橡胶态的临界温度。',
          impact: '决定材料的使用温区和加工性能。PSA压敏胶通常Tg < -20℃以保持室温粘性。',
          control: '单体配比（软硬单体调节）。',
          related: ['DMA', '初粘力'],
          moduleLink: { id: 'materials', title: '胶黏剂-Tg调控', anchor: 'acrylic' }
        },
        {
          id: 'm08',
          term: '固含量 (Solid Content)',
          definition: '涂料中非挥发份的质量百分比。',
          impact: '直接影响生产效率和成本。固含量越高，溶剂越少，干燥能耗越低，但往往伴随高粘度挑战。',
          control: '精确配料、在线监测（密度法）。',
          related: ['涂布量', '干燥']
        },
        {
          id: 'm09',
          term: 'PVC (颜料体积浓度)',
          definition: '颜填料体积占干膜总体积的比例。',
          impact: 'CPVC（临界体积浓度）是性能突变点。超过CPVC，树脂无法完全包裹颗粒，导致光泽下降、渗透性增加。',
          control: '配方设计需避开CPVC附近的敏感区。',
          related: ['颜填料', '孔隙率']
        },
        {
          id: 'm10',
          term: 'HSP (溶解参数)',
          definition: '汉森溶解度参数，预测溶剂对聚合物的溶解能力。',
          impact: '“相似相溶”的量化指标。参数不匹配会导致树脂析出、凝胶或溶液浑浊。',
          control: '计算混合溶剂的综合HSP值位于聚合物溶解球内。',
          related: ['溶剂', '相容性']
        },
        {
          id: 'm11',
          term: '触变剂',
          definition: '赋予体系剪切变稀和触变性的流变改性剂。',
          impact: '防止沉降和流挂的关键。如气相二氧化硅、有机膨润土。',
          control: '活化过程（剪切分散）、添加量。',
          related: ['触变性', '流挂']
        },
        {
          id: 'm12',
          term: '消泡剂',
          definition: '破坏液膜稳定性以抑制或消除气泡的助剂。',
          impact: '消除针孔缺陷。但需注意与体系的相容性，不相容会导致缩孔（油点）。',
          control: '破泡能力 vs 相容性平衡。',
          related: ['针孔', '气泡', '缩孔']
        }
      ]
    },
    {
      id: 'equipment',
      title: '设备与硬件',
      icon: '🔧',
      items: [
        {
          id: 'e01',
          term: '狭缝模头 (Slot Die)',
          definition: '利用高精度狭缝将流体挤出并涂布的模具。',
          impact: '精密涂布的心脏。封闭式供液，不受粘度、速度波动影响，精度可达±1%。',
          control: '唇口平直度(<2μm)、垫片厚度均匀性、背压调节。',
          related: ['垫片', '涂布量'],
          moduleLink: { id: 'equipment', title: '涂布模头', anchor: 'coating-head' }
        },
        {
          id: 'e02',
          term: '微凹辊 (Micro Gravure)',
          definition: '小直径(<50mm)逆向旋转的凹版涂布辊。',
          impact: '薄膜涂布首选。接触面积小，对超薄基材（如2μm PET）张力影响小，且无背辊，避免背印。',
          control: '速比、接触弧度、微凹辊动平衡。',
          related: ['凹版', '逆向涂布'],
          moduleLink: { id: 'coating-theory', title: '微凹涂布', anchor: 'micro-gravure' }
        },
        {
          id: 'e03',
          term: '逗号刮刀 (Comma Roll)',
          definition: '截面呈逗号状的计量刮刀辊。',
          impact: '高粘度厚涂层利器。无刀口磨损问题，适合涂胶带、光学保护膜。',
          control: '刀口间隙、背辊跳动、左右水平度。',
          related: ['刮刀', '涂布量'],
          moduleLink: { id: 'coating-theory', title: '逗号刮刀涂布', anchor: 'comma' }
        },
        {
          id: 'e04',
          term: '计量泵 (Metering Pump)',
          definition: '提供精密稳定流量的输送设备（通常为齿轮泵或螺杆泵）。',
          impact: '决定纵向涂布精度的源头。泵的脉动直接导致纵向条纹。',
          control: '容积效率、脉动率(<1%)、入口压力。',
          related: ['脉动', '涂布量'],
          moduleLink: { id: 'equipment', title: '供料系统', anchor: 'feeding' }
        },
        {
          id: 'e05',
          term: '真空箱 (Vacuum Box)',
          definition: '安装在模头唇口下方的负压抽气装置。',
          impact: '高速狭缝涂布的必需品。通过负压稳定上游弯液面(Meniscus)，防止空气夹带，拓宽涂布窗口。',
          control: '真空度稳定性(±50Pa)、密封性。',
          related: ['空气夹带', '涂布窗口'],
          moduleLink: { id: 'equipment', title: '涂布模头', anchor: 'coating-head' }
        },
        {
          id: 'e06',
          term: '漂浮烘箱 (Flotation Oven)',
          definition: '利用上下喷嘴气流将基材悬浮托起的干燥设备。',
          impact: '实现双面涂布或防划伤的关键。传热效率高，基材无接触。',
          control: '风嘴风速均匀性（防止飘带）、张力匹配。',
          related: ['干燥', '划伤'],
          moduleLink: { id: 'equipment', title: '干燥系统', anchor: 'drying-sys' }
        },
        {
          id: 'e07',
          term: '电晕 (Corona)',
          definition: '利用高频高压放电对基材表面进行极化处理的装置。',
          impact: '解决附着力问题的首选手段。提高表面能（达因值），引入极性基团。',
          control: '功率密度(W·min/m²)、达因值检测。',
          related: ['表面能', '附着力'],
          moduleLink: { id: 'materials', title: '基材表面处理', anchor: 'substrate' }
        },
        {
          id: 'e08',
          term: '纠偏 (Web Guiding)',
          definition: '检测并校正卷材边缘位置的自动控制系统。',
          impact: '不仅影响收卷整齐度，更重要的是防止跑偏导致模头漏料或烘箱挂壁。',
          control: '传感器灵敏度、执行机构响应速度。',
          related: ['收卷', '端面'],
          moduleLink: { id: 'equipment', title: '辅助与控制', anchor: 'auxiliary' }
        },
        {
          id: 'e09',
          term: '蓄能器 (Dampener)',
          definition: '安装在泵出口的压力脉动衰减装置。',
          impact: '消除“泵纹”的最后一道防线。利用气囊或膜片吸收压力波动。',
          control: '预充气压力（通常为工作压力的60-80%）。',
          related: ['脉动', '横纹']
        },
        {
          id: 'e10',
          term: '测厚仪 (Thickness Gauge)',
          definition: '在线实时监测涂布面密度或厚度的传感器（射线/激光/红外）。',
          impact: '质量闭环控制的眼睛。没有在线测厚就是盲人摸象。',
          control: '定期标定、扫描路径覆盖率。',
          related: ['闭环控制', '面密度']
        },
        {
          id: 'e11',
          term: 'RTO',
          definition: '蓄热式热氧化炉，用于处理有机废气(VOCs)。',
          impact: '环保合规的生命线。高效回收热能用于烘箱加热。',
          control: '燃烧室温度、VOC浓度监测(LEL)。',
          related: ['VOC', '环境'],
          moduleLink: { id: 'equipment', title: '干燥系统', anchor: 'drying-sys' }
        },
        {
          id: 'e12',
          term: '模温机',
          definition: '用于精确控制模头或涂布辊温度的循环控温设备。',
          impact: '稳定粘度的关键。防止因环境温度变化导致的涂布厚度漂移；防止模头热变形。',
          control: '温控精度(±0.5℃)、循环流量。',
          related: ['粘度', '热胀冷缩']
        }
      ]
    },
    {
      id: 'process',
      title: '工艺控制',
      icon: '⚙️',
      items: [
        {
          id: 'p01',
          term: '涂布量 (Coating Weight)',
          definition: '单位面积基材上涂覆的胶液质量(g/m²)。',
          impact: '最基本的工艺控制指标。直接关系到成本和性能。对于电池极片，叫“面密度”。',
          control: '称重法（离线）、射线规（在线）、泵速与线速联锁。',
          related: ['固含量', '面密度'],
          moduleLink: { id: 'process', title: '涂布品质控制', anchor: 'coating-control' }
        },
        {
          id: 'p02',
          term: '涂布间隙 (Gap)',
          definition: '模头唇口（或计量辊）与基材（或背辊）之间的距离。',
          impact: 'G/H比（间隙/湿膜厚度）是狭缝涂布稳定性的核心判断依据。通常需控制在2倍湿膜厚度以内。',
          control: '塞尺测量、千分表校准、热膨胀补偿。',
          related: ['G/H比', '湿膜']
        },
        {
          id: 'p03',
          term: '线速度 (Line Speed)',
          definition: '基材在涂布机上的运行速度(m/min)。',
          impact: '产能指标。也是缺陷放大器。速度越快，空气夹带风险越大，干燥负荷越大。',
          control: '干燥能力匹配、张力稳定、接带成功率。',
          related: ['产能', '空气夹带']
        },
        {
          id: 'p04',
          term: '速比 (Speed Ratio)',
          definition: '涂布辊/计量辊表面线速度与基材运行速度的比值。',
          impact: '辊涂（微凹/逆向）调节涂布量的核心手段。速比越高，涂布量越大，流平效果通常越好。',
          control: '变频器精度、同步控制。',
          related: ['微凹', '涂布量']
        },
        {
          id: 'p05',
          term: '干燥曲线 (Drying Curve)',
          definition: '烘箱各温区温度设置形成的温度分布曲线。',
          impact: '“三分涂，七分干”。升温过快导致结皮、气泡；升温过慢导致流平过度或效率低。',
          control: '分段控温（升温段-恒速干燥段-降速干燥段-冷却段）。',
          related: ['结皮', '残留'],
          moduleLink: { id: 'process', title: '干燥工艺', anchor: 'drying-process' }
        },
        {
          id: 'p06',
          term: '张力 (Tension)',
          definition: '基材在传输方向上受到的拉伸力。',
          impact: '卷材处理的基础。张力波动会导致套位不准、涂布厚度横向震荡、收卷起皱。',
          control: 'PID参数整定、张力传感器校准。',
          related: ['张力锥度', '收卷'],
          moduleLink: { id: 'process', title: '卷材控制', anchor: 'web-handling' }
        },
        {
          id: 'p07',
          term: '张力锥度 (Taper Tension)',
          definition: '收卷过程中张力随卷径增大而线性衰减的控制策略。',
          impact: '防止收卷“内松外紧”（菜心）或“内紧外松”（菊花芯/伸缩卷）。',
          control: '锥度系数设定（通常10-30%）。',
          related: ['收卷', '内应力'],
          moduleLink: { id: 'process', title: '卷材控制', anchor: 'web-handling' }
        },
        {
          id: 'p08',
          term: '适用期 (Pot Life)',
          definition: '多组分胶液混合后保持可操作粘度的时长。',
          impact: '生产调度的红线。超时使用会导致粘度飙升、流平变差、内聚力异常。',
          control: '按需配料、连续在线混合。',
          related: ['粘度', '固化']
        },
        {
          id: 'p09',
          term: 'LEL',
          definition: '可燃气体爆炸下限浓度。',
          impact: '安全生产红线。烘箱内VOC浓度必须低于25% LEL。',
          control: '排风量联锁、LEL在线侦测。',
          related: ['安全', 'RTO']
        },
        {
          id: 'p10',
          term: '过滤精度',
          definition: '过滤系统拦截颗粒的最小尺寸（如300目, 20μm）。',
          impact: '颗粒缺陷的守门员。精度不够，异物多；精度太高，易堵网、压降大。',
          control: '多级过滤、压差监控、定期更换。',
          related: ['划痕', '颗粒']
        },
        {
          id: 'p11',
          term: '老化 (熟化)',
          definition: '胶液配制后静置或加热一段时间的过程。',
          impact: '让胶液性质稳定的必要步骤。去除搅拌气泡，让高分子充分溶胀，或完成预反应。',
          control: '真空脱泡、温度和时间。',
          related: ['气泡', '分散']
        }
      ]
    },
    {
      id: 'defects',
      title: '缺陷诊断',
      icon: '⚠️',
      items: [
        {
          id: 'd01',
          term: '空气夹带 (Air Entrainment)',
          definition: '因上游弯液面不稳定，空气被卷入涂层与基材之间形成的微气泡。',
          impact: '高速涂布的第一大障碍。表现为极小的密集气泡或露底。破坏绝缘性或光学均一性。',
          control: '提高真空度、降低间隙、降低粘度、减速。',
          related: ['涂布窗口', '毛细数'],
          moduleLink: { id: 'coating-theory', title: '狭缝涂布理论', anchor: 'slot-die' }
        },
        {
          id: 'd02',
          term: '流肋 (Ribbing)',
          definition: '沿涂布方向平行分布的条纹状厚度波动。',
          impact: '流平不稳定的典型特征。严重影响外观和膜厚均匀性。',
          control: '增加湿膜厚度、降低粘度、提高表面张力、使用更小间隙。',
          related: ['流平', '粘度']
        },
        {
          id: 'd03',
          term: '震颤 (Chatter)',
          definition: '垂直于涂布方向的高频横向条纹（搓衣板纹）。',
          impact: '机械干扰的指纹。通常源于设备振动（泵、电机、轴承、齿轮）。',
          control: '检查泵脉动、排查传动链振动频率、使用蓄能器。',
          related: ['脉动', '横纹']
        },
        {
          id: 'd04',
          term: '橘皮 (Orange Peel)',
          definition: '涂层表面出现类似橘子皮及其样不规则的凹凸纹路。',
          impact: '表面张力驱动流动的恶果（Bénard涡）。严重影响光学清晰度和光泽。',
          control: '降低表面张力、提高低剪切粘度、减缓干燥风速。',
          related: ['马兰戈尼效应', '流平']
        },
        {
          id: 'd05',
          term: '缩孔 (Craters)',
          definition: '涂层局部回缩形成的圆形露底坑洞（鱼眼）。',
          impact: '低表面能污染物的标志。如硅油飞沫、基材油污。',
          control: '环境清洁、基材电晕、添加润湿剂。',
          related: ['表面张力', '润湿']
        },
        {
          id: 'd06',
          term: '厚边 (Fat Edge)',
          definition: '涂层边缘厚度显著高于中间区域的现象。',
          impact: '导致收卷边缘凸起（荷叶边/暴筋），无法收卷或造成拉伸变形。',
          control: '优化模头垫片(Shim)形状、使用真空抽边、边缘假涂。',
          related: ['表面张力', '垫片']
        },
        {
          id: 'd07',
          term: '结皮 (Skinning)',
          definition: '涂层表面过早干燥封闭，内部溶剂无法挥发的现象。',
          impact: '后续烘干时内部溶剂冲破表皮，形成“火山坑”或鼓泡。',
          control: '优化干燥曲线，第一区温度不宜过高，保持湿润气氛。',
          related: ['干燥曲线', '鼓泡']
        },
        {
          id: 'd08',
          term: '白雾 (Blushing)',
          definition: '涂层表面吸潮或树脂析出导致的乳白色浑浊。',
          impact: '高湿环境常见缺陷。影响透明度和光泽。',
          control: '降低环境湿度、使用慢干溶剂（防白水）、提高烘箱入口温度。',
          related: ['溶剂', '环境']
        },
        {
          id: 'd09',
          term: '划痕 (Scratches)',
          definition: '沿涂布方向连续的线条状缺陷。',
          impact: '模头损伤或大颗粒异物卡滞。永久性损伤。',
          control: '提高过滤精度、重新研磨唇口、清洁基材。',
          related: ['过滤', '狭缝模头']
        },
        {
          id: 'd10',
          term: '卷曲 (Curling)',
          definition: '分切后成品向涂层侧或基材侧弯曲。',
          impact: '造成后续加工（如模切、叠片）困难。源于固化收缩应力。',
          control: '调节张力、背湿（加湿）、调整胶液配方（降低收缩）。',
          related: ['内应力', '收缩']
        },
        {
          id: 'd11',
          term: '开裂 (Cracking)',
          definition: '干燥后涂层表面出现的龟裂纹路。',
          impact: '内应力超过涂层强度的表现。常见于厚涂层或无机填料多的体系。',
          control: '降低干燥速率、添加增塑剂、提高树脂柔韧性。',
          related: ['干燥', '内应力']
        },
        {
          id: 'd12',
          term: '团聚 (Agglomeration)',
          definition: '分散好的颗粒在浆料中重新聚集形成大颗粒。',
          impact: '导致表面颗粒感、过滤堵网、涂层性能不均。',
          control: '检查分散剂有效性、Zeta电位监测、防止胶液受潮或冲击。',
          related: ['分散剂', 'Zeta电位']
        }
      ]
    },
    {
      id: 'testing',
      title: '测试与质量',
      icon: '📊',
      items: [
        {
          id: 't01',
          term: '剥离力 (Peel Strength)',
          definition: '将涂层从基材上以一定角度剥离所需的力。',
          impact: '评估附着力最直接的指标。行业标准通常为180°或90°剥离。',
          control: '测试速度(300mm/min)、压辊重量(2kg)、停放时间。',
          related: ['附着力', '内聚力'],
          moduleLink: { id: 'testing', title: '粘着性能测试', anchor: 'adhesion' }
        },
        {
          id: 't02',
          term: '保持力 (Holding Power)',
          definition: '胶带在恒定载荷下抵抗剪切滑移的时间。',
          impact: '反映压敏胶的内聚强度（耐剪切性）。保持力差会导致胶带受力后位移或脱落。',
          control: '交联密度、测试温度、贴合面积。',
          related: ['内聚力', '蠕变'],
          moduleLink: { id: 'testing', title: '粘着性能测试', anchor: 'adhesion' }
        },
        {
          id: 't03',
          term: '初粘力 (Tack)',
          definition: '胶粘剂与被粘物轻微接触后立即分离的抵抗力。',
          impact: '用户的第一手感。初粘差会导致复卷翘头或贴合不牢。',
          control: '树脂Tg、增粘树脂添加量。',
          related: ['润湿', 'Tg'],
          moduleLink: { id: 'testing', title: '粘着性能测试', anchor: 'adhesion' }
        },
        {
          id: 't04',
          term: '接触角 (Contact Angle)',
          definition: '液滴在固体表面平衡时，气-液界面与液-固界面之间的夹角。',
          impact: '判断润湿性的金标准。<90°润湿，>90°不润湿。',
          control: '表面清洗、电晕处理。',
          related: ['润湿', '表面张力'],
          moduleLink: { id: 'materials', title: '界面与润湿', anchor: 'interface' }
        },
        {
          id: 't05',
          term: '雾度 (Haze)',
          definition: '透过试样偏离入射光方向散射光通量与透射光通量之比。',
          impact: '光学膜清晰度的核心指标。雾度高看起来发蒙。',
          control: '表面粗糙度、内部颗粒团聚、结晶。',
          related: ['光泽度', '流平'],
          moduleLink: { id: 'testing', title: '光学性能测试', anchor: 'optical' }
        },
        {
          id: 't06',
          term: 'DMA',
          definition: '动态热机械分析，测量材料在交变应力下的粘弹性响应。',
          impact: '研发配方如虎添翼的工具。精确测定Tg、模量、交联密度。',
          control: '升温速率、频率。',
          related: ['Tg', '粘弹性'],
          moduleLink: { id: 'testing', title: 'DMA测试', anchor: 'dma' }
        },
        {
          id: 't07',
          term: 'SAICAS',
          definition: '表面与界面切削分析系统。',
          impact: '高端微观分析。可测量多层涂层每一层的力学强度及层间附着力，精确定位最弱界面。',
          control: '切削深度、速度。',
          related: ['附着力', '界面']
        },
        {
          id: 't08',
          term: '细度 (Fineness)',
          definition: '浆料中最大颗粒的等效直径。',
          impact: '决定涂层能做的最薄厚度。细度必须小于湿膜厚度的1/3，否则必划伤。',
          control: '研磨时间、过滤精度。',
          related: ['颜填料', '划痕']
        },
        {
          id: 't09',
          term: '光泽度 (Gloss)',
          definition: '表面对光的镜面反射能力。',
          impact: '外观质感的量化。光泽度低通常意味着流平不好或表面微观粗糙。',
          control: '流平助剂、消光粉添加量。',
          related: ['雾度', '流平']
        },
        {
          id: 't10',
          term: '压实密度',
          definition: '电池极片经辊压后的涂层密度(g/cm³)。',
          impact: '锂电核心指标。影响电池能量密度和离子传输。过压会导致析锂或断带。',
          control: '辊压压力、涂布面密度。',
          related: ['孔隙率', '固含量']
        },
        {
          id: 't11',
          term: '面密度',
          definition: '单位面积涂层的质量(mg/cm²或g/m²)。',
          impact: '涂布过程控制的第一属性。直接通过称重获得。',
          control: '供料系统精度、模头调节。',
          related: ['涂布量', 'CPK'],
          moduleLink: { id: 'process', title: '涂布品质控制', anchor: 'coating-control' }
        },
        {
          id: 't12',
          term: '残留溶剂',
          definition: '干燥后涂层中残留的微量挥发性物质(ppm)。',
          impact: '食品药品包装及锂电安全的严控指标。残留过高会导致异味、毒性或电池胀气。',
          control: '干燥温度、时间、风速。',
          related: ['干燥', 'VOC'],
          moduleLink: { id: 'process', title: '干燥工艺', anchor: 'drying-process' }
        }
      ]
    }
  ]
}
