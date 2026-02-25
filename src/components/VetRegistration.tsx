import React, { useState } from 'react';
import { X, Upload, Check, AlertCircle, User, Building, DollarSign, Calendar } from 'lucide-react';
import { VetRegistration as VetRegistrationType, registerVeterinarian } from '../services/vetService';

interface VetRegistrationProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (vetId: string) => void;
}

type RegistrationStep = 'personal' | 'clinic' | 'services' | 'availability' | 'payment' | 'review';

const VetRegistration: React.FC<VetRegistrationProps> = ({ isOpen, onClose, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>('personal');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<VetRegistrationType>({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      licenseNumber: '',
      yearsExperience: 0
    },
    clinicInfo: {
      name: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      phone: '',
      website: ''
    },
    services: {
      specialties: [],
      consultationFee: 100,
      emergencyFee: 150,
      houseCalls: false,
      telemedicine: false
    },
    availability: {
      workingHours: {
        monday: { start: '09:00', end: '17:00' },
        tuesday: { start: '09:00', end: '17:00' },
        wednesday: { start: '09:00', end: '17:00' },
        thursday: { start: '09:00', end: '17:00' },
        friday: { start: '09:00', end: '17:00' },
        saturday: { start: '09:00', end: '13:00' },
        sunday: { start: '', end: '' }
      },
      timeZone: 'America/New_York',
      bookingBuffer: 15
    },
    paymentInfo: {
      bankAccount: '',
      routingNumber: '',
      taxId: ''
    }
  });

  const steps: { id: RegistrationStep; title: string; icon: React.ReactNode }[] = [
    { id: 'personal', title: 'Personal Info', icon: <User className="w-5 h-5" /> },
    { id: 'clinic', title: 'Clinic Details', icon: <Building className="w-5 h-5" /> },
    { id: 'services', title: 'Services & Pricing', icon: <DollarSign className="w-5 h-5" /> },
    { id: 'availability', title: 'Availability', icon: <Calendar className="w-5 h-5" /> },
    { id: 'payment', title: 'Payment Info', icon: <DollarSign className="w-5 h-5" /> },
    { id: 'review', title: 'Review', icon: <Check className="w-5 h-5" /> }
  ];

  const specialtyOptions = [
    'General Practice', 'Surgery', 'Dermatology', 'Cardiology', 'Oncology',
    'Orthopedics', 'Ophthalmology', 'Dentistry', 'Emergency Care', 'Internal Medicine',
    'Neurology', 'Radiology', 'Anesthesiology', 'Exotic Animals', 'Behavioral Medicine'
  ];

  if (!isOpen) return null;

  const handleNext = () => {
    const stepIndex = steps.findIndex(s => s.id === currentStep);
    if (stepIndex < steps.length - 1) {
      setCurrentStep(steps[stepIndex + 1].id);
    }
  };

  const handleBack = () => {
    const stepIndex = steps.findIndex(s => s.id === currentStep);
    if (stepIndex > 0) {
      setCurrentStep(steps[stepIndex - 1].id);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await registerVeterinarian(formData);
      if (result.success && result.vetId) {
        onSuccess(result.vetId);
        onClose();
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSpecialty = (specialty: string) => {
    const current = formData.services.specialties;
    const updated = current.includes(specialty)
      ? current.filter(s => s !== specialty)
      : [...current, specialty];
    
    setFormData(prev => ({
      ...prev,
      services: { ...prev.services, specialties: updated }
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'personal':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">First Name *</label>
                <input
                  type="text"
                  value={formData.personalInfo.firstName}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, firstName: e.target.value }
                  }))}
                  className="w-full px-4 py-3 backdrop-blur-xl bg-white/80 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-800 placeholder-gray-400 transition-all duration-300"
                  placeholder="John"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Last Name *</label>
                <input
                  type="text"
                  value={formData.personalInfo.lastName}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, lastName: e.target.value }
                  }))}
                  className="w-full px-4 py-3 backdrop-blur-xl bg-white/80 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-800 placeholder-gray-400 transition-all duration-300"
                  placeholder="Smith"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Email Address *</label>
              <input
                type="email"
                value={formData.personalInfo.email}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  personalInfo: { ...prev.personalInfo, email: e.target.value }
                }))}
                className="w-full px-4 py-3 backdrop-blur-xl bg-white/80 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-800 placeholder-gray-400 transition-all duration-300"
                placeholder="dr.smith@clinic.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Phone Number *</label>
              <input
                type="tel"
                value={formData.personalInfo.phone}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  personalInfo: { ...prev.personalInfo, phone: e.target.value }
                }))}
                className="w-full px-4 py-3 backdrop-blur-xl bg-white/80 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-800 placeholder-gray-400 transition-all duration-300"
                placeholder="(555) 123-4567"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">License Number *</label>
                <input
                  type="text"
                  value={formData.personalInfo.licenseNumber}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, licenseNumber: e.target.value }
                  }))}
                  className="w-full px-4 py-3 backdrop-blur-xl bg-white/80 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-800 placeholder-gray-400 transition-all duration-300"
                  placeholder="VET-123456"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Years of Experience *</label>
                <input
                  type="number"
                  value={formData.personalInfo.yearsExperience}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, yearsExperience: parseInt(e.target.value) || 0 }
                  }))}
                  className="w-full px-4 py-3 backdrop-blur-xl bg-white/80 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-800 placeholder-gray-400 transition-all duration-300"
                  placeholder="5"
                  min="0"
                  required
                />
              </div>
            </div>
          </div>
        );

      case 'services':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">Select Your Specialties</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {specialtyOptions.map((specialty) => (
                  <button
                    key={specialty}
                    type="button"
                    onClick={() => toggleSpecialty(specialty)}
                    className={`p-3 text-sm rounded-2xl border transition-all duration-300 font-medium ${
                      formData.services.specialties.includes(specialty)
                        ? 'border-teal-500 bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-lg shadow-teal-500/30'
                        : 'border-gray-200/50 backdrop-blur-xl bg-white/80 text-gray-700 hover:border-teal-300 hover:shadow-md'
                    }`}
                  >
                    {specialty}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Consultation Fee ($)</label>
                <input
                  type="number"
                  value={formData.services.consultationFee}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    services: { ...prev.services, consultationFee: parseInt(e.target.value) || 0 }
                  }))}
                  className="w-full px-4 py-3 backdrop-blur-xl bg-white/80 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-800 placeholder-gray-400 transition-all duration-300"
                  placeholder="100"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Emergency Fee ($)</label>
                <input
                  type="number"
                  value={formData.services.emergencyFee}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    services: { ...prev.services, emergencyFee: parseInt(e.target.value) || 0 }
                  }))}
                  className="w-full px-4 py-3 backdrop-blur-xl bg-white/80 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-800 placeholder-gray-400 transition-all duration-300"
                  placeholder="150"
                  min="0"
                />
              </div>
            </div>

            <div className="backdrop-blur-xl bg-blue-50/50 border border-blue-200/50 rounded-2xl p-4">
              <h4 className="font-semibold text-gray-800 mb-3 text-sm">Additional Services</h4>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.services.houseCalls}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      services: { ...prev.services, houseCalls: e.target.checked }
                    }))}
                    className="w-5 h-5 text-teal-500 rounded-lg border-gray-300 focus:ring-2 focus:ring-teal-500"
                  />
                  <span className="text-gray-700 group-hover:text-gray-900 transition-colors">Offer house calls</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.services.telemedicine}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      services: { ...prev.services, telemedicine: e.target.checked }
                    }))}
                    className="w-5 h-5 text-teal-500 rounded-lg border-gray-300 focus:ring-2 focus:ring-teal-500"
                  />
                  <span className="text-gray-700 group-hover:text-gray-900 transition-colors">Offer telemedicine consultations</span>
                </label>
              </div>
            </div>
          </div>
        );

      case 'clinic':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Clinic Name *</label>
              <input
                type="text"
                value={formData.clinicInfo.name}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  clinicInfo: { ...prev.clinicInfo, name: e.target.value }
                }))}
                className="w-full px-4 py-3 backdrop-blur-xl bg-white/80 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-800 placeholder-gray-400 transition-all duration-300"
                placeholder="Happy Paws Veterinary Clinic"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Street Address *</label>
              <input
                type="text"
                value={formData.clinicInfo.address}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  clinicInfo: { ...prev.clinicInfo, address: e.target.value }
                }))}
                className="w-full px-4 py-3 backdrop-blur-xl bg-white/80 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-800 placeholder-gray-400 transition-all duration-300"
                placeholder="123 Main Street"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">City *</label>
                <input
                  type="text"
                  value={formData.clinicInfo.city}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    clinicInfo: { ...prev.clinicInfo, city: e.target.value }
                  }))}
                  className="w-full px-4 py-3 backdrop-blur-xl bg-white/80 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-800 placeholder-gray-400 transition-all duration-300"
                  placeholder="San Francisco"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">State *</label>
                <input
                  type="text"
                  value={formData.clinicInfo.state}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    clinicInfo: { ...prev.clinicInfo, state: e.target.value }
                  }))}
                  className="w-full px-4 py-3 backdrop-blur-xl bg-white/80 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-800 placeholder-gray-400 transition-all duration-300"
                  placeholder="CA"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">ZIP Code *</label>
                <input
                  type="text"
                  value={formData.clinicInfo.zipCode}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    clinicInfo: { ...prev.clinicInfo, zipCode: e.target.value }
                  }))}
                  className="w-full px-4 py-3 backdrop-blur-xl bg-white/80 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-800 placeholder-gray-400 transition-all duration-300"
                  placeholder="94102"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Clinic Phone *</label>
                <input
                  type="tel"
                  value={formData.clinicInfo.phone}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    clinicInfo: { ...prev.clinicInfo, phone: e.target.value }
                  }))}
                  className="w-full px-4 py-3 backdrop-blur-xl bg-white/80 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-800 placeholder-gray-400 transition-all duration-300"
                  placeholder="(555) 987-6543"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Website (Optional)</label>
              <input
                type="url"
                value={formData.clinicInfo.website}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  clinicInfo: { ...prev.clinicInfo, website: e.target.value }
                }))}
                className="w-full px-4 py-3 backdrop-blur-xl bg-white/80 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-800 placeholder-gray-400 transition-all duration-300"
                placeholder="https://happypawsvet.com"
              />
            </div>
          </div>
        );

      case 'availability':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">Working Hours</label>
              <div className="space-y-3">
                {Object.entries(formData.availability.workingHours).map(([day, hours]) => (
                  <div key={day} className="backdrop-blur-xl bg-white/80 border border-gray-200/50 rounded-2xl p-4">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm font-semibold text-gray-800 capitalize w-24">{day}</span>
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="time"
                          value={hours.start}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            availability: {
                              ...prev.availability,
                              workingHours: {
                                ...prev.availability.workingHours,
                                [day]: { ...hours, start: e.target.value }
                              }
                            }
                          }))}
                          className="flex-1 px-3 py-2 backdrop-blur-xl bg-white/80 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-800 text-sm transition-all duration-300"
                        />
                        <span className="text-gray-600">to</span>
                        <input
                          type="time"
                          value={hours.end}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            availability: {
                              ...prev.availability,
                              workingHours: {
                                ...prev.availability.workingHours,
                                [day]: { ...hours, end: e.target.value }
                              }
                            }
                          }))}
                          className="flex-1 px-3 py-2 backdrop-blur-xl bg-white/80 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-800 text-sm transition-all duration-300"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          availability: {
                            ...prev.availability,
                            workingHours: {
                              ...prev.availability.workingHours,
                              [day]: { start: '', end: '' }
                            }
                          }
                        }))}
                        className="text-sm text-gray-500 hover:text-red-600 transition-colors px-2"
                      >
                        Closed
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Time Zone</label>
                <select
                  value={formData.availability.timeZone}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    availability: { ...prev.availability, timeZone: e.target.value }
                  }))}
                  className="w-full px-4 py-3 backdrop-blur-xl bg-white/80 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-800 transition-all duration-300"
                >
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="America/Anchorage">Alaska Time (AKT)</option>
                  <option value="Pacific/Honolulu">Hawaii Time (HT)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Booking Buffer (minutes)</label>
                <input
                  type="number"
                  value={formData.availability.bookingBuffer}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    availability: { ...prev.availability, bookingBuffer: parseInt(e.target.value) || 15 }
                  }))}
                  className="w-full px-4 py-3 backdrop-blur-xl bg-white/80 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-800 placeholder-gray-400 transition-all duration-300"
                  placeholder="15"
                  min="0"
                  step="5"
                />
              </div>
            </div>

            <div className="backdrop-blur-xl bg-blue-50/50 border border-blue-200/50 rounded-2xl p-4">
              <p className="text-sm text-gray-700">
                The booking buffer is the time between appointments to prepare and clean up. This ensures you have adequate time between consultations.
              </p>
            </div>
          </div>
        );

      case 'payment':
        return (
          <div className="space-y-6">
            <div className="backdrop-blur-xl bg-blue-50/50 border border-blue-200/50 rounded-2xl p-4 mb-6">
              <h4 className="font-semibold text-gray-800 mb-2 text-sm">Payment Information</h4>
              <p className="text-sm text-gray-700">
                Enter your banking details to receive monthly payouts. All information is encrypted and secure.
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Bank Account Number *</label>
              <input
                type="text"
                value={formData.paymentInfo.bankAccount}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  paymentInfo: { ...prev.paymentInfo, bankAccount: e.target.value }
                }))}
                className="w-full px-4 py-3 backdrop-blur-xl bg-white/80 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-800 placeholder-gray-400 transition-all duration-300"
                placeholder="000123456789"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Routing Number *</label>
              <input
                type="text"
                value={formData.paymentInfo.routingNumber}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  paymentInfo: { ...prev.paymentInfo, routingNumber: e.target.value }
                }))}
                className="w-full px-4 py-3 backdrop-blur-xl bg-white/80 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-800 placeholder-gray-400 transition-all duration-300"
                placeholder="123456789"
                maxLength={9}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Tax ID / EIN *</label>
              <input
                type="text"
                value={formData.paymentInfo.taxId}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  paymentInfo: { ...prev.paymentInfo, taxId: e.target.value }
                }))}
                className="w-full px-4 py-3 backdrop-blur-xl bg-white/80 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-800 placeholder-gray-400 transition-all duration-300"
                placeholder="XX-XXXXXXX"
                required
              />
              <p className="text-sm text-gray-600 mt-2">
                Enter your Social Security Number or Employer Identification Number for tax reporting
              </p>
            </div>

            <div className="backdrop-blur-xl bg-green-50/50 border border-green-200/50 rounded-2xl p-4">
              <h4 className="font-semibold text-gray-800 mb-2 text-sm flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                Payout Details
              </h4>
              <ul className="text-sm text-gray-700 space-y-1 ml-6 list-disc">
                <li>Receive 85% of each booking fee</li>
                <li>Monthly direct deposit payouts</li>
                <li>Detailed earnings reports available</li>
                <li>No setup or monthly fees</li>
              </ul>
            </div>

            <div className="backdrop-blur-xl bg-amber-50/60 border border-amber-200/50 rounded-2xl p-4">
              <p className="text-sm text-amber-900">
                <span className="font-semibold">Security Note:</span> Your banking information is encrypted using industry-standard SSL and stored securely. We never share your financial data with third parties.
              </p>
            </div>
          </div>
        );

      case 'review':
        return (
          <div className="space-y-6">
            <div className="backdrop-blur-xl bg-white/80 border border-gray-200/50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Review Your Information</h3>

              <div className="space-y-5">
                <div className="backdrop-blur-xl bg-blue-50/50 border border-blue-200/50 rounded-2xl p-4">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-600" />
                    Personal Information
                  </h4>
                  <div className="text-sm text-gray-700 space-y-1 ml-6">
                    <p className="font-medium">Dr. {formData.personalInfo.firstName} {formData.personalInfo.lastName}</p>
                    <p>{formData.personalInfo.email}</p>
                    <p>{formData.personalInfo.phone}</p>
                    <p>License: {formData.personalInfo.licenseNumber}</p>
                    <p>{formData.personalInfo.yearsExperience} years of experience</p>
                  </div>
                </div>

                <div className="backdrop-blur-xl bg-teal-50/50 border border-teal-200/50 rounded-2xl p-4">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <Building className="w-4 h-4 text-teal-600" />
                    Clinic Details
                  </h4>
                  <div className="text-sm text-gray-700 ml-6">
                    <p className="font-medium">{formData.clinicInfo.name || 'Not provided'}</p>
                  </div>
                </div>

                <div className="backdrop-blur-xl bg-green-50/50 border border-green-200/50 rounded-2xl p-4">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    Services & Pricing
                  </h4>
                  <div className="text-sm text-gray-700 space-y-1 ml-6">
                    <p>Consultation Fee: <span className="font-medium">${formData.services.consultationFee}</span></p>
                    <p>Emergency Fee: <span className="font-medium">${formData.services.emergencyFee}</span></p>
                    <p>Specialties: <span className="font-medium">{formData.services.specialties.join(', ') || 'General Practice'}</span></p>
                    {formData.services.houseCalls && <p className="text-green-700">✓ House calls available</p>}
                    {formData.services.telemedicine && <p className="text-green-700">✓ Telemedicine available</p>}
                  </div>
                </div>
              </div>

              <div className="mt-6 backdrop-blur-xl bg-amber-50/60 border border-amber-200/50 rounded-2xl p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="text-sm text-amber-900">
                    <p className="font-semibold mb-2">Commission Structure</p>
                    <p className="leading-relaxed">
                      DOGSWAB charges a 15% platform fee on all bookings. You receive 85% of the booking fee
                      with monthly payouts via direct deposit. Start earning immediately after approval.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Step content not implemented</div>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="backdrop-blur-xl bg-white/95 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-white/40 flex flex-col">
        <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-blue-50/50 to-teal-50/50">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Join as a Veterinarian</h2>
              <p className="text-gray-600 text-sm mt-1">Connect with pet owners and grow your practice</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/50 rounded-xl transition-all duration-300"
            >
              <X className="w-6 h-6 text-gray-700" />
            </button>
          </div>

          <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-2">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-shrink-0">
                <div className={`flex items-center space-x-2 px-3 py-2 rounded-xl transition-all duration-300 ${
                  currentStep === step.id
                    ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-lg shadow-teal-500/30'
                    : steps.findIndex(s => s.id === currentStep) > index
                      ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                      : 'bg-white/60 text-gray-600 border border-gray-200/50'
                }`}>
                  {step.icon}
                  <span className="text-sm font-medium hidden sm:inline">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className="w-4 h-px bg-gray-300/50 mx-1" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {renderStepContent()}
        </div>

        <div className="flex justify-between items-center p-6 border-t border-gray-200/50 backdrop-blur-xl bg-gray-50/50">
          <button
            onClick={handleBack}
            disabled={currentStep === 'personal'}
            className="px-6 py-3 backdrop-blur-xl bg-white/80 border border-gray-300/50 text-gray-700 rounded-2xl hover:bg-white hover:shadow-[0_0_20px_rgba(156,163,175,0.3)] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-none transition-all duration-300 font-medium"
          >
            Back
          </button>

          {currentStep === 'review' ? (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-2xl hover:shadow-[0_0_30px_rgba(20,184,166,0.5)] disabled:opacity-50 disabled:hover:shadow-none transition-all duration-300 font-semibold"
            >
              {isSubmitting ? 'Submitting...' : 'Complete Registration'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-2xl hover:shadow-[0_0_30px_rgba(20,184,166,0.5)] transition-all duration-300 font-semibold"
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export { VetRegistration };