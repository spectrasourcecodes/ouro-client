// src/pages/KYC.jsx
import React, { useState } from 'react';
import { Upload, CheckCircle, Clock, XCircle, X, Send, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';

// Códigos KYC fixos (apenas a equipe de suporte conhece)
const KYC_CODES = ['654738', '574536', '758354'];

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

  // Estado do modal e verificação
  const [showModal, setShowModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [attempts, setAttempts] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (type) => (e) => {
    const file = e.target.files[0];
    if (file) {
      setDocuments(prev => ({ ...prev, [type]: file }));
      toast.success(`Documento ${type === 'front' ? 'frente' : type === 'back' ? 'verso' : 'selfie'} enviado com sucesso`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Se já estiver pendente, reabre o modal (sem reenviar)
    if (kycStatus === 'pending') {
      setShowModal(true);
      return;
    }

    // Caso contrário, envia os documentos e pede o código
    // Em uma aplicação real, você enviaria os dados para o servidor aqui
    setKycStatus('pending');
    toast.info('Documentos KYC enviados. Digite o código de verificação fornecido pelo suporte.');
    setShowModal(true);
  };

  const handleVerifyCode = () => {
    const code = verificationCode.trim();
    if (!code) {
      setErrorMessage('Por favor, insira o código de verificação');
      return;
    }

    setIsVerifying(true);
    setErrorMessage('');

    // Simula uma chamada à API
    setTimeout(() => {
      // Verifica se o código corresponde a um dos códigos fixos
      if (KYC_CODES.includes(code)) {
        setKycStatus('approved');
        toast.success('Verificação KYC concluída com sucesso!');
        setShowModal(false);
        setVerificationCode('');
        setAttempts(0);
        setErrorMessage('');
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        setErrorMessage(`Código inválido. ${newAttempts >= 3 ? 'Sem tentativas restantes. Clique em "Enviar Documentos KYC" novamente para tentar de novo.' : `${3 - newAttempts} tentativa(s) restante(s).`}`);
        setVerificationCode('');
        if (newAttempts >= 3) {
          toast.error('Muitas tentativas falhas. Clique em "Enviar Documentos KYC" para recomeçar.');
          setAttempts(0);
          setShowModal(false);
          setKycStatus('rejected'); // Reseta para permitir reenvio
        }
      }
      setIsVerifying(false);
    }, 1000);
  };

  const getStatusBadge = () => {
    switch (kycStatus) {
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
            <span className="font-medium">Rejeitado – envie novamente</span>
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

  const isSubmitDisabled = kycStatus === 'approved';

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
          {/* Informações Pessoais */}
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
                  placeholder="ex.: Brasileiro"
                  required
                />
              </div>
            </div>
          </div>

          {/* Tipo de Documento */}
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

          {/* Endereço */}
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
                    CEP
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

          {/* Upload de Documentos */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Enviar Documentos</h2>
            <div className="space-y-4">
              {/* Frente do documento */}
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
                      JPG, PNG ou PDF (máx. 5MB)
                    </span>
                  </label>
                </div>
              </div>

              {/* Verso do documento (opcional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verso do Documento (opcional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                  <input
                    type="file"
                    id="back"
                    accept="image/*,.pdf"
                    onChange={handleFileUpload('back')}
                    className="hidden"
                  />
                  <label
                    htmlFor="back"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">
                      {documents.back ? documents.back.name : 'Clique para enviar o verso do documento'}
                    </span>
                    <span className="text-xs text-gray-400 mt-1">
                      JPG, PNG ou PDF (máx. 5MB)
                    </span>
                  </label>
                </div>
              </div>

              {/* Selfie com documento */}
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
                      JPG ou PNG (máx. 5MB)
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Botão de Envio */}
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl transition-all hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {kycStatus === 'approved' ? 'Já Verificado' :
             kycStatus === 'pending' ? 'Inserir Código de Verificação' :
             'Enviar Documentos KYC'}
          </button>

          <p className="text-xs text-gray-500 text-center">
            Suas informações e documentos são criptografados com segurança e serão usados apenas para fins de verificação.
          </p>
        </form>
      </div>

      {/* Modal de Código de Verificação KYC */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl animate-slide-up">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Digite o Código de Verificação</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Insira o código fornecido pela nossa equipe de suporte para concluir a verificação.
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="my-4">
              <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-1">
                Código de Verificação
              </label>
              <input
                id="verificationCode"
                type="text"
                placeholder="Digite o código de 6 dígitos"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className={`w-full px-4 py-3 border ${errorMessage ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                autoFocus
              />
              {errorMessage && (
                <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleVerifyCode}
                disabled={isVerifying || attempts >= 3}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isVerifying ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verificando...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Verificar Código
                  </>
                )}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
            {attempts >= 3 && (
              <p className="text-center text-sm text-red-600 mt-3">
                Muitas tentativas falhas. Clique em "Enviar Documentos KYC" para recomeçar.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default KYC;