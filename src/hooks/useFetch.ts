import { useEffect, useState } from "react";
import { BASE_API_URL } from "../api/config";

export function useFetch<T>(
  endpoint: string,
  errorMessage = "Something went wrong"
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError("");
        const res = await fetch(`${BASE_API_URL}/${endpoint}`, {
          signal: controller.signal,
        });

        if (!res.ok) throw new Error(errorMessage);

        const data = (await res.json()) as T;

        setData(data);
      } catch (err: any) {
        console.log(err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return function cleanup() {
      controller.abort();
    };
  }, [endpoint, errorMessage]);

  return { data, isLoading, error };
}
