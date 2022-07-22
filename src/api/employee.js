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

// 批量从excel中导入员工列表
export const importEmployee = data => {
  return request({
    method: 'POST',
    url: '/sys/user/batch',
    data
  })
}
