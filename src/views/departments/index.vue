<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card
        v-loading="isLoading"
        style="min-height: 700px"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      >
        <el-tabs>
          <el-tab-pane label="组织架构" style="">
            <!-- 用了一个行列布局 -->
            <TreeItem
              :node="titleObj"
              @delDepartment="getDepartmentsList"
            ></TreeItem>
            <el-tree :data="data" default-expand-all>
              <template v-slot="scope">
                <TreeItem
                  :node="scope.node"
                  @delDepartment="getDepartmentsList"
                ></TreeItem>
              </template>
            </el-tree>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <!-- 返回顶部 -->
    <el-backtop></el-backtop>
  </div>
</template>

<script>
import { getDepartmentsList } from '@/api/departments'
import TreeItem from './components/TreeItem.vue'
export default {
  filters: {},
  components: { TreeItem },
  data () {
    return {
      data: [],
      titleObj: {},
      isLoading: true

    }
  },
  computed: {},
  watch: {},
  created () { this.getDepartmentsList() },
  methods: {
    async getDepartmentsList () {
      const res = await getDepartmentsList()
      console.log(res)
      function transferListToTree (list, pid) {
        const list1 = []
        list.forEach(item => {
          if (item.pid === pid) {
            list1.push(item)
            item.children = transferListToTree(list, item.id)
          }
        })
        return list1
      }
      this.data = transferListToTree(res.depts, '')
      this.titleObj = res.depts[0]
      this.isLoading = false
    }
  }
}
</script>

<style scoped lang='scss'>
::v-deep .el-tree-node {
  padding: 10px !important;
  span,
  div {
    font-size: 20px;
  }
}
::v-deep .el-tree-node__content {
  padding: 20px 0 !important;
}
</style>
