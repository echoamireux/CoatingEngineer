// 云函数入口文件：customerService/index.js
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

// ============================================================
// 🤖 自动回复文案配置区 (V3.1 Fix)
// ============================================================
const REPLIES = {
  // 1. 关键词：口令/密码
  CODE: '【自动回复】\n🔑 获取访问口令：\n\n本工具目前处于 [内部邀约] 阶段，口令会不定期更新。\n\n如需体验，请直接联系管理员获取最新口令。\n\n👉 使用方法：在首页点击任意计算卡片，在弹窗中输入口令即可解锁全部功能。',

  // 2. 关键词：教程/指南
  GUIDE: '【自动回复】\n📖 快速操作指南：\n1. 选模块：点击首页彩色卡片（如生产成本核算）；\n2. 输口令：输入您获取的口令解锁；\n3. 填参数：按提示输入工艺数据（注意单位）；\n4. 看结果：点击底部按钮生成结果。\n\n⚠️ 如遇"计算存疑"，请截图发给我们，以便核对边界条件。',
  // 3. 关键词：进不去/报错
  ERROR: '【自动回复】\n🛠 故障排查建议：\n1. 检查空格：复制口令时请确认没有多余空格；\n2. 缓存重置：请点击小程序右上角“...”，选择“重新进入小程序”；\n3. 网络环境：尝试切换 Wi-Fi / 5G 网络。\n\n如仍无法解决，请截图报错页面发送给我。',

  // 4. 关键词：费用/作者
  AUTHOR: '【自动回复】\n🤝 关于作者与费用：\n本工具由独立开发者 EA Studio 维护，完全免费，旨在提升涂布同行工作效率。\n\n❤️ 既然来了就是朋友，欢迎多多使用！如有功能建议，也欢迎留言告诉我。',

  // 5. 关键词：税务/成本
  TAX: '【自动回复】\n💰 成本核算税务逻辑：\n为确保精度，系统核心运算（能耗、折旧等）统一采用“未税” (Net Cost) 数值。\n\n1. 输入端：建议统一填入“不含税单价”；\n2. 输出端：结果页会自动展示“含税造价”与“未税造价”对比。',

  // 6. 关键词：流体/压降
  FLUID: '【自动回复】\n🌊 流体模型说明：\n本工具采用幂律模型 (Power Law) 计算：\n• 有效粘度：η_eff = K · γ^(n-1)\n• 剪切速率：γ_wall (自动计算)\n\n⚠️ 误差提示：狭缝模头压降对垫片厚度 H 呈立方级 (1/H³) 敏感，请务必校准测厚仪精度。',

  // 7. 兜底回复 (未命中关键词时)
  DEFAULT: '【自动回复】\n🤖 收到您的留言。\n\n工程师稍晚会人工回复您。\n\n您可以先尝试回复关键词获取帮助：\n【口令】 【教程】 【税务】 【流体】'
}

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  // ★★★ 调试日志 ★★★
  console.log('👉 1. 收到完整事件对象:', event)
  console.log('👉 2. 发送者ID (FromUserName):', event.FromUserName)

  const content = event.Content || ''

  // ============================================================
  // 场景A：用户进入会话 (欢迎语) - 已修复 Emoji 乱码问题
  // ============================================================
  if (event.MsgType === 'event' && event.Event === 'user_enter_tempsession') {
    console.log('👉 3. 命中场景：进入会话')
    // 这里把 '👨‍💻' 换成了更稳定的 '🤖'，避免出现 \u200d 乱码
    await sendMsg(event.FromUserName, '🤖 您好，EA Studio 工程师助手为您服务。\n\n为了提高沟通效率，您可以直接回复以下关键词获取自助服务：\n\n🔑 回复【口令】获取访问密码\n📖 回复【教程】查看操作指南\n💰 回复【税务】了解成本核算逻辑\n🌊 回复【流体】获取压降/粘度算法\n\n(若回复关键词后未收到自动应答，说明工程师正在线，稍后将由人工为您服务)')
    return 'finish_welcome'
  }

  // ============================================================
  // 场景B：用户发送文本消息 (关键词匹配)
  // ============================================================
  if (event.MsgType === 'text') {
    console.log('👉 3. 命中场景：文本消息，内容是:', content)

    let replyText = ''

    // 正则匹配逻辑 (不区分大小写)
    if (content.match(/口令|密码|code|验证码|2300/i)) replyText = REPLIES.CODE
    else if (content.match(/怎么用|教程|help|指南|说明/i)) replyText = REPLIES.GUIDE
    else if (content.match(/进不去|打不开|白屏|无效|卡住/)) replyText = REPLIES.ERROR
    else if (content.match(/收费|费用|多少钱|免费|价格|作者/)) replyText = REPLIES.AUTHOR
    else if (content.match(/税|未税|含税|单价|造价/)) replyText = REPLIES.TAX
    else if (content.match(/流体|压降|粘度|幂律|剪切|模头/)) replyText = REPLIES.FLUID

    // 如果没有匹配到任何关键词，发送兜底回复
    else {
      console.log('👉 4. 未匹配到关键字，使用默认兜底回复')
      replyText = REPLIES.DEFAULT
    }

    // 执行发送
    if (replyText) {
      console.log('👉 4. 准备发送内容:', replyText)
      await sendMsg(event.FromUserName, replyText)
    }
    return 'finish_text'
  }

  console.log('👉 3. 未命中任何场景')
  return 'finish_unknown'
}

// ============================================================
// 工具函数：发送消息
// ============================================================
async function sendMsg(openid, content) {
  try {
    await cloud.openapi.customerServiceMessage.send({
      touser: openid,
      msgtype: 'text',
      text: {
        content: content
      }
    })
    console.log('✅ 5. 消息API调用成功')
  } catch (err) {
    console.error('❌ 5. 消息API调用失败:', err)
  }
}
