import { Message } from '../types';

export const generateAIResponse = async (
  message: string,
  category: string = 'general',
  petName?: string,
  pet?: any
): Promise<string> => {
  try {
    console.log('generateAIResponse called with:', { message, category, petName, pet: pet?.name });

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Supabase configuration missing');
      return getFallbackResponse(category, petName || 'your pet');
    }

    const apiUrl = `${supabaseUrl}/functions/v1/ai-chat`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        category,
        petName,
        pet
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      if (response.status === 503) {
        console.log('AI service not configured, using fallback');
        return getFallbackResponse(category, petName || 'your pet');
      }

      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.response;

  } catch (error) {
    console.error('Error calling AI service:', error);

    if (error instanceof Error) {
      if (error.message.includes('401')) {
        return "❌ Authentication error. Please refresh the page and try again.";
      } else if (error.message.includes('429')) {
        return "⏳ Rate limit exceeded. Please wait a moment before asking another question.";
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        return "🌐 Network error. Please check your internet connection and try again.";
      }
    }

    return getFallbackResponse(category, petName || 'your pet');
  }
};

function getFallbackResponse(category: string, petRef: string): string {
  if (category === 'emergency') {
    return `🚨 **EMERGENCY DETECTED** - This appears to be an urgent situation!\n\n**IMMEDIATE ACTIONS:**\n• Contact your veterinarian RIGHT NOW\n• If after hours, call emergency animal hospital\n• Keep ${petRef} calm and still\n• Do not give human medications\n• Monitor breathing and consciousness\n\n**Emergency Hotline:** Call your vet immediately!\n\n⚠️ This is a demo response. AI service not fully configured.`;
  } else if (category === 'symptoms') {
    return `I understand you're concerned about ${petRef}'s symptoms. Here's what I recommend:\n\n**IMMEDIATE CARE:**\n• Monitor ${petRef} closely for changes\n• Keep them comfortable and hydrated\n• Document symptoms (photos, notes)\n• Check temperature if possible\n\n**WHEN TO CALL VET:**\n• Symptoms worsen or persist\n• Loss of appetite for 24+ hours\n• Lethargy or unusual behavior\n• Any concerning changes\n\n**NEXT STEPS:**\n• Continue monitoring\n• Consider vet consultation if no improvement\n\n⚠️ Demo response - AI service not fully configured.`;
  } else if (category === 'behavior') {
    return `Regarding ${petRef}'s behavior, here are some insights:\n\n**BEHAVIORAL GUIDANCE:**\n• Sudden changes may indicate health issues\n• Maintain consistent routines\n• Use positive reinforcement training\n• Consider environmental stressors\n\n**COMMON CAUSES:**\n• Medical conditions\n• Anxiety or stress\n• Changes in environment\n• Need for more exercise/stimulation\n\n**RECOMMENDATIONS:**\n• Monitor for patterns\n• Ensure adequate exercise\n• Consider professional training if needed\n\n⚠️ Demo response - AI service not fully configured.`;
  } else if (category === 'nutrition') {
    return `For ${petRef}'s nutrition concerns:\n\n**FEEDING GUIDELINES:**\n• Maintain consistent feeding schedule\n• Fresh water always available\n• Age-appropriate, high-quality food\n• Monitor portion sizes\n\n**DIETARY TIPS:**\n• Introduce new foods gradually\n• Avoid human food toxins\n• Consider life stage needs\n• Watch for food allergies\n\n**WHEN TO CONSULT VET:**\n• Sudden appetite changes\n• Digestive issues\n• Weight gain/loss\n\n⚠️ Demo response - AI service not fully configured.`;
  } else {
    return `Thank you for your question about ${petRef}. Here's some general guidance:\n\n**GENERAL PET CARE:**\n• Regular veterinary checkups\n• Balanced diet and exercise\n• Monitor behavior and appetite\n• Keep vaccinations current\n• Provide safe, comfortable environment\n\n**HEALTH MONITORING:**\n• Watch for changes in eating/drinking\n• Note energy level changes\n• Track bathroom habits\n• Monitor social behavior\n\n**PREVENTIVE CARE:**\n• Annual vet visits\n• Dental care\n• Parasite prevention\n• Weight management\n\n⚠️ Demo response - AI service not fully configured.`;
  }
}

export const categorizeMessage = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  // Emergency keywords - highest priority
  const emergencyKeywords = [
    'emergency', 'urgent', 'bleeding', 'poisoned', 'poison', 'toxic',
    'can\'t breathe', 'cannot breathe', 'unconscious', 'seizure', 'seizing',
    'choking', 'collapsed', 'severe pain', 'hit by car', 'trauma',
    'overdose', 'swallowed', 'ate chocolate', 'ate grapes', 'ate onion'
  ];
  
  if (emergencyKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'emergency';
  }
  
  // Symptom keywords
  const symptomKeywords = [
    'symptom', 'sick', 'ill', 'vomit', 'vomiting', 'diarrhea', 'fever',
    'pain', 'hurt', 'limping', 'cough', 'coughing', 'sneezing',
    'lethargic', 'tired', 'weakness', 'loss of appetite', 'not eating',
    'drinking too much', 'urinating', 'blood', 'discharge', 'swollen',
    'rash', 'itching', 'scratching', 'shaking', 'trembling'
  ];
  
  if (symptomKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'symptoms';
  }
  
  // Behavior keywords
  const behaviorKeywords = [
    'behavior', 'behaviour', 'aggressive', 'aggression', 'anxious', 'anxiety',
    'barking', 'howling', 'destructive', 'training', 'obedience',
    'biting', 'nipping', 'jumping', 'pulling', 'fearful', 'scared',
    'hyperactive', 'calm', 'socialization', 'territorial'
  ];
  
  if (behaviorKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'behavior';
  }
  
  // Nutrition keywords
  const nutritionKeywords = [
    'food', 'eat', 'eating', 'diet', 'nutrition', 'nutritional',
    'weight', 'overweight', 'underweight', 'feeding', 'meal',
    'treats', 'snacks', 'hungry', 'appetite', 'kibble', 'wet food',
    'raw diet', 'grain free', 'allergies', 'sensitive stomach'
  ];
  
  if (nutritionKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'nutrition';
  }
  
  return 'general';
};
