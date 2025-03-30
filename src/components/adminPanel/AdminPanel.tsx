import { getTotalProductQuantity } from "@/lib/getTotalProductQuantity";
import { ChapterHeading, Container } from "../shared";
import { InventorySummary } from "./InventorySummary";
import { SelectProductField } from "./SelectProductField";
import { ProductControlPanel } from "./ProductControlPanel";
import { ProductInformationPanel } from "./ProductInformationPanel";

export const AdminPanel = async () => {
  const totals = await getTotalProductQuantity();

  console.log(totals)

  return (
    <Container className="bg-gray-100 pt-5 gap-y-4 mb-5 pb-5 p-8">
      <ChapterHeading className="mb-5">Управление товаром</ChapterHeading>
      <InventorySummary totals={totals} />
      <div className="flex flex-col gap-5">
        <SelectProductField
          className="border-gray-200 border-2 p-2 rounded-xl bg-white"
          options={totals.products}
        />
        <div className="flex gap-5">
          <ProductControlPanel className="border-gray-200 border-2 p-2 rounded-xl bg-white h-[300px] w-2/3" />
          <ProductInformationPanel className="border-gray-200 border-2 p-2 rounded-xl bg-white h-[300px] w-1/3" />
        </div>
      </div>
    </Container>
  );
};

