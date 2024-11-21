import React, { useState, useRef } from 'react';
import chatsocket from './Chatsocket';
import Chatmodal from './Chatmodal';
import CreateRoomModal from './CreateRoomModal';

const Chatmonit = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [currentRoomId, setCurrentRoomId] = useState(null);
  const [error, setError] = useState('');
  const keyInputRef = useRef(null);
  const userNickname = localStorage.getItem('nickname');

  const handleJoinRoom = async () => {
    if (!userNickname) {
      setError('로그인이 필요합니다.');
      return;
    }

    try {
      const roomKey = extractRoomKey(keyInputRef.current?.value || '');
      const exists = await chatsocket.checkRoom(roomKey);

      if (!exists) {
        setError('존재하지 않는 방입니다.');
        return;
      }

      try {
        await chatsocket.joinRoom(roomKey, userNickname);
        setCurrentRoomId(roomKey);
        setShowChatModal(true);
        setShowJoinModal(false);
      } catch (error) {
        setError(error.message);
      }
    } catch (error) {
      console.error('방 참여 오류:', error);
      setError('방 참여 중 오류가 발생했습니다.');
    }
  };

  const extractRoomKey = (input) => {
    if (input.includes('/chat/')) {
      return input.split('/chat/')[1];
    }
    return input;
  };

  const handleOpenJoinModal = () => {
    setShowJoinModal(true);
    setError('');
    if (keyInputRef.current) {
      keyInputRef.current.value = '';
    }
  };

  return (
    <div style={styles.chatContainer}>
      <div style={styles.titleGroup}>
        <label htmlFor="title" style={styles.titleLabel}>
          채팅방
        </label>
      </div>
      <div style={styles.headerLine}></div>

      <div style={styles.buttonContainer}>
        <button
          style={styles.button}
          onClick={() => setShowCreateModal(true)}
          disabled={!userNickname}
        >
          생성
        </button>
        <button style={styles.button} onClick={handleOpenJoinModal} disabled={!userNickname}>
          참여
        </button>
      </div>

      {showCreateModal && (
        <CreateRoomModal
          onClose={() => setShowCreateModal(false)}
          onRoomCreated={(roomId) => {
            setCurrentRoomId(roomId);
            setShowChatModal(true);
            setShowCreateModal(false);
          }}
        />
      )}

      {showJoinModal && (
        <div style={styles.modalOverlay} onClick={() => setShowJoinModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>참여</h2>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <input
                ref={keyInputRef}
                type="text"
                placeholder="방 URL 또는 키를 입력하세요"
                style={styles.modalInput}
              />
            </div>
            {error && <p style={styles.errorMessage}>{error}</p>}
            <div style={styles.buttonGroup}>
              <button onClick={handleJoinRoom} style={styles.createButton}>
                참여하기
              </button>
              <button onClick={() => setShowJoinModal(false)} style={styles.closeButton}>
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {showChatModal && currentRoomId && (
        <Chatmodal
          roomId={currentRoomId}
          nickname={userNickname}
          onClose={() => {
            setShowChatModal(false);
            setCurrentRoomId(null);
          }}
        />
      )}
    </div>
  );
};

const styles = {
  chatContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    position: 'relative',
  },
  titleGroup: {
    padding: '20px 20px 0',
  },
  titleLabel: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#484848',
  },
  headerLine: {
    borderBottom: '2px solid #868e96',
    margin: '10px 20px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '20px',
    margin: '0',
    height: '100%',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#868e96',
    color: 'white',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    '&:disabled': {
      backgroundColor: '#cccccc',
      cursor: 'not-allowed',
    },
    width: '120px',
  },
  urlContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
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
  },
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
    padding: '30px',
    borderRadius: '8px',
    maxWidth: '400px',
    width: '90%',
    position: 'relative',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  modalInput: {
    width: '100%',
    maxWidth: '280px',
    padding: '10px',
    marginBottom: '15px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
  },
  modalButtons: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
  },
  modalCloseButton: {
    padding: '10px 20px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    backgroundColor: '#868e96',
    color: 'white',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s',
    '&:hover': {
      backgroundColor: '#f1f1f1',
    },
  },
  errorMessage: {
    color: 'red',
    marginBottom: '10px',
    fontSize: '14px',
  },
  modalText: {
    marginBottom: '20px',
    textAlign: 'center',
    fontSize: '16px',
  },
  urlGuide: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '20px',
    textAlign: 'center',
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '20px',
    color: '#333',
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
    fontSize: '16px',
    transition: 'background-color 0.3s',
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
    fontSize: '16px',
    transition: 'background-color 0.3s',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginTop: '20px',
  },
};

export default Chatmonit;
