<template>
	<view class="Loads acea-row row-center-wrapper" v-if="loading" style="margin-top: 20rpx;">
		<template v-if="loading">
			<view class="iconfont icon-jiazai loading acea-row row-center-wrapper"></view>
			正在加载中
		</template>
		<template v-if="!loading">
			{{more?'上拉加载更多':'没有更多了哦'}}
		</template>
	</view>
</template>

<script>
	export default {
		name: "Loading",
		props: {
			loading: Boolean,
			more: Boolean
		}
	};
</script>
<style lang="scss">
	.acea-row {
		display: flex;
		flex-wrap: wrap;
		/* 辅助类 */
	}

	/* 上下左右垂直居中 */
	.acea-row.row-center-wrapper {
		align-items: center;
		justify-content: center;
	}

	/* 上下两边居中对齐 */
	.acea-row.row-between-wrapper {
		align-items: center;
		justify-content: space-between;
	}

	.Loads {
		height: 0.8*100rpx;
		font-size: 0.25*100rpx;
		color: #000;
	}

	.Loads .iconfont {
		font-size: 0.3*100rpx;
		margin-right: 0.1*100rpx;
		height: 0.32*100rpx;
		line-height: 0.32*100rpx;
	}

	/*加载动画*/
	@keyframes load {
		from {
			transform: rotate(0deg);
		}

		to {
			transform: rotate(360deg);
		}
	}

	.loading {
		animation: load linear 1s infinite;
	}
</style>
