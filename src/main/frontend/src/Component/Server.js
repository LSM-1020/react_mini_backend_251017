// // server.js
// import express from "express";
// import bodyParser from "body-parser";
// import { VM } from "vm2";
// import { exec } from "child_process";
// import fs from "fs";

// const app = express();
// const PORT = 5000;

// app.use(bodyParser.json());

// // 코드 실행 (JS/Java 자동 판단)
// app.post("/api/run-code", (req, res) => {
//   const { code, language } = req.body; // language: "js" 또는 "java"

//   if (language === "js") {
//     // JS 코드 실행
//     const vm = new VM({ timeout: 1000, sandbox: {} });
//     try {
//       const output = vm.run(code);
//       res.json({ success: true, output: String(output) });
//     } catch (err) {
//       res.json({ success: false, error: err.message });
//     }
//   } else if (language === "java") {
//     // Java 코드 실행
//     fs.writeFileSync("Main.java", code);

//     exec("javac Main.java && java Main", (err, stdout, stderr) => {
//       if (err) {
//         res.json({ success: false, error: stderr });
//       } else {
//         res.json({ success: true, output: stdout });
//       }
//     });
//   } else {
//     res.json({ success: false, error: "지원하지 않는 언어입니다." });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Code runner server running on http://localhost:${PORT}`);
// });
