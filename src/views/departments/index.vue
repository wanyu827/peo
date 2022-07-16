<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="组织架构" style="">
            <!-- 用了一个行列布局 -->
            <TreeItem :node="titleObj"></TreeItem>
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
      titleObj: {}
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
