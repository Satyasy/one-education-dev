import { useParams } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import SpinnerOne from "../../components/ui/spinner/SpinnerOne";
import { useGetPanjarByIdQuery } from "../../api/panjarApi";
import { usePanjarAuthorization } from "../../hooks/useMenuAccess";
import PanjarItemsTableTab from "./components/PanjarItemsTableTab";
import {
  PanjarInfoCard,
  PanjarOfficersCard,
  AddPanjarItemModal,
  EditPanjarItemModal
} from "./components";
import { useAddPanjarItemMutation, useUpdatePanjarItemMutation } from "../../api/panjarItemApi";
import { useState } from "react";
import { CreatePanjarItemRequest, UpdatePanjarItemRequest } from "../../types/panjarItem";
import { toast } from "react-hot-toast";


export default function DetailPanjar() {
  const { id } = useParams<{ id: string }>();
  const { data: panjarData, isLoading, error, refetch } = useGetPanjarByIdQuery(id!);
  const [addPanjarItem, { isLoading: isAdding }] = useAddPanjarItemMutation();
  const [updatePanjarItem, { isLoading: isUpdating }] = useUpdatePanjarItemMutation();
  
  // Using comprehensive panjar authorization hook
  const {
    canVerifyPanjar,
    canApprovePanjar,
    canCreatePanjar,
    canPerformAction,
    user,
    getWorkflowPermissions
  } = usePanjarAuthorization();
  
  // Determine if current user is the creator
  const isCreator = user?.id === panjarData?.created_by?.id;
  
  // Get specific permissions based on panjar status and context
  const canVerify = canPerformAction('verify', panjarData?.status);
  const canApprove = canPerformAction('approve', panjarData?.status);
  const canCreate = canPerformAction('create');
  const canEdit = canPerformAction('edit', panjarData?.status, isCreator);
  const canDelete = canPerformAction('delete', panjarData?.status, isCreator);
  
  const [isAddPanjarItemModalOpen, setIsAddPanjarItemModalOpen] = useState(false);
  const [isEditPanjarItemModalOpen, setIsEditPanjarItemModalOpen] = useState(false);
  const [selectedPanjarItem, setSelectedPanjarItem] = useState<any>(null);

  // Debug permissions
  console.log("Panjar Data:", panjarData);
  console.log("User Permissions:", {
    canVerify,
    canApprove,
    canCreate,
    canEdit,
    canDelete,
    isCreator,
    userRoles: user?.roles,
    panjarStatus: panjarData?.status,
    workflowPermissions: getWorkflowPermissions()
  });

  const handleAddPanjarItem = async (data: CreatePanjarItemRequest) => {
    // Double check permissions before submitting
    if (!canCreate) {
      toast.error("Anda tidak memiliki izin untuk menambahkan item panjar");
      return;
    }

    try {
      await addPanjarItem({ panjar_request_id: Number(id), data });
      toast.success("Item Panjar berhasil ditambahkan");
      refetch();
      setIsAddPanjarItemModalOpen(false);
    } catch (error) {
      console.error("Error adding panjar item:", error);
      toast.error("Gagal menambahkan item panjar");
    }
  };

  const handleEditPanjarItem = async (itemId: number, data: UpdatePanjarItemRequest) => {
    // Double check permissions before submitting
    if (!canEdit) {
      toast.error("Anda tidak memiliki izin untuk mengedit item panjar");
      return;
    }

    try {
      console.log("Updating panjar item:", data);
      await updatePanjarItem({ panjar_item_id: itemId, data });
      toast.success("Item Panjar berhasil diupdate");
      refetch();
      setIsEditPanjarItemModalOpen(false);
      setSelectedPanjarItem(null);
    } catch (error) {
      console.error("Error updating panjar item:", error);
      toast.error("Gagal mengupdate item panjar");
    }
  };

  const handleOpenEditModal = (item: any) => {
    // Check permissions before opening edit modal
    if (!canEdit) {
      toast.error("Anda tidak memiliki izin untuk mengedit item panjar");
      return;
    }

    setSelectedPanjarItem(item);
    setIsEditPanjarItemModalOpen(true);
  };

  if (isLoading) {
    return <SpinnerOne />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-500">Error loading panjar data</div>
      </div>
    );
  }

  if (!panjarData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Panjar not found</div>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title={`Detail Panjar - ${panjarData.budget_item?.name} | TailAdmin`}
        description="Detail Panjar page for TailAdmin"
      />
      <PageBreadcrumb 
        pageTitle="Detail Panjar"
      />
      
      <div className="space-y-5 sm:space-y-6">
        <PanjarInfoCard panjarData={panjarData} />

        <PanjarOfficersCard panjarData={panjarData} user={user} />

        <PanjarItemsTableTab 
          panjarData={panjarData}
          canVerify={!!canVerify}
          canApprove={!!canApprove}
          canDelete={!!canDelete}
          refetch={refetch}
          setIsAddPanjarItemModalOpen={setIsAddPanjarItemModalOpen}
          canCreate={!!canCreate}
          onEditItem={handleOpenEditModal}
          panjarRequestId={id!}
          isCreator={isCreator}
        />


        {/* Only show Add Modal if user can create items */}
        {canCreate && (
          <AddPanjarItemModal
            isOpen={isAddPanjarItemModalOpen}
            onClose={() => setIsAddPanjarItemModalOpen(false)}
            onSubmit={handleAddPanjarItem}
            isLoading={isAdding || isUpdating}
          />
        )}

        {/* Only show Edit Modal if user can edit items */}
        {canEdit && (
          <EditPanjarItemModal
            isOpen={isEditPanjarItemModalOpen}
            onClose={() => setIsEditPanjarItemModalOpen(false)}
            onSubmit={handleEditPanjarItem}
            isLoading={isUpdating}
            initialData={selectedPanjarItem}
          />
        )}
      </div>
    </>
  );
}