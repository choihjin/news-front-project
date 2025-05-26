<template>
  <div class="auth" @keyup.enter="register">
    <div class="auth__container">
      <div class="auth__header">
        <h1 class="auth__title">SSAFYNEWS</h1>
        <p class="auth__subtitle">맞춤형 AI 뉴스 큐레이션</p>
      </div>

      <div class="auth__card">
        <div class="auth__card-header">
          <h2>회원가입</h2>
          <p>SSAFY 뉴스 서비스에 오신 것을 환영합니다</p>
        </div>

        <div class="auth__form">
          <div class="input-group">
            <label for="username">이름</label>
            <input 
              id="username"
              v-model="username" 
              type="text" 
              placeholder="이름을 입력하세요"
              class="input-box" 
            />
          </div>

          <div class="input-group">
            <label for="email">이메일</label>
            <input 
              id="email"
              v-model="email" 
              type="email" 
              placeholder="이메일을 입력하세요"
              class="input-box" 
            />
          </div>

          <div class="input-group">
            <label for="password1">비밀번호</label>
            <input 
              id="password1"
              v-model="password1" 
              type="password" 
              placeholder="비밀번호를 입력하세요"
              class="input-box" 
            />
          </div>

          <div class="input-group">
            <label for="password2">비밀번호 확인</label>
            <input 
              id="password2"
              v-model="password2" 
              type="password" 
              placeholder="비밀번호를 다시 입력하세요"
              class="input-box" 
            />
          </div>

          <button class="register-button" @click="register">
            <span class="button-text">가입하기</span>
            <span class="button-icon">→</span>
          </button>

          <p class="login-link">
            이미 계정이 있으신가요? 
            <router-link to="/login" class="link">로그인하기</router-link>
          </p>
        </div>
      </div>

      <footer class="auth__footer">
        <div class="footer-links">
          <a href="#" class="footer-link">이용약관</a>
          <a href="#" class="footer-link">개인정보처리방침</a>
          <router-link to="/login" class="footer-link">로그인</router-link>
        </div>
        <p class="copyright">&copy; 2024 SSAFY NEWS. All rights reserved.</p>
      </footer>
    </div>
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

<style scoped lang="scss">
.auth {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f8fafc 0%, #e3f0fa 100%);
  padding: 24px;

  &__container {
    width: 100%;
    max-width: 480px;
  }

  &__header {
    text-align: center;
    margin-bottom: 40px;
  }

  &__title {
    font-size: 2.5rem;
    font-weight: 800;
    background: linear-gradient(135deg, var(--c-primary-dark) 0%, var(--c-primary) 50%, var(--c-primary-light) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: 2px;
    margin-bottom: 12px;
    font-family: 'Montserrat', 'Pretendard', 'Noto Sans KR', 'Inter', Arial, sans-serif;
    text-transform: uppercase;
  }

  &__subtitle {
    font-size: 1.1rem;
    color: var(--c-gray-600);
    font-weight: 500;
  }

  &__card {
    background: white;
    border-radius: 24px;
    box-shadow: 0 8px 32px rgba(34, 113, 177, 0.08);
    padding: 40px;
    margin-bottom: 32px;
    border: 1px solid rgba(34, 113, 177, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(34, 113, 177, 0.12);
    }

    &-header {
      text-align: center;
      margin-bottom: 32px;

      h2 {
        font-size: 1.8rem;
        font-weight: 700;
        color: var(--c-primary-dark);
        margin-bottom: 8px;
      }

      p {
        font-size: 1rem;
        color: var(--c-gray-600);
      }
    }
  }

  &__form {
    .input-group {
      margin-bottom: 24px;

      label {
        display: block;
        font-size: 0.95rem;
        font-weight: 600;
        color: var(--c-primary-dark);
        margin-bottom: 8px;
      }
    }
  }
}

.input-box {
  width: 100%;
  padding: 14px 18px;
  font-size: 1rem;
  border: 2px solid rgba(34, 113, 177, 0.15);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.9);
  color: var(--c-text);
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: var(--c-primary);
    background: white;
    box-shadow: 0 4px 12px rgba(34, 113, 177, 0.1);
  }

  &::placeholder {
    color: rgba(34, 113, 177, 0.5);
  }
}

.register-button {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, var(--c-primary-dark) 0%, var(--c-primary) 100%);
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(34, 113, 177, 0.2);
  }

  .button-icon {
    transition: transform 0.3s ease;
  }

  &:hover .button-icon {
    transform: translateX(4px);
  }
}

.login-link {
  text-align: center;
  font-size: 0.95rem;
  color: var(--c-gray-600);

  .link {
    color: var(--c-primary);
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s ease;

    &:hover {
      color: var(--c-primary-dark);
      text-decoration: underline;
    }
  }
}

.auth__footer {
  text-align: center;

  .footer-links {
    display: flex;
    justify-content: center;
    gap: 24px;
    margin-bottom: 16px;
  }

  .footer-link {
    color: var(--c-gray-600);
    text-decoration: none;
    font-size: 0.9rem;
    transition: all 0.3s ease;

    &:hover {
      color: var(--c-primary);
    }
  }

  .copyright {
    font-size: 0.85rem;
    color: var(--c-gray-500);
  }
}

@media (max-width: 480px) {
  .auth {
    padding: 16px;

    &__card {
      padding: 32px 24px;
    }

    &__title {
      font-size: 2rem;
    }
  }
}
</style>