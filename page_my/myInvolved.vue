<template>
	<view class="page-wrap">
		<view class="n-tabs-wrapper">
			<view class="n-tabs-tab-wrapper" @click="switchTab(0)"><span
					v-bind:class="{ 'n-tabs-tab--active': cashType == 0 }">参团失败</span></view>
			<view class="n-tabs-tab-wrapper" @click="switchTab(1)"><span
					v-bind:class="{ 'n-tabs-tab--active': cashType == 1 }">参团中</span></view>
			<view class="n-tabs-tab-wrapper" @click="switchTab(2)"><span
					v-bind:class="{ 'n-tabs-tab--active': cashType == 2 }">参团成功</span></view>
			<view class="n-tabs-bar" :style="[tabBarSide]"></view>
		</view>
		<view class="n-tabs-wrapper-empty"></view>
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

		<view class="list-wrap" :style="{'height':scrollHeight+'px'}" style="overflow: hidden;">
			<movable-refresh ref="movableRefresh" :scrollHeight="scrollHeight" @onScroll="onScroll" noMoreText="" :refreshSuccessText="refreshSuccessText" @refresh="refresh" :noMore="noMore">
				<view v-if="list.length>0" class="list-body group-list">
					<view @click="toDetail(item)" class="group-item" v-for="(item, index) in list" :key="index">
						<image class="group-img" :src="$util.img(item.image_url)" mode="aspectFit"></image>
						<view class="group-detail">
							<view class="group-detail-top flex-title">
								<view class="group-name">
									<text>{{item.goods_name}}</text>
								</view>
								<!-- <view class="group-order">
									<text v-if="item.join_status == 1" @click.stop="getOrderInfo(item, index)">查看订单</text>
								</view> -->
							</view>
							<view class="group-detail-price flex-title">
								<view class="group-price">
									<view>
										<text class="group-price-symbol">￥</text>
										<text>{{item.price}}</text>
									</view>
									<view>
										<uni-countdown v-if="item.status == 1" :day="item.showDeliveryDay" :hour="item.showDeliveryHour" :minute="item.showDeliveryMinute" :second="item.showDeliverySecond" color="#FFFFFF" background-color="#fd3535"></uni-countdown>
									</view>
								</view>
								<view class="del-price">
									<text class="label">原价：</text>
									<text class="value">{{item.goods_price}}</text>
								</view>
								<template v-if="item.join_status == 0">
									<view class="group-team-num">
										<text>剩余{{(item.team_num - item.join_num)}}人拼成</text>
									</view>
									<view class="hsr-line">
										<view class="hsr-line-blue"
											:style="{width: ((item.join_num || 0 /item.team_num)*24 + 'rpx')} ">
										</view>
									</view>
								</template>
							</view>
							
							<view class="group-detail-btn flex-title">
						
									<!-- <view v-if="item.join_status == 0" class="group-btn">
										<text>去分享</text>
									</view> -->
									<!-- goods_class  1  实物  2  虚拟 -->
									<template v-if="item.goods_class == 1">
										<view v-if="item.join_status == 1" class="group-btn">
											<text @click.stop="getOrderInfo(item, index)">查看订单</text>
										</view>
										<view v-if="item.join_status == 1" class="group-btn">
											<text>获得产品</text>
										</view>
										
										<view v-if="item.join_status == 2" class="group-btn">
											<text>获得红包</text>
										</view>
										<view v-if="item.join_status == 3" class="group-btn disabled">
											<text>拼团失败</text>
										</view>
										
										<view v-if="item.join_status == 0" class="">
											<uni-countdown ref="countdown" @timeup="timeOver" :showDay="item.showDay>0"
												:font-size="11" :day="item.showDay" :hour="item.showHour"
												:minute="item.showMinute" :second="item.showSecond" color="#FFFFFF"
												background-color="#ff5454" splitorColor="#ff5454" />
										</view>
									</template>
									<template v-if="item.goods_class == 2">
										<view v-if="item.join_status == 1" class="group-btn">
											<text @click.stop="goBlindBox">去抽奖</text>
										</view>
										<view v-if="item.join_status == 1" class="group-btn">
											<text @click.stop="getOrderInfo(item, index)">查看订单</text>
										</view>
										<view v-if="item.join_status == 1" class="group-btn">
											<text>获得产品</text>
										</view>
										
										<view v-if="item.join_status == 2" class="group-btn">
											<text>获得红包</text>
										</view>
										<view v-if="item.join_status == 3" class="group-btn disabled">
											<text>拼团失败</text>
										</view>
										
										<view v-if="item.join_status == 0" class="">
											<uni-countdown ref="countdown" @timeup="timeOver" :showDay="item.showDay>0"
												:font-size="11" :day="item.showDay" :hour="item.showHour"
												:minute="item.showMinute" :second="item.showSecond" color="#FFFFFF"
												background-color="#ff5454" splitorColor="#ff5454" />
										</view>
									</template>
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
		getOrderInfoApi,
		getMyGroupListApi,
	} from '@/api/tuanApi.js';

	export default {
		components: {
			movableRefresh
		},
		data() {
			return {
				cashType: 1,
				tabBarSide: {},
				list: [],
				searchParam: {
					status: '1', //1拼团中2拼团成功3拼团失败
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
			
			if (option.orderType) {
				if (option.orderType == 1) {
					this.switchTab(2);
					return;
				}
			}
			
			// 获取订单数据
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
				console.log(this.tabBarSide)
				this.getMyGroupList();
			},
			formatCountdown(list, key) {
				let nowTime = moment();
				if (!Array.isArray(list)) {
					return [];
				}
				list = list.map(item => {
					let time = moment(item[key] * 1000).valueOf() - nowTime;
					return Object.assign(item, {
						showDay: moment.duration(time).days(),
						showHour: moment.duration(time).hours(),
						showMinute: moment.duration(time).minutes(),
						showSecond: moment.duration(time).seconds(),
						showTime: item[key] * 1000 - new Date()
					})
				});
				return list;
			},
			async getMyGroupList() {
				let res = await getMyGroupListApi(this.searchParam);
				// this.list = res.data.data;
				this.list = this.formatCountdown(res.data.data, 'end_time');
			},
			async getOrderInfo(item, index) {
				let res = await getOrderInfoApi({
					order_no: item.order_no
				});
				res.data.data.goods_class = item.goods_class
				res.data.data.join_status = item.join_status
				this.$util.redirectTo('/page_my/orderDetail', {
					detail: JSON.stringify(res.data.data)
				});
			},
			timeOver() {
				this.init();
			},
			toDetail(item) {
				console.log(item);
				this.$util.redirectTo('/pages/goods/goods_detail', {
					group_id: item.group_id
				})
			},
			// 下拉刷新
			async refresh(){
				this.refreshSuccessText = '刷新成功'
				let res = await getMyGroupListApi(this.searchParam)
				if(this.$refs.movableRefresh){
					let that = this
					setTimeout(function(){
						if(res.data.code == 200 ){
							this.list = res.data.data
						}else{
							that.refreshSuccessText = '刷新失败'
						}
						that.$refs.movableRefresh.endLoad()		//刷新结束
					},1000)
				} 
			},
			onScroll(scrollTop){
				this.scrollTop = scrollTop
			},
			// 去抽奖
			goBlindBox(){
				this.$util.redirectTo('/page_my/blindBox')
			}
		}
	}
</script>

<style lang="scss" scoped>
	
	
	page {
		// padding-top: 100rpx;
		background-color: #f7f7f7;
	}
	
	.list-wrap /deep/ .uni-scroll-view {
		background-color: #f3f4f8;
	}

	.list-empty {
		color: $gray-color;
		@extend %flex-center;
		@extend %app-default-width;
		height: 400rpx;
	}

	.n-tabs-wrapper-empty {
		height: 100rpx;
	}
	.n-tabs-wrapper {
		overflow: hidden;
		@extend %app-default-width;
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
				padding-left: 20rpx;
				min-height: 200rpx;
				color: $font-color;
				font-size: $font-30;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				
				.group-detail-top {
					// height: 50rpx;
					// display: flex;
					// flex-direction: column;
					
					.group-name {
						width: 100%;
						height: 50rpx;
						line-height: 50rpx;
						// text-align: left;
						text-indent: 42rpx;
					}
					// .group-order {
					// 	width: 95%;
					// 	height: 50rpx;
					// 	line-height: 50rpx;
					// 	text-align: right;
					// }
				}
				
				.group-detail-price {
					display: flex;
					flex-direction: column;
					justify-content: flex-start;
					width: 240rpx;
					
					overflow: hidden;
				}
				
				.group-detail-btn {
					// height: 84rpx;
					display: flex;
					flex-direction: row;
					justify-content: flex-end;
					
					.group-btn {
						background: linear-gradient(to right, rgba($app-primary-color, 0.7), $app-primary-color);
						color: $white-color;
						padding: 8rpx 16rpx;
						border-radius: 30rpx;
						font-size: $font-26;
						margin-right: 20rpx;
					
						&.disabled {
							background-color: $gray-color;
							background-image: none;
						}
					}
				}

				.group-name {}

				.group-order {
					color: $app-primary-color;
					font-size: $font-26;
				}

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
					// padding: 0 0 4rpx;

					.group-price-symbol {
						font-size: $font-28;
					}

					.old-price {
						color: $gray-color;
						font-size: $font-24;
						font-weight: normal;
						text-decoration: line-through;
						margin-left: 8rpx;
					}
				}

				.del-price {
					color: $gray-color;
					font-size: $font-24;
					font-weight: normal;

					.label {
						text-decoration: none;
					}

					.value {
						text-decoration: line-through;
					}
				}

				.group-team-num {
					font-size: $font-24;
					color: $gray-color;
					margin: 4rpx 0 8rpx;
				}

				.group-old-price {
					font-size: $font-24;
				}

			}
		}
	}


	.hsr-line,
	.hsr-line-blue {
		overflow: hidden;
		position: relative;
		height: 12rpx;
		// width: 100%;
		width: 240rpx;
		background-color: $white-color;
		border-radius: 10rpx;
		margin: 2rpx 0;
	}

	.hsr-line {
		box-shadow: 0 0 1rpx 1rpx $gray-color;
	}

	.hsr-line-blue {
		background-color: $app-primary-color;
		position: absolute;
		top: 0;
		left: 0;
		margin: 0;
	}
</style>
