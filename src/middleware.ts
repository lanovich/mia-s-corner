import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Проверяем заголовок Authorization
  const authHeader = request.headers.get("authorization");

  // Логин и пароль из переменных окружения
  const validUser = process.env.ADMIN_USER;
  const validPass = process.env.ADMIN_PASSWORD;

  if (authHeader) {
    // Декодируем логин и пароль из заголовка
    const encodedCredentials = authHeader.split(" ")[1];
    const decodedCredentials = Buffer.from(
      encodedCredentials,
      "base64"
    ).toString("utf-8");
    const [user, pass] = decodedCredentials.split(":");

    // Проверяем логин и пароль
    if (user === validUser && pass === validPass) {
      return NextResponse.next(); // Разрешаем доступ
    }
  }

  // Если авторизация не прошла, возвращаем 401
  return new NextResponse("Unauthorized", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Secure Area"',
    },
  });
}

// Защищаем только маршрут /admin
export const config = {
  matcher: "/admin",
};
