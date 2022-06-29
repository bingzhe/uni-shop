import request from "@/common/http/request.js"; // 自己的接口

const url = {
  Banner: "Api/Index/getBanner", // 轮播图
  GoodsIndex: "Api/Goods/index", //首页商品

  Catelist: "Api/Goods/getCateList", // 商品分类
  CateGoodsList: "Api/Goods/getGoodsList", //商品列表
  GoodsInfo: "Api/Goods/getGoodsInfo", //商品详情
  ShopCartList: "Api/Order/GetCartList", //购物车列表
  AddCart: "Api/Order/CreateCart", //加入购物车
  DelCart: "Api/Order/DelCart", //删除购物车

  CreateOrder: "Api/Order/CreateOrder", //创建订单
  MallOrderList: "Api/Order/GetOrderList", //订单列表
  MallOrderDetail: "Api/Order/GetOrderInfo", //订单详情
  MallOrderPay: "Api/OrderPay/goodsOrderPay", //订单支付

  MemberConfigList: "Api/Usersinfo/getConfigList", //会员升级配置
  Performance: "Api/Usersinfo/getPerformance", //当前业绩
  UserLevelUp: "/Api/Usersinfo/UserLevelUp", //会员等级提升

  GroupList: "Api/Group/groupList", //热门拼团列表
  GroupDetail: "Api/Group/getGroupInfo", //拼团详情
  MyGroupList: "Api/Group/getMyGroupList", //我参与的

  OrderCreate: "Api/Order/OrderCreate", //创建拼团订单
  PayGroupOrder: "Api/OrderPay/groupOrder", //支付拼团订单

  OrderBalanceCreate: "Api/Order/createBalanceOrder", //创建充值余额订单
  OrderPay: "Api/OrderPay/userOrder", //支付充值余额订单
  OrderList: "Api/Order/myOrderList", //我的订单
  OrderParter: "Api/Order/createPartnerOrder", // 创建合伙人订单

  Withdraw: "Api/UsersWithdraw/index", //提现
  WithdrawConfig: "Api/UsersWithdraw/getWithdrawConfig", //提现配置
  WithdrawBill: "Api/UsersWithdraw/withdrawBill", // 提现明细 积分 保证金
  UsersBill: "Api/Usersinfo/getUsersBill", // 查询余额 积分 保证金 消费充值明细  余额明细
  GetAddress: "Api/Usersinfo/getAddress", // 获取地址列表
  GetDefaultAddress: "Api/Usersinfo/getDefaultAddress", // 获取用户默认地址
  SaveAddress: "Api/Usersinfo/saveAddress", // 增加用户地址
  DelAddress: "Api/Usersinfo/delAddress", // 删除用户地址

  Statistics: "Api/Usersinfo/statistics", // 推广统计
  SaveAvatar: "Api/Usersinfo/saveAvatar", // 上传头像
  MobileCode: "Api/Login/mobileCode", // 获取验证码
  BindMobile: "Api/Login/bindMobile", // 绑定手机号
  RevisePwdByMobile: "Api/Login/RevisePwdByMobile", // 手机号修改密码
  RevisePwdByPwd: "Api/Login/RevisePwdByPwd", // 旧密码修改密码

  Lottery: "Api/Lottery/index", // 获取抽奖信息
  UsersLottery: "Api/Lottery/usersLottery", // 打开盲盒
  LotteryList: "Api/Lottery/usersLotteryList", // 我的奖品
  AddLotteryAddress: "Api/Lottery/usersLotteryAddress", // 填写奖品收获地址
  Receipt: "Api/Usersinfo/receipt", // 签收
  LotteryReceipt: "Api/Lottery/receipt", // 奖品签收

  OrderInfo: "Api/Order/getOrderInfo", // 获取订单详情
  ShopInfo: "/Api/Group/getShopInfo", // 获取商家详情

  getParterConfig: "Api/Usersinfo/getParConfig", // 成为合伙人配置
  myTrade: "Api/TradeMarket/usersAccount", // 我的通用券账户
  tradeList: "Api/TradeMarket/getTradeMarketList", // 交易列表
  trade: "Api/TradeMarket/buyMarket", //购买通用券
  releaseMy: "Api/TradeMarket/createTrade", // 发布通用券
  myVerifyList: "/Api/TradeMarket/myVerify", // 通用券列表
  setWhiteList: "Api/Usersinfo/setWhiteList", // 编辑白名单
  getRateList: "Api/TradeMarket/getRateList", // 汇率变动
};

//商品分类
export function getCateListApi(data) {
  return request.request({
    url: url.Catelist,
    method: "post",
    data,
  });
}

//首页商品
export function getGoodsIndexApi(data) {
  return request.request({
    url: url.GoodsIndex,
    method: "post",
    data,
  });
}

