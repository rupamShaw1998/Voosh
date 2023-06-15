import React, { useState } from "react";
import axios from "axios";

const GetOrderDetails = () => {
  const [userId, setUserId] = useState("");
  const [orderDetails, setOrderDetails] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get("url/get-order", {
        params: {
          user_id: userId,
        },
      });

      // Handle success response
      setOrderDetails(response.data);
    } catch (error) {
      // Handle error
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        User ID:
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
      </label>
      <br />
      <button type="submit">Get Order Details</button>

      {orderDetails && (
        <div>
          <h2>Order Details</h2>
          <p>User ID: {orderDetails.user_id}</p>
          <p>Sub Total: {orderDetails.sub_total}</p>
          <p>Phone Number: {orderDetails.phone_number}</p>
        </div>
      )}
    </form>
  );
};

export default GetOrderDetails;
