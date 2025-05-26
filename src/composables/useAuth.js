// src/composables/useAuth.js
import { ref } from "vue";
import axios from "axios";

const isLoggedIn = ref(!!localStorage.getItem("accessToken"));
const user = ref(null);

// 초기 사용자 정보 로드
try {
  const savedUser = localStorage.getItem("user");
  if (savedUser) {
    user.value = JSON.parse(savedUser);
  }
} catch (error) {
  console.error("사용자 정보 파싱 실패:", error);
  localStorage.removeItem("user");
}

export function useAuth() {
  const login = (token, userData) => {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("user", JSON.stringify(userData));
    isLoggedIn.value = true;
    user.value = userData;
  };

  const logout = async () => {
    try {
      const refresh_token = localStorage.getItem("refresh_token");
      await axios.post("http://localhost:8000/auth/logout/", {
        refresh: refresh_token
      });
    } catch (error) {
      console.error("로그아웃 실패:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      isLoggedIn.value = false;
      user.value = null;
    }
  };

  return {
    isLoggedIn,
    user,
    login,
    logout,
  };
}