//商品列表
export function getGoodsListApi(data) {
  return request.request({
    url: url.CateGoodsList,
    method: "post",
    data,
  });
}

//商品详情
export function getGoodsInfoApi(data) {
  return request.request({
    url: url.GoodsInfo,
    method: "post",
    data,
  });
}

//加入购物车
export function addCartApi(data) {
  return request.request({
    url: url.AddCart,
    method: "post",
    data,
  });
}

//购物车列表
export function getShopcartListApi(data) {
  return request.request({
    url: url.ShopCartList,
    method: "post",
    data,
  });
}

//删除购物车
export function delCartApi(data) {
  return request.request({
    url: url.DelCart,
    method: "post",
    data,
  });
}

//创建订单
export function createOrderApi(data) {
  return request.request({
    url: url.CreateOrder,
    method: "post",
    data,
  });
}

//订单列表
export function getMallOrderList(data) {
  return request.request({
    url: url.MallOrderList,
    method: "post",
    data,
  });
}

//订单详情
export function getMallOrderInfo(data) {
  return request.request({
    url: url.MallOrderDetail,
    method: "post",
    data,
  });
}

//订单支付
export function mallOrderPayApi(data) {
  return request.request({
    url: url.MallOrderPay,
    method: "post",
    data,
  });
}

//会员配置
export function memberConfigListApi(data) {
  return request.request({
    url: url.MemberConfigList,
    method: "post",
    data,
  });
}

//当前业绩
export function performanceApi(data) {
  return request.request({
    url: url.Performance,
    method: "post",
    data,
  });
}
//会员等级提升
export function userLevelUpApi(data) {
  return request.request({
    url: url.UserLevelUp,
    method: "post",
    data,
  });
}

/**
 * @param {Object} data
 * 获取商家详情
 */
export function getRateListApi(data) {
  return request.request({
    url: url.getRateList,
    method: "post",
    data,
  });
}
/**
 * @param {Object} data
 * 获取商家详情
 */
export function setWhiteListApi(data) {
  return request.request({
    url: url.setWhiteList,
    method: "post",
    data,
  });
}
/**
 * @param {Object} data
 * 获取商家详情
 */
export function myVerifyListApi(data) {
  return request.request({
    url: url.myVerifyList,
    method: "post",
    data,
  });
}
/**
 * @param {Object} data
 * 购买通用券
 */
export function releaseMy(data) {
  return request.request({
    url: url.releaseMy,
    method: "post",
    data,
  });
}

/**
 * @param {Object} data
 * 购买通用券
 */
export function trade(data) {
  return request.request({
    url: url.trade,
    method: "post",
    data,
  });
}

/**
 * @param {Object} data
 * 交易列表
 */
export function tradeList(data) {
  return request.request({
    url: url.tradeList,
    method: "post",
    data,
  });
}

/**
 * @param {Object} data
 * 我的通用券账户
 */
export function myTrade(data) {
  return request.request({
    url: url.myTrade,
    method: "post",
    data,
  });
}

/**
 * @param {Object} data
 * 合伙人配置
 */
export function getParterConfig(data) {
  return request.request({
    url: url.getParterConfig,
    method: "post",
    data,
  });
}
/**
 * @param {Object} data
 * 创建合伙人订单
 */
export function createOrderParter(data) {
  return request.request({
    url: url.OrderParter,
    method: "post",
    data,
  });
}
/**
 * @param {Object} data
 * 获取商家详情
 */
export function getShopInfoApi(data) {
  return request.request({
    url: url.ShopInfo,
    method: "post",
    data,
  });
}

/**
 * @param {Object} data
 * 获取订单详情
 */
export function getOrderInfoApi(data) {
  return request.request({
    url: url.OrderInfo,
    method: "post",
    data,
  });
}
/**
 * @param {Object} data
 * 获取轮播图
 */
export function getBannerApi(data) {
  return request.request({
    url: url.Banner,
    noToken: true,
    method: "post",
    data,
  });
}

/**
 * @param {Object} data
 * 奖品签收
 */
export function lotteryReceiptApi(data) {
  return request.request({
    url: url.LotteryReceipt,
    method: "post",
    data,
  });
}
/**
 * @param {Object} data
 * 签收
 */
export function receiptApi(data) {
  return request.request({
    url: url.Receipt,
    method: "post",
    data,
  });
}
/**
 * @param {Object} data
 * 填写奖品收获地址
 */
export function addLotteryAddressApi(data) {
  return request.request({
    url: url.AddLotteryAddress,
    method: "post",
    data,
  });
}
/**
 * @param {Object} data
 * 我的奖品
 */
