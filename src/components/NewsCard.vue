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
  background: #f8fafc;
  border-radius: 18px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  width: 100%;
  max-width: 1200px;
  min-width: 280px;
  padding: 28px 28px 18px 28px;
  margin-bottom: 18px;
  transition: box-shadow 0.18s cubic-bezier(0.4,0,0.2,1), transform 0.18s cubic-bezier(0.4,0,0.2,1);
  border: none;
  position: relative;
  margin-left: auto;
  margin-right: auto;

  &:hover {
    box-shadow: 0 8px 32px rgba(0,91,234,0.10);
    transform: translateY(-4px) scale(1.02);
  }

  &__header {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 1rem;
    color: #888;
    margin-bottom: 8px;
  }

  .title {
    margin: 12px 0 8px 0;
    font-size: 24px;
    font-weight: bold;
    background: linear-gradient(90deg, #1e3c72 0%, #2a5298 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: 0.2px;
  }

  .description {
    font-size: 1.08rem;
    width: 95%;
    color: #444;
    margin: 10px 0 18px 0;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.5;
  }

  .stats {
    display: flex;
    gap: 18px;
    font-size: 0.98rem;
    color: #005bea;
    margin-bottom: 18px;
    align-items: center;
  }

  .tags {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    padding-bottom: 18px;
    border-bottom: 1px solid #e7e6e6;
  }
}
</style>

