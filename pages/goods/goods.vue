<template>
  <view>
    <!-- 01. 轮播区 -->
    <view class="swiper-area w-full">
      <swiper class="wh-full" indicator-dots circular="true" duration="400">
        <swiper-item v-for="(item, index) in swiperDatas" :key="index">
          <!-- class="wh-full" -->
          <view class="wh-full">
            <image
              :src="item"
              class="loaded wh-full"
              lazy-load="true"
              mode="scaleToFill"
            ></image>
          </view>
        </swiper-item>
      </swiper>
    </view>

    <!-- 02. 商品数据区 -->
    <view class="goods-area bg-main padding">
      <view class="price-box dflex-b">
        <view>
          <text class="price fwb fs-big">
            {{ goods.goods_price }}
          </text>
          <!-- <text class="price fwb fs-big">
            {{ goods.goods_price / 100 || "" }}
          </text> -->
          <!-- <text class="m-price" v-if="goods.market_price > 0">
            {{ goods.market_price / 100 || "" }}
          </text> -->
        </view>
        <view class="dflex fs-sm ft-dark">
          <view class="margin-right-sm dflex">
            <view class="padding-right-xs padding-right-xs">已售</view>
            <text>{{ goods.sales || "0" }}</text>
          </view>
          <view class="dflex">
            <view class="padding-right-xs padding-right-xs">库存</view>
            <text>{{ goods.stock || "0" }}</text>
          </view>
        </view>
      </view>
      <text class="title fs">
        {{ goods.goods_name || "" }} {{ goods.name_pw || "" }}
      </text>
    </view>
    <view class="gap"></view>

    <!-- 06. 详情区 -->
    <view class="detail-area bg-main">
      <view class="d-header padding dflex-c"><text>图文详情</text></view>
      <rich-text class="pro-detail" :nodes="html_nodes"></rich-text>
    </view>

    <!-- 07. 操作区 -->
    <view class="oper-area pos-f dflex-b w-full padding-lr-sm">
      <view class="btn-area dflex dflex-flow-c" @click="tohome">
        <text class="iconfont iconshouye-1"></text>
        <text>首页</text>
      </view>
      <view class="btn-area dflex dflex-flow-c" @click="handletoCartClick">
        <text class="iconfont iconcart"></text>
        <text>购物车</text>
      </view>
      <!-- <view
        class="btn-area dflex dflex-flow-c"
        :class="{ active: favorite }"
        @click="tofavorite"
      >
        <text
          class="iconfont"
          :class="favorite ? 'iconshoucang-' : 'iconshoucang-01'"
        ></text>
        <text>收藏</text>
      </view> -->
      
      <view class="flex1 btn-container dflex-b border-radius-big">
        <view
          class="tac padding-tb-sm flex1 bg-warn"
          v-if="goods.stock > 0"
          @click="tocart(goods)"
          >加入购物车</view
        >
        <view
          class="tac padding-tb-sm flex1 bg-base"
          v-if="goods.stock > 0"
          @click="tobuy(goods)"
          >立即购买</view
        >
        <view class="tac padding-tb-sm flex1 bg-disabled" v-else>已售磐</view>
      </view>
    </view>

    <!-- #ifdef MP-ALIPAY -->
    <view class="fixed-top dflex-c dflex-flow-c"
      ><contact-button
        tnt-inst-id="0Xu_1aaW"
        scene="SCE00225456"
        size="50"
        color="#bbb"
    /></view>
    <!-- #endif -->

    <!-- 置顶 -->
    <use-totop ref="usetop" bottom="120"></use-totop>
  </view>
</template>

<script>
// // #ifdef MP-ALIPAY
// import aliParse from 'mini-html-parser2';
// // #endif

// import lPainter from '@/uni_modules/lime-painter/components/lime-painter/';
// import uposter from '@/common/poster.js';
import { getGoodsInfoApi, addCartApi } from "@/api/tuanApi";
import config from "@/common/config.js";

import { mapState } from "vuex";

