import { PickupPoint } from "../model";

export function createMap(
  container: HTMLDivElement,
  mapInstanceRef?: { current: any }
) {
  if (!mapInstanceRef!.current) {
    mapInstanceRef!.current = new ymaps.Map(container, {
      center: [0, 0],
      zoom: 11,
      controls: [],
    });
  }
  return mapInstanceRef!.current;
}

export function createClusterer() {
  return new ymaps.Clusterer({
    clusterIcons: [
      {
        href: "/cluster-icon.svg",
        size: [32, 32],
        offset: [-20, -20],
      },
    ],
    clusterIconContentLayout: ymaps.templateLayoutFactory.createClass(
      '<div style="color: white; margin-top: -2px; font-weight: semibold; font-size: 12px;">$[properties.geoObjects.length]</div>'
    ),
  });
}

export function createPlacemark(
  point: PickupPoint,
  onSelect?: (point: PickupPoint) => void,
  isSelected = false,
) {
  const size = isSelected ? [48, 48] : [32, 32];
  const offset = isSelected ? [-24, -48] : [-16, -32];

  const btnText = isSelected ? "Выбрано" : "Выбрать";
  const isBtnDisabled = isSelected;
  const btnStyles = `
    padding: 6px 12px;
    background: ${isBtnDisabled ? "#d5d5d5" : "#000"};
    color: ${isBtnDisabled ? "#888" : "#fff"};
    border: none;
    border-radius: 4px;
    cursor: ${isBtnDisabled ? "not-allowed" : "pointer"};
    pointer-events: ${isBtnDisabled ? "none" : "auto"};
  `;

  const placemark = new ymaps.Placemark(
    [point.latitude, point.longitude],
    {
      balloonContentHeader:
        `${point.address?.locality}, ${point.address?.street} ${point.address?.house}` ||
        point.name,
      balloonContentBody: `<button id="select-${point.id}" style="${btnStyles}">${btnText}</button>`,
    },
    {
      iconLayout: "default#image",
      iconImageHref: isSelected ? "/map-icon-selected.svg" : "/map-icon.svg",
      iconImageSize: size,
      iconImageOffset: offset,
    }
  );

  placemark.events.add("balloonopen", () => {
    const btn = document.getElementById(`select-${point.id}`);
    if (btn && !isBtnDisabled) {
      btn.onclick = () => {
        if (onSelect) onSelect(point);
        placemark.balloon.close();
      };
    }
  });

  return placemark;
}

export function centerMap(map: any, points: PickupPoint[]) {
  const center = points
    .reduce((acc, p) => [acc[0] + p.latitude, acc[1] + p.longitude], [0, 0])
    .map((v) => v / points.length) as [number, number];
  map.setCenter(center, 12);
}
