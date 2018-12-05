<template>
  <div class="Activity1">
    <div v-show="propData.inUlb" class="share" @click="goShare">
      <img src="../../assets/activity1/ico_share.png" alt="">
    </div>
    <div class="ring">
      <!-- 圆盘 -->
      <div class="round" ref="turntable">
          <ul class="cvs_imgs">
              <li v-for="(item, index) in gifts" :key="index" :style="{ transform: 'rotate('+ index*60 +'deg)'}">
                    <p>{{item.txt1}}</p>
                    <span>{{item.txt2}}</span>
              </li>
          </ul>
      </div>
      <!-- 按钮 -->
      <div class="start" @click="clickStart">
        <span>启动</span><br>
        <span>1积分</span>
      </div>
      <!-- 剩余抽奖次数 -->
      <div class="surplus">
        剩余抽奖次数：<span>{{surplus}}</span>
      </div>
    </div>
    <div @click="clickFund">
      <h3>{{fund.txt1}}</h3>
      <p>{{fund.txt2}}</p>
      <div>{{fund.txt3}}</div>
    </div>
    <div>
      <div></div>
      <h3>活动规则</h3>
      <div></div>
    </div>
    <div>
      <ul>
        <li>1.活动时间：即日起-2018/8/31。</li>
        <li>2.活动资格：拥有兴业证券资金账户，并且完成绑定兴证通（手机号）的客户。</li>
        <li>3.参与次数：活动期间，每位符合活动资格的客户有3次开宝箱机会，同一手机号（兴证通）、资金账号均视为同一客户。</li>
        <li>4.开宝箱抽中的积分实时发放，奖品发放以参与活动的兴证通手机号为准。</li>
        <li>5.积分可用于优理宝APP积分商城进行奖品兑换。</li>
        <li>6.请确保网络、系统和手机通畅，若因网络原因、系统原因、手机欠费等原因，造成游戏中断、奖励未到账的情况，兴业证券将不再补发奖励。</li>
        <li>7.客户参与活动，即视为同意以上活动规则和免责声明。</li>
        <li>8.通过本界面展示的任何内容和用户参与的任何活动均与苹果公司无关。</li>
        <li>9.本次活动最终解释权归兴业证券股份有限公司所有，如有任何疑问，请致电兴业证券官方热线95562。</li>
      </ul>
    </div>

    <!-- 弹出层-中奖 -->
    <transition name="fade">
      <div class="popup-prize" v-show="mask.getPrize">
        <div class="mask"></div>
        <div class="content">
          <h3>恭喜你</h3>
          <span>抽中<i>{{score}}</i> 积分</span>
          <div>
            <button @click="clickStart">再玩一次</button>
            <button @click="mask.getPrize=false">确认</button>
          </div>
          <i @click="mask.getPrize=false"></i>
        </div>
      </div>
    </transition>

    <!-- 弹出层-未中奖 -->
    <transition name="fade">
      <div class="popup-no-prize" v-show="mask.noGetPrize">
        <div class="mask"></div>
        <div class="content">
          <h3>哎呀，本次没有抽中～</h3>
          <span>谢谢参与</span>
          <div>
            <button @click="clickStart">再玩一次</button>
            <button @click="mask.noGetPrize=false">确认</button>
          </div>
          <i @click="mask.noGetPrize=false"></i>
        </div>
      </div>
    </transition>

    <!-- 弹出层-账户没有积分 -->
    <transition name="fade">
      <div class="popup-no-point" v-show="mask.noPoint">
        <div class="mask"></div>
        <div class="content">
          <h3>哎呀，您的账户没有</h3>
          <span>启动的积分～</span>
          <div>
            <button @click="goGetPoint">去赚积分</button>
          </div>
          <i @click="mask.noPoint=false"></i>
        </div>
      </div>
    </transition>

    <!-- 弹出层-账户没有绑定资金帐号 -->
    <transition name="fade">
      <div class="popup-no-point" v-if="mask.account">
        <div class="mask"></div>
        <div class="content">
          <h3>请先绑定资金帐号</h3>
          <div>
            <button @click="toBind">去绑定</button>
          </div>
          <i @click="mask.account=false"></i>
        </div>
      </div>
    </transition>

    <!-- 弹出层-不在优理宝中 -->
    <transition name="fade">
      <div class="popup-no-point" v-if="mask.share">
        <div class="mask"></div>
        <div class="content">
          <h3>本活动仅支持在优理宝</h3>
          <span>APP参与~</span>
          <div>
            <button @click="toDownload">立即下载</button>
          </div>
          <i @click="mask.share=false"></i>
        </div>
      </div>
    </transition>

    <!-- 弹出层-没有抽奖次数 -->
    <transition name="fade">
      <div class="popup-no-num" v-show="mask.noTimes">
        <div class="mask"></div>
        <div class="content">
          <h3>您的抽奖次数</h3>
          <span>已用完咯～</span>
          <div>
            <button @click="goOtherActivity">去参加其他活动</button>
          </div>
          <i @click="mask.noTimes=false"></i>
        </div>
      </div>
    </transition>
    <!-- 加载 -->
    <Loading v-show="mask.loading"></Loading>
  </div>
