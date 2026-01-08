import React from "react";

const dummyPosts = [
  {
    id: 1,
    title: "First Dummy Post",
    author: "Admin",
    date: "5 Jan 2026",
    content:
      "This is a dummy post content. You can replace this with real data coming from your API.",
  },
  {
    id: 2,
    title: "Inspection Update",
    author: "John Doe",
    date: "3 Jan 2026",
    content:
      "Inspection has been completed successfully. All rooms are in good condition and ready for the next phase.",
  },
  {
    id: 3,
    title: "Maintenance Notice",
    author: "Property Manager",
    date: "1 Jan 2026",
    content:
      "Scheduled maintenance will take place this weekend. Please ensure personal belongings are secured.",
  },
];

const Posts = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Latest Posts
        </h1>

        {dummyPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-xl shadow-sm p-6 mb-6"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-1">
              {post.title}
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              By {post.author} • {post.date}
            </p>

            <p className="text-gray-700 leading-relaxed">
              {post.content}
            </p>

            <div className="flex gap-3 mt-5">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Like
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
                Comment
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Posts;
