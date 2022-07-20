import request from '@/utils/request'
/**
 * 获取员工列表
 * @param {*} param0 page 页码  size 每页条数
 * @returns
 */
export const getEmployee = ({ page, size }) => request({
  url: '/sys/user',
  params: { page, size }
})
