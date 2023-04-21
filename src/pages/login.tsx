import React from "react";
import Image from "next/image";
import { GetServerSidePropsContext } from "next";
import { prisma } from "../lib";
import { useSession, getSession } from "next-auth/react";
import { AppHeader } from "@/components/AppHeader";
import { Layout, Content } from "@/components/layout";
import { getUserByEmail } from "@/utils/queries";
import { Button } from "@/components/buttons/Button";
import { Login } from "@/components/pages/Login";

interface HomeProps {
  // authError?: "OAuthAccountNotLinked";
  // callbackUrl?: string;
}

export default function Home(props: HomeProps) {
  return (
    <>
      <AppHeader />
      <Layout>
        <Content>
          <Login />
        </Content>
      </Layout>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);
  const user = session?.user?.email
    ? await getUserByEmail(session.user.email)
    : null;

  if (user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
