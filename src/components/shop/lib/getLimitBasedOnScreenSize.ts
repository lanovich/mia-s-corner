export const getLimitBasedOnScreenSize = (width: number): number => {
  if (width >= 1200) {
    return 10;
  } else if (width >= 768) {
    return 7;
  } else {
    return 5;
  }
}