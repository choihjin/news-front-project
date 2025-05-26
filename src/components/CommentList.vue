<template>
  <div class="comment-list">
    <h3 class="comment-count">
      댓글 {{ totalCommentCount }}개
    </h3>
    
    <CommentForm @submit="handleCommentSubmit" />
    
    <div v-if="comments.length > 0" class="comments-container">
      <template v-for="comment in comments" :key="comment.id">
        <!-- 댓글 -->
        <div class="comment-wrapper">
          <CommentItem
            :comment="comment"
            @update="handleCommentUpdate"
            @delete="handleCommentDelete"
            @reply="handleReplyClick"
          />
          
          <!-- 대댓글 작성 폼 -->
          <CommentForm
            v-if="replyToId === comment.id"
            :is-reply="true"
            :parent_id="comment.id"
            @submit="handleReplySubmit"
            @cancel="handleReplyCancel"
          />

          <!-- 대댓글 목록 -->
          <div v-if="comment.replies && comment.replies.length > 0" class="replies-container">
            <CommentItem
              v-for="reply in comment.replies"
              :key="reply.id"
              :comment="reply"
              :is-reply="true"
              @update="handleCommentUpdate"
              @delete="handleCommentDelete"
            />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import CommentItem from './CommentItem.vue';
import CommentForm from './CommentForm.vue';

const props = defineProps({
  articleId: {
    type: [Number, String],
    required: true
  }
});

// 반응형 데이터 초기화
const comments = ref([]);
const replyToId = ref(null);

// 전체 댓글 수 계산 (댓글 + 대댓글)
const totalCommentCount = computed(() => {
  let count = 0;
  comments.value.forEach(comment => {
    count++; // 부모 댓글
    if (comment.replies) {
      count += comment.replies.length; // 대댓글
    }
  });
  return count;
});

// API 요청 시 사용할 헤더 설정
const getHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// 댓글 목록 조회
const fetchComments = async () => {
  try {
    const response = await axios.get(
      `http://localhost:8000/news/${props.articleId}/comments/`,
      { headers: getHeaders() }
    );

    comments.value = response.data.data || [];
  } catch (error) {
    console.error('댓글 목록 조회 실패:', error);
    if (error.response?.data?.message) {
      alert(error.response.data.message);
    } else {
      alert('댓글 목록을 불러오는데 실패했습니다.');
    }
    comments.value = [];
  }
};

// 댓글 작성
const handleCommentSubmit = async (data) => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }

    const requestData = {
      content: data.content,
      parent: data.parent_id ? Number(data.parent_id) : null
    };

    const response = await axios.post(
      `http://localhost:8000/news/${props.articleId}/comments/`,
      requestData,
      { headers: getHeaders() }
    );

    if (response.data.message === "대댓글에는 답글을 달 수 없습니다.") {
      alert('대댓글에는 답글을 달 수 없습니다.');
      return;
    }

    await fetchComments();
    return response.data;
  } catch (error) {
    console.error('댓글 작성 실패:', error);
    if (error.response?.data?.message) {
      alert(error.response.data.message);
    } else {
      alert('댓글 작성에 실패했습니다.');
    }
  }
};

// 댓글 수정
const handleCommentUpdate = async ({ id, content }) => {
  try {
    const response = await axios.put(
      `http://localhost:8000/news/comments/${id}/`,
      { content },
      { headers: getHeaders() }
    );

    if (response.data.message) {
      alert(response.data.message);
    }
    
    await fetchComments();
  } catch (error) {
    console.error('댓글 수정 실패:', error);
    if (error.response?.data?.message) {
      alert(error.response.data.message);
    } else {
      alert('댓글 수정에 실패했습니다.');
    }
    throw error;
  }
};

// 댓글 삭제
const handleCommentDelete = async (id) => {
  try {
    const response = await axios.delete(
      `http://localhost:8000/news/comments/${id}/`,
      { headers: getHeaders() }
    );

    if (response.data.message) {
      alert(response.data.message);
    }
    
    await fetchComments();
  } catch (error) {
    console.error('댓글 삭제 실패:', error);
    if (error.response?.data?.message) {
      alert(error.response.data.message);
    } else {
      alert('댓글 삭제에 실패했습니다.');
    }
  }
};

// 답글 작성 폼 표시
const handleReplyClick = (commentId) => {
  replyToId.value = commentId;
};

// 답글 작성 취소
const handleReplyCancel = () => {
  replyToId.value = null;
};

// 답글 작성
const handleReplySubmit = async (data) => {
  if (!replyToId.value) {
    console.error('부모 댓글 ID가 없습니다.');
    return;
  }

  const result = await handleCommentSubmit({
    content: data.content,
    parent_id: replyToId.value
  });

  if (result) {
    replyToId.value = null; // 답글 폼 닫기
  }
};

// 컴포넌트 마운트 시 댓글 목록 조회
onMounted(fetchComments);
</script>

<style scoped lang="scss">
.comment-list {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 12px rgba(34,113,177,0.06);
  padding: 32px 24px;
  margin-top: 32px;
}

.comment-count {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--c-primary);
  margin-bottom: 18px;
}

.comments-container {
  margin-top: 18px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.comment-wrapper {
  margin-bottom: 8px;
  border-bottom: 1px solid #f0f4f8;
  padding-bottom: 18px;
}

.replies-container {
  margin-top: 8px;
  margin-left: 32px;
  padding-left: 16px;
  background: rgba(34,113,177,0.03);
  border-radius: 0 0 12px 12px;
}

.comment-item.reply {
  margin-left: 0.2rem;
  background-color: #f8f9fa;
}
</style> 