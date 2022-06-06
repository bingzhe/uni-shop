<template>
	<view style="width: 100%;">
		<view class="parHead">积分提现明细</view>
		<view class="detail_ct" v-for="(item, index) in list" :key="index">
			<view class="detail_ct_st">
				<view v-if="item.status == -1&&item.fail_msg" class="detail_ct_st_text" style="color: red;">
					未通过 {{item.fail_msg}}
				</view>
				<view v-else-if="item.status == 0" class="detail_ct_st_text">审核中</view>
				<view v-else-if="item.status == 1" class="detail_ct_st_text">待财务审核</view>
				<view v-else class="detail_ct_st_time">审核通过</view>
				<view class="detail_ct_st_time">{{moment(item.create_time*1000).format('YYYY-MM-DD HH:mm:ss')}}</view>
			</view>
			<view class="detail_ct_money">{{item.withdraw_price}}</view>
		</view>
	</view>
</template>

<script>
	import moment from 'moment';
	import {
		withdrawBillApi,
	} from '@/api/tuanApi.js';

	export default {
		data() {
			return {
				cashType: 0,
				tabBarSide: '',
				type: 0,
				list: [],
				withdraw_price: '',
				create_time: '',
				status: ''
			};
		},
		onLoad() {
			this.detailList('')
		},
		methods: {
			moment,
			switchTab(e) {
				this.cashType = e
				if (e == 1) {
					this.tabBarSide = {
						transform: 'translateX(100%)'
					}
					this.detailList(2)
				} else if (e == 0) {
					this.tabBarSide = {
						transform: 'translateX(0%)'
					}
					this.detailList('')
				} else {
					this.tabBarSide = {
						transform: 'translateX(200%)'
					}
					this.detailList(1)
				}

			},
			// 获取明细
			async detailList(e) {
				let data = {
					type: 3
				}
				let res = await withdrawBillApi(data);
				this.list = res.data.data
				console.log(this.list);
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #f7f7f7;
	}
	.parHead{
		width: 100%;
		background-color: white;
		height: 80rpx;
		font-size: 30rpx;
		margin: auto;
		line-height: 50rpx;
		text-align: center;
	}
	.n-tabs-wrapper-empty {
		height: 100rpx;
	}

	.n-tabs-wrapper {
		@extend %app-default-width;
		overflow: hidden;
		height: 100rpx;
		position: fixed;
		z-index: 20;
		background-color: #fff;
	}

	.n-tabs-tab-wrapper {
		width: 33.33%;
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
		max-width: 33.33%;
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
