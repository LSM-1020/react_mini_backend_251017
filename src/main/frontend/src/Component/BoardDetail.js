import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";
import api from "../api/axiosConfig";
import PostEdit from "./PostEdit";
import "./css/BoardDetail.css";
import CodeRunner from "./CodeRunner"; // 코드 실행기 컴포넌트

function BoardDetail({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [showCodeRunner, setShowCodeRunner] = useState(false); // 코드 입력창 토글

  const loadPost = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/board/${id}`);
      setPost(res.data);
    } catch (err) {
      console.error(err);
      setError("해당 게시글은 존재하지 않습니다.");
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const res = await api.get(`/api/comments/${id}`);
      setComments(res.data);
    } catch (err) {
      console.error(err);
      alert("댓글 리스트 불러오기 실패!");
    }
  };

  const handleCommentAdded = () => {
    loadComments();
  };

  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await api.delete(`/api/board/${post.id}`);
      alert("게시글이 삭제되었습니다!");
      navigate("/board");
    } catch (err) {
      console.error(err);
      if (err.response?.status === 403) {
        alert("삭제 권한이 없습니다.");
      } else {
        alert("삭제 실패!");
      }
    }
  };

  useEffect(() => {
    loadPost();
    loadComments();
  }, [id]);

  if (loading) return <div>게시글을 불러오는 중입니다...</div>;
  if (error) return <div>{error}</div>;

  // 수정 모드면 PostEdit 렌더링
  if (editing) {
    return <PostEdit post={post} setEditing={setEditing} setPost={setPost} />;
  }

  // 수정 모드가 아니면 게시글 + 댓글 View
  return (
    <div className="board-detail-page">
      <h2>{post.title}</h2>
      <div className="board-detail-meta">
        <span>작성자: {post.author?.username}</span> |{" "}
        <span>{new Date(post.createDate).toLocaleDateString()}</span>
      </div>
      <div className="board-detail-content">{post.content}</div>

      <button
        type="button"
        className="toggle-code-btn"
        onClick={() => setShowCodeRunner(!showCodeRunner)}
      >
        {showCodeRunner ? "코드 입력 닫기" : "코드 입력"}
      </button>
      {showCodeRunner && (
        <div className="code-runner-container">
          <CodeRunner />
        </div>
      )}

      <div className="comments-section">
        <h3>댓글</h3>
        <CommentList
          comments={comments}
          user={user}
          loadComments={loadComments}
        />
      </div>

      {user ? (
        <CommentForm
          postId={id}
          onCommentAdded={handleCommentAdded}
          loadComments={loadComments}
          user={user}
        />
      ) : (
        <p>댓글 작성은 로그인 후 가능합니다.</p>
      )}

      <div className="button-group">
        <button className="list-button" onClick={() => navigate("/board")}>
          글목록
        </button>

        {/* 게시글 작성자만 수정/삭제 버튼 표시 */}
        {post?.author?.username === user && (
          <>
            <button className="edit-button" onClick={() => setEditing(true)}>
              글수정
            </button>
            <button className="delete-button" onClick={handleDelete}>
              글삭제
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default BoardDetail;
