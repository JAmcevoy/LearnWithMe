import React from "react";
import { FaThumbsUp } from "react-icons/fa";

const PostContent = () => {
  const posts = [
    {
      id: 1,
      profilePic: "https://via.placeholder.com/40",
      userName: "Jane Doe",
      postTime: "2 hours ago",
      image: "https://via.placeholder.com/800x400",
      description: "Check out this beautiful sunset! #sunset #photography",
    },
    {
      id: 2,
      profilePic: "https://via.placeholder.com/40",
      userName: "John Smith",
      postTime: "1 day ago",
      image: "https://via.placeholder.com/800x400",
      description: "Had a great day at the beach. 🏖️ #beachday #fun",
    },
    {
      id: 3,
      profilePic: "https://via.placeholder.com/40",
      userName: "Alice Johnson",
      postTime: "3 days ago",
      image: "https://via.placeholder.com/800x400",
      description: "Loving this new recipe I tried! 🍲 #cooking #foodie",
    },
    {
      id: 4,
      profilePic: "https://via.placeholder.com/40",
      userName: "Bob Brown",
      postTime: "5 hours ago",
      image: "https://via.placeholder.com/800x400",
      description: "Hiking adventures in the mountains. 🏔️ #hiking #nature",
    },
  ];

  return (
    <div className="flex flex-row flex-wrap justify-center gap-6 py-8 px-4 min-h-screen">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white rounded-2xl shadow-lg overflow-hidden w-full max-w-sm"
        >
          <div className="flex items-center p-4 border-b border-gray-200">
            <img
              src={post.profilePic}
              alt={`${post.userName}'s profile`}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="ml-4">
              <h2 className="font-semibold">{post.userName}</h2>
              <p className="text-gray-500 text-sm">{post.postTime}</p>
            </div>
          </div>
          <img
            src={post.image}
            alt={post.description}
            className="w-full h-auto object-cover"
          />
          <div className="p-4">
            <p className="text-gray-700 mb-4">{post.description}</p>
            <div className="flex items-center space-x-6">
              <button className="flex items-center text-gray-500 hover:text-blue-500">
                <FaThumbsUp className="mr-2" /> Like
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostContent;
