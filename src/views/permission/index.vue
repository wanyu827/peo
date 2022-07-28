<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTool style="margin-bottom: 20px">
        <template #right>
          <el-button type="primary" size="mini" @click="showDialog('0')">
            添加权限
          </el-button>
        </template>
      </PageTool>

      <el-card>
        <el-table border :data="list" row-key="id">
          <el-table-column label="名称" prop="name"></el-table-column>
          <el-table-column
            label="标识"
            prop="code"
            align="center"
          ></el-table-column>
          <el-table-column
            label="描述"
            prop="description"
            align="center"
          ></el-table-column>
          <el-table-column label="操作" align="center">
            <template v-slot="scope">
              <el-button
                v-if="scope.row.type === 1"
                type="text"
                @click="showDialog(scope.row.id)"
              >
                添加
              </el-button>
              <el-button type="text" @click="editDialog(scope.row)"
                >编辑</el-button
              >
              <el-button type="text">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <el-dialog :title="title" :visible.sync="dialogVisible" @close="reset">
      <el-form
        ref="permissionRef"
        label-width="80px"
        :model="permissionForm"
        :rules="permissionFormRules"
      >
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="permissionForm.name"></el-input>
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="permissionForm.code"></el-input>
        </el-form-item>
        <el-form-item label="权限描述" prop="description">
          <el-input v-model="permissionForm.description"></el-input>
        </el-form-item>
        <el-form-item label="开启" prop="enVisible">
          <el-switch v-model="permissionForm.enVisible"></el-switch>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" size="mini" @click="save">确定</el-button>
        <el-button size="mini" @click="dialogVisible = false">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getPermissions, addPermission, editPermission } from '@/api/permission'
import { tranferListToTree } from '@/utils'
export default {
  filters: {},
  components: {},
  data () {
    return {
      list: [],
      dialogVisible: false,
      permissionForm: {
        enVisible: false,
        name: '',
        code: '',
        description: '',
        type: '',
        pid: ''
      },
      permissionFormRules: {
        name: [
          { required: true, message: '权限名称不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '权限标识不能为空', trigger: 'blur' }
        ]
      },
      id: null
    }
  },
  computed: {
    title () {
      return this.id ? '新增权限' : '编辑权限'
    }
  },
  watch: {},
  created () {
    this.getPermissions()
  },
  methods: {
    async getPermissions () {
      let res = await getPermissions()
      res = tranferListToTree(res, '0')
      this.list = res
      // console.log(res)
    },
    showDialog (id) {
      console.log(id)
      this.id = id
      this.dialogVisible = true
    },
    reset () {
      this.$refs.permissionRef.resetFields()
      this.permissionForm = {
        enVisible: false,
        name: '',
        code: '',
        description: '',
        type: '',
        pid: ''
      }
    },
    async save () {
      if (this.id) {
        this.permissionForm.pid = this.id
        this.permissionForm.type = this.id === '0' ? 1 : 2
        await addPermission(this.permissionForm)
      } else {
        // 编辑
        await editPermission(this.permissionForm)
      }
      this.getPermissions()
      this.dialogVisible = false
    },
    editDialog (row) {
      this.id = null
      this.permissionForm = { ...row }
      this.dialogVisible = true
    }
  }
}
</script>

<style scoped lang='scss'>
</style>
