<template>
  <div class="app-container home">
    <img src="https://ai-image.aibertzh.com/user/static/bg/4%281%29.jpg" />
    <img src="https://ai-image.aibertzh.com/user/static/bg/4.png" class="img" />
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
.img {
  width: 82%;
  object-fit: contain;
  left: 4%;
  top: 2%;
}
</style>

