import React, { useState, useEffect, useRef } from 'react';
import chatsocket from './Chatsocket';

const Chatmodal = ({ roomId, nickname, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(true);
  const messagesEndRef = useRef(null);

  // 자동 스크롤
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLeave = () => {
    chatsocket.deleteRoom(roomId, nickname);
    onClose();
  };

  const sendMessage = () => {
    if (!inputMessage.trim() || !isConnected) return;
    chatsocket.sendMessage(roomId, inputMessage.trim(), nickname);
    setInputMessage('');
  };

  // Enter 키 처리
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    console.log('[채팅모달] 초기화:', { roomId, nickname });

    const removeNewMessageListener = chatsocket.on('room:message', (data) => {
      setMessages((prev) => [
        ...prev,
        {
          sender: data.sender,
          content: data.content,
          timestamp: new Date(data.timestamp),
          isMine: data.sender === nickname,
        },
      ]);
      scrollToBottom();
    });

    const removeParticipantJoinedListener = chatsocket.on('room:participant_joined', (data) => {
      setParticipants(data.participants);
      if (data.joinedParticipant !== nickname) {
        setMessages((prev) => [
          ...prev,
          {
            type: 'system',
            content: `${data.joinedParticipant}님이 입장하셨습니다.`,
          },
        ]);
        scrollToBottom();
      }
    });

    const removeParticipantLeftListener = chatsocket.on('room:participant_left', (data) => {
      setParticipants(data.participants);
      setMessages((prev) => [
        ...prev,
        {
          type: 'system',
          content: `${data.nickname}님이 퇴장하셨습니다.`,
        },
      ]);
      scrollToBottom();
    });

    const removeDisconnectListener = chatsocket.on('disconnect', () => {
      setIsConnected(false);
      setMessages((prev) => [
        ...prev,
        {
          type: 'system',
          content: '서버와의 연결이 끊어졌습니다.',
        },
      ]);
    });

    const removeParticipantsListener = chatsocket.on('room:participants', (data) => {
      setParticipants(data.participants);
    });

    chatsocket.getParticipants(roomId);

    return () => {
      removeNewMessageListener();
      removeParticipantJoinedListener();
      removeParticipantLeftListener();
      removeDisconnectListener();
      removeParticipantsListener();
      chatsocket.leaveRoom(roomId, nickname);
    };
  }, [roomId, nickname]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>채팅방 ({participants.length}명)</h2>
        <div style={styles.headerButtons}>
          <button onClick={handleLeave} style={styles.leaveButton}>
            나가기
          </button>
        </div>
      </div>

      <div style={styles.participantList}>
        <h3>참가자 목록</h3>
        {participants.map((participant, index) => (
          <div key={index} style={styles.participant}>
            {participant === nickname ? `${participant} (나)` : participant}
          </div>
        ))}
      </div>

      <div style={styles.messageList}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              ...(msg.type === 'system' ? styles.systemMessage : {}),
              ...(msg.isMine ? styles.myMessage : {}),
            }}
          >
            {msg.type === 'system' ? (
              <span>{msg.content}</span>
            ) : (
              <>
                <strong>{msg.sender === nickname ? '나' : msg.sender}: </strong>
                <span>{msg.content}</span>
              </>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div style={styles.inputContainer}>
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          style={styles.input}
          placeholder="메시지를 입력하세요..."
          disabled={!isConnected}
        />
        <button
          onClick={sendMessage}
          style={styles.sendButton}
          disabled={!isConnected || !inputMessage.trim()}
        >
          전송
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    height: '80vh',
    width: '90%',
    maxWidth: '800px',
    margin: '0 auto',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    borderBottom: '1px solid #eee',
  },
  participantList: {
    padding: '15px',
    borderBottom: '1px solid #eee',
    maxHeight: '150px',
    overflowY: 'auto',
  },
  participant: {
    padding: '5px 0',
  },
  messageList: {
    flex: 1,
    padding: '15px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
  message: {
    marginBottom: '10px',
    padding: '8px 12px',
    borderRadius: '8px',
    backgroundColor: '#f1f1f1',
    maxWidth: '70%',
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#4CAF50',
    color: 'white',
  },
  systemMessage: {
    alignSelf: 'center',
    backgroundColor: 'transparent',
    color: '#666',
    fontSize: '0.9em',
    fontStyle: 'italic',
  },
  inputContainer: {
    display: 'flex',
    padding: '15px',
    borderTop: '1px solid #eee',
    gap: '10px',
  },
  input: {
    flex: 1,
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    resize: 'none',
    minHeight: '40px',
    maxHeight: '100px',
  },
  sendButton: {
    padding: '10px 20px',
    backgroundColor: 'white',
    color: 'black',
    border: '2px solid #4CAF50',
    borderRadius: '4px',
    cursor: 'pointer',
    '&:disabled': {
      backgroundColor: '#cccccc',
      cursor: 'not-allowed',
      border: '2px solid #cccccc',
    },
  },
  headerButtons: {
    display: 'flex',
    gap: '10px',
  },
  leaveButton: {
    padding: '8px 16px',
    backgroundColor: 'white',
    color: 'black',
    border: '2px solid #f44336',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default Chatmodal;
