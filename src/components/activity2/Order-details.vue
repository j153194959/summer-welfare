<template>
  <div class="Order-details">
    <header>
      <div @click="toAddress" class="content">
        <div class="left"><img src="../../assets/activity2/detail_ico_adress.png" alt=""></div>
        <div class="right"><img src="../../assets/activity2/ico_next.png" alt=""></div>
        <div v-if="address.name" class="main have">
          <div>{{address.name}}  {{address.phone | password}}</div>
          <p class="one-txt-cut">{{address.address}}</p>
        </div>
        <div v-if="!address.name" class="main no">
          <div>您暂未填写收货地址</div>
        </div>
      </div>
    </header>
    <main>
      <div class="img"><img :src="prizeDetail.img | prizeImg" alt=""></div>
      <div class="name">{{prizeDetail.name}}</div>
      <p><i><img src="../../assets/activity2/detail_ico_point.png" alt=""></i> <span>1</span>积分 <s>¥{{prizeDetail.price}}</s></p>
    </main>
    <footer>
      <a @click="placeOrder" href="javascript:void(0)">我要兑换</a>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'Order-details',
  props: ['propData', 'commonMask'],
  data () {
    return {
      id: '', // 商品编号
      address: { // 我的地址
        name: '', // 名字
        phone: '', // 手机哈
        address: '' // 地址
      },
      prizeDetail: { // 商品详情
        name: '博朗剃须刀', // 名称
        img: '', // 图片
        price: 339 // 原价
      }
    }
  },
  mounted: function () {
    // 从路由中获取奖品id
    this.id = this.$route.query.id

    // 获取数据
    this.getAddress()
    this.getPrizeDetail()
  },
  filters: {
    /**
     * 奖品图片路径
     */
    prizeImg: function (img) {
      return './static/images/activity2/4x3_' + img
    },
    /**
     * 手机号码加密
     */
    password: function (str) {
      var str1 = str.substr(0, 3)
      var str2 = str.substr(str.length - 4)
      return str1 + '****' + str2
    }
  },
  methods: {
    /**
     * 获取我的地址
     */
    getAddress: function () {
      this.$ajax({
        url: '/address',
        params: {
          account: this.propData.userinfo.xuid
        }
      }).then((res) => {
        console.log(res.data)
        const Data = res.data.respbody
        if (Data) {
          this.address.name = Data.name
          this.address.phone = Data.phone
          this.address.address = Data.address
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    /**
     * 获取商品详情
     */
    getPrizeDetail: function () {
      this.$ajax({
        url: '/prizeDetail',
        params: {
          account: this.propData.userinfo.xuid,
          id: this.id
        }
      }).then((res) => {
        console.log(res.data)
        const Data = res.data.respbody
        this.prizeDetail.name = Data.name
        this.prizeDetail.img = Data.img
        this.prizeDetail.price = Data.price
      }).catch((err) => {
        console.log(err)
      })
    },
    /**
     * 点击 我要兑换
     */
    placeOrder: function () {
      this.$ajax({
        url: '/placeOrder',
        params: {
          account: this.propData.userinfo.xuid,
          prizeId: this.id
        }
      }).then((res) => {
        console.log(res.data)
        const Data = res.data.resphead
        console.log(this.prizeDetail.img)
        // this.$router.push({name: 'result', query: {img: this.prizeDetail.img}})
        if (Data.respcode === '0000') {
          this.$router.push({name: 'result', query: {img: this.prizeDetail.img}})
        } else {
          this.commonMask(1, Data.respdetails, true)
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    /**
     * 点击地址 前往地址页
     */
    toAddress: function () {
      // this.$router.push({name: 'address'})
      if (!this.address.name) this.$router.push({name: 'address'})
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.Order-details{
  /* 1rem=100px */
  header{
    background-color: #F0F0F0;
    padding: .2rem;
    .content{
      height: 1.6rem;
      background: #FFF;
      border-radius: .1rem;
      .left{
        float: left;
        width: .5rem;
        height: .64rem;
        padding: .48rem .25rem;
      }
      .right{
        float: right;
        width: .21rem;
        height: .38rem;
        padding-top: .61rem;
        padding-right: .3rem;
      }
      .main{
        &.have{
          padding: 0 .7rem 0 1rem;
          color: #2E2E2E;
          letter-spacing: 0;
          line-height: .44rem;
          div{
            padding-top: .3rem;
            font-size: .34rem;
            font-family: PingFangSC-Medium;
          }
          p{
            margin-top: .08rem;
            font-size: .28rem;
            font-family: PingFangSC-Regular;
          }
        }
        &.no{
          height: 1.6rem;
          line-height: 1.6rem;
          font-family: PingFangSC-Regular;
          font-size: .34rem;
          color: #2E2E2E;
          letter-spacing: 0;
        }
      }
    }
  }
  main{
    .img{
      height: 5.62rem;
    }
    .name{
      font-size: .34rem;
      color: #000;
      padding: .48rem 0 .43rem .3rem;
    }
    p{
      padding-left: .3rem;
      font-family: PingFangSC-Regular;
      font-size: .28rem;
      color: #F67C00;
      letter-spacing: 0;
      line-height: .3rem;
      i{
        display: inline-block;
        width: .4rem;
        height: .41rem;
      }
      span{
        font-size: .54rem;
        line-height: .5rem;
      }
      s{
        color: #878787;
      }
    }
  }
  footer{
    margin-top: 1.09rem;
    margin-bottom: .8rem;
    a{
      display: block;
      width: 3.3rem;
      height: .88rem;
      line-height: .88rem;
      text-align: center;
      border-radius: .1rem;
      font-family: PingFangSC-Regular;
      font-size: .34rem;
      color: #FFF;
      letter-spacing: 0;
      background-color: #2E6BB1;
      margin: 0 auto;
    }
  }
}
</style>
