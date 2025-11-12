import CollaborativeRoom from "@/components/CollaborativeRoom"
import { getDocument } from "@/lib/actions/room.actions";
import { getUsersByEmails } from "@/lib/actions/user.actions";
import { requireUser } from "@/lib/auth";
import { redirect } from "next/navigation";

const Document = async ({ params: { id } }: SearchParamProps) => {
  const user = await requireUser();

  const room = await getDocument({
    roomId: id,
    userId: user.email,
  });

  if(!room) redirect('/');

  const userIds = Object.keys(room.usersAccesses);
  const users = await getUsersByEmails({ emails: userIds });

  const usersData = users
    .filter((u: User | null): u is User => Boolean(u))
    .map((collaborator: User) => ({
    ...collaborator,
    userType: room.usersAccesses[collaborator.email]?.includes('room:write')
      ? 'editor'
      : 'viewer'
  }))

  const currentUserType = room.usersAccesses[user.email]?.includes('room:write') ? 'editor' : 'viewer';

  return (
    <main className="flex w-full flex-col items-center">
      <CollaborativeRoom 
        roomId={id}
        roomMetadata={room.metadata}
        users={usersData}
        currentUserType={currentUserType}
      />
    </main>
  )
}

export default Document