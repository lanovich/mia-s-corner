import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const geoId = url.searchParams.get("geo_id");

    if (!geoId) {
      return NextResponse.json(
        { error: "Missing geo_id parameter" },
        { status: 400 }
      );
    }

    const body = {
      geo_id: Number(geoId),
      type: "pickup_point",
    };

    const response = await fetch(
      "https://b2b-authproxy.taxi.yandex.net/api/b2b/platform/pickup-points/list",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.YANDEX_DELIVERY_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json(
        { error: "Yandex API error", text },
        { status: 500 }
      );
    }

    const data = await response.json();

    if (!data.points || data.points.length === 0) {
      return NextResponse.json([]);
    }

    const pickupPoints = data.points.map((station: any) => ({
      ...station,
      id: station.id,
      name: station.name,
      latitude: station.position.latitude,
      longitude: station.position.longitude,
      address: station.address,
    }));

    return NextResponse.json(pickupPoints);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
