<script setup>
import { RouterLink, useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import { ref, watch, onMounted, onUnmounted, computed } from "vue";
import axios from "axios";
import { useSearch } from "@/composables/useSearch";

const router = useRouter();
const { isLoggedIn, logout, user } = useAuth();
const { headerSearchText, updateSearchText } = useSearch();

const refreshPage = (event) => {
  event.preventDefault();
  router.push("/").then(() => {
    window.location.reload();
  });
};

const suggestions = ref([]);
const showSuggestions = ref(false);
const selectedIndex = ref(-1);

const fetchSuggestions = async (query) => {
  if (!query.trim()) {
    suggestions.value = [];
    return;
  }
  
  try {
    const response = await axios.get(`http://localhost:8000/news/suggestions/`, {
      params: { q: query }
    });
    suggestions.value = response.data.suggestions || [];
  } catch (error) {
    console.error("검색어 추천 불러오기 실패:", error);
    suggestions.value = [];
  }
};

watch(headerSearchText, (newValue) => {
  if (newValue.trim()) {
    fetchSuggestions(newValue);
    showSuggestions.value = true;
  } else {
    suggestions.value = [];
    showSuggestions.value = false;
  }
});

const goSearch = () => {
  if (headerSearchText.value.trim()) {
    router.push({ path: "/news", query: { search: headerSearchText.value } });
    showSuggestions.value = false;
  }
};

const selectSuggestion = (suggestion) => {
  updateSearchText(suggestion);
  goSearch();
};

const handleKeyDown = (e) => {
  if (!showSuggestions.value) return;

  switch (e.key) {
    case "ArrowDown":
      e.preventDefault();
      selectedIndex.value = Math.min(selectedIndex.value + 1, suggestions.value.length - 1);
      break;
    case "ArrowUp":
      e.preventDefault();
      selectedIndex.value = Math.max(selectedIndex.value - 1, -1);
      break;
    case "Enter":
      e.preventDefault();
      if (selectedIndex.value >= 0) {
        selectSuggestion(suggestions.value[selectedIndex.value]);
      } else {
        goSearch();
      }
      break;
    case "Escape":
      showSuggestions.value = false;
      selectedIndex.value = -1;
      break;
  }
};

// 프로필 메뉴 관련 상태
const isProfileMenuOpen = ref(false);
const userInitials = computed(() => {
  if (!user.value?.email) return '?';
  return user.value.email.charAt(0).toUpperCase();
});

// 프로필 메뉴 토글
const toggleProfileMenu = () => {
  isProfileMenuOpen.value = !isProfileMenuOpen.value;
};

// 대시보드로 이동
const goToDashboard = () => {
  isProfileMenuOpen.value = false;
  router.push('/dashboard');
};

const handleLogout = async () => {
  await logout();
  isProfileMenuOpen.value = false;
  router.push('/');
};

// 외부 클릭 감지 핸들러
const handleClickOutside = (e) => {
  const searchContainer = document.querySelector('.header-search');
  const profileMenu = document.querySelector('.profile-menu');
  
  // 검색 드롭다운 처리
  if (searchContainer && !searchContainer.contains(e.target)) {
    showSuggestions.value = false;
  }
  
  // 프로필 메뉴 처리
  if (profileMenu && !profileMenu.contains(e.target)) {
    isProfileMenuOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div class="header__container">
    <header>
      <router-link to="/news">
        <span class="logo"> SSAFIT NEWS </span>
      </router-link>

      <nav class="menus">
        <div class="header-search">
          <input
            v-model="headerSearchText"
            @keyup.enter="goSearch"
            @keydown="handleKeyDown"
            type="text"
            placeholder="검색어를 입력하세요"
            class="header-search__input"
          />
          <button @click="goSearch" class="header-search__button">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7" stroke="#888" stroke-width="2"/>
              <path d="M20 20L16.65 16.65" stroke="#888" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
          
          <!-- 자동완성 드롭다운 -->
          <div v-if="showSuggestions && suggestions.length > 0" class="suggestions-dropdown">
            <div
              v-for="(suggestion, index) in suggestions"
              :key="index"
              :class="['suggestion-item', { 'selected': index === selectedIndex }]"
              @click="selectSuggestion(suggestion)"
              @mouseover="selectedIndex = index"
            >
              {{ suggestion }}
            </div>
          </div>
        </div>
        
        <!-- 로그인 상태에 따른 프로필/로그인 버튼 -->
        <template v-if="isLoggedIn">
          <div class="profile-menu" @click="toggleProfileMenu">
            <div class="profile-avatar">
              {{ userInitials }}
            </div>
            
            <div v-if="isProfileMenuOpen" class="profile-dropdown">
              <div class="dropdown-header">
                <div class="dropdown-avatar">
                  {{ userInitials }}
                </div>
                <div class="dropdown-user-info">
                  <span class="dropdown-username">{{ user?.username }}</span>
                  <span class="dropdown-email">{{ user?.email }}</span>
                </div>
              </div>
              <div class="dropdown-divider"></div>
              <div class="dropdown-item" @click="goToDashboard">
                <span class="icon">📊</span>
                대시보드
              </div>
              <div class="dropdown-divider"></div>
              <div class="dropdown-item logout" @click="handleLogout">
                <span class="icon">🚪</span>
                로그아웃
              </div>
            </div>
          </div>
        </template>
        <router-link v-else to="/login" class="login-button">
          <span class="login-icon">👤</span>
          <span class="login-text">로그인</span>
        </router-link>
      </nav>
    </header>
  </div>
</template>

<style scoped lang="scss">
.header__container {
  background: rgba(255, 255, 255, 0.95);
  border-bottom: 1px solid rgba(34, 113, 177, 0.1);
  box-shadow: 0 4px 20px rgba(34, 113, 177, 0.06);
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 1000;
  
  header {
    max-width: 1280px;
    margin: 0 auto;
    color: var(--c-primary);
    height: 80px;
    justify-content: space-between;
    align-items: center;
    display: flex;
    padding: 0 32px;
  }

  .logo {
    font-size: 2.2rem;
    font-weight: 800;
    color: var(--c-primary);
    letter-spacing: 1px;
    background: linear-gradient(135deg, var(--c-primary-dark) 0%, var(--c-primary) 50%, var(--c-primary-light) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-family: 'Montserrat', 'Pretendard', 'Noto Sans KR', 'Inter', Arial, sans-serif;
    text-transform: uppercase;
    position: relative;
    padding: 6px 0;
    transition: transform 0.3s ease;
    
    &:hover {
      transform: scale(1.02);
    }
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 3px;
      background: linear-gradient(90deg, var(--c-primary-dark) 0%, var(--c-primary) 100%);
      border-radius: 3px;
      transform: scaleX(0);
      transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    &:hover::after {
      transform: scaleX(1);
    }
  }

  .menus {
    display: flex;
    align-items: center;
    gap: 20px;

    a {
      color: var(--c-primary);
      text-decoration: none;
      font-weight: 600;
      font-size: 1.1rem;
      padding: 8px 16px;
      border-radius: 12px;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(34, 113, 177, 0.08);
        transform: translateY(-2px);
      }

      &.router-link-active {
        background: linear-gradient(135deg, var(--c-primary-dark) 0%, var(--c-primary) 100%);
        color: white;
        box-shadow: 0 4px 12px rgba(34, 113, 177, 0.2);
      }
    }
  }

  .header-search {
    position: relative;
    width: 400px;

    &__input {
      width: 100%;
      padding: 12px 48px 12px 20px;
      border: 2px solid rgba(34, 113, 177, 0.15);
      border-radius: 16px;
      font-size: 1rem;
      color: var(--c-primary);
      background: rgba(255, 255, 255, 0.9);
      transition: all 0.3s ease;

      &:focus {
        outline: none;
        border-color: var(--c-primary);
        box-shadow: 0 4px 12px rgba(34, 113, 177, 0.1);
        background: white;
      }

      &::placeholder {
        color: rgba(34, 113, 177, 0.5);
      }
    }

    &__button {
      position: absolute;
      right: 16px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      transition: transform 0.3s ease;

      &:hover {
        transform: translateY(-50%) scale(1.1);
      }

      svg {
        transition: stroke 0.3s ease;
      }

      &:hover svg {
        stroke: var(--c-primary);
      }
    }
  }

  .suggestions-dropdown {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    right: 0;
    background: white;
    border-radius: 16px;
    box-shadow: 0 8px 24px rgba(34, 113, 177, 0.12);
    overflow: hidden;
    z-index: 1000;
    animation: slideDown 0.3s ease;

    .suggestion-item {
      padding: 12px 20px;
      cursor: pointer;
      transition: all 0.2s ease;
      color: var(--c-primary);
      font-weight: 500;

      &:hover, &.selected {
        background: rgba(34, 113, 177, 0.08);
        color: var(--c-primary-dark);
      }
    }
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 700px) {
  .header__container header {
    flex-direction: column;
    height: auto;
    padding: 16px;
    gap: 12px;

    .menus {
      flex-direction: column;
      width: 100%;
      gap: 12px;
    }

    .header-search {
      width: 100%;
      margin-bottom: 8px;

      .header-search__input {
        width: 100%;
      }
    }
  }
}

.profile-menu {
  position: relative;
  cursor: pointer;
}

.profile-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--c-primary-dark) 0%, var(--c-primary) 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.2rem;
  box-shadow: 0 2px 8px rgba(34, 113, 177, 0.2);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(34, 113, 177, 0.3);
  }
}

.profile-dropdown {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  width: 240px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(34, 113, 177, 0.15);
  padding: 12px;
  z-index: 1000;
  animation: slideDown 0.3s ease;
}

.dropdown-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  margin-bottom: 8px;
}

