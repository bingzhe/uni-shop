<template>
	<view class="page-wrap">
		<view class="detail_ct" v-for="(item, index) in list" :key="index">
			<view class="detail_ct_st">
				<view class="detail_ct_st_text">{{item.type_name}}</view>
				<view class="detail_ct_st_time">{{moment(item.create_time*1000).format('YYYY-MM-DD HH:mm:ss')}}</view>
			</view>
			<view class="detail_ct_money">{{item.bill_data}}</view>
		</view>
	</view>
</template>

<script>
	import moment from 'moment';
	import {
		getUsersBillApi,
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
		onLoad(option) {
			this.type = option.type
			this.detailList('')

		},

		// watch: {
		// 	/**
		// 	 * 监听route
		// 	 * @param {Object} to 要前往的页面
		// 	 * @param {Object} from 之前的页面
		// 	 */
		// 	$route(to, from) {
		// 		// TODO 根据页面路径判断刷新
		// 	}
		// },

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
			async detailList() {
				let data = {
					type: this.type
				}
				let res = await getUsersBillApi(data);
				this.list = res.data.data
				console.log(this.list);
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		// padding-top: 100rpx;
		background-color: #f7f7f7;
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
	}

	.detail_ct {
		box-sizing: border-box;
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
