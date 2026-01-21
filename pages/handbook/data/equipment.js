/**
 * 设备硬件数据 (Equipment & Hardware)
 */
module.exports = {
  categories: [
    {
      id: 'feeding',
      title: '供料系统',
      icon: '🔄',
      items: [
        { id: 'eq-pump', title: '精密计量泵', brief: '齿轮泵/螺杆泵/隔膜泵' },
        { id: 'eq-filter', title: '过滤系统', brief: '滤芯精度与选型' },
        { id: 'eq-degas', title: '脱泡装置', brief: '在线/离线脱泡原理' }
      ]
    },
    {
      id: 'coating-head',
      title: '涂布模头',
      icon: '🔧',
      items: [
        { id: 'eq-slotdie', title: '狭缝模头结构', brief: '模唇/流道/背压' },
        { id: 'eq-shim', title: '垫片(Shim)设计', brief: '厚度/开口/条纹' },
        { id: 'eq-vacuum', title: '真空箱系统', brief: '负压稳定机制' }
      ]
    },
    {
      id: 'drying-sys',
      title: '干燥系统',
      icon: '🔥',
      items: [
        { id: 'eq-oven', title: '烘箱类型', brief: '漂浮式/辊筒式/UV灯箱' },
        { id: 'eq-nozzle', title: '风嘴设计', brief: '冲击射流与风速分布' },
        { id: 'eq-rto', title: 'RTO废气处理', brief: '热回收与排放合规' }
      ]
    },
    {
      id: 'auxiliary',
      title: '辅助与控制',
      icon: '⚙️',
      items: [
        { id: 'eq-corona', title: '电晕处理机', brief: '放电架与电源' },
        { id: 'eq-epc', title: '纠偏系统(EPC)', brief: '光电/超声波传感器' },
        { id: 'eq-static', title: '除静电装置', brief: '离子棒/离子风机' },
        { id: 'eq-accumulator', title: '脉动蓄能器', brief: '消除压力波动' }
      ]
    }
  ],
  details: {
    'eq-pump': {
      sections: [
        { type: 'text', content: '计量泵是涂布机的心脏，提供稳定、精密的胶液流量。' },
        { type: 'table', title: '常见泵型对比', headers: ['类型', '脉动', '粘度范围', '特点'], rows: [
          ['齿轮泵', '中等', '低~中', '通用，但剪切大'],
          ['螺杆泵', '极低', '中~高', '无脉动，适合敏感流体'],
          ['隔膜泵', '极高', '低', '仅用于供料，不用于计量']
        ]},
        { type: 'tip', tipType: 'warning', content: '精密涂布必须使用齿轮泵或螺杆泵，且需配合伺服电机实现闭环控制。' }
      ]
    },
    'eq-filter': {
      sections: [
        { type: 'text', content: '过滤系统用于拦截浆料中的颗粒异物，防止划伤模头和涂层缺陷。' },
        { type: 'table', title: '目数与微米换算', headers: ['目数 (Mesh)', '孔径 (μm)', '适用场景'], rows: [
          ['100目', '150μm', '粗滤/进料口'],
          ['200目', '75μm', '中粘度保护'],
          ['400目', '38μm', '精密涂布'],
          ['>800目', '<15μm', '光学级/锂电']
        ]},
        { type: 'tip', tipType: 'info', content: '一般要求过滤精度小于湿膜厚度的1/3，以确保颗粒能被液膜通过。' }
      ]
    },
    'eq-degas': {
      sections: [
        { type: 'text', content: '胶液中的气泡（微气泡）是涂布死敌。' },
        { type: 'list', items: [
          '离线脱泡：使用真空搅拌罐，静置脱泡（适合高粘度）。',
          '在线脱泡：利用离心力或薄膜脱泡技术，连续生产中使用（如中空纤维膜）。'
        ]}
      ]
    },
    'eq-slotdie': {
      sections: [
        { type: 'text', content: '狭缝模头由上模唇、下模唇和中间的垫片组成。' },
        { type: 'list', items: [
          '上模唇 (Upper Lip)：通常可微调，控制间隙均匀性。',
          '下模唇 (Lower Lip)：引导液体流出。',
          '歧管 (Manifold)：内部空腔，负责将从点状进入的液体展宽为线状分布。'
        ]},
        { type: 'tip', tipType: 'info', content: '模唇边缘锋利度非常关键，R角通常小于50μm，受损会导致条纹。' }
      ]
    },
    'eq-shim': {
      sections: [
        { type: 'text', content: '垫片(Shim)决定了涂布宽度和条纹形状。' },
        { type: 'list', items: [
          '全宽Shim：整面涂布。',
          '条纹Shim：开有多个槽口，实现条纹涂布（如电池极片）。',
          '厚度：通常0.1mm - 1.0mm，决定了模头的内部流阻。'
        ]}
      ]
    },
    'eq-vacuum': {
      sections: [
        { type: 'text', content: '真空箱安装在模头下方，通过抽取下弯液面的空气来稳定流动。' },
        { type: 'text', content: '作用：允许更大的涂布间隙和更高的涂布速度（推迟空气夹带）。' },
        { type: 'tip', tipType: 'info', content: '真空度一般控制在 -500Pa ~ -3000Pa，过大真空会导致涂层厚度波动。' }
      ]
    },
    'eq-oven': {
      sections: [
        { type: 'text', content: '烘箱通过热风对流加热基材，移除溶剂。' },
        { type: 'table', title: '烘箱结构类型', headers: ['类型', '基材支撑', '特点'], rows: [
          ['辊筒支撑', '导辊接触', '简单，但背面可能有辊印'],
          ['气浮(漂浮)', '无接触', '双面加热，无划伤，张力控制难'],
          ['履带式', '网带支撑', '适合片材或极慢速']
        ]}
      ]
    },
    'eq-rto': {
      sections: [
        { type: 'text', content: 'RTO (蓄热式热氧化炉) 将废气在800°C高温下氧化分解。' },
        { type: 'list', items: [
          '热效率：>95%，氧化产生的热量可回用于烘箱加热。',
          '安全性：入口LEL浓度必须严格监控（<25%）。'
        ]}
      ]
    },
    'eq-corona': {
      sections: [
        { type: 'text', content: '电晕处理机利用高频高压放电，提高基材表面能。' },
        { type: 'list', items: [
          '电极材质：陶瓷电极（适合所有材料，包括导电膜）vs 金属电极。',
          '排臭氧：放电产生臭氧(O₃)，必须有强力抽风系统。'
        ]}
      ]
    },
    'eq-epc': {
      sections: [
        { type: 'text', content: 'EPC (Edge Position Control) 确保基材始终走在产线中心。' },
        { type: 'table', title: '传感器类型', headers: ['类型', '原理', '适用'], rows: [
          ['超声波', '声波阻挡', '透明/不透明材料'],
          ['光电(红外)', '光线阻挡', '不透明材料，精度高'],
          ['CCD摄像', '图像识别', '印刷对位，最高精度']
        ]}
      ]
    }
  }
}
