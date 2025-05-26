<template>
  <div class="auth" @keyup.enter="login">
    <h1 class="auth__title">SSAFYNEWS</h1>
    <p class="auth__subtitle">맞춤형 AI 뉴스 큐레이션</p>

    <div class="auth__card">
      <h2 style="font-size: 24px; font-weight: 700;">로그인</h2>
      <p>SSAFY 뉴스 서비스에 오신 것을 환영합니다</p>
      <input v-model="email" placeholder="이메일" class="input-box" />
      <input v-model="password" type="password" placeholder="비밀번호" class="input-box" />
      <button class="login-button" @click="login">로그인하기</button>
      <p class="register-link">
        아직 계정이 없으신가요? <router-link to="/register">가입하기</router-link>
      </p>
    </div>

    <footer>
      <span>이용약관</span>
      <span>개인정보처리방침</span>
      <router-link to="/register">회원가입</router-link>
      <p>&copy; 2024 SSAFY NEWS. All rights reserved.</p>
    </footer>
  </div>
</template>

  
<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth"; // ✅ 전역 로그인 상태 관리

const router = useRouter();
const { login: setLoginState } = useAuth(); // 로그인 상태 변경용 함수 가져오기

const email = ref("");
const password = ref("");

const login = async () => {
  try {
    const response = await axios.post("http://localhost:8000/auth/login/", {
      email: email.value,
      password: password.value,
    });

    console.log("로그인 성공:", response.data);

    // Access Token 저장
    localStorage.setItem("accessToken", response.data.access);
    localStorage.setItem("user", JSON.stringify(response.data.user));
    localStorage.setItem("refresh_token", response.data.refresh);

    // 전역 로그인 상태 true로 설정
    setLoginState(response.data.access);

    // 메인 페이지로 이동
    router.push("/");
  } catch (error) {
    console.error("로그인 실패:", error.response?.data || error.message);
    alert("이메일 또는 비밀번호를 다시 확인하세요.");
  }
};
</script>
  
  <style scoped>
  .auth {
    text-align: center;
    margin-top: 100px;
  }
  
  .auth__title {
    font-size: 32px;
    font-weight: 800;
  }
  
  .auth__subtitle {
    font-size: 14px;
    color: #777;
    margin-top: 5px;
  }
  
  .auth__card {
    margin: 40px auto;
    padding: 40px;
    width: 400px;
    background: white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .auth__card h2 {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 10px;
  }
  
  .auth__card p {
    font-size: 14px;
    color: #555;
    margin-bottom: 20px;
  }
  
  .auth__card input {
    width: 100%;
    margin-bottom: 12px;
    padding: 12px 15px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 8px;
    outline: none;
  }
  
  .auth__card input:focus {
    border-color: #000;
  }
  
  .auth__card button {
    width: 100%;
    padding: 14px;
    background: black;
    color: white;
    font-weight: bold;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-size: 15px;
    transition: background 0.3s;
    margin-bottom: 20px;
  }
  
  .auth__card button:hover {
    background: #333;
  }
  
  .auth__card router-link {
    color: #000;
    font-weight: bold;
    text-decoration: underline;
  }
  
  footer {
    margin-top: 60px;
    font-size: 13px;
    color: #888;
  }
  
  footer span {
    margin: 0 12px;
  }
  
  footer p {
    margin-top: 10px;
  }

  .register-link {
    margin-top: 15px;
  }
  </style>