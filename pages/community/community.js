Page({
  data: {
    posts: []
  },
  onLoad: function() {
    // 页面加载时可以从服务器获取最新帖子
    this.loadPosts();
  },
  onShow: function() {
    
  },

  loadPosts: function() {
    wx.showLoading({
      title: '加载中...',
    });
    const store = require('../../core/data-store');
    const list = store.listPosts() || [];
    wx.hideLoading();
    if (Array.isArray(list) && list.length > 0) {
      this.setData({ posts: list });
    } else {
      this.setMockPosts();
    }
  },
  setMockPosts: function() {
    const mock = [
      { id: 'p1', title: '沙坡头夜徒步体验', content: '星空下的沙漠徒步，精彩回顾。', date: Date.now() - 86400000 },
      { id: 'p2', title: '贺兰山古道骑行', content: '路线风景与装备分享。', date: Date.now() - 2 * 86400000 },
      { id: 'p3', title: '黄河大峡谷漂流', content: '安全提示与报名须知。', date: Date.now() - 3 * 86400000 }
    ];
    this.setData({
      posts: mock
    });
    const store2 = require('../../core/data-store');
    store2.setPosts(mock);
  },
  navigateToPost: function(e) {
    const postId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../post/post?id=' + postId
    });
  },
  navigateToNewPost: function() {
    wx.navigateTo({
      url: '../post/post?mode=new'
    });
  }
})
