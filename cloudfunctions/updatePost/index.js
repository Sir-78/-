const cloud = require('wx-server-sdk');

cloud.init({
  env: 'cloud1-4gbqo5yb0b5cb502'
});

const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;

  if (!openid) {
    console.error('[updatePost] Error: OpenID is not available.');
    return {
      success: false,
      error: '无法获取用户信息，请确保您已登录',
    };
  }

  const { postId, content, images, location } = event;

  if (!postId) {
    return {
      success: false,
      error: '缺少 postId 参数',
    };
  }

  // 至少需要更新一项内容
  if (content === undefined && images === undefined && location === undefined) {
    return {
      success: false,
      error: '没有提供任何更新内容',
    };
  }

  try {
    // 检查帖子是否存在以及用户是否有权限编辑
    const postDoc = db.collection('posts').doc(postId);
    const post = await postDoc.get();

    if (!post.data) {
      return {
        success: false,
        error: '帖子不存在',
      };
    }

    // 只有帖子的创建者才能编辑
    if (post.data._openid !== openid) {
      return {
        success: false,
        error: '无权限编辑该帖子',
      };
    }

    const updateData = {};
    if (content !== undefined) {
      if (typeof content !== 'string' || content.trim() === '') {
        return { success: false, error: '帖子内容不能为空' };
      }
      updateData.content = content;
    }
    if (images !== undefined) { // images应该是新的fileID数组
      if (!Array.isArray(images)) {
        return { success: false, error: '图片数据格式不正确' };
      }
      updateData.images = images;
    }
    if (location !== undefined) { // location可以是null或者对象
      updateData.location = location;
    }
    
    // 如果没有有效更新字段，则不执行更新
    if (Object.keys(updateData).length === 0) {
        return {
            success: true, // 或者 false，取决于业务逻辑，这里认为没有改动也是一种成功
            message: '没有检测到有效更新内容'
        };
    }

    updateData.lastModified = new Date(); // 添加最后修改时间

    const result = await postDoc.update({
      data: updateData,
    });

    if (result.stats.updated === 1) {
      return {
        success: true,
      };
    } else {
      // 如果 updated 为 0，可能是因为提交的数据与原数据完全相同
      // 或者 postId 不存在 (理论上前面已检查)
      // 根据业务需求，可以认为数据未变也是一种成功
      return {
        success: true, 
        message: '数据未发生变化或更新失败',
        stats: result.stats
      };
    }
  } catch (err) {
    console.error('[云函数] [updatePost] 执行失败:', err);
    return {
      success: false,
      error: err.message || '更新帖子时发生错误',
    };
  }
};