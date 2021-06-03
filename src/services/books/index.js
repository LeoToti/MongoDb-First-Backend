import express from "express"
import q2m from "query-to-mongo"

import BookModel from "./schema.js"

const router = express.Router()

router.post("/", async (req, res, next) => {
  try {
    const newBook = new BookModel(req.body)

    const { _id } = await newBook.save()
    res.status(201).send(_id)
  } catch (error) {
    next(error)
  }
})

router.get("/", async (req, res, next) => {
  try {
    const query = q2m(req.query)
    const { total, books } = await BookModel.findBooksWithAuthors(query)
    res.send({ links: query.links("/books", total), total, books })
  } catch (error) {
    console.log(error)
    next(error)
  }
})

router.get("/:id", async (req, res, next) => {
  try {
    const book = await BookModel.findBookWithAuthors(req.params.id)
    if (book) {
      res.send(book)
    } else {
      next(createError(404, `Book ${req.params.id} not found`))
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})

router.put("/:id", async (req, res, next) => {
  try {
    const modifiedBook = await BookModel.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
      new: true,
    })
    if (modifiedBook) {
      res.send(modifiedBook)
    } else {
      next(createError(404, `Book ${req.params.id} not found`))
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})

router.delete("/:id", async (req, res, next) => {
  try {
    const book = await BookModel.findByIdAndDelete(req.params.id)
    if (book) {
      res.send(book)
    } else {
      next(createError(404, `Book ${req.params.id} not found`))
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})

export default router
