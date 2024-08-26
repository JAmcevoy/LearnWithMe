import React from "react";

const Profile = () => {
  const user = {
    name: "Jane Doe",
    image: "https://via.placeholder.com/150",
    aboutMe:
      "I am a software engineer with a passion for coding, gaming, and photography. Always eager to learn new things and explore new opportunities.",
    followers: 1200,
    following: 300,
    posts: 45,
  };

  return (
    <div className="flex flex-col items-center p-6 min-h-screen">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative">
          <img
            src={user.image}
            alt={`${user.name}'s profile`}
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white p-4 rounded-full border-4 border-white shadow-md">
              <img
                src={user.image}
                alt={`${user.name}'s profile`}
                className="w-32 h-32 rounded-full"
              />
            </div>
          </div>
        </div>
        <div className="p-6 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{user.name}</h1>
          <p className="text-gray-600 text-lg mb-6">{user.aboutMe}</p>
          <div className="flex justify-around text-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user.posts}</h2>
              <p className="text-gray-600">Posts</p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {user.followers}
              </h2>
              <p className="text-gray-600">Followers</p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {user.following}
              </h2>
              <p className="text-gray-600">Following</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
