import { historiesApi } from "@/entities/history/api";
import { Episodes, Histories } from "@/entities/history/ui";
import { productsApi } from "@/entities/product/api";
import { Breadcrumbs, Container } from "@/shared/ui";
import { Metadata } from "next";

type HistoryParams = Promise<{ historyId: string }>;

export async function generateMetadata(props: {
  params: HistoryParams;
}): Promise<Metadata> {
  const params = await props.params;
  const historyId = params.historyId;
  const histories = (await historiesApi.fetchHistories()) || [];
  const currentHistory = histories.find((h) => h.id === Number(historyId));

  if (!currentHistory) {
    return {
      title: "Ароматическая коллекция | Mia's Corner",
      description:
        "Купить свечи в СПб с историями, наша ароматическая продукция разделена на истории со своими эпизодами. Найдите свою уникальную историю",
    };
  }

  return {
    title: `${currentHistory.title} | Mia's Corner | История ароматов`,
    description: `Купить свечи в СПб с историями, наша ароматическая продукция разделена на истории со своими эпизодами. Найдите свою уникальную историю.`,
    keywords: [
      `${currentHistory.title.toLowerCase()} купить`,
      `ароматическая история ${currentHistory.order}`,
      `коллекция ${currentHistory.title.toLowerCase()}`,
    ],
  };
}

export default async function HistoriesPage(props: { params: HistoryParams }) {
  const params = await props.params;
  const historyId = params.historyId;
  const histories = (await historiesApi.fetchHistories()) || [];
  const products = (await productsApi.fetchProductsByHistory(historyId)) || [];
  const currentHistory = histories.find(
    (history) => history.id === Number(historyId)
  );

  return (
    <>
      <Breadcrumbs
        historyInfo={{
          name: currentHistory?.title || historyId,
          id: historyId,
        }}
      />
      <Histories
        histories={histories}
        currentHistoryId={currentHistory?.id || 1}
      />
      <Container className="mb-10">
        <Episodes products={products} className="mt-5" />
      </Container>
    </>
  );
}
