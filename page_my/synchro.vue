<template>
	<view class="page-wrap">
		<view class="synchro-wrap">
			<view class="synchro-card">
				<view class="synchro-nav-wrap">
					<view v-if="nav_index==0" @click="nav_index=0" class="synchro-nav-item"
						:class="{'actived': (nav_index == 0)}">
						<text>账号绑定</text>
					</view>
					<view v-if="nav_index==1" @click="nav_index=1" class="synchro-nav-item"
						:class="{'actived': (nav_index == 1)}">
						<text>余额转换</text>
					</view>
				</view>

				<view class="synchro-body">
					<view v-if="nav_index == 0" class="padding-y" style="padding-bottom: 30rpx;">
						<view class="input-wrap">

							<view class="input-item">
								<view class="input-label">
									<text>趣味拼账号</text>
								</view>
								<input v-model="searchParam.username" class="input-value" type="text"
									placeholder="请输入趣味拼账号" />
							</view>

							<view class="input-item">
								<view class="input-label">
									<text>趣味拼密码</text>
								</view>
								<input v-model="searchParam.password" class="input-value" type="password"
									placeholder="请输入趣味拼密码" />
							</view>
						</view>
						<view class="page-btn-wrap" style="margin-top: 30rpx; width: 100%;">
							<view @click="bindpt" class="page-btn">
								<text>提交</text>
							</view>
						</view>
						<view class="page-tips-wrap app-primary-color">
							<text>成为会员后才能绑定趣味拼账号</text>
						</view>

					</view>
					<view v-if="nav_index == 1" style="padding-top: 40rpx;">
						<view class="user-info">
							<view class="user-info-header flex-title">
								<view class="user-text">
									<view class="user-name">
										<text>趣味拼账号</text>
									</view>
								</view>
								<view class="user-name">
									<text>{{result.pt_username}}</text>
								</view>
							</view>
							<view class="user-info-body">
								<view class="user-info-blance">
									<view class="user-info-blance-label">趣味拼余额</view>
									<view class="user-info-blance-value">{{result.balance_money}}</view>
								</view>
								<view class="user-info-treasure">
									<view class="user-blance">
									</view>
									<view class="user-integral">
									</view>
								</view>
							</view>
							<view class="user-info-bottom">
								<view @click="$util.redirectTo('/page_my/detail?type=3')"
									class="user-treasure has-active">
									<text>明细</text>
								</view>
								<view @click="$util.redirectTo('/page_my/ptBlance')" class="user-treasure has-active">
									<text>转换</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>

		</view>
	</view>
	</view>
</template>

<script>
	import {
		getptInfoApi,
		bindptApi
	} from '@/api/seckillApi.js';

	const defaultParam = {
		username: '',
		password: ''
	};
	export default {
		data() {
			return {
				userInfo: {},
				nav_index: 0,
				searchParam: Object.assign({}, defaultParam),
				result: {}
			}
		},
		// 下拉加载
		onPullDownRefresh() {
			this.init();
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		onLoad() {
			this.init();
		},
		methods: {
			init() {
				this.userInfo = uni.getStorageSync('userInfo');
				if (this.userInfo.pt_member_id) {
					this.nav_index = 1;
					this.getptInfo();
				}
			},
			async bindpt() {
				let res = await bindptApi(this.searchParam);
			},
			async getptInfo() {
				let res = await getptInfoApi();
				this.result = res.data.data;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.synchro-wrap {
		padding-top: 30rpx;
	}

	.synchro-card {
		width: 690rpx;
		margin: 0 auto 0;
		min-height: 600rpx;
		border-radius: 8rpx;

		.synchro-nav-wrap {
			border-radius: 8rpx 8rpx 0 0;
			@extend %flex-center;
			background-color: #f3f3f3;
			color: #555555;
			height: 100rpx;

			.synchro-nav-item {
				@extend %flex-center;
				flex: 1;

				&.actived {
					height: 100%;
					border-radius: 8rpx 8rpx 0 0;
					background-color: $white-color;
					position: relative;

					&::after {
						content: "";
						position: absolute;
						bottom: 0rpx;
						width: 100rpx;
						height: 4rpx;
						background-color: $app-primary-color;
					}
				}
			}
		}

		.synchro-body {
			// padding-top: 40rpx;
			background-color: $white-color;
			border-radius: 0 0 8rpx 8rpx;
		}
	}

	.user-info {
		position: relative;
		height: 360rpx;
		color: $white-color;

		.user-info-header {
			height: 100rpx;
			border-radius: 8rpx 8rpx 0 0;
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

	.input-wrap {
		.input-item {
			.input-label {
				height: 100rpx;
				line-height: 100rpx;
				font-size: $font-32;
			}

			.input-value {
				font-size: $font-28;
				height: 80rpx;
				line-height: 80rpx;
				border-bottom: 1rpx solid $gray-color;
			}
		}
	}
</style>
