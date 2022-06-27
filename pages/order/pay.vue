<template>
  <view class="app w-full">
    <view class="price-box dflex-c dflex-flow-c">
      <view>支付金额</view>
      <view class="price fs-xxxl margin-top-sm">{{ money }}</view>
    </view>

    <view class="pay-type-list">
      <!-- #ifdef H5 || MP-360 -->
      <view
        class="type-item dflex-b pos-r padding-tb-sm"
        @click="changePayType(0)"
      >
        <!-- <text class="iconfont iconweixin"></text> -->
        <uni-icons
          class="uni-icon-cus"
          type="medal-filled"
          size="30"
        ></uni-icons>
        <view class="item flex1">
          <text class="tit">积分支付</text>
          <text>推荐使用</text>
        </view>
        <label class="radio">
          <radio
            value="0"
            color="#ff6a6c"
            colors="#ff6a6c"
            :checked="pay_way == 0"
            :disabled="money <= 0"
          />
        </label>
      </view>

      <view
        class="type-item dflex-b pos-r padding-tb-sm"
        @click="changePayType(1)"
      >
        <text class="iconfont iconweixin"></text>
        <view class="item flex1">
          <text class="tit">微信支付</text>
          <!-- <text>推荐使用</text> -->
        </view>
        <label class="radio">
          <radio
            value="1"
            color="#ff6a6c"
            colors="#ff6a6c"
            :checked="pay_way == 1"
            :disabled="money <= 0"
          />
        </label>
      </view>
    </view>
    <!-- #endif  -->

    <view class="padding w-full margin-top-big pos-a" style="bottom: 30rpx">
      <view class="dflex-b border-radius-big">
        <!-- #ifdef H5 || MP-360 -->
        <view
          class="tac padding-tb-sm flex1 bg-base"
          :class="is_submit === 1 ? 'bg-disabled' : ''"
          @click="confirm"
          >{{ pay_tip }}</view
        >
        <!-- #endif -->
      </view>
    </view>
  </view>
</template>

<script>
import { getMallOrderInfo, mallOrderPayApi } from "@/api/tuanApi.js";

