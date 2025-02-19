import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { deletePosition, updatePosition, addPosition } from "@/redux/action";

import { Position } from "@/types/position";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import OptionsMenu from "./OptionsMenu";
import PositionForm from "./PositionForm";

interface CollapsibleNodeProps {
  position: Position;
}

const CollapsibleNode: React.FC<CollapsibleNodeProps> = ({ position }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false);
  const [initialFormData, setInitialFormData] = useState({});

  const dispatch = useDispatch<AppDispatch>();
  const optionsPopoverRef = useRef<HTMLDivElement>(null);
  const addFormPopoverRef = useRef<HTMLDivElement>(null);
  const updateFormPopoverRef = useRef<HTMLDivElement>(null);
  const toggleExpand = () => setIsExpanded(!isExpanded);

  const handleDelete = async () => {
    await dispatch(deletePosition(position.id));
  };

  const handleAdd = () => {
    setIsOptionsOpen(false);
    setIsFormOpen(true);
  };

  const handleUpdate = () => {
    setIsOptionsOpen(false);
    setIsUpdateFormOpen(true);
    setInitialFormData({
      name: position.name,
      description: position.description,
      parentName: getParentName(position),
    });
  };

  const getParentName = (pos: Position) => {
    const parent = positions.find((p) => p.id === pos.parentid);
    return parent?.name || "";
  };

  const handleUpdateFormSubmit = (values: {
    name: string;
    description: string;
    parentName?: string; // Make it optional
  }) => {
    const parent = positions.find((p) => p.name === values.parentName);
    const parentId = parent ? parent.id : null;

    const data = {
      name: values.name,
      description: values.description,
      parentid: parentId,
    };

    dispatch(updatePosition({ id: position.id, data }))
      .unwrap()
      .then(() => setIsUpdateFormOpen(false));
  };

  const handleFormSubmit = (values: { name: string; description: string }) => {
    const data = {
      name: values.name,
      description: values.description,
      parentid: position.id,
    };
    dispatch(addPosition(data))
      .unwrap()
      .then(() => setIsFormOpen(false));
  };

  const { positions } = useSelector((state: RootState) => state.position);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        optionsPopoverRef.current &&
        !optionsPopoverRef.current.contains(event.target as Node)
      ) {
        setIsOptionsOpen(false);
      }
      if (
        addFormPopoverRef.current &&
        !addFormPopoverRef.current.contains(event.target as Node)
      ) {
        setIsFormOpen(false);
      }
      if (
        updateFormPopoverRef.current &&
        !updateFormPopoverRef.current.contains(event.target as Node)
      ) {
        setIsUpdateFormOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [optionsPopoverRef, addFormPopoverRef, updateFormPopoverRef]);

  return (
    <div className="flex flex-col items-center relative">
      <div className="bg-gray-300 px-6 py-4 rounded-md font-bold text-sm relative z-0 transition-colors flex flex-col items-center w-40">
        <OptionsMenu
          isOptionsOpen={isOptionsOpen}
          setIsOptionsOpen={setIsOptionsOpen}
          handleAdd={handleAdd}
          handleUpdate={handleUpdate}
          handleDelete={handleDelete}
          optionsPopoverRef={optionsPopoverRef}
        />
        <span className="text-center">{position.name}</span>
        {position.children && position.children.length > 0 && (
          <span
            className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 bg-gray-300 p-1 rounded-full cursor-pointer"
            onClick={toggleExpand}
          >
            {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
          </span>
        )}
      </div>
      {/* Connector line to children */}
      {position.children && position.children.length > 0 && isExpanded && (
        <div className="flex justify-center items-start mt-3">
          <div className="w-0.5 bg-gray-400 h-6 sm:h-8 z-10"></div>
        </div>
      )}
      {/* Render children if expanded */}
      {position.children && position.children.length > 0 && isExpanded && (
        <div className="flex items-start justify-center mt-2 relative">
          {/* Horizontal line to devide the level of the position */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gray-400 z-0"></div>
          {position.children?.map((child) => (
            <div
              key={child.id}
              className="flex flex-col items-center mx-2 sm:mx-4 z-0"
            >
              {/* Horizontal lebel holder */}
              <div className="w-0.5 bg-gray-400 h-6 sm:h-8 z-0"></div>
              <CollapsibleNode position={child} />
            </div>
          ))}
        </div>
      )}
      <PositionForm
        isFormOpen={isFormOpen}
        setIsFormOpen={setIsFormOpen}
        handleFormSubmit={handleFormSubmit}
        addFormPopoverRef={addFormPopoverRef}
        title="Add Position"
      />
      <PositionForm
        isFormOpen={isUpdateFormOpen}
        setIsFormOpen={setIsUpdateFormOpen}
        handleFormSubmit={handleUpdateFormSubmit}
        addFormPopoverRef={updateFormPopoverRef}
        title="Update Position"
        initialFormData={initialFormData}
      />
    </div>
  );
};

export default CollapsibleNode;
