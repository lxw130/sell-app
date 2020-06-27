/**
 * 商品相关的所有请求
 */

import req from "@/utils/request"; // 引入封装好的工具函数

// 获取分类列表
export function getCateList(params) {
  return req.get('/goods/catelist', params)
}

// 编辑分类完
export function editCate(params) {
  return req.post('/goods/editcate', params)
}

// 获取所有商品分类的名称
export function getCateNameList() {
  return req.get('/goods/categories')
}

// 添加商品
export function addGoods(params) {
  return req.post('/goods/add', params)
}

// 获取商品列表
export function getGoodsList(params) {
  return req.get('/goods/list', params)
}