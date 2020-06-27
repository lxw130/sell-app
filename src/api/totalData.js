/**
 * 报表统计相关请求
 */
import req from "@/utils/request"; // 引入封装好的工具函数

// 获取首页数据
export function getTotalData() {
  return req.get('/order/totaldata')
}