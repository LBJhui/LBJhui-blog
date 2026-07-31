<template>
  <div class="container">
    <div class="loading">
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.container {
  background: #66c7f4;
  height: 300px;
  width: 500px;
  position: relative;
  margin: auto;

  $ballSize: 10px;
  $containerSize: 150px;
  $n: 36;
  $pDeg: 360deg / $n;

  .loading {
    background: #66c7f4;
    width: $containerSize;
    height: $containerSize;
    border: 1px solid #fff;
    left: 50%;
    top: 50%;
    position: absolute;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    .dot {
      position: absolute;
      left: 50%;
      top: 0;
      width: $ballSize;
      height: $ballSize;
      margin-left: -$ballSize / 2;
      margin-top: -$ballSize / 2;
      transform-origin: center ($containerSize / 2 + $ballSize / 2);
      $duration: 2s;
      @for $i from 1 through $n {
        &:nth-child(#{$i}) {
          transform: rotate(($i - 1) * $pDeg);
          &:before,
          &::after {
            animation-delay: -$duration / $n * ($i - 1) * 6;
          }
        }
      }
      perspective: 70px;
      transform-style: preserve-3d;

      &::before,
      &::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 100%;
      }

      &::before {
        background: #000;
        top: -100%;
        animation: rotate-black $duration infinite;
        @keyframes rotate-black {
          0% {
            animation-timing-function: ease-in;
          }
          25% {
            transform: translate3d(0, 100%, $ballSize);
            animation-timing-function: ease-out;
          }
          50% {
            transform: translate3d(0, 200%, 0);
            animation-timing-function: ease-in;
          }
          75% {
            transform: translate3d(0, 100%, -$ballSize);
            animation-timing-function: ease-out;
          }
        }
      }
      &::after {
        background: #fff;
        top: 100%;
        animation: rotate-white $duration infinite;
        @keyframes rotate-white {
          0% {
            animation-timing-function: ease-in;
          }
          25% {
            transform: translate3d(0, -100%, -$ballSize);
            animation-timing-function: ease-out;
          }
          50% {
            transform: translate3d(0, -200%, 0);
            animation-timing-function: ease-in;
          }
          75% {
            transform: translate3d(0, -100%, $ballSize);
            animation-timing-function: ease-out;
          }
        }
      }
    }
  }
}
</style>
