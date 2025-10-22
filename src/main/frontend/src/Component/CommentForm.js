import { useState } from "react";
import api from "../api/axiosConfig";
import "./css/CommentForm.css";

function CommentForm({ user, postId, onCommentAdded, loadComments }) {
  const [comment, setComment] = useState("");
  const [newComment, setNewComment] = useState("");
  const [commentErrors, setCommentErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (newComment.trim() === "") {
    //   alert("댓글 내용을 입력하세요.");

    //   return;
    // }

    try {
      alert("댓글을 입력하시겠습니까?");
      await api.post(`/api/comments/${postId}`, { content: newComment });
      setNewComment(""); //댓글 리스트 불러오기 호출
      setCommentErrors({}); //에러 초기화
      loadComments(); //새 댓글 기존 댓글 리스트에 반영
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setCommentErrors(err.response.data);
      } else {
        console.error(err);
        alert("댓글 등록 실패!");
      }
    }
  };

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="댓글을 작성하세요."
        rows={3}
      />
      {commentErrors.content && (
        <p style={{ color: "red" }}>{commentErrors.content}</p>
      )}
      <button type="submit" className="btn-submit-comment">
        댓글 작성
      </button>
    </form>
  );
}

export default CommentForm;
