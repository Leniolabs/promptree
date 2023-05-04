import { useSession } from "next-auth/react";
import { UserIcon } from "../icons";

export function UserImage(props: { avatar?: string }) {
  if (props.avatar)
    return (
      <img
        src={props.avatar || ""}
        alt="user image"
        style={{ width: 30, height: 30 }}
      />
    );

  return <UserIcon />;
}
