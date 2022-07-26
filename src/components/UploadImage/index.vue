<template>
  <div>
    <el-upload
      action="#"
      list-type="picture-card"
      accept="image/jpg,image/jpeg,image/png,image/gif"
      :limit="limit"
      :on-change="handleChange"
      :file-list="fileList"
      :class="{ hidden: fileList.length === limit }"
      :http-request="handleRequest"
    >
      <i slot="default" class="el-icon-plus"></i>
      <div slot="file" slot-scope="{ file }">
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
        <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
          >
            <i class="el-icon-zoom-in"></i>
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleDownload(file)"
          >
            <i class="el-icon-download"></i>
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleRemove(file)"
          >
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
    </el-upload>
    <el-progress :percentage="percent"></el-progress>
    <el-dialog :visible.sync="dialogVisible" title="预览">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
var cos = new COS({
  SecretId: 'AKIDfAQRDjNnytZzA5lDSSDDyXsypRovpUv7',
  SecretKey: 'QaVBbmhsoVq9KVXKsFPM6fjaBXjiTzIn'
})
export default {
  props: {
    limit: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      fileList: [],
      percent: 0
    }
  },
  methods: {
    handleRemove (file, fileList) {
      console.log(file)
      this.fileList = this.fileList.filter(item => item.uid !== file.uid)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleDownload (file) {
      console.log(file)
    },
    handleChange (file, fileList) {
      this.fileList = fileList
    },
    handleRequest (obj) {
      // console.log(11)
      var that = this
      cos.putObject({
        Bucket: 'wanyu-1256811792', /* 必须 */
        Region: 'ap-shanghai', /* 存储桶所在地域，必须字段 */
        Key: Date.now() + '_' + obj.file.name, /* 必须 */
        StorageClass: 'STANDARD',
        Body: obj.file, // 上传文件对象
        onProgress: function (progressData) {
          // console.log(JSON.stringify(progressData))
          that.percent = Math.ceil(progressData.loaded / progressData.total * 100)
        }
      }, function (err, data) {
        console.log(err || data)
      })
    }

  }
}
</script>

<style scoped lang='scss'>
// 原理：hidden类名是动态绑定
.hidden ::v-deep .el-upload--picture-card {
  display: none;
}
</style>
