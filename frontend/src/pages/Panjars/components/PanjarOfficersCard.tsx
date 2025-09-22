import ComponentCard from "../../../components/common/ComponentCard";
import Badge from "../../../components/ui/badge/Badge";
import { Panjar } from "../../../types/panjar";
import { User } from "../../../types/auth";

interface PanjarOfficersCardProps {
  panjarData: Panjar;
  user: User | null;
}


export default function PanjarOfficersCard({ panjarData, user }: PanjarOfficersCardProps) {
  const financeApprover = user?.finance_approval_hierarchy?.finance_approvers?.[0];
  const financeVerifier = user?.finance_verification_hierarchy?.finance_verifiers?.[0];
  const financeTaxVerifier = user?.finance_tax_verification_hierarchy?.finance_tax_verifiers?.[0];

  // Helper function to get verifier info
  const getVerifierInfo = () => {
    if (user?.approval_hierarchy?.verifiers) {
      const verifier = user.approval_hierarchy.verifiers.find(
        (v: any) => v.unit?.id === panjarData?.unit?.id
      ) || user.approval_hierarchy.verifiers[0];
      return {
        name: verifier?.name || 'Tidak tersedia',
        position: verifier?.position || 'Tidak tersedia'
      };
    }
    return { name: 'Tidak tersedia', position: 'Tidak tersedia' };
  };

  const verifierInfo = getVerifierInfo();

  // Approval workflow steps in order
  const approvalSteps = [
    {
      step: 1,
      title: "Dibuat Oleh",
      person: panjarData.created_by,
      position: panjarData.created_by?.position?.name || 'Tidak tersedia',
      status: "completed",
    },
    {
      step: 2,
      title: "Verifikasi Unit",
      person: panjarData.verified_by,
      position: verifierInfo.position,
      status: panjarData.verified_by ? "completed" : "pending",
      fallbackName: verifierInfo.name,
    },
    {
      step: 3,
      title: "Persetujuan Unit",
      person: panjarData.approved_by,
      position: user?.approval_hierarchy?.approvers?.[0]?.position,
      status: panjarData.approved_by ? "completed" : "pending",
      fallbackName: user?.approval_hierarchy?.approvers?.[0]?.name,
    },
    {
      step: 4,
      title: "Verifikasi Pajak",
      person: panjarData.finance_tax_verification_by,
      position: financeTaxVerifier?.position,
      status: panjarData.finance_tax_verification_by ? "completed" : "pending",
      fallbackName: financeTaxVerifier?.name,
    },
    {
      step: 5,
      title: "Verifikasi Keuangan",
      person: panjarData.finance_verification_by,
      position: financeVerifier?.position,
      status: panjarData.finance_verification_by ? "completed" : "pending",
      fallbackName: financeVerifier?.name,
    },
    {
      step: 6,
      title: "Persetujuan Keuangan",
      person: panjarData.finance_approval_by,
      position: financeApprover?.position,
      status: panjarData.finance_approval_by ? "completed" : "pending",
      fallbackName: financeApprover?.name,
    }
  ];

  const getStepIcon = (status: string, step: number) => {
    if (status === "completed") {
      return (
        <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
          ✓
        </div>
      );
    }
    return (
      <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-full flex items-center justify-center text-sm font-medium">
        {step}
      </div>
    );
  };

  return (
    <ComponentCard title="Alur Persetujuan Panjar">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {approvalSteps.map((step, index) => (
          <div key={step.step} className="relative p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            {/* Step number and icon */}
            <div className="flex items-center justify-between mb-3">
              {getStepIcon(step.status, step.step)}
            </div>

            {/* Step content */}
            <div className="space-y-2">
              <Badge
                variant="light"
                color={step.status === "completed" ? "success" : "warning"}
              >
                {step.title}
              </Badge>

              <div>
                <p className="text-gray-900 dark:text-white font-medium text-sm">
                  {step.person?.name || step.fallbackName || 'Belum ditentukan'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {step.position || 'Posisi tidak tersedia'}
                </p>
              </div>

              {/* Status indicator */}
              <div className="mt-3">
                {step.status === "completed" ? (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Selesai
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    Menunggu
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ComponentCard>
  );
} 