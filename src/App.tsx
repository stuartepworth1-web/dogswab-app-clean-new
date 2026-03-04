import React, { useState, useCallback, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { ErrorBoundary } from './components/ErrorBoundary';
import { OfflineIndicator } from './components/OfflineIndicator';
import { MedicalDisclaimer } from './components/MedicalDisclaimer';
import { UserAuth } from './components/UserAuth';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsOfService } from './components/TermsOfService';
import { AccessibilityFeatures } from './components/AccessibilityFeatures';
import { SubscriptionManagement } from './components/SubscriptionManagement';
import { AppStoreCompliance } from './components/AppStoreCompliance';
import { Sidebar } from './components/Sidebar';
import { ChatInterface } from './components/ChatInterface';
import { PetManagement } from './components/PetManagement';
import { HealthDashboard } from './components/HealthDashboard';
import { SubscriptionModal } from './components/SubscriptionModal';
import { PetOnboarding } from './components/PetOnboarding';
import { VetRegistration } from './components/VetRegistration';
import { InsuranceQuotes } from './components/InsuranceQuotes';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage';
import PetDocuments from './components/PetDocuments';
import VetHistory from './components/VetHistory';
import HealthRecommendations from './components/HealthRecommendations';
import SplashScreen from './components/SplashScreen';
import { useLocalStorage } from './hooks/useLocalStorage';
import { generateAIResponse, categorizeMessage } from './services/aiService';
import { Pet, Chat, Message, Subscription, HealthRecord, VetAppointment } from './types';
import { ReminderService } from './services/reminderService';
import { ReminderPrompt } from './components/ReminderPrompt';
import { authService, User } from './services/supabaseClient';

type View = 'documents' | 'chat' | 'pets' | 'health' | 'vet-registration' | 'privacy-policy' | 'vet-history' | 'recommendations';

