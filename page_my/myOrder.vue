<template>
	<view class="page-wrap">
		<cover-view class="n-tabs-wrapper">
			<cover-view class="n-tabs-tab-wrapper" @click="switchTab(0)"><cover-view
					v-bind:class="{ 'n-tabs-tab--active': cashType == 0 }">全部</cover-view></cover-view>
			<cover-view class="n-tabs-tab-wrapper" @click="switchTab(1)"><cover-view
					v-bind:class="{ 'n-tabs-tab--active': cashType == 1 }">待发货</cover-view></cover-view>
			<cover-view class="n-tabs-tab-wrapper" @click="switchTab(2)"><cover-view
					v-bind:class="{ 'n-tabs-tab--active': cashType == 2 }">待收货</cover-view></cover-view>
			<cover-view class="n-tabs-tab-wrapper" @click="switchTab(3)"><cover-view
					v-bind:class="{ 'n-tabs-tab--active': cashType == 3 }">已完成</cover-view></cover-view>
			<cover-view class="n-tabs-bar" v-bind:style="[tabBarSide]"></cover-view>
		</cover-view>
		<view class="n-tabs-wrapper-empty"></view>

		<view class="list-wrap">
			<view v-if="list.length>0" class="list-body order-list">
				<view @click="toOrderDetail(item, index)" class="order-item" v-for="(item, index) in list" :key="index">
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
					<view v-if="item.order_status == 2" class="order-control-wrap">
						<view @click.stop="receiptClick(item)" class="order-control-btn receipt-btn">
							<text>签收</text>
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
		receiptApi,
		getOrderListApi
	} from '@/api/tuanApi.js';

	export default {
		data() {
			return {
				cashType: 0,
				tabBarSide: '',
				list: [],
				receiptParam: {
					order_id: ''
				},
				// 0全部1待支付2待发货3待收货4已完成（不传查全部）
				searchParam: {}
			};
		},
		onLoad(option) {
			this.getOrderList();
		},
		methods: {
			moment,
			switchTab(e) {
				this.cashType = e;
				// this.searchParam.status = e;
				this.tabBarSide = {
					transform: `translateX(${e*100}%)`
				}
				if (e == 0) {
					this.searchParam = {};
				}
				if (e == 1) {
					this.searchParam.status = 2;
				}
				if (e == 2) {
					this.searchParam.status = 3;
				}
				if (e == 3) {
					this.searchParam.status = 4;
				}
				this.getOrderList();
			},
			formatStatus(status) {
				if (status == 0) {
					return '待支付';
				}
				if (status == 1) {
					return '待发货';
				}
				if (status == 2) {
					return '待收货';
				}
				if (status == 3) {
					return '已完成';
				}
			},

			async receipt() {
				let res = await receiptApi(this.receiptParam);
				this.getOrderList();
			},

			async getOrderList() {
				let res = await getOrderListApi(this.searchParam);
				this.list = res.data.data;
			},
			toOrderDetail(item, index) {
				this.$util.redirectTo('/page_my/orderDetail', {
					detail: JSON.stringify(item)
				});
			},
			receiptClick(item, index) {
				// this.receiptParam.order_id = item.order_id;
				// this.receipt();
				uni.showModal({
					title: '确定签收?',
					success: (res) => {
						if (res.confirm) {
							this.receiptParam.order_id = item.order_id;
							this.receipt();
							return;
						}
						if (res.cancel) {
							return;
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		// padding-top: 100rpx;
		background-color: #f7f7f7;
	}

	.order-control-wrap {
		@extend %flex-center-y;
		justify-content: flex-end;
		margin-top: 20rpx;
		padding-top: 20rpx;
		border-top: 1rpx dotted $gray-color;

		.order-control-btn {
			background-color: $app-primary-color;
			color: $white-color;
			font-size: $font-26;
			@extend %flex-center;
			height: 50rpx;
			width: 120rpx;
			border-radius: 60rpx;
		}
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
				.goods-detail-name {
					font-size: $font-30;
					font-weight: bold;
				}
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
	.list-wrap {
		margin: 0;
	}
	.order-list {
		padding: 30rpx 20rpx 60rpx;

		.order-item {
			padding: 20rpx;
			background-color: $white-color;
			border-radius: 8rpx;
			margin-bottom: 20rpx;

			// &:active {
			// 	background-color: $app-active-color;
			// }

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
		@extend %app-default-width;
		height: 400rpx;
	}


	$bar-width: 25%;
	.n-tabs-wrapper-empty {
		height: 100rpx;
	}
	.n-tabs-wrapper {
		// border-bottom: 1px solid #E7E7E7;
		// top: var(--window-bottom);
		// top: 88rpx;
		// position: absolute;
		// margin: 0;
		// overflow: hidden;
		// height: 100rpx;
		overflow: hidden;
		@extend %app-default-width;
		// width: 100%;
		height: 100rpx;
		// top: 88rpx;
		position: fixed;
		z-index: 20;
		background-color: #fff;
	}

	.n-tabs-tab-wrapper {
		width: $bar-width;
		float: left;
		height: 100rpx;
		@extend %flex-center;
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
