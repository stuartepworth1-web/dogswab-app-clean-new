import React, { useState, useRef, useEffect } from 'react';
import { Send, Menu, Heart, Stethoscope, Camera, Calendar, Shield, Activity, Brain, Plus, AlertTriangle, Upload, FileText } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { Message, Pet } from '../types';
import { VoiceInput } from './VoiceInput';
import { NotificationSystem } from './NotificationSystem';
import { InlineMedicalDisclaimer } from './MedicalDisclaimer';

interface ChatInterfaceProps {
  messages: Message[];
  pets: Pet[];
  selectedPetId: string | null;
  onSendMessage: (content: string, petId?: string) => void;
  onPetSelect: (petId: string | null) => void;
  isLoading: boolean;
  onToggleSidebar: () => void;
  onPhotoAnalysis: () => void;
  onBookVet: () => void;
  onInsuranceQuotes: () => void;
  onNavigateToDocuments?: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  pets,
  selectedPetId,
  onSendMessage,
  onPetSelect,
  isLoading,
  onToggleSidebar,
  onPhotoAnalysis,
  onBookVet,
  onInsuranceQuotes,
  onNavigateToDocuments
}) => {
  const [input, setInput] = useState('');
  const [petDocumentCount, setPetDocumentCount] = useState<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const selectedPet = pets.find(pet => pet.id === selectedPetId);

  const isMobile = Capacitor.isNativePlatform();

  // Check for documents when pet changes
  useEffect(() => {
    if (selectedPetId) {
      const storedDocs = localStorage.getItem(`pet_documents_${selectedPetId}`);
      const docs = storedDocs ? JSON.parse(storedDocs) : [];
      setPetDocumentCount(docs.length);
    } else {
      setPetDocumentCount(0);
    }
  }, [selectedPetId]);

  useEffect(() => {
    // Scroll to bottom when messages change
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        // Get the parent scrollable container
        const scrollContainer = messagesEndRef.current.closest('.overflow-y-auto');
        if (scrollContainer) {
          // Scroll the container to the bottom
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
      }
    };

    // Immediate scroll
    scrollToBottom();

    // Delayed scroll to handle any delayed rendering
    const timeoutId = setTimeout(scrollToBottom, 100);

    return () => clearTimeout(timeoutId);
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input.trim(), selectedPetId);
      setInput('');
    }
  };

  const quickActions = [
    {
      icon: <Camera className="w-7 h-7" />,
      title: "Photo Analysis",
      subtitle: "AI symptom detection",
      color: "bg-blue-500",
      onClick: onPhotoAnalysis
    },
    {
      icon: <Stethoscope className="w-7 h-7" />,
      title: "Book Vet",
      subtitle: "Professional consultation",
      color: "bg-mint-500",
      onClick: onBookVet
    },
    {
      icon: <Shield className="w-7 h-7" />,
      title: "Insurance",
      subtitle: "Coverage options",
      color: "bg-orange-500",
      onClick: onInsuranceQuotes
    }
  ];

  const commonQuestions = [
    "My pet seems lethargic today",
    "Changes in eating habits",
    "Unusual behavior patterns",
    "Skin irritation concerns"
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-white w-full max-w-full overflow-hidden">
      {/* Clean Professional Header */}
      <div className="liquid-nav border-b border-white/20 px-4 py-3 safe-area-top flex-shrink-0 shadow-sm z-10">
        <div className="flex items-center justify-between w-full">
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-2xl liquid-glass transition-colors"
          >
            <Menu className="w-5 h-5 text-dogswab-navy" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 liquid-glass rounded-2xl flex items-center justify-center">
              <span className="text-xl">💬</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-dogswab-navy">AI Educational Assistant</h1>
              <p className="text-xs text-dogswab-navy/70">General Pet Care Information Only</p>
            </div>
          </div>
          
          {pets.length > 0 && (
            <select
              value={selectedPetId || ''}
              onChange={(e) => onPetSelect(e.target.value || null)}
              className="px-3 py-2 liquid-glass border border-white/30 rounded-2xl text-sm font-medium text-dogswab-navy focus:ring-2 focus:ring-dogswab-mint focus:border-transparent max-w-[120px] sm:max-w-none"
            >
              <option value="">Select Pet</option>
              {pets.map((pet) => (
                <option key={pet.id} value={pet.id}>
                  {pet.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-scroll overflow-x-hidden liquid-glass px-2 sm:px-4 w-full min-h-0 relative" style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch', height: 'calc(100% - 200px)' }}>
        {messages.length === 0 ? (
          <div className="max-w-2xl mx-auto py-6 sm:py-8 min-h-full flex flex-col justify-start">
            {/* Professional Welcome Section */}
            <div className="text-center mb-6 sm:mb-8 px-4">
              <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🐾</span>
              </div>
              <div className="w-20 h-20 bg-mint-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg animate-float">
                <span className="text-white font-bold text-2xl">🐾</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-dogswab-navy mb-2">
                Pet Health Education & Information
              </h2>
              <p className="text-dogswab-navy/70 leading-relaxed max-w-md mx-auto text-sm sm:text-base mb-4">
                Get general pet health information and connect with veterinarians.
                For medical advice, always consult a licensed veterinarian.
              </p>

              {/* Educational Feature Highlight */}
              <div className="max-w-lg mx-auto mt-6 p-4 bg-gradient-to-r from-dogswab-mint/20 to-dogswab-navy/20 rounded-2xl border-2 border-dogswab-mint/30 animate-fade-in">
                <div className="flex items-start gap-3 text-left">
                  <div className="flex-shrink-0 w-10 h-10 bg-dogswab-mint rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-dogswab-navy text-sm sm:text-base mb-1">
                      💡 Get Personalized Insights
                    </h3>
                    <p className="text-xs sm:text-sm text-dogswab-navy/80 leading-relaxed">
                      <strong>DOGSWAB's key feature:</strong> Upload your pet's medical records and documents.
                      The AI uses this context to provide tailored educational information specific to your pet's health history,
                      helping you understand their unique situation better.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Quick Actions */}
            <div className="grid gap-3 sm:gap-4 mb-6 sm:mb-8 px-2 sm:px-4 max-w-full">
              {quickActions.map((action, index) => (
                <React.Fragment key={index}>
                  <button
                    onClick={action.onClick}
                    className="w-full p-3 sm:p-4 lg:p-6 liquid-glass rounded-2xl sm:rounded-3xl liquid-card-hover transition-all duration-400 text-left group animate-fade-in hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className={`w-12 h-12 sm:w-14 sm:h-14 ${action.color} rounded-3xl flex items-center justify-center text-white shadow-lg flex-shrink-0 group-hover:scale-110 transition-all duration-400`}>
                        {action.icon}
                      </div>
                      <div className="flex-1 min-w-0 overflow-hidden">
                        <h3 className="font-semibold text-dogswab-navy text-sm sm:text-base lg:text-lg truncate">{action.title}</h3>
                        <p className="text-dogswab-navy/60 mt-0.5 sm:mt-1 font-medium text-xs sm:text-sm lg:text-base truncate">{action.subtitle}</p>
                      </div>
                      <div className="w-8 h-8 rounded-full liquid-glass flex items-center justify-center flex-shrink-0 group-hover:bg-dogswab-mint group-hover:text-white transition-all duration-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </button>
                </React.Fragment>
              ))}
            </div>

            {/* Prominent Medical Disclaimer */}
            <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-4 mx-4 mb-6 shadow-lg">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-700">
                  <p className="font-bold mb-2 text-base">⚠️ MEDICAL DISCLAIMER - READ CAREFULLY</p>
                  <p className="font-semibold mb-2">This app provides EDUCATIONAL INFORMATION ONLY and does NOT provide medical advice, diagnosis, or treatment.</p>
                  <p className="mb-2">DOGSWAB cannot replace professional veterinary examination. For ALL health concerns, symptoms, or emergencies, consult a licensed veterinarian immediately.</p>
                  <p className="font-semibold">In emergencies, contact your veterinarian or emergency animal hospital RIGHT NOW.</p>
                </div>
              </div>
            </div>

            {/* Professional Common Questions */}
            <div className="liquid-glass rounded-3xl shadow-xl overflow-hidden border border-white/30 mx-4">
              <div className="px-6 py-4 border-b border-white/30 liquid-glass-button">
                <h3 className="font-semibold text-white text-base sm:text-lg">General Pet Care Topics</h3>
              </div>
              <div className="divide-y divide-white/20">
                {commonQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => onSendMessage(question, selectedPetId)}
                    className="w-full text-left px-4 sm:px-6 py-3 sm:py-4 hover:bg-dogswab-mint/10 transition-all duration-300 group"
                  >
                    <p className="text-dogswab-navy font-medium group-hover:text-dogswab-navy/80 text-sm sm:text-base">{question}</p>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Medical Disclaimer */}
            <div className="mt-6 px-4">
              <InlineMedicalDisclaimer />
              <div className="text-center mt-4 space-y-2">
                <button
                  onClick={() => window.open('/privacy.html', '_blank')}
                  className="block w-full text-dogswab-navy/60 hover:text-dogswab-navy text-sm underline bg-white/20 py-2 px-4 rounded-lg"
                >
                  Privacy Policy
                </button>
                <button
                  onClick={() => window.open('/terms.html', '_blank')}
                  className="block w-full text-dogswab-navy/60 hover:text-dogswab-navy text-sm underline bg-white/20 py-2 px-4 rounded-lg"
                >
                  Terms of Use
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto py-4 space-y-4 min-h-full">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="max-w-[85%] sm:max-w-[80%]">
                  {message.sender === 'user' ? (
                    <div className="liquid-glass-button text-white px-4 sm:px-6 py-3 sm:py-4 rounded-3xl rounded-br-xl shadow-lg">
                      <p className="text-sm sm:text-base leading-relaxed font-medium">{message.content}</p>
                    </div>
                  ) : (
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 liquid-glass-button rounded-3xl flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
                        <span className="text-white">🤖</span>
                      </div>
                      <div className="liquid-glass px-4 sm:px-6 py-3 sm:py-4 rounded-3xl rounded-bl-xl shadow-lg border border-white/40">
                        <div className="text-dogswab-navy text-sm sm:text-base leading-relaxed font-medium whitespace-pre-wrap">
                          {message.content}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {isLoading && (
          <div className="flex justify-start max-w-2xl mx-auto px-2 sm:px-4 mb-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 liquid-glass-button rounded-3xl flex items-center justify-center flex-shrink-0 mt-1 shadow-lg animate-pulse-slow">
                <span className="text-white">🤖</span>
              </div>
              <div className="liquid-glass px-4 sm:px-6 py-3 sm:py-4 rounded-3xl rounded-bl-xl shadow-lg border border-white/40 shimmer">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-dogswab-mint rounded-full animate-bounce-gentle"></div>
                    <div className="w-2 h-2 bg-dogswab-mint rounded-full animate-bounce-gentle" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-dogswab-mint rounded-full animate-bounce-gentle" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                  <span className="text-dogswab-navy/70 text-sm font-medium">Analyzing...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Scroll anchor with padding to ensure it's always visible */}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Professional Input Bar */}
      <div className="liquid-glass border-t border-white/30 p-4 sm:p-6 safe-area-bottom flex-shrink-0 shadow-2xl">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto w-full">
          {/* Document Reminder/Upload Button */}
          {selectedPetId && petDocumentCount === 0 && onNavigateToDocuments && (
            <div className="mb-3 p-3 liquid-glass border border-dogswab-mint/30 rounded-2xl">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <FileText className="w-5 h-5 text-dogswab-mint flex-shrink-0" />
                  <p className="text-sm text-dogswab-navy font-medium truncate">
                    Upload {selectedPet?.name}'s medical records for better insights
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onNavigateToDocuments}
                  className="flex items-center gap-2 px-4 py-2 liquid-glass-button text-white rounded-xl hover:scale-105 transition-all duration-300 flex-shrink-0 text-sm font-semibold"
                >
                  <Upload className="w-4 h-4" />
                  Upload
                </button>
              </div>
            </div>
          )}

          <div className="flex items-end space-x-3">
            <VoiceInput
              onTranscript={(text) => {
                setInput(text);
                // Auto-send voice messages for better UX
                if (text.trim()) {
                  onSendMessage(text.trim(), selectedPetId);
                  setInput('');
                }
              }}
            />
            <div className="flex-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={selectedPet ? `Ask about ${selectedPet.name}...` : "Describe symptoms, upload photos, or ask questions..."}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 liquid-glass border border-white/40 rounded-3xl focus:ring-2 focus:ring-dogswab-mint focus:border-transparent text-sm sm:text-base text-dogswab-navy placeholder-dogswab-navy/50 font-medium shadow-sm"
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-12 h-12 sm:w-14 sm:h-14 liquid-glass-button text-white rounded-3xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0 hover:scale-105 transition-all duration-300"
            >
              <Send className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};