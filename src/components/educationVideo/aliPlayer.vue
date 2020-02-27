<template>
  <div class='prism-player' :id='playerId'>
    <div class="shuiyin-wrap">
      <div class="shuiyin">优财网校{{user_id}}</div>
      <div class="shuiyin">优财网校{{user_id}}</div>
      <div class="shuiyin">优财网校{{user_id}}</div>
      <div class="shuiyin">优财网校{{user_id}}</div>
    </div>
    <div class="sign-box" v-if="canSign && visible">
      <div class="opa"></div>
      <div class="sign-cont">
        <p>签到获得本课程CPE积分</p>
        <button class="btn-com" @click="signSub">签到</button>
        <span>{{jianTime}}秒之后关闭～</span>
      </div>
    </div>
    <div class="progress-bar"></div>
  </div>
</template>

<script>
export default {
  name: 'Aliplayer',
  props: {
    jianTime: {
      type: Number
    },
    visible: {
      type: Boolean,
      default: false
    },
    canSign: {
      type: Boolean,
      default: false
    },
    user_id: {
      type: Number
    },
    playStyle: {
      type: String,
      default: ''
    },
    aliplayerSdkPath: {
      type: String,
      default: 'https://g.alicdn.com/de/prismplayer/2.8.2/aliplayer-min.js'
    },
    autoplay: {
      type: Boolean,
      default: true
    },
    isLive: {
      type: Boolean,
      default: false
    },
    playsinline: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    },
    controlBarVisibility: {
      type: String,
      default: 'hover'
    },
    useH5Prism: {
      type: Boolean,
      default: false
    },
    disableSeek: {
      type: Boolean,
      default: true
    },
    useFlashPrism: {
      type: Boolean,
      default: false
    },
    vid: {
      type: String,
      default: ''
    },
    playauth: {
      type: String,
      default: ''
    },
    playtime: {
      type: Number,
      default: 0
    },
    cover: {
      type: String,
      default: ''
    },
    format: {
      type: String,
      default: 'mp4'
    },
    x5_video_position: {
      type: String,
      default: 'top'
    },
    x5_type: {
      type: String,
      default: 'mp4'
    },
    x5_fullscreen: {
      type: Boolean,
      default: false
    },
    x5_orientation: {
      type: Number,
      default: 2
    },
    autoPlayDelay: {
      type: Number,
      default: 0
    },
    autoPlayDelayDisplayText: {
      type: String
    },
    endPlay: {
      type: Boolean,
      default: true
    },
    liveSkin: [
      {
        name: 'bigPlayButton',
        align: 'blabs',
        x: 30,
        y: 80
      },
      {
        name: 'errorDisplay',
        align: 'tlabs',
        x: 0,
        y: 0
      },
      {
        name: 'infoDisplay'
      },
      {
        name: 'controlBar',
        align: 'blabs',
        x: 0,
        y: 0,
        children: [
          {
            name: 'liveDisplay',
            align: 'tlabs',
            x: 15,
            y: 25
          },
          {
            name: 'fullScreenButton',
            align: 'tr',
            x: 10,
            y: 25
          },
          {
            name: 'volume',
            align: 'tr',
            x: 10,
            y: 25
          }
        ]
      }
    ],
    playSkin: [
      {
        name: 'bigPlayButton',
        align: 'blabs',
        x: 30,
        y: 80
      },
      {
        name: 'controlBar',
        align: 'blabs',
        x: 0,
        y: 0,
        children: [
          {
            name: 'progress',
            align: 'tlabs',
            x: 0,
            y: 0
          },
          {
            name: 'playButton',
            align: 'tl',
            x: 15,
            y: 26
          },
          {
            name: 'nextButton',
            align: 'tl',
            x: 10,
            y: 26
          },
          {
            name: 'timeDisplay',
            align: 'tl',
            x: 10,
            y: 24
          },
          {
            name: 'fullScreenButton',
            align: 'tr',
            x: 10,
            y: 25
          },
          {
            name: 'streamButton',
            align: 'tr',
            x: 10,
            y: 23
          },
          {
            name: 'volume',
            align: 'tr',
            x: 10,
            y: 25
          }
        ]
      },
      {
        name: 'fullControlBar',
        align: 'tlabs',
        x: 0,
        y: 0,
        children: [
          {
            name: 'fullTitle',
            align: 'tl',
            x: 25,
            y: 6
          },
          {
            name: 'fullNormalScreenButton',
            align: 'tr',
            x: 24,
            y: 13
          },
          {
            name: 'fullTimeDisplay',
            align: 'tr',
            x: 10,
            y: 12
          },
          {
            name: 'fullZoom',
            align: 'cc'
          }
        ]
      }
    ]
    // skinLayout: [
    //   { name: 'bigPlayButton', align: 'blabs', x: 130, y: 80 },
    //   {
    //     name: 'H5Loading', align: 'cc'
    //   },
    //   {
    //     name: 'controlBar',
    //     align: 'blabs',
    //     x: 0,
    //     y: 0,
    //     children: [
    //       { name: 'progress', align: 'tlabs', x: 0, y: 0 },
    //       { name: 'playButton', align: 'tl', x: 15, y: 26 },
    //       { name: 'timeDisplay', align: 'tl', x: 10, y: 24 },
    //       { name: 'fullScreenButton', align: 'tr', x: 20, y: 25 },
    //       { name: 'volume', align: 'tr', x: 20, y: 25 }
    //     ]
    //   }
    // ]
  },
  data () {
    return {
      playerId: 'aliplayer_' + Math.floor(Math.random() * 100000000000000000),
      scriptTagStatus: 0,
      instance: null,
      curTime: 0
    }
  },
  mounted () {
    if (window.Aliplayer !== undefined) {
      // 如果全局对象存在，说明编辑器代码已经初始化完成，直接加载编辑器
      this.scriptTagStatus = 2
      this.initAliplayer()
    } else {
      // 如果全局对象不存在，说明编辑器代码还没有加载完成，需要加载编辑器代码
      this.insertScriptTag()
    }
  },
  created () {
    if (window.Aliplayer !== undefined) {
      // 如果全局对象存在，说明编辑器代码已经初始化完成，直接加载编辑器
      this.scriptTagStatus = 2
      window.onload = function () {
        this.initAliplayer()
      }
    } else {
      // 如果全局对象不存在，说明编辑器代码还没有加载完成，需要加载编辑器代码
      this.insertScriptTag()
    }
  },
  methods: {
    insertScriptTag () {
      const _this = this
      let playerScriptTag = document.getElementById('playerScriptTag')
      // 如果这个tag不存在，则生成相关代码tag以加载代码
      if (playerScriptTag === null) {
        playerScriptTag = document.createElement('script')
        playerScriptTag.type = 'text/javascript'
        playerScriptTag.src = this.aliplayerSdkPath
        playerScriptTag.id = 'playerScriptTag'
        let s = document.getElementsByTagName('head')[0]
        s.appendChild(playerScriptTag)
      }
      if (playerScriptTag.loaded) {
        _this.scriptTagStatus++
      } else {
        playerScriptTag.addEventListener('load', () => {
          _this.scriptTagStatus++
          playerScriptTag.loaded = true
          _this.initAliplayer()
        })
      }
      _this.initAliplayer()
    },
    initAliplayer () {
      const _this = this
      // scriptTagStatus 为 2 的时候，说明两个必需引入的 js 文件都已经被引入，且加载完成
      if (_this.scriptTagStatus === 2 && (_this.instance === null || _this.reloadPlayer)) {
        _this.instance && _this.instance.dispose()
        _this.$nextTick(() => {
          _this.instance = window.Aliplayer({
            id: _this.playerId,
            autoplay: _this.autoplay,
            disableSeek: _this.disableSeek,
            isLive: _this.isLive,
            playsinline: _this.playsinline,
            format: _this.format,
            width: _this.width,
            height: _this.height,
            controlBarVisibility: _this.controlBarVisibility,
            useH5Prism: _this.useH5Prism,
            useFlashPrism: _this.useFlashPrism,
            vid: _this.vid,
            playauth: _this.playauth,
            cover: _this.cover,
            x5_video_position: _this.x5_video_position,
            x5_type: _this.x5_type,
            x5_fullscreen: _this.x5_fullscreen,
            x5_orientation: _this.x5_orientation,
            autoPlayDelay: _this.autoPlayDelay
            // skinLayout: _this.skinLayout
          })
          // 绑定事件，当 AliPlayer 初始化完成后，将编辑器实例通过自定义的 ready 事件交出去
          _this.instance.on('ready', () => {
            this.$emit('ready', _this.instance)
          })
          _this.instance.on('play', () => {
            this.$emit('play', _this.instance)
          })
          _this.instance.on('pause', () => {
            this.$emit('pause', _this.instance)
          })
          _this.instance.on('ended', () => {
            this.$emit('ended', _this.instance)
          })
          _this.instance.on('liveStreamStop', () => {
            this.$emit('liveStreamStop', _this.instance)
          })
          _this.instance.on('m3u8Retry', () => {
            this.$emit('m3u8Retry', _this.instance)
          })
          _this.instance.on('hideBar', () => {
            this.$emit('hideBar', _this.instance)
          })
          _this.instance.on('waiting', () => {
            this.$emit('waiting', _this.instance)
          })
          _this.instance.on('snapshoted', () => {
            this.$emit('snapshoted', _this.instance)
          })
          _this.instance.on('dispose', () => {
            this.$emit('dispose', _this.instance)
          })
          _this.instance.on('startSeek', () => {
            this.$emit('startSeek', _this.instance)
          })
          _this.instance.on('completeSeek', () => {
            this.$emit('completeSeek', _this.instance)
          })
        })
      }
    },
    videoCLick: function () {

    },
    startSeek: function () {
      this.curTime = this.getCurrentTime()
      this.instance.pause()
    },
    completeSeek: function () {
      this.instance.seek(this.curTime)
      this.instance.play()
    },
    ended: function () {
      var _this = this
      this.instance.replayByVidAndPlayAuth(_this.vid, _this.playauth)
    },
    /**
       * 销毁
       */
    dispose: function () {
      this.instance.dispose()
    },
    /**
       * 播放视频
       */
    play: function () {
      this.instance.play()
      // var _video = document.querySelector('video');
      // _video.removeEventListener('click', this.play);
      // _video.addEventListener('click', this.pause);
    },
    /**
       * 暂停视频
       */
    pause: function () {
      this.instance.pause()
      // var _video = document.querySelector('video');
      // _video.removeEventListener('click', this.pause);
      // _video.addEventListener('click', this.play);
    },
    /**
       * 重播视频
       */
    replay: function () {
      this.instance.replay()
    },
    /**
       * 跳转到某个时刻进行播放
       * @argument time 的单位为秒
       */
    seek: function (time) {
      this.instance.seek(time)
    },
    /**
       * 获取当前时间 单位秒
       */
    getCurrentTime: function () {
      return this.instance.getCurrentTime()
    },
    /**
     * 获取视频状态
     */
    getStatus: function () {
      return this.instance.getStatus()
    },
    /**
       *获取视频总时长，返回的单位为秒
       * @returns 返回的单位为秒
       */
    getDuration: function () {
      return this.instance.getDuration()
    },
    /**
       获取当前的音量，返回值为0-1的实数ios和部分android会失效
       */
    getVolume: function () {
      return this.instance.getVolume()
    },
    /**
       设置音量，vol为0-1的实数，ios和部分android会失效
       */
    setVolume: function (vol) {
      this.instance.setVolume(vol)
    },
    /**
       *直接播放视频url，time为可选值（单位秒）目前只支持同种格式（mp4/flv/m3u8）之间切换暂不支持直播rtmp流切换
       *@argument url 视频地址
       *@argument time 跳转到多少秒
       */
    loadByUrl: function (url, time) {
      this.instance.loadByUrl(url, time)
    },
    /**
       * 设置播放速度
       *@argument speed 速度
       */
    setSpeed: function (speed) {
      this.instance.setSpeed(speed)
    },
    /**
       * 设置播放器大小w,h可分别为400px像素或60%百分比chrome浏览器下flash播放器分别不能小于397x297
       *@argument w 播放器宽度
       *@argument h 播放器高度
       */
    setPlayerSize: function (w, h) {
      this.instance.setPlayerSize(w, h)
    },
    /**
       * 目前只支持HTML5界面上的重载功能,暂不支持直播rtmp流切换m3u8）之间切换,暂不支持直播rtmp流切换
       *@argument vid 视频id
       *@argument playauth 播放凭证
       */
    reloaduserPlayInfoAndVidRequestMts: function (vid, playauth) {
      this.instance.reloaduserPlayInfoAndVidRequestMts(vid, playauth)
    },
    /* 点击播放屏幕 */
    playSwitch () {
      // this.playStatus = !this.playStatus
      // if (this.playStatus) {
      //   this.pause()
      // } else {
      //   this.play()
      // }
    },
    signVisible (val) {
      if (!val) {
        this.$emit('update:visible', false)
        this.$emit('update:canSign', false)
      }
    },
    // 签到
    signSub () {
      this.$emit('signSub', false)
    }
  }
}
</script>

