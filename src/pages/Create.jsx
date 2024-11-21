import React, { useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';

function Create() {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [studentIdChecked, setStudentIdChecked] = useState(false);
  const [nicknameChecked, setNicknameChecked] = useState(false);
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const validateStudentId = (id) => {
    return /^\d{10}$/.test(id);
  };

  const validateNickname = (nickname) => {
    const koreanRegex = /^[가-힣]{3}$/;
    return koreanRegex.test(nickname);
  };

  const handleStudentIdCheck = async () => {
    if (!validateStudentId(studentId)) {
      setError('학번은 10자리 숫자여야 합니다.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/check-student-id`, { studentId });
      alert(response.data.message);
      setStudentIdChecked(true);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message);
      } else {
        setError('학번 확인 중 오류가 발생했습니다.');
      }
      setStudentIdChecked(false);
    } finally {
      setLoading(false);
    }
  };

  const handleNicknameCheck = async () => {
    if (!validateNickname(nickname)) {
      setError('닉네임은 정확히 3글자의 한글이어야 합니다.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/check-nickname`, { nickname });
      alert(response.data.message);
      setNicknameChecked(true);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message);
      } else {
        setError('닉네임 확인 중 오류가 발생했습니다.');
      }
      setNicknameChecked(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!studentIdChecked) {
      setError('학번 중복 확인을 해주세요.');
      setLoading(false);
      return;
    }

    if (!nicknameChecked) {
      setError('닉네임 중복 확인을 해주세요.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/register`, {
        studentId,
        password,
        nickname,
      });
      if (response.data.success) {
        alert('회원가입 성공!');
        navigate('/');
      } else {
        setError(response.data.message || '회원가입 중 오류가 발생했습니다.');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message || '회원가입 중 오류가 발생했습니다.');
      } else {
        setError('서버와의 통신 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

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
          <h2 style={styles.title}>회원가입</h2>
          {error && <p style={styles.error}>{error}</p>}
          <form onSubmit={handleSignUp} style={styles.form}>
            <div style={styles.inputGroup}>
              <label htmlFor="studentId" style={styles.label}>
                학번:
              </label>
              <input
                id="studentId"
                type="text"
                placeholder="학번을 입력하세요 (10자리 숫자)"
                style={styles.input}
                value={studentId}
                onChange={(e) => {
                  setStudentId(e.target.value);
                  setStudentIdChecked(false);
                }}
                required
              />
              <button type="button" onClick={handleStudentIdCheck} style={styles.buttonSecondary}>
                학번 중복 확인
              </button>
            </div>

            <div style={styles.inputGroup}>
              <label htmlFor="password" style={styles.label}>
                비밀번호:
              </label>
              <input
                id="password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                style={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label htmlFor="confirmPassword" style={styles.label}>
                비밀번호 확인:
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="비밀번호를 다시 입력하세요"
                style={styles.input}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label htmlFor="nickname" style={styles.label}>
                닉네임:
              </label>
              <input
                id="nickname"
                type="text"
                placeholder="닉네임을 입력하세요 (3글자 한글)"
                style={styles.input}
                value={nickname}
                onChange={(e) => {
                  setNickname(e.target.value);
                  setNicknameChecked(false);
                }}
                required
              />
              <button type="button" onClick={handleNicknameCheck} style={styles.buttonSecondary}>
                닉네임 중복 확인
              </button>
            </div>

            <div style={styles.buttonGroup}>
              <button type="button" onClick={() => navigate('/')} style={styles.buttonThird}>
                취소
              </button>
              <button
                type="submit"
                style={styles.button}
                disabled={loading || !studentIdChecked || !nicknameChecked}
              >
                {loading ? '처리 중...' : '회원가입'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    maxWidth: '400px',
    margin: '17px auto',
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
    //회원가입
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
    //이메일인증,닉넴중복
    padding: '10px',
    fontSize: '16px',
    backgroundColor: 'gray',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    width: '100%',
    marginTop: '10px',
  },
  buttonThird: {
    //취소버튼
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

export default Create;
