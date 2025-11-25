import React from 'react'

const Chats = () => {
  return (
  <div className="h-screen  md:flex md:flex-col w-64 bg-purple-100/50 backdrop-blur-md shadow-lg">
        <div className="p-4 font-bold text-lg border-b border-purple-200">Chats</div>
        <div className="flex-1 overflow-y-auto">
          {["Alice", "Bob", "Charlie", "David"].map((user, idx) => (
            <div
              key={idx}
              className="p-4 hover:bg-purple-200 cursor-pointer flex items-center space-x-3"
            >
              <div className="w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold">
                {user[0]}
              </div>
              <span className="font-medium">{user}</span>
            </div>
          ))}
        </div>
      </div>
  )
}

export default Chats