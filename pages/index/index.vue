<template>
  <view class="page-wrap">
    <!-- 轮播图 -->
    <view style="" class="swiperContainer">
      <co-slid :slid_list="slid_list"></co-slid>
    </view>

    <!-- 列表 -->
    <view class="list-wrap padding-y">
      <view class="list-header flex-title">
        <view class="main flex-center-y">
          <image
            style="width: 32rpx; height: 32rpx; margin-right: 10rpx"
            src="/static/imgs/icon_hot.png"
            mode="aspectFit"
          ></image>
          <text>热门商品</text>
        </view>
        <view class="other"> </view>
      </view>
      <view class="list-body group-list">
        <view @click="toDetail" class="group-item">
          <image
            class="group-img"
            :src="$util.img(goods.goods_img)"
            mode="aspectFit"
          ></image>
          <view class="group-detail">
            <view class="group-detail-top">
              <view class="group-name">
                <text>{{ goods.goods_name }}</text>
              </view>
            </view>
            <view class="group-detail-bottom flex-title">
              <view class="left">
                <!-- <view class="group-tags-wrap">
                  <view class="group-tags team-num">
                    <text>{{ goods.team_num }}人团</text>
                  </view>
                </view> -->
                <view class="group-price">
                  <text class="group-price-symbol">￥</text>
                  <text>{{ goods.goods_price }}</text>
                </view>
                <!-- <view class="group-old-price">
                  <text>单购价：</text>
                  <text>{{ goods.goods_price }}</text>
                </view> -->
              </view>
              <view class="right">
                <view class="group-btn">
                  <text>去购买</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- <view @click="toBlind" class="blind-wrap padding-y">
			<view class="list-header flex-title">
				<view class="main flex-center-y">
					<image style="width: 32rpx; height: 32rpx; margin-right: 10rpx;" src="/static/imgs/icon_gift.png"
						mode="aspectFit"></image>
					<text>盲盒抽奖</text>
				</view>
				<view class="other">
					<uni-icons color="#ff5454" type="forward" size="16"></uni-icons>
				</view>
			</view>
			<image style="width: 100%; height: 320rpx; border-radius: 0 0 16rpx 16rpx;"
				src="/static/imgs/home_blind.png" mode="aspectFill"></image>
		</view> -->
  </view>
</template>

<script>
import { getBannerApi, getGoodsIndexApi } from "@/api/tuanApi.js";

export default {
  data() {
    return {
      slid_list: [],
      goods: {}, //套餐商品
    };
  },
  onLoad() {
    this.init();
  },
  // 下拉加载
  onPullDownRefresh() {
    this.init();
    setTimeout(function () {
      uni.stopPullDownRefresh();
    }, 1000);
  },
  methods: {
    init() {
      this.getBanner();
      this.getGoodsIndex();
    },
    async getBanner() {
      const { data: result } = await getBannerApi();
      if (result.code !== 200) return;
      this.slid_list = (result.data || []).map((item) => item.img_url);
    },
    async getGoodsIndex() {
      const { data: result } = await getGoodsIndexApi();
      if (result.code !== 200) return;

      this.goods = result.data;
    },
    toDetail() {
      this.$util.redirectTo("/pages/goods/goods", {
        id: this.goods.goods_id,
      });
    },

    // toBlind() {
    //   if (!this.$util.checkLogin()) {
    //     this.$util.redirectTo(
    //       "/pages/login/login?connect_redirect=1",
    //       undefined,
    //       "reLaunch"
    //     );
    //     return;
    //   }
    //   this.$util.redirectTo("/page_my/blindBox");
    // },
  },
};
</script>

<style lang="scss" scoped>
// 轮播图
.swiperContainer {
  padding: 30rpx;
}

// .margin-all {
// 	margin: 30rpx;
// }
.list-wrap {
  .list-header {
    background-color: $app-primary-color;
    color: $white-color;
    height: 70rpx;
    padding: 20rpx;
    font-size: $font-30;
    border-radius: 16rpx 16rpx 0 0;
  }

  .list-body {
    background-color: #f8f8f8;
    border-radius: 0 0 16rpx 16rpx;
  }

  .list-body-empty {
    height: 400rpx;
    @extend %flex-center;
    background-color: #f8f8f8;
    border-radius: 0 0 16rpx 16rpx;
    color: $gray-color;
  }
}

// .blind-wrap {
//   margin-top: 20rpx;

//   .list-header {
//     background-color: $white-color;
//     color: $app-primary-color;
//     height: 70rpx;
//     padding: 20rpx;
//     font-size: $font-30;
//     border-radius: 16rpx 16rpx 0 0;
//   }

//   .list-body {
//     background-color: #f8f8f8;
//     border-radius: 0 0 16rpx 16rpx;
//   }

//   .list-body-empty {
//     height: 400rpx;
//     @extend %flex-center;
//     background-color: #f8f8f8;
//     border-radius: 0 0 16rpx 16rpx;
//     color: $gray-color;
//   }
// }

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
      padding-left: 30rpx;
      min-height: 200rpx;
      color: $font-color;
      font-size: $font-30;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .group-detail-bottom {
        .right {
          height: 120rpx;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;

          .group-btn {
            background: linear-gradient(
              to right,
              rgba($app-primary-color, 0.7),
              $app-primary-color
            );
            color: $white-color;
            padding: 8rpx 16rpx;
            border-radius: 30rpx;
            font-size: $font-26;
          }
        }
      }

      .group-name {
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
        padding: 4rpx 0;

        .group-price-symbol {
          font-size: $font-28;
        }
      }

      .group-old-price {
        font-size: $font-24;
      }
    }
  }
}
</style>
