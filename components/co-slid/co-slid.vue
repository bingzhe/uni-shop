<template>
	<view class="co-slid-wrap">
		<swiper class="slid-swiper" :indicator-dots="true" indicator-active-color="rgba(255, 255, 255, 1)"
			indicator-color="rgba(255, 255, 255, 0.3)" circular :autoplay="true" :interval="8000" :duration="1000">
			<swiper-item v-for="(item, index) in slid_list" :key="index">
				<view class="swiper-item">
					<image class="slid-img" :src="$util.img(item)" mode="aspectFill"></image>
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
		name: "co-slid",
		props: {
			slid_list: {
				type: Array,
				default: () => {
					return []
				}
			}
		},
		data() {
			return {
				// slid_list: 
			};
		}
	}
</script>

<style lang="scss" scoped>
	$slid-height: 206rpx;

	.co-slid-wrap {
		.slid-swiper {
			height: $slid-height;
			.slid-img {
				width: 100%;
				height: $slid-height;
			}
		}
	}
</style>
