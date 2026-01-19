import React, { useState, useEffect } from 'react';
import { Lightbulb, CheckCircle, X, AlertCircle, Bell, Calendar, Pill, Heart } from 'lucide-react';

interface Recommendation {
  id: string;
  pet_id: string;
  recommendation_type: 'vaccination_due' | 'checkup_reminder' | 'medication_refill' | 'health_tip' | 'dietary_advice' | 'exercise_suggestion' | 'preventive_care';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  due_date?: string;
  status: 'active' | 'completed' | 'dismissed';
  generated_at: string;
  completed_at?: string;
}

interface Pet {
  id: string;
  name: string;
  species: string;
  breed?: string;
  date_of_birth?: string;
}

interface HealthRecommendationsProps {
  userId: string;
  pets: Pet[];
  isPremium: boolean;
}

export default function HealthRecommendations({ userId, pets, isPremium }: HealthRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [selectedPet, setSelectedPet] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'active' | 'completed' | 'all'>('active');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRecommendations();
  }, [selectedPet]);

  const loadRecommendations = () => {
    const allRecs: Recommendation[] = [];
    pets.forEach(pet => {
      const stored = localStorage.getItem(`recommendations_${pet.id}`);
      if (stored) {
        allRecs.push(...JSON.parse(stored));
      }
    });
    setRecommendations(allRecs);
  };

  const generateRecommendations = async () => {
    if (!isPremium) {
      alert('AI-powered recommendations are a Premium feature. Upgrade to unlock smart health insights!');
      return;
    }

    setLoading(true);
    try {
      const newRecommendations: Recommendation[] = [];

      for (const pet of pets) {
        const vetHistory = localStorage.getItem(`vet_history_${pet.id}`);
        const history = vetHistory ? JSON.parse(vetHistory) : [];

        const lastCheckup = history
          .filter((h: any) => h.visit_type === 'checkup')
          .sort((a: any, b: any) => new Date(b.visit_date).getTime() - new Date(a.visit_date).getTime())[0];

        const lastVaccination = history
          .filter((h: any) => h.visit_type === 'vaccination')
          .sort((a: any, b: any) => new Date(b.visit_date).getTime() - new Date(a.visit_date).getTime())[0];

        if (!lastCheckup || daysSince(lastCheckup.visit_date) > 365) {
          newRecommendations.push({
            id: `rec_${Date.now()}_${pet.id}_checkup`,
            pet_id: pet.id,
            recommendation_type: 'checkup_reminder',
            title: `Annual Checkup Due for ${pet.name}`,
            description: lastCheckup
              ? `It's been over a year since ${pet.name}'s last checkup on ${new Date(lastCheckup.visit_date).toLocaleDateString()}. Schedule an annual wellness exam to ensure your pet stays healthy.`
              : `${pet.name} doesn't have a recorded checkup yet. Schedule an initial wellness exam to establish a health baseline and discuss preventive care.`,
            priority: 'high',
            due_date: addDays(new Date(), 14),
            status: 'active',
            generated_at: new Date().toISOString()
          });
        }

        if (!lastVaccination || daysSince(lastVaccination.visit_date) > 365) {
          newRecommendations.push({
            id: `rec_${Date.now()}_${pet.id}_vac`,
            pet_id: pet.id,
            recommendation_type: 'vaccination_due',
            title: `${pet.name}'s Vaccinations May Be Due`,
            description: `${pet.species === 'dog' ? 'Dogs' : 'Cats'} typically need annual vaccinations. Check with your vet to ensure ${pet.name} is up to date on core vaccines${pet.species === 'dog' ? ' (rabies, DHPP, bordetella)' : ' (FVRCP, rabies)'}.`,
            priority: 'high',
            due_date: addDays(new Date(), 30),
            status: 'active',
            generated_at: new Date().toISOString()
          });
        }

        const age = pet.date_of_birth ? calculateAge(pet.date_of_birth) : null;
        if (age && age > 7) {
          newRecommendations.push({
            id: `rec_${Date.now()}_${pet.id}_senior`,
            pet_id: pet.id,
            recommendation_type: 'preventive_care',
            title: `Senior Pet Care for ${pet.name}`,
            description: `${pet.name} is ${age} years old and considered a senior ${pet.species}. Senior pets benefit from twice-yearly checkups and may need bloodwork to monitor organ function. Consider discussing joint supplements and senior-appropriate diet with your vet.`,
            priority: 'medium',
            status: 'active',
            generated_at: new Date().toISOString()
          });
        }

        if (pet.species === 'dog') {
          newRecommendations.push({
            id: `rec_${Date.now()}_${pet.id}_dental`,
            pet_id: pet.id,
            recommendation_type: 'health_tip',
            title: `Dental Care for ${pet.name}`,
            description: `Dental disease affects 80% of dogs by age 3. Brush ${pet.name}'s teeth daily if possible, and schedule regular dental cleanings with your vet to prevent painful infections and maintain overall health.`,
            priority: 'medium',
            status: 'active',
            generated_at: new Date().toISOString()
          });

          newRecommendations.push({
            id: `rec_${Date.now()}_${pet.id}_exercise`,
            pet_id: pet.id,
            recommendation_type: 'exercise_suggestion',
            title: `Daily Exercise for ${pet.name}`,
            description: `${pet.breed ? pet.breed + 's' : 'Dogs'} need regular exercise to maintain a healthy weight and mental stimulation. Aim for at least 30-60 minutes of activity daily, adjusted for ${pet.name}'s age and energy level.`,
            priority: 'low',
            status: 'active',
            generated_at: new Date().toISOString()
          });
        }

        if (pet.species === 'cat') {
          newRecommendations.push({
            id: `rec_${Date.now()}_${pet.id}_hydration`,
            pet_id: pet.id,
            recommendation_type: 'health_tip',
            title: `Hydration Tips for ${pet.name}`,
            description: `Cats often don't drink enough water, which can lead to kidney and urinary issues. Consider a cat water fountain to encourage drinking, and mix wet food into ${pet.name}'s diet for added moisture.`,
            priority: 'medium',
            status: 'active',
            generated_at: new Date().toISOString()
          });
        }

        const medications = history
          .filter((h: any) => h.medications_prescribed && h.medications_prescribed.length > 0)
          .sort((a: any, b: any) => new Date(b.visit_date).getTime() - new Date(a.visit_date).getTime())[0];

        if (medications && daysSince(medications.visit_date) > 60) {
          newRecommendations.push({
            id: `rec_${Date.now()}_${pet.id}_med`,
            pet_id: pet.id,
            recommendation_type: 'medication_refill',
            title: `Check ${pet.name}'s Medication Supply`,
            description: `${pet.name} was prescribed medication(s) on ${new Date(medications.visit_date).toLocaleDateString()}. Make sure you have an adequate supply and refill if needed before running out.`,
            priority: 'medium',
            status: 'active',
            generated_at: new Date().toISOString()
          });
        }

        const existingRecs = localStorage.getItem(`recommendations_${pet.id}`);
        const filtered = newRecommendations.filter(rec => rec.pet_id === pet.id);
        localStorage.setItem(`recommendations_${pet.id}`, JSON.stringify(filtered));
      }

      loadRecommendations();
    } catch (error) {
      console.error('Error generating recommendations:', error);
      alert('Failed to generate recommendations');
    } finally {
      setLoading(false);
    }
  };

  const markComplete = (recId: string) => {
    const updated = recommendations.map(rec =>
      rec.id === recId
        ? { ...rec, status: 'completed' as const, completed_at: new Date().toISOString() }
        : rec
    );
    setRecommendations(updated);

    pets.forEach(pet => {
      const petRecs = updated.filter(r => r.pet_id === pet.id);
      localStorage.setItem(`recommendations_${pet.id}`, JSON.stringify(petRecs));
    });
  };

  const dismiss = (recId: string) => {
    const updated = recommendations.map(rec =>
      rec.id === recId
        ? { ...rec, status: 'dismissed' as const }
        : rec
    );
    setRecommendations(updated);

    pets.forEach(pet => {
      const petRecs = updated.filter(r => r.pet_id === pet.id);
      localStorage.setItem(`recommendations_${pet.id}`, JSON.stringify(petRecs));
    });
  };

  const daysSince = (date: string) => {
    return Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
  };

  const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toISOString().split('T')[0];
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'vaccination_due': return <Bell className="w-5 h-5" />;
      case 'checkup_reminder': return <Calendar className="w-5 h-5" />;
      case 'medication_refill': return <Pill className="w-5 h-5" />;
      case 'health_tip': return <Lightbulb className="w-5 h-5" />;
      case 'dietary_advice': return <Heart className="w-5 h-5" />;
      default: return <AlertCircle className="w-5 h-5" />;
    }
  };

  const filteredRecs = recommendations.filter(rec => {
    if (selectedPet !== 'all' && rec.pet_id !== selectedPet) return false;
    if (filterStatus !== 'all' && rec.status !== filterStatus) return false;
    return true;
  }).sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const activeCount = recommendations.filter(r => r.status === 'active').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Health Recommendations</h2>
          <p className="text-gray-600 mt-1">
            AI-powered insights to keep your pets healthy
            {!isPremium && ' (Premium Feature)'}
          </p>
        </div>
        <button
          onClick={generateRecommendations}
          disabled={loading || !isPremium}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <Lightbulb className="w-5 h-5" />
          {loading ? 'Generating...' : 'Generate Recommendations'}
        </button>
      </div>

      {!isPremium && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
          <h3 className="font-bold text-lg text-purple-900 mb-2">Unlock Smart Health Insights</h3>
          <p className="text-purple-800 mb-4">
            Get AI-powered recommendations based on your pet's history, including vaccination reminders,
            checkup suggestions, dietary advice, and preventive care tips.
          </p>
          <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold">
            Upgrade to Premium
          </button>
        </div>
      )}

      {activeCount > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-900">
            <strong>{activeCount}</strong> active recommendation{activeCount !== 1 ? 's' : ''} for your pet{pets.length > 1 ? 's' : ''}
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Pet</label>
          <select
            value={selectedPet}
            onChange={(e) => setSelectedPet(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Pets</option>
            {pets.map(pet => (
              <option key={pet.id} value={pet.id}>{pet.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredRecs.map(rec => {
          const pet = pets.find(p => p.id === rec.pet_id);
          return (
            <div
              key={rec.id}
              className={`bg-white border rounded-lg p-6 ${
                rec.status === 'completed' ? 'opacity-60' : 'hover:shadow-lg'
              } transition-shadow`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`w-12 h-12 ${getPriorityColor(rec.priority)} rounded-lg flex items-center justify-center`}>
                    {getTypeIcon(rec.recommendation_type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 text-lg">{rec.title}</h3>
                      {rec.status === 'completed' && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                    <p className="text-gray-700 mb-3">{rec.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className={`px-3 py-1 rounded-full font-medium ${getPriorityColor(rec.priority)}`}>
                        {rec.priority.toUpperCase()}
                      </span>
                      <span>Pet: {pet?.name}</span>
                      {rec.due_date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Due: {new Date(rec.due_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {rec.status === 'active' && (
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => markComplete(rec.id)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Mark as complete"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => dismiss(rec.id)}
                      className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors"
                      title="Dismiss"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filteredRecs.length === 0 && recommendations.length > 0 && (
          <div className="text-center py-12 text-gray-500">
            <Lightbulb className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>No recommendations match the selected filters</p>
          </div>
        )}

        {recommendations.length === 0 && isPremium && (
          <div className="text-center py-12 text-gray-500">
            <Lightbulb className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>Click "Generate Recommendations" to get personalized health insights for your pets</p>
          </div>
        )}
      </div>
    </div>
  );
}
