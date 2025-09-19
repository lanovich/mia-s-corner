import { centerMap, createClusterer, createMap, createPlacemark } from ".";
import { PickupPoint } from "../model";

export function initYMap(
  container: HTMLDivElement,
  pickupPoints: PickupPoint[],
  onSelect?: (point: PickupPoint) => void,
  mapInstanceRef?: { current: any },
  selectedId?: string,
) {
  if (!container || pickupPoints.length === 0) return;

  const map = createMap(container, mapInstanceRef,);
  map.geoObjects.removeAll();

  const clusterer = createClusterer();

  const placemarks = pickupPoints.map((point) => {
    const isSelected = point.id === selectedId;
    return createPlacemark(point, onSelect, isSelected );
  });

  clusterer.add(placemarks);
  map.geoObjects.add(clusterer);

  if (selectedId) {
    const selectedPoint = pickupPoints.find((p) => p.id === selectedId);
    if (selectedPoint) {
      map.setCenter([selectedPoint.latitude, selectedPoint.longitude], 14);
    }
  } else {
    centerMap(map, pickupPoints);
  }
}
