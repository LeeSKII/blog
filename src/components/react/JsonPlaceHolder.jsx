import { useState, useEffect, useMemo } from "react";
import PicoSkeleton from "../pico/PicoSkeleton";
import axios from "axios";

export default function JsonPlaceHolder({ count, event }) {
  console.log("renderJsonPlaceHolder");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const a = useMemo(() => {
    console.log("memo run");
    return Math.pow(10, 2);
  }, [1]); //simulate long running process
  console.log("a", a);
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          "https://jsonplaceholder.typicode.com/posts/1/comments"
        );
        const comments = response.data;
        setData(comments);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);
  return (
    <>
      {count}
      {loading && <PicoSkeleton />}
      {error && <p>Error: {error}</p>}
      {data && (
        <ol>
          {data.map((comment) => {
            return <li key={comment.id}>{comment.name}</li>;
          })}
        </ol>
      )}
    </>
  );
}
