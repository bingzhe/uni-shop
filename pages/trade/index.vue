<template>
	<view class="page-wrap">
			<view class="my-wrap padding-y">
				<view id="sortNav" class="sortNav acea-row row-middle" style="width: 100%;height: 100rpx;background-color: white;">
					<view class="sortNav-item" v-for="(item,index) in navbarList" :key="index">
						<view class="sortNav-item-title">{{item}}</view>
						<view class="sortNav-item-option">
							<view class="item-option-top">
								<view class="top-btn" @click="sortTradeList(index,1)"></view>
							</view>
							<view class="item-option-bottom">
								<view class="bottom-btn" @click="sortTradeList(index,0)"></view>
							</view>
						</view>
					</view>
				</view>
				<view class="shop-list" v-if="tradeList.length>0">
					<view class="shop-list-item" v-for="(item, index) in tradeList" :key="index">
							<view class="shop-list-item-header">
								<uni-countdown color="#FFFFFF" background-color="#ff5454" :show-day="false" :day="item.endDay" :hour="item.endHour" :minute="item.endMinute" :second="item.endSecond"></uni-countdown>
							</view>
							<view class="shop-list-item-content">
								<view class="list-item-img">
									<img :src="$util.img(item.image_url)" alt="">
								</view>
								<view class="list-item-info">
									<view class="info-top">
										<view class="info-top-user">
											<view class="info-top-icon">
												<uni-icons type="person-filled" size="18"></uni-icons>
											</view>
											<view class="info-top-name">{{item.username}}</view>
										</view>
										<view class="info-top-opt">
											<view class="btn" @click="openWs(item)">购买</view>
										</view>
									</view>
									<view class="info-bottom">
										<view class="info-bottom-detail">
											<view class="info-bottom-ticket">
												<view class="ticket-num">{{item.num}}</view>
												<view class="ticket-title">通用券数量</view>
											</view>
										</view>
										<view class="info-bottom-detail">
											<view class="info-bottom-price">
												<view class="price-num">{{item.unit_price}}</view>
												<view class="price-title">单价</view>
											</view>
										</view>
										<view class="info-bottom-detail">
											<view class="info-bottom-total">
												<view class="total-num">{{item.price}}</view>
												<view class="total-title">总额</view>
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
				<view style="width: 100rpx;height: 100rpx;border-radius: 90%;position: fixed;right: 80rpx;bottom: 150rpx;" @click="releaseMy()">
					<image src="../../static/imgs/add.png" style="width: 100rpx;height: 100rpx;"></image>
				</view>
			</view>
		<uni-popup ref="popupPwd" type="center" :is-mask-click="false">
			<view class="phonePopup">
				<view class="phonePopup_sj">
					<view style="margin-right: 20rpx;">转让通用券数量：</view>
					<input v-model="pupParam.num" type="number" maxlength="11" placeholder="请输入"
						placeholder-style="font-size: 28rpx;" disabled="true" />
				</view>
				<view class="phonePopup_sj">
					<view style="margin-right: 20rpx;">当前余额：</view>
					<input v-model="pupParam.money" disabled='true' type="number" maxlength="11" placeholder="请输入"
						placeholder-style="font-size: 28rpx;" />
				</view>
				<view class="phonePopup_sj">
					<view style="margin-right: 20rpx;">支付余额：</view><br>
					<input v-model="pupParam.price"  disabled='true' type="text" placeholder="请输入"
						placeholder-style="font-size: 28rpx;" />
				</view>
				<view class="phonePopup_sj">
					<view style="margin-right: 20rpx;">登录密码：</view><br>
					<input v-model="form.password" type="password" placeholder="请输入"
						placeholder-style="font-size: 28rpx;" />
				</view>
				<view class="butBox">
					<button class="but but_determine" @click="trade()">确定</button>
					<button class="but but_close" @click="closePopupPwd()">关闭</button>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="popupRelase" type="center" :is-mask-click="false">
			<view class="phonePopup">
				<view class="phonePopup_sj">
					<view style="margin-right: 20rpx;">转让账号：</view>
					<input v-model="this.userInfo.username" type="text" placeholder="请输入"
						placeholder-style="font-size: 28rpx;" disabled="true" />
				</view>
				<view class="phonePopup_sj">
					<view style="margin-right: 20rpx;">可用通用券：</view>
					<input v-model="tradeInfo.valid_num" type="number" maxlength="11" placeholder="请输入"
						placeholder-style="font-size: 28rpx;" disabled="true" />
				</view>
				<view class="phonePopup_sj">
					<view style="margin-right: 20rpx;">转让通用券数量：</view><br>
					<input v-model="releaseForm.num"　@input="inputChange" type="text" placeholder="请输入"
						placeholder-style="font-size: 28rpx;" />
				</view>
				<view class="phonePopup_sj">
					<view style="margin-right: 20rpx;">转让单价：</view><br>
					<input v-model="releaseForm.unit_price" type="number" @input="inputChange" placeholder="请输入"
						placeholder-style="font-size: 28rpx;" />
				</view>
				<view class="phonePopup_sj">
					<view style="margin-right: 20rpx;">转让总额：</view><br>
					<input v-model="releaseForm.price" type="number" placeholder="请输入"
						placeholder-style="font-size: 28rpx;" disabled="true" />
				</view>
				<view class="phonePopup_sj">
					<view style="margin-right: 20rpx;">登录密码：</view><br>
					<input v-model="releaseForm.password" type="password" placeholder="请输入"
						placeholder-style="font-size: 28rpx;" />
				</view>
				<view class="butBox">
					<button class="but but_determine" @click="confirmRelease()">确定</button>
					<button class="but but_close" @click="closePopupRelase()">关闭</button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		mapActions,
		mapMutations
	} from 'vuex';
	import config from '@/common/config.js'
	import {
		tradeList,
		trade,
		myTrade,
		releaseMy
	} from '@/api/tuanApi.js'
	import {
		userInfoApi,
	} from '@/api/userApi.js'
	
	import moment from 'moment'

	export default {
		// 下拉加载
		onPullDownRefresh() {
			this.getTradeList();
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		data() {
			return {
				fixedState: false,
				// 发布交易提交表单
				releaseForm: {
					num: '',
					unit_price: '',
					price: '',
					password: ''
				},
				// 购买提交表单
				form: {
					market_id: '',
					price: '',
					password: ''
				},
				pupParam: {
					num: '', // 交易数量
					money: '', // 当前余额
					price: ''
				},
				tradeInfo: {},
				userInfo: {},
				isMember: false,
				portraitImg: '',
				control_list: [
					[{
						src: '/static/imgs/my/control-icon1.png',
						text: '我参与的',
						link: '/page_my/myInvolved',
						check_login: true
					}],
				],
				tradeList: [],
				scrollHeight: 300, // 用于获取屏幕高度
				refreshSuccessText: '刷新成功', // 用于显示刷新后文字
				noMore: true, // 上拉加载
				searchParams: {
					order: 0,
					by: 1
				},
				navbarList: ['综合','单价','数量']
			}
		},

		onLoad(option) {
			if(!uni.getStorageSync('userInfo')) {
				this.$util.redirectTo('/pages/login/login','reLaunch')
			}
			this.getTradeList();
		},
		methods: {
			// 输入确认总价
			inputChange() {
				this.releaseForm.price = this.releaseForm.unit_price * this.releaseForm.num;
			},
			//确认发布
			async confirmRelease() {
				var data = this.releaseForm;
				if (data.num > this.tradeInfo.valid_num) {
					this.$util.showToast({
						title: '售卖数量超出可用'
					})
				}
				let res = await releaseMy({
					num: data.num,
					unit_price: data.unit_price,
					price: data.price,
					password: data.password
				});
				this.closePopupRelase()
				this.getTradeList()
			},
			// 获取我的券信息
			async getMyTrade() {
				let res = await myTrade();
				// debugger
				this.tradeInfo = res.data.data;
			},
			// 发布我的交易
			releaseMy() {
				this.releaseForm = {};
				this.tradeInfo = {};
				this.$refs.popupRelase.open();
				this.getMyMoney();
				this.getMyTrade();
			},
			// 确认交易
			async trade() {
				// console.log(this.form);
				const data= this.form;
				const price =data.price;
				const money = this.pupParam.money;
				const psd = this.form.password;
				if(psd ==''){
					this.$util.showToast({
						title: '请输入交易密码'
					})
					return
				}
				if (price-money>0) {
					this.$util.showToast({
						title: '可用余额不足'
					})
					return
				}
				let res = await trade({
					market_id: data.market_id,
					price: data.price,
					password: data.password
				});
				if(res.data.code == 200) {
					this.$util.showToast({
						title:"转让成功"
					})
				}
				this.closePopupPwd()
				this.getTradeList()
				
			},
			// 打开交易弹窗
			openWs(item) {
				this.form={};
				this.$refs.popupPwd.open();
				this.pupParam.num = item.num;
				console.log(item)
				this.pupParam.price = item.price;
				this.getMyMoney();
				console.log(this.pupParam.money);
				this.form.market_id = item.market_id;
				this.form.price = item.price;
			},
			// 获取我的余额
			async getMyMoney() {
				let res = await userInfoApi()
				this.pupParam.money = res.data.data.balance_money;
				this.userInfo = res.data.data;
				// debugger
			},
			async init() {
			},
			async getTradeList() {
				let res = await tradeList();
				this.tradeList = res.data.data;
				this.tradeList = this.formatEndCountdown(this.tradeList,'end_time')
				// debugger
			},
			controlClick(item, index) {
				if (item.check_login) {
					if (!this.$util.checkLogin()) {
						this.$util.redirectTo('/pages/login/login', undefined, 'reLaunch');
						return;
					}
				}

				if (item.link) {
					// debugger
					let is_partner = this.userInfo.is_partner;
					if (index == 6) {
						if (is_partner == 1) {
							console.log(1)
							this.$util.redirectTo(item.link1);
							// console.log(item.link1)
							return;
						}
					}
					// console.log(2);
					this.$util.redirectTo(item.link);
				} else {
					this.$util.showToast({
						title: `${item.text}正在开发中...`
					})
				}
			},
			// 明细
			detail(e) {
				if (!this.$util.checkLogin()) {
					this.$util.redirectTo('/pages/login/login', undefined);
					return;
				}
				this.$util.redirectTo('/page_my/userBillDetail', {
					type: e
				});
			},
			closePopupPwd() {
				// TODO 做一些其他的事情，before-close 为true的情况下，手动执行 close 才会关闭对话框
				// ...
				this.$refs.popupPwd.close()
			},
			closePopupRelase() {
				// TODO 做一些其他的事情，before-close 为true的情况下，手动执行 close 才会关闭对话框
				// ...
				this.$refs.popupRelase.close()
			},
			sortTradeList(index,sort) {
				this.$nextTick( async  ()=>{
					this.searchParams.by = sort
					this.searchParams.order = index
					let res = await tradeList(this.searchParams);
					this.tradeList = res.data.data;
					this.tradeList = this.formatEndCountdown(this.tradeList,'end_time')
				})
			},
			formatEndCountdown(list, key) { // 待付款倒计时
				let nowTime = new Date().getTime();
				if (!Array.isArray(list)) {
					return [];
				}
				list = list.map(item => {
					let time = moment(item[key]*1000).valueOf() - nowTime;
					return Object.assign(item, {
						endDay: moment.duration(time).days(),
						endHour: moment.duration(time).hours(),
						endMinute: moment.duration(time).minutes(),
						endSecond: moment.duration(time).seconds(),
						endTime: item[key] - new Date()
					})
				});
				return list;
			},
		}
	}
</script>

<style lang="scss" scoped>
	// @import '@/pages/my/css/my.scss';
	.iconImag{
		width: 30rpx;
		height: 30rpx;
	}
	.phonePopup {
		width: 600rpx;
		// height: 500rpx;
		border-radius: 20rpx;
		background-color: #fff;
		padding: 60rpx 30rpx;

		.phonePopup_sj {
			position: relative;
			display: flex;
			border-bottom: 1rpx solid #ece9ed;
			height: 70rpx;
			margin-bottom: 60rpx;
			font-size: 28rpx;
			padding-left: 10rpx;

			.btn {
				position: absolute;
				right: 0rpx;
				top: -20%;
			}
		}

		.switch {
			width: 100%;
			text-align: right;
			font-size: 24rpx;
			color: $red-color;
			margin-bottom: 60rpx;
		}

		.butBox {
			display: flex;
			flex-direction: row;
			justify-content: space-around;

			.but {
				min-width: 30%;
				height: 80rpx;
				font-size: 28rpx;
				line-height: 80rpx;
				border-radius: 40rpx;
				border: none;
			}

			.but_determine {
				color: #fff;
				background-color: $app-primary-color;
			}
			.but_close {
				color: #fff;
				background-color: #666;
			}
		}
	}

	.shop-list {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		// background-color: lightblue;
		
		.shop-list-item {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			padding: 30rpx;
			margin: 10rpx;
			margin-top: 20px;
			background-color: #ffffff;
			border-radius: 20rpx;
			box-shadow: 0rpx 0rpx 4rpx 0rpx rgba(0, 0, 0, 0.5);
			
			.shop-list-item-header {
				margin-bottom: 20rpx;
			}
			.shop-list-item-content {
				display: flex;
				flex-direction: row;
				justify-content: flex-start;
				
				.list-item-img {
					width: 160rpx;
					height: 160rpx;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					img {
						width: 100%;
						height: 100%;
						border-radius: 20rpx;
					}
				}
				.list-item-info {
					flex: auto;
					margin-left: 20rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					
					.info-top {
						display: flex;
						flex-direction: row;
						justify-content: space-between;
						align-items: center;
						
						.info-top-user {
							display: flex;
							flex-direction: row;
							justify-content: space-between;
							align-items: center;
							
							.info-top-icon {}
							.info-top-name {
								
								margin-left: 10rpx;
							}
						}
						.info-top-opt {
							// margin-left: 200rpx;
							.btn {
								color: #fff;
								background-color: #ff5454;
								padding: 4rpx 40rpx;
								border-radius: 20rpx;
							}
						}
					}
					.info-bottom {
						display: flex;
						flex-direction: row;
						align-items: center;
						
						.info-bottom-detail {
							width: 33%;
							.info-bottom-ticket {
								display: flex;
								flex-direction: column;
								justify-content: flex-start;
								align-items: center;
								border-right: 2rpx solid #cccccc;
								.ticket-num {
									font-weight: bold;
								}
								.ticket-title {
									font-size: 24rpx;
									color: #999999;
								}
							}
							.info-bottom-price {
								display: flex;
								flex-direction: column;
								justify-content: flex-start;
								align-items: center;
								border-right: 2rpx solid #cccccc;
								.price-num {
									font-weight: bold;
								}
								.price-title {
									font-size: 24rpx;
									color: #999999;
								}
							}
							.info-bottom-total {
								display: flex;
								flex-direction: column;
								justify-content: flex-start;
								align-items: center;
								border-right: 2rpx solid #cccccc;
								.total-num {
									font-weight: bold;
								}
								.total-title {
									font-size: 24rpx;
									color: #999999;
								}
							}
						}
					}
				}
			}
		}
	}

	.vip {
		width: 70rpx;
		height: 40rpx;
		margin-left: 10rpx;
		line-height: 35rpx;
		text-align: center;
		border-radius: 20rpx;
		font-size: 18rpx;
		border: 1rpx solid #ffea00;
	}

	.other_text {
		width: 40rpx;
		height: 40rpx;
		line-height: 40rpx;
		text-align: center;
		border-radius: 100%;
		background-color: $red-color;
		margin-right: 30rpx;
		font-size: 26rpx;
		color: #fff;
	}

	.my-wrap {
		padding-top: 30rpx;
	}

	.user-info {
		position: relative;
		height: 360rpx;
		color: $white-color;

		.user-info-header {
			height: 100rpx;
			border-radius: 16rpx 16rpx 0 0;
			padding: 0 30rpx;
			background-color: $app-primary-color;

			.user-avatar-wrap {
				.user-avatar {
					background-color: $user-avatar-color;
					width: 60rpx;
					height: 60rpx;
					border-radius: 50%;
				}
			}

			.user-text {
				margin-left: 20rpx;

				.user-name {
					height: 50rpx;
					line-height: 50rpx;
					font-size: $font-28;
					font-weight: bold;
				}
			}
		}

		.user-info-body {
			width: 100%;
			height: 200rpx;
			background-color: $app-primary-color;
			margin-top: -2rpx;

			.user-info-blance {
				text-align: center;

				.user-info-blance-label {
					font-size: $font-24;
				}

				.user-info-blance-value {
					line-height: 90rpx;
					font-size: 48rpx;
					font-weight: bold;
				}
			}

			.user-info-treasure {
				@extend %flex-center-y;

				.user-blance {
					@extend %flex-center;
					font-size: $font-26;
					flex: 1;
				}

				.user-integral {
					@extend %flex-center;
					font-size: $font-26;
					flex: 1;
				}
			}
		}

		.user-info-bottom {
			@extend %flex-center-y;
			position: absolute;
			bottom: 0;
			width: 100%;
			height: 80rpx;
			background-color: $white-color;
			border-radius: 0 0 16rpx 16rpx;

			.user-treasure {
				height: 100%;
				flex: 1;
				@extend %flex-center;
				color: $app-primary-color;
				font-size: $font-32;
			}
		}
	}

	.member-card {
		padding: 20rpx 30rpx;
		border-radius: 60rpx;
		background-color: $member-card-color;
		color: $member-card-text-color;

		>.main {
			font-size: $font-32;
			font-weight: bold;
		}

		>.other {
			font-size: $font-28;
			position: relative;
			margin-right: 20rpx;

			&::after {
				position: absolute;
				right: -20rpx;
				content: '';
				width: 16rpx;
				height: 16rpx;
				border-right: 1rpx solid $member-card-text-color;
				border-top: 1rpx solid $member-card-text-color;
				transform: rotate(45deg);
			}
		}
	}

	.control-list {
		margin-top: 30rpx;
		background-color: $white-color;
		border-radius: 16rpx;
		margin-bottom: 30rpx;

		.control-item {
			height: 100rpx;
			overflow: hidden;
			position: relative;
			@extend %flex-center-y;
			justify-content: space-between;

			.control-icon {
				width: 32rpx;
				margin-right: 20rpx;
			}

			&::after {
				position: absolute;
				right: 30rpx;
				content: '';
				width: 16rpx;
				height: 16rpx;
				border-right: 1rpx solid #000000;
				border-top: 1rpx solid #000000;
				transform: rotate(45deg);
			}
		}
	}



	.user-treasure {
		.user-treasure-item {
			flex: 1;
			color: $font-color;
			font-size: $font-26;
			border-right: 1rpx solid $gray-color;
			height: 30rpx;

			.user-treasure-icon {
				height: 36rpx;
				width: 60rpx;
				margin-right: 20rpx;
			}

			.user-treasure-value {
				color: $red-color;
				font-size: $font-36;
			}
			
			.promoter-list .header {
				padding-bottom: 0.12 * 100rpx;
			}
			
			.promoter-list .nav {
				background-color: #fff;
				height: 0.86 * 100rpx;
				line-height: 0.86 * 100rpx;
				font-size: 0.28 * 100rpx;
				color: #282828;
				border-bottom: 1px solid #eee;
			}
			
			.promoter-list .nav .item {
				height: 100%;
			}
			
			.promoter-list .nav .item.on {
				color: #23AAE2;
				border-bottom: 0.05 * 100rpx solid #23AAE2;
			}
			
			.promoter-list .search {
				margin-top: 30rpx;
				box-sizing: border-box;
			
				width: 100%;
				background-color: #fff;
				height: 0.86 * 100rpx;
				padding: 0 0.3 * 100rpx;
			}
			
			.promoter-list .search .input {
				width: 6.3 * 100rpx;
				height: 0.6 * 100rpx;
				border-radius: 0.5 * 100rpx;
				background-color: #f5f5f5;
				text-align: center;
				position: relative;
			}
			
			.promoter-list .search .input input {
				height: 100%;
				font-size: 0.26 * 100rpx;
				width: 6.2 * 100rpx;
				text-align: center;
			}
			
			.promoter-list .search .input input::placeholder {
				color: #bbb;
			}
			
			.promoter-list .search .input .iconfont {
				position: absolute;
				right: 0.28 * 100rpx;
				color: #999;
				font-size: 0.28 * 100rpx;
				top: 50%;
				transform: translateY(-50%);
			}
			
			.promoter-list .search .iconfont {
				font-size: 0.4 * 100rpx;
				color: #515151;
			}
			
			
			
			.promoter-list .list .sortNav.on {
				position: fixed;
				top: 0;
				left: 0;
				width: 100%;
				z-index: 5;
			}
			
			.promoter-list .list .sortNav .sortItem {
				text-align: center;
				flex: 1;
				-o-flex: 1;
				-ms-flex: 1;
			}
			
			.promoter-list .list .sortNav .sortItem image {
				width: 0.24 * 100rpx;
				height: 0.24 * 100rpx;
				margin-left: 0.06 * 100rpx;
				vertical-align: -0.03 * 100rpx;
			}
			
			.promoter-list .list .sortList {
				margin-top: 0.76 * 100rpx;
			}
			
			.promoter-list .list .item {
				background-color: #fff;
				border-bottom: 1px solid #eee;
				height: 1.52 * 100rpx;
				padding: 0 0.3 * 100rpx 0 0.2 * 100rpx;
				font-size: 0.24 * 100rpx;
				color: #666;
			}
			
			.promoter-list .list .item .picTxt {
				width: 4.4 * 100rpx;
			}
			
			.promoter-list .list .item .picTxt .pictrue {
				width: 1.06 * 100rpx;
				height: 1.06 * 100rpx;
				border-radius: 50%;
			}
			
			.promoter-list .list .item .picTxt .pictrue image {
				width: 100%;
				height: 100%;
				border-radius: 50%;
				border: 0.03 * 100rpx solid #fff;
				box-shadow: 0 0 0.07 * 100rpx #aaa;
				-moz-box-shadow: 0 0 0.07 * 100rpx #aaa;
				-o-box-shadow: 0 0 0.07 * 100rpx #aaa;
				-moz-box-sizing: border-box;
				box-sizing: border-box;
			}
			
			.promoter-list .list .item .picTxt .text {
				width: 3.04 * 100rpx;
				font-size: 0.24 * 100rpx;
				color: #666;
			}
			
			.promoter-list .list .item .picTxt .text .name {
				font-size: 0.28 * 100rpx;
				color: #333;
				margin-bottom: 0.13 * 100rpx;
			}
			
			.promoter-list .list .item .right {
				width: 2.4 * 100rpx;
				text-align: right;
				font-size: 0.22 * 100rpx;
				color: #333;
			}
			
			.promoterHeader .headerCon {
				width: 100%;
				height: 230rpx;
				padding: 0 0.88 * 100rpx 0 0.55 * 100rpx;
				font-size: 0.28 * 100rpx;
				color: #fff;
				background-image: url('https://bdtc.oss-cn-guangzhou.aliyuncs.com/movie/images/tuiguangbj.png');
				background-repeat: no-repeat;
				background-size: 100% 100%;
			}
			
			.promoterHeader .headerCon .name {
				margin-bottom: 0.02 * 100rpx;
			}
			
			.promoterHeader .headerCon .num {
				font-size: 0.5 * 100rpx;
			}
			
			.promoterHeader .headerCon .iconfont {
				font-size: 1.25 * 100rpx;
			}
			
			.acea-row.row-around {
				justify-content: space-around;
			}
			
			.acea-row {
				display: flex;
				flex-wrap: wrap;
				/* 辅助类 */
			}
			
			.promoter-list .list .sortNav .sortItem {
				text-align: center;
				flex: 1;
				-o-flex: 1;
				-ms-flex: 1;
			}
			
			.promoter-list .list .sortNav .sortItem image {
				width: 0.24 * 100rpx;
				height: 0.24 * 100rpx;
				margin-left: 0.06 * 100rpx;
				vertical-align: -0.03 * 100rpx;
			}
			
			

			&:last-child {
				border-right: none;
			}
		}
	}
	
	#sortNav {
		background-color: #fff;
		height: 0.76 * 100rpx;
		border-bottom: 1px solid #eee;
		color: #333;
		font-size: 0.28 * 100rpx;
		background-color: lightblue;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		
		.sortNav-item {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			
			.sortNav-item-title {
				display: flex;
				flex-direction: column;
				justify-content: center;
				font-size: 32rpx;
			}
			.sortNav-item-option {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				margin-left: 10rpx;
				
				.item-option-top {
					// width: 8rpx;
					// height: 10rpx;
					margin-bottom: 6rpx;
					.top-btn {
						border-top: 12rpx solid transparent;
						border-bottom: 12rpx solid #000;
						border-left: 12rpx solid transparent;
						border-right: 12rpx solid transparent;
					}
				}
				.item-option-bottom {
					.bottom-btn {
						border-top: 12rpx solid #000;
						border-bottom: 12rpx solid transparent;
						border-left: 12rpx solid transparent;
						border-right: 12rpx solid transparent;
					}
				}
			}
		}
	}
</style>
