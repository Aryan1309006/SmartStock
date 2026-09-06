import React from "react";
import { categoryImages } from "../../assets/dummydata/item";
const Inventoryitem = ({ item }) => {
  return (
    <div className="w-[100%] px-4 flex  gap-4   place-items-center h-14 rounded-t-3xl font-semibold text-gray-500">

      {/* Item */}
      <div className=" flex justify-content gap-3 w-[20%] text-center">
        <img
          src={categoryImages[item.category]}
          alt={item.name}
          className="w-10 h-10 rounded-lg object-cover"
        />

        <span className="font-bold text-black">{item.name}</span>
      </div>

      {/* Category */}
      <div className="w-[15%]  ">{item.category}</div>

      {/* Quantity */}
      <div  className="w-[10%] ">{item.quantity}</div>

      {/* Expiry */}
      <div className="w-[15%] ">
        {new Date(item.expiryDate).toLocaleDateString()}
      </div>

      {/* Status */}
      <div className="w-[15%] text-center">{item.status}</div>

      {/* Price */}
      <div  className="w-[10%] text-center ">₹{item.price}</div>

      {/* Action */}
      <div className="w-[20%] text-center">
        action
      </div>

    </div>
  );
};

export default Inventoryitem;