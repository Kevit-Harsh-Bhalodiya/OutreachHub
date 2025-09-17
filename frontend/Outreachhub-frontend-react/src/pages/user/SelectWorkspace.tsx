import { SelectWorkspaceTable } from "@/components/SelectWorkspace";
import { getWorkspacesByUserId } from "@/redux/slices/adminSlice";
import { selectUserId } from "@/redux/slices/userSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { axiosInstance } from "../auth/Login";
import type { AppDispatch, RootState } from "@/redux/store";
import { useLocation, useNavigate } from "react-router-dom";
import { setSelectedWorkspaceId } from "@/redux/slices/workspaceSlice";

const SelectWorkspace = () => {
  const userId = useSelector(selectUserId);
  const { workspacesByUserId, loading } = useSelector((state:RootState) => state.admin);
  const [formattedWorkspaces, setFormattedWorkspaces] = useState<any>([]);
  const token = useSelector<RootState, string | null>(
    (state: any) => state.auth.token,
  );
  const navigator = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (userId) {
      dispatch(getWorkspacesByUserId(userId));
    }
  }, [dispatch]);
  useEffect(() => {
    setFormattedWorkspaces(
      Array.isArray(workspacesByUserId)
        ? workspacesByUserId.map((item) => ({
            _id: item.workspaceId._id,
            name: item.workspaceId.name,
            description: item.workspaceId.description,
            tags: item.workspaceId.tags,
          }))
        : [],
    );
  }, [workspacesByUserId]);
  if (loading) {
    return <div>Loading...</div>;
  }

  const handleSelectWorkspace = (workspaceId: string): void => {
    console.log(workspaceId)
    try {
      const selectWorkspace = async () => {
        const response = await axiosInstance.post(
          "/workspace/setCurrentWorkspace",
          {workspaceId},
          { headers: { Authorization: `Bearer ${token}` } },
        );
        return response.data;
      };
      dispatch(setSelectedWorkspaceId(workspaceId));
      selectWorkspace();

      alert("Workspace selected successfully!");
      navigator("/user/dashboard",{state:{from:location}});
    } catch (error) {
      console.error("Error selecting workspace:", error);
      alert("Failed to select workspace. Please try again.");
    }
  };
  return (
    <>
      <div className="p-4">
        <SelectWorkspaceTable
          workspaces={formattedWorkspaces}
          onSelectWorkspace={handleSelectWorkspace}
        />
      </div>
    </>
  );
};

export default SelectWorkspace;
