import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";

import PageMeta from "../../components/common/PageMeta";
import UserDataTable from "../../components/tables/DataTables/UserDataTable/UserDataTable";

export default function UserList() {
  return (
    <>
      <PageMeta
        title="React.js User List Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js User List Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="User List" />
      <div className="space-y-5 sm:space-y-6">
        <ComponentCard title="User List">
          <UserDataTable />
        </ComponentCard>
      </div>
    </>
  );
}
