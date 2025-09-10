import { useEffect, useState } from "react";
import { productsApi } from "@/entities/product/api";
import { Product } from "@/entities/product/model";

export const useProductSearch = (
  query: string,
  categorySlug?: string,
  delay = 400
) => {
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [products, setProducts] = useState<Product[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);
    return () => clearTimeout(handler);
  }, [query, delay]);

  useEffect(() => {
    let ignore = false;

    const fetchProducts = async () => {
      if (!debouncedQuery.trim() && !categorySlug) {
        setProducts([]);
        return;
      }

      try {
        setIsFetching(true);
        setError(null);

        const data = await productsApi.searchProduct(
          debouncedQuery,
          categorySlug
        );

        if (!ignore) setProducts(data || []);
      } catch (e) {
        if (!ignore) {
          setError("Ошибка при загрузке");
          setProducts([]);
        }
      } finally {
        if (!ignore) setIsFetching(false);
      }
    };

    fetchProducts();

    return () => {
      ignore = true;
    };
  }, [debouncedQuery, categorySlug]);

  return { products, isFetching, error };
};
