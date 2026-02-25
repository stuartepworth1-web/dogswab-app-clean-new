import React from 'react';
import { FileText, Bell, Sparkles, MessageSquare, Shield, Stethoscope, Info, Upload, Brain, BellRing, Database } from 'lucide-react';
import { Pet } from '../types';

interface HomeScreenProps {
  pets: Pet[];
  onNavigateToDocuments: () => void;
  onNavigateToReminders: () => void;
  onNavigateToVetHistory: () => void;
  onNavigateToChat: () => void;
  onNavigateToInsurance: () => void;
  documentCount: number;
  upcomingReminders: number;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  pets,
  onNavigateToDocuments,
  onNavigateToReminders,
  onNavigateToVetHistory,
  onNavigateToChat,
  onNavigateToInsurance,
  documentCount,
  upcomingReminders
}) => {
  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden w-full max-w-full bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <div className="backdrop-blur-xl bg-white/70 border-b border-white/40 px-6 py-4 safe-area-top flex-shrink-0 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">🐾</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">DOGSWAB</h1>
            <p className="text-xs text-gray-600">Pet Health Document Manager</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-6 w-full pb-8">
        <div className="max-w-4xl mx-auto py-6 sm:py-8 space-y-6">

          <div className="text-center mb-8 px-4">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-teal-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <FileText className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
              Your Pet's Health Hub
            </h2>
            <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto text-base">
              Store medical records, get smart reminders, and receive personalized insights for your pet's health journey.
            </p>
          </div>

          <div className="backdrop-blur-xl bg-blue-50/50 border border-blue-200/50 rounded-3xl p-5 mx-2 shadow-lg">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Info className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-sm text-blue-900/80 leading-relaxed">
                <p className="font-semibold text-blue-900 mb-2">Educational Tool</p>
                <p>DOGSWAB is a document organizer and veterinary directory. This app does not provide medical advice. Always consult a licensed veterinarian for health concerns.</p>
              </div>
            </div>
          </div>

          <div className="backdrop-blur-xl bg-white/60 border border-white/40 rounded-3xl p-6 mx-2 shadow-xl">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-teal-500" />
              <span>How DOGSWAB Works</span>
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-1">Upload Documents</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Store vaccination records, lab results, and prescriptions securely in one place.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-1">Smart Analysis</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Our system reads your documents to extract dates, medications, and health data automatically.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <BellRing className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-1">Smart Reminders</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Get push notifications for upcoming checkups, vaccinations, and medication refills based on your documents.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-1">Personalized AI</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    The AI assistant learns from your pet's medical history to provide tailored educational information specific to their breed, age, and conditions.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 px-2">
            <h3 className="text-lg font-bold text-gray-800 mb-4 px-2">Quick Access</h3>

            <button
              onClick={onNavigateToDocuments}
              className="w-full backdrop-blur-xl bg-white/70 border border-white/40 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 text-left group hover:scale-[1.02]"
            >
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 text-base sm:text-lg">Medical Documents</h3>
                  <p className="text-gray-600 mt-1 text-sm">
                    {documentCount} document{documentCount !== 1 ? 's' : ''} stored
                  </p>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            <button
              onClick={onNavigateToReminders}
              className="w-full backdrop-blur-xl bg-white/70 border border-white/40 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 text-left group hover:scale-[1.02]"
            >
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300">
                  <Bell className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 text-base sm:text-lg">Health Reminders</h3>
                  <p className="text-gray-600 mt-1 text-sm">
                    {upcomingReminders} upcoming reminder{upcomingReminders !== 1 ? 's' : ''}
                  </p>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-teal-500 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            <button
              onClick={onNavigateToVetHistory}
              className="w-full backdrop-blur-xl bg-white/70 border border-white/40 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 text-left group hover:scale-[1.02]"
            >
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300">
                  <Stethoscope className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 text-base sm:text-lg">Veterinary Directory</h3>
                  <p className="text-gray-600 mt-1 text-sm">
                    Find licensed vets nearby
                  </p>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            <button
              onClick={onNavigateToInsurance}
              className="w-full backdrop-blur-xl bg-white/70 border border-white/40 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 text-left group hover:scale-[1.02]"
            >
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 text-base sm:text-lg">Pet Insurance</h3>
                  <p className="text-gray-600 mt-1 text-sm">
                    Compare insurance quotes
                  </p>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>

          <div className="backdrop-blur-xl bg-gradient-to-br from-blue-500/10 to-teal-500/10 border border-blue-200/30 rounded-3xl overflow-hidden mx-2 shadow-lg">
            <div className="px-6 py-4 border-b border-blue-200/30">
              <h3 className="font-bold text-gray-800 text-base">Additional Tools</h3>
            </div>
            <button
              onClick={onNavigateToChat}
              className="w-full text-left px-6 py-4 hover:bg-white/30 transition-all duration-300 group flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <MessageSquare className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-gray-800 font-semibold text-sm">AI Educational Assistant</p>
                  <p className="text-gray-600 text-xs">General pet care information</p>
                </div>
              </div>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="mt-8 px-4">
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => window.open('/privacy.html', '_blank')}
                className="text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
              >
                Privacy Policy
              </button>
              <span className="text-gray-400">•</span>
              <button
                onClick={() => window.open('/terms.html', '_blank')}
                className="text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
              >
                Terms of Use
              </button>
              <span className="text-gray-400">•</span>
              <button
                onClick={() => window.open('/support.html', '_blank')}
                className="text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
              >
                Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
