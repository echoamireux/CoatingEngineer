/**
 * 涂布基础名词库数据
 */
module.exports = {
  terms: [
    // 基础术语
    { id: 'coating-weight', term: '涂布量', english: 'Coating Weight', definition: '单位面积基材上涂布物质的质量，通常以 g/m² 表示', related: ['干涂布量', '湿涂布量'] },
    { id: 'wet-coating-weight', term: '湿涂布量', english: 'Wet Coating Weight', definition: '涂布后未干燥状态的涂布量 (g/m²)', related: ['涂布量', '固含量'] },
    { id: 'dry-coating-weight', term: '干涂布量', english: 'Dry Coating Weight', definition: '干燥后的涂布量，等于湿涂布量×固含量', related: ['涂布量', '固含量'] },
    { id: 'solid-content', term: '固含量', english: 'Solid Content', definition: '涂料中非挥发性物质的质量百分比 (%)', related: ['涂布量', '粘度'] },
    { id: 'viscosity', term: '粘度', english: 'Viscosity', definition: '流体抵抗流动的内摩擦力，单位 mPa·s 或 cP', related: ['剪切速率', '流变性'] },
    { id: 'surface-tension', term: '表面张力', english: 'Surface Tension', definition: '液体表面分子间作用力，单位 mN/m (dyne/cm)', related: ['润湿', '接触角'] },
    { id: 'wetting', term: '润湿', english: 'Wetting', definition: '液体在固体表面铺展的能力', related: ['表面张力', '接触角'] },
    { id: 'contact-angle', term: '接触角', english: 'Contact Angle', definition: '液滴与固体表面的夹角，<90°亲水，>90°疏水', related: ['润湿', '表面能'] },
    { id: 'leveling', term: '流平', english: 'Leveling', definition: '涂层自发消除表面不平整的过程', related: ['表面张力', '粘度'] },

    // 设备术语
    { id: 'slot-die', term: '狭缝模头', english: 'Slot Die', definition: '精密涂布模头，通过狭缝将流体挤出形成涂膜', related: ['涂布间隙', '湿膜厚度'] },
    { id: 'gravure-roll', term: '凹版辊', english: 'Gravure Roll', definition: '表面雕刻网穴的金属辊，用于定量转移涂料', related: ['网穴', 'LPI'] },
    { id: 'doctor-blade', term: '刮刀', english: 'Doctor Blade', definition: '用于刮除多余涂料的薄片，控制涂布量', related: ['刮刀角度', '刮刀压力'] },
    { id: 'backing-roll', term: '背辊', english: 'Backing Roll', definition: '支撑基材运行的辊筒，与涂布辊形成涂布间隙', related: ['涂布间隙'] },
    { id: 'tension-roller', term: '张力辊', english: 'Tension Roller', definition: '控制基材张力的辊筒系统', related: ['张力', '包角'] },
    { id: 'unwind-rewind', term: '收放卷', english: 'Unwind/Rewind', definition: '卷材的放料端和收料端', related: ['张力', '卷径'] },
    { id: 'oven', term: '烘箱', english: 'Oven', definition: '干燥涂层的加热设备，通常多段温区', related: ['干燥温度', '风速'] },
    { id: 'corona-treatment', term: 'Corona处理', english: 'Corona Treatment', definition: '电晕放电处理，提高基材表面能', related: ['表面能', '达因值'] },

    // 工艺参数术语
    { id: 'line-speed', term: '线速度', english: 'Line Speed', definition: '基材运行速度，单位 m/min', related: ['涂布量', '干燥时间'] },
    { id: 'coating-gap', term: '涂布间隙', english: 'Coating Gap', definition: '模头唇口与基材之间的距离 (μm)', related: ['湿膜厚度', '狭缝模头'] },
    { id: 'wet-film-thickness', term: '湿膜厚度', english: 'Wet Film Thickness', definition: '涂布后未干燥的膜厚 (μm)', related: ['干膜厚度', '固含量'] },
    { id: 'dry-film-thickness', term: '干膜厚度', english: 'Dry Film Thickness', definition: '干燥后的膜厚 = 湿膜×固含量', related: ['湿膜厚度', '涂布量'] },
    { id: 'pump-speed', term: '泵速', english: 'Pump Speed', definition: '供液泵的转速，影响流量', related: ['流量', '涂布量'] },
    { id: 'flow-rate', term: '流量', english: 'Flow Rate', definition: '单位时间供液量 (mL/min 或 L/h)', related: ['涂布量', '泵速'] },
    { id: 'tension', term: '张力', english: 'Tension', definition: '基材运行时的拉伸力 (N 或 kg/m宽)', related: ['收放卷', '张力辊'] },
    { id: 'wrap-angle', term: '包角', english: 'Wrap Angle', definition: '基材在辊筒上的接触弧度 (°)', related: ['张力', '摩擦力'] },

    // 材料术语
    { id: 'substrate', term: '基材', english: 'Substrate', definition: '被涂布的底材，如PET、PI、铜箔等', related: ['离型膜', '底涂'] },
    { id: 'release-film', term: '离型膜', english: 'Release Film', definition: '涂有离型剂的薄膜，便于胶层剥离', related: ['离型力', '基材'] },
    { id: 'release-force', term: '离型力', english: 'Release Force', definition: '将离型膜从胶面剥离所需的力', related: ['离型膜', '剥离力'] },
    { id: 'primer', term: '底涂', english: 'Primer', definition: '涂布于基材与主涂层之间的处理层', related: ['附着力', '基材'] },
    { id: 'tackifier', term: '增粘树脂', english: 'Tackifier', definition: '提高初粘力的树脂添加剂', related: ['初粘力', 'Tg'] },
    { id: 'crosslinker', term: '交联剂', english: 'Crosslinker', definition: '使聚合物分子间形成化学键联的物质', related: ['凝胶分率', '内聚力'] },
    { id: 'curing-agent', term: '固化剂', english: 'Curing Agent', definition: '促进涂层固化反应的物质', related: ['交联剂', '固化时间'] },

    // 性能术语
    { id: 'tack', term: '初粘力', english: 'Tack', definition: '胶黏剂与被粘物初始接触时的粘着力', related: ['Tg', '增粘树脂'] },
    { id: 'peel-strength', term: '剥离力', english: 'Peel Strength', definition: '将胶带从被粘物剥离所需的力 (N/25mm)', related: ['180°剥离', '90°剥离'] },
    { id: 'shear-holding', term: '保持力', english: 'Shear Holding Power', definition: '胶带抵抗剪切应力的能力', related: ['内聚力', '交联'] },
    { id: 'cohesive-strength', term: '内聚力', english: 'Cohesive Strength', definition: '胶层本身的强度', related: ['保持力', '交联'] },
    { id: 'tg', term: '玻璃化转变温度', english: 'Tg', definition: '聚合物从玻璃态转变为橡胶态的温度', related: ['Fox方程', 'DMA'] },
    { id: 'creep', term: '蠕变', english: 'Creep', definition: '材料在恒定应力下随时间的变形', related: ['保持力', '粘弹性'] },

    // 缺陷术语
    { id: 'ribbing', term: '拉丝', english: 'Ribbing/Striation', definition: '涂层表面沿涂布方向的周期性条纹', related: ['毛细数', '粘度'] },
    { id: 'pinhole', term: '针孔', english: 'Pinhole', definition: '涂层中微小的孔洞缺陷', related: ['消泡剂', '表面张力'] },
    { id: 'orange-peel', term: '橘皮', english: 'Orange Peel', definition: '涂层表面类似橘子皮的凹凸不平', related: ['流平', 'Bénard对流'] },
    { id: 'fish-eye', term: '鱼眼', english: 'Fish Eye', definition: '涂层中的圆形凹陷缺陷', related: ['污染', '表面张力'] },
    { id: 'bubble', term: '气泡', english: 'Bubble', definition: '涂层或贴合界面的气体包裹', related: ['脱泡', '真空'] },
    { id: 'edge-buildup', term: '边缘堆积', english: 'Edge Buildup', definition: '涂层边缘比中间厚的现象', related: ['Marangoni流动', '边缘效应'] },
    { id: 'thickness-variation', term: '厚薄不均', english: 'Thickness Variation', definition: '涂层厚度分布不一致', related: ['涂布精度', '流量波动'] },
    { id: 'adhesive-residue', term: '残胶', english: 'Adhesive Residue', definition: '剥离后留在被粘物表面的胶痕', related: ['内聚力', '界面粘结'] }
  ]
}
