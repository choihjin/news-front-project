<script setup>
import axios from "axios"; 
import { onMounted } from 'vue';
import { Bar, Doughnut } from "vue-chartjs";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import ContentBox from "@/common/ContentBox.vue";
import { ref } from "vue";
import ArticlePreview from "@/components/ArticlePreview.vue";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const props = defineProps();

const categoryColors = {
  보안: "#FF6B6B",
  기타: "#4ECDC4",
  AI: "#FFA940",
  스타트업: "#6C5CE7",
  로봇: "#95A5FA",
  사물인터넷: "#FF8B94"
};

// 순위 태그용 부드러운 색상
const categoryLabelColors = {
  보안: "#fff0f0",
  기타: "#ebf9f7",
  AI: "#fff4e6",
  스타트업: "#f0eeff",
  로봇: "#eef1ff",
  사물인터넷: "#fff0f1"
};

const categoryData = ref({
  labels: [],
  datasets: [
    {
      data: [],
      backgroundColor: [],
      borderWidth: 0,
    },
  ],
});
const categories = ref([]);
const favoriteArticles = ref([]);

const keywordData = ref({
  labels: [],
  datasets: [
    {
      label: "키워드 빈도수",
      data: [],
      backgroundColor: "#C7E4B8",
    },
  ],
});

const readData = ref({
  labels: [],
  datasets: [
    {
      label: "키워드 빈도수",
      data: [],
      backgroundColor: "#DBB8E4",
    },
  ],
});

const options = {
  plugins: {
    legend: {
      display: true,
      position: "right",
      labels: {
        padding: 15,
        boxWidth: 20,
        font: {
          size: 14,
        },
      },
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          const label = context.label || "";
          const value = context.raw;
          return `${label}: ${value}개`;
        },
      },
    },
    layout: {
      padding: {
        right: 40,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        max: 1,
      },
    },
  },
};

const barOptions = {
  indexAxis: "y",
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      beginAtZero: true,
      grid: {
        color: '#f0f0f0'
      }
    },
    y: {
      grid: {
        display: false
      },
      ticks: {
        padding: 10,
        font: {
          size: 13
        }
      }
    }
  },
  plugins: {
    legend: {
      display: false
    }
  },
  layout: {
    padding: {
      right: 20
    }
  }
};

const readBarOptions = {
  indexAxis: "x",
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 2
      },
      grid: {
        color: '#f0f0f0'
      }
    },
    x: {
      grid: {
        display: false
      }
    }
  },
  plugins: {
    legend: {
      display: false
    }
  }
};

