<script setup>
import StateButton from "@/common/StateButton.vue";
import { useDate } from "@/composables/useDate";
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useSearch } from "@/composables/useSearch";

const router = useRouter();
const { updateSearchText } = useSearch();

const props = defineProps({
  data: {
    type: Object,
    required: true,
  }
});

const { formatDate } = useDate();
const date = computed(() =>
  props.data?.write_date ? formatDate(props.data.write_date) : "-"
);

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
  <div class="card" v-if="props.data">
    <div class="card__header">
      <StateButton type="state" size="md" disabled>{{
        props.data.category
      }}</StateButton>
      <span class="card__header-item">{{ props.data.writer }}</span>
      <span class="card__header-item">· {{ date }}</span>
    </div>
    <RouterLink :to="{ name: 'newsDetail', params: { id: props.data.id } }">
      <h2 class="title">{{ props.data.title }}</h2>
      <p class="description">{{ props.data.content }}</p>
    </RouterLink>
    <div class="stats">
      <span>💙 {{ props.data.article_interaction?.likes ?? 0 }}</span>
      <span>👀 {{ props.data.article_interaction?.read ?? 0 }}</span>
      <a :href="props.data.url">📄</a>
    </div>

    <div class="tags">
      <StateButton
        v-for="(tag, index) in props.data.keywords"
        :key="index"
        type="tag"
        size="md"
        @click="searchByKeyword(tag)"
        style="cursor: pointer;"
      >
        #{{ tag }}
      </StateButton>
    </div>
  </div>
</template>

<style scoped lang="scss">
.card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(34, 113, 177, 0.08);
  width: 100%;
  max-width: 1200px;
  min-width: 280px;
  padding: 24px;
  margin-bottom: 20px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(34, 113, 177, 0.12);
  position: relative;
  margin-left: auto;
  margin-right: auto;
  backdrop-filter: blur(10px);

  &:hover {
    box-shadow: 0 12px 40px rgba(34, 113, 177, 0.15);
    transform: translateY(-4px);
    border-color: var(--c-primary);
  }

  &__header {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 1rem;
    color: var(--c-gray-500);
    margin-bottom: 10px;
  }

  .title {
    margin: 14px 0 10px 0;
    font-size: 24px;
    font-weight: 800;
    background: linear-gradient(135deg, var(--c-primary-dark) 0%, var(--c-primary) 50%, var(--c-primary-light) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: 0.3px;
    line-height: 1.4;
  }

  .description {
    font-size: 1rem;
    width: 95%;
    color: var(--c-text);
    margin: 12px 0 20px 0;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.6;
  }

  .stats {
    display: flex;
    gap: 20px;
    font-size: 1rem;
    color: var(--c-primary);
    margin-bottom: 20px;
    align-items: center;

    span {
      display: flex;
      align-items: center;
      gap: 6px;
      transition: transform 0.2s ease;

      &:hover {
        transform: scale(1.05);
      }
    }
  }

  .tags {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(34, 113, 177, 0.12);
  }
}

.toggle-button {
  white-space: nowrap;
  padding: 12px 24px;
  font-size: 16px;
  border: 1.5px solid rgba(34, 113, 177, 0.2);
  border-radius: 12px;
  background-color: white;
  color: var(--c-primary);
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;

  &.tag {
    background: rgba(34, 113, 177, 0.08) !important;
    color: var(--c-primary) !important;
    border: 1.5px solid rgba(34, 113, 177, 0.15) !important;
    font-weight: 600;
    font-size: 15px !important;
    border-radius: 999px !important;
    padding: 8px 20px !important;
    margin: 0 4px 4px 0;
    box-shadow: 0 2px 4px rgba(34, 113, 177, 0.06);
    cursor: pointer;

    &:hover {
      background: rgba(34, 113, 177, 0.12) !important;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(34, 113, 177, 0.1);
    }
  }

  &.active {
    background: linear-gradient(135deg, var(--c-primary-dark) 0%, var(--c-primary) 50%, var(--c-primary-light) 100%);
    color: white;
    border: none;
    box-shadow: 0 4px 12px rgba(34, 113, 177, 0.2);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(34, 113, 177, 0.25);
    }
  }

  &:hover {
    background-color: rgba(34, 113, 177, 0.08);
    border-color: var(--c-primary);
    transform: translateY(-2px);
  }

  &.sm {
    padding: 6px 12px;
    font-size: 13px;
  }

  &.md {
    padding: 10px 16px;
    font-size: 15px;
  }

  &:disabled {
    opacity: 0.5;
    pointer-events: none;
    background-color: rgba(34, 113, 177, 0.05);
    border-color: rgba(34, 113, 177, 0.1);
  }
}
</style>

