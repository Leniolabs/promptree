import { Layout, Content } from "@/components/layout";
import { AppHeader } from "@/components/AppHeader";
import ConnectedSidebar from "@/components/connected/ConnectedSidebar";
import { SquashModal } from "@/components/modals/SquashModal";

export default function Home() {
  return (
    <>
      <AppHeader />
      <Layout>
        <ConnectedSidebar />
        <Content></Content>
      </Layout>
    </>
  );
}
