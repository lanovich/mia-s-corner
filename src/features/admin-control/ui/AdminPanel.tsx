import { ChapterHeading, Container, GoToButton } from "@/shared/ui";
import {
  ProductControlPanel,
  InventorySummary,
  ProductInformationPanel,
  SelectProductField,
} from ".";
import { adminApi } from "../api";

export const AdminPanel = async () => {
  const totals = await adminApi.fetchTotals();
  const options = await adminApi.fetchProductOptions();

  return (
    <div className="bg-gray-400 h-full">
      <Container className="bg-gray-200 pt-5 gap-y-4 mb-5 pb-5 p-8">
        <GoToButton
          href="admin/products/add"
          label="Добавить новый товар"
          className="text-sm h-6 p-4"
        />
        <ChapterHeading className="mb-5">Управление товаром</ChapterHeading>

        <InventorySummary totals={totals ?? null} />

        <div className="flex flex-col gap-5">
          <SelectProductField
            className="border-gray-200 border-2 p-2 rounded-xl bg-white"
            options={options}
          />

          <div className="flex gap-5">
            <ProductControlPanel className="border-gray-200 border-2 p-2 rounded-xl bg-white w-full" />
          </div>
        </div>
      </Container>
    </div>
  );
};
