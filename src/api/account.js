/**
 * 账号相关的请求
 */

import req from "@/utils/request"; // 引入封装好的工具函数

// 登录
export function checkLogin(params) {
  return req.post("/users/checkLogin", params);
}

// 添加账号
export function addAccount(params) {
  return req.post("/users/add", params);
}

// 获取账号列表
export function getAccList(params) {
  return req.get("/users/list", params);
}

// 删除账号
export function delAcc(params) {
  return req.get("/users/del", params);
}

// 批量删除
export function delAccBatch(params) {
  return req.get("/users/batchdel", params);
}

// 编辑
export function editAcc(params) {
  return req.post("/users/edit", params);
}

// 验证旧密码
export function validateOldPwd(params) {
  return req.get("/users/checkoldpwd", params);
}

// 修改密码
export function editPwd(params) {
  return req.post("/users/editpwd", params);
}

// 个人中心信息
export function getAccInfo() {
  return req.get("/users/info");
}

// 修改头像
export function updateAvatar(params) {
  return req.get("/users/avataredit", params);
}

// 获取用户角色
export function getRole() {
  return req.get("/users/role");
}