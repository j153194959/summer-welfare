<template>
  <div class="address">
    <div class="address-info">
      <div>
        <span>收货人</span>
        <input type="text" placeholder="请输入收货人姓名" v-model="userName">
      </div>
      <div>
        <span>手机号码</span>
        <input type="text" placeholder="请输入手机号码" v-model="phone">
      </div>
      <div>
        <span>所在地区</span>
        <div @click="showAddressPicker">
          <input type="text" placeholder="请选择地址" v-model="region" maxlength="80" readonly="readonly" />
          <img src="../../assets/activity2/ico_next.png" alt="">
        </div>
      </div>
      <div>
        <span>详细地址</span>
        <textarea name="" id="" cols="30" rows="2" placeholder="请输入详细地址信息(如道路、门牌号等)" v-model="addressDetail"></textarea>
      </div>
    </div>
    <!-- 按钮 -->
    <div class="submit-btn">
      <button @click="submitInfo">使 用</button>
    </div>
    <!-- 地址弹出层 -->
    <mt-popup v-model="regionVisible" position="bottom" class="region-popup">
      <mt-picker :slots="myAddressSlots" valueKey="name" :visibleItemCount="5" @change="addressChange" :itemHeight="40"></mt-picker>
    </mt-popup>
    <div class="pop-ups">
      <!-- 我的兑换 -->
      <transition name="fade">
        <div v-if="mask.redemption" class="supernatant redemption">
          <div>
            <div @click="closeMask(0)" class="shut"><img src="../../assets/activity2/popup_ico_close.png" alt=""></div>
            <div class="no">
              <div><img src="../../assets/activity2/popup_ico_addresserror.png" alt=""></div>
              <p>地址提交后无法修改，<br>请再次确认无误</p>
              <a @click="closeMask(0)" href="javascript:void(0)">取消</a><a @click="submit" href="javascript:void(0)">好的</a>
            </div>
          </div>
        </div>
      </transition>
      <!-- 提示信息 -->
      <transition name="fade">
        <div v-if="mask.tip" class="supernatant tip">
          <div>
            <div @click="closeMask(1)" class="shut"><img src="../../assets/activity2/popup_ico_close.png" alt=""></div>
            <div class="no">
              <div><img src="../../assets/activity2/popup_ico_addresserror.png" alt=""></div>
              <p>{{ tip }}</p>
              <!-- <a @click="closeMask(1)" href="javascript:void(0)">取消</a> -->
              <a @click="closeMask(1)" href="javascript:void(0)">好的</a>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
