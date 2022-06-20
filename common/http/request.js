import config from "@/common/config.js";
import utils from "@/static/js/utils.js";

const axios = {
  config: {
    baseUrl: config.baseUrl,
    data: {},
    method: "get",
    dataType: "json",
    responseType: "text",
    header: {
      "content-type": "application/x-www-form-urlencoded;application/json",
    },
  },
  interceptor: {
    request: null,
    response: null,
  },
  request(options) {
    if (!options) {
      options = {};
    }

    let _token = uni.getStorageSync("token");

    options.baseUrl = options.baseUrl || this.config.baseUrl;
    options.dataType = options.dataType || this.config.dataType;
    options.url = options.baseUrl + options.url;
    options.data = options.data || {};
    options.method = options.method || this.config.method;
    options.header = options.header || this.config.header;
    options.timeout = 80000;
    options.flag = options.flag || 0; // 传1不调登录
    options.flagz = options.flagz || 0; // 传1不做错误处理

    // 设置token
    if (!options.noToken) {
      options.data = Object.assign(options.data, {
        token: _token,
      });
    }

    let errorMsg = options.errorMsg || "系统异常";
    return new Promise((resolve, reject) => {
      let _config = null;
      _config = Object.assign({}, this.config, options);
      _config.requestId = new Date().getTime();
      uni.request(
        Object.assign(
          {
            success: (res) => {
              // 抛出错误
              if (res && res.statusCode != 200 && options.flagz == 0) {
                utils.showToast({
                  title: res.data.errMsg || errorMsg,
                });
                return;
              }
              if (res.data.code == 100 && res.data.meg == "用户未登录") {
                uni.removeStorageSync("token");
                uni.removeStorageSync("userInfo");
              }
              if (res.data && res.data.code != 200 && options.flagz == 0) {
                utils.showToast({
                  title: res.data.meg || errorMsg,
                });
                return;
              }

              resolve(res);
            },
            fail: (err) => {
              reject(err);
            },
          },
          _config
        )
      );
    });
  },

  get(url, data, options) {
    if (!options) {
      options = {};
    }
    options.url = url;
    options.data = data;
    options.method = "GET";
    return this.request(options);
  },

  post(url, data, options) {
    if (!options) {
      options = {};
    }
    options.url = url;
    options.data = data;
    options.method = "POST";
    return this.request(options);
  },

  put(url, data, options) {
    if (!options) {
      options = {};
    }
    options.url = url;
    options.data = data;
    options.method = "PUT";
    return this.request(options);
  },

  delete(url, data, options) {
    if (!options) {
      options = {};
    }
    options.url = url;
    options.data = data;
    options.method = "DELETE";
    return this.request(options);
  },
};

/**
 * 请求接口日志记录
 */
function _reqlog(req) {
  if (process.env.NODE_ENV === "development") {
    //console.log("【" + req.requestId + "】 地址：" + req.url)
    if (req.data) {
      //console.log("【" + req.requestId + "】 请求参数：" + JSON.stringify(req.data))
    }
  }
  //TODO 调接口异步写入日志数据库
}

/**
 * 响应接口日志记录
 */
function _reslog(res) {
  let _statusCode = res.statusCode;
  if (process.env.NODE_ENV === "development") {
    //console.log("【" + res.config.requestId + "】 地址：" + res.config.url)
    if (res.config.data) {
      //console.log("【" + res.config.requestId + "】 请求参数：" + JSON.stringify(res.config.data))
    }
    //console.log("【" + res.config.requestId + "】 响应结果：" + JSON.stringify(res))
  }
  //TODO 除了接口服务错误外，其他日志调接口异步写入日志数据库
  switch (_statusCode) {
    case 200:
      break;
    case 401:
      break;
    case 404:
      break;
    default:
      break;
  }
}

export default axios;
