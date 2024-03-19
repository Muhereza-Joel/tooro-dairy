import React, { useState, useEffect } from 'react';
import { BarChart, YAxis, Bars } from '@rsuite/charts';
import moment from 'moment';

const SalesGraph = () => {
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Calculate start and end of the current month using Moment.js
        const startDate = moment().startOf('month').format('YYYY-MM-DD');
        const endDate = moment().endOf('month').format('YYYY-MM-DD');

        // Fetch sales data for the current month
        const response = await fetch(`http://localhost:3002/tdmis/api/v1/sales/reports/custom?startDate=${startDate}&endDate=${endDate}`);
        const data = await response.json();
        setSalesData(data);
      } catch (error) {
        console.error('Error fetching sales data:', error);
      }
    };

    fetchData();
  }, []);

  const transformSalesData = () => {
    const formattedData = salesData.map((sale) => [
      moment(sale.created_at).format('YYYY-MM-DD HH:mm'), // Format time using Moment.js
      sale.total,
    ]);

    return formattedData;
  };

  return (
    <BarChart data={transformSalesData()}>
      <YAxis name="Sales" />
      <Bars name="Amount Payed" />
    </BarChart>
  );
};

export default SalesGraph;
