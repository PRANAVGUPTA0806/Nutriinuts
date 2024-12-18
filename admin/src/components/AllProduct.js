import React, { useEffect, useState } from "react";
import "../styles/AllProduct.css";

const AllProduct = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/allproducts/`
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
        `${process.env.REACT_APP_BACKEND_URL}/api/allproducts/${id}`,
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
    <div className="allNewLaunches">
      <h2>All Products</h2>

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

      <div className="launches-container">
        <table id="newLaunchTable">
          <thead>
            <tr>
              <th>Image</th>
              <th>Product Name</th>
              <th>Price</th>
              <th>Description</th>
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
                    className="product-image"
                  />
                </td>
                <td>{product.productName}</td>
                <td>{product.productPrice}</td>
                <td className="description-cell" data-full-description={product.productDescription}>
  {product.productDescription}
</td>

                <td>
                  <button
                    className="update-button"
                    onClick={() => {
                      setEditingProduct(product);
                      setShowForm(true);
                    }}
                  >
                    Update
                  </button>
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
            <h3>{editingProduct ? "Update Product" : "Create New Product"}</h3>
            {editingProduct ? (
              <UpdateProductForm
                editingProduct={editingProduct}
                setShowForm={setShowForm}
                setProducts={setProducts}
                setEditingProduct={setEditingProduct}
              />
            ) : (
              <CreateProductForm
                setShowForm={setShowForm}
                setProducts={setProducts}
              />
            )}
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
    productDescription: "",
    productPrice: "",
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
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/allproducts`, {
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
      <input
        type="text"
        name="productDescription"
        placeholder="Product Description"
        value={newProduct.productDescription}
        onChange={(e) => setNewProduct({ ...newProduct, productDescription: e.target.value })}
        required
      />
      <input
        type="text"
        name="productPrice"
        placeholder="Product Price"
        value={newProduct.productPrice}
        onChange={(e) => setNewProduct({ ...newProduct, productPrice: e.target.value })}
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


const UpdateProductForm = ({ editingProduct, setShowForm, setProducts, setEditingProduct }) => {
  const [newProduct, setNewProduct] = useState({
    productImageUrl: editingProduct.productImageUrl, 
    productName: editingProduct.productName,
    productDescription: editingProduct.productDescription,
    productPrice: editingProduct.productPrice,
  });

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
  
    const updatedProduct = { ...newProduct };

    try {
      const id=editingProduct._id;
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/allproducts/${id}`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updatedProduct),
      });

      if (response.ok) {
        const data = await response.json();
        setProducts((prevProducts) =>
          prevProducts.map((product) => (product._id === data._id ? data : product))
        );
        setEditingProduct(null);
        setShowForm(false);
        alert("Product updated successfully!");
      } else {
        console.error("Error updating product.");
        alert("Error updating product.");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Error updating product.");
    }
  };

  return (
    <form onSubmit={handleUpdateProduct}>
      <input
        type="text"
        name="productName"
        placeholder="Product Name"
        value={newProduct.productName}
        onChange={(e) => setNewProduct({ ...newProduct, productName: e.target.value })}
        required
      />
      <input
        type="text"
        name="productDescription"
        placeholder="Product Description"
        value={newProduct.productDescription}
        onChange={(e) => setNewProduct({ ...newProduct, productDescription: e.target.value })}
        required
      />
      <input
        type="text"
        name="productPrice"
        placeholder="Product Price"
        value={newProduct.productPrice}
        onChange={(e) => setNewProduct({ ...newProduct, productPrice: e.target.value })}
        required
      />
      <input
        type="text"
        name="productImageUrl"
        placeholder="Image URL"
        value={newProduct.productImageUrl}
        onChange={(e) => setNewProduct({ ...newProduct, productImageUrl: e.target.value })}
        required
      />
      <button type="submit" className="submit-button">
        Update
      </button>
      <button type="button" onClick={() => setShowForm(false)} className="cancel-button">
        Cancel
      </button>
    </form>
  );
};


export default AllProduct;
