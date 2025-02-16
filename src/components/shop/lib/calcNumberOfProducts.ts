export const calcNumberOfProducts = (width: number): number => {
  const sizes = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  }

  if (width > sizes.xl) return 10
  if (width < sizes.xl && width > sizes.lg) return 8
  if (width < sizes.lg && width > sizes.md) return 9
  if (width < sizes.md) return 6
  return 6
}