// import { Button } from 'mint-ui'
import { Popup, Picker } from 'mint-ui'
// 引入省市区数据json文件
import threeLevelAddress from '../../assets/city.json'
export default {
  name: 'Address',
  props: ['propData'],
  data () {
    return {
      userName: '', // 收货人
      phone: '', // 收货人手机号
      addressDetail: '', // 详细地址
      tip: '请输入完整的信息！', // 提示语
      region: '', // 三级地址
      province: '', // 省
      city: '', // 市
      county: '', // 县
      provinceCode: '', // 省级代码
      cityCode: '', // 市级代码
      countyCode: '', // 县级代码
      regionVisible: false, // 弹出框是否可见
      regionInit: false,
      myAddressSlots: [
        // 省
        {
          flex: 1,
          values: this.getProvinceArr(), // 省份数组
          className: 'slot1',
          textAlign: 'center'
        },
        // 分隔符
        {
          divider: true,
          content: '-',
          className: 'slot2'
        },
        // 市
        {
          flex: 1,
          values: this.getCityArr('北京市'),
          className: 'slot3',
          textAlign: 'center'
        },
        {
          divider: true,
          content: '-',
          className: 'slot4'
        },
        // 县
        {
          flex: 1,
          values: this.getCountyArr('北京市', '北京市'),
          className: 'slot5',
          textAlign: 'center'
        }
      ],
      mask: { // 弹窗控制
        redemption: false, // 我的兑换
        tip: false // 提示
      }
    }
  },
  components: {
    Popup,
    Picker
  },
  methods: {
    /**
     * 打开弹窗
     */
    openMask: function (index) {
      var arr = ['redemption', 'tip']
      this.mask[arr[index]] = true
    },
    /**
     * 关闭弹窗
     */
    closeMask: function (index) {
      var arr = ['redemption', 'tip']
      this.mask[arr[index]] = false
    },
    /**
     * 地址选择器
     */
    showAddressPicker () {
      this.regionVisible = true
    },
    addressChange (picker, values) {
      console.info(picker)
      console.info(values)
      if (this.regionInit) {
        // 取值并赋值
        this.region = values[0]['name'] + values[1]['name'] + values[2]['name']
        this.province = values[0]['name']
        this.city = values[1]['name']
        this.county = values[2]['name']
        this.provinceCode = values[0]['code']
        this.cityCode = values[1]['code']
        this.countyCode = values[2]['code']
        // console.log(picker.getSlotValue(0))
        // console.table(picker.getSlotValues(0))
        // console.table(picker.getValues())
        // 给市、县赋值 设定给定 slot 的备选值数组
        picker.setSlotValues(1, this.getCityArr(values[0]['name']))
        picker.setSlotValues(2, this.getCountyArr(values[0]['name'], values[1]['name']))
      } else {
        this.regionInit = true
      }
    },
    /**
     * 遍历json，返回省级对象数组
     */
    getProvinceArr () {
      let provinceArr = []
      threeLevelAddress.forEach(function (item) {
        let obj = {}
        obj.name = item.name
        obj.code = item.code
        provinceArr.push(obj)
      })
      return provinceArr
    },
    /**
     * 遍历json，返回市级对象数组
     */
    getCityArr (province) {
      // console.log("省：" + province);
      let cityArr = []
      threeLevelAddress.forEach(function (item) {
        if (item.name === province) {
          console.info(item)
          item.children.forEach(function (args) {
            let obj = {}
            obj.name = args.name
            obj.code = args.code
            cityArr.push(obj)
          })
        }
      })
      return cityArr
    },
    /**
     * 遍历json，返回县级对象数组
     */
    getCountyArr (province, city) {
      let countyArr = []
      threeLevelAddress.forEach(function (item) {
        if (item.name === province) {
          item.children.forEach(function (args) {
            if (args.name === city) {
              args.children.forEach(function (param) {
                let obj = {}
                obj.name = param.name
                obj.code = param.code
                countyArr.push(obj)
              })
            }
          })
        }
      })
      // console.log(countyArr);
      return countyArr
    },

    /**
     * 点击使用按钮
     */
    submitInfo () {
      console.info(this.phone)
      if (this.userName !== '' && this.phone !== '' && this.region !== '' && this.addressDetail !== '') {
        let reg = /^[1][3,4,5,7,8,9][0-9]{9}$/
        if (!reg.test(this.phone)) {
          console.info('手机格式不正确')
          this.tip = '请输入正确的手机号码！'
          this.mask.tip = true // 提示信息
        } else {
          console.info('手机格式正确')
          this.mask.redemption = true // 地址确认弹框
        }
      } else {
        this.tip = '请输入完整的信息！'
        this.mask.tip = true // 提示信息
      }
    },

    /**
     * 提交信息
     */
    submit () {
      var params = new FormData()
      params.append('account', this.propData.userinfo.xuid)
      params.append('name', this.userName)
      params.append('phone', this.phone)
      params.append('address', this.region + this.addressDetail)
      this.$ajax({
        method: 'post',
        url: '/addAddress',
        data: params
      }).then((res) => {
        console.info(res)
        if (res.data.resphead.respcode === '0000') { // 成功
          console.info('使用成功')
          this.mask.redemption = false // 地址确认弹框
          // this.$router.push({name: 'order'})
          this.$router.back(-1)
        } else if (res.data.resphead.respcode === '1005') {
          this.mask.redemption = false // 地址确认弹框
          setTimeout(() => {
            this.tip = res.data.resphead.respdetails
            this.mask.tip = true // 提示信息
          }, 500)
        }
      }).catch((err) => {
        console.info(err)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.address{
  background: rgba(240,240,240,1);
  .address-info{
    margin: .2rem 0 .4rem 0; // 20 40
    background: #fff;
    padding-left: .3rem; // 30
    font-size: .32rem; // 32
    >div:nth-of-type(1),>div:nth-of-type(2){
      display: flex;
      align-items: center;
      // padding: .2778rem 0;
      height: 1.1rem; // 110
      // line-height: .7639rem; // 110
      border-bottom: 1px solid #e1e1e1;
      span{
        flex: 20;
        margin-right: .3rem;
      }
      >input{
        flex: 80;
        height: 100%;
        font-size: .3rem;
      }
    }
    >div:nth-of-type(3){
      display: flex;
      align-items: center;
      height: 1.1rem; // 110
      // line-height: .7639rem; // 110
      border-bottom: 1px solid #e1e1e1;
      span{
        flex: 20;
        margin-right: .3rem;
      }
      >div{
        height: 100%;
        flex: 80;
        display: flex;
        align-items: center;
        input{
          flex: 1;
          height: 100%;
          font-size: .3rem;
        }
        >img{
          width: .21rem;
          height: .38rem;
          margin-right: .3rem;
        }
      }
    }
    >div:nth-of-type(4){
      display: flex;
      margin-top: .4rem; // 40
      span{
        flex: 20;
        margin-right: .3rem;
      }
      >textarea{
        margin-top: .04rem;
        flex: 80;
        border: 0 none;
        outline: 0 none;
        font-family: normal;
        font-size: .3rem;
      }
    }
  }
  .submit-btn{
    display: flex;
    button{
      flex: 1;
      margin: 0 .2083rem;
      border: 0 none;
      outline: 0 none;
      background: #2E6BB1;
      border-radius: .1rem; // 10
      height: .88rem; // 88
      font-size: .34rem; // 34
      color: #fff;
    }
  }
  .region-popup{
    width: 100%;
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
        }
        a{
          background-size: contain;
          background-repeat: no-repeat;
          width: 2.08rem;
          height: .98rem;
          line-height: .98rem;
          text-align: center;
          position: absolute;
          bottom: -.55rem;
          font-family: PingFangSC-Medium;
          font-size: .36rem;
          letter-spacing: 0;
          &:first-of-type{
            background-image: url("../../assets/activity2/popup_btn_small_blue.png");
            color: #FFF;
            left: .8rem;
          }
          &:last-of-type{
            background-image: url("../../assets/activity2/popup_btn_small.png");
            color: #F77D02;
            right: .8rem;
          }
        }
      }
    }
    // 提示
    > .tip > div{
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
          padding-top: .3rem;
        }
        a{
          background-size: contain;
          background-repeat: no-repeat;
          width: 2.08rem;
          height: .98rem;
          line-height: .98rem;
          text-align: center;
          position: absolute;
          bottom: -.55rem;
          font-family: PingFangSC-Medium;
          font-size: .36rem;
          letter-spacing: 0;
          &:first-of-type{
            background-image: url("../../assets/activity2/popup_btn_small.png");
            color: #F77D02;
            left: 50%;
            margin-left: -1.04rem;
          }
        }
      }
    }
  }}
</style>
