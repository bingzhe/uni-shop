<script>
	export default {
		onLaunch: function() {
			uni.getLocation({
				type: 'gcj02',
				success: res => {
					let obj = uni.getStorageSync('location');
					if (obj) {
						let a = this.$util.getDistance(obj.latitude, obj.longitude, res.latitude, res
							.longitude);
						if (a > 20) {
							uni.removeStorageSync('store');
						}
					}
					uni.setStorage({
						key: 'location',
						data: {
							latitude: res.latitude,
							longitude: res.longitude
						}
					});
				}
			});
			//判断是否支持 获取本地位置
			// #ifdef H5
			if (navigator.geolocation) {
				var n = navigator.geolocation.getCurrentPosition(function(res) {
					console.log(res); // 需要的坐标地址就在res中
				});
			} else {
				console.log('该浏览器不支持定位');
			}
			// #endif
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	body {
		font-family: PingFang SC, Roboto Medium;
	}
	/* 解决滚动条的问题 */
	::-webkit-scrollbar {
		display: none;
		width: 0;
		height: 0;
		color: transparent;
	}

	/* 解决H5 的问题 */
	uni-scroll-view .uni-scroll-view::-webkit-scrollbar {
		/* 隐藏滚动条，仍然可以滚动 */
		display: none;
		width: 0;
		height: 0;
		color: transparent;
	}
	
</style>
