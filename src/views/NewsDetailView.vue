<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { useSearch } from "@/composables/useSearch";

import ContentBox from "@/common/ContentBox.vue";
import StateButton from "@/common/StateButton.vue";
import { useDate } from "@/composables/useDate";
import router from "@/router";
import ArticlePreview from "@/components/ArticlePreview.vue";
import NewsAssistant from "@/components/NewsAssistant.vue";
import CommentList from "@/components/CommentList.vue";

import leftArrow from "@/components/icon/LeftArrow.svg"; 

const news = ref(null);
const relatedNews = ref([]);
const liked = ref(false);
const likeCount = ref(0);
const isAnimating = ref(false);
const isLoggedIn = ref(false);

const { formatDate } = useDate();
const route = useRoute();
const articleId = route.params.id;
const { updateSearchText } = useSearch();

const fetchNewsDetail = async (id) => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await axios.get(`http://localhost:8000/news/${id}/`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    news.value = response.data.data;
    likeCount.value = news.value.article_interaction?.likes ?? 0;
    relatedNews.value = response.data.data.related_articles?.articles || [];
    if (token) {
      try {
        const likeRes = await axios.get(`http://localhost:8000/news/like/`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { article_id: id },
        });
        liked.value = likeRes.data.is_liked;
      } catch (err) {
        liked.value = false;
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (error) {
    console.error("❌ 뉴스 상세 불러오기 실패:", error);
  }
};

onMounted(() => {
  isLoggedIn.value = !!localStorage.getItem("accessToken");
  fetchNewsDetail(articleId);
});

watch(() => route.params.id, (newId) => {
  fetchNewsDetail(newId);
});

// ❤️ 좋아요 요청 함수
const toggleLike = async () => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    alert("로그인이 필요합니다.");
    return;
  }

  try {
    if (!liked.value) {
      // ❤️ 좋아요 누르기
      await axios.post(
        "http://localhost:8000/news/like/",
        { article_id: articleId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      likeCount.value++;
      liked.value = true;
    } else {
      // 🤍 좋아요 취소하기
      await axios.delete(
        "http://localhost:8000/news/like/",
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { article_id: articleId }, // ✅ DELETE에도 body 필요
        }
      );
      likeCount.value--;
      liked.value = false;
    }

    // 애니메이션
    isAnimating.value = true;
    setTimeout(() => {
      isAnimating.value = false;
    }, 600);

  } catch (err) {
    console.error("❌ 좋아요 토글 실패:", err);
  }
};

