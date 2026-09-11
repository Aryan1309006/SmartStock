const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-3">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-500" />
        <p className="text-sm font-medium tracking-wide text-gray-600">
          {text}
        </p>
      </div>
    </div>
  );
};

export default Loader;