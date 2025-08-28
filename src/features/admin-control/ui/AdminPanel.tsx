import { ChapterHeading, Container, GoToButton } from "@/shared/ui";
import {
  ProductControlPanel,
  InventorySummary,
  ProductInformationPanel,
  SelectProductField,
} from ".";
import { getTotalProductQuantity } from "@/shared/api/supabase/queries";
import { getProductsGroupedByCategory } from "@/entities/product/api";

export const AdminPanel = async () => {
  const totals = await getTotalProductQuantity();
  const categorizedProducts = await getProductsGroupedByCategory();

  return (
    <div className="bg-gray-400 h-full">
      <Container className="bg-gray-200 pt-5 gap-y-4 mb-5 pb-5 p-8">
        <GoToButton
          href={"admin/products/add"}
          label={"Добавить новый товар"}
          className="text-sm h-6 p-4"
        />
        <ChapterHeading className="mb-5">Управление товаром</ChapterHeading>
        <InventorySummary totals={totals} />
        <div className="flex flex-col gap-5">
          <SelectProductField
            className="border-gray-200 border-2 p-2 rounded-xl bg-white"
            options={totals.products}
          />
          <div className="flex gap-5">
            <ProductControlPanel
              className="border-gray-200 border-2 p-2 rounded-xl bg-white w-2/3"
              categorizedProducts={categorizedProducts}
            />
            <ProductInformationPanel className="border-gray-200 border-2 p-2 rounded-xl bg-white w-1/3" />
          </div>
        </div>
      </Container>
    </div>
  );
};
