import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "./api";
import { formData } from "@/types/position";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const getPosition = createAsyncThunk(
  "GET_ALL_POSITION",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getAllPosition();
      return response.data;
    } catch (error) {
      const errorMessage =
        (error as ApiError).response?.data?.message || "Something went wrong";
      return rejectWithValue(errorMessage);
    }
  }
);

export const deletePosition = createAsyncThunk(
  "DELETE_POSITION",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await api.deletePosition(id);
      return response; // Return the deleted ID
    } catch (error) {
      const errorMessage =
        (error as ApiError).response?.data?.message || "Something went wrong";
      return rejectWithValue(errorMessage);
    }
  }
);

export const addPosition = createAsyncThunk(
  "ADD_POSITION",
  async (data: formData, { rejectWithValue }) => {
    try {
      const response = await api.addPosition(data);
      return response.data;
    } catch (error) {
      const errorMessage =
        (error as ApiError).response?.data?.message || "Something went wrong";
      return rejectWithValue(errorMessage);
    }
  }
);

export const updatePosition = createAsyncThunk(
  "UPDATE_POSITION",
  async (
    {
      id,
      data,
    }: {
      id: number;
      data: { name: string; description: string };
    },
    { rejectWithValue }
  ) => {
    // Destructure id and data
    try {
      const response = await api.updatePosition(id, data);
      console.log("Response from api.updatePosition:", response); // Check this log
      return response[0]; // Access the first element of the returned array
    } catch (error) {
      const errorMessage =
        (error as ApiError).response?.data?.message || "Something went wrong";
      return rejectWithValue(errorMessage);
    }
  }
);
