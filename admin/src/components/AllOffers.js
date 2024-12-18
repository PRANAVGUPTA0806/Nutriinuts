import React, { useState, useEffect } from 'react';
import "../styles/AllOffers.css";

const AllOffers = () => {
  const [offers, setOffers] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [offerToUpdate, setOfferToUpdate] = useState(null);

  // Fetch offers from the backend
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/offers/offers`, {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setOffers(data);
        } else {
          console.error('Error fetching offers:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching offers:', error);
      }
    };
    fetchOffers();
  }, []);

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this offer?');
    if (!isConfirmed) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/offers/offers/${id}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        setOffers(offers.filter((offer) => offer._id !== id));
        alert('Offer deleted successfully');
      } else {
        console.error('Error deleting offer:', response.statusText);
        alert('Failed to delete the offer');
      }
    } catch (error) {
      console.error('Error deleting offer:', error);
      alert('Error occurred while deleting the offer');
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filteredOffers = offers.filter((offer) =>
    offer.discountCode.toLowerCase().includes(search.toLowerCase()) ||
    offer.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="offer1-container">
      <h2>All Offers</h2>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search Offers..."
          value={search}
          onChange={handleSearch}
        />
      </div>
      <button className="create-offer-button" onClick={() => setShowForm(!showForm)}>
        Create Offer
      </button>

      {showForm && (
        <div className="modal1">
          <div className="offer-form">
            {offerToUpdate ? (
              <UpdateOffer
                offerToUpdate={offerToUpdate}
                setOffers={setOffers}
                setShowForm={setShowForm}
                setOfferToUpdate={setOfferToUpdate}
              />
            ) : (
              <CreateOffer setOffers={setOffers} setShowForm={setShowForm} />
            )}
          </div>
        </div>
      )}
      
      <div className='jj2'>
        <table className="offers-table">
          <thead>
            <tr>
              <th>Discount Code</th>
              <th>Description</th>
              <th>Discount (%)</th>
              <th>Valid Till</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOffers.length > 0 ? (
              filteredOffers.map((offer) => (
                <tr key={offer._id}>
                  <td>{offer.discountCode}</td>
                  <td>{offer.description}</td>
                  <td>{offer.dis}%</td>
                  <td>{new Date(offer.validTill).toLocaleDateString()}</td>
                  <td>{new Date(offer.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button className="delete-button" onClick={() => handleDelete(offer._id)}>Delete</button>
                    <button className="update-button" onClick={() => {
                      setOfferToUpdate(offer);
                      setShowForm(true);
                    }}>
                      Update
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No offers found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const UpdateOffer = ({ offerToUpdate, setOffers, setShowForm, setOfferToUpdate }) => {
  const [updatedOffer, setUpdatedOffer] = useState(offerToUpdate);

  const handleUpdateOffer = async (e) => {
    e.preventDefault();

    if (!offerToUpdate) return;

    const confirmUpdate = window.confirm("Are you sure you want to update this offer?");
    if (!confirmUpdate) {
      setOfferToUpdate(null);
      setShowForm(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/offers/offers/${offerToUpdate._id}`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updatedOffer),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setOffers(prevOffers => prevOffers.map(offer => (offer._id === updatedData._id ? updatedData : offer)));
        setShowForm(false);
        setOfferToUpdate(null);
        alert("Offer updated successfully!");
      } else {
        console.error('Error updating offer:', response.statusText);
        alert('Error updating offer.');
      }
    } catch (error) {
      console.error('Error updating offer:', error);
      alert('Error updating offer.');
    }
  };

  useEffect(() => {
    if (offerToUpdate) {
      setUpdatedOffer(offerToUpdate);
    }
  }, [offerToUpdate]);

  return (
    <form onSubmit={handleUpdateOffer}>
      <input
        type="text"
        placeholder="Discount Code"
        value={updatedOffer.discountCode}
        onChange={(e) => setUpdatedOffer({ ...updatedOffer, discountCode: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Description"
        value={updatedOffer.description}
        onChange={(e) => setUpdatedOffer({ ...updatedOffer, description: e.target.value })}
        required
      />
      <input
        type="number"
        placeholder="Discount (%)"
        value={updatedOffer.dis}
        onChange={(e) => setUpdatedOffer({ ...updatedOffer, dis: e.target.value })}
        required
      />
      <input
        type="date"
        placeholder="Valid Till"
        value={updatedOffer.validTill}
        onChange={(e) => setUpdatedOffer({ ...updatedOffer, validTill: e.target.value })}
        required
      />
      <button type="submit" className="submit-button">Update Offer</button>
      <button type="button" onClick={() => {
        setOfferToUpdate(null);
        setShowForm(false);
      }} className="cancel-button">Cancel</button>
    </form>
  );
};

const CreateOffer = ({ setOffers, setShowForm }) => {
  const [newOffer, setNewOffer] = useState({
    discountCode: '',
    description: '',
    dis: '',
    validTill: '',
  });

  const handleCreateOffer = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/offers/offers`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newOffer),
      });

      if (response.ok) {
        const data = await response.json();
        setOffers(prevOffers => [...prevOffers, data]);
        setShowForm(false);
        alert("Offer created successfully!");
      } else {
        console.error('Error creating offer:', response.statusText);
        alert('Error creating offer.');
      }
    } catch (error) {
      console.error('Error creating offer:', error);
      alert('Error creating offer.');
    }
  };

  return (
    <form onSubmit={handleCreateOffer}>
      <input
        type="text"
        placeholder="Discount Code"
        value={newOffer.discountCode}
        onChange={(e) => setNewOffer({ ...newOffer, discountCode: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Description"
        value={newOffer.description}
        onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })}
        required
      />
      <input
        type="number"
        placeholder="Discount (%)"
        value={newOffer.dis}
        onChange={(e) => setNewOffer({ ...newOffer, dis: e.target.value })}
        required
      />
      <input
        type="date"
        placeholder="Valid Till"
        value={newOffer.validTill}
        onChange={(e) => setNewOffer({ ...newOffer, validTill: e.target.value })}
        required
      />
      <button type="submit" className="submit-button">Create Offer</button>
      <button type="button" onClick={() => setShowForm(false)} className="cancel-button">Cancel</button>
    </form>
  );
};

export default AllOffers;
