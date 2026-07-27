import mongoose from "mongoose";
import productModel from "./products.model.js";

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
          default: 1,
          min: 1,
        },

        color: {
          type: String,
        },
      },
    ],
    totalSum: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);

// cartSchema.pre("save", async function (next) {
//   if (!this.isModified("items")) return next();

//   const productIds = this.items.map((item) => item.product);

//   const products = await productModel.find({
//     _id: { $in: productIds },
//   });

//   const productMap = new Map(
//     products.map((prd) => [prd._id.toString(), prd.price]),
//   );

//   this.totalSum = this.items.reduce((sum, item) => {
//     const price = productMap.get(item.product.toString()) || 0;
//     return sum + price * item.quantity;
//   }, 0);

//   console.log(this.totalSum);
  

//   next()
// });

const cartModel = mongoose.model("Cart", cartSchema);

export default cartModel;
