import React, { useState } from "react";
import axios from "axios";

const AddOrderForm = () => {
  const [userId, setUserId] = useState("");
  const [subTotal, setSubTotal] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("url/add-order", {
        user_id: userId,
        sub_total: subTotal,
        phone_number: phoneNumber,
      });
      
      // Handle success response
      console.log(response.data);
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
      <label>
        Sub Total:
        <input
          type="text"
          value={subTotal}
          onChange={(e) => setSubTotal(e.target.value)}
        />
      </label>
      <br />
      <label>
        Phone Number:
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </label>
      <br />
      <button type="submit">Add Order</button>
    </form>
  );
};

export default AddOrderForm;
