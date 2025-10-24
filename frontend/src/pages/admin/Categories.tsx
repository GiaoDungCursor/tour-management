import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { categoriesAPI } from '../../services/api';
import { Category } from '../../types';
import DataTable from '../../components/DataTable';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';
import toast from 'react-hot-toast';

const AdminCategories: React.FC = () => {
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<Partial<Category>>({});

  // Fetch categories
  const { data: categories, isLoading, error, refetch } = useQuery(
    'admin-categories',
    categoriesAPI.getAll,
    { initialData: [] }
  );

  // Mutations
  const createCategoryMutation = useMutation(categoriesAPI.create, {
    onSuccess: () => {
      queryClient.invalidateQueries('admin-categories');
      setIsCreateModalOpen(false);
      setFormData({});
      toast.success('Category created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create category');
    },
  });

  const updateCategoryMutation = useMutation(
    ({ id, data }: { id: number; data: { name: string; description?: string } }) => 
      categoriesAPI.update(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-categories');
        setIsEditModalOpen(false);
        setSelectedCategory(null);
        setFormData({});
        toast.success('Category updated successfully!');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to update category');
      },
    }
  );

  const deleteCategoryMutation = useMutation(categoriesAPI.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries('admin-categories');
      setIsDeleteModalOpen(false);
      setSelectedCategory(null);
      toast.success('Category deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete category');
    },
  });

  // Table columns
  const columns = [
    {
      key: 'name',
      title: 'Category Name',
      sortable: true,
      render: (value: string, record: Category) => (
        <div className="flex items-center">
          {record.imageUrl && (
            <img
              src={record.imageUrl}
              alt={value}
              className="h-10 w-10 rounded-lg object-cover mr-3"
            />
          )}
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-sm text-gray-500">{record.description}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'active',
      title: 'Status',
      render: (value: boolean) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (value: any, record: Category) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(record)}
            className="text-indigo-600 hover:text-indigo-900"
            title="Edit"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(record)}
            className="text-red-600 hover:text-red-900"
            title="Delete"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  const handleCreate = () => {
    setFormData({
      name: '',
      description: '',
      imageUrl: '',
      active: true,
    });
    setIsCreateModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      imageUrl: category.imageUrl,
      active: category.active,
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCreateModalOpen) {
      createCategoryMutation.mutate({
        name: formData.name!,
        description: formData.description,
      });
    } else if (isEditModalOpen && selectedCategory) {
      updateCategoryMutation.mutate({
        id: selectedCategory.id,
        data: {
          name: formData.name!,
          description: formData.description,
        },
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (selectedCategory) {
      deleteCategoryMutation.mutate(selectedCategory.id);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Loading categories..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        fullScreen
        title="Error Loading Categories"
        message="Could not load categories data. Please try again."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Category Management</h1>
              <p className="mt-2 text-gray-600">Manage tour categories and classifications</p>
            </div>
            <button
              onClick={handleCreate}
              className="btn-primary flex items-center space-x-2"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Add New Category</span>
            </button>
          </div>
        </div>

        {/* Data Table */}
        <DataTable
          data={categories || []}
          columns={columns}
          emptyMessage="No categories found. Create your first category!"
          className="shadow-lg"
        />

        {/* Create/Edit Modal */}
        <Modal
          isOpen={isCreateModalOpen || isEditModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            setIsEditModalOpen(false);
            setFormData({});
          }}
          title={isCreateModalOpen ? 'Create New Category' : 'Edit Category'}
          size="md"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  rows={3}
                  className="input-field w-full"
                  placeholder="Brief description of this category..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl || ''}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {formData.imageUrl && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preview
                  </label>
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="h-32 w-32 rounded-lg object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setIsEditModalOpen(false);
                  setFormData({});
                }}
                className="btn-outline"
                disabled={createCategoryMutation.isLoading || updateCategoryMutation.isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={createCategoryMutation.isLoading || updateCategoryMutation.isLoading}
              >
                {createCategoryMutation.isLoading || updateCategoryMutation.isLoading ? 'Saving...' : 
                 isCreateModalOpen ? 'Create Category' : 'Update Category'}
              </button>
            </div>
          </form>
        </Modal>

        {/* Delete Confirmation Modal */}
        <ConfirmDialog
          isOpen={isDeleteModalOpen}
          title="Delete Category"
          message={`Are you sure you want to delete "${selectedCategory?.name}"? This action cannot be undone and may affect tours in this category.`}
          confirmLabel="Delete Category"
          cancelLabel="Cancel"
          onConfirm={handleDeleteConfirm}
          onCancel={() => {
            setIsDeleteModalOpen(false);
            setSelectedCategory(null);
          }}
          type="danger"
        />
      </div>
    </div>
  );
};

export default AdminCategories;