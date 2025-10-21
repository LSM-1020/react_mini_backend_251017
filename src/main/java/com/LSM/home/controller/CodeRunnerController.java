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
            className = matcher.group(1); // 사용자가 작성한 클래스 이름
        } else {
            // 클래스 이름이 없으면 임의 생성
            className = "TempProgram_" + UUID.randomUUID().toString().replace("-", "");
            userCode = "public class " + className + " {\n" + userCode + "\n}";
        }

        File tempFile = new File(className + ".java");

        try (FileWriter fw = new FileWriter(tempFile)) {
            fw.write(userCode); // 사용자 코드 그대로 저장
        } catch (IOException e) {
            return ResponseEntity.status(500).body("파일 생성 실패: " + e.getMessage());
        }

        try {
            // 컴파일
            Process compileProcess = new ProcessBuilder("javac", tempFile.getName()).start();
            compileProcess.waitFor();

            BufferedReader compileError = new BufferedReader(new InputStreamReader(compileProcess.getErrorStream()));
            StringBuilder compileErrMsg = new StringBuilder();
            String line;
            while ((line = compileError.readLine()) != null) compileErrMsg.append(line).append("\n");

            if (compileErrMsg.length() > 0) {
                return ResponseEntity.ok(new CodeResponse(false, compileErrMsg.toString()));
            }

            // 실행
            Process runProcess = new ProcessBuilder("java", className).start();
            BufferedReader runOutput = new BufferedReader(new InputStreamReader(runProcess.getInputStream()));
            BufferedReader runError = new BufferedReader(new InputStreamReader(runProcess.getErrorStream()));

            StringBuilder output = new StringBuilder();
            while ((line = runOutput.readLine()) != null) output.append(line).append("\n");

            StringBuilder errorOutput = new StringBuilder();
            while ((line = runError.readLine()) != null) errorOutput.append(line).append("\n");

            runProcess.waitFor();

            // 파일 삭제
            tempFile.delete();
            new File(className + ".class").delete();

            if (errorOutput.length() > 0) {
                return ResponseEntity.ok(new CodeResponse(false, errorOutput.toString()));
            }

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
        public CodeResponse(boolean success, String output) { this.success = success; this.output = output; }
        public boolean isSuccess() { return success; }
        public String getOutput() { return output; }
    }
}
