Page({
  data: {
    mode: 'view', // 'view' 或 'new' 或 'edit'
    postId: null,
    post: null,
    newPostContent: '',
    newPostImages: [],
    currentLocation: null,
    locationText: '点击获取位置',
    myOpenId: wx.getStorageSync('openid'), // 用于判断是否为作者

    comments: [],
    commentInputValue: '',
    isLoadingComments: false,
    submittingComment: false
  },
  onLoad: function(options) {
    if (options.mode === 'new') {
      this.setData({
        mode: 'new'
      });
    } else if (options.id) {
      const postId = options.id;
      if (options.mode === 'edit') {
        // 编辑帖子
        this.setData({
          mode: 'edit',
          postId: postId
        });
        this.loadPostData(postId, true); // true 表示是编辑模式
      } else {
        // 查看已有帖子
        this.setData({
          mode: 'view',
          postId: postId
        });
        this.loadPostData(postId);
      }
    }
  },
  loadPostData: function(postId, isEditMode = false) {
    wx.showLoading({
      title: '加载中...',
    });
    const store = require('../../core/data-store');
    const posts = store.listPosts();
    const postData = posts.find(p => p.id === postId);
    wx.hideLoading();
    if (postData) {
      postData.formattedCreateTime = new Date(postData.date).toLocaleString();
      this.setData({
        post: postData,
        myOpenId: wx.getStorageSync('openid')
      });
      if (isEditMode) {
        this.setData({
          newPostContent: postData.content || '',
          newPostImages: postData.images || [],
          currentLocation: postData.location || null,
          locationText: postData.location ? (postData.location.name || `位置(${postData.location.latitude.toFixed(4)}, ${postData.location.longitude.toFixed(4)})`) : '点击获取位置'
        });
      }
      this.loadComments(postId);
    } else {
      wx.showToast({ title: '帖子不存在', icon: 'none' });
    }
  },
  onContentInput: function(e) {
    this.setData({
      newPostContent: e.detail.value
    });
  },
  chooseImage: function() {
    const remainingCount = 9 - this.data.newPostImages.length;
    if (remainingCount <= 0) {
      wx.showToast({
        title: '最多选择9张图片',
        icon: 'none'
      });
      return;
    }
    wx.chooseMedia({
      count: remainingCount,
      mediaType: ['image'],
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFiles = res.tempFiles;
        const tempFilePaths = tempFiles.map(file => file.tempFilePath);
        this.setData({
          newPostImages: this.data.newPostImages.concat(tempFilePaths)
        });
      },
      fail: (err) => {
        if (err.errMsg !== "chooseMedia:fail cancel") {
          console.error("选择图片失败: ", err);
          wx.showToast({
            title: '选择图片失败',
            icon: 'none'
          });
        }
      }
    });
  },
  removeImage: function(e) {
    const index = e.currentTarget.dataset.index;
    const images = this.data.newPostImages;
    images.splice(index, 1);
    this.setData({
      newPostImages: images
    });
  },
  // 获取当前位置
  getLocation: function() {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation'] === false) {
          // 用户已拒绝授权，引导用户去设置页开启
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权，否则无法获取当前位置信息。',
            success: (modalRes) => {
              if (modalRes.confirm) {
                wx.openSetting({
                  success: (settingRes) => {
                    if (settingRes.authSetting['scope.userLocation']) {
                      this.fetchLocation();
                    } else {
                      wx.showToast({ title: '授权失败', icon: 'none' });
                 }
                  }
                });
              }
            }
          });
        } else if (res.authSetting['scope.userLocation'] === undefined) {
          // 用户未授权过，发起授权请求
          wx.authorize({
            scope: 'scope.userLocation',
            success: () => {
              this.fetchLocation();
            },
            fail: (authErr) => {
              console.error('请求位置授权失败:', authErr);
              wx.showToast({ title: '授权失败', icon: 'none' });
            }
          });
        } else {
          // 用户已授权
          this.fetchLocation();
        }
      }
    });
  },

  // 获取具体位置信息
  fetchLocation: function() {
    wx.showLoading({ title: '正在定位...' });
    wx.getLocation({
      type: 'gcj02',
      isHighAccuracy: true,
      success: (res) => {
        wx.hideLoading();
        const latitude = res.latitude;
        const longitude = res.longitude;
        this.setData({
          currentLocation: {
            latitude: latitude,
            longitude: longitude,
            name: '未知地点'
          },
          locationText: '已选择位置'
        });
        this.reverseGeocode(latitude, longitude);
      },
      fail: (err) => {
        wx.hideLoading();
        wx.showToast({
          title: '获取位置失败',
          icon: 'none'
        });
        console.error("获取位置失败: ", err);
        // 已有 wx.showToast 提示，此处仅保留日志
      }
    });
  },

  // 逆地址解析
  reverseGeocode: function(latitude, longitude) {
    this.setData({
      'currentLocation.name': `位置(${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
      locationText: `位置(${latitude.toFixed(4)}, ${longitude.toFixed(4)})`
    });
  },

  clearLocation: function() {
    this.setData({ currentLocation: null, locationText: '点击获取位置' });
  },

  // 手动选择位置
  chooseLocation: function() {
    wx.chooseLocation({
      success: (res) => {
        this.setData({
          currentLocation: {
            latitude: res.latitude,
            longitude: res.longitude,
            name: res.name || res.address
          },
          locationText: res.name || res.address
        });
      },
      fail: (err) => {
        if (err.errMsg !== "chooseLocation:fail cancel") {
          wx.showToast({
            title: '选择位置失败',
            icon: 'none'
          });
          console.error('手动选择位置失败:', err);
        }
      }
    });
  },

  // 删除帖子
  deletePost: function() {
    wx.showModal({
      title: '确认删除',
      content: '删除后无法恢复，确定要删除这条帖子吗？',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '删除中...' });
          const postId = this.data.postId;
          const store = require('../../core/data-store');
          store.deletePost(postId);
          store.addPointsDelta(-1, 'delete_post');
          wx.hideLoading();
          wx.showToast({ title: '删除成功', icon: 'success' });
          setTimeout(() => { wx.navigateBack(); }, 1200);
        }
      }
    });
  },

  submitPost: async function() {
    const { mode, postId, newPostContent, newPostImages, currentLocation } = this.data;
    if (!this.data.newPostContent.trim() && this.data.newPostImages.length === 0) {
      wx.showToast({
        title: '内容和图片至少填一项',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({
      title: '发布中...'
    });

    const userInfo = wx.getStorageSync('userInfo');
    if (!userInfo) {
      wx.hideLoading();
      wx.showToast({
        title: '请先授权登录',
        icon: 'none',
        duration: 2000,
        complete: () => {
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/profile/profile'
            });
          }, 2000);
        }
      });
      return;
    }

    try {
      if (mode === 'edit') {
        const store = require('../../core/data-store');
        const posts = store.listPosts()
        const idx = posts.findIndex(p => p.id === postId);
        if (idx >= 0) {
          store.updatePost(postId, { content: newPostContent, images: newPostImages, location: currentLocation });
          wx.hideLoading();
          wx.showToast({ title: '更新成功', icon: 'success' });
          this.loadPostData(postId);
          this.setData({ mode: 'view' });
        } else {
          wx.hideLoading();
          wx.showToast({ title: '帖子不存在', icon: 'none' });
        }
      } else {
        const id = 'p' + Date.now();
        const store = require('../../core/data-store');
        const newPost = { id, type: 'normal', content: this.data.newPostContent, images: this.data.newPostImages, location: this.data.currentLocation, date: Date.now(), likes: 0, comments: [] };
        store.addPost(newPost);
        store.addPointsDelta(1, 'create_post');
        if (/预约|booking/i.test(this.data.newPostContent)) {
          store.addBooking({ id: 'bk_'+Date.now(), routeId: 'post_' + id, routeName: (this.data.currentLocation && this.data.currentLocation.name) || '预约帖子', status: '进行中', rating: 0, date: Date.now(), sourceType: 'post', sourceId: id });
        }
        wx.hideLoading();
        wx.showToast({ title: '发布成功', icon: 'success' });
        this.setData({ newPostContent: '', newPostImages: [], currentLocation: null, locationText: '点击获取位置' });
        setTimeout(() => {
          const stack = getCurrentPages();
          if (stack.length > 1) {
            const prevPage = stack[stack.length - 2];
            if (prevPage.route === 'pages/community/community') {
              wx.navigateBack();
              return;
            }
          }
          wx.switchTab({ url: '/pages/community/community' });
        }, 1200);
      }
    } catch (error) {
      wx.hideLoading();
      wx.showToast({
        title: '操作失败: ' + error.message,
        icon: 'none'
      });
      console.error('[submitPost] 错误:', error);
    }
  },
  // submitPost函数结束
  likePost: function() { 
    if (this.data.post) {
      const post = this.data.post;
      post.likes += 1;
      this.setData({
        post: post
      });
    }
  }, // 添加逗号

  // 加载评论
  loadComments: function(postId) {
    if (!postId) return;
    this.setData({ isLoadingComments: true });
    const store = require('../../core/data-store');
    const cm = store.getCommentsMap();
    const list = cm[postId] || [];
    this.setData({ comments: list, isLoadingComments: false });
  },
  
  editPost: function() {
    const post = this.data.post;
    if (!post) return;
    this.setData({
      mode: 'edit',
      newPostContent: post.content || '',
      newPostImages: post.images || [],
      currentLocation: post.location || null,
      locationText: post.location ? (post.location.name || '已选择位置') : '点击获取位置'
    });
  },
  
  // 编辑帖子函数已移至submitPost中

  // 评论输入
  onCommentInput: function(e) {
    this.setData({
      commentInputValue: e.detail.value
    });
  },

  // 提交评论
  submitComment: async function() {
    const content = this.data.commentInputValue.trim();
    if (!content) {
      wx.showToast({
        title: '评论内容不能为空',
        icon: 'none'
      });
      return;
    }

    const userInfo = wx.getStorageSync('userInfo');
    if (!userInfo) {
      wx.showToast({
        title: '请先授权登录',
        icon: 'none',
        duration: 2000,
        complete: () => {
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/profile/profile'
            });
          }, 1500);
        }
      });
      return;
    }

    this.setData({ submittingComment: true });
    wx.showLoading({ title: '提交中...' });
    
    // 获取当前帖子ID和评论内容
    const { postId } = this.data;
    const commentContent = this.data.commentInputValue.trim();
    
    try {
      const store = require('../../core/data-store');
      const item = { _id: 'c' + Date.now(), content: commentContent, authorInfo: { nickName: userInfo.nickName || '匿名用户', avatarUrl: userInfo.avatarUrl || '/images/default-avatar.png' }, formattedCreateTime: new Date().toLocaleString(), ts: Date.now() };
      store.addComment(postId, item);
      wx.hideLoading();
      wx.showToast({ title: '评论成功', icon: 'success' });
      this.setData({ commentInputValue: '', submittingComment: false });
      this.loadComments(postId);
    } catch (error) {
      wx.hideLoading();
      wx.showToast({ title: '评论失败: ' + error.message, icon: 'none' });
      this.setData({ submittingComment: false });
    }
  },
  
  // 提交新帖子
  submitNewPost: async function() {
    this.submitPost();
  }
  }
);
