// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { timeFilter } = event
  
  // 获取时间范围条件
  const timeCondition = getTimeCondition(timeFilter)
  
  try {
    // 获取总路线数
    let totalRoutes = 0
    try {
      const routesCountResult = await db.collection('routes').count()
      totalRoutes = routesCountResult.total
    } catch (routesError) {
      console.log('routes集合不存在，使用默认值:', routesError)
      totalRoutes = 20 // 使用默认值
    }
    
    // 获取预约统计
    const bookingsResult = await db.collection('bookings').where(timeCondition).get()
    const bookings = bookingsResult.data
    const totalBookings = bookings.length
    const completedBookings = bookings.filter(booking => booking.status === '已完成').length
    
    // 计算平均评分
    let averageRating = 0
    const ratedBookings = bookings.filter(booking => booking.rating && booking.rating > 0)
    if (ratedBookings.length > 0) {
      const totalRating = ratedBookings.reduce((sum, booking) => sum + booking.rating, 0)
      averageRating = (totalRating / ratedBookings.length).toFixed(1)
    }
    
    // 获取路线预约统计数据
    let routeBookingData = []
    try {
      routeBookingData = await getRouteBookingStats(timeCondition)
    } catch (error) {
      console.log('获取路线预约统计失败，使用默认数据:', error)
      routeBookingData = getMockRouteBookingData()
    }
    
    // 获取路线类别分布
    let routeCategoryData = []
    try {
      routeCategoryData = await getRouteCategoryStats()
    } catch (error) {
      console.log('获取路线类别分布失败，使用默认数据:', error)
      routeCategoryData = getMockRouteCategoryData()
    }
    
    // 获取热门路线排行
    let popularRoutes = []
    try {
      popularRoutes = await getPopularRoutes(timeCondition)
    } catch (error) {
      console.log('获取热门路线排行失败，使用默认数据:', error)
      popularRoutes = getMockPopularRoutes()
    }
    
    return {
      success: true,
      data: {
        statistics: {
          totalRoutes,
          totalBookings,
          completedBookings,
          averageRating
        },
        routeBookingData,
        routeCategoryData,
        popularRoutes
      }
    }
  } catch (error) {
    console.error('获取统计数据失败', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// 根据时间筛选获取查询条件
function getTimeCondition(timeFilter) {
  const now = new Date()
  let startDate = new Date()
  
  switch (timeFilter) {
    case 'week':
      // 本周（从本周一开始）
      const day = now.getDay() || 7 // 如果是周日，getDay()返回0，我们将其视为7
      startDate.setDate(now.getDate() - day + 1) // 设置为本周一
      startDate.setHours(0, 0, 0, 0)
      break
    case 'month':
      // 本月（从1号开始）
      startDate.setDate(1)
      startDate.setHours(0, 0, 0, 0)
      break
    case 'year':
      // 本年（从1月1日开始）
      startDate = new Date(now.getFullYear(), 0, 1)
      break
    case 'all':
    default:
      // 全部时间不需要筛选
      return {}
  }
  
  return {
    date: _.gte(startDate)
  }
}

// 获取路线预约统计数据
async function getRouteBookingStats(timeCondition) {
  try {
    // 获取所有路线
    const routesResult = await db.collection('routes')
      .limit(10) // 限制获取前10条路线数据
      .get()
    const routes = routesResult.data
    
    // 获取所有预约
    const bookingsResult = await db.collection('bookings')
      .where(timeCondition)
      .get()
    const bookings = bookingsResult.data
    
    // 统计每条路线的预约数和完成数
    const routeStats = routes.map(route => {
      const routeBookings = bookings.filter(booking => booking.routeId === route._id)
      const bookingCount = routeBookings.length
      const completedCount = routeBookings.filter(booking => booking.status === '已完成').length
      
      return {
        name: route.name,
        bookingCount,
        completedCount
      }
    })
    
    // 按预约数排序
    return routeStats.sort((a, b) => b.bookingCount - a.bookingCount)
  } catch (error) {
    console.error('获取路线预约统计失败', error)
    return []
  }
}

// 获取路线类别分布
async function getRouteCategoryStats() {
  try {
    const routesResult = await db.collection('routes').get()
    const routes = routesResult.data
    
    // 统计各类别路线数量
    const categoryMap = {}
    routes.forEach(route => {
      const category = route.category || '未分类'
      if (categoryMap[category]) {
        categoryMap[category]++
      } else {
        categoryMap[category] = 1
      }
    })
    
    // 转换为图表所需格式
    const colors = ['#4CAF50', '#2196F3', '#FFC107', '#FF5722', '#9C27B0', '#3F51B5', '#009688']
    const categoryData = Object.keys(categoryMap).map((category, index) => {
      return {
        name: category,
        value: categoryMap[category],
        color: colors[index % colors.length]
      }
    })
    
    return categoryData
  } catch (error) {
    console.error('获取路线类别分布失败', error)
    return []
  }
}

// 获取热门路线排行
async function getPopularRoutes(timeCondition) {
  try {
    // 获取所有路线
    const routesResult = await db.collection('routes').get()
    const routes = routesResult.data
    
    // 获取所有预约
    const bookingsResult = await db.collection('bookings')
      .where(timeCondition)
      .get()
    const bookings = bookingsResult.data
    
    // 统计每条路线的预约数和评分
    const routeStats = routes.map(route => {
      const routeBookings = bookings.filter(booking => booking.routeId === route._id)
      const bookingCount = routeBookings.length
      
      // 计算平均评分
      let rating = 0
      const ratedBookings = routeBookings.filter(booking => booking.rating && booking.rating > 0)
      if (ratedBookings.length > 0) {
        const totalRating = ratedBookings.reduce((sum, booking) => sum + booking.rating, 0)
        rating = (totalRating / ratedBookings.length).toFixed(1)
      }
      
      return {
        id: route._id,
        name: route.name,
        bookingCount,
        rating,
        // 计算综合得分（预约数 * 0.7 + 评分 * 0.3 * 20）
        score: bookingCount * 0.7 + (rating ? parseFloat(rating) * 0.3 * 20 : 0)
      }
    })
    
    // 按综合得分排序，取前10
    return routeStats
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
  } catch (error) {
    console.error('获取热门路线排行失败', error)
    return []
  }
}

// 模拟数据函数
function getMockRouteBookingData() {
  return [
    { id: 'desert_1', name: '沙坡头星空徒步', bookingCount: 23, completedCount: 18 },
    { id: 'mountain_1', name: '贺兰山古道骑行', bookingCount: 19, completedCount: 15 },
    { id: 'river_1', name: '黄河大峡谷漂流', bookingCount: 17, completedCount: 14 },
    { id: 'red_1', name: '六盘山长征精神研学', bookingCount: 15, completedCount: 12 },
    { id: 'rural_1', name: '北长滩古村农创体验', bookingCount: 12, completedCount: 10 }
  ]
}

function getMockRouteCategoryData() {
  return [
    { name: '沙漠徒步', value: 4, color: '#4CAF50' },
    { name: '山地骑行', value: 3, color: '#2196F3' },
    { name: '红色文化体验', value: 3, color: '#FF9800' },
    { name: '乡村体育旅游', value: 4, color: '#9C27B0' },
    { name: '河流体育旅游', value: 3, color: '#F44336' },
    { name: '冰雪体育旅游', value: 3, color: '#607D8B' }
  ]
}

function getMockPopularRoutes() {
  return [
    { id: 'desert_1', name: '沙坡头星空徒步', bookingCount: 23, rating: '4.8', score: 85.2 },
    { id: 'mountain_1', name: '贺兰山古道骑行', bookingCount: 19, rating: '4.6', score: 78.4 },
    { id: 'river_1', name: '黄河大峡谷漂流', bookingCount: 17, rating: '4.7', score: 72.1 },
    { id: 'red_1', name: '六盘山长征精神研学', bookingCount: 15, rating: '4.5', score: 65.8 },
    { id: 'rural_1', name: '北长滩古村农创体验', bookingCount: 12, rating: '4.4', score: 58.7 }
  ]
}