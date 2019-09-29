import Websocket from '@/libs/Websocket'

const initWS = (data) => {
  return new WebSocket(ws => {
    ws.send(data)
  })
}
