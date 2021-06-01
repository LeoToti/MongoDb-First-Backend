import mongoose from "mongoose"

const { Schema, model } = mongoose

const BlogPostSchema = new Schema(
  {
    category: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    cover: {
      type: String,
      required: true,
      lowercase: true,
    },
    readTime: {
      value: {
        type: Number,
        required: true
      },
      unit: {
        type: String,
        required: true

      }
    },
    author: {
      name:{
        type: String,
        required: true

      },
      avatar: {
        type: String,
        required: true

      }
    },
    content:{
      type:String,
      default: "HTML",

    }
  },
  { timestamps: true }
)

export default model("BlogPost", BlogPostSchema)
