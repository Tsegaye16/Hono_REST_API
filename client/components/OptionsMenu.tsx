import React from "react";
import { Popover } from "@mantine/core";
import { FaEllipsisV } from "react-icons/fa";

interface OptionsMenuProps {
  isOptionsOpen: boolean;
  setIsOptionsOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  handleAdd: () => void;
  handleUpdate: () => void;
  handleDelete: () => void;
  optionsPopoverRef: React.RefObject<HTMLDivElement | null>;
}

const OptionsMenu: React.FC<OptionsMenuProps> = ({
  isOptionsOpen,
  setIsOptionsOpen,
  handleAdd,
  handleUpdate,
  handleDelete,
  optionsPopoverRef,
}) => {
  return (
    <Popover
      opened={isOptionsOpen}
      onClose={() => setIsOptionsOpen(false)}
      position="bottom-end"
      offset={5}
      withArrow
      shadow="md"
      withinPortal={true}
    >
      <Popover.Target>
        <div
          className="popover-container absolute top-2 right-2 cursor-pointer text-gray-600 hover:text-black"
          onClick={(e) => {
            e.stopPropagation();
            setIsOptionsOpen((prev) => !prev);
          }}
        >
          <FaEllipsisV />
        </div>
      </Popover.Target>
      <Popover.Dropdown
        ref={optionsPopoverRef}
        className="p-2 bg-white shadow-md rounded-md border min-w-[120px] max-w-[150px] absolute top-full right-0 z-40"
      >
        <button
          className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
          onClick={handleAdd}
        >
          Add
        </button>
        <button
          onClick={handleUpdate}
          className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
        >
          Update
        </button>
        <button
          className="block px-3 py-2 text-sm text-red-600 hover:bg-red-100 w-full text-left"
          onClick={handleDelete}
        >
          Delete
        </button>
      </Popover.Dropdown>
    </Popover>
  );
};

export default OptionsMenu;
