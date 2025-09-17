import { ContactCard } from "@/components/ContactCard";
import { fetchContactByUserId } from "@/redux/slices/contactSlice";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosInstance } from "../auth/Login";
import type { AppDispatch, RootState } from "@/redux/store";
import { selectSelectedWorkspaceId } from "@/redux/slices/workspaceSlice";

const Contacts = () => {
  const token = useSelector((state:RootState) => state.auth.token);
  const permissions = JSON.parse(localStorage.getItem("permissions")??"") || "";
  const currentWorkspaceId =  useSelector(selectSelectedWorkspaceId);
  const { contacts } = useSelector((state:RootState) => state.contact);
  const dispatch = useDispatch<AppDispatch>();
  const navigator = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterBy, setFilterBy] = useState<string>("name"); // Default filter
  useEffect(()=>{
    if(!currentWorkspaceId){
      console.log("No workspace selected, redirecting to /user",currentWorkspaceId);
      navigator("/user",{state:{from:location}})
    }
  },[currentWorkspaceId])
  const handleDelete = async (contactId:string) => {
    console.log("Deleting contact with ID:", contactId);
    const response = await axiosInstance.delete(`/contact/${contactId}`,{headers:{Authorization:`Bearer ${token}`}})

    if(response.status===200){
      dispatch(fetchContactByUserId());
      alert("Contact deleted successfully.");
    }else{
      alert("Failed to delete contact. Please try again.");
    }

  }

  useEffect(() => {
    dispatch(fetchContactByUserId());
  }, [dispatch]); 

  const filteredContacts = useMemo(() => {
    if (!searchQuery) {
      return contacts;
    }

    const lowercasedQuery = searchQuery.toLowerCase();

    return contacts.filter((contact) => {
      switch (filterBy) {
        case "name":
          return contact.name.toLowerCase().includes(lowercasedQuery);
        case "company":
          return contact.company.toLowerCase().includes(lowercasedQuery);
        case "jobTitle":
          return contact.jobTitle.toLowerCase().includes(lowercasedQuery);
        case "tags":
          return contact.tags.some((tag:string) =>
            tag.toLowerCase().includes(lowercasedQuery)
          );
        default:
          return false;
      }
    });
  }, [contacts, searchQuery, filterBy]); 

  return (
    <div className="container mx-auto py-4 px-5">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search contacts..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Search by:</span>
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select a field" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="company">Company</SelectItem>
                <SelectItem value="jobTitle">Job Title</SelectItem>
                <SelectItem value="tags">Tags</SelectItem>
              </SelectContent>
            </Select>
          </div>
            {permissions.write && (
              <Button className="ml-auto" onClick={() =>navigator( '/user/contacts/create',{state:{from:location}})}>
                Create Contact
              </Button>
            )}
        </div>

        <div className="flex flex-wrap gap-3">
          {filteredContacts.length > 0 ? (
            permissions.write ?
            filteredContacts.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                onEdit={(contactId) => {
                  navigator(`/user/contacts/edit/${contactId}`,{state:{from:location}});
                  }}
                onDelete={handleDelete}
              />
            ))
            :
            filteredContacts.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
              />
            ))
          ) : (
            <div className="w-full text-center py-16">
              <p className="text-muted-foreground">No contacts found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contacts;
