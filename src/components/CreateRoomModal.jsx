import React, { useState } from 'react';
import chatsocket from './Chatsocket';

const CreateRoomModal = ({ onClose, onRoomCreated }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [statusMessage, setStatusMessage] = useState(
    '1:1 채팅방의 코드를 입력하세요. (영문, 숫자 조합 4-12자)',
  );
  const userNickname = localStorage.getItem('nickname');

  const validateRoomCode = (code) => {
    const regex = /^[A-Za-z0-9]{4,12}$/;
    return regex.test(code);
  };

  const handleRoomCodeChange = (e) => {
    const value = e.target.value.replace(/[^A-Za-z0-9]/g, '');
    setRoomCode(value);
  };

  React.useEffect(() => {
    const removeRoomCreatedListener = chatsocket.on('room:created', (data) => {
      console.log('[방 생성 성공]:', data);
      if (data.success) {
        onRoomCreated(data.roomId);
      }
    });

    const removeRoomErrorListener = chatsocket.on('room:error', (error) => {
      console.error('[방 생성 실패]:', error);
      setStatusMessage(error);
      setIsCreating(false);
    });

    return () => {
      removeRoomCreatedListener();
      removeRoomErrorListener();
    };
  }, [onRoomCreated]);

  const generatedUrl = `${window.location.origin}/chat/${roomCode}`;

  const copyToClipboard = async () => {
    if (!validateRoomCode(roomCode)) {
      setStatusMessage('올바른 방 코드를 입력해주세요.');
      return;
    }
    try {
      await navigator.clipboard.writeText(generatedUrl);
      setIsCopied(true);
      setStatusMessage('URL이 복사되었습니다.');
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('클립보드 복사 오류:', err);
      setStatusMessage('URL 복사 중 오류가 발생했습니다.');
    }
  };

  const handleCreateRoom = async () => {
    if (!userNickname) {
      setStatusMessage('로그인이 필요합니다.');
      return;
    }

    if (!validateRoomCode(roomCode)) {
      setStatusMessage('올바른 방 코드를 입력해주세요.');
      return;
    }

    try {
      setIsCreating(true);
      setStatusMessage('방을 생성하는 중입니다...');
      await chatsocket.createRoom(roomCode, userNickname);
    } catch (err) {
      console.error('[방 생성 오류]:', err);
      setStatusMessage('이미 존재하거나, 유효하지 않은 방 코드입니다.');
      setIsCreating(false);
    }
  };

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 style={styles.modalTitle}>채팅방 생성</h2>
        <div style={styles.urlContainer}>
          <input
            type="text"
            value={roomCode}
            onChange={handleRoomCodeChange}
            placeholder="방 코드 입력 (영문, 숫자 4-12자)"
            maxLength={12}
            style={styles.urlInput}
          />
          <button
            onClick={copyToClipboard}
            style={{
              ...styles.copyButton,
              backgroundColor: isCopied ? '#868e96' : '#868e96',
            }}
            disabled={isCopied || !validateRoomCode(roomCode)}
          >
            {isCopied ? '복사됨!' : 'URL 복사'}
          </button>
        </div>
        <p style={styles.urlGuide}>{statusMessage}</p>
        <div style={styles.buttonGroup}>
          <button
            onClick={handleCreateRoom}
            style={styles.createButton}
            disabled={isCreating || !userNickname || !validateRoomCode(roomCode)}
          >
            {isCreating ? '생성 중...' : '방 만들기'}
          </button>
          <button onClick={onClose} style={styles.closeButton}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '500px',
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '24px',
    color: '#333',
  },
  urlContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '15px',
  },
  urlInput: {
    flex: 1,
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '14px',
  },
  copyButton: {
    padding: '10px 20px',
    borderRadius: '4px',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.3s',
    '&:disabled': {
      backgroundColor: '#cccccc',
      cursor: 'not-allowed',
    },
  },
  urlGuide: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '20px',
    textAlign: 'center',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    width: '100%',
  },
  createButton: {
    flex: 1,
    padding: '10px 20px',
    backgroundColor: '#868e96',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    maxWidth: '150px',
    '&:disabled': {
      backgroundColor: '#cccccc',
      cursor: 'not-allowed',
    },
  },
  closeButton: {
    flex: 1,
    padding: '10px 20px',
    backgroundColor: '#868e96',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    maxWidth: '150px',
  },
};

export default CreateRoomModal;
