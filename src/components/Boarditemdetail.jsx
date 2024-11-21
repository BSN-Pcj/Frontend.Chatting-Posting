import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const Boarditemdetail = ({ postId, onGoBack }) => {
  const [post, setPost] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const fetchPost = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/api/posts/${postId}`);
      setPost(response.data);
      console.log('Fetched post data:', response.data);
    } catch (error) {
      console.error('게시물을 불러오는 중 오류가 발생했습니다:', error);
    }
  }, [postId, API_URL]);

  const handleKeydown = useCallback(
    (event) => {
      if (event.key === 'Escape') onGoBack();
    },
    [onGoBack],
  );

  useEffect(() => {
    fetchPost();
    window.addEventListener('keydown', handleKeydown);

    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [fetchPost, handleKeydown]);

  const formattedDate = (date) => {
    return new Date(date).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div style={styles.postDetails}>
      <div style={styles.postForm}>
        <h2 style={styles.postTitle}>{post?.title}</h2>
        <p style={styles.postAuthor}>작성자: {post?.author?.nickname}</p>
        <p style={styles.postDate}>작성일: {formattedDate(post?.createdAt)}</p>
        <pre style={styles.postContent}>{post?.content}</pre>
      </div>
      <div style={styles.postBtn}>
        <button onClick={onGoBack} style={styles.backButton}>
          목록으로
        </button>
      </div>
    </div>
  );
};

const styles = {
  postDetails: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
  },
  postForm: {
    padding: '20px',
  },
  postTitle: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#484848',
    marginBottom: '15px',
    borderBottom: '2px solid #868e96',
    paddingBottom: '10px',
  },
  postAuthor: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '5px',
  },
  postDate: {
    fontSize: '14px',
    color: '#888',
    marginBottom: '20px',
  },
  postContent: {
    fontSize: '16px',
    color: '#605548',
    marginBottom: '20px',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  postBtn: {
    textAlign: 'center',
    padding: '0 20px 20px',
  },
  backButton: {
    display: 'inline-block',
    padding: '8px 16px',
    fontSize: '14px',
    backgroundColor: '#868e96',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
};

export default Boarditemdetail;
