<template>
  <div style="width: 100%">
    <el-row
      type="flex"
      justify="space-between"
      align="middle"
      style="height: 40px; padding: 30px 140px; font-size: 14px; width: 100%"
    >
      <el-col>
        <span>{{ node.data ? node.data.name : node.name }} </span>
      </el-col>
      <el-col :span="4">
        <el-row type="flex" justify="end">
          <!-- 两个内容 -->
          <el-col>{{ node.data ? node.data.manager : "负责人" }}</el-col>
          <el-col>
            <!-- 下拉菜单 element -->
            <el-dropdown @command="onCommand">
              <span> 操作<i class="el-icon-arrow-down" /> </span>
              <!-- 下拉菜单 -->
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a">添加子部门</el-dropdown-item>
                <template v-if="node.data">
                  <el-dropdown-item command="b">编辑部门</el-dropdown-item>
                  <el-dropdown-item command="c">删除部门</el-dropdown-item>
                </template>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <el-dialog
      :title="title"
      :visible.sync="addDialogVisible"
      width="50%"
      @click.native.stop
      @close="handleClose"
    >
      <el-form
        ref="addFormRef"
        label-width="100px"
        :model="addDepartmentForm"
        :rules="rules"
      >
        <el-form-item label="部门名称" prop="name">
          <el-input
            v-model="addDepartmentForm.name"
            placeholder="1-50个字符"
          ></el-input>
        </el-form-item>
        <el-form-item label="部门编码" prop="code">
          <el-input
            v-model="addDepartmentForm.code"
            placeholder="1-50个字符"
          ></el-input>
        </el-form-item>
        <el-form-item label="部门负责人" prop="manager">
          <!-- <el-input
            v-model="addDepartmentForm.manager"
            placeholder="请选择负责人"
          ></el-input> -->
          <el-select
            v-model="addDepartmentForm.manager"
            placeholder="请选择"
            style="width: 100%"
            filterable
          >
            <el-option
              v-for="item in users"
              :key="item.id"
              :label="item.username"
              :value="item.username"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门介绍" prop="introduce">
          <el-input
            v-model="addDepartmentForm.introduce"
            placeholder="1-300个字符"
            type="textarea"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit"> 确 定 </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { delDepartment, addDepartment, getDepartmentsList, editDepartment } from '@/api/departments'
import { getSimpleUserList } from '@/api/user'
export default {
  name: 'TreeItem',
  filters: {},
  components: {},
  props: {
    node: {
      type: [Object, Array],
      required: true
    }
  },
  data () {
    const validateName = async (rule, value, callback) => {
      const res = await getDepartmentsList()
      if (this.isEdit) {
        const pid = this.node.data.pid
        console.log(this.node.data)
        console.log(res)
        res.depts.filter(item => item.pid === pid && item.id !== this.node.data.id).some(item => item.name === value) ? callback(new Error('部门名称重复')) : callback()
      } else {
        const id = this.node.data ? this.node.data.id : ''
        res.depts.filter(item => item.pid === id).some(item => item.name === value) ? callback(new Error('部门名称重复')) : callback()
      }
    }
    return {
      addDialogVisible: false,
      addDepartmentForm: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 负责人
        introduce: ''// 介绍
      },
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 3, max: 10, message: '长度3-10', trigger: 'blur' },
          { validator: validateName, trigger: 'change' }
        ]
      },
      users: [],
      isEdit: false
    }
  },
  computed: {
    title () {
      return this.isEdit ? '编辑部门' : '新增部门'
    }
  },
  watch: {},
  created () { },
  methods: {
    async onCommand (key) {
      if (this.users.length === 0) {
        this.getSimpleUserList()
      }
      this.isEdit = false
      if (key === 'a') {
        this.addDialogVisible = true
      } else if (key === 'b') {
        this.isEdit = true
        this.addDialogVisible = true
        console.log('编辑')
        this.addDepartmentForm = { ...this.node.data }
      } else {
        try {
          await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          console.log('确定')
          const res = await delDepartment(this.node.data.id)
          this.$emit('delDepartment')
          console.log(res)
        } catch (err) {
          console.log(err)
          this.$notify({
            message: '取消删除',
            duration: 500
          })
        }
      }
    },
    async getSimpleUserList () {
      const res = await getSimpleUserList()
      console.log(res)
      this.users = res
    },
    handleClose () {
      this.$refs.addFormRef.resetFields() // 重置表单
    },
    async onSubmit () {
      if (this.isEdit) {
        delete this.addDepartmentForm.children
        await editDepartment(this.addDepartmentForm)
      } else {
        this.addDepartmentForm.pid = this.node.data ? this.node.data.id : ''
        await addDepartment(this.addDepartmentForm)
      }
      this.addDialogVisible = false
      this.$emit('delDepartment')
    }
  }
}
</script>

<style scoped lang='scss'>
</style>
