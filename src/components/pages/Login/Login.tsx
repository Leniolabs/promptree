import { Button } from "@/components/buttons/Button";
import styles from "./Login.module.scss";
import { APP_NAME } from "@/settings";
import { signIn } from "next-auth/react";

export function Login() {
  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginContainer}>
        <div>Welcome to {APP_NAME}</div>
        <Button onClick={() => signIn("google")}>Login with Google</Button>
        <Button onClick={() => signIn("github")}>Login with GitHub</Button>
      </div>
    </div>
  );
}
