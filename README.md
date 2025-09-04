# 🕯️ mias-corner

e-commerce проект на Next.js с Supabase, корзиной, расчётом доставки через API Яндекс.Доставки и email-уведомлениями с помощью Resend. Оптимизирован для SEO и мобильных устройств.

---

## 📖 Обзор

**mias-corner** — full-stack e-commerce проект на Next.js (App Router) с Supabase, а также React-фронтендом со стейт-менеджментом на основе Zustand. Пользователи могут просматривать каталог товаров по категориям, выбирать размеры, добавлять товары в корзину, рассчитывать доставку через API Яндекс.Доставки и оформлять заказы с email-уведомлениями через Resend API. Администратор может добавлять новые товары, изменять их и отслеживать статистику по товарам.

---

## ✨ Функциональность

- Каталог товаров с категориями и историями
- Карточка товара с галереей, составом и размерами
- Корзина: добавление/удаление, хранение в Supabase и LocalStorage
- Расчёт стоимости доставки через API Яндекс.Доставки
- Оформление заказов с email-уведомлениями через Resend API
- Админ-панель с формой добавления товаров
- Полностью адаптивный интерфейс
- SEO-оптимизация страниц и данных

---

## 🛠 Технологии

- **Фреймворк:** Next.js (App Router)
- **База данных:** Supabase
- **Стилизация:** Tailwind CSS, shadcn/ui
- **Состояние:** Zustand
- **Валидация:** Zod, React Hook Form
- **Email-уведомления:** Resend API
- **Расчёт доставки:** Yandex Delivery B2B API
- **Анимации:** Framer Motion
- **UI-компоненты:** Lucide-React, Embla Carousel

---

## 🏗 Архитектура

```
Browser
   ⬍
Next.js App (SSR/API Routes)
   ⬍
Supabase (DB)
```

---

## 📂 Структура проекта

```
.
├── app/                                # Next.js App Router
│   ├── (checkout)/                     # группа роутов для оформления заказа
│   ├── (root)/                         # группа роутов для главных страниц (главная, каталог и т.д.)
│   ├── actions.ts                      # server actions (например, для cart, auth)
│   ├── api/                            # эндпоинты API (если нужны ручки внутри Next.js)
│   ├── globals.css                     # глобальные стили (reset, шрифты, переменные)
│   └── sitemap.ts                      # генерация sitemap.xml
│
├── entities/                           # бизнес-сущности (cart, product, order)
│   ├── cart/                           # корзина
│   ├── category/                       # категории товаров
│   ├── history/                        # история заказов / просмотров
│   ├── mail/                           # сущности почтовых уведомлений
│   ├── order/                          # заказ
│   ├── product/                        # товар
│   ├── yandexDelivery/                 # интеграция с Яндекс.Доставкой
│   └── yookassa/                       # интеграция с YooKassa (оплаты)
│
├── features/                           # действия пользователя над сущностями
│   ├── admin-control/                  # функционал управления (например, админ-панель)
│   └── modify-cart-quantity/           # изменение количества в корзине (+/- кнопки)
│
├── shared/                             # общие и переиспользуемые модули
│   ├── api/                            # общий api-клиент и helpers (fetch, axios, withQuery)
│   ├── lib/                            # кастомные хуки и утилиты (cn, useSticky, usePendingNavigation)
│   ├── model/                          # глобальные константы и типы (LINKS, ROUTES)
│   ├── shadcn-ui/                      # дизайн-система (кнопки, инпуты, модалки)
│   └── ui/                             # кастомные маленькие ui-компоненты (CustomLink, Container, LoadingIndicator)
│
└── widgets/                            # крупные композиции из entities + features
    ├── about-page/                     # виджет для страницы "О нас"
    ├── catalog/                        # каталог товаров (список, фильтры)
    ├── contact-page/                   # виджет для страницы "Контакты"
    ├── footer/                         # подвал сайта
    ├── header/                         # шапка сайта (логотип, меню, корзина)
    └── main-products/                  # блок с товарами на главной

```

---

## 💾 Модели данных (Supabase)

| Таблица      | Назначение                              |
| ------------ | --------------------------------------- |
| `users`      | Пользователи                            |
| `roles`      | Роли пользователей                      |
| `products`   | Товары (название, описание, фото, цена) |
| `categories` | Категории товаров                       |
| `history`    | Истории изменений по товарам            |
| `cart`       | Корзина пользователя                    |
| `orders`     | Оформленные заказы                      |

---

## 🔧 Переменные окружения

| Переменная                    | Назначение                            |
| ----------------------------- | ------------------------------------- |
| NEXT_PUBLIC_SUPABASE_URL      | URL проекта Supabase                  |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Публичный Supabase ключ               |
| SUPABASE_SERVICE_KEY          | Приватный сервисный ключ Supabase     |
| RESEND_API_KEY                | Ключ API Resend для email-уведомлений |
| YANDEX_DELIVERY_TOKEN         | Ключ API Яндекс.Доставки              |

---

## 🌐 Сторонние API

### 📬 Resend API

Resend используется для отправки email при оформлении заказа.

Пример запроса:

```ts
POST https://api.resend.com/emails
Authorization: Bearer <RESEND_API_KEY>
```

### 🚚 Yandex Delivery API

Yandex Delivery используется для получения стоимости и сроков доставки.

Документация: [https://b2b.taxi.yandex.ru/docs/](https://b2b.taxi.yandex.ru/docs/)

---

## 🔍 SEO-оптимизация

- SSR/SSG-рендеринг большинства страниц
- Динамическая генерация мета-тегов (`<title>`, `<meta>`)
- Поддержка Structured Data (JSON-LD)
- `sitemap.xml` и `robots.txt` (через `next-sitemap`)
- Оптимизация изображений через `next/image`
- Семантически корректная верстка и адаптивность

---

## 📸 Скриншоты

![Главная страница](screenshots/home.png)
![Каталог](screenshots/catalog.png)
![Карточка товара](screenshots/product.png)
![Страница с заказом](screenshots/cart.png)
![Админка](screenshots/histories.png)

---

## 🤝 Как внести вклад

1. Сделайте форк проекта
2. Создайте новую ветку: `git checkout -b feature/название`
3. Внесите изменения и закоммитьте: `git commit -m "описание"`
4. Откройте Pull Request

---

## 📬 Контакты

Автор: [lanovich](https://github.com/lanovich)  
Вопросы и баги — через GitHub Issues.
