<template>
  <view class="container bg-drak" :class="{ 'margin-bottom-big': !empty }">
    <!-- 00. 未授权登录 -->
    <use-empty
      v-if="!$util.checkLogin()"
      e-style="round"
      e-type="unauthorized"
      tip="当前未授权"
      btn-tip="去登录"
      height="70vh"
      :auto="false"
      @goto="tologin"
    ></use-empty>
    <!-- 00. 空白页 -->
    <use-empty
      v-else-if="empty"
      e-style="round"
      e-type="cart"
      tip="购物车数据为空"
      height="70vh"
    ></use-empty>

    <!-- 00. 列表 -->
    <view v-else>
      <!-- 01. 购物车列表 -->
      <view class="cart-list padding-sm">
        <block v-for="(item, index) in cartDatas" :key="item.cart_id">
          <view
            class="cart-item bg-main margin-bottom-sm padding-lg pos-r dflex-s border-radius"
          >
            <view class="image-wrapper pos-r" @click="togoods(item)">
              <!-- 商品图片 -->
              <image
                class="border-radius-xs wh-full"
                mode="aspectFill"
                :lazy-load="true"
                :src="item.previewImg"
              >
              </image>
              <!-- 选中|未选中按钮 -->
              <view
                v-if="item.stock > 0 && item.stock >= item.goods_num"
                class="iconfont checkbox pos-a bg-main border-radius-big"
                :class="{
                  active: item.checked,
                  iconxuanzhongzhuangtai: item.checked,
                  iconweixuanzhongzhuangtai: !item.checked,
                }"
                @tap.stop="check('item', index)"
              ></view>

              <view
                v-if="item.stock < 10 || item.stock < item.goods_num"
                class="disabled dflex-c dflex-flow-c pos-a pos-tl-c border-radius-c"
              >
                <text>库存不足</text>
                <text class="margin-left-xs fs-xs" v-if="item.stock > 0">
                  剩余 {{ item.stock }}
                </text>
              </view>
            </view>
            <view class="item-right padding-left pos-r">
              <!-- 商品名称 -->
              <view class="clamp-2 title" @click="togoods(item)">
                {{ item.goods_name }}
              </view>
              <!-- <view class="ft-dark fs-xs padding-top-xs">subTip</view> -->
              <view class="padding-tb-sm">
                <text class="price">{{ item.goods_price }}</text>
                <!-- 原价 -->
                <!-- <text class="m-price" v-if="item.market_price > 0">100</text> -->
              </view>

              <!-- + - 购物车数量 -->
              <use-number-box
                :min="1"
                :max="item.stock || 1"
                :value="item.goods_num"
                :is-max="item.goods_num >= item.stock"
                :is-min="item.goods_num === 1"
                :index="index"
                :disabled="item.goods_num >= item.stock"
                @eventChange="numberChange"
              >
              </use-number-box>
            </view>

            <!-- 删除 -->
            <view
              class="del-btn iconfont iconlajitong-01 pos-a border-radius-c dflex-c ft-dark fs-xl"
              @tap.stop="deleteCart(item.cart_id)"
            ></view>
          </view>
        </block>
      </view>

      <!-- 02. 底部操作栏 -->
      <view class="action-section dflex w-full bg-main pos-f padding-right">
        <view class="checkbox pos-r h-full dflex-c">
          <view
            class="padding-lr iconfont"
            :class="{
              active: allChecked,
              iconxuanzhongzhuangtai: allChecked,
              iconweixuanzhongzhuangtai: !allChecked,
            }"
            @click="check('all')"
          ></view>
          <view
            class="clear-btn pos-a tac ft-white"
            :class="{ show: allChecked }"
            @click="clearCart"
            >清空
          </view>
        </view>
        <view class="total-box flex1 tar padding-right-lg">
          <text class="price">{{ total || 0 }}</text>
        </view>
        <button
          type="primary"
          class="payment no-border border-radius-lg fs"
          @click="createOrder"
        >
          去结算
        </button>
      </view>
    </view>

    <!-- 03. 猜你喜欢 -->
    <!-- <use-hot-goods title-type="round" title="热门推荐"></use-hot-goods> -->
  </view>
</template>

