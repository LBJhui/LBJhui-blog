<script setup>
  import Canvas3DCountdown from './components/codepen/Canvas3DCountdown.vue'
  import LightLoader  from './components/codepen/LightLoader.vue'
  import DotBallClock  from './components/codepen/DotBallClock.vue'
  import CarLoading  from './components/codepen/CarLoading.vue'
  import BlackWhiteDotsLoader  from './components/codepen/BlackWhiteDotsLoader.vue'
  import ToggleRadio  from './components/codepen/ToggleRadio.vue'
</script>

<style module>
.hollow {
  padding: 10px 20px;
  background: black;
  width:fit-content;
  margin: 0 auto;
  color: black;
  text-shadow:
    1px 0 #fff,
    1px 1px #fff,
    1px -1px #fff,
    0 1px #fff,
    0 -1px #fff,
    -1px 0 #fff,
    -1px -1px #fff,
    -1px 1px #fff;
}
</style>

# codepen

## HTML5 Canvas 3D 倒计时爆炸特效

<Canvas3DCountdown />

## Light Loader

<LightLoader />

## HTML5 Canvas实现会跳舞的时间动画

<DotBallClock />

## 纯CSS打造的汽车Loading加载动画

<CarLoading />

## 黑白小球交替的loading效果

<BlackWhiteDotsLoader  />

## 纯CSS3开关样式的自定义单选框

<ToggleRadio />

## 空心文字

<div :class="$style.hollow">LBJhui</div>
