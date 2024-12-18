import { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Form } from 'react-bootstrap';
import '../styles/AllUser.css';

const AllUser = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/user/all-users`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        const sanitizedData = data.map((user) => ({
          ...user,
          name: user.name || 'N/A',
          email: user.email || 'N/A',
          phoneNumber: user.phoneNumber || 'N/A',
        }));
        setUsers(sanitizedData);
        setFilteredUsers(sanitizedData);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'An unknown error occurred');
      }
    };
  
    fetchUsers();
  }, []);
  

  // Update filtered users based on the search input
  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    const filtered = users.filter((user) => {
      return (
        (user.name && user.name.toLowerCase().includes(lowerSearch)) ||
        (user.email && user.email.toLowerCase().includes(lowerSearch)) ||
        (user.phoneNumber && user.phoneNumber.toLowerCase().includes(lowerSearch))
      );
    });
    setFilteredUsers(filtered);
  }, [search, users]);
  

  const handleGrantAccess = async (id) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/user/update-admin/${id}`,
        { isAdmin: true },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setUsers(
        users.map((user) =>
          user._id === id ? { ...user, isAdmin: true } : user
        )
      );
    } catch (err) {
      setError(err.message || 'An unknown error occurred');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/user/delete-user/${id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setUsers(
        users.map((user) =>
          user._id === id
            ? { ...user, isDeleted: true, userStatus: 'Deactivated' }
            : user
        )
      );
    } catch (err) {
      setError(err.message || 'An unknown error occurred');
    }
  };

  const handleUngrantAccess = async (id) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/user/update-admin/${id}`,
        { isAdmin: false },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setUsers(
        users.map((user) =>
          user._id === id ? { ...user, isAdmin: false } : user
        )
      );
    } catch (err) {
      setError(err.message || 'An unknown error occurred');
    }
  };

  const handleRestore = async (id) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/user/restore-user/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setUsers(
        users.map((user) =>
          user._id === id
            ? { ...user, isDeleted: false, userStatus: 'Active' }
            : user
        )
      );
    } catch (err) {
      setError(err.message || 'An unknown error occurred');
    }
  };

  return (
    <div className="admin-user-manage-container">
      <div className="admin-user-manage-content">
        <h1>User Management</h1>
        <Form>
          <Form.Group controlId="search">
            <Form.Control
              type="text"
              placeholder="Search by name, email, or phone number"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Form.Group>
        </Form>
        {loading && <p>Loading users...</p>}
        {error && <p className="text-danger">{error}</p>}
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>User Id</th>
              <th>Avatar</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Admin Access</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>
                  <img
                    src={user.imageUrl}
                    alt={`${user.name}'s avatar`}
                    className="user-avatar"
                  />
                </td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phoneNumber}</td>
                <td>{user.isAdmin ? 'Yes' : 'No'}</td>
                <td>{user.userStatus}</td>
                <td>
                  {user.isDeleted ? (
                    <Button
                      variant="warning"
                      onClick={() => handleRestore(user._id)}
                    >
                      Restore
                    </Button>
                  ) : (
                    <>
                      {!user.isAdmin ? (
                        <Button
                          variant="success"
                          onClick={() => handleGrantAccess(user._id)}
                        >
                          Grant Access
                        </Button>
                      ) : (
                        <Button
                          variant="info"
                          onClick={() => handleUngrantAccess(user._id)}
                        >
                          Remove Access
                        </Button>
                      )}
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(user._id)}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center">
                No users match your search.
              </td>
            </tr>
          )}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default AllUser;
