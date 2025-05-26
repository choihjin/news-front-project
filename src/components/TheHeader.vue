<script setup>
import { RouterLink, useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import { ref, watch, onMounted, onUnmounted } from "vue";
import axios from "axios";
import { useSearch } from "@/composables/useSearch";

const router = useRouter();
const { isLoggedIn, logout } = useAuth();
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

const handleClickOutside = (e) => {
  const searchContainer = document.querySelector('.header-search');
  if (searchContainer && !searchContainer.contains(e.target)) {
    showSuggestions.value = false;
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
      <router-link to="/" @click="refreshPage">
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
        <router-link to="/news">News</router-link>
        <router-link to="/dashboard">Dashboard</router-link>
        <router-link v-if="!isLoggedIn" to="/login">Login</router-link>
        <a v-else href="#" @click.prevent="logout">Logout</a>
      </nav>
    </header>
  </div>
</template>

<style scoped lang="scss">
.header__container {
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0,60,120,0.08);
  
  header {
    max-width: 1280px;
    margin: 0 auto;
    color: #234e70;
    height: 70px;
    justify-content: space-between;
    align-items: center;
    display: flex;
    padding: 0 24px;
  }

  .logo {
    font-size: 1.5rem;
    font-weight: 800;
    color: #234e70;
    letter-spacing: 1.5px;
    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #1e3c72 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-family: 'Montserrat', 'Pretendard', 'Noto Sans KR', 'Inter', Arial, sans-serif;
    text-transform: uppercase;
    position: relative;
    padding: 4px 0;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg, #1e3c72 0%, #2a5298 100%);
      border-radius: 2px;
      transform: scaleX(0);
      transition: transform 0.3s ease;
    }
    
    &:hover::after {
      transform: scaleX(1);
    }
  }

  .menus {
    display: flex;
    align-items: center;
    gap: 20px;
    position: relative;
  }

  .header-search {
    display: flex;
    align-items: center;
    position: relative;
    margin-right: 8px;

    .header-search__input {
      padding: 8px 40px 8px 16px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 0.95rem;
      width: 240px;
      background: #f8fafc;
      color: #234e70;
      box-shadow: 0 1px 2px rgba(0,60,120,0.04);
      transition: all 0.2s ease;
      font-weight: 500;

      &:focus {
        outline: none;
        border-color: #2a5298;
        background: #fff;
        box-shadow: 0 2px 4px rgba(42,82,152,0.1);
      }
    }

    .header-search__button {
      position: absolute;
      right: 8px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      display: flex;
      align-items: center;
      height: 100%;
      opacity: 0.7;
      transition: opacity 0.2s;

      &:hover {
        opacity: 1;
      }
    }

    .suggestions-dropdown {
      position: absolute;
      top: calc(100% + 4px);
      left: 0;
      right: 0;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      max-height: 240px;
      overflow-y: auto;
      z-index: 1000;
      box-shadow: 0 4px 12px rgba(0,60,120,0.08);

      .suggestion-item {
        padding: 10px 16px;
        cursor: pointer;
        transition: all 0.2s ease;
        color: #234e70;
        font-weight: 500;
        font-size: 0.95rem;

        &:hover, &.selected {
          background: #f1f5f9;
          color: #2a5298;
        }
      }
    }
  }

  .menus a {
    color: #234e70;
    font-weight: 500;
    font-size: 0.95rem;
    border-radius: 6px;
    padding: 6px 12px;
    transition: all 0.2s ease;
    text-decoration: none;

    &:hover {
      background: #f1f5f9;
      color: #2a5298;
    }

    &.router-link-active {
      background: #f1f5f9;
      color: #2a5298;
      font-weight: 600;
    }
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
</style>