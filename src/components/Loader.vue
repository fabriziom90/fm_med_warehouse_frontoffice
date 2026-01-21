<script></script>
<template lang="">
  <div
    class="vw-100 vh-100 d-flex justify-content-center align-items-center bg-white-trans flex-column"
  >
    <span class="loader"></span>
    <div class="fs-2">Caricamento</div>
  </div>
</template>
<style lang="scss" scoped>
@use "../styles/_partials/_variables.scss" as *;

.bg-white-trans {
  background-color: $mainColorTransparent;
}

.loader {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: inline-block;
  position: relative;
  border: 5px solid;
  border-color: #fff #fff transparent transparent;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}
.loader::after,
.loader::before {
  content: "";
  box-sizing: border-box;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  border: 5px solid;
  border-color: transparent transparent $mainColor $mainColor;
  width: 55px;
  height: 55px;
  border-radius: 50%;
  box-sizing: border-box;
  animation: rotationBack 0.5s linear infinite;
  transform-origin: center center;
}
.loader::before {
  width: 42px;
  height: 42px;
  border-color: #fff #fff transparent transparent;
  animation: rotation 1.5s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes rotationBack {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(-360deg);
  }
}
</style>
