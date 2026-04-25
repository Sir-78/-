// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  try {
    const postsCollection = db.collection('posts')
    const postsResult = await postsCollection.where({
      _openid: openid
    }).orderBy('date', 'desc').get()

    const postsData = postsResult.data.map(post => ({
      ...post,
      id: post._id
    }));

    return {
      success: true,
      data: postsData
    }
  } catch (err) {
    console.error('[云函数] [getPosts] 调用失败：', err)
    return {
      success: false,
      error: err
    }
  }
}