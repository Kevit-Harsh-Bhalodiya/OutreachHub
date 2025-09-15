import { RemoveFromWorkspaceTable } from "@/components/RemoveFromWorkspaceTable";
import {
  getWorkspacesByUserId,
  selectAdminLoading,
  selectWorkspacesByUserId,
} from "@/redux/slices/adminSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../auth/Login";
import type { AppDispatch, RootState } from "@/redux/store";

type UserParams = {
  userId: string;
};
const RemoveFromWorkspace = () => {
  const { userId } = useParams<UserParams>();
  const token = useSelector((state: RootState) => state.auth.token);
  if (!userId) {
    return <div>User ID is missing</div>;
  }
  const  workspacesByUserId  = useSelector<any>(selectWorkspacesByUserId);
  const loading = useSelector<any>(selectAdminLoading);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(getWorkspacesByUserId(userId));
  }, [dispatch, userId]);
  const formattedWorkspaces = Array.isArray(workspacesByUserId)
    ? workspacesByUserId.map((item) => ({
        _id: item.workspaceId._id,
        name: item.workspaceId.name,
        description: item.workspaceId.description,
        tags: item.workspaceId.tags,
      }))
    : []; // Default to an empty array if data is not ready

  const handleRemoveUser = async (data: any) => {
    try {
      const response = await axiosInstance.delete(
        `/workspace/deleteMember/${data.workspaceId}/${data.userId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (response.status === 200) {
        alert("User removed from workspace successfully.");
      } else {
        alert("Failed to remove user from workspace. Please try again.");
      }
      dispatch(getWorkspacesByUserId(userId));
    } catch (error) {
      console.error("Error removing user from workspace:", error);
    }
  };

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="space-x-2 p-4">
          <RemoveFromWorkspaceTable
            userId={userId}
            workspaces={formattedWorkspaces}
            onRemoveUser={handleRemoveUser}
          />
        </div>
      )}
    </>
  );
};

export default RemoveFromWorkspace;
