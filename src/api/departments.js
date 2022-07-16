import request from '@/utils/request'

/**
 * 获取组织列表
 * @returns
 */
export const getDepartmentsList = () => request({
  url: '/company/department'
})

// 根据部门id删除
export const delDepartment = id => {
  return request({
    method: 'DELETE',
    url: `/company/department/${id}`
  })
}
