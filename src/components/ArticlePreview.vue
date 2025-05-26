<script setup>
import ContentBox from "@/common/ContentBox.vue";
import StateButton from "@/common/StateButton.vue";
import { useDate } from "@/composables/useDate";
import { defineProps, computed } from "vue";
import { RouterLink } from "vue-router";

const props = defineProps({
  news: {
    type: Object,
    required: true
  },
  to: {
    type: String,
    required: false
  }
});

const { formatDate } = useDate();
const linkComponent = computed(() => (props.to ? RouterLink : "div"));
const hasInteraction = computed(() => {
  return (
    "article_interaction" in props.news && !!props.news.article_interaction
  );
});
console.log(props.news);
</script>

<template>
  <component :is="linkComponent" v-bind="props.to ? { to: props.to } : {}" class="article-preview">
    <ContentBox>
      <div class="top">
        <StateButton type="state" size="sm" isActive disabled class="category-tag">
          {{ props.news.category }}
        </StateButton>
        <h1>{{ props.news.title }}</h1>
      </div>
      <div class="bottom">
        <div class="bottom__meta">
          <span class="date-icon">📅</span>
          {{ formatDate(new Date(props.news.write_date)) }}
        </div>
        <div v-if="hasInteraction" class="bottom__icons">
          <div class="interaction-item" v-if="hasInteraction">
            <span class="icon">❤️</span>
            <span class="count">{{ props.news.article_interaction?.likes }}</span>
          </div>
          <div class="interaction-item">
            <span class="icon">👀</span>
            <span class="count">{{ props.news.article_interaction?.read }}</span>
          </div>
        </div>
      </div>
    </ContentBox>
  </component>
</template>

<style scoped lang="scss">
.article-preview {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: translateY(-2px);
  }
}

.top {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;

  .category-tag {
    background: rgba(34, 113, 177, 0.08) !important;
    color: var(--c-primary) !important;
    border: 1.5px solid rgba(34, 113, 177, 0.15) !important;
    font-weight: 700 !important;
    letter-spacing: 0.5px;
    padding: 6px 12px !important;
    border-radius: 999px !important;
    font-size: 0.9rem !important;
    box-shadow: 0 2px 4px rgba(34, 113, 177, 0.06);
  }

  h1 {
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--c-text);
    background: linear-gradient(135deg, var(--c-primary-dark) 0%, var(--c-primary) 50%, var(--c-primary-light) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-family: 'Montserrat', 'Pretendard', 'Noto Sans KR', 'Inter', Arial, sans-serif;
    margin: 0;
    line-height: 1.4;
    letter-spacing: 0.2px;
  }
}

.bottom {
  display: flex;
  align-items: center;
  gap: 16px;
  justify-content: space-between;
  padding-top: 8px;
  border-top: 1px solid rgba(34, 113, 177, 0.08);

  &__meta {
    color: var(--c-primary);
    font-size: 0.95rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 6px;

    .date-icon {
      font-size: 1.1rem;
    }
  }

  &__icons {
    display: flex;
    gap: 16px;
    color: var(--c-primary);
    font-size: 0.95rem;
    font-weight: 500;

    .interaction-item {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 4px 8px;
      border-radius: 999px;
      background: rgba(34, 113, 177, 0.06);
      transition: all 0.2s ease;

      &:hover {
        background: rgba(34, 113, 177, 0.1);
        transform: translateY(-1px);
      }

      .icon {
        font-size: 1.1rem;
      }

      .count {
        font-weight: 600;
      }
    }
  }
}
</style>
