import { useEffect } from "react";
import { createBrowserRouter, RouterProvider} from "react-router-dom";
import Home from "./layout/Home";
import Login from "./pages/auth/Login";
import Hero from "./components/Hero";
import { useSelector } from "react-redux";
import type { RootState } from "./redux/store";
import User from "./layout/User";
import UserHome from "./pages/user/UserHome";
import Admin from "./layout/Admin";
import AdminHome from "./pages/admin/AdminHome";
import { selectTheme } from "./redux/slices/ThemeSwitcher";
import WorkspaceManagement from "./pages/admin/WorkspaceManagement";
import UserManagement from "./pages/admin/UserManagement";
import CreateWorkspace from "./pages/admin/CreateWorkspace";
import RequireAuth from "./pages/auth/RequireAuth";
import RequireAdmin from "./pages/auth/RequireAdmin";
import CreateUser from "./pages/admin/CreateUser";
import AddToWorkspace from "./pages/admin/AddToWorkspace";
import RemoveFromWorkspace from "./pages/admin/RemoveFromWorkspace";
import SelectWorkspace from "./pages/user/SelectWorkspace";
import Campaigns from "./pages/user/Campaigns";
import Contacts from "./pages/user/Contacts";
import MessageTemplate from "./pages/user/MessageTemplate";
import CreateCampaign from "./pages/user/CreateCampaign";
import CreateContact from "./pages/user/CreateContact";
import CreateMessageTemplate from "./pages/user/CreateMessageTemplate";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [{ index: true, element: <Hero /> }],
  },
  { path: "/login", element: <Login /> },

  {
    element: <RequireAuth />, // must be logged in
    children: [
      {
        path: "/user",
        element: <User />,
        children: [
          { index: true, element: <SelectWorkspace/> },
          {path:"dashboard",element:<UserHome/>},
          {path:"campaigns",element:<Campaigns/>},
          {path:"campaigns/create",element:<CreateCampaign/>},
          {path:"campaigns/edit/:campaignId",element:<CreateCampaign/>},
          {path:"contacts",element:<Contacts/>},
          {path:"contacts/create",element:<CreateContact/>},
          {path:"contacts/edit/:contactId",element:<CreateContact/>},
          {path:"message-templates",element:<MessageTemplate/>},
          {path:"message-template/create",element:<CreateMessageTemplate/>},
          {path:"message-template/edit/:templateId",element:<CreateMessageTemplate/>}

        ],
      },
      {
        element: <RequireAdmin />, // must be admin
        children: [
          {
            path: "/admin",
            element: <Admin />,
            children: [
              { index: true, element: <AdminHome /> },
              { path: "workspaces", element: <WorkspaceManagement /> },
              { path: "user", element: <UserManagement /> },
              { path: "createWorkspace", element: <CreateWorkspace /> },
              { path: "editWorkspace/:workspaceId", element: <CreateWorkspace /> },
              { path: "createUser", element: <CreateUser/> },
              { path: "editUser/:userId", element: <CreateUser /> },
              { path: "addUserToWorkspace/:userId", element: <AddToWorkspace/> },
              { path: "removeUserFromWorkspace/:userId", element: <RemoveFromWorkspace/> },
            ],
          },
        ],
      },
    ],
  },
]);


function App() {
  const currentTheme = useSelector<RootState,"light"|"dark">(selectTheme)
  useEffect(()=>{
    const root = document.documentElement;
    root.classList.remove('light','dark');
    root.classList.add(currentTheme);
  },[currentTheme])
  return (
  <><RouterProvider router={router}/></>
  )
}

export default App;
