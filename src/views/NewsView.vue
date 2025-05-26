<script setup>
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";

// ✅ 컴포넌트 import
import ContentBox from "@/common/ContentBox.vue";
import NewsCard from "@/components/NewsCard.vue";
import PaginationButton from "@/common/PaginationButton.vue";
import StateButton from "@/common/StateButton.vue";

// ✅ 탭 목록
import { tabs } from "@/assets/data/tabs";

const route = useRoute();
const router = useRouter();

const newsList = ref([]);
const sortBy = ref("latest");
const activeTab = ref(tabs[0].value);
const currentPage = ref(1);
const totalPages = ref(1);
const searchQuery = ref("");

// ✅ API 호출
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
        :is-active="activeTab === tab.value"
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
  margin-bottom: 20px;
  padding: 0 20px;
}

.news__title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
}

.news__title-icon {
  font-size: 32px;
}

.news__title-text {
  background: linear-gradient(120deg, #2c2c2c 0%, #1a1a1a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 0.5px;
}

.news__description {
  font-size: 16px;
  font-weight: 400;
  color: #666;
  line-height: 1.6;
}

.highlight {
  color: #1a1a1a;
  font-weight: 600;
}

.news__tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 12px 30px !important;
}

.news__box {
  padding: 30px !important;
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

.news__box__cards {
  margin-top: 30px;
}
</style>
