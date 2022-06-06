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

		<view class="goods-bar flex-title"
			:style="{'background-image': 'url('+$util.img('public/img/detail_bar_left.png')+')'}">
			<view class="goods-bar-left">
				<view class="bar-info flex-center-y">
					<image class="bar-logo" :src="$util.img('public/img/detail_pintuan_tag.png')" mode="aspectFit">
					</image>
					<view class="bar-team-num flex-center-y">
						<view class="num-value">{{detail.team_num}}</view>
						<view class="num-text">人团</view>
					</view>
				</view>
				<view class="">
				</view>
			</view>
			<view class="goods-bar-right"
				:style="{'background-image': 'url('+$util.img('public/img/detail_bar_right.png')+')'}">
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

		<view class="goods-detail-card padding-all">
			<view class="goods-price-line flex-center-y">
				<view class="goods-price-tags">
					<text>参团价</text>
				</view>
				<view class="goods-price">
					<text>{{detail.price}}</text>
				</view>
				<view class="goods-old-price">
					<text>原价：</text>
					<text>{{detail.goods_price}}</text>
				</view>
			</view>
			<view class="goods-name-line">
				<view>{{detail.goods_name}}</view>
				<view class="goods-detail">{{detail.subtitle}}</view>
				<!-- <view>餐饮抵用券</view>
				<view class="goods-detail">门店消费抵扣券（全国通用）</view> -->
			</view>
			<view class="goods-other-line flex-title" v-if="detail.sales == 1">
				<view class="goods-other-left">
					<text>快递 卖家承担</text>
				</view>
				<view class="goods-other-right">
					<text>销量{{detail.sales}}件</text>
				</view>
			</view>
			<view class="goods-other-line flex-title" v-else>
				<view class="active">已激活：{{detail.sales}}</view>
				<view class="destory">已核销：{{detail.verify_num}}</view>
				<view class="residue">剩余：{{detail.stock-detail.sales}}</view>
			</view>
		</view>

		<view class="shop-list">
			<view class="shop-list-top" v-if="detail.goods_class==2">
				<view class="viewMore" @click="viewMoreFun">查看更多</view>
				<uni-icons type="top" size="28" v-if="isViewMore" color="red"></uni-icons>
				<uni-icons type="bottom" size="28" v-else color="red"></uni-icons>
			</view>
			<view @click="toShopHtml(item, index)" class="shop-item flex-center-y"
				v-for="(item, index) in list" :key="index">
				<image class="shop-img" :src="$util.img(item.logo)" mode="aspectFit"></image>
				<view class="shop-detail">
					<view class="shop-detail-left">
						<view class="shop-detail-name">
							<text>{{item.shop_name}}</text>
						</view>
						<view class="shop-detail-site">
							<text v-if="item.distance>0">{{item.distance}}km</text>
							<text v-if="item.distance>0" style="margin: 0 10rpx;">|</text>
							<text>{{item.full_address}}{{item.address}}</text>
						</view>
					</view>
					<view class="shop-detail-right">
						<view class="shop-map-btn" @click.stop="openMap(item, index)">
							<text>打开地图</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="goods-html">
			<rich-text :nodes="detail.goods_info"></rich-text>
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
		groupDetailApi,
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
				url:'',
				detail: {
					begin_time: null,
					create_time: null,
					end_time: null,
					sales: null,
					goods_class: null, // 1 实物 2 虚拟
					goods_id: null,
					goods_img: "",
					goods_info: "",
					goods_name: "",
					goods_price: "",
					group_id: null,
					img_list: [],
					is_delete: null,
					price: "",
					shop_list: [],
					status: null,
					team_num: null,
					// shop_list: []
				},
				list: [], // 详情默认显示10个商家
				isViewMore: false // 判断 显示10/显示全部
			}
		},
		onLoad(option) {
			if (option.group_id) {
				this.group_id = option.group_id;
			}
			this.groupDetail();
			// console.log(this.detail)
			
		},
		methods: {
			moment,
			init() {
				this.groupDetail();
			},
			initCountDown() {
				// console.log('end_time:',this.detail.end_time * 1000);
				// console.log('new Date():',new Date().getTime());
				let time = moment(this.detail.end_time * 1000).valueOf() - new Date().getTime()
				// console.log(time);
				// var showMonth = moment.duration(time).months()
				// console.log(showMonth);
				// this.showDay = moment.duration(time).days();
				// console.log(this.showDay);
				// this.showHour = moment.duration(time).hours();
				// console.log(this.showHour);
				// this.showMinute = moment.duration(time).minutes();
				// console.log(this.showMinute);
				// this.showSecond = moment.duration(time).seconds();
				// console.log(this.showSecond);
				this.showDay = Math.floor(time / 1000 / 60 / 60 / 24)
				this.showHour = Math.floor(time / 1000 / 60 / 60 % 24)
				this.showMinute = Math.floor(time / 1000 / 60 % 60)
				this.showMinute = Math.floor(time / 1000 % 60)
			},
			async groupDetail() {
				let _location = uni.getStorageSync('location')
				let res = await groupDetailApi({
					group_id: this.group_id,
					longitude: _location.longitude || 114.92085,
					latitude: _location.latitude || 25.81751,
				});
				this.detail = res.data.data;
				var title = this.detail.goods_name;
				uni.setNavigationBarTitle({
				    title: title
				});
				// 默认显示10个门店
				if(this.detail.shop_list)this.list = this.detail.shop_list.length>10? this.detail.shop_list.slice(0,10):this.detail.shop_list
				
				// var reg = /\/h5/ig
				// this.detail.goods_info = this.detail.goods_info.replaceAll(reg,'/')
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
					// ...this.detail
					group_id: this.detail.group_id,
					goods_class: this.detail.goods_class,
					order_price: this.detail.price,
					goods_img: this.detail.goods_img,
					price: this.detail.goods_price
				});
			},

			// 打开地图
			openMap(item, index) {
				const lat =item.latitude;
				const lon = item.longitude;
				console.log(lat);
				console.log(lon);
				// uni.openLocation({
				// 	// name: item.site_name,
				// 	// address: item.full_address + item.address,
				// 	// latitude: +item.latitude,
				// 	// longitude: +item.longitude,
				// 	latitude: parseFloat(lat),
				// 	longitude: parseFloat(lon),
				// 	success: function () {
				// 	console.log('success');
				// 	}
				// });
				// var _this = this
				// console.log(this)
				  // this.$jsonp('https://apis.map.qq.com/ws/geocoder/v1/?', {
				  //   location: lat + ',' + lon, // 经纬度
				  //   key: 'V74BZ-Z5OCD-3AU4J-PCWL2-GRUQ6-FLFP4', // 创建应用的钥匙
				  //   output: 'jsonp' ,// output必须jsonp   不然会超时
				  // }).then(res => {
				  //   console.log(res, '腾讯地图')
				  // })
				  uni.navigateTo({
				     url: '/pages/goods/webView?url=https://3gimg.qq.com/lightmap/v1/marker/?marker=coord:'+lat+','+lon+'&referer=myApp&key=V74BZ-Z5OCD-3AU4J-PCWL2-GRUQ6-FLFP4'
				  })
				
			},
			async toShopHtml(item, index) {
				this.$util.redirectTo('/pages/goods/goods_rich', {
					shop_id: item.shop_id
				})
			},
			viewMoreFun() {
				// debugger
				this.isViewMore = !this.isViewMore
				this.$util.showToast({
					title: '加载中',
					icon: 'loading',
					duration: '200'
				})
				if(this.isViewMore) { // 显示全部
					this.list = this.detail.shop_list
				}else{
					this.list = this.detail.shop_list.length>10? this.detail.shop_list.slice(0,10):this.detail.shop_list
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.goods-html {
		margin: 30rpx 30rpx;
	}

	.shop-list {
		padding: 20rpx;
		
		.shop-list-top {
			margin-bottom: 10rpx;
			padding-right: 8rpx;
			color: #ff0000;
			
			display: flex;
			flex-direction: row;
			justify-content: flex-end;
		}
		
		.viewMore {
			font-size: 38rpx;
		}

		.shop-item {
			background-color: $white-color;
			padding: 20rpx;
			border-radius: 16rpx;

			.shop-img {
				height: 120rpx;
				width: 120rpx;
				background-color: #eee;
				border-radius: 16rpx;
			}

			.shop-detail {
				flex: 1;
				display: flex;
				justify-content: space-between;

				.shop-detail-left {
					margin-left: 20rpx;
					width: 360rpx;
					font-size: $font-28;

					.shop-detail-name {
						font-size: 32rpx;
						line-height: 50rpx;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}

					.shop-detail-site {
						color: gray;
						line-height: 50rpx;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}
				}

				.shop-detail-right {
					@extend %flex-center;

					.shop-map-btn {
						font-size: $font-28;
						height: 50rpx;
						line-height: 50rpx;
						background-color: rgba($color: #007AFF, $alpha: 0.2);
						color: #007AFF;
						padding: 0 20rpx;
						border-radius: 30rpx;

						&:active {
							background-color: rgba($color: #007AFF, $alpha: 0.3);
						}
					}
				}
			}
		}
	}


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

	$slid-height: 520rpx;

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
		// background-image: url(@/static/imgs/detail_bar_left.png);
		background-position: center;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		color: $white-color;
		font-size: $font-24;

		.goods-bar-left {
			.bar-logo {
				height: 33rpx;
				width: 107rpx;
			}

			.bar-team-num {
				@extend %flex-center;
				box-sizing: border-box;
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
			padding: 0 20rpx;
			width: 320rpx;
			height: 100%;
			// background-image: url(@/static/imgs/detail_bar_right.png);
			background-position: center;
			background-repeat: no-repeat;
			background-size: cover;

			.goods-bar-right-label {
				width: 100%;
				@extend %flex-center;
				color: $app-primary-color;
				margin: 10rpx 0 10rpx;
			}

			.goods-bar-right-value {
				width: 100%;
				@extend %flex-center;
			}
		}
	}

	.goods-detail-card {
		background-color: $white-color;

		.goods-price-line {
			.goods-price-tags {
				background-color: $app-primary-color;
				color: $white-color;
				font-size: $font-24;
				padding: 6rpx 10rpx 6rpx 16rpx;
				border-radius: 20rpx 0 0 20rpx;
			}

			.goods-price {
				color: $app-primary-color;
				font-size: 40rpx;
				font-weight: bold;
				margin: 0 20rpx;
			}

			.goods-old-price {
				font-size: $font-24;
			}
		}

		.goods-name-line {
			font-size: $font-32;
			font-weight: bold;
			margin: 20rpx 0;
			
			
			view {
				display: inline-block;
			}
			
			
			.goods-detail {
				width: 240rpx;
				font-size: $font-24;
				color: #696bcf;
				margin-left: 24rpx;
				vertical-align: middle;
			}
		}

		.goods-other-line {
			font-size: $font-24;
			color: $gray-color;
		}
	}
</style>
