<script setup>
import { ref, onMounted, watch, computed } from "vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";

// 컴포넌트 import
import ContentBox from "@/common/ContentBox.vue";
import NewsCard from "@/components/NewsCard.vue";
import PaginationButton from "@/common/PaginationButton.vue";
import StateButton from "@/common/StateButton.vue";

// 탭 목록
import { tabs } from "@/assets/data/tabs";

const route = useRoute();
const router = useRouter();

const newsList = ref([]);
const sortBy = ref("latest");
const activeTab = ref(tabs[0].value);
const currentPage = ref(1);
const totalPages = ref(1);
const searchQuery = ref("");

const isLoggedIn = computed(() => {
  return !!localStorage.getItem('accessToken');
});

// API 호출
const fetchNews = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    let url, params;

    if (searchQuery.value.trim()) {
      // 검색어가 있을 때: 검색 API
      url = "http://localhost:8000/news/search/";
      params = {
        q: searchQuery.value,
        category: activeTab.value,
        sort_by: sortBy.value,
        page: currentPage.value,
      };
    } else {
      // 검색어가 없을 때: 전체 뉴스 목록 API
      url = "http://localhost:8000/news-list";
      params = {
        category: activeTab.value,
        sort_by: sortBy.value,
        page: currentPage.value,
      };
    }

    const res = await axios.get(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      params,
    });

    console.log("✅ 응답 결과:", res.data.data);
    newsList.value = res.data.data;
    totalPages.value = res.data.pagination?.total_pages || 1;
    currentPage.value = res.data.pagination?.current_page || 1;

  } catch (err) {
    console.error("❌ 뉴스 목록 불러오기 실패:", err);
  }
};

onMounted(() => {
  if (route.query.search) {
    searchQuery.value = route.query.search;
  }
  fetchNews();
});

watch([sortBy, currentPage, activeTab, searchQuery], fetchNews);

watch(
  () => route.query.search,
  (newSearch) => {
    searchQuery.value = newSearch || "";
  }
);

