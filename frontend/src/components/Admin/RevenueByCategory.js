import React, { useState, useEffect } from 'react';
import BarChart from './BarChart';

export default function RevenueByCategoryChart() {
  const [categories, setCategories] = useState(null);
  let labels = [];
  let counts = [];

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await fetch('/api/admin/stats/revenuepercategory');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        console.log('Fetched data:', data.statistics.rows);
        setCategories(data.statistics.rows);
      } catch (error) {
        console.error('Error fetching places:', error);
      }
    };

    fetchStatistics();
  }, []);

  console.log('categories', categories);

  if (categories) {
    labels = categories.map((category) => category.cat_name);
    counts = categories.map((category) => category.total_amount);
  }

  return (
    <BarChart
      labels={labels}
      counts={counts}
      color={'bg-lime-200'}
      title={'Inventory (By Category)'}
      legend={'Inventory'}
  />
  );
}
