import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { dummyItems, categoryImages } from "../../assets/dummydata/item";
const Item = () => {
  const { id } = useParams();
  const item = dummyItems.data.items.find((item) => item._id === id);
  if (!item) return <>item not found</>;
  console.log(item);

  const nevigate = useNavigate();

  return (
    <div className="py-5 px-10">
      <div>
        <p
          onClick={() => nevigate("/inventory")}
          className="flex cursor-pointer font-semibold"
        >
          <ArrowLeft />
          Back to Inventory
        </p>
      </div>
      <div>
        <div>
          <img
            src={categoryImages[item.category]}
            alt={item.name}
            className="w-10 h-10 rounded-lg object-cover"
          />
          <div>
            <p>{item.name}</p>
            <div>
              <p>{item.category}</p>
              <p>{item.status}</p>
            </div>
          </div>
          <div>
            <button>Edit Item</button>
            <button>Delete Item</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Item;
