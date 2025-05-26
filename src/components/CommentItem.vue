<template>
  <div v-if="comment" class="comment-item" :class="{ 'reply': isReply }">
    <div class="comment-header">
      <span class="username">{{ comment.username }}</span>
      <div class="header-right">
        <span class="date">{{ formatDate(comment.created_at) }}</span>
        <div v-if="comment.is_owner" class="owner-actions">
          <button @click="toggleEdit" class="action-button edit">
            <span class="icon">✏️</span>
          </button>
          <button @click="handleDelete" class="action-button delete">
            <span class="icon">🗑️</span>
          </button>
        </div>
      </div>
    </div>
    <div class="comment-content">
      <div v-if="!isEditing" class="content-text">
        <p>{{ comment.content }}</p>
        <div class="comment-actions">
          <button 
            v-if="!isReply && !comment.parent" 
            class="reply-button" 
            @click="$emit('reply', comment.id)"
          >
            답글 달기
          </button>
        </div>
      </div>
      <div v-else class="edit-form">
        <textarea 
          v-model="editedContent"
          rows="3"
          placeholder="댓글을 입력하세요..."
          ref="editTextarea"
          @keydown.ctrl.enter="handleUpdate"
        ></textarea>
        <div class="button-group">
          <button 
            @click="handleUpdate"
            :disabled="!editedContent.trim() || editedContent === comment.content"
            class="save-button"
          >
            수정 완료
          </button>
          <button @click="cancelEdit" class="cancel-button">
            취소
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { useDate } from '@/composables/useDate';

const props = defineProps({
  comment: {
    type: Object,
    required: true
  },
  isReply: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update', 'delete', 'reply']);

const { user } = useAuth();
const { formatDate } = useDate();

const isEditing = ref(false);
const editedContent = ref('');
const editTextarea = ref(null);

// 댓글 소유자 확인
const isOwner = computed(() => {
  const currentUser = user.value?.username;
  const commentUser = props.comment?.username;
  return currentUser && commentUser && currentUser === commentUser;
});

// 수정 모드 토글
const toggleEdit = async () => {
  isEditing.value = true;
  editedContent.value = props.comment.content;
  // 다음 틱에서 textarea에 포커스
  await nextTick();
  editTextarea.value?.focus();
};

// 수정 취소
const cancelEdit = () => {
  isEditing.value = false;
  editedContent.value = '';
};

// 댓글 수정
const handleUpdate = async () => {
  const content = editedContent.value.trim();
  if (!content || content === props.comment.content) return;
  
  try {
    emit('update', {
      id: props.comment.id,
      content: content
    });
    isEditing.value = false;
  } catch (error) {
    console.error('댓글 수정 실패:', error);
    alert('댓글 수정에 실패했습니다.');
  }
};

// 댓글 삭제
const handleDelete = () => {
  if (confirm('정말 삭제하시겠습니까?\n삭제된 댓글은 복구할 수 없습니다.')) {
    emit('delete', props.comment.id);
  }
};
</script>

<style scoped lang="scss">
.comment-item {
  padding: 1.5rem;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  background-color: white;
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  &.reply {
    margin-left: 3rem;
    background-color: #f8f9fa;
    border-left: 3px solid #0066cc;
  }
}

.comment-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.8rem;

  .username {
    font-weight: 600;
    color: #1a1a1a;
    font-size: 0.95rem;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .date {
    color: #888;
    font-size: 0.85rem;
  }
}

.comment-content {
  color: #333;
  line-height: 1.6;
  
  .content-text {
    p {
      margin: 0;
      white-space: pre-wrap;
      word-break: break-word;
    }
  }
}

.comment-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
}

.owner-actions {
  display: flex;
  gap: 0.5rem;
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.3rem;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  .icon {
    font-size: 1rem;
  }
  
  &:hover {
    background-color: #f8f9fa;
    border-color: #ccc;
  }
  
  &.delete:hover {
    background-color: #fff5f5;
    border-color: #ff8787;
    color: #e03131;
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
      border-color: #333;
      box-shadow: 0 0 0 2px #444;
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
        background-color: #333;
        color: white;
        
        &:hover:not(:disabled) {
          background-color: #222;
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

.reply-button {
  padding: 0.4rem 0;
  border: none;
  background-color: transparent;
  color: #333;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  align-self: flex-start;
  
  &::before {
    content: "↪";
    font-size: 1.1rem;
  }
  
  &:hover {
    color: #222;
    text-decoration: underline;
  }
}
</style> 