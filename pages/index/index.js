// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // Initialize with empty arrays for the data that will be displayed
    banners: [],
    navItems: [],
    popularRoutes: [],
    popularPosts: [],
    searchKeyword: '',
    mapMarkers: [],
    mapCenter: { latitude: 0, longitude: 0 },
    mapScale: 7,
    categories: [],
    selectedCategory: 'all',
    markerRouteMap: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const bus = require('../../core/event-bus')
    this.unsubscribe = bus.on('data.changed', () => { this.computeHomeData() })
    this.computeHomeData()
  },
  onUnload() {
    if (this.unsubscribe) this.unsubscribe()
  },
  computeHomeData() {
    const store = require('../../core/data-store')
    const selectors = require('../../core/selectors')
    store.ensureReady()
    const routes = store.listRoutes()
    const bookings = store.listBookings()
    const posts = store.listPosts()
    const popularRoutes = selectors.popularRoutes(routes, bookings, { start: null, end: null }).map(r => {
      const base = routes.find(rt => rt._id === r.id) || {}
      const cat = base.category || '其他'
      const catKey = (cat === '自然风光') ? 'nature'
        : (cat === '河流体育旅游') ? 'river'
        : (cat === '红色文化体验') ? 'red'
        : (cat === '乡村体育旅游') ? 'rural'
        : (cat === '冰雪体育旅游') ? 'snow'
        : (cat === '沙漠徒步') ? 'desert'
        : 'other'
      return {
        id: r.id,
        name: r.name,
        city: '',
        duration: '',
        tags: [],
        imageUrl: r.coverUrl || '',
        categoryKey: catKey
      }
    })
    const sortedPosts = posts.slice().sort((a,b)=>b.date-a.date).slice(0,5).map(p => ({
      id: p.id,
      author: (p.author && p.author.nickName) || '匿名',
      avatar: (p.author && p.author.avatarUrl) || '',
      content: p.content,
      images: p.images || [],
      likes: p.likes || 0,
      comments: (p.comments && p.comments.length) || 0,
      time: new Date(p.date).toLocaleDateString()
    }))
    const countsMap = {}
    routes.forEach(rt => { const c = rt.category || '其他'; countsMap[c] = (countsMap[c] || 0) + 1 })
    const categories = Object.keys(countsMap).map(name => ({ name, count: countsMap[name] }))
    const categoryImages = {
      '自然风光': 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200',
      '河流体育旅游': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200',
      '红色文化体验': 'https://images.unsplash.com/photo-1520975922240-8f0e81f3c8a6?w=1200',
      '乡村体育旅游': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200',
      '冰雪体育旅游': 'https://images.unsplash.com/photo-1519817650390-64a93db511aa?w=1200',
      '其他': 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200'
    }
    const banners = popularRoutes.slice(0,3).map(r => ({
      id: r.id,
      type: 'route',
      imageUrl: categoryImages[(routes.find(rt=>rt._id===r.id)||{}).category || '其他'] || '',
      title: r.name,
      subTitle: '精选路线'
    }))
    const navItems = [
      { id: 'nav_routes', text: '路线总览', url: '/pages/route-overview/route-overview' },
      { id: 'nav_map', text: '地图', url: '/pages/route-overview/route-overview' },
      { id: 'nav_community', text: '社区', url: '/pages/community/community' },
      { id: 'nav_stats', text: '统计', url: '/pages/statistics/statistics' },
      { id: 'nav_profile', text: '我的', url: '/pages/profile/profile' }
    ]
    const filtered = this.data.selectedCategory==='all' ? routes : routes.filter(r => r.category === this.data.selectedCategory)
    const markerRouteMap = {}
    const colorMap = { '自然风光': '#22C55E', '河流体育旅游': '#06B6D4', '红色文化体验': '#EF4444', '乡村体育旅游': '#F59E0B', '冰雪体育旅游': '#6366F1', '其他': '#607D8B' }
    const markers = filtered.filter(r => typeof r.lat === 'number' && typeof r.lng === 'number').map((r,idx) => {
      const id = idx+1
      markerRouteMap[id] = r._id
      return {
        id,
        latitude: r.lat,
        longitude: r.lng,
        title: r.name,
        callout: { content: r.name, color: '#ffffff', bgColor: colorMap[r.category] || '#22C55E', borderRadius: 8, padding: 6, display: 'ALWAYS' }
      }
    })
    const center = markers.length>0 ? { latitude: markers[0].latitude, longitude: markers[0].longitude } : { latitude: 38.5, longitude: 106.3 }
    this.setData({
      banners,
      navItems,
      popularRoutes,
      popularPosts: sortedPosts,
      categories,
      mapMarkers: markers,
      mapCenter: center,
      mapScale: 7,
      markerRouteMap
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  /**
   * 查看更多路线
   */
  viewMoreRoutes() {
    wx.navigateTo({
      url: '/pages/route-overview/route-overview',
    })
  },

  /**
   * 查看更多社区帖子
   */
  viewMorePosts() {
    wx.navigateTo({
      url: '/pages/community/community',
    })
  },

  /**
   * 搜索输入事件处理
   */
  onSearchInput(e) {
    this.setData({
      searchKeyword: e.detail.value
    })
  },

  /**
   * 搜索确认事件处理
   */
  onSearch() {
    if (this.data.searchKeyword.trim()) {
      wx.navigateTo({
        url: `/pages/search/search?keyword=${this.data.searchKeyword}`,
      })
    }
  },

  /**
   * 导航项点击事件
   */
  onNavTap(e) {
    const { type, url } = e.currentTarget.dataset;
    if (url) {
      wx.navigateTo({
        url
      })
    }
  },
  onMarkerTap(e) {
    const id = e.detail.markerId
    const rid = this.data.markerRouteMap[id]
    if (rid) {
      wx.navigateTo({ url: `/pages/routeDetail/routeDetail?id=${rid}` })
    }
  },
  setCategoryFilter(e) {
    const cat = e.currentTarget.dataset.cat
    this.setData({ selectedCategory: cat })
    this.computeHomeData()
  },
  locateMe() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.setData({ mapCenter: { latitude: res.latitude, longitude: res.longitude }, mapScale: 10 })
      },
      fail: () => {
        wx.showToast({ title: '定位失败', icon: 'none' })
      }
    })
  },

  /**
   * Banner点击事件
   */
  onBannerTap(e) {
    const { id, type } = e.currentTarget.dataset;
    if (type === 'route') {
      wx.navigateTo({
        url: `/pages/routeDetail/routeDetail?id=${id}`,
      })
    }
  },

  /**
   * 跳转到路线详情
   */
  goToRouteDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/routeDetail/routeDetail?id=${id}`,
    })
  },

  /**
   * 跳转到帖子详情
   */
  goToPostDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/post/post?id=${id}`,
    })
  },
})
