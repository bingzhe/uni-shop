<template>
	<view class="page-wrap">

		<view class="bg-wrap">
			<image class="bg-img" :src="$util.img('/public/img/blindBg.png')" mode="aspectFill"></image>
			<view @click="toBlindList" class="my-blind-box"></view>
			<view class="gift-show-wrap">
				<uni-grid :column="5" :showBorder="false">
					<uni-grid-item v-for="(item, index) in lottery.list">
						<view class="gift-img-wrap">
							<!-- <view class="gift-img" :style="{
								'background-image': `url(${$util.img(item.goods_img)})`
							}">
							</view> -->
							<image class="gift-img" :src="$util.img(item.goods_img)" mode="aspectFit"></image>
						</view>
					</uni-grid-item>
				</uni-grid>
			</view>
			<view class="blind-text-wrap">
				<text>今日剩余抽奖次数：{{lottery.users_num}}</text>
			</view>
			<view class="btn-wrap">
				<view class="blind-btn">
					<image class="btn-img" :src="$util.img('/public/img/ruleBtn.png')" mode="aspectFit"></image>
				</view>
				<view class="blind-btn">
					<image @click="openBlind" class="btn-img" :src="$util.img('/public/img/openBtn.png')" mode="aspectFit"></image>
				</view>
			</view>
		</view>

		<!-- <uni-popup ref="blindBoxPopup" type="center">
			<cover-view class="blind-box-wrap">
			</cover-view>
		</uni-popup> -->
		<!-- bgColor="#ff5454" -->
		<wyb-popup @hide="hideBlindBox" ref="blindBoxPopup" type="center" height="400" width="500" radius="6"
			:showCloseIcon="true" :duration="300">
			<view class="blind-box-wrap">
				<view v-if="blindDetail.is_get == 0" class="blind-box-main">
					<text>谢谢参与</text>
				</view>
				<view v-if="blindDetail.is_get == 1" class="blind-box-main">
					<view class="blind-box-main-title">
						<text>恭喜获得{{blindDetail.goods_name}}</text>
					</view>
					<view class="blind-box-main-name">
						<text></text>
					</view>
					<view class="blind-box-main-img-wrap">
						<image class="blind-box-main-img" :src="$util.img(blindDetail.goods_img)" mode="aspectFit">
						</image>
					</view>
				</view>
				<view class="blind-box-btn-wrap">
					<view @click="closeBox" class="blind-box-btn">
						<text>确认</text>
					</view>
				</view>
			</view>
		</wyb-popup>

	</view>
</template>

