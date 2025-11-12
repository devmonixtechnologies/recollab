import { liveblocks } from "@/lib/liveblocks";
import { getCurrentUser } from "@/lib/auth";
import { getUserColor } from "@/lib/utils";
import { redirect } from "next/navigation";

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) redirect('/sign-in');

  const userInfo = {
    id: user.id,
    name: user.name ?? user.email,
    email: user.email,
    avatar: user.avatarUrl ?? '/assets/icons/avatar-placeholder.svg',
    color: user.color ?? getUserColor(user.id),
  };

  const { status, body } = await liveblocks.identifyUser(
    {
      userId: userInfo.email,
      groupIds: [],
    },
    { userInfo }
  );

  return new Response(body, { status });
}