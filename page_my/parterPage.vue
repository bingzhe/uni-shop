<template>
	<view class="page-wrap">
		<view class="my-wrap">
			<view class="user-info">
				<view class="user-info-body">
					<view class="user-info-blance">
						<view class="user-info-blance-label">分红积分</view>
						<view class="user-info-blance-value">{{userInfo.partner_money || '0.00'}}</view>
						<view style="margin-top: 20rpx;" @click="toPoint">积分明细</view>
					</view>
				</view>
					<view @click="toTx" class="page-btn-wrap">
						<view class="page-btn" style="margin-top: 190rpx;">
							<text>我要提现</text>
						</view>
					</view>
			</view>
			<view class="ruler">
				规则：
				<ul>
					<li>1、直推人数满{{this.config.first_num}}人</li>
					<li>2、支付{{this.config.price}}元方可成为合伙人</li>
					<li>3、平台每成功开一个团，拿出部分收益金额均分给市场合伙人</li>
					<li>4、市场合伙人上限1000人</li>
					<li>5、每周一进行提现，每个团进行分红</li>
					<li>6、提现手续费为5%</li>
				</ul>
			</view>
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
		getParterConfig
	} from '@/api/tuanApi.js'
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
				config:{}
			}
		},

		onLoad(option) {
			if(option.token) {
				uni.setStorageSync('token', option.token)
			}
			// this.init();
			this.GetInfo();
			this.getConfig();

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
			// 获取成为合伙人配置
			async getConfig(){
				let res =  await getParterConfig();
				
				this.config=res.data.data;
				console.log(this.config);
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
				this.$util.redirectTo('/pages/my/txPoint', {
					type: 3
				});
			},
			toPoint(){
				if (!this.$util.checkLogin()) {
					this.$util.redirectTo('/pages/login/login', undefined);
					return;
				}
				this.$util.redirectTo('/page_my/parterPoint', {
					type: 3
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	// @import '@/pages/my/css/my.scss';
	.ruler{
		margin-left: 20rpx;
		color: gray;
		margin-top: 300rpx;
		font-size: 27rpx;
		 li{
			list-style: none;
		}
	}
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
			height: 280rpx;
			background-color: $app-primary-color;
			// margin-top: 0rpx;
			
			.user-info-blance {
				text-align: center;
				.user-info-blance-label {
					font-size: $font-24;
					padding-top:20px;
					line-height: 50px;
				}

				.user-info-blance-value {
					line-height: 50rpx;
					font-size: 68rpx;
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
