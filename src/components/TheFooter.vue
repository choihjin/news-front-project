<script setup></script>

<template>
  <div class="footer">
    <a href="#">이용약관</a>
    <a href="#">개인정보처리방침</a>
    <p>© 2025 SSAFY NEWS. All rights reserved.</p>
  </div>
</template>

<style scoped lang="scss">
.footer {
  margin: 100px 0 50px 0;
  text-align: center;
  font-size: 0.9rem;
  color: #234e70;
  background: #f6f8fa;
  border-radius: 16px;
  box-shadow: 0 1.5px 8px rgba(0,60,120,0.06);
  padding: 32px 0 18px 0;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}

.footer a {
  color: #4b7ca8;
  text-decoration: none;
  margin: 0 14px;
  font-weight: 500;
  transition: color 0.18s;
}
.footer a:hover {
  color: #234e70;
  text-decoration: underline;
}

.footer p {
  margin-top: 8px;
  color: #7a8ca3;
  font-size: 0.92rem;
}
</style>
