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
  padding: 24px;
  border: 1px solid rgba(34, 113, 177, 0.12);
  border-radius: 16px;
  margin-bottom: 24px;
  background-color: white;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 12px rgba(34, 113, 177, 0.04);
  
  &:hover {
    box-shadow: 0 8px 24px rgba(34, 113, 177, 0.08);
    border-color: rgba(34, 113, 177, 0.2);
    transform: translateY(-2px);
  }

  &.reply {
    margin-left: 48px;
    background-color: rgba(34, 113, 177, 0.03);
    border-left: 4px solid var(--c-primary);
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
}

.comment-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;

  .username {
    font-weight: 700;
    color: var(--c-primary-dark);
    font-size: 1.1rem;
    background: linear-gradient(135deg, var(--c-primary-dark) 0%, var(--c-primary) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .date {
    color: var(--c-gray-500);
    font-size: 0.9rem;
    font-weight: 500;
  }
}

.comment-content {
  color: var(--c-text);
  line-height: 1.7;
  
  .content-text {
    p {
      margin: 0;
      white-space: pre-wrap;
      word-break: break-word;
      font-size: 1.05rem;
    }
  }
}

.comment-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
}

.owner-actions {
  display: flex;
  gap: 8px;
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 12px;
  background: rgba(34, 113, 177, 0.08);
  color: var(--c-primary);
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;

  &:hover {
    background: rgba(34, 113, 177, 0.12);
    transform: translateY(-2px);
  }

  &.edit:hover {
    background: rgba(34, 113, 177, 0.15);
  }

  &.delete:hover {
    background: rgba(220, 53, 69, 0.15);
    color: #dc3545;
  }

  .icon {
    font-size: 1.1rem;
  }
}

.reply-button {
  padding: 8px 16px;
  border: 1.5px solid rgba(34, 113, 177, 0.2);
  border-radius: 12px;
  background: white;
  color: var(--c-primary);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;

  &:hover {
    background: rgba(34, 113, 177, 0.08);
    border-color: var(--c-primary);
    transform: translateY(-2px);
  }
}

.edit-form {
  textarea {
    width: 100%;
    padding: 16px;
    border: 2px solid rgba(34, 113, 177, 0.15);
    border-radius: 12px;
    font-size: 1.05rem;
    line-height: 1.6;
    resize: vertical;
    transition: all 0.3s ease;
    background: rgba(255, 255, 255, 0.9);

    &:focus {
      outline: none;
      border-color: var(--c-primary);
      box-shadow: 0 4px 12px rgba(34, 113, 177, 0.1);
      background: white;
    }
  }

  .button-group {
    display: flex;
    gap: 12px;
    margin-top: 16px;
  }

  .save-button, .cancel-button {
    padding: 10px 20px;
    border-radius: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.95rem;
  }

  .save-button {
    background: linear-gradient(135deg, var(--c-primary-dark) 0%, var(--c-primary) 100%);
    color: white;
    border: none;
    box-shadow: 0 4px 12px rgba(34, 113, 177, 0.2);

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(34, 113, 177, 0.25);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
  }

  .cancel-button {
    background: white;
    color: var(--c-primary);
    border: 1.5px solid rgba(34, 113, 177, 0.2);

    &:hover {
      background: rgba(34, 113, 177, 0.08);
      border-color: var(--c-primary);
      transform: translateY(-2px);
    }
  }
}
</style> 