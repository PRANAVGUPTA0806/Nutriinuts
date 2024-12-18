const asyncHandler = require("express-async-handler");
const blogModel = require("../models/blogModel");

// Get all blogs
const getblog = asyncHandler(async (req, res) => {
  const blogs = await blogModel.find({});
  res.status(200).json(blogs);
});

// Create new blog
const createblog = asyncHandler(async (req, res) => {
  const { blogImageUrl, blogHeading, blogAuthor, blogDescription } = req.body;
  
  if (!blogImageUrl || !blogHeading || !blogAuthor || !blogDescription) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }

  // Find the latest blog to get the last blog_id
  const lastBlog = await blogModel.findOne().sort({ createdAt: -1 });
  
  // Assign a new blog_id based on the last blog's blog_id, or set to 1 if none exists
  const blog_id = lastBlog ? parseInt(lastBlog.blog_id) + 1 : 1;

  // Create the new blog
  const blog = await blogModel.create({
    blog_id: blog_id.toString(), // Convert to string if needed
    blogImageUrl,
    blogHeading,
    blogAuthor,
    blogDescription,
  });

  res.status(201).json(blog);
});


// Get blog by ID
const getblogById = asyncHandler(async (req, res) => {
  const blog = await blogModel.findById(req.params.id);
  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }
  res.status(200).json(blog);
});

// Update blog by ID
const updateblogById = asyncHandler(async (req, res) => {
  const { blogImageUrl, blogHeading, blogAuthor, blogDescription } = req.body;
  
  // Find the blog by ID
  const blog = await blogModel.findById(req.params.id);
  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }

  // If a new image URL is provided, update it
  if (blogImageUrl) {
    blog.blogImageUrl = blogImageUrl; // Update the image URL if a new one is provided
  }

  // Update other blog details if they are provided
  blog.blogHeading = blogHeading || blog.blogHeading;
  blog.blogAuthor = blogAuthor || blog.blogAuthor;
  blog.blogDescription = blogDescription || blog.blogDescription;

  // Save the updated blog
  const updatedBlog = await blog.save();

  res.status(200).json(updatedBlog);
});


// Delete blog by ID
const deleteblogById = asyncHandler(async (req, res) => {
  const blog = await blogModel.findById(req.params.id);
  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }
  await blogModel.deleteOne({ _id: req.params.id });
  res.status(200).json({ message: "Blog deleted successfully" });
});

module.exports = {
  getblog,
  createblog,
  getblogById,
  updateblogById,
  deleteblogById,
};