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
    authors: [{ type: Schema.Types.ObjectId, required: true, ref: "Author" }],
    
    content:{
      type:String,
      default: "HTML",

    }
  },
  { timestamps: true }
)

BlogPostSchema.static("findPostsWithAuthors", async function (id) {
  const posts = await this.findOne({ _id: id }).populate("authors")
  return posts
})

BlogPostSchema.static("findPostsWithAuthors", async function (query) {
  const total = await this.countDocuments(query.criteria)
  const posts = await this.find(query.criteria).skip(query.options.skip).limit(query.options.limit).sort(query.options.sort).populate("authors")

  return { total, posts }
})







export default model("BlogPost", BlogPostSchema)
