<template>
    <div class="auth">
      <h1 class="auth__title">SSAFYNEWS</h1>
      <p class="auth__subtitle">맞춤형 AI 뉴스 큐레이션</p>
  
      <div class="auth__card">
        <h2 style="font-size: 24px; font-weight: 700;">회원가입</h2>
        <p>SSAFY 뉴스 서비스에 오신 것을 환영합니다</p>
        <input v-model="username" placeholder="이름" />
        <input v-model="email" placeholder="이메일" />
        <input v-model="password1" type="password" placeholder="비밀번호" />
        <input v-model="password2" type="password" placeholder="비밀번호 확인" />
        <button @click="register">가입하기</button>
        <p class="login-link">
          이미 계정이 있으신가요? <router-link to="/login">로그인하기</router-link>
        </p>
      </div>
  
      <footer>
        <span>이용약관</span>
        <span>개인정보처리방침</span>
        <router-link to="/login">로그인</router-link>
        <p>&copy; 2024 SSAFY NEWS. All rights reserved.</p>
      </footer>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import axios from "axios";
  import { useRouter } from "vue-router";
  
  const router = useRouter();
  const username = ref("");
  const email = ref("");
  const password1 = ref("");
  const password2 = ref("");
  
  const register = async () => {
    try {
      await axios.post("http://localhost:8000/auth/registration/", {
        username: username.value,
        email: email.value,
        password1: password1.value,
        password2: password2.value,
      });
      router.push("/login");
    } catch (err) {
      console.error("회원가입 실패:", err);
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
  
  .login-link {
    margin-top: 15px;
  }
  </style>