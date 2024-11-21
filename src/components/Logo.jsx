import React from 'react';
import { useNavigate } from 'react-router-dom';

function Logo() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/home');
  };

  return (
    <header style={headerStyle}>
      <div style={logoStyle} onClick={handleLoginClick}>
        PCJ
      </div>
    </header>
  );
}

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 20px',
  backgroundColor: 'white',
  color: '#1f2937',
};

const logoStyle = {
  fontSize: '24px',
  fontWeight: 'bold',
  flexGrow: 1,
  textAlign: 'center',
  cursor: 'pointer', // 마우스 커서를 포인터로 변경
};

export default Logo;
