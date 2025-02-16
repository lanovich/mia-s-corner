import { getCategoriesWithProducts } from "./getCategoriesWithProducts";

export async function getServerSideProps() {
  const categories = await getCategoriesWithProducts();

  return {
    props: {
      categories,
    },
  };
}
