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
  margin-top: 80px;
  padding: 0 24px;
  
  .auth__title {
    font-size: 1.8rem;
    font-weight: 800;
    color: #234e70;
    letter-spacing: 1.5px;
    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #1e3c72 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-family: 'Montserrat', 'Pretendard', 'Noto Sans KR', 'Inter', Arial, sans-serif;
    text-transform: uppercase;
    margin-bottom: 8px;
  }
  
  .auth__subtitle {
    font-size: 0.95rem;
    color: #4a5568;
    margin-bottom: 40px;
  }
  
  .auth__card {
    margin: 0 auto;
    padding: 32px;
    width: 100%;
    max-width: 400px;
    background: #ffffff;
    box-shadow: 0 2px 8px rgba(0,60,120,0.08);
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    
    h2 {
      font-size: 1.4rem;
      font-weight: 700;
      color: #234e70;
      margin-bottom: 8px;
    }
    
    p {
      font-size: 0.95rem;
      color: #4a5568;
      margin-bottom: 24px;
    }
    
    input {
      width: 100%;
      margin-bottom: 16px;
      padding: 10px 16px;
      font-size: 0.95rem;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      background: #f8fafc;
      color: #234e70;
      transition: all 0.2s ease;
      
      &:focus {
        outline: none;
        border-color: #2a5298;
        background: #fff;
        box-shadow: 0 2px 4px rgba(42,82,152,0.1);
      }
    }
    
    button {
      width: 100%;
      padding: 12px;
      background: linear-gradient(90deg, #1e3c72 0%, #2a5298 100%);
      color: white;
      font-weight: 600;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.95rem;
      transition: all 0.2s ease;
      margin-bottom: 20px;
      
      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(42,82,152,0.15);
      }
    }
    
    a {
      color: #2a5298;
      font-weight: 500;
      text-decoration: none;
      transition: color 0.2s;
      
      &:hover {
        color: #1e3c72;
        text-decoration: underline;
      }
    }
  }
  
  footer {
    margin-top: 48px;
    font-size: 0.85rem;
    color: #718096;
    
    span {
      margin: 0 12px;
      cursor: pointer;
      transition: color 0.2s;
      
      &:hover {
        color: #2a5298;
      }
    }
    
    p {
      margin-top: 12px;
    }
  }
}

@media (max-width: 480px) {
  .auth {
    margin-top: 40px;
    
    .auth__card {
      padding: 24px;
    }
  }
}
</style>