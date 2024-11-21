import React from 'react';

const Boarditem = ({
  postId,
  title,
  createdAt,
  author,
  onPostClick,
  onDeletePost,
  onEditPost,
  userRole,
  currentUserId,
  authorId,
}) => {
  const formattedDate = () => {
    const created_at = new Date(createdAt);
    return created_at.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const handleClick = () => {
    onPostClick(postId);
  };

  const deletePost = (e) => {
    e.stopPropagation();
    onDeletePost(postId);
  };

  const clickEditPost = (e) => {
    e.stopPropagation();
    onEditPost(postId);
  };

  return (
    <div style={styles.card}>
      <div style={styles.cardContent} onClick={handleClick}>
        <h5 style={styles.cardTitle}>{title}</h5>
        <p style={styles.cardAuthor}>{author}</p>
        <p style={styles.textMuted}>{formattedDate()}</p>
      </div>
      <div style={styles.actionButtons}>
        {(userRole === 'admin' || currentUserId === authorId) && (
          <button onClick={clickEditPost} style={styles.actionButton}>
            수정
          </button>
        )}
        {(userRole === 'admin' || currentUserId === authorId) && (
          <button onClick={deletePost} style={styles.actionButton}>
            삭제
          </button>
        )}
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: '#ffffff',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
  },
  cardContent: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#000000',
    flex: 1,
    textAlign: 'left',
    margin: '0 10px',
  },
  cardAuthor: {
    fontSize: '14px',
    color: '#666666',
    width: '100px',
    textAlign: 'center',
    margin: '0 10px',
  },
  textMuted: {
    color: '#666666',
    fontSize: '12px',
    width: '100px',
    textAlign: 'right',
    margin: '0 10px',
  },
  actionButtons: {
    display: 'flex',
    gap: '5px',
  },
  actionButton: {
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#f0f0f0',
    color: '#333',
    cursor: 'pointer',
    padding: '5px 10px',
    fontSize: '12px',
  },
};

export default Boarditem;
