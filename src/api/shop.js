/**
 * 订单相关请求
 */

import req from "@/utils/request"; // 引入封装好的工具函数

// 获取店铺信息
export function getShopInfo() {
  return req.get('/shop/info')
}