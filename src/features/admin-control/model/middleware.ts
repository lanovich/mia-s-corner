import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const authHeader = request.headers.get("authorization");

  if (url.pathname.startsWith("/admin")) {
    if (!authHeader) {
      return new NextResponse("Auth required", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Admin Panel"',
        },
      });
    }

    const authValue = authHeader.split(" ")[1] || "";
    const [username, password] = Buffer.from(authValue, "base64")
      .toString()
      .split(":");

    if (
      username !== process.env.ADMIN_USER ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
  }

  return NextResponse.next();
}