const searchByKeyword = (keyword) => {
  updateSearchText(keyword);
  router.push({
    path: '/news',
    query: { search: keyword }
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>

<template>
  <button @click="() => router.back()" class="back-btn">
    <img :src="leftArrow" alt="뒤로가기" width="24" />
  </button>

  <div v-if="news" class="news-detail">
    <div class="article__container">
      <ContentBox>
        <div class="article">
          <div class="article__header">
            <div class="article__header-row">
              <StateButton type="state" size="md" isActive disabled
                style="background: #e0eaff; color: #084dbb; border: 1.5px solid #b3c6e0; font-weight: 700; letter-spacing: 0.5px;"
              >
                {{ news?.category }}
              </StateButton>
              <h2 class="article__header-title">{{ news?.title }}</h2>
            </div>
            <div class="article__header-writer">
              <span>{{ news.writer }}</span>
              <span> 🕒 {{ formatDate(news.write_date) }}</span>
            </div>
          </div>

          <p class="article__content">{{ news?.content }}</p>

          <div class="article__tags">
            <StateButton
              v-for="(tag, index) in news.keywords"
              :key="index"
              type="tag"
              size="md"
              @click="searchByKeyword(tag)"
              style="cursor: pointer;"
            >
              #{{ tag }}
            </StateButton>
          </div>

          <div class="article__content__footer">
            <div class="article__content__emoji">
              <span class="emoji-btn">
                <span v-if="liked">💙</span>
                <span v-else>🤍</span>
                {{ likeCount }}
              </span>
              <div class="emoji-btn">
                <span class="content__emoji-eye">👀</span>
                {{ news?.article_interaction?.read ?? 0 }}
              </div>
              <a :href="news.url">📄</a>
            </div>
            <button class="emoji-btn" @click="toggleLike">
              <span>{{ liked ? "💙" : "🤍" }} 좋아요</span>
            </button>
            <transition name="heart-float">
              <span v-if="isAnimating" class="floating-heart">
                {{ liked ? "💙" : "🤍" }}
              </span>
            </transition>
          </div>
        </div>
      </ContentBox>
    </div>

    <ContentBox class="sidebar" v-if="relatedNews.length">
      <h1 class="sidebar__title">📰 관련 기사</h1>
      <div v-for="(item, index) in relatedNews" :key="item.id">
        <ArticlePreview :to="`/news/${item.id}`" :news="item" />
      </div>
    </ContentBox>
  </div>

  <NewsAssistant :articleId="articleId" />
  
  <ContentBox class="comments-section">
    <div v-if="!isLoggedIn" class="login-required">
      <p>댓글을 보려면 로그인이 필요합니다.</p>
      <button @click="() => router.push('/login')" class="login-btn">로그인하기</button>
    </div>
    <CommentList v-else :article-id="articleId" />
  </ContentBox>
</template>

<style scoped lang="scss">
.back-btn {
  margin-bottom: 10px;
  background: #f6f8fa;
  border: 1.2px solid #c2c9d6;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0,60,120,0.04);
  padding: 6px 14px;
  color: #234e70;
  font-weight: 500;
  transition: all 0.18s cubic-bezier(0.4,0,0.2,1);
  cursor: pointer;
}
.back-btn:hover {
  background: #e8eef3;
  color: #2a5298;
}

.news-detail {
  display: flex;
  gap: 24px;

  @media (max-width: 800px) {
    flex-direction: column;
  }

  .article__container {
    flex: 2;
    display: flex;
    flex-direction: column;
    gap: 50px;
  }

  .sidebar {
    flex: 1;
    background: #f8fafc;
    border-radius: 16px;
    box-shadow: 0 2px 12px rgba(0,91,234,0.06);
    padding: 24px 18px;
    &__title {
      font-weight: 700;
      font-size: 18px;
      margin-bottom: 20px;
      color: #2271b1;
    }
  }

  .article {
    font-size: 1rem;
    padding: 32px 32px 18px 32px;
    background: #f8fafc;
    border-radius: 18px;
    box-shadow: 0 2px 12px rgba(0,91,234,0.06);

    &__header {
      color: #2271b1;
      font-size: 1.01rem;
      margin-bottom: 18px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      background: #f6f8fa;
      border-radius: 12px;
      padding: 16px 20px;
      box-shadow: 0 1px 4px rgba(0,60,120,0.04);
    }

    .article__header-row {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 18px;
      width: 100%;
    }

    &__header-title {
      margin: 0;
      font-size: 1.6rem;
      font-weight: bold;
      color: #1c1c1e;
      background: linear-gradient(90deg, #1e3c72 0%, #2a5298 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-family: 'Montserrat', 'Pretendard', 'Noto Sans KR', 'Inter', Arial, sans-serif;
      flex: 1;
    }

    &__header-writer {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 12px;
      color: #3a4a5a;
      font-size: 0.95rem;
      padding: 4px 0;
      border-top: 1px solid rgba(0,0,0,0.05);
      margin-top: 4px;
    }

    &__content {
      margin: 20px 0;
      line-height: 1.8;
      white-space: pre-wrap;
      word-break: keep-all;
      font-size: 1.1rem;
      color: #333;
      letter-spacing: -0.02em;

      &__footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 30px;
      }

      &__emoji {
        color: #2271b1;
        font-size: 16px;
        display: flex;
        gap: 30px;
        align-items: center;

        &-eye {
          font-size: 17px;
        }
      }
    }

    &__tags {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-top: 15px;
    }
  }

  .emoji-btn {
    display: flex;
    align-items: center;
    font-size: 15px;
    color: #2271b1;
    background: #f6f8fa;
    border-radius: 8px;
    padding: 4px 10px;
    transition: background 0.18s, color 0.18s;
    cursor: pointer;
    border: none;
    font-weight: 500;
  }
  .emoji-btn:hover {
    background: #e8eef3;
    color: #2a5298;
  }

  .floating-heart {
    position: absolute;
    font-size: 24px;
    color: red;
    animation: heartFloat 0.6s ease-out forwards;
  }

  @keyframes heartFloat {
    0% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
    50% {
      opacity: 0.8;
      transform: translateY(-20px) scale(1.2);
    }
    100% {
      opacity: 0;
      transform: translateY(-40px) scale(0.8);
    }
  }
}

.comments-section {
  margin-top: 2rem;
}

.login-required {
  text-align: center;
  padding: 2rem;
  background: #f8fafc;
  border-radius: 12px;
  
  p {
    color: #666;
    margin-bottom: 1rem;
    font-size: 1.1rem;
  }
  
  .login-btn {
    background: #2271b1;
    color: white;
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
    
    &:hover {
      background: #2a5298;
    }
  }
}
</style>
