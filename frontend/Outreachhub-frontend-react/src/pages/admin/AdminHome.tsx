import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { ChartRadarDefault } from "@/components/RadarChart"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"

const AdminHome = () => {
  const { user } = useSelector((state:RootState) => state.user)
  const { contacts } = useSelector((state:RootState) => state.contact)
  return (

    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 ">
          <SectionCards />
          <div className="px-4 lg:px-6 gap-5 flex flex-col sm:flex-row">
            <ChartAreaInteractive />
            <ChartRadarDefault />
          </div>
          <div className="px-5 lg:px-6 pb-4 md:pb-6">
            <DataTable users={user} contacts={contacts} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminHome


