import React, { useState } from "react";
import { Switch } from "@material-tailwind/react";
import { changeBranchStatus } from "../../services/branchService";
import { toast } from "react-toastify";

const ChangeBranchStatusButton = ({ branch, isActive: initialStatus }) => {
  const [isActive, setIsActive] = useState(initialStatus);
  const handleToggle = async () => {
    try {
      console.log(branch);
      console.log(branch.id);

      const response = await changeBranchStatus(branch.id);
      console.log(response);

      if (response.status === 200) {
        setIsActive((prev) => !prev); // Toggle the local state
        toast.success("Thay đổi trạng thái thành công!");
      } else {
        toast.error("Thay đổi trạng thái thất bại!");
      }
    } catch (error) {
      console.error("Error changing status:", error);
      toast.error("Lỗi xảy ra khi thay đổi trạng thái.");
    }
  };

  return (
    // <Button
    //   size="sm"
    //   className={isActive ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}
    //   onClick={handleClick}
    // >
    //   {isActive ? "Hoạt động" : "Vô hiệu hóa"}
    // </Button>
    <div className="flex items-center gap-4">
      <Switch
        className={isActive ? "bg-green-500" : "bg-red-500"} // Conditional class
        checked={isActive}
        onChange={handleToggle}
      />
    </div>
  );
};

export default ChangeBranchStatusButton;
