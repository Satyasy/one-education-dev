import { useState } from 'react'
import PageBreadcrumb from '../../components/common/PageBreadCrumb'
import ComponentCard from '../../components/common/ComponentCard'
import PageMeta from '../../components/common/PageMeta'
import Button from '../../components/ui/button/Button'
import Input from '../../components/form/input/InputField'
import { Modal } from '../../components/ui/modal';
import Select from '../../components/form/Select'
import { 
	useCheckExistingBudgetMutation 
} from '../../api/budgetApi'
import { useGetUnitsSelectQuery } from '../../api/unitApi'
import { CheckExistingBudgetRequest, useAddBudgetMutation, useUpdateBudgetMutation } from '../../api/budgetApi'
import { BudgetItem as ApiBudgetItem } from '../../types/budget'

interface FormData {
	unit_id: string
	budget_year_id: string
	quarterly: string
}

interface BudgetItem {
	id?: number
	name: string
	description: string
	amount_allocation: number
}

interface BudgetFormData {
	unit_id: number
	budget_year_id: number
	quarterly: number
	budget_items: ApiBudgetItem[]
}

interface ExistingBudgetData {
	id: number
	unit: {
		id: number
		name: string
	}
	budget_year: {
		id: number
		year: number
		is_active: boolean
	}
	quarterly: number
	budget_items: Array<{
		id: number
		name: string
		description: string
		amount_allocation: number
	}>
}

