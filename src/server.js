import express from "express"
import cors from "cors"
import listEndpoints from "express-list-endpoints"
import mongoose from "mongoose"

import blogPostsRouter from "./services/users/index.js"
import booksRouter from "./services/books/index.js"
import authorsRouter from "./services/authors/index.js"
import cartsRouter from "./services/carts/index.js"

import { notFoundErrorHandler, badRequestErrorHandler, catchAllErrorHandler } from "./errorHandlers.js"

const server = express()

const port = process.env.PORT 

// ******** MIDDLEWARES ************

server.use(express.json())
server.use(cors())

// ******** ROUTES ************

server.use("/blogPosts", blogPostsRouter)
server.use("/books", booksRouter)
server.use("/authors", authorsRouter)
server.use("/carts", cartsRouter)

// ******** ERROR MIDDLEWARES ************

server.use(badRequestErrorHandler)
server.use(notFoundErrorHandler)
server.use(catchAllErrorHandler)

console.log(listEndpoints(server))

mongoose
  .connect(process.env.MONGO_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(
    server.listen(port, () => {
      console.log("Running on port", port)
    })
  )
  .catch(err => console.log(err))
