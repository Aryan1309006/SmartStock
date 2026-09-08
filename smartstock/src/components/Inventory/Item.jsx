import React from "react";
import { ArrowLeft,Pencil,Trash2 } from "lucide-react";
import { data, useNavigate, useParams } from "react-router-dom";
import { dummyItems, categoryImages } from "../../assets/dummydata/item";
const Item = () => {
  const { id } = useParams();
  const item = dummyItems.data.items.find((item) => item._id === id);
  if (!item) return <>item not found</>;





  const nevigate = useNavigate();

    const today = new Date();
  const expiryDate = new Date(`${item.expiryDate}T00:00:00`);
  const purchaseDate = new Date(`${item.purchaseDate}T00:00:00`);

  // Remove time from today
  today.setHours(0, 0, 0, 0);

  // Calculate days
  const daysLeft = Math.ceil(
    (expiryDate - today) / (1000 * 60 * 60 * 24)
  );

  // Total lifetime of item
  const totalDays = Math.ceil(
    (expiryDate - purchaseDate) / (1000 * 60 * 60 * 24)
  );

  // Days passed since purchase
  const daysPassed = Math.ceil(
    (today - purchaseDate) / (1000 * 60 * 60 * 24)
  );

  // Progress percentage
  const progress = Math.min(
    100,
    Math.max(0, (daysPassed / totalDays) * 100)
  );

  // Display text
  let expiryText;

  if (daysLeft < 0) {
    expiryText = `${Math.abs(daysLeft)} days ago`;
  } else if (daysLeft === 0) {
    expiryText = "Today";
  } else {
    expiryText = `${daysLeft} days`;
  }

  return (
    <div className=" px-10">
      <div>
        <p
          onClick={() => nevigate("/inventory")}
          className="flex cursor-pointer font-semibold"
        >
          <ArrowLeft />
          Back to Inventory
        </p>
      </div>
      <div className="flex flex-wrap gap-5 pt-10 ">
      <div className="w-full pt-5 border-2 border-gray-200 rounded-2xl ">
        <div className="flex justify-between">
          <div className="flex gap-3">
          <img
            src={categoryImages[item.category]}
            alt={item.name}
            className="w-20 h-20 rounded-lg object-cover"
          />
          <div>
            <p className="font-bold text-4xl">  {item.name}</p>
            <div className="flex gap-4 text-20 mt-4">
              <p className="p-1 w-20 text-center border-2 rounded-2xl text-blue-400 border-blue-400">{item.category}</p>
              <p className=" p-1 w-20 text-center border-2 rounded-2xl text-green-400 border-green-400">{item.status}</p>
            </div>
            </div>
          </div>
          <div className="flex gap-4 p-10">
            <button className="border-2 border-blue-500 text-blue-500 p-2 rounded-3xl text-red hover:bg-blue-500 hover:text-white flex gap-2"><Pencil scale={2}/>Edit Item</button>
            <button className="border-2 border-red-500 text-red-500 p-2 rounded-3xl text-red hover:bg-red-500 hover:text-white flex gap-2"><Trash2/> Delete Item</button>
          </div>
        </div>
      </div>

      <div className="w-60 min-h-55 bg-white rounded-lg border border-gray-200 p-5 shadow-sm">

      {/* Expires in */}
      <p className="text-sm text-gray-500">
        Expires in
      </p>

      <h2
        className={`text-xl font-bold mt-1 ${
          daysLeft <= 2 ? "text-orange-500" : "text-gray-800"
        }`}
      >
        {expiryText}
      </h2>

      {/* Divider */}
      <div className="border-t border-gray-100 my-5"></div>

      {/* Expiry date */}
      <p className="text-xs text-gray-500">
        Expiry Date
      </p>

      <p className="text-sm font-semibold text-gray-700 mt-1">
        {expiryDate.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </p>

      {/* Progress bar */}
      <div className="mt-6">
        <div className="w-full h-2 bg-orange-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-orange-400 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>{daysPassed > 0 ? daysPassed : 0} days</span>
          <span>{totalDays} days</span>
        </div>
      </div>
    </div>
      <div><p>details</p>
      <div>
        
        </div></div>
        </div>
    </div>
  );
};

export default Item;
