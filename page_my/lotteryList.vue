<template>
	<view class="page-wrap">
		<cover-view class="n-tabs-wrapper">
			<cover-view class="n-tabs-tab-wrapper" @click="switchTab(0)"><span
					v-bind:class="{ 'n-tabs-tab--active': cashType == 0 }">全部</span></cover-view>
			<cover-view class="n-tabs-tab-wrapper" @click="switchTab(1)"><span
					v-bind:class="{ 'n-tabs-tab--active': cashType == 1 }">已中奖</span></cover-view>
			<cover-view class="n-tabs-tab-wrapper" @click="switchTab(2)"><span
					v-bind:class="{ 'n-tabs-tab--active': cashType == 2 }">未中奖</span></cover-view>
			<cover-view class="n-tabs-bar" v-bind:style="tabBarSide"></cover-view>
		</cover-view>
		<view class="n-tabs-wrapper-empty"></view>

		<view class="list-wrap">
			<view v-if="list.length>0" class="list-body lottery-list">

				<view class="lottery-item" v-for="(item, index) in list" :key="index">
					<view v-if="item.is_get == 0" class="detail_ct">
						<view class="detail_ct_st">
							<view class="detail_ct_st_text">未中奖</view>
							<view class="detail_ct_st_time">
								{{moment(item.create_time*1000).format('YYYY-MM-DD HH:mm:ss')}}
							</view>
						</view>
					</view>
					<view @click="lotteryClick(item, index)" v-if="item.is_get == 1" class="detail_ct">
						<view class="flex-center-y">
							<image class="goods-img" :src="$util.img(item.goods_img)" mode="aspectFit"></image>
							<view class="detail_ct_st">
								<view class="detail_ct_st_text">{{item.goods_name}}</view>
								<view class="detail_ct_st_time">
									{{moment(item.create_time*1000).format('YYYY-MM-DD HH:mm:ss')}}
								</view>
							</view>
						</view>

						<view v-if="item.status == 0" class="detail_ct_money">
							<text>请选择收货地址</text>
						</view>
						<view v-if="item.status == 1" class="detail_ct_money">
							<text>待发货</text>
						</view>
						<view v-if="item.status == 2" class="detail_ct_money">
							<text>待收货</text>
							<!-- <view class="receipt-btn">
								<text>签收</text>
							</view> -->
						</view>
						<view v-if="item.status == 3" class="detail_ct_money">
							<text>已完成</text>
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
		lotteryListApi,
		addLotteryAddressApi
	} from '@/api/tuanApi.js';

	// 中奖时订单状态0待确认1待发货2已发货3已完成
	export default {
		data() {
			return {
				cashType: 0,
				tabBarSide: '',
				searchParam: {},
				list: [],
				addParam: {
					id: '', // 奖品id
					address_id: '', // 地址id
				}
			}
		},
		onLoad() {
			this.init();
		},
		methods: {
			moment,
			init() {
				this.lotteryList();
			},
			resetOrderList() {
				
			},
			async lotteryList() {
				let res = await lotteryListApi(this.searchParam);
				this.list = res.data.data;
			},
			async addLotteryAddress() {
				let res = await addLotteryAddressApi(this.addParam);
				this.lotteryList();
			},
			lotteryClick(item, index) {
				if (item.status == 0) {
					this.selectAddress(item, index);
					return;
				}
				if (item.status == 2) {
					this.$util.redirectTo('/page_my/orderDetail', {
						detail: JSON.stringify(Object.assign(item, {
							order_status: item.status,
							type: 'lottery',
							goods_class: 1
						}))
					});
				}
			},
			selectAddress(item, index) {
				this.addParam.id = item.id;
				this.$util.redirectTo('/page_my/myAddress', {
					type: 'select'
				})
			},
			async changeAddress(e) {
				// console.log(e)
				// this.defaultAddress = e;
				// this.$set(this.addParam, 'address_id', e.address_id);
				this.addParam.address_id = e.address_id;
				await this.addLotteryAddress();
			},

			switchTab(e) {
				this.cashType = e;
				// this.searchParam.status = e;
				this.tabBarSide = {
					transform: `translateX(${e*100}%)`
				}
				// this.getOrderList();
				if (e == 0) {
					// this.searchParam.is_get = "";
					this.searchParam = {};
				}
				if (e == 1) {
					this.searchParam.is_get = 1;
				}
				if (e == 2) {
					this.searchParam.is_get = 0;
				}
				this.lotteryList();
			}
		}
	}
</script>

<style lang="scss" scoped>
	$bar-width: 33.33%;

	.receipt-btn {
		// height: 50rpx;
		// width: 100rpx;
		// border-radius: 40rpx;
		// margin-left: 20rpx;
		// font-size: $font-26;
		// @extend %flex-center;
		// background-color: $app-primary-color;
		// color: $white-color;

		margin-left: 20rpx;
		font-size: $font-26;
		// color: $app-primary-color;
	}

	.list-empty {
		color: $gray-color;
		@extend %flex-center;
		height: 400rpx;
	}

	.n-tabs-wrapper-empty {
		height: 100rpx;
	}

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

	.list-wrap {
		margin-top: 30rpx;
	}

	.detail_ct {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		padding: 15rpx 30rpx;
		border-bottom: 1rpx solid $border-color-dark;
		background-color: $white-color;

		.goods-img {
			width: 80rpx;
			height: 80rpx;
			margin-right: 20rpx;
		}

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
			@extend %flex-center-y;
			font-size: $font-28;
			// color: $gray-color;
			color: $app-primary-color;
		}
	}
</style>
