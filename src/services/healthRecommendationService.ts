interface Pet {
  id: string;
  name: string;
  species: string;
  breed?: string;
  date_of_birth?: string;
  weight?: number;
  medical_conditions?: string[];
  allergies?: string[];
  medications?: string[];
}

interface VetHistoryEntry {
  visit_date: string;
  visit_type: string;
  diagnosis?: string;
  treatment?: string;
  medications_prescribed?: string[];
  follow_up_needed?: boolean;
  follow_up_date?: string;
}

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
  source_data?: any;
}

export class HealthRecommendationService {
  static generateRecommendations(pet: Pet, vetHistory: VetHistoryEntry[]): Recommendation[] {
    const recommendations: Recommendation[] = [];
    const now = new Date();

    const lastCheckup = this.findLastVisitByType(vetHistory, 'checkup');
    if (!lastCheckup || this.daysSince(lastCheckup.visit_date) > 365) {
      recommendations.push({
        id: `rec_${Date.now()}_${pet.id}_checkup`,
        pet_id: pet.id,
        recommendation_type: 'checkup_reminder',
        title: `Annual Checkup Due for ${pet.name}`,
        description: lastCheckup
          ? `It's been over a year since ${pet.name}'s last checkup. Annual wellness exams help catch health issues early.`
          : `Schedule ${pet.name}'s first wellness exam to establish a health baseline.`,
        priority: 'high',
        due_date: this.addDays(now, 14),
        status: 'active',
        generated_at: now.toISOString(),
        source_data: { last_checkup: lastCheckup }
      });
    }

    const lastVaccination = this.findLastVisitByType(vetHistory, 'vaccination');
    if (!lastVaccination || this.daysSince(lastVaccination.visit_date) > 365) {
      const vaccineInfo = pet.species === 'dog'
        ? 'Core vaccines include rabies, DHPP, and bordetella.'
        : pet.species === 'cat'
        ? 'Core vaccines include FVRCP and rabies.'
        : 'Talk to your vet about recommended vaccines.';

      recommendations.push({
        id: `rec_${Date.now()}_${pet.id}_vaccination`,
        pet_id: pet.id,
        recommendation_type: 'vaccination_due',
        title: `${pet.name}'s Vaccinations May Be Due`,
        description: `Annual vaccinations help protect ${pet.name} from serious diseases. ${vaccineInfo}`,
        priority: 'high',
        due_date: this.addDays(now, 30),
        status: 'active',
        generated_at: now.toISOString(),
        source_data: { last_vaccination: lastVaccination }
      });
    }

    const age = pet.date_of_birth ? this.calculateAge(pet.date_of_birth) : null;
    if (age && age >= 7) {
      const seniorAge = pet.species === 'cat' ? 11 : pet.species === 'dog' ? 7 : 7;
      if (age >= seniorAge) {
        recommendations.push({
          id: `rec_${Date.now()}_${pet.id}_senior`,
          pet_id: pet.id,
          recommendation_type: 'preventive_care',
          title: `Senior Pet Care for ${pet.name}`,
          description: `${pet.name} is ${age} years old. Senior pets benefit from twice-yearly checkups, bloodwork to monitor organs, and age-appropriate diet adjustments.`,
          priority: 'medium',
          status: 'active',
          generated_at: now.toISOString(),
          source_data: { age, species: pet.species }
        });
      }
    }

    if (pet.species === 'dog' && !this.hasRecentDentalCare(vetHistory)) {
      recommendations.push({
        id: `rec_${Date.now()}_${pet.id}_dental`,
        pet_id: pet.id,
        recommendation_type: 'health_tip',
        title: `Dental Care for ${pet.name}`,
        description: `Dental disease affects 80% of dogs by age 3. Regular teeth brushing and professional cleanings prevent infections and maintain overall health.`,
        priority: 'medium',
        status: 'active',
        generated_at: now.toISOString()
      });
    }

    if (pet.species === 'cat') {
      recommendations.push({
        id: `rec_${Date.now()}_${pet.id}_hydration`,
        pet_id: pet.id,
        recommendation_type: 'health_tip',
        title: `Hydration Tips for ${pet.name}`,
        description: `Cats often don't drink enough water. Consider a water fountain and mix wet food into ${pet.name}'s diet to prevent kidney and urinary issues.`,
        priority: 'medium',
        status: 'active',
        generated_at: now.toISOString()
      });
    }

    if (pet.weight && age) {
      const weightRecommendation = this.analyzeWeight(pet);
      if (weightRecommendation) {
        recommendations.push(weightRecommendation);
      }
    }

    const medicationCheck = this.checkMedications(pet, vetHistory);
    if (medicationCheck) {
      recommendations.push(medicationCheck);
    }

    const pendingFollowUps = vetHistory.filter(
      h => h.follow_up_needed && h.follow_up_date && new Date(h.follow_up_date) <= this.addDaysToDate(now, 14)
    );
    if (pendingFollowUps.length > 0) {
      recommendations.push({
        id: `rec_${Date.now()}_${pet.id}_followup`,
        pet_id: pet.id,
        recommendation_type: 'checkup_reminder',
        title: `Follow-up Appointment Due for ${pet.name}`,
        description: `${pet.name} has a follow-up appointment scheduled. Don't forget to book or attend this important visit.`,
        priority: 'high',
        due_date: pendingFollowUps[0].follow_up_date,
        status: 'active',
        generated_at: now.toISOString(),
        source_data: { follow_ups: pendingFollowUps }
      });
    }

    if (pet.medical_conditions && pet.medical_conditions.length > 0) {
      recommendations.push({
        id: `rec_${Date.now()}_${pet.id}_condition`,
        pet_id: pet.id,
        recommendation_type: 'preventive_care',
        title: `Monitor ${pet.name}'s Condition`,
        description: `${pet.name} has known medical conditions: ${pet.medical_conditions.join(', ')}. Regular monitoring and vet checkups are important for managing these conditions.`,
        priority: 'high',
        status: 'active',
        generated_at: now.toISOString(),
        source_data: { conditions: pet.medical_conditions }
      });
    }

    if (pet.species === 'dog') {
      recommendations.push({
        id: `rec_${Date.now()}_${pet.id}_exercise`,
        pet_id: pet.id,
        recommendation_type: 'exercise_suggestion',
        title: `Daily Exercise for ${pet.name}`,
        description: `Regular exercise helps ${pet.name} maintain a healthy weight and mental wellness. Aim for 30-60 minutes daily, adjusted for age and breed.`,
        priority: 'low',
        status: 'active',
        generated_at: now.toISOString()
      });
    }

    return recommendations;
  }

