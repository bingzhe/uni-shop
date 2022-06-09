<template>
  <view class="wh-full">
    <!-- 头部组件 -->
    <!-- <use-header :fixed="headerFixed" :placeholder="headerPlaceholder" :search-tip="searchTip" :search-auto="searchAuto"></use-header> -->

    <!-- 分类 -->
    <view class="category dflex-s h-full">
      <!-- 左侧一级分类 -->
      <view class="h-full left">
        <scroll-view scroll-y class="h-full">
          <view
            v-for="item in fdatas"
            :key="item.category_id"
            class="item dflex-c"
            :class="{ active: item.category_id === cid }"
            @click="fSelect(item)"
            >{{ item.cate_name }}</view
          >
        </scroll-view>
      </view>

      <!-- 右侧 1二级分类 2商品列表 -->
      <scroll-view
        class="h-full right bg-main"
        scroll-with-animation
        scroll-y
        :scroll-top="top"
        :style="{ height: scrollHeight }"
        @scroll="onScroll"
      >
        <view>
          <!-- 空白页 -->
          <use-empty v-if="empty" e-style="round" tip="无商品数据"></use-empty>

          <view
            v-else
            class="padding-lr"
            v-for="(item, index) in goodsDatas"
            :key="index"
            @click="togoods(item)"
          >
            <view
              class="goods border-radius-sm padding margin-bottom-sm bg-main"
              style="padding-bottom: 15rpx"
            >
              <view class="goods-left">
                <image
                  mode="aspectFill"
                  :lazy-load="true"
                  :src="item.previewImg"
                ></image>
              </view>
              <view class="margin-left-sm pos-r">
                <text class="clamp-2">{{ item.goods_name }}</text>
                <view class="pos-a price-box w-full">
                  <text class="price">{{ item.goods_price / 100 }}</text>
                  <text class="m-price">{{ item.goods_price / 100 }}</text>
                </view>
              </view>
            </view>
          </view>

          <!-- 上拉加载更多 -->
          <!-- <use-loadmore
            v-if="!empty && hasmore"
            :type="loadmoreType"
          ></use-loadmore> -->
          <!-- 置顶 -->
          <!-- <use-totop ref="usetop" bottom="150" :style="{ marginBottom: navHeight + 'px' }" @to="totop"></use-totop> -->
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import { getCateListApi, getGoodsListApi } from "@/api/tuanApi";
import config from "@/common/config.js";
// import UseEmpty from "@/components/use-empty/use-empty.vue";

// const _goods = 'usemall-goods'
// const _goodscategory = 'usemall-goods-category'
export default {
  //   components: {
  //     UseEmpty,
  //   },
  data() {
    return {
      // 1分类列表 2商品列表
      mode: 2,
      // 兼容支付宝 height 显示 bug
      scrollHeight: "100%",

      // 头部参数
      headerPlaceholder: 0,
      headerFixed: !0,
      searchAuto: !0,
      searchTip: "请输入搜索关键字",

      // 当前选中分类ID
      cid: 0,
      // 一级数据
      fdatas: [
        // {
        //   cate_name: "分类一",
        //   category_id: 1,
        // },
      ],
      // 二级数据
      sdatas: [],

      // 商品列表
      goodsDatas: [
        // {
        //   cate_name: "测试分类",
        //   category_id: 1,
        //   create_time: 1654591219,
        //   goods_id: 1,
        //   goods_img: "/public/uploads/goods/20220607/20220607043949.png",
        //   goods_info: "测试1111",
        //   goods_name: "测试商品",
        //   goods_price: "0",
        // },
      ],
      empty: false,
      hasmore: 0,
      loadmoreType: "nomore",
      // 商品请求数据
      reqdata: {
        rows: 20,
        page: 1,
      },

      top: 0,
      scrollTop: 0,
      navHeight: 0,
    };
  },
  watch: {
    goodsDatas(e) {
      // 监听数据，呈现空白页
      let empty = e.length === 0;
      if (this.empty !== empty) {
        this.empty = empty;
      }
    },
  },
  onPageScroll(e) {
    //this.scrollTop = e.scrollTop;
    // this.$refs.usetop.change(e.scrollTop);
  },
  onLoad() {
    // #ifdef MP-ALIPAY
    this.scrollHeight =
      this.$env.windowHeight - this.$env.sis.titleBarHeight + "px";
    // #endif

    // 获取存储的模式 //默认是商品
    this.mode = uni.getStorageSync("category.mode") || 2;

    this.loadData();
  },
  // 下拉刷新
  onPullDownRefresh() {
    // this.loadData(() => {
    //   uni.stopPullDownRefresh();
    // });
  },
  methods: {
    async loadData() {
      const { data: result } = await getCateListApi();
      if (result.code !== 200) return;

      this.fdatas = result.data || [];

      if (this.fdatas.length > 0) {
        this.cid = this.fdatas[0].category_id;
      }

      this.loadGoodsDatas();
    },
    // 加载商品数据
    async loadGoodsDatas() {
      if (this.mode != 2) {
        return;
      }
      // 根据当前 cid 加载商品数据列表
      this.reqdata.cid = this.cid;

      const params = {
        category_id: this.cid,
      };
      const { data: result } = await getGoodsListApi(params);

      this.goodsDatas = (result.data || []).map((item) => {
        return {
          previewImg: `${config.imgUrl}${item.goods_img}`,
          ...item,
        };
      });

      this.empty = this.goodsDatas.length === 0;
    },
    totop(e) {
      this.top = e.scrollTop;
      this.$nextTick(function () {
        this.top = 0;
      });
    },
    // 一级分类
    async fSelect(item) {
      this.cid = item.category_id;
      await this.loadGoodsDatas();
    },
    // 切换模式 1分类模式 2商品模式
    changeMode() {
      this.mode = this.mode == 1 ? 2 : 1;
      uni.setStorage({
        key: "category.mode",
        data: this.mode,
      });

      this.loadGoodsDatas();
    },
    // 跳转商品详情
    togoods(item) {
      this.$util.redirectTo("/pages/goods/goods", {
        id: item.goods_id,
      });
      //   this.$api.togoods({
      //     id: item._id,
      //   });
    },
    // // 跳转商品列表
    // togoodslist(item) {
    //   this.$api.togoodslist({
    //     cid: item._id,
    //   });
    // },
  },
  mounted() {
    // #ifdef H5 || MP-360
    this.navHeight = 50;
    // #endif
  },
};
</script>

<style lang="scss">
page {
  height: 100%;
  background-color: #f5f5f5;
}

.category {
  overflow: hidden;

  .left {
    width: 200rpx;
    background-color: #f5f5f5;

    .item {
      height: 100rpx;
      color: $font-color-base;
      position: relative;

      &.active {
        color: $uni-color-primary;
        background: #fff;

        &:before {
          content: "";
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          height: 36rpx;
          width: 8rpx;
          background-color: $uni-color-primary;
          opacity: 0.8;
        }
      }
    }
  }

  .right {
    flex: 1;
    overflow: hidden;
    display: block;

    .item {
      flex-shrink: 0;
      width: 33.33%;
      font-size: $font-sm + 2upx;
      color: #666;

      image {
        width: 130rpx;
        height: 130rpx;
      }
    }
  }
}

.goods {
  display: flex;

  .goods-left {
    image {
      width: 120rpx;
      height: 120rpx;
    }
  }

  .price-box {
    bottom: 0;
  }
}
</style>
