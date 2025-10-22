import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import "./css/SignupPage.css";

function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/auth/signup", { username, password });
      // TODO: 회원가입 API 호출 및 유효성 검사
      alert("회원가입 성공");
      navigate("/login");
    } catch (err) {
      if (err.response && err.response.status === 400) {
        //회원가입 400에러 발생
        setErrors(err.response.data); //에러 추출,errors에 저장
      } else {
        console.error(err);
        alert("회원가입 실패");
      }
    }
  };

  return (
    <div className="signup-page">
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <label>
          사용자 이름
          <input
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="사용자 이름"
          />
          {errors.username && <p style={{ color: "red" }}>{errors.username}</p>}
        </label>
        <label>
          비밀번호
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            required
          />
          {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
        </label>
        <button type="submit">가입하기</button>
      </form>
    </div>
  );
}

export default SignupPage;
