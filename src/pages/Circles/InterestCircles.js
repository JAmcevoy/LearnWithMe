import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

const InterestCircles = () => {
  const history = useHistory();
  const [circles, setCircles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCircles = async () => {
      try {
        const response = await axios.get("/interestcircles/"); 
        setCircles(response.data);
      } catch (err) {
        setError("Error fetching interest circles");
        console.error("Error fetching interest circles:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCircles();
  }, []);

  const handleCircleClick = (id) => {
    history.push(`/chats/${id}`);
  };

  if (loading) {
    return <p className="text-center mt-8">Loading interest circles...</p>;
  }

  if (error) {
    return <p className="text-center mt-8 text-red-500">{error}</p>;
  }

  return (
    <div className="p-6 lg:pr-20">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-700 leading-relaxed">
        Interest Circles
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {circles.length > 0 ? (
          circles.map((circle) => (
            <div
              key={circle.id}
              className="flex items-center justify-center cursor-pointer"
              onClick={() => handleCircleClick(circle.id)}
            >
              <div className="relative bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full flex flex-col items-center justify-center w-44 h-44 text-center text-lg font-semibold text-white shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl">
                <div className="absolute inset-0 bg-black opacity-10 rounded-full"></div>
                <h2 className="relative z-10 text-xl font-bold">{circle.name}</h2>
                <p className="relative z-10 text-sm">{circle.owner}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center mt-8">No interest circles available</p>
        )}
      </div>
    </div>
  );
};

export default InterestCircles;
