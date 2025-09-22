import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAddPanjarMutation } from "../../api/panjarApi";
import { PanjarItem, PanjarRequest } from "../../types/panjar";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import { useAuth } from "../../hooks/useAuth";
import { formatCurrency, parseCurrency, formatCurrencyInput } from "../../utils/currency";
import { DocsIcon, TrashBinIcon, PencilIcon } from "../../icons";
import EditItemModal from "./components/EditItemModal";
import { toast } from "react-hot-toast";
import { useGetBudgetItemsQuery } from "../../api/budgetItemApi";
import { BudgetItemSelect } from "../../types/budgetItem";

import { unitOptions } from "./utils/panjarHelpers";
import TextArea from "../../components/form/input/TextArea";

const AddPanjar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [addPanjar, { isLoading }] = useAddPanjarMutation();
  const { 
    data: budgetItemsResponse, 
    isLoading: isBudgetItemsLoading,
    error: budgetItemsError 
  } = useGetBudgetItemsQuery(
    { unit_id: user?.employee?.unit?.id },
    { skip: !user?.employee?.unit?.id }
  );

  const budgetItems = budgetItemsResponse || [];
  
  console.log('Budget Items:', budgetItems);

  const [formData, setFormData] = useState<PanjarRequest>({
    budget_item_id: undefined,
    unit_id: undefined,
    created_by: undefined,
    panjar_items: [],
  });

  const [currentItem, setCurrentItem] = useState<PanjarItem>({
    item_name: "",
    spesification: "",
    description: "",
    quantity: 1,
    unit: "",
    price: "",
    total: "0",
    status: "pending",
    report_status: "not_reported",
  }); 

  const [priceDisplay, setPriceDisplay] = useState<string>("");
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<PanjarItem | null>(null);
  const [editPriceDisplay, setEditPriceDisplay] = useState<string>("");

  // Calculate total amount whenever items change
  useEffect(() => {
    const total = formData.panjar_items?.reduce((sum: number, item: any) => {
      return sum + parseFloat(item.total || "0");
    }, 0) || 0;
    setTotalAmount(total);
  }, [formData.panjar_items]);

  // Update formData when user data becomes available
  useEffect(() => {
    if (user?.employee?.unit?.id && user?.employee?.id) {
      setFormData((prev) => ({
        ...prev,
        unit_id: Number(user.employee?.unit?.id),
        created_by: Number(user?.id),
      }));
    }
  }, [user]);

  console.log('Form Data:', formData);

  const handleItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentItem((prev) => {
      const newItem = { ...prev, [name]: value };
      
      // Calculate total when quantity changes
      if (name === "quantity") {
        const quantity = parseInt(value) || 0;
        const price = parseFloat(prev.price) || 0;
        newItem.total = (quantity * price).toString();
      }
      
      return newItem;
    });
  };

  const handleItemUnitChange = (value: string) => {
    setCurrentItem((prev) => ({
      ...prev,
      unit: value,
    }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const numericValue = parseCurrency(value);
    const formattedDisplay = formatCurrencyInput(value);
    
    setPriceDisplay(formattedDisplay);
    
    setCurrentItem((prev) => {
      const newItem = { ...prev, price: numericValue.toString() };
      const total = (prev.quantity * numericValue).toString();
      newItem.total = total;
      return newItem;
    });
  };

  // Edit item handlers
  const handleEditItem = (index: number) => {
    const item = formData.panjar_items?.[index];
    if (item) {
      setEditingIndex(index);
      setEditingItem({ ...item });
      setEditPriceDisplay(formatCurrencyInput(item.price));
      setIsEditModalOpen(true);
    }
  };

  const handleEditItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (!editingItem) return;

    setEditingItem((prev) => {
      if (!prev) return null;
      const newItem = { ...prev, [name]: value };
      
      // Calculate total when quantity changes
      if (name === "quantity") {
        const quantity = parseInt(value) || 0;
        const price = parseFloat(prev.price) || 0;
        newItem.total = (quantity * price).toString();
      }
      
      return newItem;
    });
  };

  const handleEditItemUnitChange = (value: string) => {
    if (!editingItem) return;
    setEditingItem((prev) => prev ? { ...prev, unit: value } : null);
  };

  const handleEditPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const numericValue = parseCurrency(value);
    const formattedDisplay = formatCurrencyInput(value);
    
    setEditPriceDisplay(formattedDisplay);
    
    if (!editingItem) return;
    setEditingItem((prev) => {
      if (!prev) return null;
      const newItem = { ...prev, price: numericValue.toString() };
      const total = (prev.quantity * numericValue).toString();
      newItem.total = total;
      return newItem;
    });
  };

  const handleSaveEdit = () => {
    if (!editingItem || editingIndex === null) return;
    
    if (!editingItem.item_name || !editingItem.spesification || !editingItem.quantity || !editingItem.unit || !editingItem.price || editingItem.price === "0") {
      alert("Mohon lengkapi semua field item dengan benar");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      panjar_items: prev.panjar_items?.map((item, index) => 
        index === editingIndex ? editingItem : item
      ) || [],
    }));

    // Reset edit state
    setEditingIndex(null);
    setEditingItem(null);
    setEditPriceDisplay("");
    setIsEditModalOpen(false);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingItem(null);
    setEditPriceDisplay("");
    setIsEditModalOpen(false);
  };

  const handleAddItem = () => {
    if (!currentItem.item_name || !currentItem.spesification || !currentItem.quantity || !currentItem.unit || !currentItem.price || currentItem.price === "0") {
      toast.error("Mohon lengkapi semua field item dengan benar");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      panjar_items: [...(prev.panjar_items || []), { ...currentItem }],
    }));

    // Reset current item
    setCurrentItem({
      item_name: "",
      spesification: "",
      description: "",
      quantity: 1,
      unit: "",
      price: "",
      total: "0",
      status: "pending",
      report_status: "not_reported",
    });
    setPriceDisplay("");
  };

  const handleRemoveItem = (index: number) => {
    // Cancel edit if removing the item being edited
    if (editingIndex === index) {
      handleCancelEdit();
    }

    setFormData((prev) => ({
      ...prev,
      panjar_items: prev.panjar_items?.filter((_, i) => i !== index),
    }));

    // Adjust editing index if necessary
    if (editingIndex !== null && editingIndex > index) {
      setEditingIndex(editingIndex - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Cancel any ongoing edit before submit
    if (editingIndex !== null) {
      toast.error("Mohon selesaikan editing item terlebih dahulu");
      return;
    }
    
    if (!formData.panjar_items || formData.panjar_items.length === 0) {
      toast.error("Mohon tambahkan minimal satu item");
      return;
    }

    // Validate required fields
    const validationErrors = [];
    
    if (!formData.budget_item_id) {
      validationErrors.push("Item tidak boleh kosong");
    }
    
    if (!formData.unit_id) {
      validationErrors.push("Unit ID tidak ditemukan");
    }

    if (!formData.created_by) {
      validationErrors.push("User ID tidak ditemukan");
    }

    if (validationErrors.length > 0) {
      toast.error(`Validasi gagal: ${validationErrors.join(", ")}`);
      return;
    }

    try {
      const submitData = {
        ...formData,
        total_amount: totalAmount.toString(),
      };
      
      await addPanjar(submitData).unwrap();
      toast.success("Panjar berhasil ditambahkan!");
      navigate("/panjars");
    } catch (error) {
      if (error && typeof error === 'object' && 'data' in error) {
        const apiError = error as any;
        if (apiError.data?.message) {
          toast.error(`Error: ${apiError.data.message}`);
        } else if (apiError.data?.error) {
          toast.error(`Error: ${apiError.data.error}`);
        } else {
          toast.error("Gagal menambahkan panjar. Silakan coba lagi.");
        }
      } else {
        toast.error("Gagal menambahkan panjar. Silakan coba lagi.");
      }
    }
  };

  if (!user) {
    return (
      <>
        <PageMeta title="Tambah Panjar" description="Halaman untuk menambahkan permintaan panjar baru" />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Memuat data user...</p>
          </div>
        </div>
      </>
    );
  }

  if (!user?.employee?.unit) {
    return (
      <>
        <PageMeta title="Tambah Panjar" description="Halaman untuk menambahkan permintaan panjar baru" />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-red-500 mb-4">Unit tidak ditemukan dalam data karyawan Anda.</p>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Pastikan akun Anda memiliki data karyawan yang valid dengan unit yang terdaftar.
            </p>
            <Button onClick={() => navigate("/panjars")}>
              Kembali ke Daftar Panjar
            </Button>
          </div>
        </div>
      </>
    );
  }

  // Check if form data is ready (unit_id and created_by are set)
  const isFormReady = formData.unit_id && formData.created_by && !isBudgetItemsLoading;

  return (
    <>
      <PageMeta title="Tambah Panjar" description="Halaman untuk menambahkan permintaan panjar baru" />
      <PageBreadcrumb pageTitle="Tambah Panjar" />

      <ComponentCard title="Tambah Panjar Baru">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Loading Warning */}
          {!isFormReady && (
            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-700">
              <div className="flex items-center gap-2 mb-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-600"></div>
                <h3 className="font-semibold text-amber-900 dark:text-amber-100">Memuat Data User</h3>
              </div>
              <p className="text-amber-700 dark:text-amber-200 text-sm">
                Sedang memuat informasi unit dan user. Form akan aktif setelah data ter-load.
              </p>
            </div>
          )}

          {/* Header Information */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">Informasi Unit</h3>
            </div>
            <p className="text-blue-700 dark:text-blue-200">
              Unit: <span className="font-semibold">{user?.employee?.unit?.name || "Memuat..."}</span>
            </p>
          </div>

          {/* Activity Name */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white">
              Nama Akun Item <span className="text-red-500">*</span>
            </label>
            <Select
              options={budgetItems.map((item: BudgetItemSelect) => ({
                value: item.id.toString(),
                label: item.display_text,
              }))}
              placeholder={
                isBudgetItemsLoading 
                  ? "Memuat item anggaran..." 
                  : !isFormReady 
                    ? "Memuat data user..." 
                    : budgetItems.length === 0
                      ? "Tidak ada item anggaran tersedia"
                      : "Pilih item anggaran"
              }
              defaultValue={formData.budget_item_id?.toString() || undefined}
              onChange={(value) => setFormData({ ...formData, budget_item_id: parseInt(value) })}
            />
            {!isFormReady && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {isBudgetItemsLoading 
                  ? "Memuat daftar item anggaran..." 
                  : "Field akan aktif setelah data user ter-load"
                }
              </p>
            )}
            {isFormReady && budgetItems.length === 0 && !isBudgetItemsLoading && (
              <p className="text-xs text-amber-600 dark:text-amber-400">
                ⚠️ Tidak ada item anggaran tersedia untuk unit Anda. Silakan hubungi administrator.
              </p>
            )}
          </div>

          {/* Add Items Section */}
          <div className="bg-gray-25 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-6">
              <DocsIcon className="w-5 h-5 text-brand-500" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Tambah Item</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nama Item <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  name="item_name"
                  value={currentItem.item_name}
                  onChange={handleItemChange}
                  placeholder="Nama item"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Kuantitas <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  name="quantity"
                  value={currentItem.quantity}
                  onChange={handleItemChange}
                  placeholder="1"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Satuan <span className="text-red-500">*</span>
                </label>
                <Select
                  options={unitOptions}
                  placeholder="Pilih satuan"
                  onChange={handleItemUnitChange}
                  defaultValue={currentItem.unit}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Harga Satuan <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                    Rp
                  </span>
                  <Input
                    type="text"
                    name="price"
                    value={priceDisplay}
                    onChange={handlePriceChange}
                    placeholder="0"
                    className="pl-8"
                  />
                </div>
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Spesifikasi <span className="text-red-500">*</span>
                  </label>
                  <TextArea
                    value={currentItem.spesification}
                    onChange={(value) => setCurrentItem(prev => ({ ...prev, spesification: value }))}
                    placeholder="Spesifikasi"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Deskripsi <span className="text-red-500">*</span>
                  </label>
                  <TextArea
                    value={currentItem.description}
                    onChange={(value) => setCurrentItem(prev => ({ ...prev, description: value }))}
                    placeholder="Deskripsi"
                  />
                </div>
            </div>


            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Item: <span className="font-semibold text-brand-600 dark:text-brand-400">
                  {formatCurrency(currentItem.total)}
                </span>
              </div>
              <Button
                type="button"
                variant="primary"
                onClick={handleAddItem}
                startIcon={<DocsIcon className="w-4 h-4" />}
              >
                Tambah Item
              </Button>
            </div>
          </div>

          {/* Items List */}
          {formData.panjar_items && formData.panjar_items.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Daftar Item ({formData.panjar_items.length})
                </h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        No
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Nama Item
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Qty
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Satuan
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Harga Satuan
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Total
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    {formData.panjar_items.map((item: any, index: number) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                          {index + 1}
                        </td>
                        
                        {/* Non-editable fields */}
                            <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                              {item.item_name}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                              {item.quantity}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                              {item.unit}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                              {formatCurrency(item.price)}
                            </td>
                            <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                              {formatCurrency(item.total)}
                            </td>
                            <td className="px-6 py-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <Button
                                  type="button"
                                  variant="primary"
                                  size="sm"
                                  onClick={() => handleEditItem(index)}
                                  startIcon={<PencilIcon className="w-3 h-3" />}
                                  disabled={editingIndex !== null}
                                >
                                  Edit
                                </Button>
                                <Button
                                  type="button"
                                  variant="danger"
                                  size="sm"
                                  onClick={() => handleRemoveItem(index)}
                                  startIcon={<TrashBinIcon className="w-3 h-3" />}
                                  disabled={editingIndex !== null}
                                >
                                  Hapus
                                </Button>
                              </div>
                            </td>
                        
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Total Amount */}
              <div className="px-6 py-4 bg-brand-50 dark:bg-brand-900/20 border-t border-gray-200 dark:border-gray-600">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    Total Keseluruhan:
                  </span>
                  <span className="text-2xl font-bold text-brand-600 dark:text-brand-400">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            {!isFormReady && (
              <div className="flex items-center text-amber-600 dark:text-amber-400 text-sm mb-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-600 mr-2"></div>
                Memuat data user...
              </div>
            )}
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/panjars")}
              disabled={isLoading || editingIndex !== null}
            >
              Batal
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              disabled={isLoading || !formData.panjar_items?.length || editingIndex !== null || !isFormReady}
            >
              {isLoading ? "Menyimpan..." : !isFormReady ? "Memuat data..." : "Simpan Panjar"}
            </Button>
          </div>
        </form>
      </ComponentCard>
      {/* Edit Item Modal */}
      <EditItemModal
        isOpen={isEditModalOpen}
        onClose={handleCancelEdit}
        onSave={handleSaveEdit}
        editingItem={editingItem}
        editPriceDisplay={editPriceDisplay}
        handleEditItemChange={handleEditItemChange}
        handleEditItemUnitChange={handleEditItemUnitChange}
        handleEditPriceChange={handleEditPriceChange}
        setEditingItem={setEditingItem}
      />
    </>
  );
};

export default AddPanjar;
