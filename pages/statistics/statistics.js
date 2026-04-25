// 引入echarts组件
const echarts = require('../../ec-canvas/echarts');

let barChart = null;
let pieChart = null;

// 初始化柱状图
function initBarChart(canvas, width, height, dpr) {
  barChart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr
  });
  canvas.setChart(barChart);

  // 初始空选项，数据将在加载后更新
  const option = {
    color: ['#4CAF50', '#2196F3'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['预约数', '完成数'],
      bottom: 0,
      textStyle: {
        fontSize: 10
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: [],
        axisTick: {
          alignWithLabel: true
        },
        axisLabel: {
          interval: 0,
          rotate: 30,
          fontSize: 10
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        axisLabel: {
          fontSize: 10
        }
      }
    ],
    series: [
      {
        name: '预约数',
        type: 'bar',
        barWidth: '40%',
        data: []
      },
      {
        name: '完成数',
        type: 'bar',
        barWidth: '40%',
        data: []
      }
    ]
  };

  barChart.setOption(option);
  return barChart;
}

// 初始化饼图
function initPieChart(canvas, width, height, dpr) {
  pieChart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr
  });
  canvas.setChart(pieChart);

  // 初始空选项，数据将在加载后更新
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    series: [
      {
        name: '路线类别',
        type: 'pie',
        radius: '60%',
        center: ['50%', '45%'],
        data: [],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        label: {
          show: false
        },
        labelLine: {
          show: false
        }
      }
    ]
  };

  pieChart.setOption(option);
  return pieChart;
}

const store = require('../../core/data-store')
const bus = require('../../core/event-bus')
const selectors = require('../../core/selectors')

