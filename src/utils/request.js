/**
 * 封装整个项目的网络(ajax)请求工具函数
 */

import axios from "axios";
import qs from "qs";
import local from "@/utils/local";
import { Message } from "element-ui";
import router from "@/router";

axios.defaults.baseURL = "http://127.0.0.1:5000"; // 设置请求服务器地址
axios.defaults.timeout = 5000; // 请求超时时间

// 请求拦截器
axios.interceptors.request.use((config) => {
  // 取出本地token
  let tk = local.get("tk");
  if (tk) {
    config.headers.Authorization = tk; // 统一给后端携带令牌
  }
  return config;
});

// 响应拦截器
axios.interceptors.response.use(
  (response) => {
    // 响应数据先拦截住  对成功和失败的状态码统一处理
    if (response.data.code !== undefined && response.data.msg !== undefined) {
      let { code, msg } = response.data;
      if (code === 0) {
        Message({
          type: "success",
          message: msg,
        });
      } else if (code === 1) {
        Message.error(msg);
      }
    }
    return response;
  },
  (err) => {
    if (
      err.response.data.code !== undefined &&
      err.response.data.msg !== undefined
    ) {
      let { code, msg } = err.response.data;
      if (code === 401) {
        Message.error(msg); // 弹出错误提示
        local.clear(); // 清空本地
        router.push("/login"); // 跳转到登录
      }
    }
  }
);

// 封装通用的get请求和post请求
export default {
  get(url, data = {}) {
    return new Promise((resolve, reject) => {
      axios
        .get(url, { params: data })
        .then((response) => {
          resolve(response.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  post(url, data = {}) {
    return new Promise((resolve, reject) => {
      axios
        .post(url, qs.stringify(data))
        .then((response) => {
          resolve(response.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};
