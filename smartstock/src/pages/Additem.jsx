const Additem = ({ setOpen }) => {
  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      setOpen(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onMouseDown={handleBackdropClick}
    >
      {/* Modal */}
      <div
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Add Item</h2>

          <button
            type="button"
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
