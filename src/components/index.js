import PageTool from './PageTool'
import UploadImage from './UploadImage'
import FullScreen from './FullScreen'
export default {
  install (Vue) {
    Vue.component('PageTool', PageTool)
    Vue.component('UploadImage', UploadImage)
    Vue.component('FullScreen', FullScreen)
  }
}
