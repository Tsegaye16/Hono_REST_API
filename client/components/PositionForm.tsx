import React from "react";
import { Popover, TextInput, Textarea, Button } from "@mantine/core";

interface FormValues {
  name: string;
  description: string;
  parentName?: string;
}

interface PositionFormProps {
  isFormOpen: boolean;
  setIsFormOpen: (open: boolean) => void;
  handleFormSubmit: (values: FormValues) => void;
  addFormPopoverRef: React.RefObject<HTMLDivElement | null>;
  title: string;
  initialFormData?: Partial<FormValues>;
}

const PositionForm: React.FC<PositionFormProps> = ({
  isFormOpen,
  setIsFormOpen,
  handleFormSubmit,
  addFormPopoverRef,
  title,
  initialFormData = {},
}) => {
  return (
    <Popover
      opened={isFormOpen}
      onClose={() => setIsFormOpen(false)}
      position="bottom"
      withArrow
      shadow="md"
      withinPortal={false}
      classNames={{
        dropdown: "w-[300px] p-4 rounded-lg shadow-xl",
      }}
    >
      <Popover.Dropdown ref={addFormPopoverRef}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const name = formData.get("name") as string;
            const description = formData.get("description") as string;
            const parentName = formData.get("parentName") as string | undefined;
            handleFormSubmit({ name, description, parentName });
          }}
          className="space-y-4"
        >
          <TextInput
            label="Name"
            name="name"
            required
            placeholder="Enter position name"
            radius="md"
            defaultValue={initialFormData.name}
            classNames={{
              input:
                "w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
              label: "text-sm font-medium text-gray-700 mb-1",
            }}
          />
          <Textarea
            label="Description"
            name="description"
            required
            placeholder="Enter position description"
            radius="md"
            defaultValue={initialFormData.description}
            classNames={{
              input:
                "w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
              label: "text-sm font-medium text-gray-700 mb-1",
            }}
          />
          {title === "Update Position" && (
            <TextInput
              label="Parent Position Name"
              name="parentName"
              placeholder="Enter parent position name"
              radius="md"
              defaultValue={initialFormData.parentName}
              classNames={{
                input:
                  "w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                label: "text-sm font-medium text-gray-700 mb-1",
              }}
            />
          )}
          <div className="flex gap-2">
            <Button
              type="submit"
              color="blue"
              radius="md"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              {title}
            </Button>
            <Button
              type="button"
              color="gray"
              radius="md"
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
              onClick={() => setIsFormOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Popover.Dropdown>
    </Popover>
  );
};

export default PositionForm;
