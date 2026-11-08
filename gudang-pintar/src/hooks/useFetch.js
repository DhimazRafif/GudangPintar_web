import { useState, useEffect, useCallback } from "react";

export default function useFetch(url) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Gagal mengambil data (Status : ${response.status})`);
      }

      const result = await response.json();
      setData(result);
    } catch (error) {
      setError("Terjadi kesalahan saat memuat barang");
      console.error("Fetch Error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}
