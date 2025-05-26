<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['update:modelValue']);

const pages = computed(() => {
  const current = props.modelValue;
  const total = props.totalPages;
  const maxVisiblePages = 5;
  const pages = [];
  
  let start = Math.max(1, current - Math.floor(maxVisiblePages / 2));
  let end = Math.min(total, start + maxVisiblePages - 1);
  
  // 시작 페이지 조정
  if (end === total) {
    start = Math.max(1, end - maxVisiblePages + 1);
  }
  
  // 페이지 번호 생성
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  
  return pages;
});

function goToPage(page) {
  if (page >= 1 && page <= props.totalPages) {
    emit('update:modelValue', page);
  }
}

function goToFirst() {
  goToPage(1);
}

function goToLast() {
  goToPage(props.totalPages);
}
</script>

<template>
  <div class="pagination" v-if="totalPages > 1">
    <!-- 처음으로 -->
    <button 
      class="pagination__button"
      @click="goToFirst()" 
      :disabled="modelValue === 1"
      title="처음으로"
    >
      &lt;&lt;
    </button>
    
    <!-- 이전 -->
    <button 
      class="pagination__button"
      @click="goToPage(modelValue - 1)" 
      :disabled="modelValue === 1"
      title="이전"
    >
      &lt;
    </button>
    
    <!-- 페이지 번호 -->
    <div class="pagination__numbers">
      <button
        v-for="page in pages"
        :key="page"
        class="pagination__number"
        :class="{ 'pagination__number--active': page === modelValue }"
        @click="goToPage(page)"
      >
        {{ page }}
      </button>
    </div>

    <!-- 다음 -->
    <button 
      class="pagination__button"
      @click="goToPage(modelValue + 1)" 
      :disabled="modelValue === totalPages"
      title="다음"
    >
      &gt;
    </button>

    <!-- 마지막으로 -->
    <button 
      class="pagination__button"
      @click="goToLast()" 
      :disabled="modelValue === totalPages"
      title="마지막으로"
    >
      &gt;&gt;
    </button>
  </div>
</template>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 30px;
  padding: 10px 0;
}

.pagination__button {
  font-size: 14px;
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  background-color: #fff;
  color: #333;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  min-width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.pagination__button:hover:not(:disabled) {
  background-color: #333;
  color: #fff;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.pagination__button:disabled {
  background-color: #f8f8f8;
  border-color: #e8e8e8;
  color: #bbb;
  cursor: not-allowed;
  box-shadow: none;
}

.pagination__numbers {
  display: flex;
  gap: 8px;
}

.pagination__number {
  min-width: 36px;
  height: 36px;
  border: 1px solid #e0e0e0;
  background-color: #fff;
  color: #333;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.pagination__number--active {
  background-color: #333;
  color: #fff;
  border-color: #333;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.pagination__number:hover:not(.pagination__number--active) {
  background-color: #f8f8f8;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

@media (max-width: 480px) {
  .pagination {
    gap: 4px;
  }
  
  .pagination__button,
  .pagination__number {
    min-width: 32px;
    height: 32px;
    font-size: 13px;
    padding: 6px;
  }
}
</style>
