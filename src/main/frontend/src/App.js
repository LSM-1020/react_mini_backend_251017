import { Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./Component/Navbar";
import HomePage from "./Component/HomePage";
import BoardDetail from "./Component/BoardDetail";
import LoginPage from "./Component/LoginPage";
import BoardPage from "./Component/BoardPage";
import BoardWrite from "./Component/BoardWrite";
import SignupPage from "./Component/SignupPage";
import { useEffect, useState } from "react";
import api from "./api/axiosConfig";

function App() {
  const [user, setUser] = useState(null); //현재 로그인한 유저의 이름

  const checkUser = async () => {
    try {
      const res = await api.get("api/auth/me");
      setUser(res.data.username);
    } catch {
      setUser(null);
    }
  };
  useEffect(() => {
    checkUser();
  }, []);

  const handleLogout = async () => {
    await api.post("/api/auth/logout"); //백엔드 시큐리티에서 이 요청이 들어가면 로그아웃
    if (!window.confirm("로그아웃 하시겠습니까?")) return;

    setUser(null);
  };

  return (
    <div className="App">
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* /*app에서 선언한것들을 타 페이지에서 쓰기위해 props를 넣어줌 ->board는 user가 필요하기에 user={user}로 써주면, board페이지에서 board 쓸수있음*/}
        <Route path="/board" element={<BoardPage user={user} />} />
        <Route path="/login" element={<LoginPage onLogin={setUser} />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/board/:id" element={<BoardDetail user={user} />} />
        <Route path="/board/Write" element={<BoardWrite user={user} />} />
      </Routes>
    </div>
  );
}

export default App;
