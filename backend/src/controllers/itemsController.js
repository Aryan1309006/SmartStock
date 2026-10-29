const inventoryService = require("../services/inventoryService");
const asyncHandler = require("../middleware/asyncHandler");

const createItem = asyncHandler(async (req, res) => {
  const item = await inventoryService.createItem(req.user.userId, req.body);
  return res.status(201).json({
    success: true,
    message: "Item created successfully",
    data: { item },
  });
});

const showAll = asyncHandler(async (req, res) => {
  const items = await inventoryService.getItems(req.user.userId, req.query);
  return res.status(200).json({
    success: true,
    data: { items },
  });
});

const showOne = asyncHandler(async (req, res) => {
  const item = await inventoryService.getItemById(req.user.userId, req.params.id);
  return res.status(200).json({
    success: true,
    data: { item },
  });
});

const updateOne = asyncHandler(async (req, res) => {
  const item = await inventoryService.updateItem(req.user.userId, req.params.id, req.body);
  return res.status(200).json({
    success: true,
    data: { item },
  });
});

const deleteOne = asyncHandler(async (req, res) => {
  await inventoryService.deleteItem(req.user.userId, req.params.id);
  return res.status(200).json({
    success: true,
    message: "Item deleted successfully",
  });
});

const markConsume = asyncHandler(async (req, res) => {
  const item = await inventoryService.consumeItem(req.user.userId, req.params.id, req.body.amount);
  return res.status(200).json({
    success: true,
    data: { item },
  });
});

const restore = asyncHandler(async (req, res) => {
  const item = await inventoryService.restoreItem(req.user.userId, req.params.id);
  return res.status(200).json({
    success: true,
    data: { item },
  });
});

module.exports = {
  createItem,
  showAll,
  showOne,
  updateOne,
  deleteOne,
  markConsume,
  restore,
};
