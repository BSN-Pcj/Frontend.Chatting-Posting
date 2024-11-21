import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

// 팝업 모달 컴포넌트
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          maxWidth: '400px',
          width: '100%',
        }}
      >
        {children}
        <button
          onClick={onClose}
          style={{
            marginTop: '10px',
            padding: '8px 16px',
            backgroundColor: '#868e96',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          닫기
        </button>
      </div>
    </div>
  );
};

function Settingself() {
  const [currentNickname, setCurrentNickname] = useState('');
  const [newNickname, setNewNickname] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nicknameAvailable, setNicknameAvailable] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setCurrentNickname(decodedToken.nickname || '');
        setNewNickname(decodedToken.nickname || '');
      } catch (error) {
        console.error('토큰 디코딩 오류:', error);
        showModal('사용자 정보를 불러오는 데 실패했습니다.');
      }
    }
  }, []);

  const handleNicknameChange = (e) => {
    const value = e.target.value.slice(0, 3); // 최대 3글자로 제한
    setNewNickname(value);
    setNicknameAvailable(false); // 닉네임이 변경되면 중복 확인 상태 초기화
  };

  const showModal = (message) => {
    setModalMessage(message);
    setIsModalOpen(true);
  };

  const checkNicknameDuplicate = async () => {
    if (!newNickname) {
      showModal('닉네임을 입력해주세요.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/check-nickname', {
        nickname: newNickname,
      });
      setNicknameAvailable(true);
      showModal(response.data.message);
    } catch (error) {
      setNicknameAvailable(false);
      showModal(error.response?.data?.message || '닉네임 중복 확인 중 오류가 발생했습니다.');
    }
  };

  const handleSubmit = async () => {
    if (newNickname === currentNickname && !newPassword) {
      showModal('변경할 내용이 없습니다.');
      return;
    }
    if (newPassword && newPassword !== confirmPassword) {
      showModal('새 비밀번호가 일치하지 않습니다.');
      return;
    }
    if (newNickname !== currentNickname && !nicknameAvailable) {
      showModal('닉네임 중복 확인을 해주세요.');
      return;
    }
    if (newPassword && !currentPassword) {
      showModal('현재 비밀번호를 입력해주세요.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/update-user',
        {
          newNickname: newNickname !== currentNickname ? newNickname : undefined,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      showModal(response.data.message);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      setCurrentNickname(newNickname);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setNicknameAvailable(false);
    } catch (error) {
      showModal(error.response?.data?.message || '설정 변경 중 오류가 발생했습니다.');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '32px',
        backgroundColor: '#f1f3f5',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        maxWidth: '400px',
        margin: '0 auto',
      }}
    >
      <h2 style={{ marginBottom: '24px', color: '#1f2937' }}>개인 설정</h2>
      <div style={{ width: '100%', marginBottom: '16px' }}>
        <input
          type="text"
          value={newNickname}
          onChange={handleNicknameChange}
          placeholder="새 닉네임 (3글자 한글)"
          maxLength={3}
          style={{
            width: '100%',
            padding: '8px',
            marginBottom: '8px',
            borderRadius: '4px',
            border: '1px solid #4b5563',
          }}
        />
        <button
          onClick={checkNicknameDuplicate}
          style={{
            width: '100%',
            color: 'white',
            padding: '8px',
            borderRadius: '4px',
            border: 'none',
            backgroundColor: '#868e96',
            cursor: 'pointer',
            marginBottom: '8px',
          }}
        >
          닉네임 중복 확인
        </button>
      </div>
      <div style={{ width: '100%', marginBottom: '16px' }}>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="현재 비밀번호"
          style={{
            width: '100%',
            padding: '8px',
            marginBottom: '8px',
            borderRadius: '4px',
            border: '1px solid #4b5563',
          }}
        />
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="새 비밀번호"
          style={{
            width: '100%',
            padding: '8px',
            marginBottom: '8px',
            borderRadius: '4px',
            border: '1px solid #4b5563',
          }}
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="새 비밀번호 확인"
          style={{
            width: '100%',
            padding: '8px',
            marginBottom: '8px',
            borderRadius: '4px',
            border: '1px solid #4b5563',
          }}
        />
      </div>
      <button
        onClick={handleSubmit}
        style={{
          width: '100%',
          color: 'white',
          padding: '12px',
          borderRadius: '4px',
          border: 'none',
          backgroundColor: '#868e96',
          cursor: 'pointer',
          fontSize: '16px',

          fontWeight: 'bold',
        }}
      >
        변경 사항 저장
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <p>{modalMessage}</p>
      </Modal>
    </div>
  );
}

export default Settingself;
