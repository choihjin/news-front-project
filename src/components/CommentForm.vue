<template>
  <div class="comment-form" :class="{ 'reply-form': isReply }">
    <textarea
      v-model="content"
      :placeholder="placeholder"
      rows="3"
      @keydown.ctrl.enter="handleSubmit"
    ></textarea>
    <div class="form-actions">
      <span class="hint">Ctrl + Enter로 작성</span>
      <div class="button-group">
        <button v-if="isReply" @click="$emit('cancel')" class="cancel-button">
          취소
        </button>
        <button @click="handleSubmit" :disabled="!content.trim()">
          작성하기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  isReply: {
    type: Boolean,
    default: false
  },
  parent_id: {
    type: Number,
    default: null
  }
});

const emit = defineEmits(['submit', 'cancel']);

const content = ref('');

const placeholder = computed(() => {
  return props.isReply ? '답글을 작성해주세요...' : '댓글을 작성해주세요...';
});

const handleSubmit = () => {
  if (!content.value.trim()) return;
  
  emit('submit', {
    content: content.value,
    parent_id: props.parent_id
  });
  
  content.value = '';
};
</script>

<style scoped lang="scss">
.comment-form {
  margin-bottom: 2rem;
  
  &.reply-form {
    margin-left: 2rem;
    margin-bottom: 1rem;
  }
  
  textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    resize: vertical;
    margin-bottom: 0.5rem;
    
    &:focus {
      outline: none;
      border-color: #333;
      box-shadow: 0 0 0 2px #444;
    }
  }
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .hint {
    color: #666;
    font-size: 0.9rem;
  }
  
  .button-group {
    display: flex;
    gap: 0.5rem;
    
    button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      
      &.cancel-button {
        background-color: #f0f0f0;
        
        &:hover {
          background-color: #e0e0e0;
        }
      }
      
      &:not(.cancel-button) {
        background-color: #333;
        color: #fff;
        
        &:hover:not(:disabled) {
          background-color: #222;
        }
        &:focus {
          outline: none;
          background-color: #222;
          box-shadow: 0 0 0 2px #444;
        }
      }
    }
  }
}

.edit-form {
  margin-top: 1rem;
  
  textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 0.95rem;
    resize: vertical;
    min-height: 80px;
    margin-bottom: 0.75rem;
    transition: border-color 0.2s ease;
    
    &:focus {
      outline: none;
      border-color: #333;         // 연한 검정
      box-shadow: 0 0 0 2px #444; // 더 연한 검정 하이라이트
    }
  }
  
  .button-group {
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
    
    button {
      padding: 0.5rem 1rem;
      border: 1px solid transparent;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.2s ease;
      
      &.save-button {
        background-color: #333;   // 연한 검정
        color: white;
        
        &:hover:not(:disabled) {
          background-color: #222; // 더 진한 검정
        }
        &:focus {
          outline: none;
          background-color: #222;
          box-shadow: 0 0 0 2px #444;
        }
        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }
      
      &.cancel-button {
        background-color: white;
        border-color: #ddd;
        color: #666;
        
        &:hover {
          background-color: #f8f9fa;
          border-color: #ccc;
          color: #333;
        }
      }
    }
  }
}
</style> 