<template>
  <div class="box">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.box {
  background-color: white;
  border: 1px solid rgba(34, 113, 177, 0.1);
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(34, 113, 177, 0.06);
  width: 100%;
  padding: 20px;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 16px rgba(34, 113, 177, 0.1);
    border-color: rgba(34, 113, 177, 0.2);
  }
}
</style>
