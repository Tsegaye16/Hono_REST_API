import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { getPosition, addPosition } from "@/redux/action";
import { Loader, Button } from "@mantine/core";
import PositionTree from "@/components/PositionTree";
import PositionForm from "@/components/PositionForm";
import { buildHierarchy } from "@/utils/buildHierarchy";

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { positions, loading, error } = useSelector(
    (state: RootState) => state.position
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const addFormPopoverRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    dispatch(getPosition());
  }, [dispatch]);

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  const handleFormSubmit = (values: { name: string; description: string }) => {
    const data = {
      name: values.name,
      description: values.description,
      parentid: null,
    };
    dispatch(addPosition(data));
    setIsFormOpen(false);
  };

  const hierarchy = buildHierarchy(positions);

  return (
    <div className="p-5 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Employee Hierarchy</h1>
      {positions.length === 0 ? (
        <div>
          <Button
            onClick={() => setIsFormOpen(true)}
            color="blue"
            radius="md"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Add New Position
          </Button>
          <PositionForm
            isFormOpen={isFormOpen}
            setIsFormOpen={setIsFormOpen}
            handleFormSubmit={handleFormSubmit}
            addFormPopoverRef={addFormPopoverRef}
            title="Add Position"
          />
        </div>
      ) : (
        <PositionTree positions={hierarchy} />
      )}
    </div>
  );
}