Page({
  data: {
    // 图表配置
    bookingEc: {
      onInit: initBarChart,
      lazyLoad: true
    },
    categoryEc: {
      onInit: initPieChart,
      lazyLoad: true
    },
    // 统计数据
    totalRoutes: 0,
    totalBookings: 0,
    completedBookings: 0,
    averageRating: 0,
    totalPosts: 0,
    pointsDelta: 0,
    // 时间筛选
    timeFilter: 'month', // 默认显示本月数据
    timeFilterText: '本月',
    customStartDate: '',
    customEndDate: '',
    // 路线预约数据
    routeBookingData: [],
    // 路线类别数据
    routeCategoryData: [],
    pieChartLegend: [],
    // 热门路线
    popularRoutes: [],
    // 加载状态
    isLoading: false
  },
  
  onLoad: function() {
    this.unsubscribe = bus.on('data.changed', () => {
      this.loadStatisticsData()
    })
    this.loadStatisticsData();
  },
  
  onShow: function() {
    // 每次显示页面时刷新数据
    this.loadStatisticsData();
    
  },
  onUnload: function() {
    if (this.unsubscribe) this.unsubscribe()
    const barComp = this.selectComponent('#mychart-dom-bar')
    if (barComp && typeof barComp.dispose === 'function') barComp.dispose()
    const pieComp = this.selectComponent('#mychart-dom-pie')
    if (pieComp && typeof pieComp.dispose === 'function') pieComp.dispose()
    if (barChart) { try { barChart.dispose() } catch (e) {} barChart = null }
    if (pieChart) { try { pieChart.dispose() } catch (e) {} pieChart = null }
  },
  
  // 设置时间筛选器
  setTimeFilter: function(e) {
    const filter = e.currentTarget.dataset.filter;
    let filterText = '本月';
    
    switch(filter) {
      case 'week':
        filterText = '本周';
        break;
      case 'day':
        filterText = '本日';
        break;
      case 'month':
        filterText = '本月';
        break;
      case 'year':
        filterText = '本年';
        break;
      case 'all':
        filterText = '全部';
        break;
      case 'custom':
        filterText = '自定义';
        break;
    }
    
    this.setData({
      timeFilter: filter,
      timeFilterText: filterText
    });
    
    this.loadStatisticsData();
  },

  setCustomStartDate: function(e) {
    this.setData({ customStartDate: e.detail.value });
    if (this.data.customEndDate) this.loadStatisticsData();
  },
  setCustomEndDate: function(e) {
    this.setData({ customEndDate: e.detail.value });
    if (this.data.customStartDate) this.loadStatisticsData();
  },
  
  // 加载统计数据
  loadStatisticsData: function() {
    const that = this;
    this.setData({
      isLoading: true
    });
    
    wx.showLoading({
      title: '加载中...'
    });
    store.ensureReady()
    const routes = store.listRoutes()
    const bookings = store.listBookings()
    const posts = store.listPosts()
    const pointsHistory = wx.getStorageSync(store.KEYS.pointsHistory) || []
    const range = selectors.getTimeRange(this.data.timeFilter, this.data.customStartDate, this.data.customEndDate)
    const sum = selectors.summary(routes, bookings, posts, pointsHistory, range)
    this.setData({
      totalRoutes: sum.totalRoutes,
      totalBookings: sum.totalBookings,
      completedBookings: sum.completedBookings,
      averageRating: sum.averageRating,
      totalPosts: sum.totalPosts,
      pointsDelta: sum.pointsDelta
    })
    this.setData({
      routeBookingData: selectors.routeBookingData(routes, bookings, range),
      routeCategoryData: selectors.categoryData(routes),
      popularRoutes: selectors.popularRoutes(routes, bookings, range),
      pieChartLegend: selectors.categoryData(routes).map(item => ({ name: item.name, color: item.color }))
    })
    this.updateCharts();
    this.setData({ isLoading: false });
    wx.hideLoading();
  },
  
  // 使用默认数据（当云函数调用失败时）
  useDefaultData: function() {
    // 设置默认统计数据
    this.setData({
      totalRoutes: 20, // 与模拟数据中的路线总数保持一致
      totalBookings: 50,
      completedBookings: 30,
      averageRating: '4.5'
    });
    
    // 获取路线预约统计数据
    this.getRouteBookingStats();
    
    // 获取路线类别分布数据
    this.getRouteCategoryStats();
    
    // 获取热门路线排行
    this.getPopularRoutes();
  },
  
  
  // 更新图表数据
  updateCharts: function() {
    this.updateBarChart();
    this.updatePieChart();
  },
  
  // 更新柱状图
  updateBarChart: function() {
    if (!barChart) {
      const comp = this.selectComponent('#mychart-dom-bar');
      if (!comp) {
        wx.nextTick(() => this.updateBarChart());
        return;
      }
      comp.init((canvas, width, height, dpr) => {
        barChart = initBarChart(canvas, width, height, dpr);
        this.setBarChartData();
        return barChart;
      });
    } else {
      this.setBarChartData();
    }
  },
  
  // 设置柱状图数据
  setBarChartData: function() {
    if (!barChart) return;
    
    const routeData = this.data.routeBookingData;
    const names = routeData.map(item => item.name).slice(0, 8); // 只显示前8条
    const bookingCounts = routeData.map(item => item.bookingCount || item.count).slice(0, 8);
    const completedCounts = routeData.map(item => item.completedCount || Math.floor(item.count * 0.7)).slice(0, 8); // 如果没有完成数，则估算
    
    barChart.setOption({
      xAxis: [{
        data: names
      }],
      series: [
        {
          name: '预约数',
          data: bookingCounts
        },
        {
          name: '完成数',
          data: completedCounts
        }
      ]
    });
  },
  
  // 更新饼图
  updatePieChart: function() {
    if (!pieChart) {
      const comp = this.selectComponent('#mychart-dom-pie');
      if (!comp) {
        wx.nextTick(() => this.updatePieChart());
        return;
      }
      comp.init((canvas, width, height, dpr) => {
        pieChart = initPieChart(canvas, width, height, dpr);
        this.setPieChartData();
        return pieChart;
      });
    } else {
      this.setPieChartData();
    }
  },
  
  // 设置饼图数据
  setPieChartData: function() {
    if (!pieChart) return;
    
    const categoryData = this.data.routeCategoryData;
    const pieData = categoryData.map(item => ({
      value: item.value,
      name: item.name,
      itemStyle: {
        color: item.color
      }
    }));
    
    pieChart.setOption({
      series: [{
        data: pieData
      }]
    });
  },
  
  // 获取路线预约统计数据（备用方法，当云函数调用失败时使用）
  getRouteBookingStats: function() {
    const routes = this.getLocalRoutes();
    const bookings = this.getLocalBookingsFiltered();
    const routeMap = {};
    routes.forEach(r => { routeMap[r._id] = r; });
    const stats = {};
    bookings.forEach(b => {
      if (!b.routeId) return;
      if (!stats[b.routeId]) {
        stats[b.routeId] = { id: b.routeId, name: (routeMap[b.routeId] && routeMap[b.routeId].name) || (b.routeName || '未命名路线'), bookingCount: 0, completedCount: 0 };
      }
      stats[b.routeId].bookingCount++;
      if (b.status === '已完成') stats[b.routeId].completedCount++;
    });
    const routeBookingData = Object.values(stats).sort((a, b) => b.bookingCount - a.bookingCount);
    this.setData({ routeBookingData });
    this.updateBarChart();
  },

  // 设置模拟的路线预约统计数据
  setMockRouteBookingData: function() {
    const mockRouteBookingData = [
      { id: 'desert_1', name: '沙坡头星空徒步', bookingCount: 23, completedCount: 18 },
      { id: 'mountain_1', name: '贺兰山古道骑行', bookingCount: 19, completedCount: 15 },
      { id: 'river_1', name: '黄河大峡谷漂流', bookingCount: 17, completedCount: 14 },
      { id: 'red_1', name: '六盘山长征精神研学', bookingCount: 15, completedCount: 12 },
      { id: 'rural_1', name: '北长滩古村农创体验', bookingCount: 12, completedCount: 10 },
      { id: 'snow_1', name: '贺兰山阅海滑雪挑战', bookingCount: 10, completedCount: 8 },
      { id: 'desert_2', name: '腾格里穿越挑战', bookingCount: 8, completedCount: 6 }
    ];
    
    this.setData({
      routeBookingData: mockRouteBookingData
    });
    
    // 更新柱状图
    this.updateBarChart();
  },
  
  // 获取路线类别分布数据（备用方法，当云函数调用失败时使用）
  getRouteCategoryStats: function() {
    const routes = this.getLocalRoutes();
    const colorMap = { '自然风光': '#4CAF50', '历史古迹': '#FF9800', '人文景观': '#2196F3', '休闲娱乐': '#9C27B0', '美食购物': '#F44336', '其他': '#607D8B' };
    const categoryStats = {};
    routes.forEach(route => {
      const category = route.category || '其他';
      if (!categoryStats[category]) categoryStats[category] = { name: category, value: 0, color: colorMap[category] || '#607D8B' };
      categoryStats[category].value++;
    });
    const routeCategoryData = Object.values(categoryStats);
    this.setData({
      routeCategoryData,
      pieChartLegend: routeCategoryData.map(item => ({ name: item.name, color: item.color }))
    });
    this.updatePieChart();
  },

  // 设置模拟的路线类别数据
  setMockRouteCategoryData: function() {
    const mockCategoryData = [
      { name: '沙漠徒步', value: 4, color: '#4CAF50' },
      { name: '山地骑行', value: 3, color: '#2196F3' },
      { name: '红色文化体验', value: 3, color: '#FF9800' },
      { name: '乡村体育旅游', value: 4, color: '#9C27B0' },
      { name: '河流体育旅游', value: 3, color: '#F44336' },
      { name: '冰雪体育旅游', value: 3, color: '#607D8B' }
    ];
    
    this.setData({
      routeCategoryData: mockCategoryData,
      pieChartLegend: mockCategoryData.map(item => ({
        name: item.name,
        color: item.color
      }))
    });
    
    // 更新饼图
    this.updatePieChart();
  },
  
  // 设置模拟的热门路线数据
  setMockPopularRoutes: function() {
    const mockPopular = [
      { id: 'desert_1', name: '沙坡头星空徒步', bookingCount: 23 },
      { id: 'mountain_1', name: '贺兰山古道骑行', bookingCount: 19 },
      { id: 'river_1', name: '黄河大峡谷漂流', bookingCount: 17 },
      { id: 'red_1', name: '六盘山长征精神研学', bookingCount: 15 },
      { id: 'rural_1', name: '北长滩古村农创体验', bookingCount: 12 }
    ];
    this.setData({
      popularRoutes: mockPopular
    });
  },
  
  // 获取热门路线排行（备用方法，当云函数调用失败时使用）
  getPopularRoutes: function() {
    const routes = this.getLocalRoutes();
    const bookings = this.getLocalBookingsFiltered();
    const routeStats = {};
    routes.forEach(r => {
      routeStats[r._id] = { id: r._id, name: r.name, viewCount: r.viewCount || 0, bookingCount: 0, completedCount: 0, totalRating: 0, ratingCount: 0, averageRating: 0, score: 0 };
    });
    bookings.forEach(b => {
      if (!b.routeId || !routeStats[b.routeId]) return;
      routeStats[b.routeId].bookingCount++;
      if (b.status === '已完成') routeStats[b.routeId].completedCount++;
      if (b.rating && b.rating > 0) { routeStats[b.routeId].totalRating += b.rating; routeStats[b.routeId].ratingCount++; }
    });
    Object.values(routeStats).forEach(r => {
      if (r.ratingCount > 0) r.averageRating = (r.totalRating / r.ratingCount).toFixed(1);
      r.score = r.bookingCount * 0.4 + r.completedCount * 0.3 + (r.averageRating ? parseFloat(r.averageRating) * 10 * 0.2 : 0) + r.viewCount * 0.1;
    });
    const popularRoutes = Object.values(routeStats).sort((a, b) => b.score - a.score).slice(0, 10);
    this.setData({ popularRoutes });
  },

  getTimeStart: function() {
    const now = new Date();
    switch(this.data.timeFilter) {
      case 'week':
        const d = now.getDay() || 7; const weekStart = new Date(now); weekStart.setDate(now.getDate() - d + 1); weekStart.setHours(0,0,0,0); return weekStart;
      case 'day':
        const dayStart = new Date(now); dayStart.setHours(0,0,0,0); return dayStart;
      case 'month':
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1); monthStart.setHours(0,0,0,0); return monthStart;
      case 'year':
        return new Date(now.getFullYear(), 0, 1);
      case 'all':
      default:
        return null;
    }
  },

  getTimeRange: function() {
    const start = this.getTimeStart();
    let end = null;
    if (this.data.timeFilter === 'day') {
      end = new Date(start); end.setDate(start.getDate() + 1);
    } else if (this.data.timeFilter === 'week') {
      end = new Date(start); end.setDate(start.getDate() + 7);
    } else if (this.data.timeFilter === 'month') {
      end = new Date(start.getFullYear(), start.getMonth() + 1, 1);
    } else if (this.data.timeFilter === 'year') {
      end = new Date(start.getFullYear() + 1, 0, 1);
    } else if (this.data.timeFilter === 'custom') {
      const cs = this.data.customStartDate ? new Date(this.data.customStartDate) : null;
      const ce = this.data.customEndDate ? new Date(this.data.customEndDate) : null;
      return { start: cs, end: ce };
    }
    return { start, end };
  },

  ensureLocalData: function() {
    let routes = wx.getStorageSync('routes_local');
    let bookings = wx.getStorageSync('bookings_local');
    let posts = wx.getStorageSync('posts_local');
    let pointsTotal = wx.getStorageSync('points_local_total');
    let pointsHistory = wx.getStorageSync('points_local_history');
    if (!Array.isArray(routes) || routes.length === 0) {
      routes = [
        { _id: 'desert_1', name: '沙坡头星空徒步', category: '自然风光', viewCount: 120 },
        { _id: 'mountain_1', name: '贺兰山古道骑行', category: '自然风光', viewCount: 98 },
        { _id: 'river_1', name: '黄河大峡谷漂流', category: '河流体育旅游', viewCount: 110 },
        { _id: 'red_1', name: '六盘山长征精神研学', category: '红色文化体验', viewCount: 75 },
        { _id: 'rural_1', name: '北长滩古村农创体验', category: '乡村体育旅游', viewCount: 66 },
        { _id: 'snow_1', name: '贺兰山阅海滑雪挑战', category: '冰雪体育旅游', viewCount: 54 },
        { _id: 'desert_2', name: '腾格里穿越挑战', category: '沙漠徒步', viewCount: 80 }
      ];
      wx.setStorageSync('routes_local', routes);
    }
    if (!Array.isArray(bookings) || bookings.length === 0) {
      const now = Date.now();
      bookings = [
        { routeId: 'desert_1', routeName: '沙坡头星空徒步', status: '已完成', rating: 5, date: new Date(now - 2*86400000) },
        { routeId: 'desert_1', routeName: '沙坡头星空徒步', status: '已完成', rating: 4, date: new Date(now - 3*86400000) },
        { routeId: 'mountain_1', routeName: '贺兰山古道骑行', status: '已完成', rating: 4, date: new Date(now - 5*86400000) },
        { routeId: 'river_1', routeName: '黄河大峡谷漂流', status: '进行中', rating: 0, date: new Date(now - 1*86400000) },
        { routeId: 'red_1', routeName: '六盘山长征精神研学', status: '已完成', rating: 5, date: new Date(now - 10*86400000) },
        { routeId: 'rural_1', routeName: '北长滩古村农创体验', status: '已完成', rating: 4, date: new Date(now - 15*86400000) },
        { routeId: 'snow_1', routeName: '贺兰山阅海滑雪挑战', status: '取消', rating: 0, date: new Date(now - 20*86400000) },
        { routeId: 'desert_2', routeName: '腾格里穿越挑战', status: '已完成', rating: 5, date: new Date(now - 25*86400000) }
      ];
      wx.setStorageSync('bookings_local', bookings);
    }
    if (!Array.isArray(posts)) {
      posts = [];
      wx.setStorageSync('posts_local', posts);
    }
    if (typeof pointsTotal !== 'number') {
      pointsTotal = 0;
      wx.setStorageSync('points_local_total', pointsTotal);
    }
    if (!Array.isArray(pointsHistory)) {
      pointsHistory = [];
      wx.setStorageSync('points_local_history', pointsHistory);
    }
  },

  
  
  // 跳转到路线详情
  goToRouteDetail: function(e) {
    const routeId = e.currentTarget.dataset.id;
    if (routeId) {
      wx.navigateTo({
        url: '/pages/routeDetail/routeDetail?id=' + routeId
      });
    }
  },
  
  // 获取热门路线排行
  
  
  // 初始化柱状图
  initBarChart: function() {
    this.barComponent = this.selectComponent('#mychart-dom-bar');
    this.barComponent.init((canvas, width, height, dpr) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr
      });
      
      // 提取数据
      const routeNames = this.data.routeBookingData.map(item => item.name);
      const bookingCounts = this.data.routeBookingData.map(item => item.bookingCount || item.count);
      
      // 设置图表选项
      const option = {
        color: ['#5470c6'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: routeNames.slice(0, 10), // 只显示前10条
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              interval: 0,
              rotate: 30,
              fontSize: 10
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '预约数量',
            nameTextStyle: {
              fontSize: 10
            },
            axisLabel: {
              fontSize: 10
            }
          }
        ],
        series: [
          {
            name: '预约数量',
            type: 'bar',
            barWidth: '60%',
            data: bookingCounts.slice(0, 10) // 只显示前10条
          }
        ]
      };
      
      chart.setOption(option);
      return chart;
    });
  },
  
  // 初始化饼图
  initPieChart: function() {
    this.pieComponent = this.selectComponent('#mychart-dom-pie');
    this.pieComponent.init((canvas, width, height, dpr) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr
      });
      
      // 设置图表选项
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        series: [
          {
            name: '路线类别',
            type: 'pie',
            radius: '50%',
            center: ['50%', '50%'],
            data: this.data.routeCategoryData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            label: {
              show: false
            }
          }
        ]
      };
      
      chart.setOption(option);
      return chart;
    });
  }
})