export default {
  // components: { lPainter },
  computed: {
    ...mapState(["islogin", "member"]),
  },
  data() {
    return {
      // 商品ID
      id: 0,
      // 分享ID
      mid: 0,
      // 商品数据
      goods: {},
      // 轮播图
      swiperDatas: [],
      // SKU
      sku: {},
      skuDatas: [],
      // 分享
      shareShow: false,
      // 海报
      posterQRcode: "",
      posterUrl: "",
      posterShow: false,
      posterData: {},

      //优惠券
      couponShow: false,
      couponDatas: [],
      // 服务标签
      tagShow: false,
      tagDatas: [],
      // 商品评价
      evaluateDatas: [],
      evaluateTitle: "评价",
      // 商品详情
      html_nodes: "",
      // 收藏
      favorite: false,

      scrollTop: 0,
    };
  },
  watch: {
    sku(e) {
      this.goods.price = e.price;
      this.goods.market_price = e.market_price;
      this.goods.stock_num = e.num;
    },
  },
  //   onShareAppMessage: function (ops) {
  //     let _this = this;
  //     let mid = 0;
  //     if (_this.member && _this.member._id) {
  //       mid = _this.member._id;
  //     }

  //     return {
  //       title: _this.goods.share_title,
  //       path: `/pages/goods/goods?id=${this.id}&mid=${mid}`, //这里设定都是以"/page"开头,并拼接好传递的参数
  //       success: function (res) {
  //         // 转发成功
  //         console.log("转发成功", res);
  //       },
  //       fail: function (res) {
  //         // 转发失败
  //         console.log("转发失败", res);
  //       },
  //     };
  //   },
  // onPageScroll(e) {
  // 	//this.scrollTop = e.scrollTop;
  // 	this.$refs.usetop.change(e.scrollTop);
  // },
  onLoad(options) {
    console.log("onload opts", options);

    if (options) {
      this.mid = options.mid || "";
      if (options.id) {
        this.id = options.id;
      } else if (options.q) {
        let query =
          decodeURIComponent(options.q) ||
          decodeURIComponent(uni.getStorageInfoSync("__scene_query_q"));
        this.resolveQueryq(query);
      }
    }

    if (!this.id) {
      this.$api.msg("商品ID无效");
      return;
    }
  },
  onShow(options) {
    if (!this.id) {
      const query = decodeURIComponent(
        uni.getStorageInfoSync("__scene_query_q")
      );
      this.resolveQueryq(query);
    }

    this.loadData();
  },

  methods: {
    async loadData() {
      const params = { goods_id: this.id };

      const { data: result } = await getGoodsInfoApi(params);
      if (result.code !== 200) return;

      const info = result.data || {};

      this.goods = info;

      this.swiperDatas = info.img_list.map((item) => {
        return `${config.imgUrl}${item}`;
      });

      this.html_nodes = info.goods_info;
    },
    // 处理 query q 数据
    resolveQueryq(query) {
      const arr = query.split("/").slice(-1)[0].split("_");
      if (arr.length == 2) this.mid = arr[1];
      this.id = arr[0];
    },

    // 海报二维码生成成功
    posterQRcodeResult(res) {
      // 获取产品海报数据
      this.posterData = uposter.getGoodsData(this.member, this.goods, res);
      // console.log('this.posterData', this.posterData);

      this.posterShow = true;
    },
    // 海报生成完成
    posterSuccess(res) {
      this.posterUrl = res;

      uni.hideLoading();
    },
    // 保存海报
    posterSave() {
      if (this.posterUrl) {
        uni.showLoading({
          title: "保存中",
        });

        uni.saveImageToPhotosAlbum({
          filePath: this.posterUrl,
          success: function () {
            uni.hideLoading();

            uni.showToast({
              title: "海报保存成功",
              icon: "success",
              duration: 2000,
            });
          },
        });
      }
    },

    // 商品SKU
    selectSKU(res) {
      this.skuDatas.forEach((item) => {
        if (res.sku == item.sku) {
          this.$set(item, "selected", true);
        } else {
          this.$set(item, "selected", false);
        }
      });

      this.sku = res;
    },

    // 评论
    // toevaluate() {
    //   uni.navigateTo({
    //     url: `/pages/goods/goods-evaluate?id=${this.id}`,
    //   });
    // },
    // 首页
    tohome() {
      this.$util.redirectTo("/pages/index/index");
    },
    handletoCartClick() {
      this.$util.redirectTo("/pages/cart/cart");
    },
    // 收藏
    // tofavorite() {
    //   if (!this.loginCheck()) return;

    //   this.favorite = !this.favorite;
    //   let _data = {
    //     goods_id: this.id,
    //     state: !this.favorite ? "已取消" : "已收藏",
    //   };
    //   this.$func.usemall.call("member/collect", _data).then((res) => {
    //     if (res.datas) {
    //       !this.favorite
    //         ? this.$api.msg("取消成功")
    //         : this.$api.msg("收藏成功");
    //       return;
    //     }

    //     this.$api.msg(res.msg);
    //   });
    // },
    // 加入购物车
    async tocart(goods) {
      if (!this.$util.checkLogin()) {
        this.$util.redirectTo("/pages/login/login", undefined, "reLaunch");
        return;
      }

      const params = {
        goods_id: goods.goods_id,
        goods_num: 1,
      };

      const { data: result } = await addCartApi(params);

      if (result.code !== 200) return;
      this.$util.msg("添加成功");
    },
    // 立即购买
    tobuy() {
      if (!this.$util.checkLogin()) {
        this.$util.redirectTo("/pages/login/login", undefined, "reLaunch");
        return;
      }

      uni.navigateTo({
        url: `/pages/order/createOrder?goods_id=${this.id}`,
      });
    },
    // 检测是否已登录
    // loginCheck() {
    //   if (!this.islogin) {
    //     let _this = this;
    //     uni.showModal({
    //       title: "授权登录",
    //       success: function (res) {
    //         if (res.confirm) {
    //           _this.$api.tologin();
    //         }
    //       },
    //     });
    //     return false;
    //   }

    //   return true;
    // },
  },
};
</script>

