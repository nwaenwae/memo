import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { client } from "../client";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";
import { feedQuery, searchQuery } from "../utils/data";

const Feed = () => {
  const [loading, setLoading] = useState(false);
  const [pins, setPins] = useState(null);
  const { categoryId } = useParams();

  useEffect(
    () => {
      setLoading(true);
      if (categoryId) {
        const query = searchQuery(categoryId);
        client.fetch(query).then((data) => {
          setPins(data);
          setLoading(false);
        });
      } else {
        client.fetch(feedQuery).then((data) => {
          setPins(data);
          setLoading(false);
        });
      }
    },
    [categoryId],
    setPins
  );
  if (loading) return <Spinner message="Please wait a moment..." />;

  if (!pins?.length)
    return (
      <h2 className="text-center">No pin available yet, let's create one!</h2>
    );
  return <div>{pins && <MasonryLayout pins={pins} />}</div>;
};

export default Feed;
