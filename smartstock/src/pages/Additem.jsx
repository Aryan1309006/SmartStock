const Additem = ({ setOpen }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      {/* Modal */}
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Add Item</h2>

          <button
            onClick={() => setOpen(false)}
            className="text-gray-500 hover:text-gray-800"
          >
            ✕
          </button>
        </div>

        {/* Your form */}
        <div className="mt-6">{/* form fields */}</div>
      </div>
    </div>
  );
};

export default Additem;
