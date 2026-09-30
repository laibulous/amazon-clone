import { useState, useEffect, useCallback } from 'react';
import { productsApi, type PaginatedResponse } from '../api/productsApi';
import type { Product, ProductFilterParams } from '../types/product';

export function useProducts(initialParams: ProductFilterParams = {}, initialPage = 1) {
  const [data, setData] = useState<PaginatedResponse<Product> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [params, setParams] = useState<ProductFilterParams>(initialParams);
  const [page, setPage] = useState<number>(initialPage);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await productsApi.getProducts(params, page);
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch products'));
    } finally {
      setLoading(false);
    }
  }, [params, page]);

  useEffect(() => {
    let ignore = false;
    productsApi
      .getProducts(params, page)
      .then((response) => {
        if (!ignore) {
          setData(response);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err instanceof Error ? err : new Error('Failed to fetch products'));
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [params, page]);

  return {
    products: data?.items ?? [],
    total: data?.total ?? 0,
    totalPages: data?.totalPages ?? 0,
    page,
    setPage,
    params,
    setParams,
    loading,
    error,
    refetch: fetchProducts,
  };
}