export default function AddBudget() {
	const [formData, setFormData] = useState<FormData>({
		unit_id: '',
		budget_year_id: '',
		quarterly: '',
	})
	const [checkResult, setCheckResult] = useState<{
		exists: boolean
		data: ExistingBudgetData | null
		message: string
	} | null>(null)
	const [hasChecked, setHasChecked] = useState(false)
	const [showBudgetForm, setShowBudgetForm] = useState(false)
	const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([])
	const [showItemModal, setShowItemModal] = useState(false)
	const [editingItem, setEditingItem] = useState<BudgetItem | null>(null)
	const [itemForm, setItemForm] = useState<BudgetItem>({
		name: '',
		description: '',
		amount_allocation: 0
	})
	const [modifiedItems, setModifiedItems] = useState<Set<number>>(new Set())

	// API Hooks
	const { data: unitsData, isLoading: unitsLoading, error: unitsError } = useGetUnitsSelectQuery({})
	const [checkExistingBudget, { 
		isLoading: isCheckingBudget, 
		error: checkError 
	}] = useCheckExistingBudgetMutation()
	const [addBudget, { isLoading: isCreatingBudget }] = useAddBudgetMutation()
	const [updateBudget, { isLoading: isUpdatingBudget }] = useUpdateBudgetMutation()

	// Debug logging
	console.log('Units Data:', unitsData)
	console.log('Units Error:', unitsError)

	// Fallback data for development/testing
	const fallbackUnits = [
		{ id: 1, name: 'Sarana Prasarana' },
		{ id: 2, name: 'Hubungan industri' },
		{ id: 3, name: 'Kurikulum' },
	]

	// Options for selects - Handle different API response structures
	const unitOptions = (() => {
		// Use fallback data if API fails or returns no data
		let sourceData = null
		
		if (unitsData) {
			try {
				// Check if unitsData has a data property that is an array
				if (unitsData.data && Array.isArray(unitsData.data)) {
					sourceData = unitsData.data
				}
				// Check if unitsData is an array directly
				else if (Array.isArray(unitsData)) {
					sourceData = unitsData
				}
			} catch (error) {
				console.error('Error processing units data:', error)
			}
		}
		
		// Use fallback if no valid data from API
		if (!sourceData || sourceData.length === 0) {
			console.log('Using fallback units data')
			sourceData = fallbackUnits.map(unit => ({
				value: unit.id,
				label: unit.name,
				code: unit.name.toUpperCase()
			}))
		}
		
		return sourceData
			.filter(unit => unit && typeof unit === 'object' && unit.value && unit.label)
			.map(unit => ({
				value: unit.value.toString(),
				label: unit.label,
			}))
	})()

	// Budget Year Options - Use static data for now
	const budgetYearOptions = [
		{ value: '1', label: '2024' },
		{ value: '2', label: '2025' },
		{ value: '3', label: '2026' },
	]

	const quarterlyOptions = [
		{ value: '1', label: 'Q1 (Januari - Maret)' },
		{ value: '2', label: 'Q2 (April - Juni)' },
		{ value: '3', label: 'Q3 (Juli - September)' },
		{ value: '4', label: 'Q4 (Oktober - Desember)' },
	]

	const handleInputChange = (field: keyof FormData) => (value: string) => {
		setFormData(prev => ({
			...prev,
			[field]: value,
		}))
		// Reset check result when form changes
		if (hasChecked) {
			setHasChecked(false)
			setCheckResult(null)
			setModifiedItems(new Set()) // Reset modified items
			setShowBudgetForm(false) // Tutup form budget ketika form berubah
		}
	}

	const isFormValid = formData.unit_id && formData.budget_year_id && formData.quarterly

	const handleCheckExisting = async () => {
		if (!isFormValid) return

		try {
			const checkData: CheckExistingBudgetRequest = {
				unit_id: parseInt(formData.unit_id),
				budget_year_id: parseInt(formData.budget_year_id),
				quarterly: parseInt(formData.quarterly),
			}

			const result = await checkExistingBudget(checkData).unwrap()
			
			// Tutup form budget saat melakukan check baru
			setShowBudgetForm(false)
			
			// Update state dengan hasil check terbaru
			setCheckResult(result)
			setHasChecked(true)
			setModifiedItems(new Set()) // Reset modified items
			
			// Persiapkan data budget items sesuai dengan hasil check terbaru
			// tapi jangan tampilkan form-nya (user harus klik tombol Edit/Create lagi)
			if (result.exists && result.data) {
				setBudgetItems(result.data.budget_items || [])
			} else {
				setBudgetItems([])
			}
		} catch (error) {
			console.error('Error checking existing budget:', error)
		}
	}

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
		}).format(amount)
	}

	// Handle budget item modal
	const openAddItemModal = () => {
		setEditingItem(null)
		setItemForm({
			name: '',
			description: '',
			amount_allocation: 0
		})
		setShowItemModal(true)
	}

	const openEditItemModal = (item: BudgetItem) => {
		setEditingItem(item)
		setItemForm({ ...item })
		setShowItemModal(true)
	}

	const closeItemModal = () => {
		setShowItemModal(false)
		setEditingItem(null)
		setItemForm({
			name: '',
			description: '',
			amount_allocation: 0
		})
	}

	const handleItemFormChange = (field: keyof BudgetItem) => (value: string | number) => {
		setItemForm(prev => ({
			...prev,
			[field]: field === 'amount_allocation' ? Number(value) : value
		}))
	}

	const handleSaveItem = () => {
		if (!itemForm.name || !itemForm.description || itemForm.amount_allocation <= 0) {
			alert('Please fill all fields correctly')
			return
		}

		if (editingItem) {
			// Update existing item
			setBudgetItems(prev => prev.map(item => 
				item.id === editingItem.id ? { ...itemForm, id: editingItem.id } : item
			))
			
			// Mark item as modified
			setModifiedItems(prev => new Set([...prev, editingItem.id!]))
			
			// Also update the checkResult data if we're editing an existing budget item
			if (checkResult?.exists && checkResult.data) {
				setCheckResult(prev => {
					if (!prev?.data) return prev
					return {
						...prev,
						data: {
							...prev.data,
							budget_items: prev.data.budget_items.map(item => 
								item.id === editingItem.id 
									? { 
										...item, 
										name: itemForm.name,
										description: itemForm.description,
										amount_allocation: itemForm.amount_allocation
									}
									: item
							)
						}
					}
				})
			}
		} else {
			// Add new item
			const newItem: BudgetItem = {
				...itemForm,
				id: Date.now() // temporary ID for new items
			}
			setBudgetItems(prev => [...prev, newItem])
		}

		closeItemModal()
	}

	const handleDeleteItem = (id: number) => {
		if (confirm('Are you sure you want to delete this budget item?')) {
			setBudgetItems(prev => prev.filter(item => item.id !== id))
		}
	}

	const handleCreateNewBudget = () => {
		// Initialize with existing budget items if editing
		if (checkResult?.exists && checkResult.data) {
			// Pastikan menggunakan data budget items terbaru dari checkResult
			setBudgetItems(checkResult.data.budget_items || [])
			setModifiedItems(new Set()) // Reset modified items saat membuka form
		} else {
			setBudgetItems([])
			setModifiedItems(new Set())
		}
		setShowBudgetForm(true)
	}

	const handleSubmitBudget = async () => {
		if (!isFormValid || budgetItems.length === 0) {
			alert('Please add at least one budget item')
			return
		}

		try {
			const budgetData: BudgetFormData = {
				unit_id: parseInt(formData.unit_id),
				budget_year_id: parseInt(formData.budget_year_id),
				quarterly: parseInt(formData.quarterly),
				budget_items: budgetItems.map(item => ({
					id: item.id || 0, // Provide default id for new items
					name: item.name,
					description: item.description,
					amount_allocation: item.amount_allocation
				}))
			}

			if (checkResult?.exists && checkResult.data) {
				// Update existing budget
				await updateBudget({ id: checkResult.data.id, ...budgetData }).unwrap()
			} else {
				// Create new budget
				await addBudget(budgetData).unwrap()
			}

			alert(checkResult?.exists ? 'Budget updated successfully!' : 'Budget created successfully!')
			setShowBudgetForm(false)
			setBudgetItems([])
			setModifiedItems(new Set()) // Reset modified items
			
			// Refresh check result
			await handleCheckExisting()
		} catch (error) {
			console.error('Error saving budget:', error)
			alert('Error saving budget. Please try again.')
		}
	}

