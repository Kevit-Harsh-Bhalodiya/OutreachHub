import { AddToWorkspaceTable } from "@/components/AddToWorkspaceTable";
import { fetchWorkspaces } from "@/redux/slices/workspaceSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../auth/Login";
import type { AppDispatch, RootState } from "@/redux/store";

type UserParams = {
  userId: string;
};
type AddUserToWorkspaceDetails = {
  workspaceId: string;
  userId: string;
  permissions: {
    write: boolean;
    allowAdd: boolean;
  };
};
const AddToWorkspace = () => {
  const { userId } = useParams<UserParams>();
  const { workspaces } = useSelector((state: RootState) => state.workspace);
  const token = useSelector((state: RootState) => state.auth.token);
  const dispatch = useDispatch<AppDispatch>();
  const navigator = useNavigate();
  useEffect(() => {
    dispatch(fetchWorkspaces());
  }, []);
  if (!userId) {
    return <div>User ID is missing</div>;
  }
  if (!workspaces) {
    return <div>Loading...</div>;
  }
  const handleAddUserToWorkspace = async ({
    workspaceId,
    userId,
    permissions,
  }: AddUserToWorkspaceDetails) => {
    const data = {
      workspaceId,
      memberId: userId,
      permissions,
    };
    try {
      console.log("Adding user to workspace with data:", data);
      const response = await axiosInstance.post("/workspace/addMember", data, {
        headers: { authorization: `Bearer ${token}` },
      });
      console.log(response);
      if (response.status === 201) {
        alert("User added to workspace successfully");
      } else {
        alert("Failed to add user to workspace");
        navigator("/admin/user");
      }
    } catch (error) {
      console.error("Failed to add user to workspace", error);
    } finally {
      // Any cleanup or final actions
    }
  };
  return (
    <div>
      <AddToWorkspaceTable
        userId={userId}
        workspaces={workspaces}
        onAddUser={handleAddUserToWorkspace}
      />
    </div>
  );
};

export default AddToWorkspace;
