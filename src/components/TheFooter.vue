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
  font-size: 1rem;
  color: var(--c-primary-dark);
  background: linear-gradient(90deg, #f6f8fa 60%, #e3f0fa 100%);
  border-radius: 24px;
  box-shadow: 0 2px 12px rgba(34,113,177,0.06);
  padding: 40px 0 24px 0;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}

.footer a {
  color: var(--c-primary);
  text-decoration: none;
  margin: 0 18px;
  font-weight: 600;
  transition: color 0.2s;
}
.footer a:hover {
  color: var(--c-primary-dark);
  text-decoration: underline;
}

.footer p {
  margin-top: 12px;
  color: #7a8ca3;
  font-size: 1rem;
}
</style>
