import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import "./css/LoginPage.css";

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: 로그인 API 호출 및 검증
    if (username.trim() === "") {
      alert("사용자 이름을 입력하세요.");
      return;
    }
    try {
      await api.post(
        "/api/auth/login",
        new URLSearchParams({ username, password })
      );
      //현재 로그인한 사용자 정보 가져오기
      const res = await api.get("api/auth/me");
      onLogin(res.data.username); //app에서 전달된 props인 onlogin의 값으로 로그인한 유저의 username전달
      alert(`${username}님 어서오세요`);
      navigate("/", { replace: true });
    } catch (err) {
      // 2. 서버 응답을 통한 오류 처리
      // [수정] id 또는 비밀번호 틀렸을 때 오류창 출력
      if (
        err.response &&
        (err.response.status === 400 || err.response.status === 401)
      ) {
        // 400 Bad Request 또는 401 Unauthorized 응답이 오면
        alert("아이디 또는 비밀번호가 올바르지 않습니다.");
      } else {
        // 그 외 다른 네트워크 오류나 서버 오류 등
        console.error("로그인 실패:", err);
        alert("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    }
  };

  return (
    <div className="login-page">
      <h2>로그인</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <label>
          사용자 이름
          <input
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="사용자 이름"
          />
        </label>
        <label>
          비밀번호
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
          />
        </label>
        <button type="submit">로그인</button>
      </form>
    </div>
  );
}

export default LoginPage;
