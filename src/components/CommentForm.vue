<template>
  <div class="comment-form" :class="{ 'reply-form': isReply }">
    <div class="form-container">
      <textarea
        v-model="content"
        :placeholder="placeholder"
        rows="3"
        @keydown.ctrl.enter="handleSubmit"
        class="comment-textarea"
      ></textarea>
      <div class="form-actions">
        <span class="hint">
          <span class="keyboard-shortcut">Ctrl</span> + 
          <span class="keyboard-shortcut">Enter</span>로 작성
        </span>
        <div class="button-group">
          <button 
            v-if="isReply" 
            @click="$emit('cancel')" 
            class="cancel-button"
          >
            취소
          </button>
          <button 
            @click="handleSubmit" 
            :disabled="!content.trim()"
            class="submit-button"
          >
            작성하기
          </button>
        </div>
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
  margin-bottom: 32px;
  
  &.reply-form {
    margin-left: 48px;
    margin-bottom: 24px;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      left: -24px;
      top: 50%;
      width: 24px;
      height: 2px;
      background: linear-gradient(90deg, var(--c-primary) 0%, rgba(34, 113, 177, 0.2) 100%);
    }
  }

  .form-container {
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 16px rgba(34, 113, 177, 0.06);
    border: 1px solid rgba(34, 113, 177, 0.1);
    padding: 20px;
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 8px 24px rgba(34, 113, 177, 0.08);
      border-color: rgba(34, 113, 177, 0.2);
    }
  }
  
  .comment-textarea {
    width: 100%;
    padding: 16px;
    border: 2px solid rgba(34, 113, 177, 0.15);
    border-radius: 12px;
    resize: vertical;
    margin-bottom: 16px;
    font-size: 1.05rem;
    line-height: 1.6;
    color: var(--c-text);
    background: rgba(255, 255, 255, 0.9);
    transition: all 0.3s ease;
    
    &:focus {
      outline: none;
      border-color: var(--c-primary);
      box-shadow: 0 4px 12px rgba(34, 113, 177, 0.1);
      background: white;
    }

    &::placeholder {
      color: rgba(34, 113, 177, 0.5);
    }
  }
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .hint {
    color: var(--c-gray-600);
    font-size: 0.95rem;
    display: flex;
    align-items: center;
    gap: 4px;

    .keyboard-shortcut {
      background: rgba(34, 113, 177, 0.08);
      padding: 2px 8px;
      border-radius: 6px;
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--c-primary);
      border: 1px solid rgba(34, 113, 177, 0.15);
    }
  }
  
  .button-group {
    display: flex;
    gap: 12px;
    
    button {
      padding: 10px 20px;
      border-radius: 12px;
      font-weight: 600;
      font-size: 0.95rem;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
      }
      
      &.cancel-button {
        background: white;
        color: var(--c-primary);
        border: 1.5px solid rgba(34, 113, 177, 0.2);
        
        &:hover {
          background: rgba(34, 113, 177, 0.08);
          border-color: var(--c-primary);
          transform: translateY(-2px);
        }
      }
      
      &.submit-button {
        background: linear-gradient(135deg, var(--c-primary-dark) 0%, var(--c-primary) 100%);
        color: white;
        border: none;
        box-shadow: 0 4px 12px rgba(34, 113, 177, 0.2);
        
        &:hover:not(:disabled) {
          transform: translateY(2px);
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