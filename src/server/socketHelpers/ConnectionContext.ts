import shortid from 'shortid'
import {IAuthToken} from '../../universal/types/graphql'
import RateLimiter from '../graphql/RateLimiter'
import WebSocketContext from '../wrtc/signalServer/WebSocketContext'

export interface UserWebSocket extends WebSocket {
  context?: WebSocketContext
}

class ConnectionContext {
  authToken: IAuthToken
  availableResubs: Array<any> = []
  cancelKeepAlive: NodeJS.Timeout | null = null
  id = shortid.generate()
  isAlive = true
  rateLimiter: RateLimiter
  socket: UserWebSocket
  sharedDataLoader: any
  subs: any = {}
  constructor (socket, authToken, sharedDataLoader, rateLimiter) {
    this.authToken = authToken
    this.rateLimiter = rateLimiter
    this.socket = socket
    this.sharedDataLoader = sharedDataLoader
  }
}

export default ConnectionContext
