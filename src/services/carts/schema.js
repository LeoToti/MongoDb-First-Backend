import mongoose from "mongoose"

const { Schema, model } = mongoose

const CartSchema = new Schema(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: "User" },
    products: [{ asin: String, title: String, price: Number, quantity: Number }],
    status: { type: String, enum: ["active", "paid"] },
  },
  { timestamps: true }
)

CartSchema.static("findBookInCart", async function (id, asin) {
  const isBookThere = await this.findOne({
    ownerId: mongoose.Types.ObjectId(id),
    status: "active",
    "products.asin": asin,
  })
  return isBookThere
})

CartSchema.static("incrementCartQuantity", async function (id, asin, quantity) {
  await this.findOneAndUpdate(
    {
      ownerId: mongoose.Types.ObjectId(id),
      status: "active",
      "products.asin": asin,
    },
    { $inc: { "products.$.quantity": quantity } },
    { upsert: true }
  )
})

CartSchema.static("addBookToCart", async function (id, book) {
  await this.findOneAndUpdate(
    { ownerId: mongoose.Types.ObjectId(id), status: "active" },
    {
      $addToSet: { products: book },
    },
    { upsert: true }
  )
})

CartSchema.static("removeBookFromCart", async function (id, asin) {
  await this.findOneAndUpdate(
    { ownerId: mongoose.Types.ObjectId(id), status: "active" },
    {
      $pull: { products: { asin: asin } },
    }
  )
})

CartSchema.static("calculateCartTotal", async function (id) {
  const { products } = await this.findOne({ ownerId: mongoose.Types.ObjectId(id), status: "active" })
  return products.map(book => book.price * book.quantity).reduce((acc, el) => acc + el, 0)
})

export default model("Cart", CartSchema)
