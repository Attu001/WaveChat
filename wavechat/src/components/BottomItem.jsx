const BottomItem = ({ icon, label, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center text-sm ${
        active ? "text-purple-600" : "text-gray-400"
      }`}
    >
      <div className="text-xl">{icon}</div>
      <span>{label}</span>
    </button>
  );
};


export default BottomItem