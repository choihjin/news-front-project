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
  <component :is="linkComponent" v-bind="props.to ? { to: props.to } : {}">
    <ContentBox>
      <div class="top">
        <StateButton type="state" size="sm" isActive disabled
          style="background: #e0eaff; color: #084dbb; border: 1.2px solid #b3c6e0; font-weight: 700; letter-spacing: 0.5px; margin-right: 10px;"
        >
          {{ props.news.category }}
        </StateButton>
        <h1>{{ props.news.title }}</h1>
      </div>
      <div class="bottom">
        <div class="bottom__meta">
          {{ formatDate(new Date(props.news.write_date)) }}
        </div>
        <div v-if="hasInteraction" class="bottom__icons">
          <div v-if="hasInteraction">
            ❤️ {{ props.news.article_interaction?.likes }}
          </div>
          <div>
            👀 {{ props.news.article_interaction?.read }}
          </div>
        </div>
      </div>
    </ContentBox>
  </component>
</template>

<style scoped lang="scss">
.top {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  h1 {
    font-size: 1.08rem;
    font-weight: 700;
    color: #1c1c1e;
    background: linear-gradient(90deg, #1e3c72 0%, #2a5298 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-family: 'Montserrat', 'Pretendard', 'Noto Sans KR', 'Inter', Arial, sans-serif;
    margin: 0;
  }
}
.bottom {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: space-between;
  &__meta {
    color: #2271b1;
    font-size: 0.97rem;
    font-weight: 500;
  }
  &__icons {
    display: flex;
    gap: 10px;
    color: #2271b1;
    font-size: 0.97rem;
    font-weight: 500;
  }
}
</style>
