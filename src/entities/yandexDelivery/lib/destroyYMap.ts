export function destroyYMap() {
  if ((window as any).mapInstance) {
    (window as any).mapInstance.destroy();
    (window as any).mapInstance = null;
    (window as any).ymapsInitialized = false;
  }
}
