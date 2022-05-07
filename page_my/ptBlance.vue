<template>
	<view class="page-wrap">
		<view class="synchro-wrap">
			<view class="synchro-card">
				<view class="synchro-nav-wrap">
					<view class="synchro-nav-item">
						<text>转化</text>
					</view>
				</view>

				<view class="synchro-body">
					<view class="padding-y" style="padding-bottom: 30rpx;">
						<view class="input-wrap">
							<view class="input-item">
								<view class="input-label" style="font-size: 36rpx;">
									<text>转化金额</text>
								</view>
								<view class="input-box flex-center-y">
									<view @click="blance_index=index" class="blance-value-item" :class="{'actived': (index==blance_index)}"
										v-for="(item, index) in blance_list" :key="index">
										<text>{{item}}</text>
									</view>
								</view>
								<!-- <view class="input-value">
									
								</view> -->
								<!-- <input v-model="searchParam.username" class="input-value" type="text"
									placeholder="请输入趣味拼账号" /> -->
							</view>
						</view>
						<!-- <view class="page-tips-wrap app-primary-color">
							<text>成为会员后才能绑定趣味拼账号</text>
						</view> -->

					</view>
				</view>

				<view class="page-btn-wrap" style="margin-top: 30rpx; width: 100%;">
					<view @click="exchangeptBlance" class="page-btn">
						<text>提交</text>
					</view>
				</view>

			</view>
		</view>
	</view>
</template>

<script>
	import {
		getptInfoApi,
		bindptApi,
		exchangeptBlanceApi
	} from '@/api/seckillApi.js';

	const defaultParam = {
		username: '',
		password: ''
	};
	export default {
		data() {
			return {
				userInfo: {},
				searchParam: Object.assign({}, defaultParam),
				result: {},
				blance_index: 0,
				blance_list: [500, 1000]
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
			init() {},
			async exchangeptBlance() {
				let res = await exchangeptBlanceApi({
					withdraw_money: this.blance_list[this.blance_index]
				});
				this.$util.showToast({
					title: '转化成功'
				});
				let pages = getCurrentPages();
				let backPage = pages[pages.length - 2];
				backPage.getptInfo()
				uni.navigateBack({})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.blance-value-item {
		@extend %flex-center;
		width: 180rpx;
		height: 72rpx;
		border: 1rpx solid $gray-color;
		border-radius: 60rpx;
		color: #333333;
		margin-right: 20rpx;
		font-size: $font-30;

		&.actived {
			color: $app-primary-color;
			border: 1rpx solid $app-primary-color;
		}
	}

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
