import { useParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";
import { toast } from "react-hot-toast";

// Schema and types
import { addPanjarRealizationItemSchema } from "./schemas/addPanjarRealizationItemSchema";

// Custom hooks
import { useSubmit } from "./hooks/useSubmit";

// Components
import { CreateFormFields } from "./components/CreateFormFields";
import { FileUploadSectionNew } from "./components/FileUploadSectionNew";

// Constants
import { ERROR_MESSAGES } from "./constants/realizationConstants";

export default function CreatePanjarRealizationItem() {
    const { panjarRequestId } = useParams<{ panjarRequestId: string }>();

    // React Hook Form setup with empty default values
    const form = useForm({
        resolver: zodResolver(addPanjarRealizationItemSchema),
        mode: 'onChange',
        defaultValues: {
            item_name: '',
            spesification: '',
            description: '',
            unit: '',
            quantity: 0,
            price: 0,
            total: 0,
            receipt_file: null,
            item_photo: null,
        },
    });

    const { handleSubmit, setValue, formState: { errors } } = form;

    const { submitForm, isSubmitting } = useSubmit({
        onSuccess: () => {
            toast.success(ERROR_MESSAGES.SUBMIT_SUCCESS, {
                duration: 3000,
                position: 'top-right',
            });
            setTimeout(() => window.history.back(), 2000);
        },
        onError: (message) => {
            toast.error(message, {
                duration: 4000,
                position: 'top-right',
            });
        }
    });

    // Event handlers
    const onSubmit = async (data: any) => {
        if (!panjarRequestId) return;
        
        // Convert form data to API format
        const apiData = {
            ...data,
            receipt_file: data.receipt_file instanceof File ? data.receipt_file : undefined,
            item_photo: data.item_photo instanceof File ? data.item_photo : undefined,
        };
        
        await submitForm(apiData as any, panjarRequestId, '');
    };

    const handleFieldChange = (field: string, value: string | number | File | null) => {
        setValue(field as any, value);
    };

    return (
        <>
            <PageBreadcrumb pageTitle="Create Panjar Realization Item" />

            <ComponentCard 
                title="Form Panjar Realization Item" 
                className="space-y-5 sm:space-y-6"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left column - Form Fields */}
                        <CreateFormFields
                            form={form}
                        />

                        {/* Right column - File Upload */}
                        <FileUploadSectionNew
                            form={form}
                            onFileChange={handleFieldChange}
                        />
                    </div>

                    {/* Form Errors Display */}
                    {Object.keys(errors).length > 0 && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                            <h4 className="text-red-800 dark:text-red-200 font-medium mb-2">Please fix the following errors:</h4>
                            <ul className="text-red-700 dark:text-red-300 text-sm space-y-1">
                                {Object.entries(errors).map(([field, error]) => (
                                    <li key={field}>
                                        {field}: {error && typeof error === 'object' && 'message' in error ? (error as any).message : 'Invalid value'}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="flex justify-end space-x-3 mt-6">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => window.history.back()}
                            disabled={isSubmitting}
                        >
                            Batal
                        </Button>
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Menyimpan..." : "Simpan Realisasi"}
                        </Button>
                    </div>
                </form>
            </ComponentCard>
        </>
    );
}