<script setup>
import { ref, onMounted, watch } from "vue";
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
</script>

<template>
  <div class="news">
    <div class="news__header">
      <h1 class="news__title">
        <span class="news__title-icon">📰</span>
        <span class="news__title-text">SSAFIT NEWS</span>
      </h1>
    <p class="news__description">
        <span class="highlight">IT 트렌드를 한눈에</span>, 기술 뉴스 큐레이션 서비스<br />
        관심있는 기술 분야의 최신 소식을 확인해보세요.
    </p>
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
          <select class="filters" v-model="sortBy">
            <option value="latest">최신순</option>
            <option value="recommend">추천순</option>
          </select>
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
}

.news__header {
  text-align: left;
  margin-bottom: 24px;
  padding: 32px 32px 18px 32px;
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
  padding: 18px 32px !important;
  background: #f8fafc;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  margin-bottom: 18px;
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
  padding: 32px 32px 18px 32px !important;
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
}

.filters__container {
  position: absolute;
  right: 0;
}

.filters {
  padding: 10px 18px;
  border: 1.5px solid #e0e7ef;
  border-radius: 999px;
  background: #fff;
  color: #2a5298;
  font-size: 1rem;
  font-weight: 500;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  outline: none;
  transition: all 0.18s cubic-bezier(0.4,0,0.2,1);
  cursor: pointer;
}
.filters:focus, .filters:hover {
  border-color: #3ec6e0;
  background: #e6f0ff;
  color: #005bea;
  box-shadow: 0 4px 16px rgba(0,91,234,0.10);
}

.news__box__cards {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
}
</style>
