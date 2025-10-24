<template>
  <div class="container" v-if="!state.firstLoading">
    <div class="bg-color">
      <div class="bg-color-top"></div>
      <div class="bg-color-bottom"></div>
    </div>

    <div class="main-container">
      <div class="buy-method">
        <div class="title">购买方式</div>
        <div class="method">
          <img :src="state.choosedMethod.icon" alt="icon">
          {{state.choosedMethod.method}}
          <van-icon name="arrow" class="arrow" />
        </div>
      </div>

      <div class="change-container money" v-if="state.choosedMethod.id === '1'">
        <div class="title">
          N币
        </div>
        <div class="input-container">
          <input ref="ncoin" type="text" v-model="state.ncoin" placeholder="请输入数额" class="input" max-length="20"
            @focus="stopdefault(ncoin)">
          <span class="unit">N</span>
        </div>
        <div class="change-icon">
          <van-icon name="sort" class="sort" />
        </div>
        <div class="title">
          折合人民币
        </div>
        <div class="input-container">
          <input ref="money" type="text" v-model="state.money" placeholder="请输入数额" class="input" max-length="20"
            @focus="stopdefault(money)">
          <span class="unit">￥</span>
        </div>
        <div class="tip">提示：每月统一清算，购买记录可前往<span>我的记录</span>查看</div>
      </div>
      <div class="change-container money" v-if="state.choosedMethod.id === '2'">
        <div class="title">
          积分
        </div>
        <div class="input-container">
          <input ref="ncoin" type="text" v-model="state.ncoin" placeholder="请输入数额" class="input" max-length="20"
            @focus="stopdefault(ncoin)">
        </div>
        <div class="change-icon">
          <van-icon name="sort" class="sort" />
        </div>
        <div class="title">
          兑换N币
        </div>
        <div class="input-container">
          <input ref="money" type="text" v-model="state.money" placeholder="请输入数额" class="input" max-length="20"
            @focus="stopdefault(money)">
          <span class="unit">N</span>
        </div>
        <div class="tip">提示：每月统一清算，购买记录可前往<span>我的记录</span>查看</div>
      </div>
    </div>

    <div class="keyboard">
      <table>
        <tr>
          <td class="cell">1</td>
          <td class="cell">2</td>
          <td class="cell">3</td>
          <td class="cell"><i class="iconfont icon-backdelete icon-delete"></i></td>
        </tr>
        <tr>
          <td class="cell">4</td>
          <td class="cell">5</td>
          <td class="cell">6</td>
          <td rowspan="3" class="buy-cell">购买</td>
        </tr>
        <tr>
          <td class="cell">7</td>
          <td class="cell">8</td>
          <td class="cell">9</td>
        </tr>
        <tr>
          <td colspan="2">0</td>
          <td class="cell">.</td>
        </tr>
      </table>
    </div>
  </div>
  <div class="loading-container" v-else></div>
</template>

<script setup lang="ts">
import { reactive, onMounted, ref, Ref } from 'vue'
import { userStore } from '@/store/user'

const user = userStore()

const userInfo = reactive({
  ...user.getUserInfo
})
const state = reactive({
  firstLoading: true,
  methodsList: [
    {
      id: '1',
      method: '直接购买',
      remain: '默认',
      icon: ''
    },
    {
      id: '2',
      method: 'X光积分兑换',
      remain: '积分余额 2000',
      icon: ''
    },
    {
      id: '3',
      method: '星途积分兑换',
      remain: '积分余额 120',
      icon: ''
    }
  ],
  choosedMethod: {
    id: '2',
    method: '直接购买',
    remain: '默认',
    icon: ''
  },
  focusName: '',
  ncoin: '111',
  money: ''
})
let ncoin = ref(null)
let money = ref(null)

onMounted(() => {
  document.title = ''
})

const stopdefault = (name: Ref) => {
  name.value.setAttribute('readonly', 'readonly')
  setTimeout(() => {
    name.value.removeAttribute('readonly')
  }, 200)
}

const getData = () => {
  const user_id = userInfo.id
  console.log('%c 🥚 user_id: ', 'font-size:20px;background-color: #4b4b4b;color:#fff;', user_id)
}

const init = async () => {
  await getData()
  state.firstLoading = false
}

init()
</script>

<style scoped lang="less">
@import url('@/assets/style/center.less');
.container {
  .main-container {
    position: relative;
    width: 702px;
    margin: -278px auto 0;

    .buy-method {
      width: 100%;
      background: #ffffff;
      border-radius: 12px;
      padding: 24px 32px;
      .title {
        font-size: 32px;
        color: #313836;
        line-height: 48px;
      }

      .method {
        position: relative;
        font-size: 32px;
        color: #313836;
        line-height: 48px;
        img {
          display: inline-block;
          width: 64px;
          margin-right: 48px;
        }
        .arrow {
          position: absolute;
          color: #bac0cc;
          bottom: 6px;
          right: 30px;
        }
      }
    }

    .change-container {
      margin-top: 34px;
      padding: 24px 32px;
      background: #ffffff;
      border-radius: 12px;

      .title {
        font-size: 32px;
        color: #313836;
        line-height: 48px;
      }

      .input-container {
        margin-top: 24px;
        position: relative;
        font-size: 48px;
        font-weight: 600;
        color: #313836;
        line-height: 72px;
        border-bottom: 2px solid #e5e7ea;

        .input {
          width: 590px;
        }

        input::-webkit-input-placeholder {
          /* WebKit browsers */
          color: #e5e7ea;
        }

        input:-moz-placeholder {
          /* Mozilla Firefox 4 to 18 */
          color: #e5e7ea;
        }

        input::-moz-placeholder {
          /* Mozilla Firefox 19+ */
          color: #e5e7ea;
        }

        input:-ms-input-placeholder {
          /* Internet Explorer 10+ */
          color: #e5e7ea;
        }

        .unit {
          position: absolute;
          right: 0px;
        }
      }

      .change-icon {
        width: 48px;
        border-radius: 50%;
        text-align: center;
        background-color: rgba(109, 61, 204, 0.3);
        margin: 16px 0;

        .sort {
          font-size: 32px;
          color: @topicColor;
          line-height: 48px;
        }
      }
      .tip {
        margin-top: 32px;
        font-size: 24px;
        color: #7a8396;
        line-height: 36px;
        span {
          color: @topicColor;
        }
      }
    }
  }
  .keyboard {
    position: absolute;
    bottom: 0;
    width: 750px;
    height: 464px;
    background: #ffffff;
    margin-left: -24px;
    font-size: 48px;
    font-weight: 600;
    color: #313836;
    line-height: 116px;
    text-align: center;
    .cell {
      width: 188px;
      height: 116px;
      background: #ffffff;
      border: 1px solid #f8f9fb;

      .icon-delete {
        font-size: 50px;
      }
    }
    .buy-cell {
      font-weight: 400;
      background-color: @topicColor;
      color: #ffffff;
    }
  }
}
</style>