  private static findLastVisitByType(history: VetHistoryEntry[], type: string): VetHistoryEntry | null {
    const visits = history
      .filter(h => h.visit_type === type)
      .sort((a, b) => new Date(b.visit_date).getTime() - new Date(a.visit_date).getTime());
    return visits[0] || null;
  }

  private static daysSince(date: string): number {
    return Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
  }

  private static addDays(date: Date, days: number): string {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toISOString().split('T')[0];
  }

  private static addDaysToDate(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  private static calculateAge(birthDate: string): number {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  private static hasRecentDentalCare(history: VetHistoryEntry[]): boolean {
    const dentalVisit = history.find(h =>
      h.visit_type === 'dental' && this.daysSince(h.visit_date) < 365
    );
    return !!dentalVisit;
  }

  private static analyzeWeight(pet: Pet): Recommendation | null {
    return null;
  }

  private static checkMedications(pet: Pet, history: VetHistoryEntry[]): Recommendation | null {
    const recentMedications = history
      .filter(h => h.medications_prescribed && h.medications_prescribed.length > 0)
      .sort((a, b) => new Date(b.visit_date).getTime() - new Date(a.visit_date).getTime())[0];

    if (recentMedications && this.daysSince(recentMedications.visit_date) > 60) {
      return {
        id: `rec_${Date.now()}_${pet.id}_medication`,
        pet_id: pet.id,
        recommendation_type: 'medication_refill',
        title: `Check ${pet.name}'s Medication Supply`,
        description: `Medications were prescribed ${this.daysSince(recentMedications.visit_date)} days ago. Verify you have adequate supply and refill if needed.`,
        priority: 'medium',
        status: 'active',
        generated_at: new Date().toISOString(),
        source_data: { medications: recentMedications.medications_prescribed }
      };
    }

    return null;
  }

  static async analyzeDocumentWithAI(documentText: string, petInfo: Pet): Promise<any> {
    return {
      vaccinations: [],
      diagnoses: [],
      medications: [],
      recommendations: []
    };
  }

  static prioritizeRecommendations(recommendations: Recommendation[]): Recommendation[] {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return recommendations.sort((a, b) => {
      if (a.status === 'active' && b.status !== 'active') return -1;
      if (a.status !== 'active' && b.status === 'active') return 1;
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  static getUpcomingRecommendations(recommendations: Recommendation[], days: number = 30): Recommendation[] {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return recommendations.filter(rec =>
      rec.status === 'active' &&
      rec.due_date &&
      new Date(rec.due_date) <= futureDate
    ).sort((a, b) => {
      if (!a.due_date || !b.due_date) return 0;
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    });
  }
}
