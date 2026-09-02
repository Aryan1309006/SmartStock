const Item = require("../models/item");
const dashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    const date = new Date();
    const sevenDay = new Date();
    sevenDay.setDate(date.getDate() + 7);

    const totalItems = await Item.countDocuments({ userId });
    const freshItems = await Item.countDocuments({
      userId,
      consumed: false,
      expiryDate: { $gt: sevenDay },
    });
    const consumedItems = await Item.countDocuments({ userId, consumed: true });
    const expiringItems = await Item.countDocuments({
      userId,
      expiryDate: { $gte: date, $lte: sevenDay },
    });
    const expiredItems = await Item.countDocuments({
      userId: userId,
      expiryDate: { $lt: date },
    });
     const items = await Item.find({ userId: userId });

    const inventoryValue = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    res.status(200).json({
      success: true,
      data: {
        totalItems,
        freshItems,
        consumedItems,
        expiringItems,
        expiredItems,
        inventoryValue,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = { dashboard };
