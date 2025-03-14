import { Dispatch, SetStateAction } from "react";

interface Props {
  paymentMethod: "transfer" | "cash";
  setPaymentMethod: Dispatch<SetStateAction<"transfer" | "cash">>;
}

export const PaymentMethods: React.FC<Props> = ({
  paymentMethod,
  setPaymentMethod,
}) => (
  <div>
    <h2 className="text-lg font-medium mb-3">Способ оплаты</h2>
    <div className="space-y-2">
      <label className="flex items-center space-x-2">
        <input
          type="radio"
          value="transfer"
          checked={paymentMethod === "transfer"}
          onChange={() => setPaymentMethod("transfer")}
        />
        <span>Перевод на карту</span>
      </label>
      <label className="flex items-center space-x-2">
        {/* <input
          type="radio"
          value="cash"
          checked={paymentMethod === "cash"}
          onChange={() => setPaymentMethod("cash")}
        />
        <span>Оплата при получении</span> */}
      </label>
    </div>
  </div>
);
