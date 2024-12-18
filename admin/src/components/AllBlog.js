import React, { useEffect, useState } from 'react';
import "../styles/AllBlog.css";

// AllBlog Component
const AllBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null); // Store the blog being edited

  // Fetch blogs from backend
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/blog`);
        const data = await response.json();
        setBlogs(data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };
    fetchBlogs();
  }, []);

  // Handle delete blog with confirmation
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this blog?");
    if (!confirmDelete) return;

    try {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/blog/${id}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setBlogs(blogs.filter(blog => blog._id !== id));
      alert("Blog deleted successfully!");
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  // Filtered blogs based on search input
  const filteredBlogs = blogs.filter(blog =>
    blog.blogHeading.toLowerCase().includes(search.toLowerCase()) ||
    blog.blogAuthor.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="all-blog-container">
      <h2>All Blogs</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search blogs by heading or author..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-bar"
      />

      {/* Create Blog Button */}
      <button onClick={() => setShowForm(true)} className="create-blog-button">
        Create Blog
      </button>
      <div className='jj'>
      {/* Blog Table */}
      <table className="blog-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Heading</th>
            <th>Author</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredBlogs.map(blog => (
            <tr key={blog._id}>
              <td><img src={blog.blogImageUrl} alt={blog.blogHeading} className="blog-image" /></td>
              <td>{blog.blogHeading}</td>
              <td>{blog.blogAuthor}</td>
              <td>{blog.blogDescription}</td>
              <td>
                <button className="update-button" onClick={() => {
                  setEditingBlog(blog);
                  setShowForm(true);
                }}>
                  Update
                </button>
                <button className="delete-button" onClick={() => handleDelete(blog._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      {/* Conditional Form Modal */}
      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editingBlog ? 'Update Blog' : 'Create New Blog'}</h3>
            {editingBlog ? (
              <UpdateBlogForm 
                editingBlog={editingBlog} 
                setShowForm={setShowForm} 
                setBlogs={setBlogs}
                setEditingBlog={setEditingBlog} 
              />
            ) : (
              <CreateBlogForm setShowForm={setShowForm} setBlogs={setBlogs} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// CreateBlogForm Component
const CreateBlogForm = ({ setShowForm, setBlogs }) => {
  const [newBlog, setNewBlog] = useState({
    blogImageUrl: '',
    blogHeading: '',
    blogAuthor: '',
    blogDescription: '',
  });
  const [imageFile, setImageFile] = useState(null);

  // Handle create new blog with image required validation
  const handleCreateBlog = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      alert("Image is required!");
      return;
    }

    let imageUrl = newBlog.blogImageUrl;
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      imageUrl = result.imageUrl;  // Get the image URL from the backend
    } catch (error) {
      console.error("Error uploading image:", error);
      return; // Stop execution if image upload fails
    }

    // Create the blog with the uploaded image URL
    const blogData = { ...newBlog, blogImageUrl: imageUrl };

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/blog`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(blogData),
      });
      const data = await response.json();
      setBlogs(prevBlogs => [...prevBlogs, data]);
      setShowForm(false);  // Close form on success
      alert("Blog created successfully!");
    } catch (error) {
      console.error("Error creating blog:", error);
    }
  };

  return (
    <form onSubmit={handleCreateBlog}>
      <input
        type="file"
        name="image"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files[0])}
        required
      />
      <input
        type="text"
        name="blogHeading"
        placeholder="Heading"
        value={newBlog.blogHeading}
        onChange={(e) => setNewBlog({ ...newBlog, blogHeading: e.target.value })}
        required
      />
      <input
        type="text"
        name="blogAuthor"
        placeholder="Author"
        value={newBlog.blogAuthor}
        onChange={(e) => setNewBlog({ ...newBlog, blogAuthor: e.target.value })}
        required
      />
      <textarea
        name="blogDescription"
        placeholder="Description"
        value={newBlog.blogDescription}
        onChange={(e) => setNewBlog({ ...newBlog, blogDescription: e.target.value })}
        required
      ></textarea>
      <button type="submit" className="submit-button">Create</button>
      <button type="button" onClick={() => setShowForm(false)} className="cancel-button">Cancel</button>
    </form>
  );
};

const UpdateBlogForm = ({ editingBlog, setShowForm, setBlogs, setEditingBlog }) => {
  const [newBlog, setNewBlog] = useState({
    blogImageUrl: editingBlog.blogImageUrl, // Prepopulate with existing image URL
    blogHeading: editingBlog.blogHeading,
    blogAuthor: editingBlog.blogAuthor,
    blogDescription: editingBlog.blogDescription,
  });
  
  // Handle update blog with URL change
  const handleUpdateBlog = async (e) => {
    e.preventDefault();

    // Prepare updated blog data
    const updatedBlog = { ...editingBlog, ...newBlog };
    const confirmDelete = window.confirm("Are you sure you want to edit this blog?");
    if (!confirmDelete) {setEditingBlog(null);
      setShowForm(false);return;}

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/blog/${editingBlog._id}`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updatedBlog),
      });

      if (response.ok) {
        const data = await response.json();
        setBlogs(prevBlogs => prevBlogs.map(blog => (blog._id === data._id ? data : blog)));
        setEditingBlog(null);
        setShowForm(false);
        alert("Blog updated successfully!");
      } else {
        console.error("Error updating blog.");
        alert("Error updating blog.");
      }
    } catch (error) {
      console.error("Error updating blog:", error);
      alert("Error updating blog.",error);
    }
  };

  return (
    <form onSubmit={handleUpdateBlog}>
      <input
        type="text"
        name="blogImageUrl"
        value={newBlog.blogImageUrl}
        onChange={(e) => setNewBlog({ ...newBlog, blogImageUrl: e.target.value })}
        placeholder="Enter image URL"
        required
      />
      <input
        type="text"
        name="blogHeading"
        value={newBlog.blogHeading}
        onChange={(e) => setNewBlog({ ...newBlog, blogHeading: e.target.value })}
        required
      />
      <input
        type="text"
        name="blogAuthor"
        value={newBlog.blogAuthor}
        onChange={(e) => setNewBlog({ ...newBlog, blogAuthor: e.target.value })}
        required
      />
      <textarea
        name="blogDescription"
        value={newBlog.blogDescription}
        onChange={(e) => setNewBlog({ ...newBlog, blogDescription: e.target.value })}
        required
      ></textarea>
      <button type="submit" className="submit-button">Update</button>
      <button type="button" onClick={() => {
        setEditingBlog(null);
        setShowForm(false);
      }} className="cancel-button">Cancel</button>
    </form>
  );
};



export default AllBlog;
