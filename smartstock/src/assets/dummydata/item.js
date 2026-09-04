// src/data/dummyData.js

export const dummyUser = {
  _id: "65f1a2b3c4d5e6f789001234",
  name: "Aryan Patil",
  email: "aryan@example.com",
};

// Dashboard response
export const dummyDashboard = {
  success: true,
  data: {
    totalItems: 24,
    freshItems: 14,
    consumedItems: 5,
    expiringItems: 3,
    expiredItems: 2,
    inventoryValue: 12450.75,
  },
};

// Items response
export const dummyItems = {
  success: true,
  data: {
    items: [
      {
        _id: "65f1a2b3c4d5e6f789001001",
        userId: dummyUser._id,
        name: "Milk",
        category: "Dairy",
        quantity: 2,
        purchaseDate: "2026-09-01",
        expiryDate: "2026-09-06",
        price: 65,
        notes: "Keep refrigerated",
        status: "active",
        consumedAt: null,
        createdAt: "2026-09-01T10:30:00.000Z",
        updatedAt: "2026-09-01T10:30:00.000Z",
      },

      {
        _id: "65f1a2b3c4d5e6f789001002",
        userId: dummyUser._id,
        name: "Basmati Rice",
        category: "Pantry",
        quantity: 5,
        purchaseDate: "2026-08-20",
        expiryDate: "2027-08-20",
        price: 550,
        notes: "5kg rice bag",
        status: "active",
        consumedAt: null,
        createdAt: "2026-08-20T09:15:00.000Z",
        updatedAt: "2026-08-20T09:15:00.000Z",
      },

      {
        _id: "65f1a2b3c4d5e6f789001003",
        userId: dummyUser._id,
        name: "Paracetamol",
        category: "Medicine",
        quantity: 10,
        purchaseDate: "2026-07-10",
        expiryDate: "2027-07-10",
        price: 120,
        notes: "Medicine box",
        status: "active",
        consumedAt: null,
        createdAt: "2026-07-10T08:20:00.000Z",
        updatedAt: "2026-07-10T08:20:00.000Z",
      },

      {
        _id: "65f1a2b3c4d5e6f789001004",
        userId: dummyUser._id,
        name: "Toothpaste",
        category: "Toiletries",
        quantity: 3,
        purchaseDate: "2026-08-15",
        expiryDate: "2027-03-15",
        price: 180,
        notes: "Daily use",
        status: "active",
        consumedAt: null,
        createdAt: "2026-08-15T11:00:00.000Z",
        updatedAt: "2026-08-15T11:00:00.000Z",
      },

      {
        _id: "65f1a2b3c4d5e6f789001005",
        userId: dummyUser._id,
        name: "Bread",
        category: "Pantry",
        quantity: 1,
        purchaseDate: "2026-09-02",
        expiryDate: "2026-09-05",
        price: 45,
        notes: "Whole wheat bread",
        status: "active",
        consumedAt: null,
        createdAt: "2026-09-02T07:30:00.000Z",
        updatedAt: "2026-09-02T07:30:00.000Z",
      },

      {
        _id: "65f1a2b3c4d5e6f789001006",
        userId: dummyUser._id,
        name: "Dishwasher Liquid",
        category: "Cleaning",
        quantity: 2,
        purchaseDate: "2026-08-05",
        expiryDate: "2028-08-05",
        price: 240,
        notes: "Kitchen cleaning",
        status: "active",
        consumedAt: null,
        createdAt: "2026-08-05T14:00:00.000Z",
        updatedAt: "2026-08-05T14:00:00.000Z",
      },

      {
        _id: "65f1a2b3c4d5e6f789001007",
        userId: dummyUser._id,
        name: "Eggs",
        category: "Dairy",
        quantity: 6,
        purchaseDate: "2026-08-29",
        expiryDate: "2026-09-03",
        price: 72,
        notes: "6 eggs remaining",
        status: "expired",
        consumedAt: null,
        createdAt: "2026-08-29T08:00:00.000Z",
        updatedAt: "2026-09-04T08:00:00.000Z",
      },

      {
        _id: "65f1a2b3c4d5e6f789001008",
        userId: dummyUser._id,
        name: "Shampoo",
        category: "Toiletries",
        quantity: 1,
        purchaseDate: "2026-08-01",
        expiryDate: "2027-08-01",
        price: 350,
        notes: "Daily use",
        status: "active",
        consumedAt: null,
        createdAt: "2026-08-01T12:30:00.000Z",
        updatedAt: "2026-08-01T12:30:00.000Z",
      },

      {
        _id: "65f1a2b3c4d5e6f789001009",
        userId: dummyUser._id,
        name: "Cooking Oil",
        category: "Pantry",
        quantity: 2,
        purchaseDate: "2026-08-10",
        expiryDate: "2027-02-10",
        price: 320,
        notes: "Sunflower oil",
        status: "consumed",
        consumedAt: "2026-08-30T16:30:00.000Z",
        createdAt: "2026-08-10T10:00:00.000Z",
        updatedAt: "2026-08-30T16:30:00.000Z",
      },

      {
        _id: "65f1a2b3c4d5e6f789001010",
        userId: dummyUser._id,
        name: "Hand Wash",
        category: "Toiletries",
        quantity: 2,
        purchaseDate: "2026-08-25",
        expiryDate: "2027-08-25",
        price: 160,
        notes: "Bathroom",
        status: "active",
        consumedAt: null,
        createdAt: "2026-08-25T13:00:00.000Z",
        updatedAt: "2026-08-25T13:00:00.000Z",
      },
    ],
  },
};

// Single item response
export const dummyItemResponse = {
  success: true,
  data: {
    item: dummyItems.data.items[0],
  },
};