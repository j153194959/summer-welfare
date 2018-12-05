import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Activity1 from '@/components/activity1/Activity1'
import Activity2 from '@/components/activity2/Activity2'
import Order from '@/components/activity2/Order-details'
import Result from '@/components/activity2/Redemption-result'
import Address from '@/components/activity2/Address'

Vue.use(Router)

export default new Router({
  routes: [
    {
      // 默认主页
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      // 活动1
      path: '/activity1',
      name: 'Activity1',
      component: Activity1
    },
    {
      // 活动2
      path: '/activity2',
      name: 'Activity2',
      component: Activity2
    },
    {
      // 活动2 订单详情
      path: '/activity2/order',
      name: 'order',
      component: Order
    },
    {
      // 活动2 兑换结果
      path: '/activity2/./result',
      name: 'result',
      component: Result
    },
    {
      // 活动2 兑换地址
      path: '/activity2/./address',
      name: 'address',
      component: Address
    }
  ]
})
