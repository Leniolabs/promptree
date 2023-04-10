import { Layout, Content } from "@/components/layout";
import { AppHeader } from "@/components/AppHeader";
import ConnectedSidebar from "@/components/connected/ConnectedSidebar";
import { Template } from "@/components/layout/Template";
import { useTemplate } from "@/query/useTemplates";
import { TemplateResponse } from "@/types/api";
import { GetServerSidePropsContext } from "next";

export default function TemplateView(props: { id?: TemplateResponse["id"] }) {
  const { data: template, isLoading, update } = useTemplate(props.id);

  return (
    <>
      <AppHeader />
      <Layout>
        <ConnectedSidebar />
        <Content>
          {!isLoading && template ? (
            <Template key={template.id} template={template} onSave={update} />
          ) : null}
        </Content>
      </Layout>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const id = context.params?.id as string;

  return {
    props: {
      id,
    },
  };
}
