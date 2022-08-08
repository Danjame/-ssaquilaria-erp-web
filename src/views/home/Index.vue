<template>
  <el-card>
    <div class="camera_header">
      <p class="camera_title">实时监控</p>
      <span class="title_line" />
    </div>
    <el-form class="camera_form">
      <el-form-item label="孵化基地">
        <el-select v-model="camera.channel" placeholder="请选择摄像头" clearable>
          <el-option v-for="(channel, i) in channels" :key="i" :label="channel.channelName" :value="channel.channelNo" />
        </el-select>
      </el-form-item>
      <span id="camera" />
    </el-form>
  </el-card>
</template>

<script lang="ts" setup>
import { getCameraAccessToken, getCameraChannels } from '@/api/home/camera'
import { Channel } from '@/api/home/types/camera'
// @ts-ignore
import EZUIKit from 'ezuikit-js'

onMounted(() => {
  loadCameraChannels()
})

const camera = reactive({
  deviceSerial: 'F06081904',
  accessToken: '',
  channel: undefined
})

const channels = ref<Channel[]>([])
const loadCameraChannels = async () => {
  const { data: { code, data: { accessToken } } } = await getCameraAccessToken()
  if (code === '200') {
    camera.accessToken = accessToken
    const { data: { code, data } } = await getCameraChannels(accessToken, camera.deviceSerial)
    if (code === '200') channels.value = data.sort((a: Channel, b: Channel) => a.channelNo - b.channelNo)
  }
}

let player: EZUIKit.EZUIKitPlayer
const initPlayer = async (channel: string) => {
  player = new EZUIKit.EZUIKitPlayer({
    autoplay: true,
    id: 'camera',
    accessToken: camera.accessToken,
    url: `ezopen://open.ys7.com/${camera.deviceSerial}/${channel}.hd.live`,
    template: 'standard', // simple - 极简版;standard-标准版;security - 安防版(预览回放);voice-语音版；
    audio: 1, // 是否默认开启声音 0 - 关闭 1 - 开启
    // header: ["capturePicture", "save", "zoom"], // 如果templete参数不为simple,该字段将被覆盖
    // plugin: ['talk'], // 加载插件，talk-对讲
    // footer: ['talk', 'broadcast', 'hd', 'fullScreen'], // 视频下方底部控件,如果template参数不为simple,该字段将被覆盖
    // openSoundCallBack: data => console.log("开启声音回调", data),
    // closeSoundCallBack: data => console.log("关闭声音回调", data),
    // startSaveCallBack: data => console.log("开始录像回调", data),
    // stopSaveCallBack: data => console.log("录像回调", data),
    // capturePictureCallBack: data => console.log("截图成功回调", data),
    // fullScreenCallBack: data => console.log("全屏回调", data),
    // getOSDTimeCallBack: data => console.log("获取OSDTime回调", data),
    width: 720,
    height: 480
  })
}

// 监听频道变化
watch(() => camera.channel, channel => {
  if (channel) {
    if (!player) {
      initPlayer(channel)
    } else {
      player.stop()
      player.play({
        url: `ezopen://open.ys7.com/${camera.deviceSerial}/${channel}.hd.live`
      })
    }
  } else {
    if (player) player.stop()
  }
})
</script>

<style lang="scss" scoped>
.title_line {
  width: 80%;
  background:  $primary-color;
  height: 1px;
}
.camera_header{
  display: flex;
  align-items: center;
}
.camera_title {
  height: 60px;
  width: 60px;
  margin-right: 10px;
  background: $primary-color;
  border-radius: 50%;
  line-height: 60px;
  text-align: center;
  color: #fff;
  font-size: 12px;
}
.camera_form {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
