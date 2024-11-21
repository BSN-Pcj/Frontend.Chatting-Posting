import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Boarditem from './Boarditem';
import Boarditemdetail from './Boarditemdetail';

function Boardmonit() {
  const [posts, setPosts] = useState([]);
  const [isDetailMode, setIsDetailMode] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isListMode, setIsListMode] = useState(true);
  const [selectedPostID, setSelectedPostID] = useState(null);
  const [role, setRole] = useState('user');
  const [hasToken, setHasToken] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const postsPerPage = 7;
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

  useEffect(() => {
    fetchPosts();
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setRole(decoded.role);
      setHasToken(true);
    }
  }, [currentPage]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/posts`, {
        params: { page: currentPage, limit: postsPerPage },
      });

      setPosts(response.data.posts);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('게시물을 불러오는 중 오류가 발생했습니다:', error);
      setError('게시물을 불러오는 중 오류가 발생했습니다.');
    }
  };

  const createPost = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/api/posts`,
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setIsCreateMode(false);
      setTitle('');
      setContent('');
      fetchPosts();
    } catch (error) {
      console.error('게시물 생성 중 오류가 발생했습니다:', error);
      setError('게시물 생성 중 오류가 발생했습니다.');
    }
  };

  const editPost = async () => {
    try {
      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token);
      const post = posts.find((p) => p._id === selectedPostID);

      if (post.author._id !== decoded.id && decoded.role !== 'admin') {
        setError('자신의 게시물만 수정할 수 있습니다.');
        return;
      }

      await axios.put(
        `${API_URL}/api/posts/${selectedPostID}`,
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setIsEditMode(false);
      setIsListMode(true);
      fetchPosts();
    } catch (error) {
      console.error('게시물 수정 중 오류가 발생했습니다:', error);
      setError(error.response?.data?.message || '게시물 수정 중 오류가 발생했습니다.');
    }
  };

  const deletePost = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPosts();
    } catch (error) {
      console.error('게시물 삭제 중 오류가 발생했습니다:', error);
      setError('게시물 삭제 중 오류가 발생했습니다.');
    }
  };

  const clickEditPost = async (postId) => {
    try {
      const response = await axios.get(`${API_URL}/api/posts/${postId}`);
      setTitle(response.data.title);
      setContent(response.data.content);
      setSelectedPostID(postId);
      setIsDetailMode(false);
      setIsListMode(false);
      setIsEditMode(true);
    } catch (error) {
      console.error('게시물 정보를 불러오는 중 오류가 발생했습니다:', error);
      setError('게시물 정보를 불러오는 중 오류가 발생했습니다.');
    }
  };

  const renderListView = () => (
    <div style={styles.listContainer}>
      {posts.map((post) => (
        <Boarditem
          key={post._id}
          postId={post._id}
          title={post.title}
          createdAt={post.createdAt}
          author={post.author.nickname}
          onPostClick={(postId) => {
            setSelectedPostID(postId);
            setIsDetailMode(true);
            setIsListMode(false);
          }}
          onDeletePost={deletePost}
          onEditPost={clickEditPost}
          userRole={role}
          currentUserId={jwtDecode(localStorage.getItem('token')).id}
          authorId={post.author._id}
        />
      ))}
    </div>
  );

  const renderCreateEditForm = () => (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <h2 style={styles.modalTitle}>{isEditMode ? '게시물 수정' : '새 게시물 작성'}</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            isEditMode ? editPost() : createPost();
          }}
          style={styles.form}
        >
          <div style={styles.formGroup}>
            <label htmlFor="title" style={styles.label}>
              제목
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="content" style={styles.label}>
              내용
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용을 입력하세요"
              rows={10}
              style={styles.textarea}
              required
            />
          </div>
          <div style={styles.buttonGroup}>
            <button type="submit" style={styles.submitButton}>
              {isEditMode ? '수정' : '게시'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsCreateMode(false);
                setIsEditMode(false);
                setIsListMode(true);
                setTitle('');
                setContent('');
                setError('');
              }}
              style={styles.cancelButton}
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div style={styles.boardContainer}>
      <div style={styles.titleGroup}>
        <label htmlFor="title" style={styles.titleLabel}>
          게시판
        </label>
      </div>
      <div style={styles.yellowLine}></div>
      <div style={styles.contentContainer}>
        {isListMode && renderListView()}
        {isDetailMode && (
          <Boarditemdetail
            postId={selectedPostID}
            onGoBack={() => {
              setIsDetailMode(false);
              setIsListMode(true);
              setSelectedPostID(null);
            }}
          />
        )}
      </div>
      <div style={styles.paginationContainer}>
        <div style={styles.pagination}>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            style={styles.paginationButton}
          >
            이전
          </button>
          <span style={styles.paginationSpan}>
            {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            style={styles.paginationButton}
          >
            다음
          </button>
        </div>
        {hasToken && isListMode && (
          <button style={styles.postAddButton} onClick={() => setIsCreateMode(true)}>
            게시물 생성
          </button>
        )}
      </div>
      {(isCreateMode || isEditMode) && renderCreateEditForm()}
      {error && <div style={styles.errorMessage}>{error}</div>}
    </div>
  );
}

const styles = {
  boardContainer: {
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
  yellowLine: {
    borderBottom: '2px solid #868e96',
    margin: '10px 20px',
  },
  contentContainer: {
    flex: 1,
    overflowX: 'hidden',
    overflowY: 'auto',
    padding: '0 20px',
  },
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '13px',
  },
  paginationContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    borderTop: '1px solid #e0e0e0',
  },
  pagination: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  paginationButton: {
    backgroundColor: '#868e96',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    padding: '6px 12px',
    margin: '0 5px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.3s ease',
  },
  paginationSpan: {
    margin: '0 10px',
    fontSize: '14px',
    color: '#333',
  },
  postAddButton: {
    backgroundColor: '#868e96',
    color: 'white',
    border: 'none',
    borderRadius: '3px',
    padding: '8px 12px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.3s ease',
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
    padding: '20px',
    borderRadius: '8px',
    width: '80%',
    maxWidth: '600px',
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#484848',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  label: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#484848',
  },
  input: {
    width: '100%',
    padding: '8px',
    fontSize: '14px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  textarea: {
    width: '100%',
    padding: '8px',
    fontSize: '14px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    resize: 'vertical',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
  },
  submitButton: {
    backgroundColor: '#868e96',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '8px 16px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.3s ease',
  },
  cancelButton: {
    backgroundColor: '#e9ecef',
    color: '#495057',
    border: 'none',
    borderRadius: '4px',
    padding: '8px 16px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.3s ease',
  },
  errorMessage: {
    color: 'red',
    textAlign: 'center',
    marginTop: '10px',
  },
  noticePost: {
    backgroundColor: '#fff3cd',
    borderLeft: '5px solid #ffc107',
  },
};

export default Boardmonit;
