<template>
  <div class="app-container home">
    <img :src="require('@/assets/images/4(1).jpg')" alt="" />
  </div>
</template>

<script>
export default {};
</script>

<style scoped lang="scss">
.app-container {
  height: 100vh;
  width: 100vw;
  position: relative;
}
img {
  height: 100%;
  width: 100%;
  vertical-align: middle;
  position: absolute;
  left: 0;
  top: 0;
  object-fit: cover;
}
</style>

