<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTool title="共1条记录">
        <template #right>
          <el-button type="danger" size="mini" @click="exportExcel">
            普通excel导出
          </el-button>
          <el-button type="info" size="mini" @click="exportExcel1">
            复杂表头excel导出
          </el-button>
          <el-button
            type="success"
            size="mini"
            @click="$router.push('/import?type=user')"
          >
            excel导入
          </el-button>
          <el-button
            type="primary"
            size="mini"
            @click="addEmployeeVisible = true"
          >
            新增员工
          </el-button>
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
                @click="showQrDialog(scope.row.staffPhoto)"
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
          <!-- <el-table-column
            label="聘用形式"
            prop="formOfEmployment"
            :formatter="formatterEmployee"
            align="center"
          ></el-table-column> -->
          <!-- 过滤器写法 -->
          <!-- <el-table-column
            label="聘用形式"
            prop="formOfEmployment"
            align="center"
          >
            <template v-slot="scope">
              {{ scope.row.formOfEmployment | formatFormType }}
            </template>
          </el-table-column> -->
          <el-table-column
            label="部门"
            prop="departmentName"
            align="center"
          ></el-table-column>
          <el-table-column label="入职时间" align="center" prop="timeOfEntry">
            <template v-slot="scope">
              {{ scope.row.timeOfEntry | dateFormat }}
            </template>
          </el-table-column>
          <el-table-column label="状态" prop="enableState" align="center">
            <template v-slot="scope">
              <el-switch :value="scope.row.enableState"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="350px" align="center">
            <template v-slot="scope">
              <el-button
                type="text"
                @click="$router.push('/employee/detail/' + scope.row.id)"
              >
                查看
              </el-button>
              <el-button type="text">转正</el-button>
              <el-button type="text">调岗</el-button>
              <el-button type="text">离职</el-button>
              <el-button type="text" @click="showRoleDialog(scope.row.id)">
                角色
              </el-button>
              <el-button type="text">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <el-dialog title="分配角色" :visible.sync="roleVisible">
      <el-checkbox-group v-model="checkList">
        <el-checkbox v-for="item in roleList" :key="item.id" :label="item.id">{{
          item.name
        }}</el-checkbox>
      </el-checkbox-group>
      <template #footer>
        <el-button type="primary" @click="assignRoles">确认</el-button>
        <el-button @click="roleVisible = false">取消</el-button>
      </template>
    </el-dialog>
    <!-- 新增员工 -->
    <el-dialog
      title="新增员工"
      :visible.sync="addEmployeeVisible"
      @close="handleClose"
    >
      <el-form
        ref="employeeRef"
        label-width="80px"
        :model="employeeForm"
        :rules="employeeFormRules"
      >
        <el-form-item label="姓名" prop="username">
          <el-input v-model="employeeForm.username"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="employeeForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="入职时间" prop="timeOfEntry">
          <el-date-picker
            v-model="employeeForm.timeOfEntry"
            type="date"
            placeholder="选择日期"
            clearable
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="聘用形式" prop="formOfEmployment">
          <!-- <el-input v-model="employeeForm.formOfEmployment"></el-input> -->
          <el-select
            v-model="employeeForm.formOfEmployment"
            placeholder="请选择"
          >
            <el-option
              v-for="item in hireType"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工号" prop="workNumber">
          <el-input v-model="employeeForm.workNumber"></el-input>
        </el-form-item>
        <el-form-item label="组织名称" prop="departmentName">
          <el-input
            v-model="employeeForm.departmentName"
            @focus="showDepartment"
          >
          </el-input>
          <el-tree
            v-if="departmentList.length > 0"
            :data="departmentList"
            default-expand-all
            :props="{ label: 'name' }"
            @node-click="handleNodeClick"
          ></el-tree>
        </el-form-item>
        <el-form-item label="转正时间" prop="correctionTime">
          <el-date-picker
            v-model="employeeForm.correctionTime"
            type="date"
            placeholder="选择日期"
            clearable
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary">确定</el-button>
        <el-button @click="addEmployeeVisible = false">取消</el-button>
      </template>
    </el-dialog>
    <!-- 二维码对话框 -->
    <el-dialog title="图片二维码" :visible.sync="qrcodeVisible">
      <el-row type="flex" justify="center">
        <canvas ref="canvas"></canvas>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import QRCode from 'qrcode'
