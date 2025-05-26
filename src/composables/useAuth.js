// src/composables/useAuth.js
import { ref } from "vue";
import axios from "axios";

const isLoggedIn = ref(!!localStorage.getItem("accessToken"));

export function useAuth() {
  const login = (token) => {
    localStorage.setItem("accessToken", token);
    isLoggedIn.value = true;
  };

  const logout = async () => {
    try {
      const refresh_token = localStorage.getItem("refresh_token");
      await axios.post("http://localhost:8000/auth/logout/", {
        refresh: refresh_token
      });
      
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      isLoggedIn.value = false;
    } catch (error) {
      console.error("로그아웃 실패:", error);
      // 로그아웃 API 호출이 실패하더라도 로컬 스토리지는 정리
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    isLoggedIn.value = false;
    }
  };

  return {
    isLoggedIn,
    login,
    logout,
  };
}