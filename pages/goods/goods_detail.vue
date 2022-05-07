<template>
	<view class="page-wrap">
		<!-- 轮播图 -->
		<view class="slid-wrap">
			<swiper @change="slidChange" class="slid-swiper" :indicator-dots="false"
				indicator-active-color="rgba(220, 32, 31, 1)" indicator-color="rgba(255, 255, 255, 0.3)"
				:circular="false" :autoplay="true" :interval="8000" :duration="1000">
				<swiper-item class="slid-swiper-item" v-for="(item, index) in detail.img_list" :key="index">
					<view class="swiper-item">
						<image class="slid-img" :src="$util.img(item)" mode="aspectFit"></image>
					</view>
				</swiper-item>
			</swiper>

			<cover-view class="slid-num-wrap">
				{{slid_index}}/{{detail.img_list.length}}
			</cover-view>
		</view>

		<view class="goods-bar flex-title">
			<view class="goods-bar-left">
				<view class="bar-info flex-center-y">
					<image class="bar-logo" src="../../static/imgs/detail_pintuan_tag.png" mode="aspectFit"></image>
					<view class="bar-team-num flex-center-y">
						<view class="num-value">{{detail.team_num}}</view>
						<view class="num-text">人团</view>
					</view>
				</view>
				<view class="">
				</view>
			</view>
			<view class="goods-bar-right">
				<view class="goods-bar-right-label">
					<text>距结束仅剩</text>
				</view>
				<view class="goods-bar-right-value">
					<uni-countdown ref="countdown" @timeup="timeOver" :showDay="showDay>0" :font-size="12"
						:day="showDay" :hour="showHour" :minute="showMinute" :second="showSecond" color="#FFFFFF"
						background-color="#ff5454" splitorColor="#ff5454" />
				</view>
			</view>
		</view>

		<view class="padding-all">

		</view>

		<view class="detail-bottom">
			<view @click="toPay" class="detail-bottom-btn">
				<text>去参团</text>
			</view>
		</view>
		<view class="detail-bottom-empty"></view>

	</view>
</template>

<script>
	import {
		groupDetailApi
	} from '@/api/tuanApi.js';
	import moment from 'moment';


	export default {
		data() {
			return {
				group_id: '',
				slid_index: 1,

				showDay: 0,
				showHour: 0,
				showMinute: 0,
				showSecond: 0,

				detail: {
					begin_time: 1651680000,
					create_time: 1651798944,
					end_time: 1652798800,
					get_num: 3,
					goods_class: 2,
					goods_id: 1,
					goods_img: "/upload/goods/20220428/202204281106470.jpeg",
					goods_name: "风景画",
					goods_price: "1000.00",
					group_id: 1,
					img_list: [
						'/upload/goods/20220428/202204281106470.jpeg',
						'/upload/goods/20220428/202204281106471.jpeg',
						'/upload/goods/20220428/202204281106472.jpeg',
						'/upload/goods/20220428/202204281106473.jpeg'
					],
					is_delete: 0,
					price: "200.00",
					shop_list: [{
						address: "兴国路13号华泓智乐广场二楼赣湘名厨",
						distance: 0,
						end_time: 0,
						full_address: "江西省赣州市章贡区",
						goods_content: "测试",
						latitude: "25.82845",
						logo: "/upload/goods/20220428/202204281106470.jpeg",
						longitude: "114.937971",
						shop_id: 1,
						shop_name: "测试",
						start_time: 0
					}],
					status: 1,
					team_num: 10,
				}
			}
		},
		onLoad(option) {
			if (option.group_id) {
				this.group_id = option.group_id;
			}
			this.init();
		},
		methods: {
			moment,
			init() {
				this.groupDetail();
			},
			initCountDown() {

				let time = moment(this.detail.end_time * 1000).valueOf() - new Date()

				this.showDay = moment.duration(time).days();
				this.showHour = moment.duration(time).hours();
				this.showMinute = moment.duration(time).minutes();
				this.showSecond = moment.duration(time).seconds();
			},
			async groupDetail() {
				let res = await groupDetailApi({
					group_id: this.group_id
				});
				this.detail = res.data.data;
				this.initCountDown();
			},
			slidChange(event) {
				this.slid_index = event.detail.current + 1;
			},
			timeOver() {
				if (this.detail.end_time) {
					// uni.navigateBack({});
				}
			},
			toPay() {
				if (!this.$util.checkLogin()) {
					this.$util.redirectTo('/pages/login/login', undefined, 'reLaunch');
					return;
				}
				this.$util.redirectTo('/pages/goods/goods_pay', {
					group_id: this.detail.group_id,
					goods_class: this.detail.goods_class,
					order_price: this.detail.price,
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.detail-bottom-empty {
		height: 120rpx;
	}

	.detail-bottom {
		display: flex;
		justify-content: center;
		align-items: center;
		position: fixed;
		left: 0;
		bottom: 0;
		height: 120rpx;
		width: 100%;
		background-color: $white-color;

		.detail-bottom-btn {
			@extend %flex-center;
			background-color: $app-primary-color;
			color: $white-color;
			height: 80rpx;
			width: 600rpx;
			border-radius: 8rpx;
		}
	}

	$slid-height: 600rpx;

	.slid-wrap {
		position: relative;

		.slid-num-wrap {
			background-color: rgba($black-color, 0.3);
			position: absolute;
			right: 30rpx;
			bottom: 30rpx;
			color: $white-color;
			padding: 4rpx 16rpx;
			border-radius: 30rpx;
			font-size: $font-26;
		}

		.slid-swiper {
			height: $slid-height;

			.slid-swiper-item {
				background-color: $white-color;
			}

			.swiper-item {
				width: 100%;
				height: 100%;
				@extend %flex-center;
				position: relative;

				.slid-img {
					width: 100%;
					// height: $slid-height;
				}
			}
		}
	}

	.goods-bar {
		height: 110rpx;
		padding-left: 30rpx;
		background-image: url(@/static/imgs/detail_bar_left.png);
		background-position: center;
		background-repeat: no-repeat;
		background-size: cover;
		color: $white-color;
		font-size: $font-24;

		.goods-bar-left {
			.bar-logo {
				height: 33rpx;
				width: 107rpx;
			}

			.bar-team-num {
				@extend %flex-center;
				height: 36rpx;
				border: 1rpx solid $white-color;
				border-radius: 8rpx;
				margin-left: 10rpx;

				.num-value {
					padding: 0 6rpx;
					background-color: $white-color;
					color: $app-primary-color;
				}

				.num-text {
					padding: 0 6rpx;
				}
			}
		}

		.goods-bar-right {
			display: flex;
			flex-direction: column;
			align-items: flex-end;
			padding: 0 30rpx;
			width: 300rpx;
			height: 120rpx;
			background-image: url(@/static/imgs/detail_bar_right.png);
			background-position: left;
			background-repeat: no-repeat;
			background-size: auto 100%;

			.goods-bar-right-label {
				width: 100%;
				@extend %flex-center;
				color: $app-primary-color;
				margin: 20rpx 0 10rpx;
			}

			.goods-bar-right-value {
				width: 100%;
				@extend %flex-center;
			}
		}
	}
</style>
