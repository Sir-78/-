// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const { postId } = event

  if (!postId) {
    return {
      success: false,
      errMsg: '缺少 postId 参数'
    }
  }

  try {
    const res = await db.collection('comments')
      .where({
        postId: postId
      })
      .orderBy('createTime', 'asc') // 评论按时间升序排列
      .get()

    // 可以考虑在这里联表查询用户信息，将 authorId 替换为更详细的用户昵称和头像
    // 例如：
    // const comments = res.data;
    // const userPromises = comments.map(comment => {
    //   return db.collection('users').doc(comment.authorId).field({ nickName: true, avatarUrl: true }).get();
    // });
    // const userResults = await Promise.all(userPromises);
    // const populatedComments = comments.map((comment, index) => {
    //   return {
    //     ...comment,
    //     authorInfo: userResults[index].data
    //   };
    // });

    return {
      success: true,
      data: res.data // 如果做了用户信息关联，这里返回 populatedComments
    }
  } catch (e) {
    console.error('获取评论列表失败', e)
    return {
      success: false,
      errMsg: '获取评论列表失败'
    }
  }
}