.dropdown-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--c-primary-dark) 0%, var(--c-primary) 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.2rem;
  box-shadow: 0 2px 8px rgba(34, 113, 177, 0.2);
}

.dropdown-user-info {
  display: flex;
  flex-direction: column;
}

.dropdown-username {
  font-weight: 600;
  color: var(--c-text);
  font-size: 1rem;
}

.dropdown-email {
  color: var(--c-gray-600);
  font-size: 0.85rem;
}

.dropdown-divider {
  height: 1px;
  background: rgba(34, 113, 177, 0.1);
  margin: 8px 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  color: var(--c-text);
  font-size: 0.95rem;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background: rgba(34, 113, 177, 0.08);
    color: var(--c-primary);
    transform: translateX(4px);
  }

  .icon {
    font-size: 1.2rem;
  }

  &.logout {
    color: #dc3545;
    
    &:hover {
      background: rgba(220, 53, 69, 0.08);
      color: #dc3545;
    }
  }
}

.login-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--c-primary-dark) 0%, var(--c-primary) 100%);
  color: white !important;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  text-decoration: none;
  box-shadow: 0 2px 8px rgba(34, 113, 177, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(34, 113, 177, 0.3);
    background: linear-gradient(135deg, var(--c-primary) 0%, var(--c-primary-dark) 100%);
    color: white !important;
  }

  .login-icon {
    font-size: 1.1rem;
    color: white;
  }

  .login-text {
    font-family: 'Pretendard', 'Noto Sans KR', sans-serif;
    letter-spacing: 0.5px;
    color: white;
  }
}
</style>