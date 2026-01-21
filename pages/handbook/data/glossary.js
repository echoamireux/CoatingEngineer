/**
 * 涂布工程师名词库 - Comprehensive Edition (80+ Terms)
 * 包含基础、流体、材料、设备、工艺、缺陷、测试七大分类
 */
module.exports = {
  categories: [
    {
      id: 'basics',
      title: '基础概念',
      icon: '🔰',
      items: [
        { id: 'b01', term: '涂布 (Coating)', definition: '将流体覆盖在基材表面的工艺', detail: '核心目的是赋予基材新的功能（如隔膜涂胶、极片涂敷）。关键在于控制厚度均匀性。', related: ['流体', '基材'] },
        { id: 'b02', term: '基材 (Substrate)', definition: '被涂布的载体材料', detail: '如锂电铜箔、铝箔、PET膜等。基材的表面能直接影响润湿效果。', related: ['表面能', '润湿'] },
        { id: 'b03', term: '涂层 (Layer)', definition: '涂布形成的膜层', detail: '分为底涂、主涂层、面涂等。干燥后的涂层质量是最终交付物。', related: ['干膜厚度', '附着力'] },
        { id: 'b04', term: '附着力 (Adhesion)', definition: '涂层与基材之间的结合力', detail: '界面化学键、机械互锁和范德华力的综合结果。附着力不足会导致脱膜、分层。电晕处理就是为了提高附着力。', related: ['剥离力', '电晕'] },
        { id: 'b05', term: '内聚力 (Cohesion)', definition: '涂层内部的结合力', detail: '材料内部分子间的相互作用力。内聚力过低会导致涂层自身断裂（内聚破坏）。', related: ['保持力', '干燥'] },
        { id: 'b06', term: '界面 (Interface)', definition: '两相接触的边界', detail: '气-液界面（表面张力）、液-固界面（润湿）。涂布过程就是操纵界面的过程。', related: ['表面张力', '润湿'] },
        { id: 'b07', term: '润湿 (Wetting)', definition: '液体在固体表面铺展的能力', detail: '由接触角衡量。液体表面张力 < 固体表面能时，才能良好润湿。', related: ['接触角', '表面张力'] },
        { id: 'b08', term: '流平 (Leveling)', definition: '涂层自发消除表面不平整的过程', detail: '驱动力是表面张力。阻力是粘度。流平时间不足会导致橘皮。', related: ['橘皮', '粘度'] },
        { id: 'b09', term: '固化 (Curing)', definition: '液体转变为固体的过程', detail: '物理干燥（挥发）或化学交联（反应）。决定了涂层的最终性能。', related: ['干燥', '交联剂'] },
        { id: 'b10', term: '涂布窗口 (Coating Window)', definition: '能获得均匀无缺陷涂层的工艺参数范围', detail: '通常以毛细数(Ca)和间隙比(G/H)为坐标轴。超出窗口会导致气泡、断液或条纹。', related: ['毛细数', '空气夹带'] }
      ]
    },
    {
      id: 'rheology',
      title: '流体与理论',
      icon: '📖',
      items: [
        { id: 'r01', term: '粘度 (Viscosity)', definition: '流体抵抗流动的内摩擦力', detail: '涂料通常是剪切变稀流体。粘度随剪切速率变化：低剪切影响流平，高剪切影响涂布。', related: ['剪切变稀', '触变性'] },
        { id: 'r02', term: '剪切变稀 (Shear Thinning)', definition: '粘度随剪切速率增加而降低', detail: '假塑性流体特征。利于高速涂布（低阻力），但需防止涂后流挂。', related: ['粘度', '触变性'] },
        { id: 'r03', term: '触变性 (Thixotropy)', definition: '粘度的时间依赖性（破坏-恢复）', detail: '恒定剪切下粘度下降，停止剪切后粘度随时间回升。触变环大小反映结构恢复快慢。', related: ['粘度', '流平'] },
        { id: 'r04', term: '屈服应力 (Yield Stress)', definition: '流体发生流动所需的最小应力', detail: '有屈服值的流体静止时像固体（悬浮颗粒不沉降）。但屈服值过高会导致流平差。', related: ['流平', '悬浮'] },
        { id: 'r05', term: '表面张力 (Surface Tension)', definition: '液体企图收缩表面积的力', detail: '驱动流平的动力，也是回缩（缩孔）的根源。', related: ['润湿', '接触角'] },
        { id: 'r06', term: '毛细数 (Ca)', definition: '粘性力与表面张力的比值', detail: 'Ca = μV/σ。决定涂布窗口稳定性的无量纲数。Ca过大导致空气夹带。', related: ['空气夹带', '涂布窗口'] },
        { id: 'r07', term: '粘弹性 (Viscoelasticity)', definition: '兼具粘性流动和弹性记忆', detail: '高分子的特征。弹性效应会导致爬杆、挤出胀大。', related: ['模量', '德雷数'] },
        { id: 'r08', term: '雷诺数 (Re)', definition: '惯性力与粘性力的比值', detail: '判断层流/湍流。狭缝模头内通常为层流。', related: ['层流', '湍流'] },
        { id: 'r09', term: '马兰戈尼效应 (Marangoni)', definition: '表面张力梯度驱动的流动', detail: '干燥时溶剂挥发不均导致张力差，引起流体流动，形成橘皮。', related: ['橘皮', '干燥'] },
        { id: 'r10', term: 'Zeta电位', definition: '胶体颗粒剪切面电位', detail: '衡量分散稳定性。绝对值>30mV为稳定（静电斥力足）。', related: ['分散', '团聚'] },
        { id: 'r11', term: '韦伯数 (We)', definition: '惯性力与表面张力的比值', detail: '涉及液滴破碎、喷涂雾化时的关键参数。', related: ['喷涂', '表面张力'] },
        { id: 'r12', term: '德雷数 (De)', definition: '松弛时间与流动时间尺度的比值', detail: '表征粘弹性效应的强弱。', related: ['粘弹性', '松弛时间'] }
      ]
    },
    {
      id: 'materials',
      title: '材料体系',
      icon: '⚗️',
      items: [
        { id: 'm01', term: '粘结剂 (Binder)', definition: '提供内聚力和附着力的树脂', detail: 'PVDF、SBR、丙烯酸等。决定涂层的机械性能。', related: ['内聚力', '附着力'] },
        { id: 'm02', term: '溶剂 (Solvent)', definition: '溶解树脂的挥发性液体', detail: 'NMP、水、甲苯。溶解参数HSP需匹配。', related: ['溶解度参数', '干燥'] },
        { id: 'm03', term: '分散剂 (Dispersant)', definition: '防止颗粒团聚的助剂', detail: '降低粘度，改善流动性。', related: ['Zeta电位', '粘度'] },
        { id: 'm04', term: '润湿剂 (Wetting Agent)', definition: '降低表面张力的助剂', detail: '防止缩孔，加快润湿速度。', related: ['表面张力', '缩孔'] },
        { id: 'm05', term: '交联剂 (Crosslinker)', definition: '连接分子链形成网状结构的物质', detail: '提高耐热、耐溶剂性。', related: ['固化', '交联度'] },
        { id: 'm06', term: '颜填料 (Pigment)', definition: '固体功能颗粒', detail: '活性物质、导电炭黑。粒径分布(D50)影响涂布质量。', related: ['固含量', '细度'] },
        { id: 'm07', term: 'Tg (玻化温度)', definition: '玻璃化转变温度', detail: '高分子从玻璃态转变为橡胶态的温度。', related: ['DMA', '初粘力'] },
        { id: 'm08', term: '固含量 (Solid Content)', definition: '非挥发份的质量占比', detail: 'NV%。固含量越高，溶剂越少，干燥负荷越低。', related: ['涂布量', '干燥'] },
        { id: 'm09', term: 'PVC (颜料体积浓度)', definition: '颜料体积占干膜总体积的比例', detail: 'CPVC是性能转折点。', related: ['颜填料', '孔隙率'] },
        { id: 'm10', term: 'HSP (溶解参数)', definition: '汉森溶解度参数', detail: '相似相溶。用于溶剂优化选择。', related: ['溶剂', '相容性'] },
        { id: 'm11', term: '触变剂', definition: '赋予流体触变性的助剂', detail: '如气相二氧化硅。防止沉降和流挂。', related: ['触变性', '流挂'] },
        { id: 'm12', term: '消泡剂', definition: '抑制或消除气泡的助剂', detail: '破泡剂/抑泡剂。防止针孔缺陷。', related: ['针孔', '气泡'] }
      ]
    },
    {
      id: 'equipment',
      title: '设备与硬件',
      icon: '🔧',
      items: [
        { id: 'e01', term: '狭缝模头 (Slot Die)', definition: '精密预计量涂布头', detail: '流道(Manifold)设计是核心。', related: ['垫片', '涂布量'] },
        { id: 'e02', term: '微凹辊 (Micro Gravure)', definition: '小直径逆向凹版辊', detail: 'Kiss Coat原理，剪切力大，涂层薄且平整。', related: ['凹版', '逆向涂布'] },
        { id: 'e03', term: '逗号刮刀 (Comma Roll)', definition: '逗号状截面的计量辊', detail: '用于高粘度厚涂层。精度优于钢片刮刀。', related: ['刮刀', '涂布量'] },
        { id: 'e04', term: '计量泵 (Metering Pump)', definition: '精密输送泵', detail: '齿轮泵或螺杆泵。泵的精度决定纵向均匀性。', related: ['脉动', '涂布量'] },
        { id: 'e05', term: '真空箱 (Vacuum Box)', definition: '模头唇口处的负压装置', detail: '稳定上游弯液面，防止空气夹带。', related: ['空气夹带', '涂布窗口'] },
        { id: 'e06', term: '漂浮烘箱 (Flotation Oven)', definition: '气浮式非接触干燥箱', detail: '利用柯恩达效应托起基材。', related: ['干燥', '划伤'] },
        { id: 'e07', term: '电晕 (Corona)', definition: '高压放电表面处理', detail: '提高基材表面能，改善附着力。', related: ['表面能', '附着力'] },
        { id: 'e08', term: '纠偏 (Web Guiding)', definition: '边缘对齐系统', detail: 'EPC/CPC。确保卷材走料整齐。', related: ['收卷', '端面'] },
        { id: 'e09', term: '蓄能器 (Dampener)', definition: '消除流体脉动的阻尼器', detail: '吸收泵的压力波动，消除横向条纹。', related: ['脉动', '横纹'] },
        { id: 'e10', term: '测厚仪 (Thickness Gauge)', definition: '在线厚度/面密度检测', detail: '射线或激光原理。用于闭环控制。', related: ['闭环控制', '面密度'] },
        { id: 'e11', term: 'RTO', definition: '蓄热式废气氧化炉', detail: '处理VOCs废气。', related: ['VOC', '环境'] },
        { id: 'e12', term: '模温机', definition: '模头温度控制设备', detail: '稳定流体粘度，减少热变形。', related: ['粘度', '热胀冷缩'] }
      ]
    },
    {
      id: 'process',
      title: '工艺控制',
      icon: '⚙️',
      items: [
        { id: 'p01', term: '涂布量 (Coating Weight)', definition: '单位面积涂胶量(gsm)', detail: '控制核心。湿重=干重/固含量。', related: ['固含量', '面密度'] },
        { id: 'p02', term: '涂布间隙 (Gap)', definition: '模头与基材的距离', detail: 'G/H比（间隙/湿膜）是关键。', related: ['G/H比', '湿膜'] },
        { id: 'p03', term: '线速度 (Line Speed)', definition: '基材运行速度', detail: '产能指标。受干燥与流体极限限制。', related: ['产能', '空气夹带'] },
        { id: 'p04', term: '速比 (Speed Ratio)', definition: '涂布辊与基材的速度比', detail: '辊涂核心参数。影响涂胶量和流平。', related: ['微凹', '涂布量'] },
        { id: 'p05', term: '干燥曲线 (Drying Curve)', definition: '烘箱各温区设定', detail: '升温-恒速-降速。防止结皮。', related: ['结皮', '残留'] },
        { id: 'p06', term: '张力 (Tension)', definition: '基材受到的纵向拉力', detail: '张力不稳导致套位漂移。', related: ['张力锥度', '收卷'] },
        { id: 'p07', term: '张力锥度 (Taper Tension)', definition: '收卷张力随卷径递减', detail: '防止内松外紧。', related: ['收卷', '内应力'] },
        { id: 'p08', term: '适用期 (Pot Life)', definition: '胶液调配后可使用的时间', detail: '超时无法涂布。', related: ['粘度', '固化'] },
        { id: 'p09', term: 'LEL', definition: '爆炸下限', detail: 'VOC浓度需<25% LEL。', related: ['安全', 'RTO'] },
        { id: 'p10', term: '过滤精度', definition: '滤芯拦截颗粒的尺寸', detail: '决定涂层表面颗粒缺陷。', related: ['划痕', '颗粒'] },
        { id: 'p11', term: '老化', definition: '胶液静置熟化过程', detail: '消除气泡，稳定性质。', related: ['气泡', '分散'] }
      ]
    },
    {
      id: 'defects',
      title: '缺陷诊断',
      icon: '⚠️',
      items: [
        { id: 'd01', term: '空气夹带 (Air Entrainment)', definition: '微气泡导致的露底', detail: '速度过快，Ca数过高导致。', related: ['涂布窗口', '毛细数'] },
        { id: 'd02', term: '流肋 (Ribbing)', definition: '纵向平行条纹', detail: '粘度高、间隙大导致。', related: ['流平', '粘度'] },
        { id: 'd03', term: '震颤 (Chatter)', definition: '高频横向条纹', detail: '机械振动（齿轮/泵）。', related: ['脉动', '横纹'] },
        { id: 'd04', term: '橘皮 (Orange Peel)', definition: '表面凹凸不平', detail: '马兰戈尼对流。张力梯度引起。', related: ['马兰戈尼效应', '流平'] },
        { id: 'd05', term: '缩孔 (Craters)', definition: '圆形露底坑洞', detail: '低表面能污染物（硅油）。', related: ['表面张力', '润湿'] },
        { id: 'd06', term: '厚边 (Fat Edge)', definition: '边缘异常增厚', detail: '液体向边缘聚集。', related: ['表面张力', '垫片'] },
        { id: 'd07', term: '结皮 (Skinning)', definition: '表面过早干燥封闭', detail: '初期温度过高。导致鼓泡。', related: ['干燥曲线', '鼓泡'] },
        { id: 'd08', term: '白雾 (Blushing)', definition: '表面吸潮发白', detail: '高湿环境导致。', related: ['溶剂', '环境'] },
        { id: 'd09', term: '划痕 (Scratches)', definition: '纵向线条损伤', detail: '模头缺口或颗粒卡滞。', related: ['过滤', '狭缝模头'] },
        { id: 'd10', term: '卷曲 (Curling)', definition: '成品向一侧弯曲', detail: '应力不匹配。', related: ['内应力', '收缩'] },
        { id: 'd11', term: '开裂 (Cracking)', definition: '干燥后涂层龟裂', detail: '收缩应力过大或干燥过快。', related: ['干燥', '内应力'] },
        { id: 'd12', term: '团聚 (Agglomeration)', definition: '颗粒重新聚集', detail: '分散不稳定。造成颗粒缺陷。', related: ['分散剂', 'Zeta电位'] }
      ]
    },
    {
      id: 'testing',
      title: '测试与质量',
      icon: '📊',
      items: [
        { id: 't01', term: '剥离力 (Peel Strength)', definition: '涂层剥离强度', detail: '表征附着力。180度或90度测试。', related: ['附着力', '内聚力'] },
        { id: 't02', term: '保持力 (Holding Power)', definition: '静态抗剪切能力', detail: '反映胶粘剂内聚力。', related: ['内聚力', '蠕变'] },
        { id: 't03', term: '初粘力 (Tack)', definition: '瞬间粘接能力', detail: '环形初粘或滚球法。', related: ['润湿', 'Tg'] },
        { id: 't04', term: '接触角 (Contact Angle)', definition: '液滴与表面夹角', detail: '判断润湿性。', related: ['润湿', '表面张力'] },
        { id: 't05', term: '雾度 (Haze)', definition: '透射光散射比例', detail: '光学膜清晰度指标。', related: ['光泽度', '流平'] },
        { id: 't06', term: 'DMA', definition: '动态热机械分析', detail: '测定Tg、模量。', related: ['Tg', '粘弹性'] },
        { id: 't07', term: 'SAICAS', definition: '界面斜切分析', detail: '测量微观层间附着力。', related: ['附着力', '界面'] },
        { id: 't08', term: '细度 (Fineness)', definition: '最大颗粒粒径', detail: '刮板细度计测试。', related: ['颜填料', '划痕'] },
        { id: 't09', term: '光泽度 (Gloss)', definition: '表面反光能力', detail: '反映表面平整度。', related: ['雾度', '流平'] },
        { id: 't10', term: '压实密度', definition: '极片压实后密度', detail: '电池工艺指标。', related: ['孔隙率', '固含量'] },
        { id: 't11', term: '面密度', definition: '单位面积质量', detail: '涂布过程控制的最关键指标。', related: ['涂布量', 'CPK'] },
        { id: 't12', term: '残留溶剂', definition: '涂层中未挥发的溶剂', detail: '气相色谱GC测试。影响安全和性能。', related: ['干燥', 'VOC'] }
      ]
    }
  ]
}
