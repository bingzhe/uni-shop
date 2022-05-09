<template>
	<view style="width: 100%;">
		<cover-view class="n-tabs-wrapper">
			<cover-view class="n-tabs-tab-wrapper" @click="switchTab(0)"><span
					v-bind:class="{ 'n-tabs-tab--active': cashType == 0 }">全部</span></cover-view>
			<cover-view class="n-tabs-tab-wrapper" @click="switchTab(1)"><span
					v-bind:class="{ 'n-tabs-tab--active': cashType == 1 }">待支付</span></cover-view>
			<cover-view class="n-tabs-tab-wrapper" @click="switchTab(2)"><span
					v-bind:class="{ 'n-tabs-tab--active': cashType == 2 }">待收货</span></cover-view>
			<cover-view class="n-tabs-tab-wrapper" @click="switchTab(3)"><span
					v-bind:class="{ 'n-tabs-tab--active': cashType == 3 }">待发货</span></cover-view>
			<cover-view class="n-tabs-tab-wrapper" @click="switchTab(4)"><span
					v-bind:class="{ 'n-tabs-tab--active': cashType == 4 }">已完成</span></cover-view>
			<cover-view class="n-tabs-bar" v-bind:style="tabBarSide"></cover-view>
		</cover-view>

		<view class="list-wrap">
			<view v-if="list.length>0" class="list-body order-list">
				<view class="order-item" v-for="(item, index) in list" :key="index">
					<view class="goods-card flex-title">
						<image class="goods-img" :src="$util.img(item.image_url)" mode="aspectFit"></image>
						<view class="goods-detail-wrap">
							<view class="goods-detail-top">
								<view class="goods-detail-name">
									<text>{{item.goods_name}}</text>
								</view>
							</view>
							<view class="goods-detail-bottom">
								<view class="goods-detail-price-line flex-title">
									<view class="goods-detail-price">
										<text>{{item.order_price}}</text>
									</view>
									<view class="goods-detail-num">
										<text>x1</text>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view class="order-other flex-title">
						<view class="order-status-text">
							<text>{{formatStatus(item.order_status)}}</text>
						</view>
						<view class="order-price">
							<text>实付款：</text>
							<text>￥{{item.order_price}}</text>
						</view>
					</view>
				</view>
			</view>
			<view v-else class="list-empty">
				<text>暂无数据</text>
			</view>
		</view>

	</view>
</template>

<script>
	import moment from 'moment';

	import {
		getOrderListApi
	} from '@/api/tuanApi.js';

	export default {
		data() {
			return {
				cashType: 0,
				tabBarSide: '',
				list: [],
				searchParam: {
					status: '1', //1拼团中2拼团成功3拼团失败
				}
			};
		},
		onLoad(option) {
			this.getOrderList();
		},
		methods: {
			moment,
			switchTab(e) {
				this.cashType = e;
				this.tabBarSide = {
					transform: `translateX(${e*100}%)`
				}
				this.searchParam.status = e;
				this.getOrderList();
			},
			formatStatus(status) {
				if(status == 0) {
					return '待支付';
				}
				if(status == 1) {
					return '待收货';
				}
				if(status == 2) {
					return '待发货';
				}
				if(status == 3) {
					return '已完成';
				}
			},
			async getOrderList() {
				let res = await getOrderListApi(this.searchParam);
				this.list = res.data.data;
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		padding-top: 100rpx;
		background-color: #f7f7f7;
	}


	.goods-card {
		padding: 20rpx 0;
		width: 100%;

		.goods-img {
			width: 200rpx;
			height: 200rpx;
			background-color: $app-background-color;
			border-radius: 16rpx;
		}

		.goods-detail-wrap {
			flex: 1;
			margin-left: 20rpx;
			height: 200rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			font-size: $font-28;

			.goods-detail-top {
				.goods-detail-name {}
			}

			.goods-detail-bottom {
				.goods-detail-price-line {
					width: 100%;
				}

				.goods-detail-price {
					font-size: $font-32;
					color: $app-primary-color;
					font-weight: bold;
				}

				.goods-detail-num {
					font-size: $font-28;
				}
			}
		}
	}

	.order-list {
		padding: 30rpx 20rpx 60rpx;

		.order-item {
			padding: 20rpx;
			background-color: $white-color;
			border-radius: 8rpx;
			margin-bottom: 20rpx;
			&:active {
				background-color: $app-active-color;
			}
			.order-other {
				font-size: $font-28;
				height: 70rpx;
				.order-status-text {
					color: $app-primary-color;
				}
			}
		}
	}

	.list-empty {
		color: $gray-color;
		@extend %flex-center;
		height: 400rpx;
	}


	$bar-width: 20%;

	.n-tabs-wrapper {
		margin: 0;
		overflow: hidden;
		width: 100%;
		height: 100rpx;
		// border-bottom: 1px solid #E7E7E7;
		top: 86rpx;
		// top: var(--window-bottom);
		position: fixed;
		z-index: 20;
		background-color: #fff;
	}

	.n-tabs-tab-wrapper {
		width: $bar-width;
		float: left;
		height: 99rpx;
		line-height: 99rpx;
		text-align: center;
		font-size: 38rpx;
		color: #333333;
		font-size: 26rpx;
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
		max-width: $bar-width;
		width: 60%;
		transition-property: all;
		transition-duration: 0.5s;
	}

	.detail_ct {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		padding: 15rpx 30rpx;
		border-bottom: 1rpx solid $border-color-dark;

		.detail_ct_st {
			display: flex;
			flex-direction: column;
			font-size: $font-base;

			.detail_ct_st_time {
				margin-top: 10rpx;
				color: $uni-text-color-grey;
				font-size: $font-sm;
			}
		}

		.detail_ct_money {
			color: $red-color;
		}
	}
</style>
