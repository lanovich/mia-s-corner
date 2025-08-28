export interface YandexDeliveryBodyType {
  route_points: RoutePoint[]
  items: YandexItem[]
}

export type RoutePoint = {
  fullname: string
  country: string
  city: string
  street: string
  building: string
  porch: string
  sflat: string
  sfloor: string
}

export type YandexItem = {
  quantity: number
  size: Size
  weight: number
}

export type YandexSize = {
  height: number
  length: number
  width: number
}
