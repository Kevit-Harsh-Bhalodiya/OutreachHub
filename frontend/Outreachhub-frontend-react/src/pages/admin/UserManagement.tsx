import { DataTable } from "@/components/data-table";
import { fetchContact } from "@/redux/slices/contactSlice";
import { fetchUser } from "@/redux/slices/userSlice";
import { fetchWorkspaceUser } from "@/redux/slices/workspaceUserSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const UserManagement = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const { contacts } = useSelector((state: RootState) => state.contact);
  const { workspaceUser } = useSelector(
    (state: RootState) => state.workspaceUser,
  );
  const [temp, setTemp] = useState();
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(fetchUser());
    dispatch(fetchContact());
    dispatch(fetchWorkspaceUser());
  }, []);
  useEffect(() => {
    setTemp(workspaceUser);
    console.log(workspaceUser);
  }, [workspaceUser]);
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 ">
      <div className="px-4 lg:px-6 gap-5 flex flex-col sm:flex-row">
        <DataTable users={user} contacts={contacts} workspaceUser={workspaceUser} />
      </div>
    </div>
  );
};

export default UserManagement;
