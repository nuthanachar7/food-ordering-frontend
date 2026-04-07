import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost:8082/api/fooditems';

function App() {
  // Stores all food items from database
  const [foodItems, setFoodItems] = useState([]);

  // Stores what user types in the form
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: ''
  });

  // Stores which item is being edited
  // null means we are adding new item
  const [editingId, setEditingId] = useState(null);

  // When page loads — fetch all food items
  useEffect(() => {
    fetchFoodItems();
  }, []);

  // Get all food items from Spring Boot
  const fetchFoodItems = () => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setFoodItems(data))
      .catch(err => console.log('Error:', err));
  };

  // When user types in form — update formData
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // When user clicks Submit button
  const handleSubmit = () => {

    // Check all fields are filled
    if(!formData.name || !formData.price || 
       !formData.description || !formData.category) {
      alert('Please fill all fields!');
      return;
    }

    if(editingId) {
      // If editing — call PUT API
      fetch(`${API_URL}/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      .then(res => res.json())
      .then(() => {
        fetchFoodItems();
        resetForm();
      });
    } else {
      // If adding new — call POST API
      fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      .then(res => res.json())
      .then(() => {
        fetchFoodItems();
        resetForm();
      });
    }
  };

  // When user clicks Edit button
  const handleEdit = (item) => {
    // Fill form with item data
    setFormData({
      name: item.name,
      price: item.price,
      description: item.description,
      category: item.category
    });
    // Remember which item we are editing
    setEditingId(item.id);
  };

  // When user clicks Delete button
  const handleDelete = (id) => {
    // Ask user to confirm before deleting!
    if(window.confirm('Delete this food item?')) {
      fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      })
      .then(() => fetchFoodItems());
    }
  };

  // Clear the form after submit
  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      description: '',
      category: ''
    });
    setEditingId(null);
  };

  return (
    <div className="App">

      {/* Header */}
      <h1>🍕 Food Ordering App</h1>

      {/* Add / Edit Form */}
      <div className="form-container">
        <h2>{editingId ? '✏️ Edit Food Item' : '➕ Add Food Item'}</h2>

        <input
          type="text"
          name="name"
          placeholder="Food Name"
          value={formData.name}
          onChange={handleChange}
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
        />

        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
        />

        <button 
          className="btn-submit" 
          onClick={handleSubmit}>
          {editingId ? 'Update Item' : 'Add Item'}
        </button>

        {editingId && (
          <button 
            className="btn-cancel" 
            onClick={resetForm}>
            Cancel
          </button>
        )}
      </div>

      {/* Food Items Table */}
      <div className="table-container">
        <h2>📋 Our Menu ({foodItems.length} items)</h2>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Description</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {foodItems.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>₹{item.price}</td>
                <td>{item.description}</td>
                <td>{item.category}</td>
                <td>
                  <button
                    className="btn-edit"
                    onClick={() => handleEdit(item)}>
                    ✏️ Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(item.id)}>
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {foodItems.length === 0 && (
          <p>No food items yet! Add one above!</p>
        )}
      </div>

    </div>
  );
}

export default App;