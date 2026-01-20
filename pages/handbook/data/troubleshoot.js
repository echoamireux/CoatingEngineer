/**
 * 问题诊断数据
 */
module.exports = {
  categories: [
    {
      id: 'appearance',
      title: '涂布外观缺陷',
      icon: '👁️',
      items: [
        { id: 'defect-ribbing', title: '拉丝/Ribbing', brief: '周期性条纹' },
        { id: 'defect-edge', title: '边缘堆积', brief: 'Marangoni流动' },
        { id: 'defect-pinhole', title: '针孔', brief: '表面能问题' },
        { id: 'defect-orange', title: '橘皮', brief: 'Bénard对流' },
        { id: 'defect-fisheye', title: '鱼眼', brief: '污染问题' },
        { id: 'defect-streak', title: '纵向条纹', brief: '模唇刮伤' },
        { id: 'defect-bubble', title: '气泡夹带', brief: '动态接触线失稳' }
      ]
    },
    {
      id: 'drying',
      title: '干燥异常',
      icon: '🔥',
      items: [
        { id: 'dry-blister', title: '起泡', brief: '溶剂沸腾' },
        { id: 'dry-skin', title: '结皮', brief: '表干过快' },
        { id: 'dry-crack', title: '龟裂', brief: '收缩应力' },
        { id: 'dry-white', title: '白化', brief: '吸湿/相分离' }
      ]
    },
    {
      id: 'performance',
      title: '性能不良',
      icon: '📉',
      items: [
        { id: 'perf-tack', title: '初粘差', brief: 'Tg过高' },
        { id: 'perf-peel', title: '剥离力低', brief: '润湿不良' },
        { id: 'perf-shear', title: '保持力差', brief: '交联不足' },
        { id: 'perf-residue', title: '残胶', brief: '界面>内聚' },
        { id: 'perf-aging', title: '老化降解', brief: 'UV/热氧化' }
      ]
    }
  ],
  details: {
    'defect-ribbing': {
      sections: [
        { type: 'text', content: '拉丝(Ribbing)是涂布过程中最常见的缺陷之一，表现为涂层表面沿涂布方向的周期性条纹。' },
        { type: 'table', title: '原因与处理', headers: ['可能原因', '机理分析', '处理方案'], rows: [
          ['粘度过高', 'Ca数超过临界值', '降低粘度/添加溶剂'],
          ['涂布速度过快', '毛细数增大', '降低线速度'],
          ['间隙过小', 'G/H比值偏低', '适当增大涂布间隙'],
          ['模头污染', '局部流场扰动', '清洁模头唇口']
        ]},
        { type: 'formula', title: '临界条件', formula: 'Ca > Ca_critical', description: '当毛细数超过临界值时容易发生Ribbing' },
        { type: 'tip', tipType: 'info', content: '通常Ca < 0.1时涂布较稳定，G/H保持在1.5-2.5范围内。' }
      ]
    },
    'defect-edge': {
      sections: [
        { type: 'text', content: '边缘堆积是指涂层边缘比中间厚的现象，影响涂布精度和产品外观。' },
        { type: 'list', items: [
          '原因：边缘溶剂挥发快，表面张力梯度导致Marangoni流动',
          '原因：模头边缘流场不均匀',
          '原因：基材边缘变形或翘曲'
        ]},
        { type: 'table', title: '处理方案', headers: ['方法', '说明'], rows: [
          ['边缘遮蔽', '使用Shim调整边缘出液'],
          ['添加流平剂', '降低表面张力梯度'],
          ['调整干燥条件', '降低初段温度减缓边缘挥发'],
          ['优化配方', '使用慢干溶剂体系']
        ]}
      ]
    },
    'defect-pinhole': {
      sections: [
        { type: 'text', content: '针孔是涂层中微小孔洞，影响产品功能和外观。' },
        { type: 'table', title: '原因与处理', headers: ['可能原因', '机理', '处理方案'], rows: [
          ['气泡', '胶液中夹带气泡', '脱泡处理'],
          ['基材污染', '表面有油污/灰尘', '清洁基材'],
          ['表面能不匹配', '润湿不良', '表面处理/调配方'],
          ['消泡剂过量', '表面张力局部降低', '减少消泡剂']
        ]},
        { type: 'tip', tipType: 'info', content: '消泡剂用量一般0.1-0.3%，过多反而产生缺陷。' }
      ]
    },
    'defect-orange': {
      sections: [
        { type: 'text', content: '橘皮是涂层表面类似橘子皮的凹凸不平，影响外观和光学性能。' },
        { type: 'list', items: [
          '机理：Bénard对流 - 温度梯度导致的对流单元',
          '机理：Marangoni效应 - 表面张力梯度驱动流动',
          '机理：溶剂挥发不均匀'
        ]},
        { type: 'table', title: '处理方案', headers: ['方法', '原理'], rows: [
          ['降低初段干燥温度', '减缓溶剂挥发速度'],
          ['添加流平剂', '降低表面张力，促进流平'],
          ['调整溶剂配比', '使用慢干溶剂'],
          ['减薄涂层', '降低对流驱动力']
        ]}
      ]
    },
    'defect-fisheye': {
      sections: [
        { type: 'text', content: '鱼眼是涂层中的圆形凹陷缺陷，通常由污染引起。' },
        { type: 'table', title: '原因与处理', headers: ['可能原因', '特征', '处理方案'], rows: [
          ['油污', '圆形凹陷，周围有堆边', '清洁环境和设备'],
          ['硅油污染', '明显凹陷，难以消除', '彻底清除硅油源'],
          ['灰尘颗粒', '中心有颗粒', '过滤胶液，净化环境'],
          ['基材缺陷', '位置固定', '检查基材质量']
        ]},
        { type: 'tip', tipType: 'warning', content: '硅油是最难处理的污染源，需彻底排查生产线上的硅油使用。' }
      ]
    },
    'defect-streak': {
      sections: [
        { type: 'text', content: '纵向条纹是沿涂布方向的连续线状缺陷。' },
        { type: 'table', title: '原因与处理', headers: ['可能原因', '特征', '处理方案'], rows: [
          ['模唇刮伤', '固定位置条纹', '抛光或更换模唇'],
          ['颗粒堵塞', '条纹可能变化', '过滤胶液，清洁模头'],
          ['网穴堵塞(凹版)', '固定位置', '清洗网穴'],
          ['刮刀缺陷', '对应刮刀位置', '更换刮刀']
        ]},
        { type: 'tip', tipType: 'info', content: '模唇精度要求极高，Ra<0.1μm，轻微划痕即可产生条纹。' }
      ]
    },
    'defect-bubble': {
      sections: [
        { type: 'text', content: '气泡夹带是空气被卷入涂层的缺陷，影响外观和性能。' },
        { type: 'table', title: '原因与处理', headers: ['可能原因', '机理', '处理方案'], rows: [
          ['G/H过大', '动态接触线失稳', '减小涂布间隙'],
          ['速度过快', '空气来不及排出', '降低线速度'],
          ['胶液含气', '搅拌/泵送带入气泡', '脱泡处理'],
          ['真空度不足', '贴合时残留气泡', '提高真空度']
        ]},
        { type: 'formula', title: '临界条件', formula: 'G/H > 2.5', description: '间隙比过大时易发生气泡夹带' }
      ]
    },
    'dry-blister': {
      sections: [
        { type: 'text', content: '干燥起泡是涂层在干燥过程中产生气泡的缺陷。' },
        { type: 'table', title: '原因与处理', headers: ['可能原因', '机理', '处理方案'], rows: [
          ['干燥温度过高', '溶剂剧烈沸腾', '降低初段温度'],
          ['涂层过厚', '内部溶剂难挥发', '分层涂布'],
          ['表干过快', '表面结皮包裹溶剂', '降低表面风速']
        ]},
        { type: 'tip', tipType: 'warning', content: '初段干燥温度应低于溶剂沸点10-20°C，逐段升温。' }
      ]
    },
    'dry-skin': {
      sections: [
        { type: 'text', content: '结皮是涂层表面干燥过快，形成一层"皮"阻碍内部干燥。' },
        { type: 'table', title: '原因与处理', headers: ['可能原因', '表现', '处理方案'], rows: [
          ['初段温度过高', '表面光亮但内部软', '降低初段温度'],
          ['风速过大', '快速表干', '减小初段风速'],
          ['溶剂挥发太快', '表面与内部干燥不同步', '添加慢干溶剂']
        ]}
      ]
    },
    'dry-crack': {
      sections: [
        { type: 'text', content: '龟裂是涂层在干燥或固化后出现裂纹的缺陷。' },
        { type: 'list', items: [
          '机理：干燥收缩产生的内应力超过涂层内聚力',
          '机理：涂层与基材热膨胀系数不匹配',
          '机理：固化过度导致涂层脆化'
        ]},
        { type: 'table', title: '处理方案', headers: ['方法', '原理'], rows: [
          ['减薄涂层', '降低收缩应力'],
          ['添加柔性单体', '提高涂层韧性'],
          ['分层涂布', '每层应力分散'],
          ['降低固化程度', '保持一定柔韧性']
        ]}
      ]
    },
    'dry-white': {
      sections: [
        { type: 'text', content: '白化是涂层变白失透的现象，影响光学性能。' },
        { type: 'table', title: '原因与处理', headers: ['可能原因', '机理', '处理方案'], rows: [
          ['吸湿', '空气水分凝结在涂层', '控制干燥环境湿度'],
          ['相分离', '组分不相容析出', '优化配方相容性'],
          ['结晶', '组分结晶', '调整组分或工艺'],
          ['气泡微孔', '微气泡散射光线', '脱泡处理']
        ]},
        { type: 'tip', tipType: 'info', content: '干燥环境相对湿度建议<50%，避免吸湿白化。' }
      ]
    },
    'perf-tack': {
      sections: [
        { type: 'text', content: '初粘力不足是常见的性能问题，影响胶带的即时粘贴效果。' },
        { type: 'table', title: '原因与处理', headers: ['可能原因', '机理', '处理方案'], rows: [
          ['Tg过高', '分子链移动受限', '增加软单体比例'],
          ['增粘树脂不足', '润湿性不够', '增加增粘树脂用量'],
          ['交联过度', '胶层过硬', '减少交联剂用量'],
          ['表面污染', '润湿不良', '清洁被粘表面']
        ]},
        { type: 'tip', tipType: 'info', content: '压敏胶的Tg通常设计在-30~-50°C范围，以获得良好初粘。' }
      ]
    },
    'perf-peel': {
      sections: [
        { type: 'text', content: '剥离力偏低影响胶带的粘接可靠性。' },
        { type: 'table', title: '原因与处理', headers: ['可能原因', '机理', '处理方案'], rows: [
          ['润湿不良', '接触面积不足', '表面处理/降低Tg'],
          ['涂布量不足', '胶层太薄', '增加涂布量'],
          ['交联不足', '内聚力低，界面粘结受限', '优化交联程度'],
          ['基材问题', '离型力过高', '更换离型膜']
        ]}
      ]
    },
    'perf-shear': {
      sections: [
        { type: 'text', content: '保持力差意味着胶带抵抗剪切蠕变能力不足。' },
        { type: 'table', title: '原因与处理', headers: ['可能原因', '机理', '处理方案'], rows: [
          ['交联不足', '分子链易滑移', '增加交联剂用量'],
          ['Tg过低', '室温下过于柔软', '提高Tg'],
          ['增粘树脂过多', '降低内聚力', '减少增粘树脂'],
          ['熟化不完全', '交联未完成', '延长熟化时间']
        ]},
        { type: 'tip', tipType: 'info', content: '凝胶分率是判断交联程度的直接指标，建议定期检测。' }
      ]
    },
    'perf-residue': {
      sections: [
        { type: 'text', content: '残胶是剥离后胶黏剂残留在被粘物表面的现象。' },
        { type: 'list', items: [
          '机理：界面粘结力 > 内聚力，发生内聚破坏',
          '根本原因：交联不足导致内聚力低',
          '加剧因素：高温、长时间贴合、老化'
        ]},
        { type: 'table', title: '处理方案', headers: ['方法', '效果'], rows: [
          ['增加交联', '提高内聚力'],
          ['降低极性单体', '降低界面粘结'],
          ['缩短贴合时间', '减少润湿程度'],
          ['降低使用温度', '避免高温软化']
        ]}
      ]
    },
    'perf-aging': {
      sections: [
        { type: 'text', content: '老化降解导致胶带性能随时间下降。' },
        { type: 'table', title: '老化类型与机制', headers: ['老化类型', '机制', '表现', '解决方案'], rows: [
          ['热氧老化', '自由基链式氧化', '变硬/变脆', '添加抗氧剂'],
          ['UV老化', '光引发降解', '变黄/粉化', '添加UV吸收剂'],
          ['水解老化', '酯键水解', '发粘/失粘', '使用耐水解树脂'],
          ['热老化', '交联继续反应', '变硬', '控制交联程度']
        ]},
        { type: 'tip', tipType: 'info', content: '抗氧剂典型用量0.1-0.5%，UV吸收剂0.5-2%。' }
      ]
    }
  }
}
