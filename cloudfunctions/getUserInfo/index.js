// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  try {
    // 查询用户信息
    const userCollection = db.collection('users')
    let userInfo = await userCollection.where({
      _openid: openid
    }).get()

    // 如果用户不存在，则创建新用户
    if (userInfo.data.length === 0) {
      const newUser = {
        _openid: openid,
        nickName: event.userInfo ? event.userInfo.nickName : '',
        avatarUrl: event.userInfo ? event.userInfo.avatarUrl : '',
        createTime: db.serverDate(),
        updateTime: db.serverDate()
      }
      
      await userCollection.add({
        data: newUser
      })
      
      userInfo = {
        data: [newUser]
      }
    }
    // 如果用户存在且传入了新的用户信息，则更新用户信息
    else if (event.userInfo) {
      await userCollection.where({
        _openid: openid
      }).update({
        data: {
          nickName: event.userInfo.nickName,
          avatarUrl: event.userInfo.avatarUrl,
          updateTime: db.serverDate()
        }
      })
      
      userInfo.data[0] = {
        ...userInfo.data[0],
        ...event.userInfo,
        updateTime: new Date()
      }
    }

    return {
      success: true,
      data: userInfo.data[0]
    }
  } catch (err) {
    console.error('[云函数] [getUserInfo] 调用失败：', err)
    return {
      success: false,
      error: err
    }
  }
}