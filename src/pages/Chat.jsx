import React from 'react';
import Logo from '../components/Logo';
import Sidebar from '../components/Sidebar';
import Chatmonit from '../components/Chatmonit';

function Chat() {
  return (
    <div style={styles.pageContainer}>
      <div style={styles.boardContainer}>
        <div style={styles.logoContainer}>
          <Logo />
        </div>
        <div style={styles.contentContainer}>
          <div style={styles.sidebarContainer}>
            <Sidebar />
          </div>
          <div style={styles.chatContentWrapper}>
            <div style={styles.chatmonitContainer}>
              <Chatmonit />
            </div>
          </div>
        </div>
        <div style={styles.footerContainer}></div>
      </div>
    </div>
  );
}
const styles = {
  pageContainer: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', // 배경색 추가
  },
  boardContainer: {
    width: '100%',
    height: '100%',
    maxWidth: '1280px',
    maxHeight: '720px',
    aspectRatio: '16 / 9',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    backgroundColor: 'white',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  },
  logoContainer: {
    height: '20%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    display: 'flex',
    overflow: 'hidden',
  },
  sidebarContainer: {
    width: 'auto',
    height: '100%',
    overflow: 'hidden',
    paddingLeft: '2%',
    paddingRight: '0.5%',
  },
  chatContentWrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
    padding: '1%',
    paddingLeft: '0.5%',
    paddingRight: '2%',
  },
  chatmonitContainer: {
    width: '95%', // Boardmonit의 너비를 줄입니다
    height: '95%', // Boardmonit의 높이를 줄입니다
    margin: 'auto', // 중앙 정렬
    overflow: 'auto', // 내용이 넘칠 경우 스크롤 생성
  },
  footerContainer: {
    height: '15%',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default Chat;
