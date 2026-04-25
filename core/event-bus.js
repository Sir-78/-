const subscribers = {}

function on(event, handler) {
  if (!subscribers[event]) subscribers[event] = []
  subscribers[event].push(handler)
  return () => off(event, handler)
}

function off(event, handler) {
  if (!subscribers[event]) return
  subscribers[event] = subscribers[event].filter(h => h !== handler)
}

function emit(event, payload) {
  const list = subscribers[event] || []
  for (const h of list) {
    try { h(payload) } catch (e) { console.error('[event-bus] handler error', e) }
  }
}

module.exports = { on, off, emit }
