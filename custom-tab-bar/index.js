Component({
  data: {
    selected: 0,
    indicatorLeft: 20,
    tabs: [
      { pagePath: '/pages/index/index', text: '首页', iconPath: '/images/tabbar/home.jpg', selectedIconPath: '/images/tabbar/home_selected.jpg' },
      { pagePath: '/pages/route-overview/route-overview', text: '路线', iconPath: '/images/tabbar/route.jpg', selectedIconPath: '/images/tabbar/route_selected.jpg' },
      { pagePath: '/pages/community/community', text: '社区', iconPath: '/images/tabbar/community.jpg', selectedIconPath: '/images/tabbar/community_selected.jpg' },
      { pagePath: '/pages/statistics/statistics', text: '统计', iconPath: '/images/tabbar/statistics.jpg', selectedIconPath: '/images/tabbar/statistics_selected.jpg' },
      { pagePath: '/pages/profile/profile', text: '我的', iconPath: '/images/tabbar/profile.jpg', selectedIconPath: '/images/tabbar/profile_selected.jpg' }
    ]
  },
  lifetimes: {
    attached() {
      const info = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync()
      const w = info.windowWidth || 375
      const count = this.data.tabs.length
      const itemW = w / count
      const indicatorW = 30 // px
      const padding = 20 * (info.pixelRatio || 2) / (info.pixelRatio || 2) // roughly 20rpx -> px compensation not needed
      const left = padding + itemW * this.data.selected + (itemW - indicatorW) / 2
      this.setData({ indicatorLeft: left })
      wx.createSelectorQuery().in(this).select('#tabbarWrapper').boundingClientRect(rect => {
        if (rect && rect.height) {
          const app = getApp()
          app.globalData = app.globalData || {}
          app.globalData.tabbarHeight = rect.height
        }
      }).exec()
    }
  },
  methods: {
    setSelected(idx) {
      const info = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync()
      const w = info.windowWidth || 375
      const count = this.data.tabs.length
      const itemW = w / count
      const indicatorW = 30 // px
      const padding = 0
      const left = padding + itemW * idx + (itemW - indicatorW) / 2
      this.setData({ selected: idx, indicatorLeft: left });
    },
    onTap(e) {
      const idx = e.currentTarget.dataset.index;
      const tab = this.data.tabs[idx];
      this.setSelected(idx);
      wx.switchTab({ url: tab.pagePath });
    }
  }
})
