import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import CodeRunner from "./CodeRunner"; // 코드 실행기 컴포넌트
import "./css/BoardWrite.css";

function BoardWrite({ user }) {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState({});
  const [showCodeRunner, setShowCodeRunner] = useState(false); // 코드 입력창 토글

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("로그인 후 사용가능합니다");
      return;
    }

    try {
      await api.post("/api/board", { title, content });
      alert("글작성 완료");
      navigate("/board"); // 작성 완료 후 게시판 페이지로 이동
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setErrors(err.response.data); // 유효성 에러 처리
      } else {
        console.error(err);
        alert("글쓰기 실패");
      }
    }
  };

  return (
    <div className="board-write-page">
      <h2>새 글 작성</h2>
      <form onSubmit={handleSubmit} className="board-write-form">
        <label>
          제목
          <input
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
          />
          {errors.title && <p style={{ color: "red" }}>{errors.title}</p>}
        </label>

        <label>
          내용
          <textarea
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력하세요"
            rows={8}
          />
          {errors.content && <p style={{ color: "red" }}>{errors.content}</p>}
        </label>

        <div className="form-buttons">
          <button type="submit" className="btn-submit">
            작성 완료
          </button>
          <button
            type="button"
            className="toggle-code-btn"
            onClick={() => setShowCodeRunner(!showCodeRunner)}
          >
            {showCodeRunner ? "코드 입력 닫기" : "코드 입력"}
          </button>
        </div>

        {showCodeRunner && (
          <div className="code-runner-container">
            <CodeRunner />
          </div>
        )}
      </form>
    </div>
  );
}

export default BoardWrite;
