<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTool title="共1条记录">
        <template #right>
          <el-button type="danger" size="mini">普通excel导出</el-button>
          <el-button type="info" size="mini">复杂表头excel导出</el-button>
          <el-button type="success" size="mini">excel导入</el-button>
          <el-button type="primary" size="mini">新增员工</el-button>
        </template>
      </PageTool>

      <el-card>
        <el-table border :data="employees">
          <el-table-column label="序号" type="index"></el-table-column>
          <el-table-column
            label="姓名"
            sortable
            prop="username"
            align="center"
          ></el-table-column>
          <el-table-column label="头像" prop="staffPhoto" align="center">
            <template v-slot="scope">
              <img
                v-imgerror
                :src="scope.row.staffPhoto"
                style="width: 50px; height: 50px; border-radius: 50%"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="手机号"
            prop="mobile"
            align="center"
          ></el-table-column>
          <el-table-column
            label="工号"
            prop="workNumber"
            align="center"
          ></el-table-column>
          <!-- 使用element组件提供的formatter写法 -->
          <el-table-column
            label="聘用形式"
            prop="formOfEmployment"
            :formatter="formatterEmployee"
            align="center"
          ></el-table-column>
          <!-- 过滤器写法 -->
          <el-table-column
            label="聘用形式"
            prop="formOfEmployment"
            align="center"
          >
            <template v-slot="scope">
              {{ scope.row.formOfEmployment | formatFormType }}
            </template>
          </el-table-column>
          <el-table-column
            label="部门"
            prop="departmentName"
            align="center"
          ></el-table-column>
          <el-table-column
            label="入职时间"
            align="center"
            prop="timeOfEntry"
          ></el-table-column>
          <el-table-column
            label="状态"
            prop="enableState"
            align="center"
          ></el-table-column>
          <el-table-column label="操作" width="350px" align="center">
            <template>
              <el-button type="text">查看</el-button>
              <el-button type="text">转正</el-button>
              <el-button type="text">调岗</el-button>
              <el-button type="text">离职</el-button>
              <el-button type="text">角色</el-button>
              <el-button type="text">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script>
import employees from '@/constant/employees'
import { getEmployee } from '@/api/employee'
export default {
  filters: {
    formatFormType (id) {
      return employees.hireType.find(item => item.id === id).value
    }
  },
  components: {},
  data () {
    return {
      paramsObj: {
        page: 1,
        size: 4
      },
      employees: [],
      total: null
    }
  },
  computed: {},
  watch: {},
  created () {
    this.getEmployee()
  },
  methods: {
    async getEmployee () {
      const res = await getEmployee(this.paramsObj)
      console.log(res)
      this.employees = res.rows
      this.total = res.total
    },
    formatterEmployee (row, column, cellvalue, index) {
      return employees.hireType.find(item => item.id === cellvalue).value
    }
  }
}
</script>

<style scoped lang='scss'>
</style>
