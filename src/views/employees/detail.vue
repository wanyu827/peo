<template>
  <div class="app-container">
    <el-card>
      <el-tabs v-model="activeName">
        <el-tab-pane label="登录账户设置" name="first">
          <el-form
            ref="userInfoRef"
            style="max-width: 400px; margin-left: 200px; margin-top: 50px"
            label-width="80px"
            :model="userInfo"
            :rules="userInfoRules"
          >
            <el-form-item label="姓名：" prop="username">
              <el-input v-model="userInfo.username"></el-input>
            </el-form-item>
            <el-form-item label="密码：" prop="password">
              <el-input v-model="userInfo.password"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="save">更新</el-button>
              <el-button>取消</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="个人详情" name="second">
          <UserInfo :id="id"></UserInfo>
        </el-tab-pane>
        <el-tab-pane label="岗位信息" name="third">
          <JobInfo></JobInfo>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import UserInfo from './components/UserInfo.vue'
import JobInfo from './components/JobInfo.vue'
import { saveEmployee } from '@/api/employee'
import { getUserDetailById } from '@/api/user'
export default {
  filters: {},
  components: { UserInfo, JobInfo },
  props: {
    id: {
      type: [Number, String],
      required: true
    }
  },
  data () {
    return {
      activeName: 'first',
      userInfo: {
        username: '',
        password: ''
      },
      userInfoRules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created () {
    this.getUserDetailById()
  },
  methods: {
    async getUserDetailById () {
      const res = await getUserDetailById(this.id)
      res.password = null
      this.userInfo = res
    },
    save () {
      this.$refs.userInfoRef.validate(async valid => {
        if (!valid) return this.$message.error('表单数据校验失败')
        await saveEmployee(this.id, this.userInfo)
        this.$message.success('更新成功')
      })
    }
  }
}
</script>

<style scoped lang='scss'>
</style>
