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
  border: 1.2px solid #c2c9d6;
  background: #f6f8fa;
  color: #234e70;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.18s cubic-bezier(0.4,0,0.2,1);
  font-weight: 500;
  min-width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 2px rgba(0,60,120,0.04);
}

.pagination__button:hover:not(:disabled) {
  background: #dbe3ec;
  color: #234e70;
  transform: translateY(-1.5px) scale(1.03);
  box-shadow: 0 2px 8px rgba(0,60,120,0.10);
}

.pagination__button:disabled {
  background: #f3f6fa;
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
  border: 1.2px solid #c2c9d6;
  background: #f6f8fa;
  color: #234e70;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.18s cubic-bezier(0.4,0,0.2,1);
  box-shadow: 0 1px 2px rgba(0,60,120,0.04);
}

.pagination__number--active {
  background: linear-gradient(90deg, #1e3c72 0%, #2a5298 100%);
  color: #fff;
  border-color: #234e70;
  transform: scale(1.08);
  box-shadow: 0 4px 16px rgba(35, 78, 112, 0.13);
}

.pagination__number:hover:not(.pagination__number--active) {
  background: #dbe3ec;
  color: #234e70;
  transform: scale(1.03);
  box-shadow: 0 2px 8px rgba(0,60,120,0.10);
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
