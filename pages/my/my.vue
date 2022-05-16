<template>
	<view class="page-wrap">
		<view class="my-wrap padding-y">
			<!-- <view class="status-bar"></view> -->
			<view class="user-info">
				
				<view class="user-info-header flex-center-y">
					<view class="user-avatar-wrap">
						<image v-if="!userInfo.avatar" class="user-avatar" src="/static/imgs/logo.png"
							mode="aspectFill"></image>
						<image v-else class="user-avatar" :src="portraitImg" mode="aspectFill"></image>
					</view>
					<view class="user-text">
						<view class="user-name" style="display: flex;align-items: center;">
							<text>{{userInfo.username}}</text>
							<view v-if="userInfo.username && isMember" class="vip">会员</view>
							<text @click="logout()" v-if="!userInfo.username">请登录</text>
						</view>
					</view>
				</view>
				
				<view class="user-info-body">
					<view class="user-info-blance">
						<view class="user-info-blance-label">账户余额</view>
						<view class="user-info-blance-value">{{userInfo.balance_money || '0.00'}}</view>
					</view>
					<view class="user-info-treasure">
						<view class="user-blance" @click="detail(2)">
							<text>
								余额
							</text>
							<text>
								{{userInfo.balance_money || '0.00'}}
							</text>
						</view>
						<view class="user-integral" @click="detail(1)">
							<text>
								积分
							</text>
							<text>
								{{userInfo.point || '0.00'}}
							</text>
						</view>
					</view>
				</view>
				<view class="user-info-bottom">
					<view @click="toCz" class="user-treasure has-active">
						<text>充值</text>
					</view>
					<view @click="toTx" class="user-treasure has-active">
						<text>提现</text>
					</view>
				</view>
			</view>
			
			<view v-for="(sub_arr,indexz) in control_list" :key="indexz">
				<view class="control-list ">
					<!-- @click="controlClick(item, index)" -->
					<view @click="controlClick(item, index)"
						class="control-item padding-y has-arrow has-active" v-for="(item, index) in sub_arr"
						:key="index">
						<view class="main flex-center-y">
							<image class="control-icon" :src="item.src" mode="aspectFit"></image>
							<view>{{item.text}}</view>
						</view>
						<view class="other_text other" v-if="item.other_text">
							{{item.other_text}}
						</view>
					</view>
				</view>
			</view>
		</view>
		<view v-if="$util.checkLogin()" class="page-btn-wrap">
			<view class="page-btn" @click="logoutClick">
				<text>退出登录</text>
			</view>
		</view>
		
	</view>
</template>

