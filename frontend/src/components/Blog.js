import React, { useState, useEffect } from "react";
import "../styles/Blog.css";

function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedBlogId, setExpandedBlogId] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/blog`);
        const data = await response.json();

        // const blogsWithLorem = data.map(blog => ({
        //   ...blog,
        //   blogDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque vehicula tincidunt ligula, vitae ullamcorper nisi aliquam ut. Suspendisse potenti. Ut fringilla quam a arcu dictum, vel tempor lorem scelerisque.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque vehicula tincidunt ligula, vitae ullamcorper nisi aliquam ut. Suspendisse potenti. Ut fringilla quam a arcu dictum, vel tempor lorem scelerisque.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque vehicula tincidunt ligula, vitae ullamcorper nisi aliquam ut. Suspendisse potenti. Ut fringilla quam a arcu dictum, vel tempor lorem scelerisque.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque vehicula tincidunt ligula, vitae ullamcorper nisi aliquam ut. Suspendisse potenti. Ut fringilla quam a arcu dictum, vel tempor lorem scelerisque."
        // }));

        setBlogs(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);
  if (loading) {
    return <div>Loading...</div>;
  }
  const toggleExpandBlog = (blogId) => {
    setExpandedBlogId(expandedBlogId === blogId ? null : blogId);
  };

  return (
    <div className="blogPageMainDiv">
      <div className="headingBlogContainer">
        <h4>Towards A Healthier Tomorrow</h4>
      </div>
      <div className="blogContainer">
        {loading ? (
          <div>Loading...</div>
        ) : blogs.length > 0 ? (
          blogs.map((blog) => (
            <div
              key={blog.blog_id}
              className={`blogDiv ${
                expandedBlogId === blog.blog_id ? "expanded" : ""
              }`}
            >
              <div className="blogImageDiv">
                <img src={blog.blogImageUrl} alt="blog_postImg" />
              </div>
              <div className="blogTagLine">{blog.blogHeading}</div>
              <div className="blogAuthorDiv">
                <strong>Author: </strong>{blog.blogAuthor}
              </div>
              <div className="blogDivContent">
                <p className="blogDescription">
                  {expandedBlogId === blog.blog_id
                    ? blog.blogDescription
                    : `${blog.blogDescription.slice(0, 150)}...`}
                </p>
                <button
                  className="readMoreButton"
                  onClick={() => toggleExpandBlog(blog.blog_id)}
                >
                  {expandedBlogId === blog.blog_id ? "Show Less" : "Read More"}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div>No blogs found.</div>
        )}
      </div>
    </div>
  );
}

export default Blog;
