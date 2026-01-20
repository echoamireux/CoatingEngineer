// 云函数入口文件：updateSettings/index.js
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

// 管理员密码 (⚠️ 从本地不提交的 secret.js 读取)
const { ADMIN_PASSWORD } = require('./secret.js')

exports.main = async (event, context) => {
  const { password, type, payload } = event

  // 1. 验证管理员密码
  if (password !== ADMIN_PASSWORD) {
    return { success: false, message: '密码错误' }
  }

  try {
    // 2. 根据操作类型更新数据库

    // === 获取所有配置 (绕过前端权限限制) ===
    if (type === 'get_all_settings') {
      const settingsRes = await db.collection('app_settings').get()
      const codeRes = await db.collection('access_codes').where({ enabled: true }).limit(1).get()

      const settings = {}
      settingsRes.data.forEach(item => settings[item.key] = item.value)

      // 兼容：确保有默认值
      if (settings.require_passcode === undefined) settings.require_passcode = true
      if (settings.show_reward === undefined) settings.show_reward = false
      if (settings.passcode_hint === undefined) settings.passcode_hint = ''

      const currentCode = codeRes.data.length > 0 ? codeRes.data[0].code : ''

      return {
        success: true,
        data: {
          settings,
          currentAccessCode: currentCode
        }
      }
    }

    // === 更新应用设置 (Switch开关) ===
    if (type === 'update_app_setting') {
      const { key, value } = payload

      // 先查询是否存在
      const check = await db.collection('app_settings').where({ key }).get()

      if (check.data.length > 0) {
        // 更新
        await db.collection('app_settings').where({ key }).update({
          data: { value }
        })
      } else {
        // 新增 (容错)
        await db.collection('app_settings').add({
          data: { key, value }
        })
      }
      return { success: true, message: '设置已更新' }
    }

    // === 更新访问口令 ===
    if (type === 'update_access_code') {
      const { newCode } = payload
      // 更新所有有效口令 (简化逻辑，直接更新第一条)
      // 也可以指定 id 更新，但为了简单，我们假设只有一个主口令
      await db.collection('access_codes').where({ enabled: true }).update({
        data: { code: newCode }
      })
      return { success: true, message: '口令已更新' }
    }

    return { success: false, message: '未知操作类型' }

  } catch (err) {
    console.error(err)
    return { success: false, message: '操作失败: ' + err.message }
  }
}