import { getDepartmentsList } from '@/api/departments'
import { validMobile } from '@/utils/validate.js'
import { getUserDetailById } from '@/api/user'
import employees from '@/constant/employees'
import { getEmployee, assignRoles } from '@/api/employee'
import { getRoleList } from '@/api/setting'
export default {
  filters: {
    formatFormType (id) {
      var obj = employees.hireType.find(item => item.id === id - 0)
      if (obj) {
        return employees.hireType.find(item => item.id === id).value
      } else {
        return '未知'
      }
    }
  },
  components: {},
  data () {
    // 自定义手机号校验规则
    const validateMobile = function (rule, value, callback) {
      validMobile(value) ? callback() : callback(new Error('手机号格式不正确'))
    }
    return {
      paramsObj: {
        page: 1,
        size: 20
      },
      // 员工信息
      employees: [],
      // 员工总数
      total: null,
      // 控制分配角色对话框
      roleVisible: false,
      // 选中角色列表
      checkList: [],
      // 角色列表
      roleList: [],
      // 员工id
      id: null,
      // 控制添加员工对话框显示
      addEmployeeVisible: false,
      // 添加员工表单
      employeeForm: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      // 添加角色表单校验
      employeeFormRules: {
        mobile: [
          { required: true, message: '必填', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ],
        timeOfEntry: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        workNumber: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      },
      hireType: employees.hireType,
      departmentList: [],
      qrcodeVisible: false
    }
  },
  computed: {},
  watch: {},
  created () {
    this.getEmployee()
  },
  methods: {
    // 获取员工列表
    async getEmployee () {
      const res = await getEmployee(this.paramsObj)
      console.log(res)
      this.employees = res.rows
      this.total = res.total
    },
    formatterEmployee (row, column, cellvalue, index) {
      var obj = employees.hireType.find(item => item.id === cellvalue - 0)
      if (obj) {
        return employees.hireType.find(item => item.id === cellvalue).value
      } else {
        return '未知'
      }
    },
    // 导出员工excel表格
    async exportExcel () {
      const { rows } = await getEmployee({ page: 1, size: 9999 })
      var data = []
      rows.forEach(item => {
        data.push(Object.values(item))
      })
      const headers = {
        'id': '编号',
        'username': '姓名',
        'mobile': '手机',
        'timeOfEntry': '入职日期',
        'formOfEmployment': '聘用形式',
        'correctionTime': '转正日期',
        'workNumber': '工号',
        'departmentName': '部门'
      }
      var tHeader = Object.keys(rows[0]).map(item => (headers[item]))
      import('@/vendor/Export2Excel').then(excel => {
        excel.export_json_to_excel({
          header: tHeader, // 表头 必填
          data, // 具体数据 必填
          filename: '员工信息表', // 非必填
          autoWidth: true, // 非必填
          bookType: 'xlsx' // 非必填
        })
      })
    },
    // 导出复杂表头
    exportExcel1 () {
      const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
      const merges = ['A1:A2', 'B1:F1', 'G1:G2']
      const tHeader = ['姓名', '手机号', '入职日期', '聘用形式', '转正日期', '工号', '部门']
      const data = [
        ['张三', '13000000', '2019-1-1', '正式', '2019-1-2', '110', 'java部门'],
        ['李四', '13000000', '2019-1-1', '正式', '2019-1-2', '111', 'java部门']
      ]

      import('@/vendor/Export2Excel').then(excel => {
        excel.export_json_to_excel({
          header: tHeader, // 表头 必填
          multiHeader, // 第一行表头 复杂表头
          data, // 具体数据 必填
          filename: 'excel-list', // 非必填
          autoWidth: true, // 非必填
          bookType: 'xlsx', // 非必填
          merges // 设置合并规则
        })
      })
    },
    // 点击分配角色
    async showRoleDialog (id) {
      this.id = id
      const { rows } = await getRoleList({ page: 1, size: 9999 })
      this.roleList = rows
      const { roleIds } = await getUserDetailById(id)
      this.checkList = roleIds
      this.roleVisible = true
    },
    // 分配角色
    async assignRoles () {
      const res = await assignRoles({
        id: this.id,
        roleIds: this.checkList
      })
      console.log(res)
      this.roleVisible = false
    },
    // 关闭对话框重置表单
    handleClose () {
      this.$refs.employeeRef.resetFields()
      this.departmentList = []
    },
    // 点击组织输入框，展示组织列表
    async showDepartment () {
      const res = await getDepartmentsList()
      // 我们的数据不能直接使用，而是先加工处理一下才能使用 递归在写的时候慢慢就意识到了 层次不确定
      function tranferListToTree (list, pid) {
        var list1 = []
        list.forEach(item => {
          if (item.pid === pid) {
            list1.push(item)
            item.children = tranferListToTree(list, item.id)
          }
        })
        return list1
      }
      this.departmentList = tranferListToTree(res.depts, '')
    },
    // 组织选择
    handleNodeClick (row) {
      this.employeeForm.departmentName = row.name
      this.departmentList = []
    },
    showQrDialog (src) {
      this.qrcodeVisible = true
      this.$nextTick(function () {
        QRCode.toCanvas(this.$refs.canvas, src, function (error) {
          if (error) console.error(error)
          console.log('success!')
        })
      })
    }

  }
}
</script>

<style scoped lang='scss'>
</style>
