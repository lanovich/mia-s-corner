import { Histories } from "@/components/historiesPage/Histories";
import { Episodes } from "@/components/historiesPage/Episodes";
import { getProductsByHistory, getHistories } from "@/lib/cache";
import { Container } from "@/components/shared";
import { Breadcrumbs } from "@/components/ProductPage";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { historyId: string };
}): Promise<Metadata> {
  const historyId = Number(params.historyId);
  const histories = await getHistories();
  const currentHistory = histories.find((h) => h.id === historyId);
  const products = await getProductsByHistory(historyId);

  if (!currentHistory) {
    return {
      title: "Ароматическая коллекция | Mia's Corner",
      description: "Купить свечи в СПб с историями, наша ароматическая продукция разделена на истории со своими эпизодами. Найдите свою уникальную историю",
    };
  }

  return {
    title: `${currentHistory.title} | Mia's Corner | История ароматов`,
    description: `Купить свечи в СПб с историями, наша ароматическая продукция разделена на истории со своими эпизодами. Найдите свою уникальную историю. ${currentHistory.description.slice(
      0,
      160
    )}... в этой истории сейчас ${products.length} продуктов.`,
    keywords: [
      `${currentHistory.title.toLowerCase()} купить`,
      `ароматическая история ${currentHistory.order}`,
      `коллекция ${currentHistory.title.toLowerCase()}`,
    ],
  };
}

export default async function HistoriesPage({
  params,
}: {
  params: { historyId: string };
}) {
  const historyId = Number(params.historyId);
  const histories = await getHistories();
  const products = await getProductsByHistory(historyId);

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
