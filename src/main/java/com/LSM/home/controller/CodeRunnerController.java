package com.LSM.home.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.io.*;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api")
public class CodeRunnerController {

    @PostMapping("/run-java")
    public ResponseEntity<?> runJava(@RequestBody CodeRequest request) {
        String userCode = request.getCode();

        // 클래스 이름 추출
        Pattern pattern = Pattern.compile("public\\s+class\\s+(\\w+)");
        Matcher matcher = pattern.matcher(userCode);
        String className;
        if (matcher.find()) {
            className = matcher.group(1);
        } else {
            className = "TempProgram_" + UUID.randomUUID().toString().replace("-", "");
            userCode = "public class " + className + " {\n" + userCode + "\n}";
        }

        // 시스템 임시 디렉토리 사용
        String tempDir = System.getProperty("java.io.tmpdir");
        File javaFile = new File(tempDir, className + ".java");

        try (FileWriter fw = new FileWriter(javaFile)) {
            fw.write(userCode);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("파일 생성 실패: " + e.getMessage());
        }

        try {
            // 컴파일
            Process compileProcess = new ProcessBuilder("javac", javaFile.getAbsolutePath())
                    .redirectErrorStream(true)
                    .start();
            compileProcess.waitFor();

            BufferedReader compileOutput = new BufferedReader(new InputStreamReader(compileProcess.getInputStream()));
            StringBuilder compileErrMsg = new StringBuilder();
            String line;
            while ((line = compileOutput.readLine()) != null) compileErrMsg.append(line).append("\n");

            if (compileErrMsg.length() > 0) {
                return ResponseEntity.ok(new CodeResponse(false, compileErrMsg.toString()));
            }

            // 실행 (classpath에 temp 디렉토리 지정)
            Process runProcess = new ProcessBuilder("java", "-cp", tempDir, className)
                    .redirectErrorStream(true)
                    .start();

            BufferedReader runOutput = new BufferedReader(new InputStreamReader(runProcess.getInputStream()));
            StringBuilder output = new StringBuilder();
            while ((line = runOutput.readLine()) != null) output.append(line).append("\n");

            runProcess.waitFor();

            // 파일 삭제
            javaFile.delete();
            new File(tempDir, className + ".class").delete();

            return ResponseEntity.ok(new CodeResponse(true, output.toString()));

        } catch (Exception e) {
            return ResponseEntity.status(500).body("실행 실패: " + e.getMessage());
        }
    }

    // 요청 DTO
    public static class CodeRequest {
        private String code;
        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }
    }

    // 응답 DTO
    public static class CodeResponse {
        private boolean success;
        private String output;
        public CodeResponse(boolean success, String output) {
            this.success = success;
            this.output = output;
        }
        public boolean isSuccess() { return success; }
        public String getOutput() { return output; }
    }
}