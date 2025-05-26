<script setup>
import StateButton from "@/common/StateButton.vue";
import { useDate } from "@/composables/useDate";
import { computed } from "vue";

const props = defineProps();

const { formatDate } = useDate();
const date = computed(() => formatDate(props.data.write_date));
</script>

<template>
  <div class="card">
    <div class="card__header">
      <StateButton type="state" size="sm" disabled class="category-tag">
        {{ props.data.category }}
      </StateButton>
      <div class="meta-info">
        <span class="writer">
          <span class="icon">👤</span>
          {{ props.data.writer }}
        </span>
        <span class="date">
          <span class="icon">📅</span>
          {{ date }}
        </span>
      </div>
    </div>
    <RouterLink :to="{ name: 'boardDetail', params: { id: props.data.id } }" class="content-link">
      <h2 class="title">{{ props.data.title }}</h2>
      <p class="description">{{ props.data.content }}</p>
    </RouterLink>
    <div class="tags">
      <StateButton
        v-for="(tag, index) in props.data.keywords"
        :key="index"
        type="tag"
        size="sm"
        class="tag-button"
      >
        #{{ tag }}
      </StateButton>
    </div>
  </div>
</template>

<style scoped lang="scss">
.card {
  background-color: white;
  width: 100%;
  max-width: 800px;
  padding: 24px;
  margin-bottom: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(34, 113, 177, 0.06);
  border: 1px solid rgba(34, 113, 177, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(34, 113, 177, 0.1);
    border-color: var(--c-primary);
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 16px;

    .category-tag {
      background: rgba(34, 113, 177, 0.08) !important;
      color: var(--c-primary) !important;
      border: 1.5px solid rgba(34, 113, 177, 0.15) !important;
      font-weight: 600 !important;
      padding: 6px 12px !important;
      border-radius: 999px !important;
      font-size: 0.9rem !important;
    }

    .meta-info {
      display: flex;
      align-items: center;
      gap: 16px;
      color: var(--c-gray-600);
      font-size: 0.95rem;

      .writer, .date {
        display: flex;
        align-items: center;
        gap: 6px;

        .icon {
          font-size: 1.1rem;
        }
      }
    }
  }

  .content-link {
    text-decoration: none;
    color: inherit;
    display: block;
    transition: all 0.3s ease;

    &:hover {
      .title {
        color: var(--c-primary);
      }
    }
  }

  .title {
    margin: 16px 0;
    font-size: 24px;
    font-weight: 700;
    color: var(--c-text);
    line-height: 1.4;
    transition: color 0.3s ease;
    background: linear-gradient(135deg, var(--c-primary-dark) 0%, var(--c-primary) 50%, var(--c-primary-light) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .description {
    font-size: 1.05rem;
    width: 95%;
    color: var(--c-gray-600);
    margin: 16px 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.6;
  }

  .tags {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    padding: 16px 0;
    border-top: 1px solid rgba(34, 113, 177, 0.1);
    margin-top: 16px;

    .tag-button {
      background: rgba(34, 113, 177, 0.06) !important;
      color: var(--c-primary) !important;
      border: 1.5px solid rgba(34, 113, 177, 0.1) !important;
      font-weight: 500 !important;
      padding: 6px 16px !important;
      border-radius: 999px !important;
      font-size: 0.9rem !important;
      transition: all 0.3s ease !important;

      &:hover {
        background: rgba(34, 113, 177, 0.1) !important;
        transform: translateY(-2px) !important;
        box-shadow: 0 4px 8px rgba(34, 113, 177, 0.1) !important;
      }
    }
  }
}
</style>
