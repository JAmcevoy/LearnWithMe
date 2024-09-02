import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { FaPlusCircle, FaInfoCircle } from "react-icons/fa";

const InterestCircles = () => {
  const history = useHistory();
  const [circles, setCircles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState({
    visible: false,
    description: "",
  });

  useEffect(() => {
    const fetchCircles = async () => {
      try {
        const response = await axios.get("/interest-circles/");
        if (response.data && Array.isArray(response.data.results)) {
          setCircles(response.data.results);
        } else {
          setCircles(response.data);
        }
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
    history.push(`/interest-circles/${id}/chats`);
  };

  const handleCreateCircle = () => {
    history.push('/interest-circles/create');
  };

  const handleInfoClick = (circle) => {
    setModal({
      visible: true,
      description: circle.description || "No description available",
    });
  };

  const handleCloseModal = () => {
    setModal({
      visible: false,
      description: "",
    });
  };

  if (loading) {
    return <p className="text-center mt-8">Loading interest circles...</p>;
  }

  if (error) {
    return <p className="text-center mt-8 text-red-500">{error}</p>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="p-6 lg:pr-20 flex-grow">
        <h1 className="text-4xl font-bold text-center text-gray-700 leading-relaxed mb-8">
          Interest Circles
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {circles.length > 0 ? (
            circles.map((circle) => (
              <div
                key={circle.id}
                className="relative flex items-center justify-center cursor-pointer"
                onClick={() => handleCircleClick(circle.id)}
              >
                <div className="relative bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full flex flex-col items-center justify-center w-44 h-44 text-center text-lg font-semibold text-white shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl">
                  <div className="absolute inset-0 bg-black opacity-10 rounded-full"></div>
                  <h2 className="relative z-10 text-xl font-bold">{circle.name}</h2>
                  <p className="relative z-10 text-sm">{circle.owner}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleInfoClick(circle);
                    }}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-lg hover:bg-gray-100 transition"
                  >
                    <FaInfoCircle className="text-blue-500" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center mt-8">No interest circles available</p>
          )}
        </div>
      </div>
      <button
        onClick={handleCreateCircle}
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-400 to-indigo-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-600 transition flex items-center gap-2"
      >
        <FaPlusCircle className="h-8 w-8" />
        <span className="text-lg font-semibold">Create Circle</span>
      </button>

      {/* Modal */}
      {modal.visible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gradient-to-r from-purple-400 to-indigo-500 p-6 rounded-lg shadow-xl max-w-xs mx-4">
            <h2 className="text-lg font-semibold text-white mb-2">Description</h2>
            <p className="text-white">{modal.description}</p>
            <button
              onClick={handleCloseModal}
              className="mt-4 bg-white text-blue-500 px-4 py-2 rounded-full shadow-md hover:bg-gray-200 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterestCircles;