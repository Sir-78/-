// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { postId, content } = event

  if (!postId || !content) {
    return {
      success: false,
      errMsg: '参数不完整'
    }
  }

  try {
    await db.collection('comments').add({
      data: {
        postId: postId,
        content: content,
        authorId: wxContext.OPENID,
        createTime: db.serverDate(),
        // 可以考虑加入用户信息，如昵称、头像等，需要前端传递或后端查询
        // nickName: event.nickName, 
        // avatarUrl: event.avatarUrl
      }
    })

    // 更新帖子的评论数
    await db.collection('posts').doc(postId).update({
      data: {
        comments: db.command.inc(1)
      }
    })

    return {
      success: true,
      errMsg: '评论成功'
    }
  } catch (e) {
    console.error('添加评论失败', e)
    return {
      success: false,
      errMsg: '添加评论失败'
    }
  }
}