import React, { useState, useEffect } from "react";
import axios from "axios";
import "../index.css"

const FinancialDataTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to format large numbers with commas and currency symbol
  const formatCurrency = (number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(number);
  };

  // Filter and sort states
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    minRevenue: "",
    maxRevenue: "",
    sortBy: "Date",
    descending: false,
  });

  const [tempFilters, setTempFilters] = useState({ ...filters });

  // Fetch data from the backend API with filters and sorting
  const fetchData = () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();

    // Append filters only if they are provided
    if (tempFilters.startDate) params.append("start_date", tempFilters.startDate);
    if (tempFilters.endDate) params.append("end_date", tempFilters.endDate);
    if (tempFilters.minRevenue) params.append("min_revenue", tempFilters.minRevenue);
    if (tempFilters.maxRevenue) params.append("max_revenue", tempFilters.maxRevenue);
    if (tempFilters.sortBy) params.append("sort_by", tempFilters.sortBy);
    params.append("descending", tempFilters.descending);

    axios
      .get(`https://financial-data-filtering-app-backend.onrender.com/fetch_data?${params.toString()}`)
      .then((response) => {
        if (response.data && response.data.length > 0) {
          setData(response.data);
        } else {
          setData([]);
          setError("No data available for the given filters.");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch data");
        setLoading(false);
      });
  };

  // Fetch data on initial load
  useEffect(() => {
    fetchData();
  }, []); // Only fetch once on initial load

  const applyFilters = () => {
    setFilters({ ...tempFilters }); // Update filters when Apply Filters button is clicked
    fetchData(); // Fetch data based on the selected filters
  };

  // If data is still loading
  if (loading) return <div>Loading...</div>;

  // If there's an error fetching data
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <h2 className="text-lg font-bold">Filters</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Start Date</label>
            <input
              type="date"
              value={tempFilters.startDate}
              onChange={(e) =>
                setTempFilters({ ...tempFilters, startDate: e.target.value })
              }
              className="border px-2 py-1 w-full"
            />
          </div>
          <div>
            <label className="block font-medium">End Date</label>
            <input
              type="date"
              value={tempFilters.endDate}
              onChange={(e) =>
                setTempFilters({ ...tempFilters, endDate: e.target.value })
              }
              className="border px-2 py-1 w-full"
            />
          </div>
          <div>
            <label className="block font-medium">Min Revenue</label>
            <input
              type="number"
              value={tempFilters.minRevenue}
              onChange={(e) =>
                setTempFilters({ ...tempFilters, minRevenue: e.target.value })
              }
              className="border px-2 py-1 w-full"
            />
          </div>
          <div>
            <label className="block font-medium">Max Revenue</label>
            <input
              type="number"
              value={tempFilters.maxRevenue}
              onChange={(e) =>
                setTempFilters({ ...tempFilters, maxRevenue: e.target.value })
              }
              className="border px-2 py-1 w-full"
            />
          </div>
          <div>
            <label className="block font-medium">Sort By</label>
            <select
              value={tempFilters.sortBy}
              onChange={(e) =>
                setTempFilters({ ...tempFilters, sortBy: e.target.value })
              }
              className="border px-2 py-1 w-full"
            >
              <option value="Date">Date</option>
              <option value="Revenue">Revenue</option>
              <option value="Net Income">Net Income</option>
            </select>
          </div>
          <div>
            <label className="block font-medium">Order</label>
            <select
              value={tempFilters.descending}
              onChange={(e) =>
                setTempFilters({
                  ...tempFilters,
                  descending: e.target.value === "true",
                })
              }
              className="border px-2 py-1 w-full"
            >
              <option value="false">Ascending</option>
              <option value="true">Descending</option>
            </select>
          </div>
        </div>
        <button
          onClick={applyFilters}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Apply Filters
        </button>
      </div>
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr>
            {Object.keys(data[0] || {}).map((key, index) => (
              <th key={index} className="border px-4 py-2">
                {key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="6" className="border px-4 py-2 text-center">
                No data available
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{item.Date}</td>
                <td className="border px-4 py-2">{formatCurrency(item.Revenue)}</td>
                <td className="border px-4 py-2">{formatCurrency(item["Net Income"])}</td>
                <td className="border px-4 py-2">{formatCurrency(item["Gross Profit"])}</td>
                <td className="border px-4 py-2">{item["Earnings Per Share (EPS)"]}</td>
                <td className="border px-4 py-2">{formatCurrency(item["Operating Income"])}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FinancialDataTable;
