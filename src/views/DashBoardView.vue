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
  AI: "#2563EB",          // 로얄 블루
  빅데이터: "#1D4ED8",    // 딥 블루
  블록체인: "#1E40AF",    // 미드 나이트 블루
  사물인터넷: "#0284C7",  // 블루 그린
  클라우드: "#0EA5E9",    // 스카이 블루
  로봇: "#60A5FA",        // 라이트 블루
  자율주행: "#38BDF8",    // 하늘색
  반도체: "#0F4C81",      // 네이비 (보안에서 재사용)
  스타트업: "#3B82F6",    // 밝은 블루
  핀테크: "#2563EB",      // 로얄 블루
  보안: "#1E3A8A",        // 다크 네이비
  메타버스: "#6366F1",    // 퍼플블루
  양자컴퓨팅: "#4F46E5",  // 딥 퍼플블루
  "AR/VR": "#7C3AED",     // 라일락 퍼플
  기타: "#64748B"         // 블루그레이
};

// 순위 태그용 부드러운 색상
const categoryLabelColors = {
  AI: "#EFF6FF",
  빅데이터: "#DBEAFE",
  블록체인: "#E0E7FF",
  사물인터넷: "#F0F9FF",
  클라우드: "#E0F2FE",
  로봇: "#E2F2FD",
  자율주행: "#E0F7FF",
  반도체: "#E8F1F8",
  스타트업: "#DBEAFE",
  핀테크: "#EFF6FF",
  보안: "#E6EDF7",
  메타버스: "#EDE9FE",
  양자컴퓨팅: "#E0E7FF",
  "AR/VR": "#F3E8FF",
  기타: "#F1F5F9"
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
      backgroundColor: [
        "#2563EB", // 로얄 블루
        "#1D4ED8", // 딥 블루
        "#1E40AF", // 미드 나이트 블루
        "#0284C7", // 블루 그린
        "#0EA5E9", // 스카이 블루
        "#60A5FA", // 라이트 블루
        "#38BDF8", // 하늘색
        "#0F4C81", // 네이비
        "#3B82F6", // 밝은 블루
        "#2563EB", // 로얄 블루
      ],
      borderWidth: 0,
      borderRadius: 4,
    },
  ],
});

