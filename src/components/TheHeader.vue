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
        <span class="logo"> SSAFYNEWS </span>
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
  background-color: white;
  border-bottom: 1px solid #d4d4d4;
  header {
    max-width: 1280px;
    margin: 0 auto;
    color: black;
    height: 80px;
    justify-content: space-between;
    align-items: center;
    display: flex;
    padding: 0 15px;
  }

  .logo {
    font-size: x-large;
    font-weight: 800;
  }

  .menus {
    display: flex;
    align-items: center;
    gap: 23px;
    position: relative;
  }

  .header-search {
    display: flex;
    align-items: center;
    position: relative;
    margin-right: 5px;

    .header-search__input {
      padding: 8px 40px 8px 16px;
      border: 1.5px solid #e2e2e2;
      border-radius: 999px;
      font-size: 15px;
      width: 220px;
      background: #fafbfc;
      box-shadow: 0 2px 8px 0 rgba(0,0,0,0.04);
      transition: border 0.2s;
    }
    .header-search__input:focus {
      outline: none;
      border-color: #888;
      background: #fff;
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
    }
    .header-search__button svg {
      pointer-events: none;
    }

    .suggestions-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border: 1px solid #e2e2e2;
      border-radius: 8px;
      margin-top: 4px;
      max-height: 200px;
      overflow-y: auto;
      z-index: 1000;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

      .suggestion-item {
        padding: 8px 16px;
        cursor: pointer;
        transition: background-color 0.2s;

        &:hover, &.selected {
          background-color: #f5f5f5;
        }
      }
    }
  }

  a.router-link-active {
    font-weight: bold;
  }
}

@media (max-width: 700px) {
  .header__container header {
    flex-direction: column;
    height: auto;
    gap: 10px;
    .menus {
      flex-direction: column;
      gap: 10px;
    }
    .header-search {
      width: 100%;
      margin-bottom: 8px;
    }
  }
}
</style>
