<template>
  <view class="page-wrap">
    <view class="content">
      <view class="n-tabs-wrapper">
        <!-- <view class="n-tabs-tab-wrapper" @click="switchTab(0)">
          <span v-bind:class="{ 'n-tabs-tab--active': !cashType }"
            >余额提现</span
          ></view
        > -->
        <view class="n-tabs-tab-wrapper" @click="switchTab(1)"
          ><span v-bind:class="{ 'n-tabs-tab--active': cashType }"
            >积分提现</span
          ></view
        >
        <view class="n-tabs-bar" v-bind:style="[tabBarSide]"></view>
      </view>
      <view class="row"
        >{{
          cashType
            ? "当前积分 " + Number(userInfo.point)
            : "当前余额 ￥" + userInfo.balance_money
        }}
        <view
          style="font-size: 30rpx; margin-top: 20rpx; color: #45d4ff"
          @click="toTxBill"
        >
          提现明细</view
        >
      </view>
      <view class="cash-select">
        <view class="cs-title">提现方式</view>
        <view
          @click="selectType(0)"
          class="cs-li"
          v-bind:class="{ 'cs-li-select': type == 0 }"
        >
          支付宝
        </view>
        <view
          @click="selectType(2)"
          class="cs-li"
          v-bind:class="{ 'cs-li-select': type == 2 }"
        >
          微信
        </view>
        <view
          @click="selectType(1)"
          class="cs-li"
          v-bind:class="{ 'cs-li-select': type == 1 }"
        >
          银行卡
        </view>
      </view>
      <view class="from-box">
        <view class="field-row">
          <view class="field-label">提现金额</view>
          <input
            class="uni-input"
            type="digit"
            v-model="money"
            @input="inputChange"
            @blur="calculateRate()"
            placeholder="请输入提现金额"
          />
        </view>

        <view class="field-row">
          <view class="field-label">{{ nickname }}</view>
          <input
            class="uni-input"
            type="text"
            v-model="name"
            placeholder="请输入你的姓名"
          />
        </view>

        <view class="field-row" v-if="account == 1">
          <view class="field-label">{{ updateAccount }}</view>
          <input
            class="uni-input"
            type="text"
            v-model="cord"
            placeholder="请输入提现账号"
          />
        </view>

        <view class="field-row" v-else-if="account == 0">
          <view class="field-label">{{ updateAccount }}</view>
          <input
            v-if="type == 1"
            v-model="cardNumber"
            class="uni-input"
            type="number"
            placeholder="请输入银行卡账号"
          />
          <input
            v-if="type == 0"
            v-model="ailPayNumber"
            class="uni-input"
            type="text"
            placeholder="请输入支付宝账号"
          />
          <input
            v-if="type == 2"
            v-model="wechatNumber"
            class="uni-input"
            type="text"
            placeholder="请输入微信账号"
          />
        </view>

        <view class="field-row" v-if="type == 1">
          <view class="field-label">银行开户地址</view>
          <input
            v-if="type == 1"
            v-model="bankAddress"
            class="uni-input"
            type="text"
            placeholder="请输入银行卡开户地址"
          />
        </view>

        <!-- <view class="from-tip">备注：余额/积分满200可提现</view>
				<button class="from-tip" style="width: 280rpx;background-color: #007AFF;color: #FFFFFF;"
					@click="updateBankAccount" v-if="AmendSwitch == 0">修改{{updateAccount}}</button>
				<button class="from-tip" style="width: 280rpx;background-color: #007AFF;color: #FFFFFF;"
					@click="updateBankAccount" v-if="AmendSwitch == 1">关闭修改{{updateAccount}}</button>
				<view class="field-row" v-if="AmendSwitch == 1">
					<view class="field-label">手机号</view>
					<input class="uni-input" type="text" v-model="phone" disabled="true" />
				</view>
				<view class="field-row" v-if="AmendSwitch == 1">
					<view class="field-label">验证码</view>
					<view class="mian-li pdr200" v-show="true">
						<input class="uni-input" aut type="text" v-model="code" placeholder="请输入验证码" />
						<button class="li-bt" @click="getSmsCode">{{send?'发送验证码':second+'s重新发送'}}</button>
					</view>
				</view>
				<view class="field-row" v-if="AmendSwitch == 1">
					<view class="field-label">新提现账号</view>
					<input class="uni-input" type="text" v-model="newAccountCode" placeholder="请输入提现帐号" />
				</view> -->

        <view class="field-content">
          <!-- <view class="field-c-row">手续费比例：{{poundageRate *100}}%</view> -->
          <view class="field-c-row"
            >手续费比例：{{ cashType ? proportionIntegral : poundageRate }}%
            {{ serveCharge }}
            <text v-if="cashType == 1 && proportionIntegral_fixed != 0"
              >+{{ proportionIntegral_fixed }}/单笔</text
            >
            <text v-if="cashType == 0 && poundageRate_fixed != 0"
              >+{{ poundageRate_fixed }}/单笔</text
            >
          </view>
          <view class="field-c-row">手续费：{{ poundage }}</view>
          <view class="field-c-row">实际到账金额：{{ arrivalPoint }}</view>
        </view>
      </view>
    </view>

    <view v-if="flag == 0">
      <button class="uni-bt2" size="default" type="default" @click="submit">
        提交
      </button>
    </view>
    <view v-else-if="flag == 1">
      <button
        class="uni-bt2"
        size="default"
        type="default"
        style="background-color: #a5a4a4"
      >
        提交
      </button>
    </view>
  </view>
