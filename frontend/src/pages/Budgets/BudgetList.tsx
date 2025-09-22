import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import BudgetDataTable from "../../components/tables/DataTables/BudgetDataTable/BudgetDataTable";
import PageMeta from "../../components/common/PageMeta";

export default function BudgetList() {
  return (
    <>
      <PageMeta
        title="React.js User List Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js User List Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Budget List" />
      <div className="space-y-5 sm:space-y-6">
        <ComponentCard title="Budget List">
            <BudgetDataTable />
        </ComponentCard>
      </div>
    </>
  );
}
