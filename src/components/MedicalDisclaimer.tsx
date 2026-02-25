import React, { useState } from 'react';
import { AlertTriangle, Phone, Clock, X, Info } from 'lucide-react';

interface MedicalDisclaimerProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export const MedicalDisclaimer: React.FC<MedicalDisclaimerProps> = ({
  isOpen,
  onAccept,
  onDecline
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4 safe-area-top safe-area-bottom">
      <div className="backdrop-blur-xl bg-white/95 rounded-3xl max-w-md w-full max-h-[85vh] flex flex-col shadow-2xl border border-white/40">
        <div className="flex-shrink-0 px-6 py-5 border-b border-gray-200/50 bg-gradient-to-r from-blue-50/50 to-teal-50/50 rounded-t-3xl">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-md">
              <Info className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Important Notice</h2>
              <p className="text-sm text-gray-600 mt-0.5">Please read before continuing</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="space-y-4">
            <div className="backdrop-blur-xl bg-blue-50/60 border border-blue-200/50 p-5 rounded-2xl">
              <h3 className="font-bold text-blue-900 mb-3 text-base flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Educational Tool Only
              </h3>
              <div className="space-y-3 text-blue-900/80 text-sm leading-relaxed">
                <p className="font-semibold">
                  DOGSWAB provides educational information only and does not provide medical advice, diagnosis, or treatment.
                </p>
                <p>
                  This app cannot replace professional veterinary examination, diagnosis, or treatment.
                  We are not licensed veterinarians and do not practice veterinary medicine.
                </p>
                <p className="font-semibold">
                  For all health concerns, symptoms, or medical decisions about your pet, consult with a licensed veterinarian.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="backdrop-blur-xl bg-orange-50/60 border border-orange-200/50 rounded-2xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <h4 className="font-semibold text-gray-800 text-sm">For Emergencies</h4>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  If your pet is experiencing a medical emergency, contact your veterinarian
                  or emergency animal hospital immediately. Do not rely on
                  this app for emergency situations.
                </p>
              </div>

              <div className="backdrop-blur-xl bg-teal-50/60 border border-teal-200/50 rounded-2xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Phone className="w-5 h-5 text-teal-600" />
                  <h4 className="font-semibold text-gray-800 text-sm">Professional Care</h4>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Always consult with a licensed veterinarian for medical decisions.
                  This app provides general education to supplement, not replace,
                  professional care.
                </p>
              </div>
            </div>

            <div className="backdrop-blur-xl bg-white/60 border border-gray-200/50 rounded-2xl p-4">
              <h4 className="font-semibold text-gray-800 mb-3 text-sm">By using DOGSWAB, you acknowledge:</h4>
              <ul className="space-y-2.5 text-sm text-gray-700">
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>All information is educational only</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>You will seek professional veterinary care for medical concerns</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>DOGSWAB is not liable for any health outcomes</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>This app provides education only, not medical services</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 px-6 py-5 border-t border-gray-200/50 backdrop-blur-xl bg-gray-50/50 rounded-b-3xl">
          <div className="flex space-x-3">
            <button
              onClick={onDecline}
              className="flex-1 backdrop-blur-xl bg-white/80 border border-gray-300/50 text-gray-700 py-3.5 px-4 rounded-2xl hover:bg-white hover:shadow-[0_0_20px_rgba(156,163,175,0.3)] transition-all duration-300 font-semibold text-sm shadow-sm"
            >
              Decline
            </button>
            <button
              onClick={onAccept}
              className="flex-1 bg-gradient-to-r from-blue-500 to-teal-500 text-white py-3.5 px-4 rounded-2xl hover:shadow-[0_0_30px_rgba(20,184,166,0.5)] transition-all duration-300 font-semibold text-sm shadow-lg"
            >
              I Understand
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const InlineMedicalDisclaimer: React.FC = () => {
  return (
    <div className="backdrop-blur-xl bg-blue-50/50 border border-blue-200/50 rounded-2xl p-4 mb-4">
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
          <Info className="w-4 h-4 text-blue-600" />
        </div>
        <div className="text-sm text-blue-900/80">
          <p className="font-semibold mb-1 text-blue-900">Educational Information Only</p>
          <p className="leading-relaxed">
            This information is educational only and does not constitute medical advice.
            For all health concerns, emergencies, or medical decisions,
            contact your veterinarian immediately.
          </p>
        </div>
      </div>
    </div>
  );
};