<script>
	import moment from 'moment';
	import {
		getLotteryApi,
		usersLotteryApi
	} from '@/api/tuanApi.js';

	export default {
		data() {
			return {
				lottery: {
					begin_time: "19:00",
					create_time: 0,
					end_time: "22:00",
					is_open: 1,
					list: [],
					lottery_id: null,
					users_num: 0
				},
				blindDetail: {
					create_time: 0,
					goods_id: null,
					goods_img: "/upload/goods/20220511/202205110449010.png",
					goods_name: "三等奖",
					is_get: 1,
					lottery_id: null,
					users_id: null,
				}
			}
		},
		onLoad(option) {
			this.init();
		},
		methods: {
			init() {
				this.getLottery();
			},
			async getLottery() {
				let res = await getLotteryApi();
				this.lottery = res.data.data;
			},
			async usersLottery() {
				let res = await usersLotteryApi({
					lottery_id: this.lottery.lottery_id
				});
				this.blindDetail = res.data.data;
				// console.log(res)
			},
			openBlind() {
				if (this.lottery.users_num <= 0) {
					this.$util.showToast({
						title: '抽奖次数不足'
					})
					return;
				}
				// let YMD = moment().format('YYYY-MM-DD')
				// let beginTime = moment(this.lottery.begin_time, "HH:mm").format('YYYY-MM-DD HH:mm')
				// let endTime = moment(this.lottery.end_time, "HH:mm").format('YYYY-MM-DD HH:mm')
				// console.log(beginTime)
				// console.log(endTime)
				// if (!moment().isBetween(beginTime, endTime, null, '[)')) {
				// 	this.$util.showToast({
				// 		title: `请在规定时间内操作`
				// 	})
				// 	return;
				// }
				let beginTime = moment(this.lottery.begin_time, "HH:mm")
				let endTime = moment(this.lottery.end_time, "HH:mm")
				let nowTime = new Date()
				if (nowTime < beginTime.valueOf() || nowTime > endTime) {
					this.$util.showToast({
						title: `请在规定时间内操作`
					})
					return;
				}

				this.$util.throttle(() => {
					this.usersLottery();
					this.openBox();
				});
			},
			openBox() {
				this.$refs.blindBoxPopup.show();
			},
			closeBox() {
				this.$refs.blindBoxPopup.hide();
			},
			hideBlindBox() {
				this.getLottery();
			},
			toBlindList() {
				this.$util.redirectTo('/page_my/lotteryList');
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-wrap {
		position: relative;
		background-color: $app-primary-color;
		// background-position: 0 200rpx;
		// background-repeat: no-repeat;
		// background-size: 100% auto;
		// background-image: url(@/static/imgs/blindBg.png);
	}

	.bg-wrap {
		background-color: $app-primary-color;
		padding-top: 200rpx;
		position: relative;

		.bg-img {
			width: 100%;
			height: 1200rpx;
		}
	}

	.my-blind-box {
		position: absolute;
		left: 60rpx;
		bottom: 940rpx;
		z-index: 100;
		width: 420rpx;
		height: 80rpx;
		// background-color: rgba(0,0,0,0.3);
	}

	.gift-show-wrap {
		position: absolute;
		left: 0;
		bottom: 774rpx;
		padding: 0 45rpx 0 42rpx;
		z-index: 100;
		// width: 100%;
		width: 750rpx;
		box-sizing: border-box;
		.gift-img-wrap {
			@extend %flex-center;
			width: 100%;
			height: 100%;

			.gift-img {
				width: 100rpx;
				height: 100rpx;
				background-size: contain;
				background-position: center;
				background-repeat: no-repeat;
			}
		}
	}

	.blind-text-wrap {
		position: absolute;
		left: 0;
		bottom: 280rpx;
		z-index: 100;
		width: 100%;
		@extend %flex-center;
		font-size: $font-26;
		color: $white-color;
	}

	.btn-wrap {
		position: absolute;
		left: 0;
		bottom: 90rpx;
		z-index: 100;
		width: 100%;
		height: 120rpx;
		padding: 0 30rpx;
		// background-color: rgba(0, 0, 0, 0.3);
		display: flex;
		align-items: center;

		.blind-btn {

			@extend %flex-center;
			flex: 1;

			.btn-img {
				height: 120rpx;
				width: 300rpx;
			}
		}
	}

	.blind-box-wrap {
		// background-color: $white-color;
		// width: 600rpx;
		// min-height: 400rpx;
		// position: relative;
		// z-index: 100;
		width: 100%;
		height: 100%;

		position: relative;

		.blind-box-main {
			@extend %flex-center;
			flex-direction: column;
			height: 300rpx;

			.blind-box-main-title {
				color: $app-primary-color;
			}

			.blind-box-main-img-wrap {
				margin-top: 40rpx;

				.blind-box-main-img {
					// background-color: $app-primary-color;
					width: 100rpx;
					height: 100rpx
				}
			}
		}

		.blind-box-btn-wrap {
			@extend %flex-center;

			.blind-box-btn {
				height: 80rpx;
				width: 300rpx;
				border-radius: 60rpx;
				@extend %flex-center;
				background-color: $app-primary-color;
				color: $white-color;
			}
		}
	}
</style>
