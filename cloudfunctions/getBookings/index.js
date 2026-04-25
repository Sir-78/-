// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  try {
    const bookingsCollection = db.collection('bookings')
    const bookingsResult = await bookingsCollection.where({
      _openid: openid
    }).orderBy('date', 'desc').get()

    const bookingsData = bookingsResult.data.map(booking => ({
      ...booking,
      id: booking._id
    }));

    return {
      success: true,
      data: bookingsData
    }
  } catch (err) {
    console.error('[云函数] [getBookings] 调用失败：', err)
    return {
      success: false,
      error: err
    }
  }
}