import { DataTable } from "@/components/data-table"
import { fetchContact } from "@/redux/slices/contactSlice"
import { fetchUser } from "@/redux/slices/userSlice"
import type { AppDispatch, RootState } from "@/redux/store"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

const UserManagement = () => {
  const { user } = useSelector((state:RootState) => state.user)
  const { contacts } = useSelector((state:RootState) => state.contact)
  const dispatch = useDispatch<AppDispatch>();
  useEffect(()=>{
    dispatch(fetchUser());
    dispatch(fetchContact());
  },[])
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 ">
      <div className="px-4 lg:px-6 gap-5 flex flex-col sm:flex-row">
        <DataTable users={user} contacts={contacts} />
      </div>
    </div>
  )
}

export default UserManagement
