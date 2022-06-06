<template>
	<view class="page-wrap">
		<view class="content">
			<view class="row">{{'当前积分 '+ Number(userInfo.partner_money) }}
			<view style="font-size: 30rpx; margin-top: 20rpx; color: #45D4FF;" @click="toTxBill"> 提现明细</view>
			</view>
			<view class="cash-select">
				<view class="cs-title">提现方式</view>
				<view @click="selectType(0)" class="cs-li" v-bind:class="{ 'cs-li-select': !type }">
					支付宝
				</view>
				<view @click="selectType(1)" class="cs-li" v-bind:class="{ 'cs-li-select': type }">
					银行卡
				</view>
			</view>
			<view class="from-box">
				<view class="field-row">
					<view class="field-label">提现金额</view>
					<input class="uni-input" type="digit" v-model="money" @input="inputChange" @blur="calculateRate()"
						placeholder="请输入提现金额" />
				</view>
				<view class="field-row">
					<view class="field-label">{{nickname}}</view>
					<input class="uni-input" type="text" v-model="name" placeholder="请输入你的姓名" />
				</view>
				<view class="field-row" v-if="account == 1">
					<view class="field-label">{{updateAccount}}</view>
					<input class="uni-input" type="text" v-model="cord" placeholder="请输入提现账号" />
				</view>
				<view class="field-row" v-else-if="account == 0">
					<view class="field-label">{{updateAccount}}</view>
					<input v-if="type == 1" v-model="cardNumber" class="uni-input" type="number"
						placeholder="请输入银行卡账号" />
					<input v-if="type == 0" v-model="ailPayNumber" class="uni-input" type="text"
						placeholder="请输入支付宝账号" />
				</view>
				<view class="field-row" v-if="type == 1">
					<view class="field-label">银行开户地址</view>
					<input v-if="type == 1" v-model="bankAddress" class="uni-input" type="text"
						placeholder="请输入银行卡开户地址" />
				</view>
				<view class="field-content">
					<view class="field-c-row">手续费比例：{{cashType?proportionIntegral:poundageRate}}%
						{{serveCharge}}
						<text v-if="cashType==1&&proportionIntegral_fixed!=0">+{{proportionIntegral_fixed}}/单笔</text>
						<text v-if="cashType==0&&poundageRate_fixed!=0">+{{poundageRate_fixed}}/单笔</text>
						<text v-if="cashType==3&&proportionIntegral_fixed!=0">+{{proportionIntegral_fixed}}/单笔</text>
					</view>
					<view class="field-c-row">手续费：{{poundage}}</view>
					<view class="field-c-row">实际到账金额：{{arrivalPoint}}</view>
				</view>
			</view>

		</view>

		<view v-if="flag==0">
			<button class="uni-bt2" size="default" type="default" @click="submit">提交</button>
		</view>
		<view v-else-if="flag==1">
			<button class="uni-bt2" size="default" type="default" style="background-color: #A5A4A4;">提交</button>
		</view>

	</view>

</template>

