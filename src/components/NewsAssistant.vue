<script setup>
import { ref } from 'vue';
import ContentBox from '@/common/ContentBox.vue';
import axios from 'axios';

const props = defineProps({
  articleId: {
    type: [String, Number],
    required: true
  }
});

const isOpen = ref(false);
const messages = ref([
  {
    type: 'bot',
    content: '안녕하세요! 저는 AI 뉴스비서 뉴비입니다. 이 기사에 대해 궁금한 점이 있으시다면 언제든 물어보세요! 😊'
  }
]);
const newMessage = ref('');
const isLoading = ref(false);

const toggleChat = () => {
  isOpen.value = !isOpen.value;
};

const sendMessage = async () => {
  if (!newMessage.value.trim() || isLoading.value) return;
  
  const userMessage = newMessage.value;
  newMessage.value = '';
  
  // 사용자 메시지 추가
  messages.value.push({
    type: 'user',
    content: userMessage
  });

  try {
    isLoading.value = true;
    const token = localStorage.getItem('accessToken');
    
    const response = await axios.post(
      'http://localhost:8000/news/chat/',
      {
        article_id: props.articleId,
        question: userMessage
      },
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      }
    );

    messages.value.push({
      type: 'bot',
      content: response.data.response
    });
  } catch (error) {
    console.error('채팅 응답 실패:', error);
    messages.value.push({
      type: 'bot',
      content: '죄송합니다. 응답을 생성하는 중에 오류가 발생했습니다. 잠시 후 다시 시도해주세요. 😢'
    });
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="news-assistant">
    <button class="assistant-toggle" @click="toggleChat">
      <span v-if="!isOpen">🤖 뉴비와 대화하기</span>
      <span v-else>✕</span>
    </button>

    <div v-if="isOpen" class="chat-container">
      <ContentBox class="chat-box">
        <div class="chat-header">
          <h3>AI 뉴스비서 뉴비</h3>
          <p>이 기사에 대해 궁금한 점을 물어보세요!</p>
        </div>

        <div class="messages" ref="messagesContainer">
          <div
            v-for="(message, index) in messages"
            :key="index"
            :class="['message', message.type]"
          >
            {{ message.content }}
          </div>
          <div v-if="isLoading" class="message bot loading">
            <span class="loading-dots">
              <span>.</span><span>.</span><span>.</span>
            </span>
          </div>
        </div>

        <div class="input-area">
          <input
            v-model="newMessage"
            @keyup.enter="sendMessage"
            placeholder="메시지를 입력하세요..."
            type="text"
            :disabled="isLoading"
          />
          <button @click="sendMessage" :disabled="isLoading">
            {{ isLoading ? '전송 중...' : '전송' }}
          </button>
        </div>
      </ContentBox>
    </div>
  </div>
</template>

<style scoped>
.news-assistant {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
}

.assistant-toggle {
  background: linear-gradient(135deg, var(--c-primary-dark), var(--c-primary));
  color: #fff;
  border: none;
  padding: 18px 32px;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 700;
  font-size: 1.1rem;
  box-shadow: 0 4px 16px rgba(34,113,177,0.18);
  transition: all 0.3s;
  &:hover {
    background: linear-gradient(135deg, var(--c-primary), var(--c-primary-light));
    transform: scale(1.04) translateY(-2px);
  }
}

.chat-container {
  position: absolute;
  bottom: 80px;
  right: 0;
  width: 480px;
  max-width: 95vw;
  animation: slideUp 0.3s;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(40px);}
  to { opacity: 1; transform: translateY(0);}
}

.chat-box {
  padding: 28px !important;
  background: linear-gradient(135deg, #f8fafc 60%, #e3f0fa 100%);
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(34,113,177,0.10);
}

.chat-header {
  margin-bottom: 25px;
  text-align: center;
}

.chat-header h3 {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 8px;
}

.chat-header p {
  font-size: 15px;
  color: #666;
}

.messages {
  height: 440px;
  overflow-y: auto;
  margin-bottom: 18px;
  padding: 12px;
  background: #f4f8fb;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.message {
  padding: 12px 18px;
  border-radius: 18px;
  max-width: 85%;
  word-break: break-word;
  font-size: 1rem;
  line-height: 1.6;
  box-shadow: 0 2px 8px rgba(34,113,177,0.04);
  &.bot {
    background: #e9ecef;
    color: var(--c-primary-dark);
    align-self: flex-start;
    border-bottom-left-radius: 5px;
  }
  &.user {
    background: linear-gradient(135deg, var(--c-primary), var(--c-primary-light));
    color: #fff;
    align-self: flex-end;
    border-bottom-right-radius: 5px;
  }
}

.input-area {
  display: flex;
  gap: 8px;
  input {
    flex: 1;
    padding: 12px 16px;
    border-radius: 12px;
    border: 2px solid rgba(34,113,177,0.12);
    font-size: 1rem;
    transition: all 0.2s;
    &:focus {
      border-color: var(--c-primary);
      background: #fff;
    }
  }
  button {
    padding: 0 18px;
    border-radius: 12px;
    background: linear-gradient(135deg, var(--c-primary-dark), var(--c-primary));
    color: #fff;
    border: none;
    font-weight: 600;
    transition: all 0.2s;
    &:hover { background: var(--c-primary); }
  }
}

.loading-dots {
  display: inline-block;
  font-size: 20px;
  letter-spacing: 2px;
}

.loading-dots span {
  animation: loading 1.4s infinite;
  opacity: 0;
}

.loading-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.loading-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes loading {
  0% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 0; }
}

.input-area input:disabled,
.input-area button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.message.loading {
  background: #e9ecef;
  padding: 15px 20px;
  width: fit-content;
}

/* 스크롤바 스타일링 */
.messages::-webkit-scrollbar {
  width: 8px;
}

.messages::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.messages::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.messages::-webkit-scrollbar-thumb:hover {
  background: #666;
}
</style> 