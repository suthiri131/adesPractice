import React, { useState, useEffect } from 'react';
import "./css/pref.css";
const ChoosePref = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/getAllCat');
        const data = await response.json();

        if (data.success && data.categories && Array.isArray(data.categories.rows)) {
          setCategories(data.categories.rows);
        } else {
          console.error('Invalid or missing categories data in the API response.');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  

  const storedCategories = localStorage.getItem('selectedCategories');
  if (storedCategories) {
    setSelectedCategories(JSON.parse(storedCategories));
  }
}, []);

  const handleCategoryClick = (categoryId) => {
    // Check if the category is already selected
    const isSelected = selectedCategories.includes(categoryId);

    // Toggle the selected state (allow only up to two selections)
    if (isSelected) {
      setSelectedCategories((prevSelected) =>
        prevSelected.filter((selectedId) => selectedId !== categoryId)
      );
    } else if (selectedCategories.length < 2) {
      setSelectedCategories((prevSelected) => [...prevSelected, categoryId]);
    }
  };

  const handleSaveClick = async () => {
    try {
        const userId=localStorage.getItem('userId');
      const response = await fetch(`/api/updatePreferences/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ preferences: selectedCategories }),
      });

      if (response.ok) {
        localStorage.setItem('selectedCategories', JSON.stringify(selectedCategories));
        console.log('Preferences updated successfully');
        alert('Preferences updated');

      } else {
        console.error('Failed to update preferences');
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  };

  return (
    <div>
      <h2>Choose Preferences</h2>
      <div className="category-pills">
        {categories.map((category) => (
          <div
            key={category.cat_id}
            className={`category-pill ${selectedCategories.includes(category.cat_id) ? 'selected' : ''}`}
            onClick={() => handleCategoryClick(category.cat_id)}
          >
            {category.cat_name}
          </div>
        ))}
      </div>
      <button onClick={handleSaveClick}>Save</button>
    </div>
  );
};

export default ChoosePref;