function App() {
  // Splash Screen
  const [showSplash, setShowSplash] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);

  // User Authentication
  const [user, setUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showMedicalDisclaimer, setShowMedicalDisclaimer] = useLocalStorage<boolean>('dogswab-medical-disclaimer-accepted', false);

  // Legal & Accessibility
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTermsOfService, setShowTermsOfService] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [showSubscriptionManagement, setShowSubscriptionManagement] = useState(false);
  
  const [pets, setPets] = useLocalStorage<Pet[]>('dogswab-pets', []);
  const [chats, setChats] = useLocalStorage<Chat[]>('dogswab-chats', []);
  const [healthRecords, setHealthRecords] = useLocalStorage<HealthRecord[]>('dogswab-health-records', []);
  const [subscription, setSubscription] = useLocalStorage<Subscription>('dogswab-subscription', {
    id: 'free',
    tier: 'free',
    status: 'active',
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    consultationsUsed: 0,
    consultationsLimit: 5
  });
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useLocalStorage<boolean>('dogswab-onboarding', false);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [selectedHealthPetId, setSelectedHealthPetId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<View>('documents');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showVetRegistration, setShowVetRegistration] = useState(false);
  const [showInsuranceQuotes, setShowInsuranceQuotes] = useState(false);
  const [insuranceQuotePet, setInsuranceQuotePet] = useState<Pet | null>(null);
  const [showReminderPrompt, setShowReminderPrompt] = useState(false);
  const [reminderSuggestions, setReminderSuggestions] = useState<Array<{
    title: string;
    message: string;
    timeInMinutes: number;
    type: 'checkup' | 'medication' | 'feeding' | 'exercise' | 'vet_followup' | 'general';
  }>>([]);
  const [showComplianceModal, setShowComplianceModal] = useState(false);
  const [revenueStats, setRevenueStats] = useLocalStorage('dogswab-revenue', {
    totalRevenue: 0,
    monthlyRevenue: 0,
    subscriptionRevenue: 0,
    vetCommissions: 0,
    insuranceCommissions: 0
  });

  const selectedChat = chats.find(chat => chat.id === selectedChatId);
  const selectedHealthPet = pets.find(pet => pet.id === selectedHealthPetId);
  const isMobile = Capacitor.isNativePlatform();

  // Check for existing authentication session
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();

    const { data: authListener } = authService.onAuthStateChange((newUser) => {
      setUser(newUser);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Show medical disclaimer on first use
  useEffect(() => {
    const hasAcceptedDisclaimer = localStorage.getItem('dogswab-medical-disclaimer-accepted');
    const hasSeenCompliance = localStorage.getItem('dogswab-compliance-seen');

    if (!hasAcceptedDisclaimer || hasAcceptedDisclaimer !== 'true') {
      setShowMedicalDisclaimer(true);
    } else if (!hasSeenCompliance) {
      setShowComplianceModal(true);
    }
  }, []);

  const handleAcceptDisclaimer = () => {
    localStorage.setItem('dogswab-medical-disclaimer-accepted', 'true');
    setShowMedicalDisclaimer(false);
  };

  const handleDeclineDisclaimer = () => {
    alert('You must accept the medical disclaimer to use DOGSWAB.');
    // In production, you might redirect to a different page or close the app
  };

  const handleAuthSuccess = (userData: User) => {
    setUser(userData);
    setShowAuth(false);
  };

  const createNewChat = useCallback(() => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'New Consultation',
      messages: [],
      petId: selectedPetId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setChats(prev => [newChat, ...prev]);
    setSelectedChatId(newChat.id);
    setCurrentView('chat');
    setSidebarOpen(false);
  }, [selectedPetId, setChats]);

  const sendMessage = useCallback(async (content: string, petId?: string) => {
    // Check subscription limits
    if (subscription.consultationsUsed >= subscription.consultationsLimit) {
      setShowSubscriptionModal(true);
      return;
    }

    let chatId = selectedChatId;
    
    // Create new chat if none exists
    if (!chatId) {
      const newChat: Chat = {
        id: Date.now().toString(),
        title: 'New Consultation',
        messages: [],
        petId: petId || selectedPetId,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      setChats(prev => [newChat, ...prev]);
      setSelectedChatId(newChat.id);
      chatId = newChat.id;
    }

    console.log('Sending message:', content);
    
    const finalPetId = petId || selectedPetId;
    const category = categorizeMessage(content);
    const pet = pets.find(p => p.id === finalPetId);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
      petId: finalPetId,
      category
    };

    // Generate intelligent chat title from first message
    const generateChatTitle = (message: string, petName?: string): string => {
      const lower = message.toLowerCase();

      // Check for common topics and generate descriptive titles
      if (lower.includes('vomit') || lower.includes('threw up')) {
        return petName ? `${petName} - Vomiting Issue` : 'Vomiting Issue';
      } else if (lower.includes('diarrhea') || lower.includes('loose stool')) {
        return petName ? `${petName} - Digestive Issue` : 'Digestive Issue';
      } else if (lower.includes('scratch') || lower.includes('itch')) {
        return petName ? `${petName} - Skin/Itching` : 'Skin/Itching Issue';
      } else if (lower.includes('limp') || lower.includes('leg') || lower.includes('walk')) {
        return petName ? `${petName} - Mobility Concern` : 'Mobility Concern';
      } else if (lower.includes('eat') || lower.includes('appetite') || lower.includes('food')) {
        return petName ? `${petName} - Eating Habits` : 'Eating Habits';
      } else if (lower.includes('cough') || lower.includes('sneez') || lower.includes('breath')) {
        return petName ? `${petName} - Respiratory` : 'Respiratory Issue';
      } else if (lower.includes('behav') || lower.includes('aggress') || lower.includes('anxiety')) {
        return petName ? `${petName} - Behavior` : 'Behavior Concern';
      } else if (lower.includes('eye') || lower.includes('ear')) {
        return petName ? `${petName} - Eye/Ear Issue` : 'Eye/Ear Issue';
      } else if (lower.includes('weight') || lower.includes('fat') || lower.includes('thin')) {
        return petName ? `${petName} - Weight Concern` : 'Weight Concern';
      } else if (lower.includes('vaccine') || lower.includes('shot')) {
        return petName ? `${petName} - Vaccination` : 'Vaccination Query';
      } else if (lower.includes('tick') || lower.includes('flea') || lower.includes('parasite')) {
        return petName ? `${petName} - Parasite Issue` : 'Parasite Issue';
      } else {
        // Default: use first 40 chars
        const shortMessage = message.slice(0, 40).trim();
        return petName
          ? `${petName} - ${shortMessage}${message.length > 40 ? '...' : ''}`
          : shortMessage + (message.length > 40 ? '...' : '');
      }
    };

    // Update chat with user message
    setChats(prev => prev.map(chat =>
      chat.id === chatId
        ? {
            ...chat,
            messages: [...chat.messages, userMessage],
            title: chat.messages.length === 0 ? generateChatTitle(content, pet?.name) : chat.title,
            updatedAt: new Date(),
            petId: finalPetId
          }
        : chat
    ));

    setIsLoading(true);

    try {
      console.log('Calling generateAIResponse...');
      const aiResponse = await generateAIResponse(content, category, pet?.name, pet);
      console.log('Received AI response:', aiResponse.substring(0, 100) + '...');
      
      // Ensure we have a valid response
      if (!aiResponse || aiResponse.trim() === '') {
        throw new Error('Empty response from AI service');
      }
      
      console.log('Full AI response received:', aiResponse);
      
      // Parse AI response for reminder suggestions
      const suggestions = ReminderService.parseAIResponseForReminders(aiResponse, finalPetId);
      if (suggestions.length > 0) {
        setReminderSuggestions(suggestions);
        setShowReminderPrompt(true);
      }
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
        petId: finalPetId
      };

      console.log('Adding AI message to chat:', aiMessage);

      // Preserve the title when adding AI response
      setChats(prev => prev.map(chat =>
        chat.id === chatId
          ? {
              ...chat,
              messages: [...chat.messages, aiMessage],
              title: chat.title, // Explicitly preserve the title
              updatedAt: new Date()
            }
          : chat
      ));

      // Update consultation count
      setSubscription(prev => ({
        ...prev,
        consultationsUsed: prev.consultationsUsed + 1
      }));
    } catch (error) {
      console.error('Error generating AI response:', error);
      
      // Add error message to chat
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `❌ I apologize, but I'm having trouble processing your request right now. This could be due to:\n\n• Network connectivity issues\n• API service temporarily unavailable\n• Configuration problems\n\nPlease try again in a moment. If the problem persists, check your internet connection or contact support.\n\nError details: ${error instanceof Error ? error.message : 'Unknown error'}`,
        sender: 'ai',
        timestamp: new Date(),
        petId: finalPetId
      };

      setChats(prev => prev.map(chat =>
        chat.id === chatId
          ? {
              ...chat,
              messages: [...chat.messages, errorMessage],
              title: chat.title, // Explicitly preserve the title
              updatedAt: new Date()
            }
          : chat
      ));
    } finally {
      setIsLoading(false);
    }
  }, [selectedChatId, selectedPetId, pets, setChats, subscription, setSubscription]);

  const addPet = useCallback((petData: Omit<Pet, 'id'>) => {
    const newPet: Pet = {
      ...petData,
      id: Date.now().toString()
    };
    setPets(prev => [...prev, newPet]);
    setSelectedPetId(newPet.id); // Auto-select the newly added pet
  }, [setPets]);

  const updatePet = useCallback((id: string, updates: Partial<Pet>) => {
    setPets(prev => prev.map(pet => 
      pet.id === id ? { ...pet, ...updates } : pet
    ));
  }, [setPets]);

  const deletePet = useCallback((id: string) => {
    setPets(prev => prev.filter(pet => pet.id !== id));
    // Also remove pet from any chats
    setChats(prev => prev.map(chat => ({
      ...chat,
      petId: chat.petId === id ? undefined : chat.petId,
      messages: chat.messages.map(msg => ({
        ...msg,
        petId: msg.petId === id ? undefined : msg.petId
      }))
    })));
  }, [setPets, setChats]);

  const handleOnboardingComplete = useCallback((petData: Omit<Pet, 'id'>) => {
    addPet(petData);
    setHasCompletedOnboarding(true);
  }, [addPet, setHasCompletedOnboarding]);

  const handleSkipOnboarding = useCallback(() => {
    setHasCompletedOnboarding(true);
  }, [setHasCompletedOnboarding]);

  const handleSubscribe = useCallback(async (tier: string) => {
    try {
      // On mobile, ALWAYS use native In-App Purchases (Apple requirement)
      if (isMobile) {
        console.log('Using native IAP for mobile subscription:', tier);
        const { handlePurchaseFromAppStore } = await import('./services/iapService');
        const result = await handlePurchaseFromAppStore(tier);

        if (result.success) {
          // Update subscription in state
          const consultationsLimit = tier === 'basic' ? 50 : -1;
          setSubscription(prev => ({
            ...prev,
            tier: tier as 'free' | 'basic' | 'premium' | 'pro',
            status: 'active',
            consultationsLimit,
            consultationsUsed: 0,
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          }));

          setShowSubscriptionModal(false);
          alert(`✅ Subscription activated!\n\nPlan: ${tier}\nThank you for subscribing to DOGSWAB!`);
        } else {
          throw new Error(result.error || 'Purchase failed');
        }
        return;
      }

      // Web version: subscriptions only available in iOS App
      alert('⚠️ Subscriptions are only available in the iOS app.\n\nPlease download DOGSWAB from the App Store to subscribe.');

    } catch (error) {
      console.error('Subscription error:', error);
      alert(`Subscription failed: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again or contact support@dogswab.com`);
    }
  }, [isMobile, setSubscription, user]);

  const handleVetRegistrationSuccess = useCallback((vetId: string) => {
    alert(`🎉 Veterinarian registration successful! 
    
Welcome to the DOGSWAB marketplace! Your profile is under review and will be activated within 24 hours.
    
Vet ID: ${vetId}
Commission Rate: 15%
Expected monthly earnings: $2,000-$8,000`);
    setShowVetRegistration(false);
  }, []);

  const handleInsuranceCommission = useCallback((commission: number) => {
    setRevenueStats(prev => ({
      ...prev,
      insuranceCommissions: prev.insuranceCommissions + commission,
      monthlyRevenue: prev.monthlyRevenue + commission,
      totalRevenue: prev.totalRevenue + commission
    }));
  }, [setRevenueStats]);

  const addHealthRecord = useCallback((record: Omit<HealthRecord, 'id'>) => {
    const newRecord: HealthRecord = {
      ...record,
      id: Date.now().toString()
    };
    setHealthRecords(prev => [...prev, newRecord]);
  }, [setHealthRecords]);

  const bookAppointment = useCallback((appointment: Omit<VetAppointment, 'id'>) => {
    const commission = appointment.price * 0.15; // 15% commission
    
    // Update revenue stats
    setRevenueStats(prev => ({
      ...prev,
      vetCommissions: prev.vetCommissions + commission,
      monthlyRevenue: prev.monthlyRevenue + commission,
      totalRevenue: prev.totalRevenue + commission
    }));
    
    console.log(`Vet booking commission earned: $${commission.toFixed(2)}`);
  }, [setRevenueStats]);

  const showInsuranceForPet = useCallback((pet: Pet) => {
    setInsuranceQuotePet(pet);
    setShowInsuranceQuotes(true);
  }, []);

  // Show splash screen on app startup
  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login screen if user is not authenticated
  if (!user) {
    return (
      <ErrorBoundary>
        <OfflineIndicator />
        <UserAuth
          onAuthSuccess={(userData) => {
            setUser(userData);
            setShowAuth(false);
          }}
          onClose={() => {}}
        />
      </ErrorBoundary>
    );
  }

  // Show onboarding if user hasn't completed it and has no pets
  if (!hasCompletedOnboarding && pets.length === 0) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen overflow-y-auto">
          <OfflineIndicator />
          <PetOnboarding
            onAddPet={handleOnboardingComplete}
            onSkip={handleSkipOnboarding}
          />

          {/* Medical Disclaimer */}
          <MedicalDisclaimer
            isOpen={showMedicalDisclaimer}
            onAccept={handleAcceptDisclaimer}
            onDecline={handleDeclineDisclaimer}
          />
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#2d2f63' }}>
        <OfflineIndicator />
        
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          chats={chats}
          pets={pets}
          selectedChatId={selectedChatId}
          onChatSelect={(chatId) => {
            setSelectedChatId(chatId);
            setCurrentView('chat');
            setSidebarOpen(false);
          }}
          onNewChat={createNewChat}
          onPetManagement={() => {
            setCurrentView('pets');
            setSidebarOpen(false);
          }}
          onHealthDashboard={(petId) => {
            setSelectedHealthPetId(petId);
            setCurrentView('health');
            setSidebarOpen(false);
          }}
          onUpgrade={() => setShowSubscriptionModal(true)}
          onVetRegistration={() => setShowVetRegistration(true)}
          onInsuranceQuotes={showInsuranceForPet}
          onDocuments={() => {
            setCurrentView('documents');
            setSidebarOpen(false);
          }}
          onVetHistory={() => {
            setCurrentView('vet-history');
            setSidebarOpen(false);
          }}
          onRecommendations={() => {
            setCurrentView('recommendations');
            setSidebarOpen(false);
          }}
          subscriptionTier={subscription.tier}
          consultationsUsed={subscription.consultationsUsed}
          consultationsLimit={subscription.consultationsLimit}
        />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden w-full max-w-full">
          {currentView === 'documents' ? (
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-white">
              <div className="max-w-7xl mx-auto">
                <PetDocuments
                  userId={user?.id || 'guest'}
                  pets={pets}
                  isPremium={subscription.tier === 'premium'}
                  onUpgrade={() => setShowSubscriptionModal(true)}
                />
              </div>
            </div>
          ) : currentView === 'chat' ? (
            <ChatInterface
              messages={selectedChat?.messages || []}
              pets={pets}
              selectedPetId={selectedPetId}
              onSendMessage={sendMessage}
              onPetSelect={setSelectedPetId}
              isLoading={isLoading}
              onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
              onPhotoAnalysis={() => {
                if (pets.length > 0) {
                  setSelectedHealthPetId(pets[0].id);
                  setCurrentView('health');
                } else {
                  setCurrentView('pets');
                }
              }}
              onBookVet={() => {
                if (pets.length > 0) {
                  setSelectedHealthPetId(pets[0].id);
                  setCurrentView('health');
                } else {
                  setCurrentView('pets');
                }
              }}
              onInsuranceQuotes={() => {
                if (pets.length > 0) {
                  showInsuranceForPet(pets[0]);
                } else {
                  setCurrentView('pets');
                }
              }}
              onNavigateToDocuments={() => setCurrentView('documents')}
            />
          ) : currentView === 'pets' ? (
            <PetManagement
              pets={pets}
              onAddPet={addPet}
              onUpdatePet={updatePet}
              onDeletePet={deletePet}
              onBack={() => setCurrentView('documents')}
            />
          ) : (currentView === 'health' && selectedHealthPet) ? (
            <HealthDashboard
              pet={selectedHealthPet}
              healthRecords={healthRecords}
              onBack={() => setCurrentView('documents')}
              onAddRecord={addHealthRecord}
              onBookAppointment={bookAppointment}
              onInsuranceCommission={handleInsuranceCommission}
            />
          ) : currentView === 'vet-registration' ? (
            <div className="flex-1 flex items-center justify-center p-4 sm:p-8 overflow-y-auto">
              <div className="text-center max-w-2xl">
                <h1 className="text-2xl sm:text-4xl font-bold text-gpt-text mb-4">Join Our Veterinary Network</h1>
                <p className="text-lg sm:text-xl text-gpt-text-secondary mb-6 sm:mb-8 px-4">
                  Connect with pet owners and grow your practice with our 15% commission marketplace
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                  <div className="bg-gpt-lighter rounded-lg p-4 sm:p-6">
                    <h3 className="font-semibold text-gpt-text mb-2 text-sm sm:text-base">Earn More</h3>
                    <p className="text-sm text-gpt-text-secondary">Average vets earn $2,000-$8,000/month through our platform</p>
                  </div>
                  <div className="bg-gpt-lighter rounded-lg p-4 sm:p-6">
                    <h3 className="font-semibold text-gpt-text mb-2 text-sm sm:text-base">Flexible Schedule</h3>
                    <p className="text-sm text-gpt-text-secondary">Set your own hours and availability</p>
                  </div>
                  <div className="bg-gpt-lighter rounded-lg p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
                    <h3 className="font-semibold text-gpt-text mb-2 text-sm sm:text-base">Grow Your Practice</h3>
                    <p className="text-sm text-gpt-text-secondary">Access to thousands of pet owners</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowVetRegistration(true)}
                  className="bg-gpt-accent text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-gpt-accent-hover transition-colors font-semibold text-base sm:text-lg"
                >
                  Register as Veterinarian
                </button>
                <div className="mt-6">
                  <button
                    onClick={() => setCurrentView('documents')}
                    className="text-gpt-text-secondary hover:text-gpt-text"
                  >
                    ← Back to Chat
                  </button>
                </div>
              </div>
            </div>
          ) : currentView === 'privacy-policy' ? (
            <PrivacyPolicyPage onBack={() => setCurrentView('documents')} />
          ) : currentView === 'vet-history' ? (
            <div className="flex-1 overflow-y-auto p-8 bg-white">
              <div className="max-w-7xl mx-auto">
                <button
                  onClick={() => setCurrentView('documents')}
                  className="mb-6 text-gray-600 hover:text-gray-900 font-medium"
                >
                  ← Back to Chat
                </button>
                <VetHistory
                  userId={user?.id || 'guest'}
                  pets={pets}
                  isPremium={subscription.tier === 'premium'}
                  onUpgrade={() => setShowSubscriptionModal(true)}
                />
              </div>
            </div>
          ) : currentView === 'recommendations' ? (
            <div className="flex-1 overflow-y-auto p-8 bg-white">
              <div className="max-w-7xl mx-auto">
                <button
                  onClick={() => setCurrentView('documents')}
                  className="mb-6 text-gray-600 hover:text-gray-900 font-medium"
                >
                  ← Back to Chat
                </button>
                <HealthRecommendations
                  userId={user?.id || 'guest'}
                  pets={pets}
                  isPremium={subscription.tier === 'premium'}
                  onUpgrade={() => setShowSubscriptionModal(true)}
                />
              </div>
            </div>
          ) : null}
        </div>

        {/* Medical Disclaimer */}
        <MedicalDisclaimer
          isOpen={showMedicalDisclaimer}
          onAccept={handleAcceptDisclaimer}
          onDecline={handleDeclineDisclaimer}
        />

        {/* User Authentication */}
        {showAuth && (
          <UserAuth
            onAuthSuccess={handleAuthSuccess}
            onClose={() => setShowAuth(false)}
          />
        )}

        {/* Legal Documents */}
        <PrivacyPolicy
          isOpen={showPrivacyPolicy}
          onClose={() => setShowPrivacyPolicy(false)}
        />

        <TermsOfService
          isOpen={showTermsOfService}
          onClose={() => setShowTermsOfService(false)}
        />

        {/* Terms and Privacy Links - Required for App Store */}
        <div className="fixed bottom-4 left-4 z-40 space-y-2">
          <button
            onClick={() => window.open('/terms.html', '_blank')}
            className="block text-xs text-white/70 hover:text-white underline bg-black/20 px-2 py-1 rounded"
          >
            Terms of Use
          </button>
          <button
            onClick={() => window.open('/privacy.html', '_blank')}
            className="block text-xs text-white/70 hover:text-white underline bg-black/20 px-2 py-1 rounded"
          >
            Privacy Policy
          </button>
        </div>

        {/* Accessibility Features */}
        <AccessibilityFeatures
          isOpen={showAccessibility}
          onClose={() => setShowAccessibility(false)}
        />

        {/* Subscription Management */}
        {showSubscriptionManagement && (
          <SubscriptionManagement
            subscription={subscription}
            onUpdateSubscription={setSubscription}
            onClose={() => setShowSubscriptionManagement(false)}
          />
        )}

        {/* Subscription Modal */}
        <SubscriptionModal
          isOpen={showSubscriptionModal}
          onClose={() => setShowSubscriptionModal(false)}
          onSubscribe={handleSubscribe}
          currentTier={subscription.tier}
        />

        {/* Vet Registration Modal */}
        <VetRegistration
          isOpen={showVetRegistration}
          onClose={() => setShowVetRegistration(false)}
          onSuccess={handleVetRegistrationSuccess}
        />

        {/* Insurance Quotes Modal */}
        {insuranceQuotePet && (
          <InsuranceQuotes
            pet={insuranceQuotePet}
            isOpen={showInsuranceQuotes}
            onClose={() => {
              setShowInsuranceQuotes(false);
              setInsuranceQuotePet(null);
            }}
            onApplicationSubmit={handleInsuranceCommission}
          />
        )}

        {/* Reminder Prompt Modal */}
        {showReminderPrompt && (
          <ReminderPrompt
            suggestions={reminderSuggestions}
            petId={selectedPetId}
            petName={pets.find(p => p.id === selectedPetId)?.name}
            onClose={() => setShowReminderPrompt(false)}
            onReminderSet={(count) => {
              alert(`✅ ${count} reminder${count !== 1 ? 's' : ''} set! You'll get notified when it's time.`);
            }}
          />
        )}

        {/* App Store Compliance Modal */}
        <AppStoreCompliance
          isOpen={showComplianceModal}
          onClose={() => {
            setShowComplianceModal(false);
            localStorage.setItem('dogswab-compliance-seen', 'true');
          }}
        />

        {/* Revenue Stats (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-4 right-4 bg-gpt-darker border border-gpt-border rounded-lg p-4 text-xs">
            <h4 className="font-semibold text-gpt-text mb-2">💰 Revenue Stats</h4>
            <div className="space-y-1 text-gpt-text-secondary">
              <div>Total: ${revenueStats.totalRevenue.toFixed(2)}</div>
              <div>Monthly: ${revenueStats.monthlyRevenue.toFixed(2)}</div>
              <div>Subscriptions: ${revenueStats.subscriptionRevenue.toFixed(2)}</div>
              <div>Vet Commissions: ${revenueStats.vetCommissions.toFixed(2)}</div>
              <div>Insurance: ${revenueStats.insuranceCommissions.toFixed(2)}</div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