export default {
  data() {
    return {
      money: 0,
      is_submit: 1,
      // 平台支付方式
      pay_way: "", // 0 积分支付 1 微信支付
      // 原始支付方式 微信支付 支付宝支付
      pay_original: "",
      // JSAPI，NATIVE，APP，H5支付固定传 MWEB
      pay_trade_type: "",
      pay_tip: "确认支付",

      qrcode: "",
      time_remaining: 0,

      order_id: "",
      order_no: "",
    };
  },
  computed: {},
  onLoad(options) {
    this.money = options.money || 0;
    this.order_id = options.order_id;

    // #ifdef MP-WEIXIN
    this.pay_way = "微信支付";
    this.pay_original = "微信支付";
    this.pay_trade_type = "JSAPI";
    // #endif

    // #ifdef H5 || MP-360
    // this.$api.timerout(() => {
    //   this.pay_way = "微信支付";
    //   this.pay_original = "微信支付";
    //   this.pay_trade_type = "NATIVE";
    // }, 0);

    // this.pay_tip = "已完成支付";
    // #endif

    this.loadData();
  },

  methods: {
    async loadData() {
      const params = {
        order_id: this.order_id,
      };

      const { data: result } = await getMallOrderInfo(params);

      if (result.code !== 200) return;
      const orderInfo = result.data || {};

      if (orderInfo.status === 1) {
        this.is_submit = 0;
        this.money = orderInfo.price || 0;
        this.order_no = orderInfo.order_no;
        this.pay_way = 0;
      }
    },

    //选择支付方式
    changePayType(type) {
      if (this.money <= 0) return;
      this.pay_way = type;
    },

    //确认支付
    async confirm() {
      if (this.is_submit) return;

      const params = {
        order_no: this.order_no,
        pay_type: this.pay_way,
      };

      //TODO
      const { data: result } = await mallOrderPayApi(params);

      if (result.code !== 200) return;

      const payData = result.data;

      WeixinJSBridge.invoke(
        "getBrandWCPayRequest",
        JSON.parse(payData),
        (res) => {
          // uni.navigateBack({});
          if (res.err_msg == "get_brand_wcpay_request:ok") {
            // 使用以上方式判断前端返回,微信团队郑重提示：
            //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
            uni.redirectTo({
              url: `/pages/order/paySuccess?order_id=${this.order_id}`,
            });
          }
        }
      );

      // this.topayment(payData);
      console.log(result);

      this.is_submit = 1;

      //   let _this = this;
      //   uni.login({
      //     success(loginRes) {
      //       console.log("loginRes", loginRes);
      //       if (loginRes.code) {
      //         let obj = {
      //           code: loginRes.code,
      //           order_id: _this.order_id,
      //           pay_way: _this.pay_way,
      //           pay_original: _this.pay_original,
      //           pay_trade_type: _this.pay_trade_type,
      //         };
      //         _this.$func.usemall.call("order/pay", obj).then((res) => {
      //           console.log("支付接口", obj, res);

      //           if (res.code === 200) {
      //             if (res.datas) {
      //               let pay_datas = {};

      //               //#ifdef MP-WEIXIN
      //               pay_datas = {
      //                 timeStamp: res.datas.timeStamp,
      //                 nonceStr: res.datas.nonceStr,
      //                 package: res.datas.package,
      //                 signType: res.datas.signType,
      //                 paySign: res.datas.paySign,
      //               };
      //               //#endif

      //               // 检查当前 session 是否有效
      //               if (uni.canIUse("checkSession")) {
      //                 uni.checkSession({
      //                   success() {
      //                     // 调用支付
      //                     _this.topayment(pay_datas, res.datas.order_id);
      //                   },
      //                   fail() {
      //                     // 当前 session 无效，调用 uni.login 获取数据
      //                     uni.login({
      //                       success() {
      //                         // 调用支付
      //                         _this.topayment(pay_datas, res.datas.order_id);
      //                       },
      //                       fail() {},
      //                     });
      //                   },
      //                 });
      //               } else {
      //                 // 调用支付
      //                 _this.topayment(pay_datas, res.datas.order_id);
      //               }
      //             } else {
      //               uni.setStorage({
      //                 key: "__order_state",
      //                 data: "待付款",
      //                 success(res) {
      //                   console.log(res);
      //                 },
      //                 complete() {
      //                   _this.$api.toorder();
      //                 },
      //               });
      //             }

      //             return;
      //           }

      //           _this.$api.timerout(() => {
      //             if (typeof res.msg === "object") {
      //               res.msg = res.msg.errorMessage;
      //             }
      //             _this.$api.msg(res.msg, 5000);
      //             _this.is_submit = 0;
      //           }, 800);
      //         });
      //       }
      //     },
      //     fail(err) {
      //       _this.$api.msg(err);
      //       _this.is_submit = 0;
      //     },
      //   });
    },
    topayment(pay_datas, order_id) {
      let _this = this;

      uni.requestPayment({
        ...pay_datas,
        success: function (pres) {
          console.log("requestPayment success:", pres);

          uni.redirectTo({
            url: `/pages/pay/success?order_id=${order_id}`,
          });
          return;
        },
        fail: function (err) {
          console.log("requestPayment fail:", err);

          uni.setStorage({
            key: "__order_state",
            data: "待付款",
            success(res) {
              console.log(res);
            },
            complete() {
              _this.$api.toorder();
            },
          });
        },
      });
    },
    // 检测订单支付状态
    // check() {
    //   let _this = this;

    //   _this.$func.usemall
    //     .call("order/paystate", {
    //       order_id: _this.order_id,
    //     })
    //     .then((res) => {
    //       // 商户后端查询的微信支付状态，通知收银台支付结果
    //       /*
    // 				  0：支付成功
    // 				  1：支付超时
    // 				  2：支付失败
    // 				  3：支付关闭
    // 				  9：订单状态未知/未支付
    // 				*/
    //       if (res.code == 200) {
    //         let code = 9;
    //         let trade_state = res.datas.trade_state || "";

    //         if (res.datas.pay_state == "已付款") {
    //           code = 0;
    //         } else if (trade_state == "SUCCESS") {
    //           code = 0;
    //         } else if (trade_state == "NOTPAY" || trade_state == "PAYERROR") {
    //           code = 2;
    //         } else if (trade_state == "CLOSED") {
    //           code = 3;
    //         }

    //         switch (code) {
    //           case 0:
    //             uni.redirectTo({
    //               url: `/pages/pay/success?order_id=${_this.order_id}`,
    //             });
    //             break;
    //           case 1:
    //             _this.$api.msg("支付超时，请重新支付", 3500);
    //             break;
    //           case 2:
    //             _this.$api.msg("已取消，请重新支付", 3500);
    //             break;
    //           case 3:
    //             _this.$api.msg("支付关闭，请重新支付", 3500);
    //             break;
    //           case 4:
    //             _this.$api.msg("支付取消，请重新支付", 3500);
    //             break;
    //           case 9:
    //           default:
    //             _this.$api.msg("支付失败，请重新支付", 3500);
    //             break;
    //         }
    //         return;
    //       }
    //     })
    //     .catch((err) => {});
    // },
    // #ifdef H5 || MP-360
    // loadQRCode() {
    //   let _this = this;
    //   let obj = {
    //     order_id: _this.order_id,
    //     pay_way: _this.pay_way,
    //     pay_original: _this.pay_original,
    //     pay_trade_type: _this.pay_trade_type,
    //   };
    //   uni.showLoading({
    //     title: "请求中",
    //   });
    //   // this.$api.alert('二维码支付开发中');
    //   _this.$func.usemall.call("order/pay", obj).then((res) => {
    //     console.log("支付接口", obj);
    //     uni.hideLoading();

    //     if (res.code === 200) {
    //       if (res.datas) {
    //         _this.qrcode = res.datas.codeUrl;
    //         _this.time_remaining = res.datas.time_remaining;
    //       } else {
    //         uni.setStorage({
    //           key: "__order_state",
    //           data: "待付款",
    //           success(res) {
    //             console.log(res);
    //           },
    //           complete() {
    //             _this.$api.toorder();
    //           },
    //         });
    //       }

    //       return;
    //     }

    //     _this.$api.timerout(() => {
    //       _this.$api.msg(res.msg, 5000);
    //       _this.is_submit = 0;
    //     }, 800);
    //   });
    // },
    // ontimeend() {
    //   let _this = this;
    //   uni.showModal({
    //     title: "提示",
    //     content: "支付二维码已过期",
    //     confirmText: "重新生成",
    //     success: function (res) {
    //       if (res.confirm) {
    //         _this.loadQRCode();
    //       } else if (res.cancel) {
    //         console.log("用户点击取消");
    //       }
    //     },
    //   });
    // },
    // #endif
  },
};
</script>

<style lang="scss">
.app {
}

.price-box {
  height: 266rpx;
  font-size: 28rpx;
  color: #909399;
}

.pay-type-list {
  padding-left: 60rpx;
  padding-right: 60rpx;

  .type-item {
    height: 120rpx;
    font-size: 30rpx;
  }

  .uni-icon-cus {
    width: 100rpx;
    text-align: left;
    color: #f85959 !important;
  }

  .iconfont {
    width: 100rpx;
    font-size: 52rpx;
  }

  .iconhuiyuan {
    color: #fe8e2e;
  }

  .iconweixin {
    color: #36cb59;
  }

  .iconalipay {
    color: #01aaef;
  }

  .iconqq {
    color: #13c6fe;
  }

  .iconbaidu {
    color: #306cff;
  }

  .icontoutiao {
    color: #f85959;
  }

  .tit {
    font-size: $font-lg;
    color: $font-color-dark;
    margin-bottom: 4rpx;
  }

  .item {
    display: flex;
    flex-direction: column;
    font-size: $font-sm;
    color: $font-color-light;
  }
}
</style>