</template>

<script>
import Loading from '../common/Loading'

export default {
  name: 'Activity1',
  props: ['propData', 'cordova', 'setWeixinShare'],
  data () {
    return {
      gifts: [ // 抽奖礼品
        {txt1: 10, txt2: '积分'},
        {txt1: 50, txt2: '积分'},
        {txt1: 20, txt2: '积分'},
        {txt1: '谢谢参与', txt2: ''},
        {txt1: 100, txt2: '积分'},
        {txt1: 30, txt2: '积分'}
      ],
      score: -1, // 抽中积分
      degrees: [0, -60, -120, -180, -240, -300], // 旋转角度
      count: 0, // 旋转次数
      surplus: '', // 剩余抽奖次数
      fund: {
        txt1: '兴全磐稳增利',
        txt2: '340009',
        txt3: '给你稳稳的幸福'
      },
      shareData: { // 分享
        title: '1积分开宝箱', // 标题
        desc: '兴业证券暑期福利：清凉开宝箱，只要1积分！', // 描述
        outUrl: 'https://static.xyzq.cn/activity/pjm-test/summer-welfare/index.html#/activity1', // 地址（出）
        imgUrl: 'https://static.xyzq.cn/activity/summer-welfare/static/images/share_icon.png' // 图标地址
      },
      mask: { // 弹出框
        getPrize: false, // 中奖
        noGetPrize: false, // 未中奖
        noPoint: false, // 积分不足
        noTimes: false, // 没有抽奖机会了
        account: false, // 账户没有绑定资金帐号
        share: false, // 分享页弹窗
        loading: false
      }
    }
  },
  components: { // 公共组件
    Loading
  },
  watch: {
    'propData.userinfo.xuid': function () {
      this.getPrizeTimes() // 抽奖次数
    },
    'propData.windowOnload': function () {
      if (this.propData.isWeixin) {
        this.setWeixinShare(this.shareData)
      }
    }
  },
  mounted () {
    this.changeFund()
  },
  methods: {
    /**
     * 得到抽奖次数
     */
    getPrizeTimes () {
      this.mask.loading = true
      this.$ajax({
        url: 'https://estock.xyzq.com.cn/activity2/summer/summer/leftTimes',
        params: {
          account: this.propData.userinfo.xuid
        }
      }).then((res) => {
        console.info(res.data)
        this.surplus = res.data.respbody
        this.mask.loading = false
      }).catch((err) => {
        console.info(err)
        this.mask.loading = false
      })
    },
    /**
     * 点击开始
     */
    clickStart () {
      // 优理宝APP_1积分转盘_主页_启动 埋点
      window.TDAPP.onEvent('ylbapp_1point-turn_main_action', '', {acc: this.propData.userinfo.account, tel: this.propData.userinfo.phone})
      // 不在优理宝
      if (!this.propData.inUlb) {
        this.mask.share = true
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
      this.mask.getPrize = false // 再玩一次-中奖
      this.mask.noGetPrize = false // 再玩一次-未中奖
      var that = this
      this.mask.loading = true
      this.$ajax({
        url: 'https://estock.xyzq.com.cn/activity2/summer/summer/getBox',
        params: {
          account: this.propData.userinfo.xuid
        }
      }).then((res) => {
        that.count++
        let giftsIndex = -1 // 抽中积分需要旋转的角度-下标（默认）
        console.info(res.data)
        if (res.data.resphead.respcode === '0000') { // 抽奖成功
          if (res.data.respbody !== null) {
            that.score = res.data.respbody.score // 抽中积分
            switch (that.score) {
              case 10:
                giftsIndex = 0
                break
              case 20:
                giftsIndex = 2
                break
              case 30:
                giftsIndex = 5
                break
              case 50:
                giftsIndex = 1
                break
              case 100:
                giftsIndex = 4
                break
            }
            that.$refs.turntable.style.transform = 'rotate(' + (3 * that.count * 360 + that.degrees[giftsIndex]) + 'deg)'
            setTimeout(() => {
              that.mask.getPrize = true
            }, 3000)
            if (this.surplus) {
              this.surplus-- // 抽奖次数
            }
          } else { // 未抽中返回
            console.info('未抽中返回')
            giftsIndex = 3 // 谢谢参与
            that.$refs.turntable.style.transform = 'rotate(' + (3 * that.count * 360 + that.degrees[giftsIndex]) + 'deg)'
            setTimeout(() => {
              that.mask.noGetPrize = true
            }, 3000)
            if (this.surplus) {
              this.surplus-- // 抽奖次数
            }
          }
        } else if (res.data.resphead.respcode === '1002') { // 抽奖机会已用完
          console.info('抽奖机会已用完')
          setTimeout(() => {
            that.mask.noTimes = true
          }, 200)
        } else if (res.data.resphead.respcode === '1003') {
          console.info('启动的积分不足')
          setTimeout(() => {
            that.mask.noPoint = true
          }, 200)
        } else if (res.data.resphead.respcode === '1004') {
          this.mask.account = true
        } else {
          // alert('服务器繁忙，请稍后重试')
          alert(JSON.stringify(res.data))
        }
        console.info(that.score)
        this.mask.loading = false
        // console.info(that.degrees[giftsIndex])
      }).catch((err) => {
        console.info(err)
        this.mask.loading = false
        alert('服务器繁忙，请稍后重试')
      })
    },
    /**
     * 去赚积分
     */
    goGetPoint () {
      this.mask.noPoint = false
      navigator.uniaccount.jumpActivity({linkType: 2, link: 'https://estock.xyzq.com.cn/points/'})
    },
    /**
     * 去参加其他活动
     */
    goOtherActivity () {
      this.mask.noTimes = false
      navigator.uniaccount.jumpActivity({linkType: 2, link: 'https://estock.xyzq.com.cn/points/'})
    },
    /**
     * 分享
     */
    goShare () {
      // 优理宝APP_1积分转盘_主页_分享 埋点
      window.TDAPP.onEvent('ylbapp_1point-turn_main_share', '', {acc: this.propData.userinfo.account, tel: this.propData.userinfo.phone})
      // 优理宝分享
      navigator.uniaccount.ulbShare(this.shareData.title, this.shareData.imgUrl, this.shareData.desc, this.shareData.outUrl)
    },
    /**
     * 随机改变基金
     */
    changeFund: function () {
      var random = parseInt((Math.random() * 10)) % 2
      if (random) {
        this.fund.txt1 = '南方瑞合'
        this.fund.txt2 = '501062'
        this.fund.txt3 = '赚钱才收管理费'
      }
    },
    /**
     * 点击基金
     */
    clickFund: function () {
      // 优理宝APP_1积分转盘_主页_点击基金 埋点
      window.TDAPP.onEvent('ylbapp_1point-turn_main_fund1', '', {acc: this.propData.userinfo.account, tel: this.propData.userinfo.phone})
      // if (this.propData.inUlb) navigator.uniaccount.jumpActivity({linkType: 1, link: 18})
      if (this.propData.inUlb) navigator.uniaccount.jumpActivity({linkType: 2, link: 'https://static.xyzq.cn/upc/prod/www/spa/spa-require-ylb.html#newactivity/101001'})
    },
    /**
     * 点击 去绑定
     */
    toBind: function () {
      this.mask.account = false
      navigator.uniaccount.jumpActivity({linkType: 2, link: 'https://static.xyzq.cn/mhall/main.html#/uniacct/mgr/relateacct/list'})
    },
    /**
     * 点击 去下载
     */
    toDownload: function () {
      window.location.href = 'http://wap.xyzq.com.cn'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .Activity1{
    background: url(../../assets/activity1/bg.png) no-repeat left top;
    background-size: 100% auto;
    min-height: 24.6319rem;
    .share{
      width: 1.7361rem; // 250
      position: absolute;
      top: 3.7639rem; // 542
      right: 0;
      img{
        width: 1.7361rem; // 250
        height: .6181rem; // 89
      }
    }
    .ring{
      height: 5.6042rem; // 807
      width: 5.6042rem; // 807
      margin: 0 auto;
      margin-top: 5.0139rem; // 722
      position: relative;
      .round{ // 转盘
        position: absolute;
        height: 5.6042rem; // 807
        width: 5.6042rem; // 807
        background: url(../../assets/activity1/turntable.png) no-repeat center center;
        background-size: 100% 100%;
        transform: rotate(0deg);
        transition:all 3s ease 0s;
        overflow: hidden;
        .cvs_imgs{
          height: 5.6042rem; // 807
          width: 5.6042rem; // 807
          li{
            float: left;
            height: 100%;
            width: 1.3889rem; // 200
            position: absolute;
            left: 50%;
            top: 0;
            margin-left: -0.6944rem; // 100
            text-align: center;
            font-family: PingFangSC-Medium;
            p{
              margin-top: .625rem; // 100
              font-size: .5rem; // 72
              line-height: normal;
              letter-spacing: .0139rem; // 2
              color: #f76f01;
            }
            span{
              font-size: .25rem; // 36
              // height: .2361rem; // 34
              letter-spacing: .0069rem; // 1
              color: #ff7708;
            }
          }
          li:nth-of-type(4){
            p{
              margin-top: .8333rem; // 120
              font-size: .3194rem; // 46
            }
          }
        }
      }
      .start{ // 开始按钮
        text-align: center;
        height: 2.4306rem; // 350
        width: 2.1528rem; // 310
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -1.0764rem; // 155
        margin-top: -1.2153rem; // 175
        color: #fe502e;
        font-family: PingFangSC-Semibold;
        background: url(../../assets/activity1/btn_startup.png) no-repeat center center;
        // background-size: 100% 100%;
        background-size: cover;
        >span:nth-child(1){
          display: inline-block;
          margin-top: .9028rem; // 130
          font-size: .4444rem; // 64
        }
        >span:nth-child(2){
          font-size: .2569rem; // 37
        }
      }
      .surplus{ // 剩余抽奖次数
        position: absolute;
        left: 1.8056rem; // 260
        bottom: -.4167rem; // 60
        font-family: PingFangSC-Regular;
        font-size: .25rem; // 36
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0px;
        color: #ffffff;
        span{
          font-size: .3194rem; // 46
          color: #fddb31;
        }
      }
    }
    >div:nth-of-type(3){
      margin: 0 auto;
      margin-top: 2.0139rem; // 290
      height: 2.6875rem; // 387
      width: 6.8056rem; // 980
      background: url(../../assets/activity1/fund_bg.png) no-repeat;
      background-size: 100% 100%;
      text-align: center;
      font-family: PingFangSC-Medium;
      h3{
        padding-top: .3056rem; // 44
        // height: .4861rem; // 70
        font-size: .5139rem; // 74
        color: #115dc3;
      }
      p{
        // margin-top: .0694rem; // 10
        font-size: .3611rem; // 52
        letter-spacing: .0069rem; // 1
        color: #ff7607;
        margin-bottom: .0694rem; // 20
      }
      >div{
        margin: 0 auto;
        font-size: .3194rem; // 46
        letter-spacing: .0069rem; // 1
        color: #115dc3;
        width: 3.1389rem; // 452
        height: .5347rem; // 77
        line-height: .5347rem; // 77
        background-color: #e1eeff;
      }
    }
    >div:nth-of-type(4){
      margin-top: .625rem; // 90
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: PingFangSC-Semibold;
      >div:nth-of-type(1){
        width: 1.1667rem; // 168
        height: .3958rem; // 57
        background: url(../../assets/activity1/title_ico_left.png) no-repeat;
        background-size: 100% 100%;
      }
      >div:nth-of-type(2){
        width: 1.1667rem; // 168
        height: .3958rem; // 57
        background: url(../../assets/activity1/title_ico_right.png) no-repeat;
        background-size: 100% 100%;
      }
      h3{
        margin: 0 .4722rem; // 68
        font-size: .4722rem; // 68
        font-weight: normal;
        letter-spacing: .0139rem; // 2
        color: #056eb0;
      }
    }
    >div:nth-of-type(5){
      margin-top: .5417rem; // 78
      padding: 0 .3472rem; // 50
      font-family: PingFangSC-Regular;
      font-size: .2639rem; // 38
      line-height: .3958rem; // 57
      color: #e0effd;
    }
    // 弹出层-中奖
    .popup-prize{
      position: fixed;
      bottom: 0;
      right: 0;
      top: 0;
      left: 0;
      .mask{
        position: absolute;
        bottom: 0;
        right: 0;
        top: 0;
        left: 0;
        background-size: 100% 100%;
        background: #000;
        background: rgba(0, 0, 0, 0.5 );
      }
      .content{
        position: absolute;
        width: 5.0556rem; // 728
        height: 5rem;
        left: 50%;
        top: 50%;
        margin-left: -2.5278rem; // 364
        margin-top: -2.5rem;
        color: #1263d0;
        background: url(../../assets/activity1/popup_bg.png) no-repeat;
        background-size: cover;
        text-align: center;
        h3{
          padding-top: 2.2917rem; // 330
          font-size: .6528rem; // 84
        }
        >span{
          color: #fc6603;
          font-size: .2778rem; // 40
          i{
            font-size: .4444rem;
          }
        }
        >div{
          button{
            font-size: .3542rem; // 51
            color: #fff;
            border: 0 none;
            outline: none;
            width: 1.8056rem; // 260
            height: .8194rem; // 118
            line-height: .8194rem; // 118
            border-radius: .3819rem; // 55
            background: url(../../assets/activity1/popup_btn_blue.png) no-repeat;
            background-size: cover;
          }
          button:nth-of-type(2){
            margin-left: .0694rem; //10
            background: url(../../assets/activity1/popup_btn_orange.png) no-repeat;
            background-size: cover;
          }
        }
        >i{
          position: absolute;
          width: .6944rem; /* 100 */
          height: .6944rem; /* 100 */
          left: 50%;
          margin-left: -.3472rem; /* 50 */
          bottom: -1.0417rem; // 150
          background: url(../../assets/activity1/popup_ico_close.png) no-repeat center center;
          background-size: 100% 100%;
        }
      }
    }

    // 弹出层-未中奖
    .popup-no-prize{
      position: fixed;
      bottom: 0;
      right: 0;
      top: 0;
      left: 0;
      .mask{
        position: absolute;
        bottom: 0;
        right: 0;
        top: 0;
        left: 0;
        background-size: 100% 100%;
        background: #000;
        background: rgba(0, 0, 0, 0.5 );
      }
      .content{
        position: absolute;
        width: 5.0556rem; // 728
        height: 5rem;
        left: 50%;
        top: 50%;
        margin-left: -2.5278rem; // 364
        margin-top: -2.5rem;
        color: #1263d0;
        background: url(../../assets/activity1/popup_bg.png) no-repeat;
        background-size: cover;
        text-align: center;
        h3{
          padding-top: 2.2917rem; // 330
          font-size: .3194rem; // 46
        }
        span{
          font-size: .3333rem; // 48
        }
        >div{
          margin-top: .5347rem; // 77
          button{
            font-size: .3542rem; // 51
            color: #fff;
            border: 0 none;
            outline: none;
            width: 1.8056rem; // 260
            height: .8194rem; // 118
            line-height: .8194rem; // 118
            border-radius: .3819rem; // 55
            background: url(../../assets/activity1/popup_btn_blue.png) no-repeat;
            background-size: cover;
          }
          button:nth-of-type(2){
            margin-left: .0694rem; //10
            background: url(../../assets/activity1/popup_btn_orange.png) no-repeat;
            background-size: cover;
          }
        }
        >i{
          position: absolute;
          width: .6944rem; /* 100 */
          height: .6944rem; /* 100 */
          left: 50%;
          margin-left: -.3472rem; /* 50 */
          bottom: -1.0417rem; // 150
          background: url(../../assets/activity1/popup_ico_close.png) no-repeat center center;
          background-size: 100% 100%;
        }
      }
    }

    // 弹出层-账户没有积分---- 弹出层-没有抽奖次数
    .popup-no-point,.popup-no-num{
      position: fixed;
      bottom: 0;
      right: 0;
      top: 0;
      left: 0;
      .mask{
        position: absolute;
        bottom: 0;
        right: 0;
        top: 0;
        left: 0;
        background-size: 100% 100%;
        background: #000;
        background: rgba(0, 0, 0, 0.5 );
      }
      .content{
        position: absolute;
        width: 5.0556rem; // 728
        height: 5rem;
        left: 50%;
        top: 50%;
        margin-left: -2.5278rem; // 364
        margin-top: -2.5rem;
        color: #1263d0;
        background: url(../../assets/activity1/popup_bg.png) no-repeat;
        background-size: cover;
        text-align: center;
        h3{
          padding-top: 2.2917rem; // 330
          font-size: .3194rem; // 46
        }
        span{
          font-size: .3194rem; // 46
        }
        >div{
          margin-top: .5347rem; // 77
          button{
            font-size: .3542rem; // 51
            color: #fff;
            border: 0 none;
            outline: none;
            width: 3.125rem; // 450
            height: .8194rem; // 118
            line-height: .8194rem; // 118
            border-radius: .3819rem; // 55
            background: url(../../assets/activity1/popup_btn_orange_big.png) no-repeat;
            background-size: 100% 100%;
          }
        }
        >i{
          position: absolute;
          width: .6944rem; /* 100 */
          height: .6944rem; /* 100 */
          left: 50%;
          margin-left: -.3472rem; /* 50 */
          bottom: -1.0417rem; // 150
          background: url(../../assets/activity1/popup_ico_close.png) no-repeat center center;
          background-size: 100% 100%;
        }
      }
    }

    /* vue过渡类 */
    .fade-enter-active, .fade-leave-active {
      transition: opacity .2s;
    }
    .fade-enter, .fade-leave-to {
      opacity: 0;
    }
  }
</style>
