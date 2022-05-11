<template>
	<view class="page-wrap">
		<view class="bg-wrap">
			<image class="bg-img" src="/static/imgs/blindBg.png" mode="aspectFill"></image>
			<view class="gift-show-wrap">
				<uni-grid :column="5" :showBorder="false">
					<uni-grid-item>
						<view class="gift-img-wrap">
							<image class="gift-img" src="../static/imgs/alipay.png" mode="aspectFit"></image>
						</view>
					</uni-grid-item>
					<uni-grid-item>
						<view class="gift-img-wrap">
							<image class="gift-img" src="../static/imgs/alipay.png" mode="aspectFit"></image>
						</view>
					</uni-grid-item>
					<uni-grid-item>
						<view class="gift-img-wrap">
							<image class="gift-img" src="../static/imgs/alipay.png" mode="aspectFit"></image>
						</view>
					</uni-grid-item>
					<uni-grid-item>
						<view class="gift-img-wrap">
							<image class="gift-img" src="../static/imgs/alipay.png" mode="aspectFit"></image>
						</view>
					</uni-grid-item>
					<uni-grid-item>
						<view class="gift-img-wrap">
							<image class="gift-img" src="../static/imgs/alipay.png" mode="aspectFit"></image>
						</view>
					</uni-grid-item>
				</uni-grid>
			</view>
			<view class="blind-text-wrap">
				<text>今日剩余抽奖次数：3</text>
			</view>
			<view class="btn-wrap">
				<view class="blind-btn">
					<image class="btn-img" src="/static/imgs/ruleBtn.png" mode="aspectFit"></image>
				</view>
				<view class="blind-btn">
					<image class="btn-img" src="/static/imgs/openBtn.png" mode="aspectFit"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getLotteryApi
	} from '@/api/tuanApi.js';

	export default {
		data() {
			return {

			}
		},
		onLoad(option) {
			this.init();
		},
		methods: {
			init() {
				this.getLottery();
			},
			async getLottery() {
				let res = await getLotteryApi();
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-wrap {
		position: relative;
		background-color: $app-primary-color;
		// background-position: 0 200rpx;
		// background-repeat: no-repeat;
		// background-size: 100% auto;
		// background-image: url(@/static/imgs/blindBg.png);
	}

	.bg-wrap {
		background-color: $app-primary-color;
		padding-top: 200rpx;
		position: relative;

		.bg-img {
			width: 750rpx;
			height: 1200rpx;
		}
	}

	.gift-show-wrap {
		position: absolute;
		left: 0;
		bottom: 774rpx;
		padding: 0 45rpx 0 42rpx;
		z-index: 100;
		width: 100%;

		.gift-img-wrap {
			@extend %flex-center;
			width: 100%;
			height: 100%;

			.gift-img {
				width: 100rpx;
				height: 100rpx;
			}
		}
	}

	.blind-text-wrap {
		position: absolute;
		left: 0;
		bottom: 280rpx;
		z-index: 100;
		width: 100%;
		@extend %flex-center;
		font-size: $font-26;
		color: $white-color;
	}

	.btn-wrap {
		position: absolute;
		left: 0;
		bottom: 90rpx;
		z-index: 100;
		width: 100%;
		height: 120rpx;
		padding: 0 30rpx;
		// background-color: rgba(0, 0, 0, 0.3);
		display: flex;
		align-items: center;

		.blind-btn {

			@extend %flex-center;
			flex: 1;

			.btn-img {
				height: 120rpx;
				width: 300rpx;
			}
		}
	}
</style>
