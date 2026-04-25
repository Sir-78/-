const bus = require('./event-bus')

const KEYS = {
  version: 'version_local',
  routes: 'routes_local',
  bookings: 'bookings_local',
  posts: 'posts_local',
  comments: 'post_comments_local',
  pointsTotal: 'points_local_total',
  pointsHistory: 'points_local_history',
}

const CURRENT_VERSION = 1

function get(key) {
  const v = wx.getStorageSync(key)
  return v === '' ? undefined : v
}
function set(key, value) {
  wx.setStorageSync(key, value)
}

function migrateIfNeeded() {
  const ver = get(KEYS.version)
  if (typeof ver !== 'number') {
    set(KEYS.version, CURRENT_VERSION)
    // initial normalize: ensure arrays/number types exist
    ensureSeed()
    return
  }
  // future migrations by version
}

function ensureSeed() {
  let routes = get(KEYS.routes)
  let bookings = get(KEYS.bookings)
  let posts = get(KEYS.posts)
  let pointsTotal = get(KEYS.pointsTotal)
  let pointsHistory = get(KEYS.pointsHistory)
  if (!Array.isArray(routes) || routes.length === 0) {
    routes = [
      { _id: 'desert_1', name: '沙坡头星空徒步', category: '自然风光', viewCount: 120, lat: 37.5, lng: 105.2 },
      { _id: 'mountain_1', name: '贺兰山古道骑行', category: '自然风光', viewCount: 98, lat: 38.5, lng: 106.3 },
      { _id: 'river_1', name: '黄河大峡谷漂流', category: '河流体育旅游', viewCount: 110, lat: 38.02, lng: 106.27 },
      { _id: 'red_1', name: '六盘山长征精神研学', category: '红色文化体验', viewCount: 75, lat: 35.96, lng: 106.29 },
      { _id: 'rural_1', name: '北长滩古村农创体验', category: '乡村体育旅游', viewCount: 66, lat: 37.9, lng: 106.2 },
      { _id: 'snow_1', name: '贺兰山阅海滑雪挑战', category: '冰雪体育旅游', viewCount: 54, lat: 38.5, lng: 106.2 },
      { _id: 'desert_2', name: '腾格里穿越挑战', category: '沙漠徒步', viewCount: 80, lat: 37.8, lng: 105.0 }
    ]
    set(KEYS.routes, routes)
  }
  if (!Array.isArray(bookings)) {
    const now = Date.now()
    bookings = [
      { id: 'b1', routeId: 'desert_1', routeName: '沙坡头星空徒步', status: '已完成', rating: 5, date: now - 2*86400000 },
      { id: 'b2', routeId: 'desert_1', routeName: '沙坡头星空徒步', status: '已完成', rating: 4, date: now - 3*86400000 },
      { id: 'b3', routeId: 'mountain_1', routeName: '贺兰山古道骑行', status: '已完成', rating: 4, date: now - 5*86400000 },
      { id: 'b4', routeId: 'river_1', routeName: '黄河大峡谷漂流', status: '进行中', rating: 0, date: now - 1*86400000 }
    ]
    set(KEYS.bookings, bookings)
  }
  if (!Array.isArray(posts)) {
    posts = []
    set(KEYS.posts, posts)
  }
  if (typeof pointsTotal !== 'number') {
    pointsTotal = 0
    set(KEYS.pointsTotal, pointsTotal)
  }
  if (!Array.isArray(pointsHistory)) {
    pointsHistory = []
    set(KEYS.pointsHistory, pointsHistory)
  }
  const comments = get(KEYS.comments)
  if (!comments || typeof comments !== 'object') {
    set(KEYS.comments, {})
  }
}

function ensureReady() {
  migrateIfNeeded()
}

function listRoutes() { ensureReady(); return get(KEYS.routes) || [] }
function listBookings() { ensureReady(); return get(KEYS.bookings) || [] }
function listPosts() { ensureReady(); return get(KEYS.posts) || [] }
function getCommentsMap() { ensureReady(); return get(KEYS.comments) || {} }

function setRoutes(routes) { set(KEYS.routes, routes); bus.emit('data.changed', { type: 'routes' }) }
function setBookings(bookings) { set(KEYS.bookings, bookings); bus.emit('data.changed', { type: 'bookings' }) }
function setPosts(posts) { set(KEYS.posts, posts); bus.emit('data.changed', { type: 'posts' }) }
function setCommentsMap(map) { set(KEYS.comments, map); bus.emit('data.changed', { type: 'comments' }) }

function addPost(post) {
  const posts = listPosts()
  posts.unshift(post)
  setPosts(posts)
}
function updatePost(id, patch) {
  const posts = listPosts()
  const idx = posts.findIndex(p => p.id === id)
  if (idx >= 0) {
    posts[idx] = Object.assign({}, posts[idx], patch)
    setPosts(posts)
  }
}
function deletePost(id) {
  setPosts(listPosts().filter(p => p.id !== id))
  const cm = getCommentsMap()
  delete cm[id]
  setCommentsMap(cm)
  // remove bookings originated from this post
  const bookings = listBookings().filter(b => !(b.sourceType === 'post' && b.sourceId === id))
  setBookings(bookings)
}

function addComment(postId, comment) {
  const cm = getCommentsMap()
  const list = cm[postId] || []
  list.push(comment)
  cm[postId] = list
  setCommentsMap(cm)
}

function addBooking(booking) {
  const bookings = listBookings()
  bookings.push(booking)
  setBookings(bookings)
}
function deleteBooking(id) {
  setBookings(listBookings().filter(b => b.id !== id))
}

function addPointsDelta(delta, reason) {
  const total = get(KEYS.pointsTotal) || 0
  set(KEYS.pointsTotal, total + delta)
  const history = get(KEYS.pointsHistory) || []
  history.push({ ts: Date.now(), delta, reason })
  set(KEYS.pointsHistory, history)
  bus.emit('data.changed', { type: 'points' })
}

module.exports = {
  ensureReady,
  listRoutes, listBookings, listPosts, getCommentsMap,
  setRoutes, setBookings, setPosts, setCommentsMap,
  addPost, updatePost, deletePost,
  addComment,
  addBooking, deleteBooking,
  addPointsDelta,
  KEYS
}
