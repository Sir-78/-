const cloud = require('wx-server-sdk');

cloud.init({
  env: 'cloud1-4gbqo5yb0b5cb502'
});

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;

  if (!openid) {
    console.error('[deletePost] Error: OpenID is not available.');
    return {
      success: false,
      error: '无法获取用户信息，请确保您已登录',
    };
  }

  const { postId } = event;

  if (!postId) {
    return {
      success: false,
      error: '缺少 postId 参数',
    };
  }

  try {
    // 检查帖子是否存在以及用户是否有权限删除
    const post = await db.collection('posts').doc(postId).get();

    if (!post.data) {
      return {
        success: false,
        error: '帖子不存在',
      };
    }

    // 只有帖子的创建者才能删除
    if (post.data._openid !== openid) {
      return {
        success: false,
        error: '无权限删除该帖子',
      };
    }

    // 执行删除操作
    const result = await db.collection('posts').doc(postId).remove();

    if (result.stats.removed === 1) {
      // 如果帖子包含图片，理论上还应该删除云存储中的图片文件
      // 但这需要遍历 images 数组中的 fileID 并调用 cloud.deleteFile
      // 为简化起见，此处暂不实现图片文件的删除
      // if (post.data.images && post.data.images.length > 0) {
      //   try {
      //     await cloud.deleteFile({ fileList: post.data.images });
      //   } catch (deleteFileError) {
      //     console.error(`[deletePost] Failed to delete images for post ${postId}:`, deleteFileError);
      //     // 即使图片删除失败，也认为帖子记录删除成功
      //   }
      // }
      return {
        success: true,
      };
    } else {
      return {
        success: false,
        error: '删除帖子失败，未找到或未删除任何记录',
      };
    }
  } catch (err) {
    console.error('[云函数] [deletePost] 执行失败:', err);
    return {
      success: false,
      error: err.message || '删除帖子时发生错误',
    };
  }
};