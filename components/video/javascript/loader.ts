import { VideoPlatformOption } from './platforms'
import { VideoModulesByPlatform } from './video'

const getImport = async (platform: VideoPlatformOption) => {
  switch (platform) {
    case 'youtube':
      return (await import('./platforms/youtube')).default
    case 'vimeo':
      return (await import('./platforms/vimeo')).default
    default:
      return (await import('./platforms/native')).default
  }
}

const videoLoader = async (platforms: VideoPlatformOption[]) => {
  const modules = await Promise.all(platforms.map(async platform => await getImport(platform)))

  const modulesByPlatform = modules.reduce((acc, moduleImport, index) => {
    acc[platforms[index]] = moduleImport
    return acc
  }, {} as VideoModulesByPlatform)

  return Promise.all([modulesByPlatform, (await import('@/components/video')).Video])
}

export default videoLoader
