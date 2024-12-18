const mongoose = require("mongoose");

const blogSchema = mongoose.Schema(
  {
    blog_id: {
      type: String,
      required: true,
      ref: "User",
    },
    blogImageUrl: {
      type: String,
      required: [true, "Please add blog image URL"],
    },
    blogHeading: {
      type: String,
      required: [true, "Please add blog heading"],
    },
    blogAuthor: {
      type: String,
      required: [true, "Please add blog author"],
      ref: "User",
    },
    blogDescription: {
      type: String,
      required: [true, "Please add blog description"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("blog", blogSchema);