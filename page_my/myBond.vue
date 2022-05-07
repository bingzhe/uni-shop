<template>
	<view class="page-wrap">
		<view class="my-bond-wrap padding-all">

			<view class="user-info">
				<view class="user-info-header flex-center-y">
					<!-- <view class="user-avatar-wrap">
						<image class="user-avatar" src="../../static/imgs/nav-icon3.png" mode="aspectFill"></image>
					</view> -->
					<view class="user-text">
						<view class="user-name">
							<text>保证金</text>
							<!-- <text>{{userInfo.username || '请登录'}}</text> -->
						</view>
					</view>
				</view>
				<view class="user-info-body">
					<view class="user-info-blance">
						<view class="user-info-blance-label">保证金余额</view>
						<view class="user-info-blance-value">{{userInfo.signup_money}}</view>
					</view>
					<view class="user-info-treasure">
						<view class="user-blance">
							<!-- <text>
								余额
							</text>
							<text>
								{{userInfo.balance_money || '0.00'}}
							</text> -->
						</view>
						<view class="user-integral">
							<!-- <text>
								积分
							</text>
							<text>
								{{userInfo.point || '0.00'}}
							</text> -->
						</view>
					</view>

				</view>
				<view class="user-info-bottom">
					<!-- <view class="user-treasure has-active" @click="pay">
						<text>缴纳</text>
					</view> -->
					<view class="user-treasure has-active" @click="detail(2)">
						<text>明细</text>
					</view>
					<view @click="toTx" class="user-treasure has-active">
						<text>提现</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 缴纳保证金弹出层 -->
		<uni-popup ref="popup" type="center">
			<view class="pay_popup">
				<view class="pay_popup_hender">缴纳保证金</view>
				<view class="pay_popup_ct">
					<view class="pay_popup_ct_money">
						保证金
						<text>500</text>
						RMB
					</view>
					<view class="pay_popup_ct_instructions">
						<view style="margin-bottom: 10rpx;">1.系统将在您的账户锁定 ¥500 元</view>
						<view style="margin-bottom: 10rpx;">2.若秒杀成功，保证金冲抵部分贷款</view>
						<view>3.若秒杀不成功，保证金将自动返还</view>
					</view>
					<view class="pay_popup_ct_agreement">
						<checkbox-group @change="agreeProtocol">
							<label>
								<checkbox color="#DC201F" style="transform:scale(0.6)" value="1" />
							</label>
						</checkbox-group>
						<view class="">
							<text>我已阅读并同意</text>
							<text  class="font-color-red">秒杀协议</text>
							<text>并支付保证金，并且理解了</text>
							<text  class="font-color-red">《保证金详细规则》</text>
							<text>，因拍品性质特殊，不支持7天无理由退货，请慎重秒杀</text>
						</view>
					</view>
					<button class="pay_popup_ct_confirm" @click="confirmPay">确认缴纳</button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: null,
				protocolAgree: false,
			}
		},
		onLoad() {
			this.init();
		},
		methods: {
			init() {
				this.userInfo = uni.getStorageSync('userInfo')
			},
			// 缴纳保证金
			pay() {
				this.$refs.popup.open()
			},
			// 确认缴纳保证金
			confirmPay () {
				if (!this.protocolAgree) {
					uni.showToast({
						title: '请阅读并同意缴纳协议！',
						icon: 'none',
						duration: 2000
					})
					return
				}
			},
			// 阅读缴纳协议
			agreeProtocol (e) {
				if (e.detail.value.length > 0) {
					this.protocolAgree = true;
					return
				}
				this.protocolAgree = false;
			},
			// 明细
			detail(e) {
				uni.navigateTo({
					url: '/page_my/detail?type=' + e
				})
			},
			
			toTx() {
				this.$util.redirectTo('/pages/my/tx', {
					type: 0
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.my-bond-wrap {
		padding-top: 30rpx;
	}

	.user-info {
		position: relative;
		height: 360rpx;
		color: $white-color;

		.user-info-header {
			height: 100rpx;
			border-radius: 30rpx 30rpx 0 0;
			padding: 0 30rpx;
			background-color: $app-primary-color;

			.user-avatar-wrap {
				.user-avatar {
					background-color: $user-avatar-color;
					width: 60rpx;
					height: 60rpx;
					border-radius: 50%;
				}
			}

			.user-text {
				margin-left: 20rpx;

				.user-name {
					height: 50rpx;
					line-height: 50rpx;
					font-size: $font-28;
					font-weight: bold;
				}
			}
		}

		.user-info-body {
			width: 100%;
			height: 200rpx;
			background-color: $app-primary-color;

			.user-info-blance {
				text-align: center;

				.user-info-blance-label {
					font-size: $font-24;
				}

				.user-info-blance-value {
					line-height: 90rpx;
					font-size: 48rpx;
					font-weight: bold;
				}
			}

			.user-info-treasure {
				@extend %flex-center-y;

				.user-blance {
					@extend %flex-center;
					font-size: $font-26;
					flex: 1;
				}

				.user-integral {
					@extend %flex-center;
					font-size: $font-26;
					flex: 1;
				}
			}
		}

		.user-info-bottom {
			@extend %flex-center-y;
			position: absolute;
			bottom: 0;
			width: 100%;
			height: 80rpx;
			background-color: $white-color;
			border-radius: 0 0 30rpx 30rpx;

			.user-treasure {
				height: 100%;
				flex: 1;
				@extend %flex-center;
				color: $app-primary-color;
				font-size: $font-32;
			}
		}
	}

	.pay_popup {
		width: 600rpx;
		height: 700rpx;
		background-color: #fff;
		border-radius: 20rpx;

		.pay_popup_hender {
			width: 100%;
			height: 130rpx;
			line-height: 130rpx;
			text-align: center;
			color: #434343;
			border-bottom: 2rpx solid #929292;
			font-size: 36rpx;
		}
		.pay_popup_ct {
			position: relative;
			width: 100%;
			padding: 20rpx 0;
			.pay_popup_ct_money {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 100%;
				text-align: center;
				color: #a8a8a8;
				font-size: 30rpx;
				text {
					margin: 0 60rpx;
					color: #666666;
					font-size: 65rpx;
					font-weight: 700;
				}
			}
			.pay_popup_ct_instructions {
				display: flex;
				flex-direction: column;
				padding-left: 50rpx;
				margin-top: 20rpx;
				color: #7d7d7d;
				font-size: 31rpx;
			}
			.font-color-red {
				color: $red-color;
			}
			.pay_popup_ct_agreement {
				display: flex;
				margin: 20rpx 40rpx 0rpx 40rpx;
				color: #cccccc;
				font-size: 18rpx;
			}
			.pay_popup_ct_confirm {
				width: 80%;
				height: 70rpx;
				margin: auto;
				margin-top: 40rpx;
				font-size: 32rpx;
				color: #fff;
				background-color: $red-color;
				line-height: 70rpx;
			}
		}
	}
</style>
