// src/pages/KYC.jsx
import React, { useState } from 'react';
import { Upload, CheckCircle, Clock, XCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const KYC = ({ kycStatus, setKycStatus }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    nationality: '',
    documentType: 'passport',
    documentNumber: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
  });

  const [documents, setDocuments] = useState({
    front: null,
    back: null,
    selfie: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (type) => (e) => {
    const file = e.target.files[0];
    if (file) {
      setDocuments(prev => ({ ...prev, [type]: file }));
      toast.success(`Documento ${type} enviado com sucesso`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setKycStatus('pending');
    toast.success('Documentos KYC enviados com sucesso. Analisaremos em breve.');
  };

  const getStatusBadge = () => {
    switch(kycStatus) {
      case 'approved':
        return (
          <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Verificado</span>
          </div>
        );
      case 'rejected':
        return (
          <div className="flex items-center space-x-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg">
            <XCircle className="w-5 h-5" />
            <span className="font-medium">Rejeitado - Por favor, reenvie</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center space-x-2 text-yellow-600 bg-yellow-50 px-4 py-2 rounded-lg">
            <Clock className="w-5 h-5" />
            <span className="font-medium">Verificação Pendente</span>
          </div>
        );
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Verificação KYC</h1>
            <p className="text-gray-600 mt-2">Verifique sua identidade para desbloquear todos os recursos</p>
          </div>
          {getStatusBadge()}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Informações Pessoais</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo (como no documento)
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="João Silva"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Nascimento
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nacionalidade
                </label>
                <input
                  type="text"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="ex., Brasil"
                  required
                />
              </div>
            </div>
          </div>

          {/* Document Type */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Documento de Identidade</h2>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { type: 'passport', label: 'Passaporte' },
                { type: 'id_card', label: 'RG / CNH' },
                { type: 'drivers_license', label: 'Carteira de Motorista' },
              ].map((doc) => (
                <button
                  key={doc.type}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, documentType: doc.type }))}
                  className={`p-3 rounded-xl border-2 transition-all duration-300 text-center
                    ${formData.documentType === doc.type 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-300'}`}
                >
                  <span className="text-xs">{doc.label}</span>
                </button>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número do Documento
              </label>
              <input
                type="text"
                name="documentNumber"
                value={formData.documentNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Digite o número do documento"
                required
              />
            </div>
          </div>

          {/* Address Information */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Informações de Endereço</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Endereço
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="Rua Principal, 123"
                  required
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cidade
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="São Paulo"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    País
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Brasil"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CPF
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="12345-678"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Document Upload */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Enviar Documentos</h2>
            <div className="space-y-4">
              {/* Front of ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frente do Documento
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                  <input
                    type="file"
                    id="front"
                    accept="image/*,.pdf"
                    onChange={handleFileUpload('front')}
                    className="hidden"
                  />
                  <label
                    htmlFor="front"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">
                      {documents.front ? documents.front.name : 'Clique para enviar a frente do documento'}
                    </span>
                    <span className="text-xs text-gray-400 mt-1">
                      JPG, PNG ou PDF (máx 5MB)
                    </span>
                  </label>
                </div>
              </div>

              {/* Selfie with ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selfie com o Documento
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                  <input
                    type="file"
                    id="selfie"
                    accept="image/*"
                    onChange={handleFileUpload('selfie')}
                    className="hidden"
                  />
                  <label
                    htmlFor="selfie"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">
                      {documents.selfie ? documents.selfie.name : 'Clique para enviar selfie com o documento'}
                    </span>
                    <span className="text-xs text-gray-400 mt-1">
                      JPG ou PNG (máx 5MB)
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={kycStatus === 'approved' || kycStatus === 'pending'}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl transition-all hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {kycStatus === 'approved' ? 'Já Verificado' :
             kycStatus === 'pending' ? 'Verificação em Andamento' :
             'Enviar Documentos KYC'}
          </button>

          <p className="text-xs text-gray-500 text-center">
            Suas informações e documentos pessoais são criptografados com segurança e serão usados apenas para fins de verificação.
          </p>
        </form>
      </div>
    </div>
  );
};

export default KYC;