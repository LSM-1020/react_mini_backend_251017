import "./css/Home.css";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="hero">
        <h1 className="hero-title">💻 Dev Community</h1>
        <p className="hero-subtitle">
          개발자들이 프로젝트, 질문, 정보를 공유하고 소통하는 공간입니다.
        </p>
        <p className="hero-subtitle">
          자유롭게 글을 작성하고 댓글을 남기며 함께 성장해보세요.
        </p>
        <button className="btn-primary" onClick={() => navigate("/board")}>
          게시판 바로가기
        </button>
      </div>

      <div className="features">
        <h2 className="features-title">커뮤니티 기능</h2>
        <div className="feature-cards">
          <div className="card">
            <h3>프로젝트 공유</h3>
            <p>자신의 프로젝트를 소개하고 다른 개발자들과 협업하세요.</p>
          </div>
          <div className="card">
            <h3>질문 & 답변</h3>
            <p>개발 중 궁금한 점을 질문하고, 전문가들의 답변을 받아보세요.</p>
          </div>
          <div className="card">
            <h3>자료 & 정보</h3>
            <p>유용한 개발 자료와 팁을 공유하고 함께 성장하세요.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
