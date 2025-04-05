import { ChapterHeading, СhapterContainer } from "@/components/shared";

export default function PrivacyPage() {
  return (
    <СhapterContainer className="max-w-3xl mx-auto py-8 px-4">
      <ChapterHeading>Политика конфиденциальности</ChapterHeading>

      <div className="prose prose-sm sm:prose-base text-gray-700">
        <p className="text-sm text-gray-500 mb-6">
          Последнее обновление: {new Date().toLocaleDateString("ru-RU")}
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">
          1. Какие данные мы собираем
        </h2>
        <p>
          При оформлении заказа мы запрашиваем и сохраняем следующую информацию:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Имя</li>
          <li>Контактный телефон</li>
          <li>Email-адрес</li>
          <li>Адрес доставки</li>
          <li>Состав вашего заказа</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-3">
          2. Как мы используем ваши данные
        </h2>
        <p>Ваши персональные данные используются исключительно для:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Обработки и выполнения вашего заказа</li>
          <li>Связи с вами по вопросам заказа</li>
          <li>Организации доставки</li>
          <li>Улучшения качества нашего сервиса</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-3">3. Защита данных</h2>
        <p>Мы принимаем все необходимые меры для защиты ваших данных:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Данные хранятся в защищенной базе данных</li>
          <li>Доступ ограничен только уполномоченным сотрудникам</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-3">
          4. Cookies и технологии отслеживания
        </h2>
        <p>Наш сайт использует только необходимые технические cookies для:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Работы корзины товаров</li>
          <li>Сохранения ваших предпочтений</li>
        </ul>
        <p>
          Эти файлы cookie необходимы для функционирования сайта и не требуют
          вашего согласия.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">5. Ваши права</h2>
        <p>Вы имеете право:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Запросить доступ к вашим персональным данным</li>
          <li>Потребовать исправления неточных данных</li>
          <li>
            Запросить удаление ваших данных (за исключением случаев, когда мы
            обязаны хранить их по закону)
          </li>
          <li>Отозвать согласие на обработку данных</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-3">6. Контакты</h2>
        <p>
          По всем вопросам, связанным с обработкой ваших персональных данных, вы
          можете обратиться:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            Email:{" "}
            <a
              href="mailto:miascorner.business@gmail.com"
              className="text-blue-600 hover:underline"
            >
              miascorner.business@gmail.com
            </a>
          </li>
          <li>
            Telegram:{" "}
            <a
              href="https://t.me/mias_corner_support"
              className="text-blue-600 hover:underline"
            >
              @mias_corner_support
            </a>
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-3">
          7. Изменения в политике
        </h2>
        <p>
          Мы оставляем за собой право вносить изменения в эту политику. Все
          изменения будут опубликованы на этой странице.
        </p>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="font-medium">Важно:</p>
          <p className="text-sm mt-1">
            Оформляя заказ на нашем сайте, вы даете согласие на обработку ваших
            персональных данных в соответствии с настоящей Политикой
            конфиденциальности.
          </p>
        </div>
      </div>
    </СhapterContainer>
  );
}
