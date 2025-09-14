interface IMap {
  geoObjects: {
    add(obj: any): void;
  };
  destroy(): void;
}

declare const ymaps: {
  templateLayoutFactory: any;
  Clusterer: any;
  ready(callback: () => void): void;
  Map: new (container: HTMLDivElement | null, options: any) => IMap;
  Placemark: new (coords: number[], properties?: any, options?: any) => any;
};
