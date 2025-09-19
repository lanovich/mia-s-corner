import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body: { name: string } = await req.json();

    if (!body.name) {
      return NextResponse.json({ error: "Missing city name" }, { status: 400 });
    }

    const response = await fetch(
      "https://b2b-authproxy.taxi.yandex.net/api/b2b/platform/location/detect",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.YANDEX_DELIVERY_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ location: body.name }),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error("Yandex Geography API error:", text);
      return NextResponse.json(
        { error: "Yandex API error", text },
        { status: 500 }
      );
    }

    const data = await response.json();

    if (!data.variants || data.variants.length === 0) {
      return NextResponse.json({ points: [] });
    }

    const geoPoints = data.variants.map((variant: any) => ({
      geo_id: variant.geo_id,
      address: variant.address,
    }));

    return NextResponse.json({ points: geoPoints });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
