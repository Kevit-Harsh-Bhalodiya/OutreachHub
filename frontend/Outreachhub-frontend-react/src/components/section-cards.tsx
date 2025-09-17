import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchCampaign } from "@/redux/slices/campaignSlice";
import { fetchContact } from "@/redux/slices/contactSlice";
import { fetchUser } from "@/redux/slices/userSlice";
import { fetchWorkspaces } from "@/redux/slices/workspaceSlice";
import type { AppDispatch, RootState } from "@/redux/store";

export function SectionCards() {
  const { workspaces, loading: workspaceLoading } = useSelector(
    (state: RootState) => state.workspace,
  );
  const { user: user, loading: userLoading } = useSelector(
    (state: RootState) => state.user,
  );
  const { campaigns, loading: campaignLoading } = useSelector(
    (state: RootState) => state.campaign,
  );
  const { contacts, loading: contactLoading } = useSelector(
    (state: RootState) => state.contact,
  );
  const dispatch = useDispatch<AppDispatch>();

  // This useEffect runs once when the component mounts to fetch all the necessary data
  useEffect(() => {
    dispatch(fetchWorkspaces());
    dispatch(fetchUser());
    dispatch(fetchCampaign());
    dispatch(fetchContact());
  }, [dispatch]);

  // This single variable determines if any of the data is still loading
  const isLoading =
    workspaceLoading || userLoading || campaignLoading || contactLoading;

  // If anything is loading, show a loading state
  if (isLoading) {
    // In a real app, you might replace this with 4 Skeleton Card components
    return <div className="p-6">Loading Dashboard Data...</div>;
  }

  // Once all data is loaded, render the cards
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Workspaces</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {workspaces?.length || 0}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Trending up this month <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Visitors for the last 6 months
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Users</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {user?.length || 0}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingDown />
              -20%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Down 20% this period <IconTrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Acquisition needs attention
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>All Campaigns</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {campaigns?.length || 0}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Strong user retention <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Engagement exceed targets</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>All Contacts</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {contacts?.length || 0}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +4.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Steady performance increase <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Meets growth projections</div>
        </CardFooter>
      </Card>
    </div>
  );
}
