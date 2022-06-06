<template>
	<view class="page-wrap">
		<cover-view class="n-tabs-wrapper">
			<cover-view class="n-tabs-tab-wrapper" @click="switchTab(0)"><cover-view
					v-bind:class="{ 'n-tabs-tab--active': ticketStatus == 0 }">可用</cover-view></cover-view>
			<cover-view class="n-tabs-tab-wrapper" @click="switchTab(1)"><cover-view
					v-bind:class="{ 'n-tabs-tab--active': ticketStatus == 1 }">转让中</cover-view></cover-view>
			<cover-view class="n-tabs-tab-wrapper" @click="switchTab(2)"><cover-view
					v-bind:class="{ 'n-tabs-tab--active': ticketStatus == 2 }">已核销</cover-view></cover-view>
			<cover-view class="n-tabs-tab-wrapper" @click="switchTab(3)"><cover-view
					v-bind:class="{ 'n-tabs-tab--active': ticketStatus == 3 }">已过期</cover-view></cover-view>
			<cover-view class="n-tabs-bar" v-bind:style="[tabBarSide]"></cover-view>
		</cover-view>
		<view class="n-tabs-wrapper-empty"></view>
		
		<view class="list-wrap" :style="{'height':scrollHeight+'px'}" style="overflow: hidden;">
			<!-- <view class="list-wrap"> -->
			<movable-refresh ref="movableRefresh" :scrollHeight="scrollHeight" @onScroll="onScroll" noMoreText="" :refreshSuccessText="refreshSuccessText" @refresh="refresh" :noMore="noMore">
					<view v-if="list.length>0" class="list-body order-list">
						<view class="order-item" v-for="(item, index) in list" :key="index">
							<view class="goods-card flex-title">
								<image class="goods-img" :src="$util.img(item.image_url)" mode="aspectFit"></image>
								<view class="goods-detail-wrap">
									<view class="goods-detail-top">
										<view class="goods-detail-name">
											<view>{{item.goods_name}}</view>
											<uni-countdown color="#FFFFFF" background-color="#ff5454" v-if="item.expired_time!=0&&searchParam.status==1" :day="item.expiredDay" :hour="item.expiredHour" :minute="item.expiredMinute" :second="item.expiredSecond"></uni-countdown>
											<!-- <text>{{item.end_time}}</text> -->
										</view>
									</view>
									<view class="goods-detail-bottom">
										<view class="goods-detail-price-line flex-title">
											<view class="goods-detail-price">
												<text>￥{{item.goods_price}}</text>
											</view>
											<view class="goods-detail-btn">
												<view @click="toOrderDetail(item, index)">详情</view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view v-else class="list-empty">
						<text>暂无数据</text>
					</view>
			</movable-refresh>
		</view>

	</view>
</template>

<script>
	import moment from 'moment';
	import movableRefresh from '@/components/zyq-movableRefresh/zyq-movableRefresh.vue'

	import {
		myVerifyListApi
	} from '@/api/tuanApi.js';

	export default {
		components: {
			movableRefresh
		},
		data() {
			return {
				ticketStatus: 0,
				tabBarSide: '',
				list: [],
				// 1可用的 2已核销 3转让中 4过期的
				searchParam: {
					status: 1
				},
				scrollHeight: 300, // 用于获取屏幕高度
				refreshSuccessText: '刷新成功', // 用于显示刷新后文字
				noMore: true, // 上拉加载
			};
		},
		onLoad(option) {
			// 获取屏幕高度
			let system = uni.getSystemInfoSync()
			this.scrollHeight = system.windowHeight - system.statusBarHeight - 80
			// 获取订单数据
			this.getOrderList();
		},
		methods: {
			moment,
			switchTab(e) {
				this.ticketStatus = e;
				// this.searchParam.status = e;
				this.tabBarSide = {
					transform: `translateX(${e*100}%)`
				}
				if (e == 0) {
					this.searchParam.status = 1;
				}
				if (e == 1) {
					this.searchParam.status = 3;
				}
				if (e == 2) {
					this.searchParam.status = 2;
				}
				if (e == 3) {
					this.searchParam.status = 4;
				}
				this.getOrderList();
			},
			// formatStatus(status) {
			// 	if (status == 0) {
			// 		return '已支付';
			// 	}
			// 	if (status == 1) {
			// 		return '待发货';
			// 	}
			// 	if (status == 2) {
			// 		return '待收货';
			// 	}
			// 	if (status == 3) {
			// 		return '已完成';
			// 	}
			// },
			async getOrderList() {
				let res = await myVerifyListApi(this.searchParam);
				this.list = res.data.data;
				this.list = this.formatExpiredCountdown(this.list,'expired_time')
				// this.list = this.formatEndCountdown(this.list,'end_time')
			},
			toOrderDetail(item, index) {
				console.log(item);
				this.$util.redirectTo('/page_my/myCouponsDetail', {
					detail: encodeURIComponent(JSON.stringify(item))
				});
			},
			// 下拉刷新
			async refresh(){
				// this.noMore = true
				this.refreshSuccessText = '刷新成功'
				let res = await myVerifyListApi(this.searchParam)
				if(this.$refs.movableRefresh){
					let that = this
					setTimeout(function(){
						if(res.data.code == 200 ){
							this.list = res.data.data
							this.noMore = true
						}else{
							that.refreshSuccessText = '刷新失败'
						}
						that.$refs.movableRefresh.endLoad()		//刷新结束
					},1000)
				} 
			},
			// 上拉加载
			// loadMore(){
			// 	this.noMore = true
			// 	if(this.noMore){
			// 		return
			// 	}
			// },
			onScroll(scrollTop){
				this.scrollTop = scrollTop
			},
			formatExpiredCountdown(list, key) { // 待付款倒计时
				let nowTime = new Date().getTime();
				if (!Array.isArray(list)) {
					return [];
				}
				list = list.map(item => {
					let time = moment(item[key]*1000).valueOf() - nowTime;
					console.log(time);
					return Object.assign(item, {
						expiredDay: moment.duration(time).days(),
						expiredHour: moment.duration(time).hours(),
						expiredMinute: moment.duration(time).minutes(),
						expiredSecond: moment.duration(time).seconds(),
						expiredTime: item[key] - new Date()
					})
				});
				return list;
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
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					.uni-countdown {
						margin-top: 40rpx;
					}
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

				.goods-detail-btn {
					font-size: $font-28;
					padding: 4rpx 24rpx;
					background-color: #ff5454;
					color: #ffffff;
					border-radius: 30rpx;
					margin-right: 20rpx;
				}
			}
		}
	}
	.list-wrap {
		margin: 0;
	}
	.list-wrap /deep/ .uni-scroll-view {
		background-color: #f3f4f8;
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
