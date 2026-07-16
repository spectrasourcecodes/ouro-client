// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Lock, Bell, Shield } from 'lucide-react';
import { toast } from 'react-toastify';
import axiosInstance from '../utils/axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('profile');

  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    twoFactorEnabled: false,
    emailNotifications: false,
    pushNotifications: false,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axiosInstance.get("/api/user/profile");

        setProfileData((prev) => ({
          ...prev,              // ✅ keep existing fields
          ...data,              // ✅ overwrite only what backend sends
        }));

      } catch (err) {
        toast.error("Falha ao carregar perfil");
        // ✅ Redirect to login
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);
  

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axiosInstance.put("/api/user/profile", {
        fullName: profileData.fullName,
        phone: profileData.phone,
        country: profileData.country,
      });

      data.success == true ?
                        toast.success(data.message):
                        toast.error(data.message);

    } catch (error) {
      const message =
        error.response?.data?.message || "Falha na atualização";

      toast.error(message);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("As novas senhas não coincidem");
      return;
    }

    try {
      const { data } = await axiosInstance.put("/api/user/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      data.success == true ?
                        toast.success(data.message):
                        toast.error(data.message);

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

    } catch (error) {
      const message =
        error.response?.data?.message || "Falha ao atualizar senha";

      toast.error(message);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'security', label: 'Segurança', icon: Lock },
    { id: 'notifications', label: 'Notificações', icon: Bell },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Configurações do Perfil</h1>
        <p className="text-gray-600 mt-2">Gerencie suas preferências de conta</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="md:w-64">
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <div className="flex flex-col space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300
                      ${activeTab === tab.id 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <h2 className="text-xl font-bold mb-6">Informações Pessoais</h2>
                
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {profileData.fullName?.split(' ').map(n => n[0]).join('') || 'U'}
                  </div>
                  <div>
                    <button type="button" className="bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded-xl hover:bg-gray-200 transition-all text-sm">
                      Alterar Avatar
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome Completo
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        value={profileData.fullName}
                        onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                        className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-mail
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      País
                    </label>
                    <input
                      type="text"
                      value={profileData.country}
                      onChange={(e) =>
                        setProfileData({ ...profileData, country: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl transition-all hover:scale-105 hover:shadow-xl">
                  Salvar Alterações
                </button>
              </form>
            )}

            {activeTab === 'security' && (
              <div className="space-y-8">
                <form onSubmit={handlePasswordChange} className="space-y-6">
                  <h2 className="text-xl font-bold">Alterar Senha</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Senha Atual
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                        className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nova Senha
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                        className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmar Nova Senha
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  <button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl transition-all hover:scale-105 hover:shadow-xl">
                    Atualizar Senha
                  </button>
                </form>

                <div className="border-t pt-6">
                  <h2 className="text-xl font-bold mb-4">Autenticação de Dois Fatores</h2>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Status 2FA</p>
                        <p className="text-sm text-gray-600">
                          {profileData.twoFactorEnabled ? 'Ativado' : 'Desativado'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setProfileData({...profileData, twoFactorEnabled: !profileData.twoFactorEnabled})}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                        ${profileData.twoFactorEnabled ? 'bg-blue-600' : 'bg-gray-300'}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                          ${profileData.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'}`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold mb-6">Preferências de Notificação</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Bell className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Notificações por E-mail</p>
                        <p className="text-sm text-gray-600">
                          Receba atualizações sobre seus investimentos
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setProfileData({...profileData, emailNotifications: !profileData.emailNotifications})}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                        ${profileData.emailNotifications ? 'bg-blue-600' : 'bg-gray-300'}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                          ${profileData.emailNotifications ? 'translate-x-6' : 'translate-x-1'}`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Bell className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Notificações Push</p>
                        <p className="text-sm text-gray-600">
                          Receba alertas instantâneos no seu dispositivo
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setProfileData({...profileData, pushNotifications: !profileData.pushNotifications})}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                        ${profileData.pushNotifications ? 'bg-blue-600' : 'bg-gray-300'}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                          ${profileData.pushNotifications ? 'translate-x-6' : 'translate-x-1'}`}
                      />
                    </button>
                  </div>
                </div>

                <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl transition-all hover:scale-105 hover:shadow-xl">
                  Salvar Preferências
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;