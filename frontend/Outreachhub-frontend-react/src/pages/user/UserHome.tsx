import CampaignsTable from "@/components/CampaignsTable"
import { UserSectionCards } from "@/components/UserSectionCards"
import { fetchCampaignsByUserId } from "@/redux/slices/campaignSlice"
import { selectSelectedWorkspaceId } from "@/redux/slices/workspaceSlice"
import type { AppDispatch, RootState } from "@/redux/store"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"

type Campaign = {
  id: string;
  name: string;
  tags: string[];
  startDate: string;
  endDate: string;
  status: string;
};
const UserHome = () => {
  const navigator = useNavigate();
  const location = useLocation();
  const currentWorkspaceId = useSelector(selectSelectedWorkspaceId);
  if (!currentWorkspaceId) {
    console.log("No workspace selected, redirecting to /user", currentWorkspaceId);
    navigator("/user",{state:{from:location}})
  }
  const heads = [
    { name: "Name", className: "w-[100px]" },
    { name: "Tags" },
    { name: "Start Date" },
    { name: "End Date" },
  ]
  const { campaigns } = useSelector((state: RootState) => state.campaign)
  const [filteredCampaigns, setFilteredCampaigns] = useState<any>([]);
  const [finalData, setFinalData] = useState<any>([]);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(fetchCampaignsByUserId())
  }, [])
  useEffect(() => {
    setFilteredCampaigns((campaigns.filter((campaign: Campaign) => campaign.status === 'Running')).sort((a: any, b: any) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()).slice(0, 5));
  }, [campaigns])
  useEffect(() => {
    setFinalData(
      filteredCampaigns.map((campaign: any) => {
        return {
          name: campaign.name,
          tags: campaign.tags.map((tag: any, index: any) => (
            <span key={index} className="inline-block bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded mr-1">
              {tag}
            </span>
          )),
          startDate: new Date(campaign.startDate).toLocaleDateString(),
          endDate: new Date(campaign.endDate).toLocaleDateString(),
        }

      })
    )
  }, [filteredCampaigns])
  return (

    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 ">
          <UserSectionCards />
          <div className="px-4 lg:px-6 gap-5 flex flex-col sm:flex-row">
          </div>
          <div className="px-5 lg:px-6 pb-4 md:pb-6">
            <h1 className="pb-4 text-2xl">Recent Campaigns</h1>
            <CampaignsTable title="Recent Campaigns" heads={heads} records={
              finalData
            } />
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserHome
