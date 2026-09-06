// src/data/constants.js

import {
  Milk,
  Package,
  Pill,
  ShoppingBasket,
  Sparkles,
  SprayCan,
} from "lucide-react";

export const categories = [
  "Pantry",
  "Dairy",
  "Medicine",
  "Toiletries",
  "Cleaning",
  "Other",
];

export const statuses = [
  "active",
  "consumed",
  "expired",
];

export const categoriesData = [
  {
    name: "Pantry",
    icon: ShoppingBasket,
  },
  {
    name: "Dairy",
    icon: Milk,
  },
  {
    name: "Medicine",
    icon: Pill,
  },
  {
    name: "Toiletries",
    icon: Sparkles,
  },
  {
    name: "Cleaning",
    icon: SprayCan,
  },
  {
    name: "Other",
    icon: Package,
  },
];