</template>

<script>
// import movie from '../../common/http/interface-movie.js'
import { withdrawApi, withdrawConfigApi } from "@/api/tuanApi.js";

const defaultParam = {
  type: 2, // 1:积分,2:保证金
  withdraw_price: 0,
  withdraw_type: "alipay", //提现方式：bank；alipay；wx;
  real_name: "",
  bank_code: "",
  bank_address: "",
  alipay_code: "",
  wechat: "",
};

export default {
  data() {
    return {
      param: {
        type: 2, // 1:积分,2:保证金
        withdraw_price: 0,
        withdraw_type: "alipay", //提现方式：bank；alipay；wx;
        real_name: "",
        bank_code: "",
        bank_address: "",
        alipay_code: "",
        wechat: "",
      },
      userInfo: {},
      balance: 0, //余额
      grade: 0, //积分
      loading: false,
      money: "",
      name: "",
      cord: "",
      type: 1, //提现方式 0支付宝，1 银行卡 2.微信
      cashType: 1, //提现类型 0余额，1积分
      tabBarSide: "",
      poundageRate: 0, //手续费余额比例 5%
      proportionIntegral: 0, //积分比例
      poundageRate_fixed: 0, // 余额单笔手续费
      proportionIntegral_fixed: 0, // 积分单笔手续费
      poundage: 0, //手续费
      arrivalPoint: 0, //实际到账金额
      userId: "", //当前账号UID
      serveCharge: "",
      flag: "0", // 0开放提现  1关闭提现
      account: 0,
      token: "",
      cardNumber: "", //银行卡号
      ailPayNumber: "", //支付宝账号
      wechatNumber: "", //微信账号
      AmendSwitch: 0, //0关闭 1开启
      phone: "", //手机号
      newAccountCode: "", // 新提现账号
      code: "", //验证码
      s: 60, //默认倒计时
      second: 0,
      send: true, //按钮可以点击
      isAil: false,
      iska: true,
      nickname: "开户姓名",
      updateAccount: "银行卡号",
      bankAddress: "",
      timeShow: true,
    };
  },
  onLoad(option) {
    if (option.type) {
      this.switchTab(option.type);
    }
    this.init();
    // this.getPoundageRate();
  },
  methods: {
    init() {
      this.userInfo = uni.getStorageSync("userInfo");
    },
    selectType(type) {
      this.type = type;
      if (type == 0) {
        this.nickname = "提现姓名";
        this.updateAccount = "支付宝账号";
      } else if (type == 1) {
        this.nickname = "开户姓名";
        this.updateAccount = "银行卡号";
      } else if (type == 2) {
        this.nickname = "提现姓名";
        this.updateAccount = "微信账号";
      }
    },
    switchTab(type) {
      this.cashType = type;
      this.account = 0;
      if (type == 0) {
        this.nickname = "开户姓名";
        this.updateAccount = "银行卡号";
        this.type = 1;
        this.isAil = false;
        this.iska = true;
        this.ailPayNumber = "";
        this.cardNumber = "";
      } else {
        this.nickname = "提现姓名";
        this.updateAccount = "支付宝账号";
        this.type = 0;
        this.isAil = true;
        this.iska = false;
        this.ailPayNumber = "";
        this.cardNumber = "";
      }
      //   this.tabBarSide = type
      //     ? {
      //         transform: "translateX(100%)",
      //       }
      //     : {
      //         transform: "translateX(0%)",
      //       };

      this.poundage = 0;
      this.arrivalPoint = 0;
      this.money = "";
      //如果是取余额则加服务费
      if (type == 0) {
        this.getServeCharge();
      } else {
        this.serveCharge = "";
      }
    },
    checkMoney(e) {
      const detail = e.detail;
    },
    checkName(e) {},
    //限制输入金额不能超过俩个小数点
    inputChange(value) {
      if (this.cashType == 1) {
        // 0 余额 1 积分
        if (value) {
          value.target.value =
            value.target.value.match(/^\d*(\.?\d{0,2})/g)[0] || null;
          this.$nextTick(() => {
            this.money = value.target.value;
            this.poundage = this.money * (this.proportionIntegral / 100);
            this.poundage =
              this.poundage + parseFloat(this.proportionIntegral_fixed);
            this.poundage = Number(this.poundage).toFixed(2);
            this.arrivalPoint = this.money - this.poundage;
            this.arrivalPoint = Number(this.arrivalPoint).toFixed(2);
          });
        }
      } else {
        if (value) {
          value.target.value =
            value.target.value.match(/^\d*(\.?\d{0,0})/g)[0] || null;
          this.$nextTick(() => {
            this.money = value.target.value;
            this.poundage = this.money * (this.poundageRate / 100);
            this.poundage = this.poundage + parseFloat(this.poundageRate_fixed);
            this.poundage = Number(this.poundage).toFixed(2);
            this.arrivalPoint = this.money - this.poundage;
            this.arrivalPoint = Number(this.arrivalPoint).toFixed(2);
          });
        }
      }
    },
    // 取用户信息
    getUserInfo() {},

    //获取手续费比例 手续费
    async getPoundageRate() {
      let res = await withdrawConfigApi();
      let data = res.data.data;
      this.poundageRate = data[1].withdraw_rate;
      this.proportionIntegral = data[0].withdraw_rate;
      this.poundageRate_fixed = data[1].withdraw_fixed;
      this.proportionIntegral_fixed = data[0].withdraw_fixed;
    },
    //获取服务费
    getServeCharge() {},
    //获取积分比例
    getProportionIntegral() {},
    //获取 积分
    getUserCommission() {},
    //获取余额
    getUserBalance() {},
    //计算 出 实际到账金额 和手续费
    calculateRate() {},

    // 早上9点 - 晚上9点开放提现
    openDate() {},

    // 跳转提现明细
    toTxBill() {
      uni.navigateTo({
        url: "/page_my/txDetail",
      });
    },

    // 修改提现账号
    updateBankAccount() {},

    // 获取验证码
    getSmsCode() {},
    // 倒计时
    time() {},

    submit() {
      let time;
      if (this.timeShow) {
        this.timeShow = false;
        this.submitForm();
        time = setTimeout(() => {
          this.timeShow = true;
        }, 5000);
      } else {
        this.$util.showToast({
          title: "提现太过频繁，五秒后再次尝试",
        });
      }
    },

    async submitForm() {
      let cashType = 2;

      //   if (this.cashType == 1) {
      //     cashType = 1;
      //     if (this.money < 200 && this.money > 5000) {
      //       this.$util.showToast({
      //         title: "提现金额最低200 单笔最高5000",
      //       });
      //     }
      //   }

      // type: cashType,

      let data = {
        withdraw_price: this.money,
        real_name: this.name,
      };

      if (this.type == 0) {
        data.withdraw_type = "alipay";
        data.alipay_code = this.ailPayNumber;
      } else if (this.type == 1) {
        data.withdraw_type = "bank";
        data.bank_code = this.cardNumber;
        data.bank_address = this.bankAddress;
      } else if (this.type == 2) {
        data.withdraw_type = "wx";
        data.wechat = this.wechatNumber;
      }

      console.log("提现参数", data);

      let { data: result } = await withdrawApi(data);
      if (result.code !== 200) return;

      //   let tit = res.data.data;
      var that = this;

      this.$util.showToast({
        title: "申请成功！请等待",
        success: function () {
          //TODO
          //   if (cashType == 2) {
          //     that.userInfo.balance_money =
          //       that.userInfo.balance_money - that.money;
          //   } else {
          //   }
          that.userInfo.point = that.userInfo.point - that.money;
          uni.setStorageSync("userInfo", that.userInfo);
          setTimeout(function () {
            uni.navigateBack({});
          }, 2000);
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
page {
  background: #f9f9f9;
}

.page-wrap {
  padding-top: 10rpx;
}

.content {
  background: #ffffff;
  margin: 20rpx;
  border-radius: 20rpx;
  padding: 30rpx 0;
}

.n-tabs-wrapper {
  margin: 30rpx 40rpx;
  overflow: hidden;
  height: 100rpx;
  border-bottom: 1px solid #e7e7e7;
  position: relative;
}

.n-tabs-tab-wrapper {
  width: 100%;
  float: left;
  height: 99rpx;
  line-height: 99rpx;
  text-align: center;
  font-size: 38rpx;
  color: #333333;
}

.n-tabs-tab--active {
  color: $app-primary-color;
}

.n-tabs-bar {
  position: absolute;
  bottom: 0;
  height: 1px;
  border-bottom: 1px solid $app-primary-color;
  left: 0px;
  //   max-width: 50%;
  width: 100%;
  transition-property: all;
  transition-duration: 0.5s;
}

.uni-bt1 {
  margin: 30rpx 40rpx;
  background: $app-primary-color;
  color: #ffffff;
}

.uni-bt2 {
  margin: 30rpx 40rpx;
  background: $app-primary-color;
  color: #ffffff;
}

.row {
  margin: 60rpx 40rpx 20rpx;
  text-align: center;
  font-size: 40rpx;
  color: #333333;
}

.from-box {
  margin: 10rpx 40rpx 20rpx;
  overflow: hidden;
}

.field-row {
  overflow: hidden;
}

.field-label {
  height: 80rpx;
  line-height: 80rpx;
  font-size: 32rpx;
  color: #333333;
}

.uni-input {
  height: 70rpx;
  width: 100%;
  border: 0;
  border-bottom: 1px solid #e7e7e7;
  line-height: 70rpx;
}

.from-tip {
  margin: 10rpx 0;
  font-size: 28rpx;
  color: #ff0000;
}

.field-content {
  overflow: hidden;
}

.field-c-row {
  height: 80rpx;
  line-height: 80rpx;
  font-size: 32rpx;
  border-bottom: 1px dashed #e7e7e7;
}

.cash-select {
  margin: 20rpx 20rpx 40rpx;
  overflow: hidden;
  padding: 0 20rpx;
  background: #ffffff;
  border-radius: 20rpx;
}

.cs-title {
  height: 80rpx;
  line-height: 80rpx;
  font-size: 34rpx;
  color: #333333;
  font-weight: bold;
}

.cs-li {
  min-height: 80rpx;
  line-height: 80rpx;
  color: #666666;
  font-size: 30rpx;
  position: relative;
  border-bottom: 1px solid #e7e7e7;

  &:last-child {
    border: none;
  }
}

.cs-li::after {
  content: "";
  position: absolute;
  width: 10rpx;
  height: 10rpx;
  background: #ffffff;
  border: 15rpx solid #e7e7e7;
  border-radius: 50%;
  top: 20rpx;
  right: 10rpx;
}

.cs-li-select::after {
  background: #ffffff !important;
  border: 15rpx solid #0abf1f !important;
}

.mian-li {
  position: relative;
  height: 80rpx;
  margin-bottom: 20rpx;
}

button.li-bt {
  position: absolute;
  right: 0;
  top: 10rpx;
  color: #ffffff;
  width: 200rpx;
  border: 0;
  border-radius: 10rpx;
  height: 70rpx;
  line-height: 70rpx;
  background-color: $app-primary-color;
  font-size: 28rpx;
}
</style>
