import axios from "axios";
import { formData } from "@/types/position";

const API = axios.create({
  baseURL: "http://localhost:4000/",
});

export const getAllPosition = async () => {
  try {
    const response = await API.get("/positions");
    return response;
  } catch (error) {
    console.error("Error fetching positions:", error);
    throw error;
  }
};

export const deletePosition = async (id: number) => {
  try {
    const response = await API.delete(`/positions/${id}`);
    console.log("DuD Response", response);
    return response.data.id;
  } catch (error) {
    console.error("Error deleting position:", error);
    throw error;
  }
};

export const addPosition = async (data: formData) => {
  try {
    const response = await API.post("/positions", data);

    return response;
  } catch (error) {
    console.error("Error adding position:", error);
    throw error;
  }
};

export const updatePosition = async (
  id: number,
  data: { name?: string; description?: string; parentid?: string }
) => {
  try {
    const response = await API.put(`/positions/${id}`, data); // Your existing PUT request
    console.log("Response data:", response.data); // Check what's logged here
    return response.data; // Return the data from the response
  } catch (error) {
    console.error("Error updating position:", error);
    throw error;
  }
};