watch(currentPage, () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

watch(isLoggedIn, (newValue) => {
  if (!newValue && sortBy.value === 'recommend') {
    sortBy.value = 'latest';
  }
});
</script>

<template>
  <div class="news">
    <div class="news__header">
      <div class="header__container">
        <header>
          <router-link to="/news">
            <div class="logo-container">
              <span class="logo-icon">📰</span>
              <div class="logo-text">
                <h1 class="logo-title">SSAFIT NEWS</h1>
                <p class="logo-subtitle">IT 트렌드를 한눈에, 기술 뉴스 큐레이션 서비스</p>
              </div>
            </div>
          </router-link>
        </header>
      </div>
    </div>

    <ContentBox class="news__tabs">
      <StateButton
        v-for="tab in tabs"
        :key="tab.id"
        type="state"
        :isActive="activeTab === tab.value"
        @click="activeTab = tab.value"
      >
        {{ tab.label }}
      </StateButton>
    </ContentBox>

    <ContentBox class="news__box">
      <div class="news__box__title-container">
        <div class="filters__container">
          <button 
            class="filter-btn" 
            :class="{ active: sortBy === 'latest' }"
            @click="sortBy = 'latest'"
          >
            <span class="icon">📅</span>
            <span class="text">최신순</span>
          </button>
          <button 
            v-if="isLoggedIn"
            class="filter-btn" 
            :class="{ active: sortBy === 'recommend' }"
            @click="sortBy = 'recommend'"
          >
            <span class="icon">👍</span>
            <span class="text">추천순</span>
          </button>
        </div>
      </div>

      <!-- ✅ 뉴스 목록 렌더링 영역 -->
      <div class="news__box__cards">
        <NewsCard
          v-for="news in newsList"
          :key="news.id"
          :data="news"
        />
      </div>

      <!-- ✅ 페이지네이션 -->
      <PaginationButton 
        v-model="currentPage" 
        :totalPages="totalPages" 
      />
    </ContentBox>
  </div>
</template>

<style scoped>
.news {
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

.news__header {
  text-align: left;
  margin-bottom: 24px;
  padding: 24px;
  background: #f8fafc;
  border-radius: 18px;
  box-shadow: 0 2px 12px rgba(0,91,234,0.06);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}

.news__title {
  font-size: 2.1rem;
  font-weight: 800;
  margin-bottom: 10px;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  letter-spacing: 0.5px;
}

.news__title-icon {
  font-size: 2.3rem;
}

.news__title-text {
  background: linear-gradient(90deg, #1e3c72 0%, #2a5298 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 0.5px;
}

.news__description {
  font-size: 1.08rem;
  font-weight: 500;
  color: #2271b1;
  line-height: 1.7;
  margin-top: 2px;
}

.highlight {
  color: #005bea;
  font-weight: 700;
}

.news__tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 20px !important;
  background: #f8fafc;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  margin-bottom: 24px;
  justify-content: flex-start;
}

::v-deep(.toggle-button) {
  transition: all 0.18s cubic-bezier(0.4,0,0.2,1);
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  border: 1.5px solid #e0e7ef;
  background: #fff;
  color: #222;
  font-weight: 500;
  letter-spacing: 0.2px;
}

::v-deep(.toggle-button:hover) {
  background: #e6f0ff;
  color: #0056b3;
  transform: translateY(-2px) scale(1.04);
  box-shadow: 0 4px 16px rgba(0,0,0,0.10);
}

::v-deep(.toggle-button.active) {
  background: linear-gradient(90deg, #1e3c72 0%, #2a5298 100%);
  /* background: linear-gradient(90deg, #000428 0%, #004e92 100%); */
  /* background: linear-gradient(90deg, #396afc 0%, #2948ff 100%); */
  color: #fff;
  border: none;
  box-shadow: 0 4px 16px rgba(0, 91, 234, 0.15);
  transform: scale(1.08);
  z-index: 1;
}

.news__box {
  padding: 24px !important;
  background: #f8fafc;
  border-radius: 18px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  margin-bottom: 18px;
  border: none;
}

.news__box__title-container {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 18px;
  padding: 12px 0 8px 0;
  border-bottom: none;
}

.filters__container {
  position: absolute;
  right: 0;
  display: flex;
  gap: 8px;
  background: #fff;
  padding: 6px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  border: 1.5px solid #e0e7ef;
  transition: all 0.3s ease;
  margin-top: 0;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #64748b;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-btn .icon {
  font-size: 1rem;
  transition: transform 0.2s ease;
}

.filter-btn:hover {
  color: #005bea;
  background: #f1f5f9;
}

.filter-btn:hover .icon {
  transform: scale(1.1);
}

.filter-btn.active {
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  color: #fff;
  box-shadow: 0 4px 12px rgba(42, 82, 152, 0.2);
}

.filter-btn.active .icon {
  transform: scale(1.1);
}

.filter-btn.active .text {
  font-weight: 700;
}

.news__box__cards {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
}

.header__container {
  display: flex;
  align-items: center;
  gap: 16px;
  text-decoration: none;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.02);
  }
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 16px;
  text-decoration: none;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.02);
  }
}

.logo-icon {
  font-size: 2.4rem;
  background: linear-gradient(135deg, var(--c-primary-dark) 0%, var(--c-primary) 50%, var(--c-primary-light) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 2px 4px rgba(34, 113, 177, 0.2));
}

.logo-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.logo-title {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--c-primary);
  letter-spacing: 2px;
  background: linear-gradient(135deg, var(--c-primary-dark) 0%, var(--c-primary) 50%, var(--c-primary-light) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: 'Montserrat', 'Pretendard', 'Noto Sans KR', 'Inter', Arial, sans-serif;
  text-transform: uppercase;
  margin: 0;
}

.logo-subtitle {
  font-size: 0.9rem;
  color: var(--c-gray-600);
  font-weight: 500;
  margin: 0;
  line-height: 1.4;
}

@media (max-width: 1200px) {
  .header__container header {
    flex-direction: column;
    height: auto;
    padding: 16px;
    gap: 12px;

    .logo-container {
      flex-direction: column;
      text-align: center;
      gap: 8px;
    }

    .logo-text {
      align-items: center;
    }

    .logo-title {
      font-size: 1.6rem;
    }

    .logo-subtitle {
      font-size: 0.85rem;
    }
  }
}

@media screen and (max-width: 768px) {
  .news {
    padding: 0 12px;
  }
  
  .news__header,
  .news__tabs,
  .news__box {
    padding: 16px !important;
  }
}
</style>
