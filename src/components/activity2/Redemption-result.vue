<template>
  <div class="Redemption-result">
    <header>恭喜您，兑换成功</header>
    <main>
      <div><img :src="img | prizeImg" alt=""></div>
      <p>我们会尽快为您发货，您可以随时在优理宝终端查看订单信息！</p>
    </main>
    <footer>
      <a @click="clickMine" href="javascript:void(0)">我的兑换</a>
      <router-link :to="{name: 'Activity2'}">返回首页</router-link>
    </footer>
    <div class="pop-ups">
      <!-- 我的兑换 -->
      <transition name="fade">
        <div v-if="mask.redemption" class="supernatant redemption">
          <div>
            <div @click="closeMask(0)" class="shut"><img src="../../assets/activity2/popup_ico_close.png" alt=""></div>
            <div v-if="!haveRedemption" class="no">
              <div><img src="../../assets/activity2/popup_ico_nogifts.png" alt=""></div>
              <p>暂未兑换任何礼品<br><span>请前往兑换</span></p>
              <a @click="closeMask(0)" href="javascript:void(0)">好的</a>
            </div>
            <div v-if="haveRedemption" class="have">
              <div class="account">兑换信用帐号：{{myOrder.systemaccount | password}}</div>
              <div class="prize clearfix">
                <div class="left"><img :src="myOrder.img | listImg" alt=""></div>
                <div class="right">
                  <div>{{myOrder.name}}</div>
                  <p>1积分</p>
                </div>
              </div>
              <div class="address">
                <div><img src="../../assets/activity2/popup_ico_adress.png" alt=""></div>
                <p>{{myOrder.address}}</p>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Redemption-result',
  props: ['propData'],
  data () {
    return {
      img: '', // 图片路径
      haveRedemption: true, // 是否有兑换
      myOrder: { // 我的兑换
        systemaccount: '29900003', // 信用帐号
        img: 'razor.png', // 图片
        name: '博朗剃须刀', // 奖品名称
        address: 'testqqdasfdsfdssd' // 地址
      },
      mask: { // 弹窗控制
        redemption: false // 我的兑换
      }
    }
  },
  filters: {
    /**
     * 奖品图片路径
     */
    prizeImg: function (img) {
      return './static/images/activity2/circle_' + img
    },
    /**
     * 奖品列表图片路径
     */
    listImg: function (img) {
      return './static/images/activity2/' + img
    },
    /**
     * 资金账号加密
     */
    password: function (str) {
      var result = str.substr(str.length - 3)
      // console.log(str)
      var str1 = ''
      for (let i = 0; i < str.length - 3; i++) {
        str1 += '*'
      }
      return str1 + result
    }
  },
  mounted: function () {
    // 从路由中获取图片路径
    this.img = this.$route.query.img
  },
  methods: {
    /**
     * 打开弹窗
     */
    openMask: function (index) {
      var arr = ['redemption']
      this.mask[arr[index]] = true
    },
    /**
     * 关闭弹窗
     */
    closeMask: function (index) {
      var arr = ['redemption']
      this.mask[arr[index]] = false
    },
    /**
     * 点击 我的兑换
     */
    clickMine: function () {
      this.$ajax({
        url: '/myOrder',
        params: {account: this.propData.userinfo.xuid}
      }).then((res) => {
        console.log(res.data)
        if (res.data.resphead.respcode === '0000') {
          const Data = res.data.respbody
          if (Data.orders) {
            this.myOrder.systemaccount = Data.orders.systemaccount
            this.myOrder.img = Data.orders.prize.img
            this.myOrder.name = Data.orders.prize.name
            this.myOrder.address = Data.address
          } else {
            this.haveRedemption = false
          }
          this.openMask(0)
        }
      }).catch((err) => {
        console.log(err)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.Redemption-result{
  /* 1rem=100px */
  header{
    padding-top: .8rem;
    font-family: PingFangSC-Medium;
    font-size: .44rem;
    color: #F67C00;
    letter-spacing: 0;
    text-align: center;
  }
  main{
    div{
      width: 3.6rem;
      height: 3.6rem;
      margin: .4rem auto 0;
    }
    p{
      margin: .4rem auto 0;
      width: 4.73rem;
      text-align: center;
      font-family: PingFangSC-Regular;
      font-size: .28rem;
      color: #2E2E2E;
      letter-spacing: 0;
    }
  }
  footer{
    margin-top: .6rem;
    text-align: center;
    a{
      &:first-child{
        font-family: PingFangSC-Regular;
        font-size: .34rem;
        color: #2E6BB1;
        letter-spacing: 0;
        text-align: center;
      }
      &:last-child{
        display: block;
        margin: .4rem auto 0;
        width: 3.3rem;
        height: .88rem;
        line-height: .88rem;
        background-color: #2E6BB1;
        font-family: PingFangSC-Regular;
        font-size: .34rem;
        color: #FFF;
        letter-spacing: 0;
        text-align: center;
      }
    }
  }
  > .pop-ups{
    /* 1rem=100px */
    > .redemption > div{
      width: 5.92rem; /* 592 */
      height: 5.55rem; /* 555 */
      background-image: url("../../assets/activity2/popup_bg.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;
      position: relative;
      .shut{
        position: absolute;
        width: .64rem; /* 64 */
        height: .92rem; /* 92 */
        right: 0;
        top: -0.72rem; /* 92 */
      }
      .no{
        div{
          width: 2.2rem; /* 220 */
          height: 2.2rem; /* 220 */
          padding-top: 1.2rem; /* 120 */
          margin: 0 auto .68rem; /* 68 */
        }
        p{
          font-family: PingFangSC-Regular;
          font-size: .34rem;
          color: #FFF;
          letter-spacing: 0;
          text-align: center;
          line-height: .44rem;
          span{
            font-size: .28rem;
          }
        }
        a{
          background-image: url("../../assets/activity2/popup_btn.png");
          background-size: contain;
          background-repeat: no-repeat;
          width: 4.08rem;
          height: .98rem;
          line-height: .98rem;
          text-align: center;
          position: absolute;
          left: 50%;
          margin-left: -2.04rem;
          bottom: -.55rem;
          font-family: PingFangSC-Medium;
          font-size: .36rem;
          color: #F77D02;
          letter-spacing: 0;
        }
      }
      .have{
        .account{
          text-align: center;
          padding-top: 1rem;
          color: #fff;
          font-size: .3rem;
        }
        .prize{
          margin: .15rem auto;
          width: 5.2rem;
          height: 2.2rem;
          background: #FAFBFF;
          border-radius: .1rem;
          .left{
            float: left;
            width: 1.6rem; /* 160 */
            height: 1.6rem; /* 160 */
            padding: .3rem .2rem;
          }
          .right{
            div{
              color: #28409a;
              padding-top: .67rem;
              font-size: .32rem;
            }
            p{
              padding-top: .22rem;
              font-size: .26rem;
              color: #f67c00;
            }
          }
        }
        .address{
          height: 1.53rem;
          position: relative;
          div{
            width: .5rem;
            height: .64rem;
            position: absolute;
            left: .4rem;
            top: 50%;
            margin-top: -.32rem;
          }
          p{
            width: 4.13rem;
            position: absolute;
            top: 50%;
            left: 1.22rem;
            transform: translateY(-50%);
            -ms-transform: translateY(-50%);
            -moz-transform: translateY(-50%);
            -webkit-transform: translateY(-50%);
            -o-transform: translateY(-50%);
            font-family: PingFangSC-Regular;
            font-size: .28rem;
            color: #FFF;
            letter-spacing: 0;
          }
        }
      }
    }
  }
}
</style>