const readData = ref({
  labels: [],
  datasets: [
    {
      label: "주간 읽은 기사",
      data: [],
      backgroundColor: [
        "#6366F1", // 퍼플블루
        "#4F46E5", // 딥 퍼플블루
        "#7C3AED", // 라일락 퍼플
        "#6D28D9", // 딥 퍼플
        "#5B21B6", // 다크 퍼플
        "#4C1D95", // 다크 네이비 퍼플
        "#3730A3", // 인디고
        "#312E81", // 다크 인디고
      ],
      borderWidth: 0,
      borderRadius: 4,
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
    console.log("Dashboard API 응답:", data);

    // 1. 관심 카테고리
    const categoryEntries = Object.entries(data.my_favorite_category || {});
    categoryData.value.labels = categoryEntries.map(([key]) => key);
    categoryData.value.datasets[0].data = categoryEntries.map(([, value]) => value);
    
    // 각 카테고리에 대한 색상 설정
    categoryData.value.datasets[0].backgroundColor = categoryEntries.map(([key]) => categoryColors[key] || "#95a5a6");

    // 상위 3개 카테고리만 표시
    categories.value = categoryEntries
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);
    
    console.log("CategoryData 확인:", categoryData.value);

    // 2. 주요 키워드
    const keywordEntries = Object.entries(data.my_favorite_key_word || {});
    keywordData.value.labels = keywordEntries.map(([key]) => key);
    keywordData.value.datasets[0].data = keywordEntries.map(([, value]) => value);
    // 키워드 데이터가 10개 이상인 경우를 대비해 색상 배열 조정
    keywordData.value.datasets[0].backgroundColor = keywordEntries.map((_, index) => 
      keywordData.value.datasets[0].backgroundColor[index % keywordData.value.datasets[0].backgroundColor.length]
    );

    // 3. 주간 읽은 기사
    const readEntries = Object.entries(data.read_article_count || {});
    readData.value.labels = readEntries.map(([key]) => key);
    readData.value.datasets[0].data = readEntries.map(([, value]) => value);
    // 주간 데이터가 8개 이상인 경우를 대비해 색상 배열 조정
    readData.value.datasets[0].backgroundColor = readEntries.map((_, index) => 
      readData.value.datasets[0].backgroundColor[index % readData.value.datasets[0].backgroundColor.length]
    );

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
      <div class="header__container">
        <header>
          <div class="logo-container">
            <span class="logo-icon">📊</span>
            <div class="logo-text">
              <h1 class="logo-title">MY DASHBOARD</h1>
              <p class="logo-subtitle">나만의 IT 관심사를 분석하고 맞춤형 기술 뉴스를 추천받으세요.</p>
            </div>
          </div>
        </header>
      </div>
    </div>
    <div class="layout">
      <ContentBox class="category">
        <div class="card-header">
          <h1>🐤 나의 관심 카테고리</h1>
          <p class="card_description">
            주로 읽은 기사들을 분석하여 AI, 보안, 스타트업 등 가장 관심 있는
            기술 분야를 한눈에 보여드립니다.
          </p>
        </div>
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
        <div class="card-header">
          <h1>⭐️ 주요 키워드</h1>
          <p class="card_description">
            읽은 기사들의 핵심 키워드를 분석하여 현재 관심 있는 기술 트렌드를 보여드립니다.
          </p>
        </div>
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
        <div class="card-header">
          <h1>📰 주간 읽은 기사</h1>
          <p class="card_description">
            최근 일주일간의 기사 조회 기록을 통해 기술 뉴스 학습 패턴을 분석합니다.
          </p>
        </div>
        <div class="chart-container">
          <Bar 
            v-if="readData.datasets[0].data.length" 
            :data="readData" 
            :options="readBarOptions" 
          />
        </div>
      </ContentBox>

      <ContentBox class="like-news">
        <div class="card-header">
          <h1>❤️ 좋아요 누른 기사</h1>
          <p class="card_description">
            관심 있는 기술 기사들을 모아보고 나만의 학습 자료로 활용하세요.
          </p>
        </div>
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
  gap: 24px;
  padding: 0 32px 24px 32px;
  max-width: 1400px;
  margin: 0 auto;
  background: #f8fafc;

  &__header {
    text-align: left;
    margin-bottom: 32px;
    padding: 0;
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    border-radius: 24px;
    box-shadow: 0 4px 20px rgba(0,91,234,0.08);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 24px rgba(0,91,234,0.12);
    }
  }
}

.header__container {
  display: flex;
  align-items: center;
  gap: 20px;
  text-decoration: none;
  padding: 24px 40px;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 20px;
  
  &:hover {
    transform: scale(1.02);
  }
}

.logo-icon {
  font-size: 2.8rem;
  background: linear-gradient(135deg, #2271b1 0%, #4a90e2 50%, #6ba4e7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 4px 6px rgba(34, 113, 177, 0.2));
}

.logo-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.logo-title {
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #2271b1 0%, #4a90e2 50%, #6ba4e7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: 'Montserrat', 'Pretendard', 'Noto Sans KR', 'Inter', Arial, sans-serif;
  text-transform: uppercase;
  margin: 0;
  letter-spacing: 1px;
}

.logo-subtitle {
  font-size: 1rem;
  color: #4a5568;
  font-weight: 500;
  margin: 0;
  line-height: 1.5;
}

.layout {
  display: flex;
  gap: 24px;
  > * {
    height: 620px;
    overflow: hidden;
    background: #ffffff;
    border-radius: 24px;
    box-shadow: 0 4px 20px rgba(0,91,234,0.06);
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 24px rgba(0,91,234,0.1);
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
  }
}

.card-header {
  margin-bottom: 24px;
  padding: 24px 24px 0 24px;
}

.card_description {
  color: #4a5568;
  font-size: 1rem;
  line-height: 1.6;
  margin-top: 12px;
}

.chart-container {
  height: calc(100% - 120px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  margin: 0 20px;
  box-shadow: inset 0 2px 8px rgba(37, 99, 235, 0.08);
}

.like-news {
  .articles-container {
    height: calc(100% - 80px);
    overflow-y: auto;
    padding: 20px;
    &::-webkit-scrollbar {
      width: 8px;
    }
    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 4px;
    }
    &::-webkit-scrollbar-thumb {
      background: #cbd5e0;
      border-radius: 4px;
      &:hover {
        background: #a0aec0;
      }
    }
  }
}

h1 {
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #2d3748;
  letter-spacing: -0.5px;
}

.category {
  &__chart {
    height: calc(100% - 120px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    
    .doughnut-container {
      width: 100%;
      height: 320px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  
  &__labels {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    justify-content: center;
    padding: 0 16px;
    margin-top: 20px;
    max-height: 80px;
  }
  
  &__label {
    padding: 10px 20px;
    border-radius: 20px;
    font-size: 1rem;
    white-space: nowrap;
    display: inline-block;
    font-weight: 600;
    transition: all 0.3s ease;
    letter-spacing: -0.3px;
    background: #F8FAFC;
    border: 1.5px solid #E2E8F0;
    color: #1E3A8A;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.12);
      border-color: #2563EB;
      background: #EFF6FF;
    }
  }
}

.keyword, .like-news {
  h1 {
    margin-bottom: 12px;
  }
  
  .chart-container {
    height: calc(100% - 160px);
    padding: 24px;
  }
}

@media (max-width: 700px) {
  .dashboard {
    padding: 0 16px 16px 16px;
  }

  .header__container {
    padding: 16px;
  }

  .logo-container {
    flex-direction: column;
    text-align: center;
    gap: 8px;
  }

  .logo-text {
    align-items: center;
  }

  .logo-title {
    font-size: 1.8rem;
  }

  .logo-subtitle {
    font-size: 0.9rem;
    text-align: center;
  }

  .card-header {
    padding: 24px 24px 0 24px;
  }

  .chart-container {
    margin: 0 16px;
    padding: 16px;
  }
}
</style>

