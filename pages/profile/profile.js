// pages/profile/profile.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false,
    userStats: {
      coupons: 0,
      favorites: 0,
      messages: 0
    },
    isLoading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    this.checkLoginStatus();
  },
  
  /**
   * 导航到指定页面
   */
  navigateTo: function(e) {
    const url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url
    });
  },
  
  /**
   * 打开客服会话
   */
  openContact: function() {
    // 微信小程序中，客服会话通常通过button的open-type="contact"实现
    // 这里可以添加额外的逻辑，如记录用户打开客服的行为等
    console.log('用户打开了客服会话');
  },
  
  /**
   * 退出登录
   */
  logout: function() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          // 清除本地存储的用户信息
          wx.removeStorageSync('userInfo');
          wx.removeStorageSync('token');
          
          // 更新页面状态
          this.setData({
            userInfo: {},
            hasUserInfo: false,
            userStats: {
              coupons: 0,
              favorites: 0,
              messages: 0
            }
          });
          
          wx.showToast({
            title: '已退出登录',
            icon: 'success'
          });
        }
      }
    });
  },

  /**
   * 检查登录状态
   */
  checkLoginStatus: function() {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        userInfo: userInfo,
        hasUserInfo: true
      });
      this.loadUserData();
    }
  },

  /**
   * 用户登录
   */
  login: function() {
    this.setData({ isLoading: true });
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: (res) => {
        const userInfo = res.userInfo;
        wx.setStorageSync('userInfo', userInfo);
        this.setData({
          userInfo: userInfo,
          hasUserInfo: true,
          isLoading: false
        });
        this.loadUserData();
        
        // 显示登录成功提示
        wx.showToast({
          title: '登录成功',
          icon: 'success'
        });
      },
      fail: (err) => {
        console.error('获取用户信息失败', err);
        this.setData({ isLoading: false });
        wx.showToast({
          title: '获取用户信息失败',
          icon: 'none'
        });
      }
    });
  },

  refreshLocalData: function() {
    this.setData({ isLoading: true });
    const store = require('../../core/data-store');
    store.ensureReady()
    const posts = store.listPosts()
    const bookings = store.listBookings()
    const totalLikes = posts.reduce((sum, p) => sum + (p.likes || 0), 0);
    const completedBookings = bookings.filter(b => b.status === '已完成').length;
    this.setData({
      posts: posts,
      bookings: bookings,
      statistics: {
        totalBookings: bookings.length,
        completedBookings: completedBookings,
        totalPosts: posts.length,
        totalLikes: totalLikes
      },
      isLoading: false
    });
  },
  
  /**
   * 切换标签页
   */
  switchTab: function(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      activeTab: tab
    });
  },
  
  /**
   * 查看更多预约
   */
  viewMoreBookings: function() {
    this.setData({
      showAllBookings: !this.data.showAllBookings
    });
  },
  
  /**
   * 查看更多帖子
   */
  viewMorePosts: function() {
    this.setData({
      showAllPosts: !this.data.showAllPosts
    });
  },
  
  /**
   * 跳转到预约详情
   */
  goToBookingDetail: function(e) {
    const bookingId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/booking/booking?id=${bookingId}&mode=view`
    });
  },
  
  /**
   * 跳转到帖子详情
   */
  goToPostDetail: function(e) {
    const postId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/post/post?id=${postId}`
    });
  },
  
  /**
   * 跳转到设置页面
   */
  goToSettings: function() {
    wx.showToast({
      title: '设置功能开发中',
      icon: 'none'
    });
    // 实际开发时可以跳转到设置页面
    // wx.navigateTo({
    //   url: '/pages/settings/settings'
    // });
  },
  
  /**
   * 退出登录
   */
  logout: function() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          // 清除本地存储的用户信息
          wx.removeStorageSync('userInfo');
          this.setData({
            userInfo: {},
            hasUserInfo: false,
            bookings: [],
            posts: [],
            statistics: {
              totalBookings: 0,
              completedBookings: 0,
              totalPosts: 0,
              totalLikes: 0
            }
          });
          wx.showToast({
            title: '已退出登录',
            icon: 'success'
          });
        }
      }
    });
  },

  // 获取用户帖子数据
  getUserPosts: function() {
    const store = require('../../core/data-store');
    const posts = store.listPosts() || [];
    this.setData({ posts });
  },

  /**
   * 加载用户数据
   */
  loadUserData: function() {
    this.setData({ isLoading: true });
    
    // 由于没有getUserStats云函数，使用模拟数据
    // 后续可以创建getUserStats云函数来获取真实数据
    setTimeout(() => {
      this.setData({
        userStats: {
          coupons: 5,
          favorites: 8,
          messages: 3
        },
        isLoading: false
      });
    }, 500);
    
    // 保留云函数位置注释，已切换为本地数据
  },

  // 保留 loadUserData 作为旧的模拟数据加载方式的备份，或者移除它
  // loadUserData: function() { ... },

  /**
   * 跳转到预约详情页
   */
  goToBookingDetail: function(event) {
    const bookingId = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/bookingDetail/bookingDetail?id=' + bookingId
    });
  },

  /**
   * 跳转到帖子详情页
   */
  goToPostDetail: function(event) {
    const postId = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/postDetail/postDetail?id=' + postId
    });
  },

  /**
   * 跳转到设置页面
   */
  goToSettings: function() {
    wx.navigateTo({
      url: '/pages/settings/settings'
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({ userInfo, hasUserInfo: true });
      this.refreshLocalData();
    } else {
      this.setData({ userInfo: {}, hasUserInfo: false, bookings: [], posts: [] });
    }
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    if (this.data.hasUserInfo) {
      this.refreshLocalData();
      wx.stopPullDownRefresh();
    } else {
      wx.stopPullDownRefresh();
      wx.showToast({ title: '请先登录', icon: 'none' });
    }
  }
  // 其他生命周期函数和事件处理函数保持不变
  // onReady, onHide, onUnload, onReachBottom, onShareAppMessage
})
