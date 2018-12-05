<template>
  <div class="Activity2">
    <div class="container">
      <header>
        <div v-if="propData.inUlb" @click="toShare"><img src="../../assets/activity2/ico_share.png" alt=""></div>
      </header>
      <main>
        <div @click="clickMine" class="mine"><img src="../../assets/activity2/part1_btn_myexchange.png" alt=""></div>
        <nav>
          <ol class="clearfix">
            <li @click="clickNav(index)" :class="{current: value.current}" v-for="(value, index) in nav" :key="index">
              <div>{{value.time}}</div>
              <p>{{value.statu | navStatu}}</p>
            </li>
          </ol>
        </nav>
        <div class="container">
          <div v-for="(value, index) in prize" v-if="index === listIndex" :key="index">
            <h3>{{value.title}}</h3>
            <ul>
              <li v-for="(item, i) in value.list" :key="i" class="clearfix">
                <div class="left"><img :src="item.img | listImg" alt=""></div>
                <div class="right">
                  <h4>{{item.msg}}</h4>
                  <p>剩余：<span>{{item.remaining}}</span>/{{item.total}}个</p>
                  <div><span>1</span>积分</div>
                </div>
                <a @click="exchange(item.id, item.statu)" :class="{can: item.statu === 0 && item.remaining}" href="javascript:void(0)">{{item.statu | listStatu(item.remaining)}}</a>
              </li>
            </ul>
          </div>
        </div>
      </main>
      <footer>
        <h3>活动说明</h3>
        <div class="rule">
          <p>1、活动时间：即日起-2018/9/25。</p>
          <p>2、活动资格：限 兴证通绑定信用账户的客户，持有的信用账户开立时间限为2018年8月起。</p>
          <p>3、参与次数：活动期间，每位符合活动资格的客户有1次兑换机会，同一手机号（兴证通）、资金账号均视为同一客户。</p>
          <p>4、兑换奖品后需填写收货地址以完成兑换，实物奖品兑换成功后将在14个工作日内发出，收货地址以参与活动时登记的为准。</p>
          <p>5、本活动全部奖品由第三方服务商上海勒思代为发放。</p>
          <p>6、请确保网络、系统和手机通畅，若因网络原因、系统原因、手机欠费等原因，造成游戏中断、奖励未到账的情况，兴业证券将不再补发奖励。</p>
          <p>7、客户参与活动，即视为同意以上活动规则和免责声明。</p>
          <p>8、本次活动最终解释权归兴业证券股份有限公司所有，如有任何疑问，请致电兴业证券官方热线95562。</p>
        </div>
      </footer>
    </div>
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
  name: 'Activity2',
  props: ['propData', 'cordova', 'commonMask', 'setWeixinShare'],
  data () {
    return {
      haveRedemption: true, // 是否有兑换
      nav: [ // 导航栏
        // {
        //   current: 1, // 选中状态 1-选中 0-未选
        //   time: '7.16-7.27', // 时间
        //   statu: 0 // 状态 0-已结束 1-兑换中 2-即将开始
        // }
      ],
      prize: [ // 可兑换奖品
        // {
        //   title: '降温专场', // 标题
        //   list: [ // 奖品列表
        //     {
        //       img: 'razor.png', // 图片名称
        //       msg: '博朗剃须刀', // 奖品名称
        //       remaining: 20, // 剩余
        //       total: 100, // 总数
        //       id: 0000000, // 奖品编号
        //       statu: 0 // 状态
        //     },
        //     {
        //       img: 'razor.png', // 图片名称
        //       msg: '博朗剃须刀', // 奖品名称
        //       remaining: 0, // 剩余
        //       total: 100, // 总数
        //       id: 0000000, // 奖品编号
        //       statu: 0 // 状态
        //     }
        //   ]
        // },
        {}, {}, {}
      ],
      myOrder: { // 我的兑换
        systemaccount: '292900003', // 信用帐号
        img: 'razor.png', // 图片
        name: '博朗剃须刀', // 奖品名称
        address: 'testqqdasfdsfdssd' // 地址
      },
      shareData: { // 分享
        title: '1积分兑好礼', // 标题
        desc: '兴业证券1积分超值享受，好礼多多,精彩无限！', // 描述
        outUrl: 'https://static.xyzq.cn/activity/exchange-gift/index.html#/activity2', // 地址（出）
        imgUrl: 'https://static.xyzq.cn/activity/exchange-gift/static/images/activity2/share_icon.png' // 图标地址
      },
      ajaxTime: 0, // 请求ajax次数
      source: null, // axios阻止ajax请求方法
      mask: { // 弹窗控制
        redemption: false // 我的兑换
      }
    }
  },
  beforeMount: function () {
    document.getElementsByTagName('title')[0].innerHTML = '1积分兑好礼'
    // navigator.uniaccount.setTitleBar({title: '1积分兑好礼'})
  },
  mounted: function () {
    this.getNav()
  },
  watch: {
    'propData.userinfo.xuid': function () {
      this.getNav() // 获取导航栏信息 && 商品列表信息
    },
    'propData.windowOnload': function () {
      if (this.propData.isWeixin) {
        this.setWeixinShare(this.shareData)
      } else if (this.propData.inUlb) {
        navigator.uniaccount.setTitleBar({title: '1积分兑好礼'})
      }
    }
  },
  computed: {
    /**
     * 获取当前奖品列表展示项索引
     */
    listIndex: function () {
      for (let i = 0; i < this.nav.length; i++) {
        const el = this.nav[i]
        if (el.current) return i
      }
    }
  },
  filters: {
    /**
     * 导航栏状态
     */
    navStatu: function (statu) {
      // var arr = ['已结束', '兑换中', '即将开始']
      var arr = ['即将开始', '兑换中', '已结束']
      return arr[statu]
    },
    /**
     * 奖品列表状态
     */
    listStatu: function (statu, remaining) {
      // 剩余为0
      if (!remaining) return '已抢光'
      // 根据状态返回对应值
      var arr = ['我要兑换', '已兑换', '即将开始', '已过期', '不可兑换']
      return arr[statu]
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
      // 不在优理宝
      if (!this.propData.inUlb) {
        this.commonMask(1, '本活动仅支持在优理宝APP参与~', false)
        return
      }
      // 未加载完成
      if (!this.propData.userinfo.loadingCompleted) return
      // 在优理宝中且未登录
      if (this.propData.inUlb && !this.propData.userinfo.isLogin) {
        // 重新登陆
        this.cordova({
          reloginflag: '1',
          accounttype: '1'
        })
        return
      }
      // alert(this.propData.userinfo.xuid)
      this.$ajax({
        url: '/myOrder',
        params: {account: this.propData.userinfo.xuid}
      }).then((res) => {
        console.log(res.data)
        // alert(JSON.stringify(res))
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
    },
    /**
     * 点击导航栏
     */
    clickNav: function (index) {
      // 改变导航栏状态
      for (let i = 0; i < this.nav.length; i++) {
        this.$set(this.nav[i], 'current', 0)
      }
      this.$set(this.nav[index], 'current', 1)
    },
    /**
     * 获取导航栏信息 && 商品列表信息
     */
    getNav: function () {
      // 节流
      if (this.ajaxTime) this.source.cancel('取消第一次ajax请求')
      this.ajaxTime++
      // if (isLogin) {
      //   this.source = null
      // } else {
      //   this.source = this.$ajax.CancelToken.source()
      // }
      this.source = this.$ajax.CancelToken.source()
      this.$ajax({
        url: '/category',
        cancelToken: this.source.token
      }).then((res) => {
        console.log(res.data)
        // alert(JSON.stringify(res.data))
        const Data = res.data.respbody
        this.nav = []
        for (let i = 0; i < Data.length; i++) {
          const el = Data[i]
          let o = {}
          if (!i) { // 第一项默认为选中状态
            o.current = 1
          } else {
            o.current = 0
          }
          o.statu = el.status
          // 处理时间戳格式
          let time = this.GLOBAL.changeTimeType(el.begintime, 'MM.dd').substr(1) + '-' + this.GLOBAL.changeTimeType(el.endtime, 'MM.dd').substr(1)
          o.time = time
          this.nav.push(o)
          // 获取商品列表数据
          // alert('xuid: ' + this.propData.userinfo.xuid + '---id: ' + el.id)
          this.$ajax({
            url: '/prizes',
            params: {
              account: this.propData.userinfo.xuid,
              category: el.id
            },
            cancelToken: this.source.token
          }).then((res) => {
            // alert(JSON.stringify(res))
            const Data = res.data.respbody
            console.log(res.data)
            let o1 = {}
            o1.title = Data.title
            o1.list = []
            for (let j = 0; j < Data.list.length; j++) {
              const el2 = Data.list[j]
              let o2 = {}
              o2.img = el2.img
              o2.msg = el2.name
              o2.remaining = el2.stock
              o2.total = el2.total
              o2.statu = el2.status
              o2.id = el2.id
              o1.list.push(o2)
            }
            // 将获取数据按照索引对应放入数组中
            this.$set(this.prize, i, o1)
          }).catch((err) => {
            // alert(JSON.stringify(err))
            console.log(err)
          })
        }
      }).catch((err) => {
        console.log(err)
        // alert(JSON.stringify(err))
      })
    },
    /**
     * 点击 我要兑换
     * id 奖品id
     * 当前状态
     */
    exchange: function (id, statu) {
      // 不在优理宝
      if (!this.propData.inUlb) {
        this.commonMask(1, '本活动仅支持在优理宝APP参与~', false)
        return
      }
      // 未加载完成
      if (!this.propData.userinfo.loadingCompleted) return
      // 在优理宝中且未登录
      if (this.propData.inUlb && !this.propData.userinfo.isLogin) {
        // 重新登陆
        this.cordova({
          reloginflag: '1',
          accounttype: '1'
        })
        return
      }
      if (statu) return
      // console.log(id, statu)
      this.$ajax({
        url: '/prizeDetail',
        params: {
          account: this.propData.userinfo.xuid,
          id: id
        }
      }).then((res) => {
        console.log(res.data)
        const Data = res.data.resphead
        if (Data.respcode === '0000') {
          this.$router.push({name: 'order', query: {id: id}})
        } else if (Data.respcode === '1006') {
          this.commonMask(1, '您的手机号尚未绑定信用账号，是否前往绑定？', false)
        } else if (Data.respcode === '1007') {
          this.commonMask(1, '您绑定的信用账号开户日期早于2018年7月1日，不符合兑换资格', true)
        } else {
          this.commonMask(1, Data.respdetails, true)
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    /**
     * 分享
     */
    toShare: function () {
      // 优理宝APP_1积分转盘_主页_分享 埋点
      // window.TDAPP.onEvent('ylbapp_1point-turn_main_share', '', {acc: this.propData.userinfo.account, tel: this.propData.userinfo.phone})
      // 优理宝分享
      navigator.uniaccount.ulbShare(this.shareData.title, this.shareData.imgUrl, this.shareData.desc, this.shareData.outUrl)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.Activity2{
  > .container{
    /* 1rem=144px */
    background-image: url("../../assets/activity2/bg.png");
    background-repeat: no-repeat;
    background-size: cover;
    header{
      height: 8.291667rem; /* 1194 */
      div{
        width: 1.833333rem; /* 264 */
        height: .625rem; /* 90 */
        position: absolute;
        right: 0;
        top: .472222rem; /* 68 */
      }
    }
    main{
      width: 7.111111rem; /* 1024 */
      height: 8.354167rem; /* 1203 */
      margin: 0 auto;
      background-image: url("../../assets/activity2/part1_bg.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;
      position: relative;
      box-sizing: border-box;
      padding: .409722rem .201389rem .395833rem .229167rem; /* 59 29 57 33 */
      .mine{
        width: 2.673611rem; /* 385 */
        height: 1.027778rem; /* 148 */
        position: absolute;
        top: -1.027778rem; /* 148 */
        left: .298611rem; /* 43 */
      }
      nav {
        ol li{
          width: 2.180556rem; /* 314 */
          height: 1.041667rem; /* 150 */
          float: left;
          font-family: PingFangSC-Medium;
          font-size: .305556rem; /* 44 */
          letter-spacing: 0px;
          text-align: center;
          background-image: url("../../assets/activity2/tab_bg_inactive.png");
          background-size: 100% 100%;
          background-repeat: no-repeat;
          color: #8cb7f5;
          &:first-of-type{
            margin-right: .069444rem;
          }
          &:last-of-type{
            float: right;
          }
          div{
            font-size: .277778rem; /* 40 */
            padding-top: .208333rem; /* 30 */
            padding-bottom: .090278rem; /* 13 */
            font-family: PingFangSC-Regular;
            height: .208333rem;
            line-height: .208333rem;
          }
          &.current{
            color: #ffd117;
            background-image: url("../../assets/activity2/tab_bg_active.png");
          }
        }
      }
      > .container{
        > div{
          h3{
            width: 3.111111rem; /* 448 */
            height: .75rem; /* 108 */
            line-height: .75rem; /* 108 */
            font-family: PingFangSC-Regular;
            font-size: .305556rem; /* 44 */
            letter-spacing: 0px;
            color: #28409a;
            background-image: url("../../assets/activity2/bg_subtitle.png");
            background-size: contain;
            background-repeat: no-repeat;
            text-align: center;
            margin: .222222rem auto .236111rem; /* 32 34 */
          }
          ul li{
            margin: 0 auto .166667rem; /* 24 */
            width: 6.458333rem; /* 930 */
            height: 2.291667rem; /* 330 */
            background-color: #fafbff;
            border-radius: .111111rem; /* 16 */
            position: relative;
            .left{
              float: left;
              width: 1.736111rem; /* 250 */
              height: 1.736111rem; /* 250 */
              padding: .277778rem .208333rem; /* 40 30 */
            }
            .right{
              float: left;
              h4{
                padding-top: .277778rem; /* 40 */
                height: .326389rem; /* 47 */
                font-family: PingFangSC-Medium;
                font-size: .347222rem; /* 50 */
                line-height: .159722rem; /* 23 */
                letter-spacing: 0px;
                color: #28409a;
              }
              p{
                margin-top: .131944rem; /* 19 */
                height: .277778rem; /* 40 */
                font-family: PingFangSC-Regular;
                font-size: .277778rem; /* 40 */
                line-height: 23px; /* 23 */
                letter-spacing: 0px;
                color: #7783af;
                span{
                  font-family: PingFangSC-Medium;
                  font-size: .333333rem; /* 48 */
                }
              }
              div{
                margin-top: .618056rem; /* 89 */
                font-family: PingFangSC-Regular;
                font-size: .277778rem; /* 40 */
                line-height: .159722rem; /* 23 */
                letter-spacing: .006944rem; /* 1 */
                color: #f77d02;
                span{
                  font-family: PingFangSC-Medium;
                  font-size: .486111rem; /* 70 */
                  letter-spacing: .013889rem; /* 2 */
                }
              }
            }
            a{
              position: absolute;
              width: 2.138889rem; /* 308 */
              height: .75rem; /* 108 */
              line-height: .75rem; /* 108 */
              text-align: center;
              background-image: url("../../assets/activity2/btn_disable.png");
              background-size: contain;
              background-repeat: no-repeat;
              font-family: PingFangSC-Medium;
              font-size: .333333rem; /* 48 */
              letter-spacing: 0px;
              color: #fff;
              right: .208333rem; /* 30 */
              bottom: .236111rem; /* 34 */
              &.can{
                background-image: url("../../assets/activity2/btn_nor.png");
                color: #f77d02;
              }
            }
          }
        }

      }
    }
    footer{
      margin: .243056rem auto 0; /* 35 */
      width: 7.368056rem; /* 1061 */
      height: 10.0625rem; /* 1449 */
      background-image: url("../../assets/activity2/part2_bg.png");
      background-size: contain;
      background-repeat: no-repeat;
      padding-top: .506944rem; /* 73 */
      h3{
        background-image: url("../../assets/activity2/bg_title.png");
        background-size: contain;
        background-repeat: no-repeat;
        width: 2.694444rem; /* 388 */
        height: .819444rem; /* 118 */
        line-height: .819444rem; /* 118 */
        text-align: center;
        margin: 0 0 .395833rem 2.430556rem; /* 57 350 */
        font-family: PingFangSC-Medium;
        font-size: .416667rem; /* 60 */
        letter-spacing: 0px;
        color: #28409a;
      }
      .rule{
        padding: 0 .333333rem 0 .506944rem; /* 53 73 */
        font-family: PingFangSC-Regular;
        font-size: .25rem; /* 38 */
        line-height: .402778rem; /* 58 */
        letter-spacing: 0px;
        color: #0739b9;
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
