import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function Homebar() {
  const [userInfo, setUserInfo] = useState({ nickname: '', studentId: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserInfo({
          nickname: decodedToken.nickname || '',
          studentId: decodedToken.studentId || '',
        });
      } catch (error) {
        console.error('토큰 디코딩 오류:', error);
        setUserInfo({ nickname: '', studentId: '' });
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post(
          `${API_URL}/logout`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        console.log('Logout Status:', {
          isLoggedIn: false,
          user: null,
        });
      }
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      setUserInfo({ nickname: '', studentId: '' });
      navigate('/');
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '256px',
        backgroundColor: 'white',
        color: '#1f2937',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          textAlign: 'center',
          width: '100%',
          padding: '32px 0',
        }}
      >
        <div
          style={{
            backgroundColor: '#374151',
            borderRadius: '50%',
            height: '80px',
            width: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            color: 'white',
          }}
        >
          <span style={{ fontSize: '24px', fontWeight: 'bold' }}>
            {userInfo.nickname || '사용자'}
          </span>
        </div>
        <div style={{ marginTop: '16px' }}>
          <p style={{ fontSize: '14px', color: '#1f2937' }}>{userInfo.studentId || '학번 없음'}</p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            width: 'calc(100% - 32px)',
            color: '#1f2937',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #4b5563',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            marginTop: '16px',
          }}
        >
          로그아웃
        </button>
      </div>
      <nav style={{ width: '100%', flexGrow: 1 }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {[
            { name: '홈', path: '/home' },
            { name: '게시판', path: '/board' },
            { name: '채팅방', path: '/chat' },
            { name: '설정', path: '/setting' },
          ].map((item, index) => (
            <li key={index} style={{ marginBottom: '16px' }}>
              <Link
                to={item.path}
                style={{
                  display: 'block',
                  width: 'auto',
                  textAlign: 'center',
                  padding: '8px',

                  borderRadius: '4px',
                  color: '#1f2937',
                  textDecoration: 'none',
                }}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default Homebar;
