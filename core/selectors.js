function getTimeRange(filter, customStartDate, customEndDate) {
  const now = new Date()
  let start = null, end = null
  switch (filter) {
    case 'day':
      start = new Date(now); start.setHours(0,0,0,0); end = new Date(start); end.setDate(start.getDate()+1); break
    case 'week':
      const d = now.getDay() || 7; start = new Date(now); start.setDate(now.getDate() - d + 1); start.setHours(0,0,0,0); end = new Date(start); end.setDate(start.getDate()+7); break
    case 'month':
      start = new Date(now.getFullYear(), now.getMonth(), 1); start.setHours(0,0,0,0); end = new Date(start.getFullYear(), start.getMonth()+1,1); break
    case 'year':
      start = new Date(now.getFullYear(), 0, 1); end = new Date(now.getFullYear()+1, 0, 1); break
    case 'custom':
      start = customStartDate ? new Date(customStartDate) : null
      end = customEndDate ? new Date(customEndDate) : null
      break
    case 'all':
    default:
      start = null; end = null
  }
  return { start, end }
}

function filterByRange(list, getDate, range) {
  if (!range.start && !range.end) return list
  return list.filter(item => {
    const d = new Date(getDate(item))
    return (!range.start || d >= range.start) && (!range.end || d < range.end)
  })
}

function summary(routes, bookings, posts, pointsHistory, range) {
  const bookingsInRange = filterByRange(bookings, b => b.date, range)
  const completedBookings = bookingsInRange.filter(b => b.status === '已完成').length
  const rated = bookingsInRange.filter(b => b.rating && b.rating > 0)
  const averageRating = rated.length > 0 ? (rated.reduce((s,b)=>s+b.rating,0)/rated.length).toFixed(1) : 0
  const pointsDelta = filterByRange(pointsHistory, h => h.ts, range).reduce((s,h)=>s+(h.delta||0),0)
  return {
    totalRoutes: routes.length,
    totalBookings: bookingsInRange.length,
    completedBookings,
    averageRating,
    totalPosts: filterByRange(posts, p => p.date, range).length,
    pointsDelta
  }
}

function routeBookingData(routes, bookings, range) {
  const bookingsInRange = filterByRange(bookings, b => b.date, range)
  const routeMap = {}; routes.forEach(r => routeMap[r._id] = r)
  const stats = {}
  bookingsInRange.forEach(b => {
    if (!b.routeId) return
    if (!stats[b.routeId]) stats[b.routeId] = { id: b.routeId, name: (routeMap[b.routeId] && routeMap[b.routeId].name) || (b.routeName || '未命名路线'), bookingCount: 0, completedCount: 0 }
    stats[b.routeId].bookingCount++
    if (b.status === '已完成') stats[b.routeId].completedCount++
  })
  return Object.values(stats).sort((a,b)=>b.bookingCount-a.bookingCount)
}

function categoryData(routes) {
  const colorMap = { '自然风光': '#4CAF50', '历史古迹': '#FF9800', '人文景观': '#2196F3', '休闲娱乐': '#9C27B0', '美食购物': '#F44336', '其他': '#607D8B' }
  const categoryStats = {}
  routes.forEach(route => {
    const category = route.category || '其他'
    if (!categoryStats[category]) categoryStats[category] = { name: category, value: 0, color: colorMap[category] || '#607D8B' }
    categoryStats[category].value++
  })
  return Object.values(categoryStats)
}

function popularRoutes(routes, bookings, range) {
  const bookingsInRange = filterByRange(bookings, b => b.date, range)
  const routeStats = {}
  routes.forEach(r => {
    routeStats[r._id] = { id: r._id, name: r.name, viewCount: r.viewCount || 0, bookingCount: 0, completedCount: 0, totalRating: 0, ratingCount: 0, averageRating: 0, score: 0 }
  })
  bookingsInRange.forEach(b => {
    if (!b.routeId || !routeStats[b.routeId]) return
    const rs = routeStats[b.routeId]
    rs.bookingCount++
    if (b.status === '已完成') rs.completedCount++
    if (b.rating && b.rating > 0) { rs.totalRating += b.rating; rs.ratingCount++ }
  })
  Object.values(routeStats).forEach(r => {
    if (r.ratingCount>0) r.averageRating = (r.totalRating/r.ratingCount).toFixed(1)
    r.score = r.bookingCount*0.4 + r.completedCount*0.3 + (r.averageRating ? parseFloat(r.averageRating)*10*0.2 : 0) + r.viewCount*0.1
  })
  return Object.values(routeStats).sort((a,b)=>b.score-a.score).slice(0,10)
}

module.exports = {
  getTimeRange,
  summary,
  routeBookingData,
  categoryData,
  popularRoutes,
  filterByRange
}
