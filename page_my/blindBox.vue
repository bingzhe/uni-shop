<template>
	<view class="page-wrap">

		<view class="bg-wrap">
			<image class="bg-img" :src="$util.img('/public/img/choujiang.png')" mode="aspectFill"></image>
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

			<view class="blind-box-show">
				<view v-for="(item,index) in 6" :key="index" class="blind-box-img-wrap"
					:class="{'actived': index==blindBoxIndex}">
					<view v-if="index==blindBoxIndex" class="light-shadow"></view>
					<image class="blind-box-img" src="../static/imgs/blindBox.png" mode="aspectFit"></image>
				</view>
			</view>

			<view class="blind-text-wrap">
				<text>今日剩余抽奖次数：{{lottery.users_num}}</text>
			</view>
			<view class="btn-wrap">
				<view class="blind-btn">
					<image @click="openRule" class="btn-img" :src="$util.img('/public/img/ruleBtn.png')"
						mode="aspectFit"></image>
				</view>
				<view class="blind-btn">
					<image @click="openBlind" class="btn-img" :src="$util.img('/public/img/openBtn.png')"
						mode="aspectFit"></image>
				</view>
			</view>
		</view>

		<!-- <uni-popup ref="blindBoxPopup" type="center">
			<cover-view class="blind-box-wrap">
			</cover-view>
		</uni-popup> -->
		<!-- bgColor="#ff5454" -->
		<wyb-popup @hide="hideBlindBox" ref="blindBoxPopup" type="center" height="800" width="750" radius="6"
			:duration="300" bgColor="transparent">
			<view class="blind-box-popup">
				<view class="fireworks-wrap">
					<image v-if="blindDetail.is_get == 1" class="fireworks-bg" src="/static/imgs/fireworksBg.png" mode="aspectFit"></image>
					<!-- <image class="fireworks-img fireworks-img-left" :animation="fireworksLeft"
						src="/static/imgs/fireworks.png" mode="aspectFit"></image>
					<image class="fireworks-img fireworks-img-right" :animation="fireworksRight"
						src="/static/imgs/fireworks.png" mode="aspectFit"></image> -->
				</view>
				<view class="blind-box-open-blind-img-wrap">
					<view class="blind-box-popup-gift-wrap">
						<image v-if="blindDetail.is_get == 1" class="blind-box-popup-gift-img"
							:src="$util.img(blindDetail.goods_img)" mode="aspectFit">
						</image>
						<image v-if="blindDetail.is_get == 0" class="blind-box-popup-gift-img"
							:src="$util.img('/public/img/xiexie.png')" mode="aspectFit">
						</image>
					</view>
					<view class="open-blind-box-shadow"></view>
					<image class="blind-box-open-blind-img" src="/static/imgs/openBlindBox.png" mode="aspectFit">
					</image>
				</view>

				<!-- <view v-if="blindDetail.is_get == 1" class="blind-box-open-blind-img-wrap">
					<view class="blind-box-popup-gift-wrap">
						<image class="blind-box-popup-gift-img" :src="$util.img(blindDetail.goods_img)" mode="aspectFit">
						</image>
					</view>
					<view class="open-blind-box-shadow"></view>
					<image class="blind-box-open-blind-img" src="/static/imgs/openBlindBox.png" mode="aspectFit">
					</image>
				</view>
				<view v-if="blindDetail.is_get == 0" class="blind-box-open-blind-img-wrap" style="margin-bottom: 60rpx;">
					<text>谢谢参与</text>
				</view> -->
				<view class="blind-box-popup-btn-wrap">
					<view @click="closeBox" class="blind-box-popup-btn">
						<text v-if="blindDetail.is_get == 0">谢谢参与</text>
						<text v-if="blindDetail.is_get == 1">恭喜获得{{blindDetail.goods_name}}</text>
					</view>
				</view>
			</view>
			<!-- <view class="blind-box-wrap">
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
			</view> -->
		</wyb-popup>

		<wyb-popup ref="ruleBoxPopup" type="center" height="400" width="600" radius="6" :duration="300"
			bgColor="transparent">
			<view class="rule-box-wrap">
				<view class="rule-box-header">
					<text class="rule-box-title">盲盒活动规则</text>
				</view>
				<view class="rule-box-body">
					<text>
						1、团到门店消费抵扣券的会员，享一次免费抽盲盒福利。
						2、时间：每天19：00-23：00。
						3、盲盒抽奖1券/机会，过期作废。
						4、抽中礼品将在半个月内发货，享包邮到家（偏远地区除外）。
					</text>
				</view>
				<view class="rule-box-control-wrap">
					<view @click="closeRuleBox" class="rule-box-confirm-btn">
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
	let interval = null;

	export default {
		data() {
			return {
				fireworksLeft: {},
				fireworksRight: {},
				blindBoxIndex: 0,
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
					goods_img: "/upload/goods/20220514/202205140539520.jpg",
					goods_name: "三等奖",
					is_get: 0,
					lottery_id: null,
					users_id: null,
				}
			}
		},
		onLoad(option) {
			this.init();
		},
		onShow() {
			this.fireworksLeft = uni.createAnimation({
				duration: 1000,
				timingFunction: 'ease',
			})
			this.fireworksRight = uni.createAnimation({
				duration: 1000,
				timingFunction: 'ease',
				delay: 400,
			})

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
			openRule() {
				this.openRuleBox();
			},
			openBlind() {
				let intervalTime = 100;
				this.$util.throttle(() => {
					clearInterval(interval);
					interval = setInterval(() => {
						this.blindBoxIndex = this.blindBoxIndex + 1;
						if (this.blindBoxIndex > 5) {
							this.blindBoxIndex = 0;
						}
					}, intervalTime);
				});
				if (this.lottery.users_num <= 0) {
					this.$util.showToast({
						title: '抽奖次数不足'
					})
					return;
				}
				let beginTime = moment(this.lottery.begin_time, "HH:mm")
				let endTime = moment(this.lottery.end_time, "HH:mm")
				let nowTime = new Date()
				if (nowTime < beginTime.valueOf() || nowTime > endTime) {
					this.$util.showToast({
						title: `请在规定时间内操作`
					})
					return;
				}
				setTimeout(() => {
					this.$util.throttle(async () => {
						await this.usersLottery();
						// this.fireworksLeft.rotate(-30).translateX(-50).translateY(-120).step()
						// this.fireworksRight.rotate(30).translateX(50).translateY(-120).step()
						clearInterval(interval);
						this.openBox();
					});
				}, 600)
			},
			openBox() {
				this.$refs.blindBoxPopup.show();
			},
			closeBox() {
				this.$refs.blindBoxPopup.hide();
			},
			hideBlindBox() {
				this.getLottery();
				// this.$refs.blindBoxPopup.hide();
			},

			openRuleBox() {
				this.$refs.ruleBoxPopup.show();
			},
			closeRuleBox() {
				this.$refs.ruleBoxPopup.hide();
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

	.blind-box-popup {
		position: relative;
		height: 100%;
		// background-color: yellow;
		@extend %flex-center;
		flex-direction: column;
		padding-top: 200rpx;
		
		.fireworks-wrap {
			position: absolute;
			left: 0;
			top: 200rpx;
			width: 100%;
			display: flex;
			justify-content: center;
			padding: 0 30rpx;
			.fireworks-bg {
				position: absolute;
				top: -240rpx;
				left: 10rpx;
				width: 100%;
				height: 540rpx;
				// background-color: yellow;
				// height: 300rpx;
			}
			.fireworks-img {
				width: 300rpx;
				height: 300rpx;
				position: absolute;
			}

			// .fireworks-img-left {
			// 	// transform: rotate(-30deg);
			// 	transition-property: all;
			// 	transition-duration: 10s;
			// }

			// .fireworks-img-right {
			// 	// transform: rotate(30deg);
			// 	transition-property: all;
			// 	transition-duration: 10s;
			// }
		}

		.blind-box-popup-btn-wrap {
			margin-top: 10rpx;

			.blind-box-popup-btn {
				padding: 12rpx 30rpx;
				border-radius: 30rpx;
				font-size: 24rpx;
				color: #ffffff;
				background-color: #ff3f3f;
			}
		}

		.blind-box-open-blind-img-wrap {
			// background-color: red;
			position: relative;
			font-size: 48rpx;
			letter-spacing: 6rpx;
			color: $app-primary-color;

			.blind-box-popup-gift-wrap {
				top: -160rpx;
				right: -0rpx;
				position: absolute;

				.blind-box-popup-gift-img {
					width: 180rpx;
					height: 180rpx;
				}
			}

			.open-blind-box-shadow {
				position: absolute;
				width: 10rpx;
				height: 10rpx;
				z-index: 1;
				box-shadow:
					120rpx 10rpx 80rpx 70rpx rgba(#fef0d2, 0.6),
					100rpx 10rpx 80rpx 10rpx rgba(#dfa557, 0.8),
					160rpx 10rpx 80rpx 10rpx rgba(#dfa557, 0.8);
			}
		}

		.blind-box-open-blind-img {
			width: 200rpx;
			height: 200rpx;
		}
	}

	.blind-box-show {
		position: absolute;
		top: 580rpx;
		width: 100%;
		background-color: rgba(yellow, 0.3);
		height: 400rpx;
		padding: 10rpx 30rpx 0 70rpx;

		.blind-box-img-wrap {
			display: inline-flex;
			box-sizing: border-box;
			justify-content: center;
			align-items: center;
			width: 200rpx;
			height: 180rpx;
			position: relative;
			&.actived {
				// background-image: radial-gradient(circle, transparent, yellow, transparent);
				// background-color: yellow;
				.blind-box-img {
					// box-shadow: yellow 10rpx -10rpx 10rpx 10rpx;
					width: 156rpx;
					height: 156rpx;
				}
			}
			.light-shadow {
				// position: absolute;
				// width: 180rpx;
				// height: 180rpx;
				// background-image: radial-gradient(rgba(yellow, 0.1) 5%, rgba(yellow, 0.4) 60%, transparent 100%);
				// animation: pointMove 2.5s infinite alternate linear;
				position: absolute;
				width: 10rpx;
				height: 10rpx;
				border: 50%;
				box-shadow:
					20rpx 10rpx 80rpx 70rpx rgba(#fef0d2, 0.6),
					20rpx 10rpx 80rpx 10rpx rgba(#dfa557, 0.8),
					20rpx 10rpx 80rpx 10rpx rgba(#dfa557, 0.8);
				// box-shadow:
				// 	20rpx 0rpx 100rpx 80rpx rgba(yellow, 0.6);
			}
		}
		.blind-box-img {
			width: 140rpx;
			height: 140rpx;
		}
	}

	.rule-box-wrap {
		width: 100%;
		height: 100%;
		background-color: #ff7b32;
		border: 10rpx solid #ffe5b5;
		border-radius: 24rpx;
		color: #ffffff;
		.rule-box-header {
			height: 80rpx;
			@extend %flex-center;
			font-size: $font-32;
			font-weight: bold;
			.rule-box-title {}
		}
		.rule-box-body {
			font-size: $font-24;
			padding: 0 30rpx;
			line-height: 36rpx;
		}
		.rule-box-control-wrap {
			padding-top: 10rpx;
			@extend %flex-center;
			.rule-box-confirm-btn {
				background-color: #ffe5b5;
				color: #ff7b32;
				font-size: $font-28;
				height: 50rpx;
				width: 120rpx;
				@extend %flex-center;
				border-radius: 30rpx;
			}
		}
	}

	.bg-wrap {
		background-color: $app-primary-color;
		padding-top: 100rpx;
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
