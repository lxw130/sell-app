/**
 * 订单相关请求
 */
import req from "@/utils/request"; // 引入封装好的工具函数

// 获取素有订单数据
export function getOrderList(params) {
  return req.get('/order/list', params)
}

// 获取订单接口数据
export function getOrder(params) {
  return req.get('/order/ordertotal', params)
}