onMounted(async () => {
  const token = localStorage.getItem("accessToken");
  try {
    const response = await axios.get("http://localhost:8000/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = response.data;
    console.log("✅ dashboard API 응답:", data);

    // 1. 관심 카테고리
    const categoryEntries = Object.entries(data.my_favorite_category || {});
    categoryData.value.labels = categoryEntries.map(([key]) => key);
    categoryData.value.datasets[0].data = categoryEntries.map(([, value]) => value);
    
    // 각 카테고리에 대한 색상 설정
    categoryData.value.datasets[0].backgroundColor = categoryEntries.map(([key]) => categoryColors[key] || "#95a5a6");

    categories.value = categoryEntries.sort((a, b) => b[1] - a[1]);
    console.log("✅ categoryData 확인:", categoryData.value);

    // 2. 주요 키워드
    const keywordEntries = Object.entries(data.my_favorite_key_word || {});
    keywordData.value.labels = keywordEntries.map(([key]) => key);
    keywordData.value.datasets[0].data = keywordEntries.map(([, value]) => value);

    // 3. 주간 읽은 기사
    const readEntries = Object.entries(data.read_article_count || {});
    readData.value.labels = readEntries.map(([key]) => key);
    readData.value.datasets[0].data = readEntries.map(([, value]) => value);

    // 4. 좋아요 누른 기사
    favoriteArticles.value = data.favorite_articles || [];
  } catch (error) {
    console.error("❌ 대시보드 데이터 불러오기 실패:", error);
  }
});
</script>

<template>
  <div class="dashboard">
    <div class="dashboard__header">
      <h1 class="dashboard__title">
        <span class="dashboard__title-icon">📊</span>
        <span class="dashboard__title-text">MY DASHBOARD</span>
      </h1>
      <p class="dashboard__description">
        <span class="highlight">나만의 IT 관심사를 분석하고</span>, 맞춤형 기술 뉴스를 추천받으세요.<br />
        관심 분야 통계와 읽기 패턴을 통해 여러분의 성장을 돕습니다.
      </p>
    </div>
    <div class="layout">
      <ContentBox class="category">
        <h1>🐤 나의 관심 카테고리</h1>
        <p class="card_description">
          주로 읽은 기사들을 분석하여 AI, 보안, 스타트업 등 가장 관심 있는
          기술 분야를 한눈에 보여드립니다.
        </p>
        <div class="category__chart">
          <div class="doughnut-container">
            <Doughnut v-if="categoryData.datasets[0].data.length" :data="categoryData" :options="options" />
          </div>
          <div class="category__labels">
            <span
              v-for="(category, index) in categories"
              :key="index"
              :style="{
                backgroundColor: categoryLabelColors[category[0]] || '#f5f5f5',
                color: categoryColors[category[0]] || '#666',
                border: `1px solid ${categoryColors[category[0]] || '#ddd'}`
              }"
              class="category__label"
            >
              {{ index + 1 }}순위: {{ category[0] }} ({{ category[1] }}개)
            </span>
          </div>
        </div>
      </ContentBox>

      <ContentBox class="keyword">
        <h1>⭐️ 주요 키워드</h1>
        <p class="card_description">
          읽은 기사들의 핵심 키워드를 분석하여 현재 관심 있는 기술 트렌드를 보여드립니다.
        </p>
        <div class="chart-container">
          <Bar 
            v-if="keywordData.datasets[0].data.length" 
            :data="keywordData" 
            :options="barOptions" 
          />
        </div>
      </ContentBox>
    </div>
    <div class="layout">
      <ContentBox>
        <h1>📰 주간 읽은 기사</h1>
        <p class="card_description">
          최근 일주일간의 기사 조회 기록을 통해 기술 뉴스 학습 패턴을 분석합니다.
        </p>
        <div class="chart-container">
          <Bar 
            v-if="readData.datasets[0].data.length" 
            :data="readData" 
            :options="readBarOptions" 
          />
        </div>
      </ContentBox>

      <ContentBox class="like-news">
        <h1>❤️ 좋아요 누른 기사</h1>
        <p class="card_description">
          관심 있는 기술 기사들을 모아보고 나만의 학습 자료로 활용하세요.
        </p>
        <div class="articles-container">
          <div v-for="(article, index) in favoriteArticles" :key="index">
            <ArticlePreview :to="`/news/${article.id}`" :news="article" />
          </div>
        </div>
      </ContentBox>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 18px;

  &__header {
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

  &__title {
    font-size: 2.1rem;
    font-weight: 800;
    margin-bottom: 10px;
    color: #1a1a1a;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 12px;
    letter-spacing: 0.5px;

    &-icon {
      font-size: 2.3rem;
    }

    &-text {
      background: linear-gradient(90deg, #1e3c72 0%, #2a5298 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: 0.5px;
      font-family: 'Montserrat', 'Pretendard', 'Noto Sans KR', 'Inter', Arial, sans-serif;
      text-transform: uppercase;
    }
  }

  &__description {
    font-size: 1.08rem;
    font-weight: 500;
    color: #2271b1;
    line-height: 1.7;
    margin-top: 2px;

    .highlight {
      color: #005bea;
      font-weight: 700;
    }
  }
}

.layout {
  display: flex;
  gap: 20px;
  > * {
    height: 520px;
    overflow: hidden;
  }

  @media (max-width: 768px) {
    flex-direction: column;
  }
}

.card_description {
  color: #2271b1;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 15px;
}

.chart-container {
  height: calc(100% - 70px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
}

.like-news {
  overflow: hidden;
  .articles-container {
    height: calc(100% - 80px);
    overflow-y: auto;
    padding-right: 10px;
    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 3px;
    }
    &::-webkit-scrollbar-thumb {
      background: #b3c6e0;
      border-radius: 3px;
    }
  }
}

h1 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.category {
  &__chart {
    height: calc(100% - 100px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
    .doughnut-container {
      width: 100%;
      height: 300px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  &__labels {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
    padding: 0 10px;
  }
  &__label {
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 14px;
    white-space: nowrap;
    display: inline-block;
    font-weight: 500;
    transition: all 0.2s;
    border-width: 1.5px;
    letter-spacing: -0.3px;
    background: #f6f8fa;
    border: 1.2px solid #e0e7ef;
    color: #2271b1;
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(0,91,234,0.10);
    }
  }
}

.keyword, .like-news {
  h1 {
    margin-bottom: 12px;
  }
  .chart-container {
    height: calc(100% - 120px);
    padding: 10px 0;
  }
}
</style>