<style>
  @import url('https://g.alicdn.com/de/prismplayer/2.8.2/skins/default/aliplayer-min.css');
  .prism-player .prism-progress .prism-progress-played{
    background: #F99111!important;
  }
  .prism-player .prism-progress:hover{
    height: 10px!important;
  }
  .prism-progress-cursor{
    background: none!important;
    display: none!important;
  }
  .prism-progress-cursor img, .cursor-hover img{
    display: none!important;
  }
  .prism-player .prism-progress{
    background: #000000!important;
  }
  .prism-player .prism-progress .prism-progress-loaded{
    background: #4A4A4A!important;
  }
  .prism-player .prism-play-btn.playing:hover {
    background: url('../../assets/images/video/smallpausehover.png') no-repeat;
    background-size: contain;
  }
  /* .prism-player .prism-play-btn,.prism-player .prism-play-btn:hover{
    background: url('../../assets/images/video/play-btn-hover-icon.png') no-repeat;
    background-size: contain;
  } */
  .prism-player .prism-big-play-btn{
    top: 50%!important;
    left: 50%!important;
    margin-top: -32px!important;
    margin-left: -32px!important;
  }
  .prism-player .prism-play-btn.playing{
    background: url('../../assets/images/video/play-stop-m.png') no-repeat;
    background-size: contain;
  }
  .prism-player .prism-setting-btn{
    background: url('../../assets/images/video/play-set-m.png') no-repeat;
    background-size: contain;
  }
  .prism-player .prism-volume .volume-icon .long-horizontal,.prism-player .prism-volume .volume-icon .short-horizontal{
    box-shadow: 0 0 1px #000;
  }
  .prism-player .prism-fullscreen-btn{
    background: url('../../assets/images/video/play-screen-m.png') no-repeat;
    background-size: contain;
  }
  .prism-player .prism-big-play-btn .outter{
    /* border: 0;
    background: none; */
  }
  .prism-player .prism-volume .volume-icon{
    background: url('../../assets/images/video/play-voice-m.png') no-repeat;
    background-size: contain;
  }
  .prism-player .prism-volume-control{
    background: none;
  }
  .prism-player .prism-volume-control .volume-value{
    background: #F99111;
  }
  .prism-player .prism-volume-control .volume-cursor{
    background: #999999;
  }
  .prism-player .prism-volume-control .volume-cursor:hover{
    background: #F99111;
  }
  /* .prism-player .prism-volume .volume-icon:hover{
    background: url('../../assets/images/video/volumehover.png') no-repeat;
    background-size: contain;
  } */
  .prism-player .prism-volume .volume-icon.mute{
    background: url('../../assets/images/video/volumemutehover.png') no-repeat;
    background-size: contain;
  }
  .prism-player .prism-volume .volume-icon.mute:hover{
    background: url('../../assets/images/video/volumemutehover.png') no-repeat;
    background-size: contain;
  }
  .prism-volume{
    margin-right: 15px!important;
  }
  .prism-cc-btn{
    display: none;
  }
  .prism-player .prism-setting-list .prism-setting-cc, .prism-player .prism-setting-list .prism-setting-audio{
    display: none;
  }
  .prism-player .prism-time-display .current-time, .prism-player .prism-time-display{
    color: #cccccc;
    text-shadow:#000 1px 0 0,#000 0 1px 0,#000 -1px 0 0,#000 0 -1px 0;
    -webkit-text-shadow:#000 1px 0 0,#000 0 1px 0,#000 -1px 0 0,#000 0 -1px 0;
    -moz-text-shadow:#000 1px 0 0,#000 0 1px 0,#000 -1px 0 0,#000 0 -1px 0;
  }
  .prism-player .prism-time-display .current-time{
    color: #ffffff;
  }
  /* 水印 */
  .shuiyin-wrap .shuiyin{
    position: absolute;
    left: 10%;
    top: 25%;
    transform: rotate(-35deg);
    color: rgba(200, 200, 200, 0.5);
    font-weight: bold;
  }
  .shuiyin-wrap .shuiyin:nth-child(2){
    left: 10%;
    top: 82%;
  }
  .shuiyin-wrap .shuiyin:nth-child(3){
    left: 80%;
    top: 25%;
  }
  .shuiyin-wrap .shuiyin:nth-child(4){
    left: 82%;
    top: 82%;
  }
  /* 签到 */
  .sign-box .opa{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.6);
  }
  .sign-cont{
    position: fixed;
    width: 240px;
    left: 50%;
    top: 50%;
    border-radius: 4px;
    transform: translate(-50%, -50%);
    background: #ffffff;
    text-align: center;
    padding: 20px;
  }
  .sign-cont p{
    font-size: 16px;
  }
  .sign-cont button{
    width: 65px;
    height: 26px;
    background: #1874FD;
    color: #ffffff;
    margin-top: 20px;
  }
  .sign-cont span{
    display: block;
    margin-top: 5px;
    color: #999999;
  }
  /* 进度条遮挡 */
  .progress-bar{
    position: absolute;
    left: 0;
    bottom: 39px;
    width: 100%;
    height: 12px;
    z-index: 11;
  }
</style>
