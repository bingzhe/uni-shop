<template>
  <view class="dflex-flow-c">
    <view class="dflex-c dflex-flow-c" style="margin-top: 180rpx">
      <view
        style="font-size: 115rpx"
        class="fs-big ft-base iconfont iconyiwancheng-"
      ></view>
      <view class="title">支付成功</view>
    </view>
    <view class="padding-lr-16" style="margin-top: 200rpx">
      <view class="dflex-b border-radius-big">
        <view class="tac padding-tb-sm flex1 bg-base" @click="toOrder">
          查看订单
        </view>
      </view>
      <view class="border-radius-big margin-tb-lg padding-lr-16">
        <view class="tac padding-tb-sm flex1" @click="tohome"> 返回首页 </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      order_id: "",
    };
  },
  onLoad(option) {
    this.order_id = option.order_id;
  },
  methods: {
    toOrder() {
      if (this.order_id) {
        this.$util.redirectTo("/pages/order/orderList");
        return;
      }
    },
    tohome() {
      this.$util.redirectTo("/pages/index/index");
    },
  },
};
</script>

<style lang="scss">
.title {
  font-size: 38rpx;
  color: #303133;
}
</style>
