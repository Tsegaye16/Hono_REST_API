import { createSlice } from "@reduxjs/toolkit";
import {
  getPosition,
  deletePosition,
  addPosition,
  updatePosition,
} from "./action";
import { Position } from "@/types/position";

interface PositionState {
  positions: Position[];
  loading: boolean;
  error: string | null;
}

const initialState: PositionState = {
  positions: [], // Ensure this is an empty array, not null
  loading: false,
  error: null,
};

const positionSlice = createSlice({
  name: "positions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPosition.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPosition.fulfilled, (state, action) => {
        // Ensure the payload is an array
        if (Array.isArray(action.payload)) {
          state.positions = action.payload; // Replace the entire positions array
        } else {
          console.error("Payload is not an array:", action.payload);
        }
        state.loading = false;
        console.log("Positions fetched successfully:", action.payload);
      })
      .addCase(getPosition.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load positions";
        console.error("Error fetching positions:", action.error);
      })
      .addCase(deletePosition.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePosition.fulfilled, (state, action) => {
        const deletedId = action.payload;
        console.log("Position deleted successfully:", deletedId);

        if (!deletedId) {
          console.error("Delete action received an undefined payload!");
          return;
        }

        if (!state.positions || !Array.isArray(state.positions)) {
          console.error("Positions state is invalid or uninitialized.");
          return;
        }

        // Find the deleted position
        const deletedPosition = state.positions.find(
          (pos) => pos.id === deletedId
        );
        console.log("deletedPosition:", deletedPosition);

        if (!deletedPosition) {
          console.error("Deleted position not found in state.");
          return;
        }

        const parentId = deletedPosition.parentid; // Get the correct parentId from the deleted position
        console.log("Parent Id: ", parentId);

        // Update child positions (ensure immutability)
        state.positions = state.positions.map((pos) => {
          if (pos.parentid === deletedId) {
            return {
              ...pos,
              parentid: parentId ? parentId : null, // Correct parentId reference (ensure lowercase 'parentid')
            };
          }
          return pos;
        });

        // Remove the deleted position
        state.positions = state.positions.filter((pos) => pos.id !== deletedId);

        state.loading = false;
      })

      .addCase(deletePosition.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete position";
        console.error("Error deleting position:", action.error);
      })
      .addCase(addPosition.fulfilled, (state, action) => {
        if (Array.isArray(action.payload)) {
          console.warn(
            "Expected an object but received an array:",
            action.payload
          );
          state.positions.push(...action.payload); // Spread the array if payload is an array
        } else if (action.payload && typeof action.payload === "object") {
          state.positions.push(action.payload); // Correctly add a single object
        } else {
          console.error("Invalid payload for addPosition:", action.payload);
        }

        console.log("Position added successfully:", action.payload);
      })

      .addCase(addPosition.rejected, (state, action) => {
        state.error = action.error.message || "Failed to add position";
        console.error("Error adding position:", action.error);
      })
      .addCase(updatePosition.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePosition.fulfilled, (state, action) => {
        const updatedPosition = action.payload;
        console.log("Updated Position in reducer:", updatedPosition);
        if (updatedPosition) {
          state.positions = state.positions.map((position) =>
            position.id === updatedPosition.id
              ? { ...position, ...updatedPosition }
              : position
          );
        }
        state.loading = false;
      })
      .addCase(updatePosition.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update position";
        console.error("Error updating position:", action.error);
      });
  },
});

export default positionSlice.reducer;
