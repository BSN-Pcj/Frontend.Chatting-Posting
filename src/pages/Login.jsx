import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import chatsocket from '../components/Chatsocket';

function Login() {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // 로그인 성공 후 서버에 소켓 등록 및 로그인 상태 기록
  function handleLoginSuccess(studentId, token) {
    if (!chatsocket.isConnected()) {
      chatsocket.reconnect();
    }
    chatsocket.emit('login', { studentId, token });
    console.log('Socket registered and login recorded for studentId:', studentId);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_URL}/login`, {
        studentId: studentId,
        password: password,
      });

      const { token, nickname, role } = response.data;

      // 로그인 상태 업데이트
      setIsLoggedIn(true);
      setUser({
        studentId: studentId,
        nickname: nickname,
        role: role,
        token: token,
      });

      // 토큰을 Authorization 헤더에 설정
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // 로컬 스토리지에 저장
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', role);
      localStorage.setItem('nickname', nickname);
      localStorage.setItem('studentId', studentId);

      // 소켓 등록 및 로그인 상태 기록
      handleLoginSuccess(studentId, token);

      // 콘솔에 로그인 상태 출력
      console.log('Login Status:', {
        isLoggedIn: true,
        user: {
          studentId,
          nickname,
          role,
        },
      });

      navigate('/home');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || '로그인에 실패했습니다.');
      setIsLoggedIn(false);
      setUser({});
    } finally {
      setLoading(false);
    }
  }

  // 로그인 성공 시 소켓 연결
  useEffect(() => {
    if (isLoggedIn) {
      chatsocket.emit('login', {
        studentId: user.studentId,
        token: user.token,
      });
    }
  }, [isLoggedIn, user]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-none" style={{ flexBasis: '20%' }}>
        <Header />
      </div>

      <div
        className="flex-1 flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
        style={{
          flexBasis: '80%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div className="max-w-md w-full space-y-8" style={styles.container}>
          <h2 style={styles.title}>로그인</h2>
          {error && <p style={styles.error}>{error}</p>}
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label htmlFor="studentId" style={styles.label}>
                학번:
              </label>
              <input
                id="studentId"
                name="studentId"
                type="text"
                required
                placeholder="학번을 입력하세요"
                style={styles.input}
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
              />
            </div>
            <div style={styles.inputGroup}>
              <label htmlFor="password" style={styles.label}>
                비밀번호:
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="비밀번호를 입력하세요"
                style={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div style={styles.buttonGroup}>
              <button type="submit" disabled={loading} style={styles.button}>
                {loading ? '로그인 중...' : '로그인'}
              </button>

              <button
                type="button"
                onClick={() => navigate('/create')}
                style={styles.buttonSecondary}
              >
                회원가입
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// 스타일 설정
const styles = {
  container: {
    width: '100%',
    maxWidth: '400px',
    margin: '100px auto',
    padding: '40px',
    border: '1px solid #ccc',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '15px',
  },
  label: {
    textAlign: 'left',
    marginBottom: '5px',
    fontSize: '14px',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    width: '100%',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '15px',
  },
  button: {
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#868e96',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    width: '48%',
  },
  buttonSecondary: {
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#868e96',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    width: '48%',
  },
  error: {
    color: 'red',
    marginBottom: '10px',
  },
};

export default Login;