const totalBudgetAmount = budgetItems.reduce((sum, item) => {
    // Convert to number to ensure proper arithmetic
    const currentAmount = Number(item.amount_allocation) || 0;
    const currentSum = Number(sum) || 0;
    
    // Add numbers and return
    return currentSum + currentAmount;
}, 0);

	return (
		<>
			<PageMeta 
				title="Add Budget" 
				description="Halaman untuk menambahkan budget baru" 
			/>
			<PageBreadcrumb pageTitle="Add Budget" />

			<div className="space-y-6">
				{/* Form Check Existing Budget */}
				<ComponentCard title="Check Existing Budget">
					<div className="space-y-4">
						<p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
							Periksa apakah budget sudah ada untuk unit, tahun anggaran, dan kuartal yang dipilih sebelum membuat budget baru.
						</p>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							{/* Unit Selection */}
							<div className="space-y-2">
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
									Unit <span className="text-red-500">*</span>
								</label>
								<Select
									options={unitOptions}
									placeholder={
										unitsLoading 
											? "Loading units..." 
											: unitsError 
												? "Error loading units" 
												: unitOptions.length === 0 
													? "No units available" 
													: "Pilih Unit"
									}
									value={formData.unit_id}
									onChange={handleInputChange('unit_id')}
									className="w-full"
								/>
								{!!unitsError && (
									<p className="text-xs text-red-500 mt-1">
										Failed to load units. Please try again.
									</p>
								)}
							</div>

							{/* Budget Year Selection */}
							<div className="space-y-2">
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
									Tahun Anggaran <span className="text-red-500">*</span>
								</label>
								<Select
									options={budgetYearOptions}
									placeholder="Pilih Tahun Anggaran"
									value={formData.budget_year_id}
									onChange={handleInputChange('budget_year_id')}
									className="w-full"
								/>
							</div>

							{/* Quarterly Selection */}
							<div className="space-y-2">
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
									Kuartal <span className="text-red-500">*</span>
								</label>
								<Select
									options={quarterlyOptions}
									placeholder="Pilih Kuartal"
									value={formData.quarterly}
									onChange={handleInputChange('quarterly')}
									className="w-full"
								/>
							</div>
						</div>

						{/* Check Button */}
						<div className="flex justify-center pt-4">
							<Button
								type="button"
								onClick={handleCheckExisting}
								disabled={!isFormValid || isCheckingBudget}
								className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{isCheckingBudget ? (
									<>
										<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
											<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
											<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
										</svg>
										Checking...
									</>
								) : (
									'Check Existing Budget'
								)}
							</Button>
						</div>

						{/* Error Display */}
						{!!checkError && (
							<div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
								<div className="flex">
									<div className="flex-shrink-0">
										<svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
											<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
										</svg>
									</div>
									<div className="ml-3">
										<h3 className="text-sm font-medium text-red-800 dark:text-red-200">
											Terjadi kesalahan saat checking budget
										</h3>
									</div>
								</div>
							</div>
						)}
					</div>
				</ComponentCard>

				{/* Check Result Display */}
				{hasChecked && checkResult && (
					<ComponentCard title="Check Result">
						{checkResult.exists ? (
							/* Budget Already Exists */
							<div className="space-y-4">
								<div className="flex items-center space-x-2 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
									<svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
										<path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
									</svg>
									<p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
										{checkResult.message}
									</p>
								</div>

								{checkResult.data && (
									<div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-3">
										<h4 className="font-medium text-gray-900 dark:text-gray-100">
											Detail Budget yang Sudah Ada:
										</h4>
										
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
											<div>
												<span className="font-medium text-gray-600 dark:text-gray-400">Unit:</span>
												<p className="text-gray-900 dark:text-gray-100">{checkResult.data.unit.name}</p>
											</div>
											<div>
												<span className="font-medium text-gray-600 dark:text-gray-400">Tahun:</span>
												<p className="text-gray-900 dark:text-gray-100">{checkResult.data.budget_year.year}</p>
											</div>
											<div>
												<span className="font-medium text-gray-600 dark:text-gray-400">Kuartal:</span>
												<p className="text-gray-900 dark:text-gray-100">Q{checkResult.data.quarterly}</p>
											</div>
											<div>
												<span className="font-medium text-gray-600 dark:text-gray-400">Budget ID:</span>
												<p className="text-gray-900 dark:text-gray-100">#{checkResult.data.id}</p>
											</div>
										</div>

										{checkResult.data.budget_items && checkResult.data.budget_items.length > 0 && (
											<div className="mt-4">
												<div className="flex justify-between items-center mb-3">
													<h5 className="font-medium text-gray-900 dark:text-gray-100">
														Budget Items:
													</h5>
													{modifiedItems.size > 0 && (
														<span className="px-3 py-1 text-xs bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 rounded-full">
															{modifiedItems.size} item{modifiedItems.size > 1 ? 's' : ''} modified
														</span>
													)}
												</div>
												<div className="space-y-2">
													{checkResult.data.budget_items.map((item) => (
														<div key={item.id} className={`flex justify-between items-center p-3 rounded border transition-colors ${
															modifiedItems.has(item.id) 
																? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700' 
																: 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600'
														}`}>
															<div className="flex-1">
																<div className="flex items-center space-x-2 mb-1">
																	<p className="font-medium text-gray-900 dark:text-gray-100">{item.name}</p>
																	{modifiedItems.has(item.id) && (
																		<span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full">
																			Modified
																		</span>
																	)}
																</div>
																<p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
															</div>
															<div className="flex items-center space-x-4">
																<div className="text-right">
																	<p className="font-medium text-green-600 dark:text-green-400">
																		{formatCurrency(item.amount_allocation)}
																	</p>
																</div>
															</div>
														</div>
													))}
												</div>
											</div>
										)}

										<div className="flex space-x-3 pt-4">
									<Button
										type="button"
										onClick={handleCreateNewBudget}
										className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
									>
										Edit Budget
									</Button>
									<Button
										type="button"
										variant="outline"
										className="border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors"
									>
										View Details
									</Button>
								</div>

								{showBudgetForm && (
									<div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
										<div className="flex justify-between items-center mb-6">
											<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Budget Items</h3>
											<Button
												type="button"
												onClick={openAddItemModal}
												className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
											>
												<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
												</svg>
												<span>Add Budget Item</span>
											</Button>
										</div>
					
										{budgetItems.length > 0 ? (
											<div className="space-y-4">
												{budgetItems.map((item) => (
													<div key={item.id} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
														<div className="flex-1">
															<p className="font-medium text-gray-900 dark:text-gray-100">{item.name}</p>
															<p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
														</div>
														<div className="flex items-center space-x-4">
															<div className="text-right">
																<p className="font-medium text-green-600 dark:text-green-400">
																	{formatCurrency(item.amount_allocation)}
																</p>
															</div>
															<div className="flex space-x-2">
																<Button
																	type="button"
																	onClick={() => openEditItemModal(item)}
																	variant="outline"
																	className="px-3 py-1 text-xs text-blue-600 border-blue-300 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-500 dark:hover:bg-blue-900/20"
																>
																	<svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
																	</svg>
																	Edit
																</Button>
																<Button
																	type="button"
																	onClick={() => handleDeleteItem(item.id!)}
																	variant="outline"
																	className="px-3 py-1 text-xs text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-500 dark:hover:bg-red-900/20"
																>
																	<svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
																	</svg>
																	Delete
																</Button>
															</div>
														</div>
													</div>
												))}

												<div className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg mt-4">
													<p className="font-medium text-gray-900 dark:text-gray-100">Total Budget</p>
													<p className="font-bold text-lg text-green-600 dark:text-green-400">
														{formatCurrency(totalBudgetAmount)}
													</p>
												</div>

												<div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
													<Button
														type="button"
														onClick={() => setShowBudgetForm(false)}
														variant="outline"
														className="px-6 py-2"
													>
														Cancel
													</Button>
													<Button
														type="button"
														onClick={handleSubmitBudget}
														disabled={budgetItems.length === 0 || isUpdatingBudget}
														className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
													>
														{isUpdatingBudget ? 'Updating...' : 'Update Budget'}
													</Button>
												</div>
											</div>
										) : (
											<div className="flex flex-col items-center justify-center py-12 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
												<svg className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
												</svg>
												<p className="text-gray-600 dark:text-gray-400 mb-4">No budget items added yet</p>
												<Button
													type="button"
													onClick={openAddItemModal}
													className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
												>
													<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
													</svg>
													<span>Add Budget Item</span>
												</Button>
											</div>
										)}
									</div>
								)}
									</div>
								)}
							</div>
						) : (
							/* Budget Does Not Exist */
							<div className="space-y-4">
								<div className="flex items-center space-x-2 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
									<svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
										<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
									</svg>
									<p className="text-sm font-medium text-green-800 dark:text-green-200">
										{checkResult.message}
									</p>
								</div>

								<div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
									<p className="text-sm text-green-800 dark:text-green-200 mb-4">
										Budget belum dibuat untuk kombinasi unit, tahun anggaran, dan kuartal tersebut. 
										Anda dapat melanjutkan untuk membuat budget baru.
									</p>
									
									<Button
										type="button"
										onClick={handleCreateNewBudget}
										className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
									>
										Create New Budget
									</Button>
								</div>

								{showBudgetForm && (
									<div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
										<div className="flex justify-between items-center mb-6">
											<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Budget Items</h3>
											<Button
												type="button"
												onClick={openAddItemModal}
												className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
											>
												<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
												</svg>
												<span>Add Budget Item</span>
											</Button>
										</div>

										{budgetItems.length > 0 ? (
											<div className="space-y-4">
												{budgetItems.map((item) => (
													<div key={item.id} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
														<div className="flex-1">
															<p className="font-medium text-gray-900 dark:text-gray-100">{item.name}</p>
															<p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
														</div>
														<div className="flex items-center space-x-4">
															<div className="text-right">
																<p className="font-medium text-green-600 dark:text-green-400">
																	{formatCurrency(item.amount_allocation)}
																</p>
															</div>
															<div className="flex space-x-2">
																<Button
																	type="button"
																	onClick={() => openEditItemModal(item)}
																	variant="outline"
																	className="px-3 py-1 text-xs text-blue-600 border-blue-300 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-500 dark:hover:bg-blue-900/20"
																>
																	<svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
																	</svg>
																	Edit
																</Button>
																<Button
																	type="button"
																	onClick={() => handleDeleteItem(item.id!)}
																	variant="outline"
																	className="px-3 py-1 text-xs text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-500 dark:hover:bg-red-900/20"
																>
																	<svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
																	</svg>
																	Delete
																</Button>
															</div>
														</div>
													</div>
												))}

												<div className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg mt-4">
													<p className="font-medium text-gray-900 dark:text-gray-100">Total Budget</p>
													<p className="font-bold text-lg text-green-600 dark:text-green-400">
														{formatCurrency(totalBudgetAmount)}
													</p>
												</div>

												<div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
													<Button
														type="button"
														onClick={() => setShowBudgetForm(false)}
														variant="outline"
														className="px-6 py-2"
													>
														Cancel
													</Button>
													<Button
														type="button"
														onClick={handleSubmitBudget}
														disabled={budgetItems.length === 0 || isCreatingBudget}
														className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
													>
														{isCreatingBudget ? 'Saving...' : 'Save Budget'}
													</Button>
												</div>
											</div>
										) : (
											<div className="flex flex-col items-center justify-center py-12 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
												<svg className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
												</svg>
												<p className="text-gray-600 dark:text-gray-400 mb-4">No budget items added yet</p>
											</div>
										)}
									</div>
								)}
							</div>
						)}
					</ComponentCard>
				)}
			</div>

			{/* Budget Item Modal */}
			<Modal isOpen={showItemModal} onClose={closeItemModal} className="max-w-2xl">
				<div className="p-6 w-full">
					<h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
						{editingItem ? 'Edit Budget Item' : 'Add Budget Item'}
					</h2>

					<div className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								Item Name <span className="text-red-500">*</span>
							</label>
							<Input
								type="text"
								value={itemForm.name}
								onChange={(e) => handleItemFormChange('name')(e.target.value)}
								placeholder="e.g., IT Infrastructure"
								className="w-full"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								Description <span className="text-red-500">*</span>
							</label>
							<textarea
								value={itemForm.description}
								onChange={(e) => handleItemFormChange('description')(e.target.value)}
								placeholder="e.g., Server dan networking equipment"
								rows={3}
								className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								Amount Allocation <span className="text-red-500">*</span>
							</label>
							<Input
								type="number"
								value={itemForm.amount_allocation}
								onChange={(e) => handleItemFormChange('amount_allocation')(e.target.value)}
								placeholder="0"
								min="0"
								step={1000}
								className="w-full"
							/>
							{itemForm.amount_allocation > 0 && (
								<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
									{formatCurrency(itemForm.amount_allocation)}
								</p>
							)}
						</div>
					</div>

					<div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
						<Button
							type="button"
							onClick={closeItemModal}
							variant="outline"
							className="px-6 py-2"
						>
							Cancel
						</Button>
						<Button
							type="button"
							onClick={handleSaveItem}
							disabled={!itemForm.name || !itemForm.description || itemForm.amount_allocation <= 0}
							className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
						>
							{editingItem ? 'Update Item' : 'Add Item'}
						</Button>
					</div>
				</div>
			</Modal>
		</>
	)
}