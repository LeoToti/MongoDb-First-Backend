import mongoose from "mongoose"
import createError from "http-errors"

const { Schema, model } = mongoose

const BookSchema = new Schema(
  {
    asin: {
      type: String,
      required: true,
    },
    title: { type: String, required: true },
    price: {
      type: Number,
      min: [0, "Should be greater than zero"],
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["horror", "romance", "fantasy", "history"],
    },
    authors: [{ type: Schema.Types.ObjectId, required: true, ref: "Author" }],
  },
  {
    timestamps: true,
  }
)

BookSchema.post("validate", function (error, doc, next) {
  if (error) {
    const err = createError(400, error)
    next(err)
  } else {
    next()
  }
})

BookSchema.static("findBookWithAuthors", async function (id) {
  const book = await this.findOne({ _id: id }).populate("authors")
  return book
})

BookSchema.static("findBooksWithAuthors", async function (query) {
  const total = await this.countDocuments(query.criteria)
  const books = await this.find(query.criteria).skip(query.options.skip).limit(query.options.limit).sort(query.options.sort).populate("authors")

  return { total, books }
})

export default model("Book", BookSchema)