export function lotteryListApi(data) {
  return request.request({
    url: url.LotteryList,
    method: "post",
    data,
  });
}
/**
 * @param {Object} data
 * 打开盲盒
 */
export function usersLotteryApi(data) {
  return request.request({
    url: url.UsersLottery,
    method: "post",
    data,
  });
}
/**
 * @param {Object} data
 * 获取抽奖信息
 */
export function getLotteryApi(data) {
  return request.request({
    url: url.Lottery,
    method: "post",
    data,
  });
}

/**
 * @param {Object} data
 * 查询余额 积分 保证金 消费充值明细
 */
export function getUsersBillApi(data) {
  return request.request({
    url: url.UsersBill,
    method: "post",
    data,
  });
}

/**
 * @param {Object} data
 * 我的订单
 */
export function getOrderListApi(data) {
  return request.request({
    url: url.OrderList,
    method: "post",
    data,
  });
}

/**
 * @param {Object} data
 * 我参与的
 */
export function getMyGroupListApi(data) {
  return request.request({
    url: url.MyGroupList,
    method: "post",
    data,
  });
}

/**
 * @param {Object} data
 * 提现明细 积分 保证金
 */
export function withdrawBillApi(data) {
  return request.request({
    url: url.WithdrawBill,
    method: "post",
    data,
  });
}
/**
 * @param {Object} data
 * 上传头像
 */
export function saveAvatarApi(data) {
  return request.request({
    url: url.SaveAvatar,
    method: "post",
    data,
  });
}

/**
 * @param {Object} data
 * 推广统计
 */
export function statisticsApi(data) {
  return request.request({
    url: url.Statistics,
    method: "post",
    data,
  });
}
/**
 * @param {Object} data
 * 旧密码修改密码
 */
export function revisePwdByPwdApi(data) {
  return request.request({
    url: url.RevisePwdByPwd,
    method: "post",
    data,
  });
}
/**
 * @param {Object} data
 * 手机号修改密码
 */
export function revisePwdByMobileApi(data) {
  return request.request({
    url: url.RevisePwdByMobile,
    method: "post",
    data,
  });
}

/**
 * @param {Object} data
 * 绑定手机号
 */
export function bindMobileApi(data) {
  return request.request({
    url: url.BindMobile,
    method: "post",
    data,
  });
}

/**
 * @param {Object} data
 * 获取验证码
 */
export function mobileCodeApi(data) {
  return request.request({
    url: url.MobileCode,
    method: "post",
    data,
  });
}

/**
 * @param {Object} data
 * 删除用户地址
 */
export function delAddressApi(data) {
  return request.request({
    url: url.DelAddress,
    method: "post",
    data,
  });
}
/**
 * @param {Object} data
 * 增加用户地址
 */
export function saveAddressApi(data) {
  return request.request({
    url: url.SaveAddress,
    method: "post",
    data,
  });
}
/**
 * @param {Object} data
 * 获取用户默认地址
 */
export function getDefaultAddressApi(data) {
  return request.request({
    url: url.GetDefaultAddress,
    method: "post",
    data,
  });
}
/**
 * @param {Object} data
 * 用户地址列表
 */
export function getAddressApi(data) {
  return request.request({
    url: url.GetAddress,
    method: "post",
    data,
  });
}

/**
 * @param {Object} data
 * 支付订单
 */
export function orderPayApi(data) {
  return request.request({
    url: url.OrderPay,
    method: "post",
    data,
  });
}
/**
 * @param {Object} data
 * 创建订单
 */
export function orderBalanceCreateApi(data) {
  return request.request({
    url: url.OrderBalanceCreate,
    method: "post",
    data,
  });
}

/**
 * @param {Object} data
 * //提现配置
 */
export function withdrawConfigApi(data) {
  return request.request({
    url: url.WithdrawConfig,
    method: "post",
    data,
  });
}
/**
 * @param {Object} data
 * //提现
 */
export function withdrawApi(data) {
  return request.request({
    url: url.Withdraw,
    method: "post",
    data,
  });
}

/**
 * @param {Object} data
 * 拼团详情
 */
export function groupDetailApi(data) {
  return request.request({
    url: url.GroupDetail,
    method: "post",
    data,
  });
}
/**
 * @param {Object} data
 * 支付订单
 */
export function payGroupOrderApi(data) {
  return request.request({
    url: url.PayGroupOrder,
    method: "post",
    data,
  });
}
/**
 * @param {Object} data
 * 创建订单
 */
export function orderCreateApi(data) {
  return request.request({
    url: url.OrderCreate,
    method: "post",
    data,
  });
}

/**
 * @param {Object} data
 * 热门拼团列表
 */
export function groupListApi(data) {
  return request.request({
    url: url.GroupList,
    method: "post",
    noToken: true,
    data,
  });
}
