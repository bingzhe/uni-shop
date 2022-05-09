<template>
	<view style="width: 100%;">
		<view class="n-tabs-wrapper">
			<view class="n-tabs-tab-wrapper" @click="switchTab(0)"><span
					v-bind:class="{ 'n-tabs-tab--active': cashType == 0 }">拼团失败</span></view>
			<view class="n-tabs-tab-wrapper" @click="switchTab(1)"><span
					v-bind:class="{ 'n-tabs-tab--active': cashType == 1 }">拼团中</span></view>
			<view class="n-tabs-tab-wrapper" @click="switchTab(2)"><span
					v-bind:class="{ 'n-tabs-tab--active': cashType == 2 }">拼团成功</span></view>
			<view class="n-tabs-bar" v-bind:style="tabBarSide"></view>
		</view>

		<!-- <view class="detail_ct" v-for="(item, index) in list" :key="index">
			<view class="detail_ct_st">
				<view v-if="item.status == -1" class="detail_ct_st_text">未通过</view>
				<view v-else-if="status == 0" class="detail_ct_st_text">审核中</view>
				<view v-else-if="status == 1" class="detail_ct_st_text">待财务审核</view>
				<view v-else class="detail_ct_st_time">审核通过</view>
				<view class="detail_ct_st_time">{{moment(item.create_time*1000).format('YYYY-MM-DD HH:mm:ss')}}</view>
			</view>
			<view class="detail_ct_money">{{item.withdraw_price}}</view>
		</view> -->

		<view class="list-wrap">
			<view v-if="list.length>0" class="list-body group-list">
				<view class="group-item" v-for="(item, index) in list" :key="index">
					<image class="group-img" :src="$util.img(item.image_url)" mode="aspectFit"></image>
					<view class="group-detail">
						<view class="group-detail-top">
							<view class="group-name">
								<text>{{item.goods_name}}</text>
							</view>
						</view>
						<view class="group-detail-bottom flex-title">
							<view class="left">
								<view class="group-tags-wrap">
									<view class="group-tags team-num">
										<text>{{item.team_num}}人团</text>
									</view>
								</view>
								<view class="group-price">
									<text class="group-price-symbol">￥</text>
									<text>{{item.price}}</text>
								</view>
								<view class="group-old-price">
									<text>单购价：</text>
									<text>{{item.goods_price}}</text>
								</view>
							</view>
							<view class="right">
								<view class="group-btn">
									<text>去分享</text>
								</view>
							</view>
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
		getMyGroupListApi,
	} from '@/api/tuanApi.js';

	export default {
		data() {
			return {
				cashType: 1,
				tabBarSide: '',
				list: [],
				searchParam: {
					status: '1', //1拼团中2拼团成功3拼团失败
				}
			};
		},
		onLoad(option) {
			this.getMyGroupList();
		},
		methods: {
			moment,
			switchTab(e) {
				this.cashType = e;
				this.tabBarSide = {
					transform: `translateX(${e*100}%)`
				}
				if (e == 0) {
					this.searchParam.status = 3;
				}
				if (e == 1) {
					this.searchParam.status = 1;
				}
				if (e == 2) {
					this.searchParam.status = 2;
				}
				this.getMyGroupList();
			},
			async getMyGroupList() {
				let res = await getMyGroupListApi(this.searchParam);
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

	.list-empty {
		color: $gray-color;
		@extend %flex-center;
		height: 400rpx;
	}




	.n-tabs-wrapper {
		margin: 0rpx 0rpx;
		overflow: hidden;
		width: 100%;
		height: 100rpx;
		// border-bottom: 1px solid #E7E7E7;
		top: 88rpx;
		position: fixed;
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
		transform: translateX(100%);
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


	.group-list {
		padding: 30rpx 30rpx 10rpx;

		.group-item {
			@extend %flex-center-y;
			margin-bottom: 30rpx;

			.group-img {
				width: 200rpx;
				height: 200rpx;
				background-color: $white-color;
				border-radius: 16rpx;
			}

			.group-detail {
				flex: 1;
				padding-left: 30rpx;
				min-height: 200rpx;
				color: $font-color;
				font-size: $font-30;
				display: flex;
				flex-direction: column;
				justify-content: space-between;

				.group-detail-bottom {
					.right {
						height: 120rpx;
						display: flex;
						flex-direction: column;
						justify-content: flex-end;

						.group-btn {
							background: linear-gradient(to right, rgba($app-primary-color, 0.7), $app-primary-color);
							color: $white-color;
							padding: 8rpx 16rpx;
							border-radius: 30rpx;
							font-size: $font-26;
						}
					}
				}

				.group-name {}

				.group-tags-wrap {
					@extend %flex-center-y;

					.group-tags {
						@extend %flex-center;
						height: 36rpx;
						line-height: 0;
						color: $app-primary-color;
						font-size: $font-24;
						border: 1rpx solid $app-primary-color;
						border-radius: 8rpx;
						padding: 0 10rpx;
					}
				}

				.group-price {
					color: $app-primary-color;
					font-size: 40rpx;
					font-weight: bold;
					padding: 4rpx 0;

					.group-price-symbol {
						font-size: $font-28;
					}
				}

				.group-old-price {
					font-size: $font-24;
				}

			}
		}
	}
</style>
