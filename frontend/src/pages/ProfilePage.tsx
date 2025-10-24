import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';
import {
  UserIcon,
  CameraIcon,
  KeyIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { formatDate } from '../utils/format';
import Alert from '../components/Alert';
import toast from 'react-hot-toast';

interface ProfileFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'preferences'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  // Profile form
  const { register: registerProfile, handleSubmit: handleProfileSubmit, formState: { errors: profileErrors }, reset: resetProfile } = useForm<ProfileFormData>({
    defaultValues: {
      fullName: user?.fullName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || ''
    }
  });

  // Password form
  const { register: registerPassword, handleSubmit: handlePasswordSubmit, formState: { errors: passwordErrors }, reset: resetPassword } = useForm<PasswordFormData>();

  // Update profile mutation
  const updateProfileMutation = useMutation(
    (data: ProfileFormData) => {
      // Mock API call - in real app, this would call authAPI.updateProfile
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ data });
        }, 1000);
      });
    },
    {
      onSuccess: (response: any) => {
        // Update localStorage
        const updatedUser = { ...user, ...response.data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Invalidate queries
        queryClient.invalidateQueries('user-profile');
        
        toast.success('Cập nhật hồ sơ thành công!');
        setIsEditing(false);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Cập nhật hồ sơ thất bại');
      }
    }
  );

  // Change password mutation
  const changePasswordMutation = useMutation(
    (data: PasswordFormData) => {
      // Mock API call - in real app, this would call authAPI.changePassword
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({});
        }, 1000);
      });
    },
    {
      onSuccess: () => {
        toast.success('Đổi mật khẩu thành công!');
        resetPassword();
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Đổi mật khẩu thất bại');
      }
    }
  );

  const onProfileSubmit = (data: ProfileFormData) => {
    updateProfileMutation.mutate(data);
  };

  const onPasswordSubmit = (data: PasswordFormData) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }
    changePasswordMutation.mutate(data);
  };

  const handleCancelEdit = () => {
    resetProfile();
    setIsEditing(false);
  };

  const tabs = [
    { id: 'profile', name: 'Thông tin cá nhân', icon: UserIcon },
    { id: 'password', name: 'Đổi mật khẩu', icon: KeyIcon },
    { id: 'preferences', name: 'Tùy chọn', icon: CheckCircleIcon }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <UserIcon className="h-8 w-8 text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Quản lý hồ sơ
              </h1>
              <p className="text-gray-600 mt-1">
                Cập nhật thông tin cá nhân và tùy chọn tài khoản
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="h-5 w-5 mr-3" />
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Thông tin cá nhân</h2>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="btn-primary"
                      >
                        Chỉnh sửa
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-6">
                    {/* Avatar */}
                    <div className="flex items-center space-x-6">
                      <div className="relative">
                        <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
                          <UserIcon className="h-12 w-12 text-primary-600" />
                        </div>
                        {isEditing && (
                          <button
                            type="button"
                            className="absolute -bottom-2 -right-2 bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 transition-colors"
                          >
                            <CameraIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{user?.fullName}</h3>
                        <p className="text-gray-600">Thành viên từ {formatDate(user?.createdAt)}</p>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Họ và tên
                        </label>
                        <input
                          {...registerProfile('fullName', { required: 'Họ và tên là bắt buộc' })}
                          disabled={!isEditing}
                          className={`input-field w-full ${!isEditing ? 'bg-gray-50' : ''}`}
                        />
                        {profileErrors.fullName && (
                          <p className="mt-1 text-sm text-red-600">{profileErrors.fullName.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          {...registerProfile('email', { 
                            required: 'Email là bắt buộc',
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: 'Email không hợp lệ'
                            }
                          })}
                          disabled={!isEditing}
                          className={`input-field w-full ${!isEditing ? 'bg-gray-50' : ''}`}
                        />
                        {profileErrors.email && (
                          <p className="mt-1 text-sm text-red-600">{profileErrors.email.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Số điện thoại
                        </label>
                        <input
                          {...registerProfile('phone')}
                          disabled={!isEditing}
                          className={`input-field w-full ${!isEditing ? 'bg-gray-50' : ''}`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Địa chỉ
                        </label>
                        <input
                          {...registerProfile('address')}
                          disabled={!isEditing}
                          className={`input-field w-full ${!isEditing ? 'bg-gray-50' : ''}`}
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {isEditing && (
                      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="btn-outline"
                        >
                          Hủy
                        </button>
                        <button
                          type="submit"
                          disabled={updateProfileMutation.isLoading}
                          className="btn-primary"
                        >
                          {updateProfileMutation.isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              )}

              {/* Password Tab */}
              {activeTab === 'password' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Đổi mật khẩu</h2>
                  
                  <Alert
                    type="info"
                    message="Để bảo mật tài khoản, hãy sử dụng mật khẩu mạnh với ít nhất 8 ký tự bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt."
                    className="mb-6"
                  />

                  <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mật khẩu hiện tại
                      </label>
                      <input
                        {...registerPassword('currentPassword', { required: 'Mật khẩu hiện tại là bắt buộc' })}
                        type="password"
                        className="input-field w-full"
                      />
                      {passwordErrors.currentPassword && (
                        <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mật khẩu mới
                      </label>
                      <input
                        {...registerPassword('newPassword', { 
                          required: 'Mật khẩu mới là bắt buộc',
                          minLength: {
                            value: 8,
                            message: 'Mật khẩu phải có ít nhất 8 ký tự'
                          }
                        })}
                        type="password"
                        className="input-field w-full"
                      />
                      {passwordErrors.newPassword && (
                        <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Xác nhận mật khẩu mới
                      </label>
                      <input
                        {...registerPassword('confirmPassword', { required: 'Xác nhận mật khẩu là bắt buộc' })}
                        type="password"
                        className="input-field w-full"
                      />
                      {passwordErrors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword.message}</p>
                      )}
                    </div>

                    <div className="flex justify-end pt-6 border-t border-gray-200">
                      <button
                        type="submit"
                        disabled={changePasswordMutation.isLoading}
                        className="btn-primary"
                      >
                        {changePasswordMutation.isLoading ? 'Đang đổi...' : 'Đổi mật khẩu'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Tùy chọn</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">Thông báo email</h3>
                        <p className="text-sm text-gray-600">Nhận thông báo về tours mới và ưu đãi</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">Thông báo SMS</h3>
                        <p className="text-sm text-gray-600">Nhận thông báo quan trọng qua SMS</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">Chế độ tối</h3>
                        <p className="text-sm text-gray-600">Sử dụng giao diện tối</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <button className="btn-primary">
                      Lưu tùy chọn
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
