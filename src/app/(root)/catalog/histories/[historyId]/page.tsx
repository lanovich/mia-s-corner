import { Histories } from "@/components/historiesPage/Histories";
import { Episodes } from "@/components/historiesPage/Episodes";
import { getProductsByHistory, getHistories } from "@/lib/cache";
import { Container } from "@/components/shared";
import { Breadcrumbs } from "@/components/ProductPage";

type Params = Promise<{ historyId: string }>;

export default async function HistoriesPage(props: { params: Params }) {
  const params = await props.params;
  const historyId = Number(params.historyId);

  const histories = await getHistories();
  const products = await getProductsByHistory(Number(historyId));

  return (
    <>
      <Breadcrumbs historyId={historyId} />
      <Histories histories={histories} currentHistoryId={historyId} />
      <Container className="mb-10">
        <Episodes products={products} className="mt-5" />
      </Container>
    </>
  );
}
