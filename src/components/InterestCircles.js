import React from "react";
import { useHistory } from "react-router-dom";

const InterestCircles = () => {
  const history = useHistory();

  const circles = [
    { id: 1, name: "Coding", owner: "jmce" },
    { id: 2, name: "Gaming", owner: "jmce" },
    { id: 3, name: "Music", owner: "jmce" },
    { id: 4, name: "Cooking", owner: "jmce" },
    { id: 5, name: "Art", owner: "jmce" },
    { id: 6, name: "Writing", owner: "jmce" },
  ];

  const handleCircleClick = (id) => {
    // Navigate to the corresponding chat route
    history.push(`/chats/${id}`);
  };

  return (
    <div className="p-6 lg:pr-20">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">
        Interest Circles
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {circles.map((circle) => (
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
        ))}
      </div>
    </div>
  );
};

export default InterestCircles;
