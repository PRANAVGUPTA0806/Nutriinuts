import React, { useEffect, useState } from "react";
import "../styles/AllHome.css";

const AllHome = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/home/`
        );
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  // handle delete
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

    try {
      await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/home/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setProducts(products.filter((product) => product._id !== id));
      alert("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="allNewLaunches1">
      <h2>All Home Pics</h2>

      <input
        type="text"
        placeholder="Search products by name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-bar"
      />

      <button
        onClick={() => setShowForm(true)}
        className="create-product-button"
      >
        Create product
      </button>

      <div className="launches-container1">
        <table id="newLaunchTable1">
          <thead>
            <tr>
              <th>Image</th>
              <th>Product Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product._id}>
                <td>
                  <img
                    src={product.productImageUrl}
                    alt={product.productName}
                    className="product-image1"
                  />
                </td>
                <td>{product.productName}</td>
                

                <td>
                  
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>{"Create New Product"}</h3>
            
              <CreateProductForm
                setShowForm={setShowForm}
                setProducts={setProducts}
              />
            
          </div>
        </div>
      )}
    </div>
  );
};

const CreateProductForm = ({ setShowForm, setProducts }) => {
  const [newProduct, setNewProduct] = useState({
    productImageUrl: "", 
    productName: "",
  });
  const [imageFile, setImageFile] = useState(null);


  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      alert("Image is required!");
      return;
    }

     let imageUrl = newProduct.productImageUrl;
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const result = await response.json();
      imageUrl = result.imageUrl; // Get the image URL from the backend
    } catch (error) {
      console.error("Error uploading image:", error);
      return; // Stop execution if image upload fails
    }

    const productData = { ...newProduct, productImageUrl: imageUrl };

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/home`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        const data = await response.json();
        setProducts((prevProducts) => [...prevProducts, data]);
        setShowForm(false);
        alert("Product created successfully!");
      } else {
        console.error("Error creating product.");
        alert("Error creating product.");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Error creating product.");
    }
  };

  return (
    <form onSubmit={handleCreateProduct}>
       <input
        type="file"
        name="image"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files[0])}
        required
      />
      <input
        type="text"
        name="productName"
        placeholder="Product Name"
        value={newProduct.productName}
        onChange={(e) => setNewProduct({ ...newProduct, productName: e.target.value })}
        required
      />
      
     
      <button type="submit" className="submit-button">
        Create
      </button>
      <button type="button" onClick={() => setShowForm(false)} className="cancel-button">
        Cancel
      </button>
    </form>
  );
};





export default AllHome;
