import { useAuth } from "../../../hooks/useAuth";
import { Panjar } from "../../../types/panjar";

export const usePanjarPermissions = (panjarData: Panjar | undefined) => {
  const { user } = useAuth();

  const canCreate = user?.roles?.includes("kepala-urusan")
  const canVerify = (() => {
    // For kepala-sekolah: use verifiers array
    if (user?.approval_hierarchy?.verifiers) {
      return user.approval_hierarchy.verifiers.some(
        (verifier: any) => {
          const idMatch = verifier.id === Number(user?.id);
          const unitMatch = verifier.unit?.id === panjarData?.unit?.id;
          return idMatch && unitMatch;
        }
      );
    }
    // For other roles: use single verifier
    if (user?.approval_hierarchy?.verifiers) {
      const verifier = user.approval_hierarchy.verifiers[0];
      const idMatch = verifier.id === Number(user?.id);
      const unitMatch = verifier.unit?.id === panjarData?.unit?.id;
      return idMatch && unitMatch;
    }
    return false;
  })();

  const canApprove = user?.approval_hierarchy?.approvers?.some(approver => approver.id === Number(user?.id)) && 
                     (panjarData?.status === 'verified' || panjarData?.verified_by !== null);

  return {
    canVerify,
    canApprove,
    user,
    canCreate
  };
}; 