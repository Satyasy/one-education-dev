import { toast } from "react-hot-toast";
import Button from "../../../components/ui/button/Button";
import { useVerifyPanjarMutation, useApprovePanjarMutation } from "../../../api/panjarApi";
import { CheckIcon } from "lucide-react";
import { Panjar } from "../../../types/panjar";
import { User } from "../../../types/auth";

interface PanjarActionsCardProps {
  panjarData: Panjar;
  canVerify: boolean;
  canApprove: boolean;
  user: User | null;
  refetch: () => void;
  id: string;
}

export default function PanjarActionsCard({ 
  panjarData, 
  canVerify, 
  canApprove, 
  user, 
  refetch, 
  id 
}: PanjarActionsCardProps) {
  const [verifyPanjar, { isLoading: isVerifying }] = useVerifyPanjarMutation();
  const [approvePanjar, { isLoading: isApproving }] = useApprovePanjarMutation();

  const handleVerify = async () => {
    try {
      await verifyPanjar(Number(id)).unwrap();
      toast.success('Panjar berhasil diverifikasi');
      refetch();
    } catch (error) {
      toast.error('Gagal diverifikasi panjar');
    }
  };

  const handleApprove = async () => {
    try {
      await approvePanjar(Number(id)).unwrap();
      toast.success('Panjar berhasil disetujui');
      refetch();
    } catch (error) {
      toast.error('Gagal menyetujui panjar');
    }
  };

  return (
    <div className="mt-6 border-t pt-4">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-2">
          {canVerify && panjarData.status !== 'verified' && panjarData.status !== 'approved' && (
            <Button
              variant="success"
              size="sm"
              startIcon={<CheckIcon className="w-4 h-4" />}
              onClick={handleVerify}
              disabled={isVerifying}
            >
              Verifikasi Panjar
            </Button>
          )}
          {canApprove && panjarData.status !== 'approved' && (
            <Button
              variant="success"
              size="sm"
              startIcon={<CheckIcon className="w-4 h-4" />}
              onClick={handleApprove}
              disabled={isApproving}
            >
              Setujui Panjar
            </Button>
          )}
          {user?.approval_hierarchy?.approvers?.some(approver => approver.id === Number(user?.id)) && 
           panjarData.status === 'pending' && (
            <p className="text-xs text-amber-600 dark:text-amber-400">
              ⚠️ Panjar harus diverifikasi oleh wakil kepala sekolah terlebih dahulu sebelum dapat disetujui
            </p>
          )}
        </div>
      </div>
    </div>
  );
}