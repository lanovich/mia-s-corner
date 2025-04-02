import { LINKS } from "@/constants";
import Link from "next/link";

export const ContactDetails = () => (
  <div className="space-y-8 text-center">
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Контакты</h2>
      <p className="text-gray-700">
        Email:{" "}
        <a
          target="_blank"
          href={`mailto:${LINKS.GMAIL}`}
          className="text-black hover:underline"
        >
          {LINKS.GMAIL}
        </a>
      </p>
      <p className="text-gray-700">
        Telegram:{" "}
        <a
          target="_blank"
          href={`${LINKS.TELEGRAM_SUPPORT}`}
          className="text-black hover:underline"
        >
          {"@mias_corner_support"}
        </a>
      </p>
    </div>

    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Мы в соцсетях</h2>
      <div className="flex justify-center space-x-6">
        <Link
          href={LINKS.VK}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-700 hover:text-black transition-colors"
        >
          VK
        </Link>
        <Link
          href={LINKS.TELEGRAM}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-700 hover:text-black transition-colors"
        >
          Telegram
        </Link>
        <Link
          href={LINKS.PINTEREST}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-700 hover:text-black transition-colors"
        >
          Pinterest
        </Link>
      </div>
    </div>
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Реквизиты</h2>
      <ul className="flex flex-col  justify-between space-y-2 text-gray-700">
        <li className="flex justify-between">
          <span className="font-medium">ИП:</span>
          <span>Добромыслова Мария Алексеевна</span>
        </li>
        <li className="flex justify-between">
          <span className="font-medium">ИНН: </span>
          <span>352841176253</span>
        </li>
        <li className="flex justify-between">
          <span className="font-medium">ОГРНИП: </span>
          <span>324350000060030</span>
        </li>
      </ul>
    </div>
  </div>
);
