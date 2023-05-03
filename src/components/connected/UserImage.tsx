import { useSession } from "next-auth/react";
import { UserIcon } from "../icons";

export function UserImage() {
  const session = useSession();

  if (session?.data?.user?.image)
    return (
      <img
        src={session?.data?.user?.image || ""}
        alt="user image"
        style={{ width: 30, height: 30 }}
      />
    );

  return <UserIcon />;
}
