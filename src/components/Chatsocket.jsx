import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = process.env.REACT_APP_SOCKET_SERVER_URL || 'http://localhost:5000';

class Chatsocket {
  constructor() {
    this.socket = io(SOCKET_SERVER_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.setupBaseListeners();
  }

  setupBaseListeners() {
    this.socket.on('connect', () => {
      console.log('[Socket] Connected:', this.socket.id);
    });

    this.socket.on('connect_error', (error) => {
      console.error('[Socket] Connection error:', error);
    });

    this.socket.onAny((eventName, ...args) => {
      console.log(`[Socket Event] ${eventName}:`, args);
    });
  }

  // 이벤트 리스너 관리
  on(event, callback) {
    this.socket.on(event, callback);
    return () => this.socket.off(event, callback);
  }

  off(event, callback) {
    this.socket.off(event, callback);
  }

  emit(event, data, callback) {
    this.socket.emit(event, data, callback);
  }

  // 채팅방 관련 메서드
  async createRoom(roomId, nickname) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('방 생성 시간 초과'));
      }, 5000);

      const handleCreated = (response) => {
        clearTimeout(timeout);
        this.socket.off('room:error', handleError);
        resolve(response);
      };

      const handleError = (error) => {
        clearTimeout(timeout);
        this.socket.off('room:created', handleCreated);
        reject(new Error(error));
      };

      this.socket.on('room:created', handleCreated);
      this.socket.on('room:error', handleError);
      this.socket.emit('room:create', { roomId, nickname });
    });
  }

  async joinRoom(roomId, nickname) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('방 참여 시간 초과'));
      }, 5000);

      const handleJoined = (response) => {
        clearTimeout(timeout);
        this.socket.off('room:error', handleError);
        resolve(response);
      };

      const handleError = (error) => {
        clearTimeout(timeout);
        this.socket.off('room:joined', handleJoined);
        reject(new Error(error));
      };

      this.socket.on('room:joined', handleJoined);
      this.socket.on('room:error', handleError);
      this.socket.emit('room:join', { roomId, nickname });
    });
  }

  leaveRoom(roomId, nickname) {
    this.socket.emit('room:leave', { roomId, nickname });
  }

  sendMessage(roomId, message, nickname) {
    this.socket.emit('room:message', {
      roomId,
      message,
      nickname,
      timestamp: new Date(),
    });
  }

  async checkRoom(roomId) {
    return new Promise((resolve) => {
      this.socket.emit('room:check', { roomId }, (response) => {
        resolve(response.exists);
      });
    });
  }

  getParticipants(roomId) {
    this.socket.emit('room:getParticipants', { roomId });
  }

  deleteRoom(roomId, nickname) {
    this.socket.emit('room:delete', { roomId, nickname });
  }

  disconnect() {
    this.socket.disconnect();
  }

  reconnect() {
    if (!this.socket.connected) {
      this.socket.connect();
    }
  }

  isConnected() {
    return this.socket.connected;
  }

  getSocketId() {
    return this.socket.id;
  }
}

export default new Chatsocket();
