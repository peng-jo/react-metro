import { useEffect, useState } from "react";

export const useFetch = (query: string | null) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  function fetchData(query: string | null) {
    if (!query) {
      return;
    }

    setLoading(true);

    const url = `${import.meta.env.VITE_API_BASE_URL}${query}`;
    fetch(url)
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchData(query);
  }, [query]);

  return { data, loading, error, reFetchData: fetchData };
};
