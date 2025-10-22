import { useState } from "react";
import api from "../api/axiosConfig";

function CodeRunner() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState("");

  const handleRun = async () => {
    try {
      const res = await api.post("/api/run-java", { code });
      if (res.data.success) setResult(res.data.output);
      else setResult("오류:\n" + res.data.output);
    } catch (err) {
      setResult("실행 실패: " + err.message);
    }
  };

  return (
    <div className="code-runner">
      <h3>Java 코드 실행기</h3>

      <div className="code-box">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="클래스 전체를 작성하세요.단 import문 제외 / 예: public class Main { public static void main(String[] args) { ... } }"
          className="code-input"
        />
        <button className="btn-run" type="button" onClick={handleRun}>
          실행
        </button>
        <pre>{result}</pre>
      </div>
    </div>
  );
}

export default CodeRunner;
