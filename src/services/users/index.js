import express from "express"
import createError from "http-errors"

import BlogPostModel from "./schema.js"

const blogPostsRouter = express.Router()

blogPostsRouter.get("/", async (req, res, next) => {
  try {
    const users = await BlogPostModel.find()
    res.send(users)
  } catch (error) {
    console.log(error)
    next(createError(500, "An error occurred while getting blogPosts"))
  }
})

blogPostsRouter.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id
    const user = await UserModel.findById(id)
    if (user) {
      res.send(user)
    } else {
      next(createError(404, `blogPosts ${req.params.id} not found`))
    }
  } catch (error) {
    console.log(error)
    next(createError(500, "An error occurred while getting student"))
  }
})

blogPostsRouter.post("/", async (req, res, next) => {
  try {
    const newUser = new BlogPostModel(req.body)
    const { _id } = await newUser.save()

    res.status(201).send(_id)
  } catch (error) {
    console.log(error)
    if (error.name === "ValidationError") {
      next(createError(400, error))
    } else {
      next(createError(500, "An error occurred while saving student"))
    }
  }
})

blogPostsRouter.put("/:id", async (req, res, next) => {
  try {
    const blogPosts = await UserModel.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
      new: true,
    })
    if (blogPosts) {
      res.send(blogPosts)
    } else {
      next(createError(404, `Student ${req.params.id} not found`))
    }
  } catch (error) {
    console.log(error)
    next(createError(500, "An error occurred while modifying student"))
  }
})

blogPostsRouter.delete("/:id", async (req, res, next) => {
  try {
    const blogPosts = await UserModel.findByIdAndDelete(req.params.id)
    if (blogPosts) {
      res.status(204).send()
    } else {
      next(createError(404, `blogPosts ${req.params.id} not found`))
    }
  } catch (error) {
    console.log(error)
    next(createError(500, "An error occurred while deleting blogPosts"))
  }
})

export default blogPostsRouter
