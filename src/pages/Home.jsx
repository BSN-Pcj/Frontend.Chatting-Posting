import React from 'react';
import Logo from '../components/Logo';
import Homebar from '../components/Homebar';

function Home() {
  return (
    <div style={styles.pageContainer}>
      <div style={styles.homeContainer}>
        <div style={styles.logoContainer}>
          <Logo />
        </div>
        <div style={styles.contentContainer}>
          <div style={styles.homebarContainer}>
            <Homebar />
          </div>
        </div>
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
  homeContainer: {
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
    height: '80%', // 8/10 of the total height
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center', // 수평 중앙 정렬
    alignItems: 'center', // 수직 중앙 정렬
  },
  homebarContainer: {
    width: 'auto',
    height: '100%', // 컨테이너의 전체 높이를 사용
    backgroundColor: '#e0e0e0',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center', // 수직 중앙 정렬
    alignItems: 'center', // 수평 중앙 정렬
  },
};

export default Home;
