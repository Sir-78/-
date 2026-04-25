const cloud = require('wx-server-sdk');

cloud.init({
  env: 'cloud1-4gbqo5yb0b5cb502' // 使用项目文档中指定的云环境ID
});

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;

  if (!openid) {
    console.error('[createPost] Error: OpenID is not available. User might not be logged in.');
    return {
      success: false,
      error: '无法获取用户信息，请确保您已登录',
    };
  }

  try {
    const { content, images, location } = event; // 'images' 应该是客户端上传后得到的 fileID 数组

    // 参数校验：内容不能为空
    if (!content || content.trim() === '') {
      return {
        success: false,
        error: '帖子内容不能为空',
      };
    }

    // 获取发帖用户信息
    let authorInfoToStore;
    try {
      const userRecord = await db.collection('users').doc(openid).get();
      if (userRecord.data) {
        authorInfoToStore = {
          nickName: userRecord.data.nickName || '匿名用户',
          avatarUrl: userRecord.data.avatarUrl || '/images/default-avatar.png', // 项目内的默认头像路径
        };
      } else {
        // 如果在 'users' 集合中未找到该 openid 对应的文档
        console.warn(`[createPost] User document not found for openid: ${openid}. Using default author info.`);
        authorInfoToStore = {
          nickName: '匿名用户',
          avatarUrl: '/images/default-avatar.png',
        };
      }
    } catch (userFetchError) {
      console.error(`[createPost] Error fetching user info for openid ${openid}:`, userFetchError);
      // 获取用户信息失败，也使用默认信息，确保发帖流程能继续
      authorInfoToStore = {
        nickName: '匿名用户',
        avatarUrl: '/images/default-avatar.png',
      };
    }

    // 准备存入数据库的帖子数据
    const postData = {
      _openid: openid,
      authorInfo: authorInfoToStore,
      content: content,
      images: images || [], // 存储 FileID 数组
      location: location || null, // 地理位置对象 {latitude, longitude, name}
      date: new Date(), // 使用服务器当前时间
      likes: 0,
      comments: [], // 初始化评论数组
      // 可以考虑增加一个 status 字段，如 'visible', 'pending_review', 'deleted'
      // status: 'visible', 
    };

    const postsCollection = db.collection('posts');
    const result = await postsCollection.add({
      data: postData,
    });

    return {
      success: true,
      postId: result._id, // 返回新帖子的 ID
    };

  } catch (err) {
    console.error('[云函数] [createPost] 执行失败:', err);
    return {
      success: false,
      error: err.message || '发布帖子失败，请稍后再试',
    };
  }
};