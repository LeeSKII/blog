import { useState, useEffect } from "preact/hooks";
import PicoSkeleton from "../pico/PicoSkeleton";
import axios from "axios";

export default function JsonPlaceHolder() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
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
