import { WorkspaceDataTable } from "@/components/WorkspaceDataTable"
import { useDispatch, useSelector } from "react-redux"
import { axiosInstance } from "../auth/Login"
import { useEffect, useState } from "react"
import { fetchWorkspaces } from "@/redux/slices/workspaceSlice";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "@/redux/store";

type CountsMap = {
  [key: string]: number;
};
const WorkspaceManagement = () => {
  const { workspaces } = useSelector((state:RootState) => state.workspace)
  const dispatch = useDispatch<AppDispatch>();
  const [data, setData] = useState<any>([]);
  const token = useSelector((state:RootState) => state.auth.token)
  const navigator = useNavigate();
  const calculateCountsByKey = <T extends object>(
    items: T[],
    key: keyof T
  ): CountsMap => {
    return items.reduce((accumulator, currentItem) => {
      const groupKey = String(currentItem[key]);

      if (accumulator[groupKey]) {
        accumulator[groupKey]++;
      } else {
        accumulator[groupKey] = 1;
      }

      return accumulator;
    }, {} as CountsMap);
  };
  useEffect(() => {
    dispatch(fetchWorkspaces());

  }, []);
  useEffect(() => {
    axiosInstance.post(
      "/admin/getAllUsersAccToWorkspace",
      { workspacesId: workspaces.map((workspace) => workspace._id) },
      { headers: { 'Authorization': `Bearer ${token}` } }
    ).then(res => {
      axiosInstance.post(
        "/admin/getAllCampaignsAccToWorkspace",
        { workspacesId: workspaces.map((workspace) => workspace._id) },
        { headers: { 'Authorization': `Bearer ${token}` } }).then(res2 => {

          const temp = calculateCountsByKey(res.data, 'workspaceId')
          const campaigns = calculateCountsByKey(res2.data, 'workspaceId')
          setData(workspaces.map((workspace) => {
            return {
              id: workspace._id,
              name: workspace.name,
              description: workspace.description,
              tags: workspace.tags,
              users: temp[workspace._id] || 0,
              campaigns: campaigns[workspace._id] || 0,
            }
          }))
        })

    })
      .catch(err => console.error(err));
  }, [workspaces])
  const handleDelete = async (workspaceId: string) => {
    const res = await axiosInstance.delete(`/workspace/delete/${workspaceId}`, {headers: { 'Authorization': `Bearer ${token}` }})
    console.log(res.data)
    if (res.status === 200) {
      dispatch(fetchWorkspaces());
    }
    else {
      console.error("Error deleting workspace")
    }
  }
  const handleEdit = async (workspaceId: string)=>{
    navigator(`/admin/editWorkspace/${workspaceId}`);
  }
  return (<>
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 ">
      <div className="px-4 lg:px-6 gap-5 flex flex-col sm:flex-row">
        <WorkspaceDataTable data={data} onDelete={handleDelete} onEdit={handleEdit}/>

      </div>
    </div>
  </>)
}

export default WorkspaceManagement
