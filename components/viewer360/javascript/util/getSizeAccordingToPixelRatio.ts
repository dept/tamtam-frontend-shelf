export const getSizeAccordingToPixelRatio = (size: number) => {
  const splittedSizes = size.toString().split('x')
  const result =
    splittedSizes?.map(sizing => parseInt(sizing) * Math.round(window.devicePixelRatio || 1)) || []
  return result.join('x')
}
