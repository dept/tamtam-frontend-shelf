function VideoLoader() { 
  return Promise.all([
    import(/* webpackChunkName: "Video-Platforms" */ '@components/video/platforms'),
    import(/* webpackChunkName: "Video" */ '@components/video'),
  ])
}

export default VideoLoader
