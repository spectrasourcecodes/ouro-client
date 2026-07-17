// src/pages/KYC.jsx
import React, { useState } from 'react';
import { Upload, CheckCircle, Clock, XCircle, X, Send, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';

// Hardcoded KYC codes (known only to support staff)
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

  // Modal and verification state
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
      toast.success(`Document ${type} uploaded successfully`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // If already pending, just re-open the modal (no resubmission)
    if (kycStatus === 'pending') {
      setShowModal(true);
      return;
    }

    // Otherwise, submit documents and ask for code
    // In a real app, you'd send the data to the server here
    setKycStatus('pending');
    toast.info('KYC documents submitted. Please enter the verification code provided by support.');
    setShowModal(true);
  };

  const handleVerifyCode = () => {
    const code = verificationCode.trim();
    if (!code) {
      setErrorMessage('Please enter the verification code');
      return;
    }

    setIsVerifying(true);
    setErrorMessage('');

    // Simulate API call
    setTimeout(() => {
      // Check if code matches any of the hardcoded codes
      if (KYC_CODES.includes(code)) {
        setKycStatus('approved');
        toast.success('KYC verification completed successfully!');
        setShowModal(false);
        setVerificationCode('');
        setAttempts(0);
        setErrorMessage('');
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        setErrorMessage(`Invalid verification code. ${newAttempts >= 3 ? 'No attempts left. Please resubmit to try again.' : `${3 - newAttempts} attempt(s) remaining.`}`);
        setVerificationCode('');
        if (newAttempts >= 3) {
          // After 3 failures, reset and allow resubmit
          toast.error('Too many failed attempts. Please click "Submit KYC Documents" again.');
          setAttempts(0);
          setShowModal(false);
          setKycStatus('rejected'); // Reset to allow re-submission
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
            <span className="font-medium">Verified</span>
          </div>
        );
      case 'rejected':
        return (
          <div className="flex items-center space-x-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg">
            <XCircle className="w-5 h-5" />
            <span className="font-medium">Rejected – please resubmit</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center space-x-2 text-yellow-600 bg-yellow-50 px-4 py-2 rounded-lg">
            <Clock className="w-5 h-5" />
            <span className="font-medium">Pending Verification</span>
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
            <h1 className="text-3xl font-bold text-gray-900">KYC Verification</h1>
            <p className="text-gray-600 mt-2">Verify your identity to unlock all features</p>
          </div>
          {getStatusBadge()}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information – same as before */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name (as on document)
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
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
                  Nationality
                </label>
                <input
                  type="text"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="e.g., American"
                  required
                />
              </div>
            </div>
          </div>

          {/* Document Type – same as before */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Identity Document</h2>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { type: 'passport', label: 'Passport' },
                { type: 'id_card', label: 'ID Card' },
                { type: 'drivers_license', label: "Driver's License" },
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
                Document Number
              </label>
              <input
                type="text"
                name="documentNumber"
                value={formData.documentNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Enter document number"
                required
              />
            </div>
          </div>

          {/* Address Information – same */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Address Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="123 Main St"
                  required
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="New York"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="USA"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP / Postal Code
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="12345"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Document Upload – same */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Upload Documents</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Front of Document
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
                      {documents.front ? documents.front.name : 'Click to upload front of document'}
                    </span>
                    <span className="text-xs text-gray-400 mt-1">
                      JPG, PNG or PDF (max 5MB)
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Back of Document (optional)
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
                      {documents.back ? documents.back.name : 'Click to upload back of document'}
                    </span>
                    <span className="text-xs text-gray-400 mt-1">
                      JPG, PNG or PDF (max 5MB)
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selfie with Document
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
                      {documents.selfie ? documents.selfie.name : 'Click to upload selfie with document'}
                    </span>
                    <span className="text-xs text-gray-400 mt-1">
                      JPG or PNG (max 5MB)
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl transition-all hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {kycStatus === 'approved' ? 'Already Verified' :
             kycStatus === 'pending' ? 'Enter Verification Code' :
             'Submit KYC Documents'}
          </button>

          <p className="text-xs text-gray-500 text-center">
            Your personal information and documents are securely encrypted and will only be used for verification purposes.
          </p>
        </form>
      </div>

      {/* KYC Verification Code Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl animate-slide-up">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Enter Verification Code</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Please enter the verification code provided by our support team.
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
                Verification Code
              </label>
              <input
                id="verificationCode"
                type="text"
                placeholder="Enter 6-digit code"
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
                    Verifying...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Verify Code
                  </>
                )}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
            {attempts >= 3 && (
              <p className="text-center text-sm text-red-600 mt-3">
                Too many failed attempts. Please click "Submit KYC Documents" again to retry.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default KYC;