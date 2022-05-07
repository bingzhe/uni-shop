<template>
	<view class="page-wrap">
		<!-- 轮播图 -->
		<view class="padding-all">
			<co-slid :slid_list="slid_list"></co-slid>
		</view>

		<!-- 列表 -->
		<view class="list-wrap padding-y">
			<view class="list-header flex-title">
				<view class="main">
					<text>热门团拼</text>
				</view>
				<view class="other">
				</view>
			</view>
			<view v-if="data_list.length>0" class="list-body group-list">
				<view class="group-item" v-for="(item, index) in data_list" :key="index">
					<image class="group-img" :src="$util.img(item.goods_img)" mode="aspectFit"></image>
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
								<view @click="toDetail(item)" class="group-btn">
									<text>去拼团</text>
								</view>
							</view>

						</view>
					</view>
				</view>
			</view>
			<view v-else class="list-body-empty">
				<text>暂无更多拼团</text>
			</view>
		</view>


	</view>
</template>

<script>
	import {
		groupListApi
	} from '@/api/tuanApi.js';

	export default {
		data() {
			return {
				slid_list: [
					'https://spike.bdtc100.com//public/img/banner1.jpg',
					'https://spike.bdtc100.com//public/img/banner2.jpg'
				],
				data_list: []
			}
		},
		onLoad() {
			this.init();
		},
		// 下拉加载
		onPullDownRefresh() {
			this.init();
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		methods: {
			init() {
				this.groupList();
			},
			async groupList() {
				let res = await groupListApi();
				this.data_list = res.data.data;
			},
			toDetail(item) {
				console.log(item);
				this.$util.redirectTo('/pages/goods/goods_detail', {
					group_id: item.group_id
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	// .margin-all {
	// 	margin: 30rpx;
	// }
	.list-wrap {
		.list-header {
			background-color: $app-primary-color;
			color: $white-color;
			height: 70rpx;
			padding: 20rpx;
			font-size: $font-30;
			border-radius: 16rpx 16rpx 0 0;
		}

		.list-body {
			background-color: #f8f8f8;
			border-radius: 0 0 16rpx 16rpx;
		}

		.list-body-empty {
			height: 400rpx;
			@extend %flex-center;
			background-color: #f8f8f8;
			border-radius: 0 0 16rpx 16rpx;
			color: $gray-color;
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