<script>
import { getShopcartListApi, addCartApi, delCartApi } from "@/api/tuanApi";
import config from "@/common/config.js";
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["islogin"]),
  },
  data() {
    return {
      // 空白页
      empty: false,
      // 购物车数据
      cartDatas: [],
      // 全选状态 进入购物车默认全部选中
      allChecked: true,
      // 总价格
      total: 0,
    };
  },
  watch: {
    //显示空白页
    cartDatas(e) {
      let empty = e.length === 0;
      if (this.empty !== empty) {
        this.empty = empty;
      }
    },
  },
  // 监听页面显示。页面每次出现在屏幕上都触发，包括从下级页面点返回露出当前页面
  onShow() {
    this.loadData();
  },
  // 下拉刷新
  //   onPullDownRefresh() {
  //     this.loadData(() => {
  //       uni.stopPullDownRefresh();
  //     });
  //   },

  methods: {
    //请求数据
    async loadData() {
      if (!this.$util.checkLogin()) {
        return;
      }

      const { data: result } = await getShopcartListApi();

      this.cartDatas = (result.data || []).map((item) => {
        return {
          previewImg: `${config.imgUrl}${item.goods_img}`,
          ...item,
          checked: true,
        };
      });

      // 计算总价
      this.calcTotal();
    },
    // 跳转登录页
    tologin() {
      this.$util.redirectTo("/pages/login/login", undefined, "reLaunch");
    },
    // 跳转商品页
    togoods(item) {
      this.$util.redirectTo("/pages/goods/goods", {
        id: item.goods_id,
      });
    },

    // 选中状态处理
    check(type, index) {
      if (type === "item") {
        this.cartDatas[index].checked = !this.cartDatas[index].checked;
      } else {
        const checked = !this.allChecked;
        this.cartDatas.forEach((item) => {
          item.checked = checked;
        });
        this.allChecked = checked;
      }

      this.calcTotal();
    },
    // +- 数量
    async numberChange(data) {
      let cart = this.cartDatas[data.index];

      const params = {
        goods_id: cart.goods_id,
        cart_id: cart.cart_id,
        goods_num: data.number,
      };

      const { data: result } = await addCartApi(params);

      if (result.code !== 200) return;
      cart.goods_num = data.number;
      this.$util.msg("修改成功");

      //计算总价
      this.calcTotal();
    },
    // 删除
    async deleteCart(id) {
      const params = {
        cart_list: [id],
      };

      const { data: result } = await delCartApi(params);
      console.log(result);
      if (result.code !== 200) return;

      this.$util.msg("删除成功");
      this.loadData();
    },
    // 清空
    clearCart() {
      let _this = this;
      uni.showModal({
        title: "提示",
        content: "清空购物车",
        success: async function (res) {
          if (res.confirm) {
            const cart_list = _this.cartDatas.map((item) => item.cart_id);
            const params = { cart_list };

            console.log("params", params);

            const { data: result } = await delCartApi(params);
            if (result.code !== 200) return;

            _this.$util.msg("删除成功");
            _this.loadData();
          } else if (res.cancel) {
          }
        },
      });
    },
    // 计算总价
    calcTotal() {
      if (this.cartDatas.length === 0) {
        this.empty = true;
        return;
      }

      let total = 0,
        checked = true;

      this.cartDatas.forEach((item) => {
        if (item.checked) {
          // 存在库存
          if (item.stock > 0 && item.stock >= item.goods_num) {
            total += Number(item.goods_price) * item.goods_num;
          }
        } else if (checked) {
          checked = false;
        }
      });

      this.allChecked = checked;
      this.total = Number(total.toFixed(2));
    },
    // 创建订单
    createOrder() {
      let cart_ids = [];
      this.cartDatas.forEach((item) => {
        // 选中有库存购物车
        if (
          item.checked &&
          item.stock_num > 0 &&
          item.stock_num > item.goods_num
        ) {
          cart_ids.push(item._id);
        }
      });
      if (cart_ids.length <= 0) {
        this.$api.msg("请选择结算商品");
        return;
      }
      uni.navigateTo({
        url: `/pages/order/create?cart_ids=${cart_ids.join(",")}`,
      });
    },
  },
};
</script>

<style lang="scss">
page {
  min-height: 100%;
}

/* 购物车列表项 */
.cart-item {
  &:last-child {
    margin-bottom: 0;
  }

  .image-wrapper {
    width: 230rpx;
    height: 230rpx;
    flex-shrink: 0;

    image {
      opacity: 1;
    }
  }

  .checkbox {
    top: -16rpx;
    left: -16rpx;
    color: $font-color-disabled;
    line-height: 1;
    font-size: 46rpx;
    padding: 5rpx;
    z-index: 8;
  }

  .disabled {
    color: #fff !important;
    width: 70%;
    height: 70%;
    background-color: rgba(51, 51, 51, 0.5);
  }

  .item-right {
    flex: 1;
    height: 230rpx;
    overflow: hidden;
  }

  .del-btn {
    bottom: 40rpx;
    right: 30rpx;
    width: 70rpx;
    height: 70rpx;
  }
}

/* 底部栏 */
.action-section {
  z-index: 999;
  bottom: 0;
  height: 100rpx;

  .checkbox {
    .iconfont {
      font-size: 46rpx;
      color: #2c405a;
    }
  }

  .clear-btn {
    left: 100rpx;
    background: #2c405a;
    border-radius: 0 50rpx 50rpx 0;
    padding: 12rpx 0;
    transition: all 0.2s;

    width: 0;
    opacity: 0;

    &.show {
      width: 120rpx;
      opacity: 1;
    }
  }

  .payment {
    padding: 0 40rpx;
    font-size: $font-base;
    background: $uni-color-primary;
    box-shadow: 1px 2px 5px rgba(217, 60, 93, 0.72);
  }
}

/* #ifdef H5 || MP-360 */
.action-section {
  margin-bottom: 50px;
}

/* #endif */
</style>
