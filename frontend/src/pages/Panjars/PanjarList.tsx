import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PanjarDataTable from "../../components/tables/DataTables/PanjarDataTable/PanjarDataTable";
import PageMeta from "../../components/common/PageMeta";

export default function PanjarList() {
  return (
    <>
      <PageMeta
        title="React.js User List Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js User List Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Panjar List" />
      <div className="space-y-5 sm:space-y-6">
        <ComponentCard title="Panjar List">
            <PanjarDataTable />
        </ComponentCard>
      </div>
    </>
  );
}
