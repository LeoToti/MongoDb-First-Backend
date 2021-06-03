import express from "express"
import createError from "http-errors"

import CartModel from "./schema.js"
import BooksModel from "../books/schema.js"

const router = express.Router()

router.post("/:ownerId/add", async (req, res, next) => {
  try {
    const book = await BooksModel.findOne({ asin: req.body.asin })
    if (book) {
      const newBook = { ...book.toObject(), quantity: req.body.quantity }

      const isBookThere = await CartModel.findBookInCart(req.params.ownerId, req.body.asin)
      if (isBookThere) {
        await CartModel.incrementCartQuantity(req.params.ownerId, req.body.asin, req.body.quantity)
        res.send("Quantity incremented")
      } else {
        await CartModel.addBookToCart(req.params.ownerId, newBook)
        res.send("New book added!")
      }
    } else {
      createError(404, error)
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})

router.delete("/:ownerId/remove", async (req, res, next) => {
  try {
    await CartModel.removeBookFromCart(req.params.ownerId, req.body.asin)
    res.send("Ok")
  } catch (error) {
    console.log(error)
    next(error)
  }
})

router.get("/:ownerId/total", async (req, res, next) => {
  try {
    const total = await CartModel.calculateCartTotal(req.params.ownerId)
    res.send({ total })
  } catch (error) {
    next(error)
  }
})

export default router
