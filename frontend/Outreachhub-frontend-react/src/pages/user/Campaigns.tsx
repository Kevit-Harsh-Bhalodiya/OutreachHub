import CampaignsTable from "@/components/CampaignsTable";
import { Button } from "@/components/ui/button";
import { fetchCampaignsByUserId } from "@/redux/slices/campaignSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../auth/Login";
import type { AppDispatch, RootState } from "@/redux/store";
import { selectSelectedWorkspaceId } from "@/redux/slices/workspaceSlice";

type Campaign = {
  _id: string;
  workspaceId: string;
  creator: { _id: string; name: string };
  lastModifiedBy: string;
  templateId: string;
  name: string;
  creationDate: string;
  tags: string[];
  status: "Draft" | "Running" | "Completed";
  startDate: string;
  endDate: string;
  isDeleted?: boolean;
};

const Campaigns = () => {
  const navigator = useNavigate();
  const currentWorkspaceId = useSelector(selectSelectedWorkspaceId);
  useEffect(() => {
    if (!currentWorkspaceId) {
      console.log("No workspace selected, redirecting to /user", currentWorkspaceId);
      navigator("/user")
    }
  }, [currentWorkspaceId])
  const permissions = JSON.parse(localStorage.getItem("permissions") ?? "") || "";
  const heads = [
    { name: "Name", className: "w-[100px]" },
    { name: "Creator" },
    { name: "Status" },
    { name: "Tags" },
    { name: "Start Date" },
    { name: "End Date" },
  ]
  if (permissions.write) {
    heads.push(
      { name: "Actions" }
    )
  }
  const { campaigns } = useSelector((state: RootState) => state.campaign)
  const [finalData, setFinalData] = useState<any>([]);
  const token = useSelector((state: RootState) => state.auth.token);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(fetchCampaignsByUserId())
  }, [])
  const handleEdit = (campaignId: string) => {
    navigator(`/user/campaigns/edit/${campaignId}`);
  }
  const handleDelete = async (campaignId: string) => {
    const response = await axiosInstance.delete(`/campaign/${campaignId}`, { headers: { authorization: `Bearer ${token}` } });
    if (response.status === 200) {
      alert("Campaign deleted successfully");
      dispatch(fetchCampaignsByUserId());
    } else {
      alert("Failed to delete campaign");
    }
  }
  useEffect(() => {
    setFinalData(
      campaigns.map((campaign: Campaign) => {
        if (permissions.write) {
          return {
            name: campaign.name,
            creator: campaign.creator.name,
            status: (
                <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${campaign.status === "Running" ? "bg-green-100 text-green-800" :
                    campaign.status === "Completed" ? "bg-blue-100 text-blue-800" :
                      "bg-gray-100 text-gray-800"
                  }`}>
                  {campaign.status}
                </span>
              ),
            tags: campaign.tags.map((tag: string, index: number) => (
              <span key={index} className="inline-block bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded mr-1">
                {tag}
              </span>
            )),
            startDate: new Date(campaign.startDate).toLocaleDateString(),
            endDate: new Date(campaign.endDate).toLocaleDateString(),
            actions: (
              <div className="space-x-2">
                {campaign.status !== "Running" &&
                <Button variant="destructive" size="sm" onClick={() => handleDelete(campaign._id)}>
                  Delete
                </Button>
                }
                {campaign.status === "Draft" &&
                <Button variant="outline" size="sm" onClick={() => handleEdit(campaign._id)}>
                  Edit
                </Button>
                }
              </div>
            ),
          }
        } else {
          return {
            name: campaign.name,
            creator: campaign.creator.name,
            tags: campaign.tags.map((tag: string, index: number) => (
              <span key={index} className="inline-block bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded mr-1">
                {tag}
              </span>
            )),
            startDate: new Date(campaign.startDate).toLocaleDateString(),
            endDate: new Date(campaign.endDate).toLocaleDateString(),
          }
        }

      })
    )
  }, [campaigns])
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 ">
          <div className="px-4 lg:px-6 gap-5 flex flex-col sm:flex-row">
            <h2 className="text-2xl font-semibold tracking-tight">Campaigns</h2>
            {permissions.write && (
              <Button className="ml-auto" onClick={() => navigator('/user/campaigns/create')}>
                Create Campaign
              </Button>
            )}
          </div>
          <div className="px-5 lg:px-6 pb-4 md:pb-6">
            <h1 className="pb-4 text-2xl">All Campaigns</h1>
            <CampaignsTable title="All Campaigns" heads={heads} records={
              finalData
            } />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Campaigns