<script>
	import {
		mapActions,
		mapMutations
	} from 'vuex';
	import config from '@/common/config.js'
	import {
		userInfoApi,
	} from '@/api/userApi.js'

	// import {
	// 	myHarvestApi,
	// } from '@/api/seckillApi.js';

	export default {
		data() {
			return {
				userInfo: {},
				isMember: false,
				portraitImg: '',
				control_list: [
					[
						{
							src: '/static/imgs/my/control-icon1.png',
							text: '我参与的',
							link: '/page_my/myInvolved',
							check_login: true
						},
						{
							src: '/static/imgs/my/control-icon3.png',
							text: '我的订单',
							link: '/page_my/myOrder',
							other_text: '',
							check_login: true
						},
						{
							src: '/static/imgs/my/control-icon4.png',
							text: '基本信息',
							link: '/page_my/myInformation',
							check_login: true
						},
						{
							src: '/static/imgs/my/control-icon8.png',
							text: '我的地址',
							link: '/page_my/myAddress',
							check_login: true
						},
						{
							src: '/static/imgs/my/control-icon2.png',
							text: '推广中心',
							link: '/page_my/myPromote',
							check_login: true
						},
						{
							src: '/static/imgs/my/control-icon9.png',
							text: '盲盒抽奖',
							link: '/page_my/blindBox',
							check_login: true
						}
					],
				],
			}
		},

		onLoad(option) {
			if(option.token) {
				uni.setStorageSync('token', option.token)
			}
			// this.init();
			this.GetInfo();

		},
		onShow() {
			this.init();
		},
		// 下拉加载
		onPullDownRefresh() {
			this.GetInfo();
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		methods: {
			...mapActions(['GetInfo', 'Logout']),
			async init() {
				let res = await userInfoApi()
				let result = res.data.data

				uni.setStorageSync('userInfo', result)
				this.portraitImg = config.imgUrl + uni.getStorageSync('userInfo').avatar
				this.userInfo = uni.getStorageSync('userInfo')
				this.isMember = this.$util.checkMember();
				if (this.isMember) {
					this.control_list[1][1].text = '会员中心'
				}
				if (this.userInfo.username) {
					this.getDefaultAddress()
				}
			},
			async getDefaultAddress() {
				// let res = await myHarvestApi({
				// 	status: 0
				// });
				// this.control_list[0][1].other_text = res.data.data.length
			},
			logout() {
				uni.clearStorageSync();
				this.$util.redirectTo('/pages/login/login', undefined, 'reLaunch');
			},
			logoutClick() {
				uni.showModal({
					title: '确定退出登录?',
					success: (res) => {
						if (res.confirm) {
							this.logout();
							return
						}
						if (res.cancel) {
							return
						}
					}
				})
			},
			controlClick(item, index) {
				if (item.check_login) {
					if (!this.$util.checkLogin()) {
						this.$util.redirectTo('/pages/login/login', undefined, 'reLaunch');
						return;
					}
				}
				if (item.link) {
					this.$util.redirectTo(item.link);
				} else {
					this.$util.showToast({
						title: `${item.text}正在开发中...`
					})
				}
			},
			// 去充值
			toCz() {
				if (!this.$util.checkLogin()) {
					this.$util.redirectTo('/pages/login/login', undefined);
					return;
				}
				this.$util.redirectTo('/pages/my/cz');
			},
			toTx() {
				if (!this.$util.checkLogin()) {
					this.$util.redirectTo('/pages/login/login', undefined);
					return;
				}
				this.$util.redirectTo('/pages/my/tx', {
					type: 1
				});
			},
			// 明细
			detail(e) {
				if (!this.$util.checkLogin()) {
					this.$util.redirectTo('/pages/login/login', undefined);
					return;
				}
				this.$util.redirectTo('/page_my/userBillDetail', {
					type: e
				});
				// if (e == 1) {
				// 	uni.navigateTo({
				// 		url: '/page_my/userBillDetail?type=' + e
				// 	})
				// } else {
				// 	uni.navigateTo({
				// 		url: '/page_my/userBillDetail?type=' + 3
				// 	})
				// }

			}
		}
	}
</script>

<style lang="scss" scoped>
	// @import '@/pages/my/css/my.scss';

	.vip {
		width: 70rpx;
		height: 40rpx;
		margin-left: 10rpx;
		line-height: 35rpx;
		text-align: center;
		border-radius: 20rpx;
		font-size: 18rpx;
		border: 1rpx solid #ffea00;
	}

	.other_text {
		width: 40rpx;
		height: 40rpx;
		line-height: 40rpx;
		text-align: center;
		border-radius: 100%;
		background-color: $red-color;
		margin-right: 30rpx;
		font-size: 26rpx;
		color: #fff;
	}

	.my-wrap {
		padding-top: 30rpx;
	}

	.user-info {
		position: relative;
		height: 360rpx;
		color: $white-color;

		.user-info-header {
			height: 100rpx;
			border-radius: 16rpx 16rpx 0 0;
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
			margin-top: -2rpx;
			
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
			border-radius: 0 0 16rpx 16rpx;

			.user-treasure {
				height: 100%;
				flex: 1;
				@extend %flex-center;
				color: $app-primary-color;
				font-size: $font-32;
			}
		}
	}

	.member-card {
		padding: 20rpx 30rpx;
		border-radius: 60rpx;
		background-color: $member-card-color;
		color: $member-card-text-color;
		>.main {
			font-size: $font-32;
			font-weight: bold;
		}
		>.other {
			font-size: $font-28;
			position: relative;
			margin-right: 20rpx;
			&::after {
				position: absolute;
				right: -20rpx;
				content: '';
				width: 16rpx;
				height: 16rpx;
				border-right: 1rpx solid $member-card-text-color;
				border-top: 1rpx solid $member-card-text-color;
				transform: rotate(45deg);
			}
		}
	}

	.control-list {
		margin-top: 30rpx;
		background-color: $white-color;
		border-radius: 16rpx;
		margin-bottom: 30rpx;
		.control-item {
			height: 100rpx;
			overflow: hidden;
			position: relative;
			@extend %flex-center-y;
			justify-content: space-between;
			.control-icon {
				width: 32rpx;
				margin-right: 20rpx;
			}
			&::after {
				position: absolute;
				right: 30rpx;
				content: '';
				width: 16rpx;
				height: 16rpx;
				border-right: 1rpx solid #000000;
				border-top: 1rpx solid #000000;
				transform: rotate(45deg);
			}
		}
	}



	.user-treasure {
		.user-treasure-item {
			flex: 1;
			color: $font-color;
			font-size: $font-26;
			border-right: 1rpx solid $gray-color;
			height: 30rpx;

			.user-treasure-icon {
				height: 36rpx;
				width: 60rpx;
				margin-right: 20rpx;
			}

			.user-treasure-value {
				color: $red-color;
				font-size: $font-36;
			}

			&:last-child {
				border-right: none;
			}
		}
	}
</style>
