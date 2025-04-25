import { useState, useEffect } from "react";

const useFetch = (
  url = "https://official-joke-api.appspot.com/random_joke",
  options = {}
) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!url) return;
    setLoading(true);
    const fetchData = async () => {
      try {
        const data = await fetch(url);
        const res = await data.json();
        setData(res);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, error, loading };
};

export default useFetch;
