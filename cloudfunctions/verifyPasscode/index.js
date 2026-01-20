// 云函数入口文件：verifyPasscode/index.js
// 功能：验证用户输入的访问口令
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()

exports.main = async (event) => {
  const { code } = event

  // 1. 检查是否输入了口令
  if (!code) {
    return { success: false, message: '请输入口令' }
  }

  try {
    // 2. 查询数据库中是否存在匹配的有效口令
    const result = await db.collection('access_codes').where({
      code: code,
      enabled: true
    }).get()

    if (result.data.length > 0) {
      const record = result.data[0]

      // 3. 检查口令是否已过期（可选功能）
      if (record.expiresAt && new Date(record.expiresAt) < new Date()) {
        return { success: false, message: '口令已过期' }
      }

      // 4. 验证通过
      console.log('✅ 口令验证通过:', record.name || '默认口令')
      return { success: true, message: '验证通过' }
    } else {
      // 5. 未找到匹配的有效口令
      console.log('❌ 口令验证失败: 无效口令')
      return { success: false, message: '口令错误' }
    }
  } catch (err) {
    console.error('❌ 验证过程出错:', err)
    return { success: false, message: '服务异常，请稍后重试' }
  }
}
