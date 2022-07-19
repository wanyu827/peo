<template>
  <div>
    <el-button type="primary" size="mini" @click="roleVisible = true">
      添加角色
    </el-button>
    <el-table :data="roleList" border>
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column
        label="角色名"
        prop="name"
        width="160px"
        sortable
      ></el-table-column>
      <el-table-column
        label="描述"
        prop="description"
        sortable
      ></el-table-column>
      <el-table-column label="操作" width="300px">
        <template slot-scope="scope">
          <el-button type="text" @click="showRightDialog(scope.row.id)">
            分配权限
          </el-button>
          <el-button type="text">修改</el-button>
          <el-button type="text" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="rightVisible">
      <!-- v-if作用：保证每次对话框关闭的时候 让tree销毁 显示对话框的时候 看到的tree是一个新的el-tree -->
      <el-tree
        v-if="rightVisible"
        ref="myTree"
        :data="permissions"
        :props="{ label: 'name' }"
        default-expand-all
        show-checkbox
        node-key="id"
        :default-checked-keys="selectedPermission"
      ></el-tree>
      <template #footer>
        <el-button type="primary" @click="save">确定</el-button>
        <el-button @click="rightVisible = false">取消</el-button>
      </template>
    </el-dialog>
    <!-- 分页 -->
    <el-row type="flex" justify="end">
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :current-page="paramsObj.page"
        :page-size="paramsObj.pagesize"
        :page-sizes="[2, 3, 4, 5, 6]"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      >
      </el-pagination>
    </el-row>
    <!-- 新增角色对话框 -->
    <el-dialog title="新增角色" :visible.sync="roleVisible" @close="reset">
      <el-form
        ref="addRoleFormRef"
        label-width="80px"
        :model="addRoleForm"
        :rules="rules"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="addRoleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="addRoleForm.description"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="onClick">确定</el-button>
        <el-button @click="roleVisible = false">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, delRole, addRole } from '@/api/setting'
import { getPermissions, getPermissionsById, assignPermission } from '@/api/permission'
import { tranferListToTree } from '@/utils/index'
export default {
  name: 'RoleManage',
  filters: {},
  components: {},
  data () {
    return {
      paramsObj: {
        page: 1,
        pagesize: 4
      },
      roleList: [],
      total: 0,
      rightVisible: false,
      permissions: [],
      selectedPermission: [],
      id: null,
      roleVisible: false,
      addRoleForm: {
        name: '',
        description: ''
      },
      rules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created () {
    this.getRoleList()
  },
  methods: {
    async getRoleList () {
      const res = await getRoleList(this.paramsObj)
      console.log(res)
      this.roleList = res.rows
      this.total = res.total
    },
    handleCurrentChange (page) {
      this.paramsObj.page = page
      this.getRoleList()
    },
    handleSizeChange (pagesize) {
      this.paramsObj.pagesize = pagesize
      this.getRoleList()
    },
    del (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await delRole(id)
        if (this.roleList.length === 1 && this.paramsObj.page > 1) {
          this.paramsObj.page--
        }
        this.getRoleList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    async showRightDialog (id) {
      // 获取所有的权限点
      const res = await getPermissions()
      this.permissions = tranferListToTree(res, '0')
      // 获取当前的权限点
      const res1 = await getPermissionsById(id)
      this.selectedPermission = res1.permIds
      console.log(res1)
      this.id = id
      this.rightVisible = true
    },
    async save () {
      // console.log(this.$refs.myTree.getCheckedKeys())
      await assignPermission(this.id, this.$refs.myTree.getCheckedKeys())
      this.rightVisible = false
    },
    onClick () {
      // 表单二次校验
      this.$refs.addRoleFormRef.validate(async bool => {
        if (!bool) {
          this.$message.error('表单数据非法')
        }
        await addRole(this.addRoleForm)
        this.getRoleList()
      })
    },
    reset () {
      this.$refs.addRoleFormRef.resetFields()
    }
  }
}
</script>

<style scoped lang='scss'>
.el-table {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