<style lang="scss">
page {
  background: #f5f5f5;
  padding-bottom: 120rpx;
}

contact-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
}

.fixed-top {
  bottom: 230rpx;
}

/* 01. 轮播区 */
.swiper-area {
  height: 600rpx;
  top: 0;
  z-index: -1;
}

/* #ifndef MP */
// .swiper-area {
//   margin-top: calc(44px + env(safe-area-inset-top));
//   margin-top: 44px;
// }
/* #endif */

/* #ifdef APP-PLUS */
.swiper-area {
  margin-top: 0;
}
/* #endif */

/* 02. 商品数据区 */
.goods-area {
  //   margin-top: 600rpx;

  .price-box {
    display: flex;
    align-items: baseline;
  }

  .title {
    color: #303133;
    height: 46rpx;
    line-height: 46rpx;
  }
}

.share-area {
  .vertical-line {
    right: 50%;
    height: 40%;
  }
}

/* 06. 详情区 */
.detail-area {
  .d-header {
    font-size: $font-base + 2upx;
    color: $font-color-dark;
    position: relative;

    text {
      padding: 0 20rpx;
      background: #fff;
      position: relative;
      z-index: 1;
    }

    &:after {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translateX(-50%);
      width: 300rpx;
      height: 0;
      content: "";
      border-bottom: 1px solid #ccc;
    }
  }

  /* 产品详情 */
  .pro-detail {
    width: 100%;
    overflow: hidden;
    -webkit-touch-callout: none;

    img {
      width: 100%;
      max-width: 100%;
      overflow: hidden;
    }
  }
}

/* 07. 操作区 */
.oper-area {
  left: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 0 20rpx 0 #f0f0f0;
  height: 100rpx;
  z-index: 95;

  .btn-area {
    font-size: $font-sm;
    color: $font-color-base;
    width: 96rpx;

    .iconfont {
      font-size: 40rpx;
      line-height: 48rpx;
    }
  }
}

/* 优惠券区 */
.coupon-area {
  max-height: 60vh;
  min-height: 30vh;

  .coupon-item {
    margin-bottom: 20rpx;

    &:last-child {
      margin-bottom: 0;
    }

    .content {
      &:after {
        position: absolute;
        left: 0;
        bottom: 0;
        content: "";
        width: 100%;
        height: 0;
        border-bottom: 1px dashed #f3f3f3;
        transform: scaleY(50%);
      }
    }

    .circle {
      position: absolute;
      bottom: -10rpx;
      z-index: 10;
      width: 20rpx;
      height: 20rpx;
      background: #f5f5f5;
      border-radius: 50%;

      &.r {
        right: -6rpx;
      }

      &.l {
        left: -6rpx;
      }
    }
  }
}
</style>