<script>
	// import movie from '../../common/http/interface-movie.js'
	import {
		withdrawApi,
		withdrawConfigApi
	} from '@/api/tuanApi.js';
	const defaultParam = {
		type: 3, // 1:积分,2:保证金，3.合伙人积分
		withdraw_price: 0,
		withdraw_type: 'alipay', //提现方式：bank；alipay；wx;
		real_name: '',
		bank_code: '',
		bank_address: '',
		alipay_code: '',
		wechat: ''
	}

	export default {
		data() {
			return {
				param: {
					type: 3, // 1:积分,2:保证金，3.合伙人积分
					withdraw_price: 0,
					withdraw_type: 'alipay', //提现方式：bank；alipay；wx;
					real_name: '',
					bank_code: '',
					bank_address: '',
					alipay_code: '',
					wechat: ''
				},
				userInfo: {},
				balance: 0, //余额
				grade: 0, //积分
				loading: false,
				money: '',
				name: '',
				cord: '',
				type: 1, //提现方式 0支付宝，1 微信
				cashType: 3, //提现类型 0余额，1积分 ，3合伙人积分
				tabBarSide: '',
				poundageRate: 0, //手续费余额比例 5%
				proportionIntegral: 0, //积分比例
				poundageRate_fixed: 0, // 余额单笔手续费
				proportionIntegral_fixed: 0, // 积分单笔手续费
				poundage: 0, //手续费
				arrivalPoint: 0, //实际到账金额
				userId: '', //当前账号UID
				serveCharge: '',
				flag: '0', // 0开放提现  1关闭提现
				account: 0,
				token: '',
				cardNumber: '', //银行卡号
				ailPayNumber: '', //支付宝账号
				AmendSwitch: 0, //0关闭 1开启
				phone: '', //手机号
				newAccountCode: '', // 新提现账号
				code: '', //验证码
				s: 60, //默认倒计时
				second: 0,
				send: true, //按钮可以点击
				isAil: false,
				iska: true,
				nickname: '开户姓名',
				updateAccount: '银行卡号',
				bankAddress: '',
				timeShow: true
			}
		},
		onLoad(option) {
			if (option.type) {
				this.switchTab(option.type)
			}
			this.init()
			this.getPoundageRate()
		},
		methods: {
			init() {
				this.userInfo = uni.getStorageSync('userInfo');
			},
			selectType(type) {
				this.type = type;
				if (type == 1) {
					this.nickname = '开户姓名'
					this.updateAccount = '银行卡号'
				} else {
					this.nickname = '提现姓名'
					this.updateAccount = '支付宝账号'
				}
			},
			switchTab(type) {
				this.cashType = 3;
				this.account = 0
				if (type == 0) {
					this.nickname = '开户姓名'
					this.updateAccount = '银行卡号'
					this.type = 1
					this.isAil = false
					this.iska = true
					this.ailPayNumber = ''
					this.cardNumber = ''

				} else {
					this.nickname = '提现姓名'
					this.updateAccount = '支付宝账号'
					this.type = 0
					this.isAil = true
					this.iska = false
					this.ailPayNumber = ''
					this.cardNumber = ''

				}
				this.tabBarSide = type ? {
					transform: 'translateX(100%)'
				} : {
					transform: 'translateX(0%)'
				};
				this.poundage = 0;
				this.arrivalPoint = 0;
				this.money = '';
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
			checkName(e) {

			},
			//限制输入金额不能超过俩个小数点
			inputChange(value) {
				if (this.cashType == 1) { // 0 余额 1 积分
					if (value) {
						value.target.value = (value.target.value.match(/^\d*(\.?\d{0,2})/g)[0]) || null
						this.$nextTick(() => {
							this.money = value.target.value
							this.poundage = this.money * (this.proportionIntegral / 100)
							this.poundage = this.poundage+parseFloat(this.proportionIntegral_fixed)
							this.poundage = Number(this.poundage).toFixed(2)
							this.arrivalPoint = this.money - this.poundage
							this.arrivalPoint = Number(this.arrivalPoint).toFixed(2)
						})
					}
				} else if(this.cashType == 0){
					if (value) {
						value.target.value = (value.target.value.match(/^\d*(\.?\d{0,0})/g)[0]) || null
						this.$nextTick(() => {
							this.money = value.target.value
							this.poundage = this.money * (this.poundageRate / 100)
							this.poundage = this.poundage+parseFloat(this.poundageRate_fixed)
							this.poundage = Number(this.poundage).toFixed(2)
							this.arrivalPoint = this.money - this.poundage
							this.arrivalPoint = Number(this.arrivalPoint).toFixed(2)
						})
					}
				}else{
					if (value) {
						value.target.value = (value.target.value.match(/^\d*(\.?\d{0,2})/g)[0]) || null
						this.$nextTick(() => {
							this.money = value.target.value
							this.poundage = this.money * (this.proportionIntegral / 100)
							this.poundage = this.poundage+parseFloat(this.proportionIntegral_fixed)
							this.poundage = Number(this.poundage).toFixed(2)
							this.arrivalPoint = this.money - this.poundage
							this.arrivalPoint = Number(this.arrivalPoint).toFixed(2)
						})
					}
				}
			},
			// 取用户信息
			getUserInfo() {},

			//获取手续费比例 手续费
			async getPoundageRate() {
				let res = await withdrawConfigApi();
				let data = res.data.data
				this.poundageRate = data[1].withdraw_rate
				this.proportionIntegral = data[0].withdraw_rate
				this.poundageRate_fixed = data[1].withdraw_fixed
				this.proportionIntegral_fixed = data[0].withdraw_fixed
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
					url: '/page_my/txDetailParter'
				})
			},

			// 修改提现账号
			updateBankAccount() {},

			// 获取验证码
			getSmsCode() {},
			// 倒计时
			time() {},

			submit() {
				let time
				if (this.timeShow) {
					this.timeShow = false
					this.submitForm()
					time = setTimeout(() => {
						this.timeShow = true
					}, 5000)
				} else {
					this.$util.showToast({
						title: '提现太过频繁，五秒后再次尝试'
					})
				}

			},

			async submitForm() {
				let cashType = 3
				if (this.cashType == 1) {
					cashType = 1
					if (this.money < 200 && this.money > 5000) {
						this.$util.showToast({
							title: '提现金额最低200 单笔最高5000'
						})
					}
				}
				let data = {
					type: cashType,
					withdraw_price: this.money,
					withdraw_type: this.type ? 'bank' : 'alipay',
					real_name: this.name,
					bank_code: this.cardNumber,
					bank_address: this.bankAddress,
					alipay_code: this.ailPayNumber
				}
				let res = await withdrawApi(data);
				let tit = res.data.data
				var that = this
				this.$util.showToast({
					title: '申请成功！请等待',
					success: function(){
						if (cashType == 2) {
							that.userInfo.balance_money = that.userInfo.balance_money - that.money
						} else if(cashType == 1) {
							that.userInfo.point = that.userInfo.point - that.money
						}else{
							that.userInfo.partner_money = that.userInfo.partner_money - that.money
						}
						uni.setStorageSync('userInfo', that.userInfo)
						setTimeout(function(){
							uni.navigateBack({})
						},2000)
					}
				})

				
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background: #F9F9F9;
	}

	.page-wrap {
		padding-top: 10rpx;
	}

	.content {
		background: #FFFFFF;
		margin: 20rpx;
		border-radius: 20rpx;
		padding: 30rpx 0;
	}

	.n-tabs-wrapper {
		margin: 30rpx 40rpx;
		overflow: hidden;
		height: 100rpx;
		border-bottom: 1px solid #E7E7E7;
		position: relative;
	}

	.n-tabs-tab-wrapper {
		width: 50%;
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
		max-width: 50%;
		width: 60%;
		transition-property: all;
		transition-duration: 0.5s;
	}

	.uni-bt1 {
		margin: 30rpx 40rpx;
		background: $app-primary-color;
		color: #FFFFFF;
	}

	.uni-bt2 {
		margin: 30rpx 40rpx;
		background: $app-primary-color;
		color: #FFFFFF;
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
		border-bottom: 1px solid #E7E7E7;
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
		border-bottom: 1px dashed #E7E7E7;
	}

	.cash-select {
		margin: 20rpx 20rpx 40rpx;
		overflow: hidden;
		padding: 0 20rpx;
		background: #FFFFFF;
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
		border-bottom: 1px solid #E7E7E7;

		&:last-child {
			border: none;
		}
	}

	.cs-li::after {
		content: '';
		position: absolute;
		width: 10rpx;
		height: 10rpx;
		background: #FFFFFF;
		border: 15rpx solid #E7E7E7;
		border-radius: 50%;
		top: 20rpx;
		right: 10rpx;
	}

	.cs-li-select::after {
		background: #FFFFFF !important;
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
		color: #FFFFFF;
		width: 200rpx;
		border: 0;
		border-radius: 10rpx;
		height: 70rpx;
		line-height: 70rpx;
		background-color: $app-primary-color;
		font-size: 28rpx;
	}
</style>
