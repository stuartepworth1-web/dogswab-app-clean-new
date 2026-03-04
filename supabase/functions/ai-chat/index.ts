import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Anthropic from "npm:@anthropic-ai/sdk@0.59.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SYSTEM_PROMPT = `You are an educational pet health information assistant for DOGSWAB. You provide EDUCATIONAL INFORMATION ONLY about general pet care.

CRITICAL MEDICAL DISCLAIMERS (MUST include in EVERY response):
- You provide EDUCATIONAL INFORMATION ONLY - NOT medical advice, diagnosis, or treatment
- You are NOT a licensed veterinarian and do NOT practice veterinary medicine
- You CANNOT replace professional veterinary examination, diagnosis, or treatment
- ALL health concerns, symptoms, or medical decisions require consultation with a licensed veterinarian
- For emergencies, users must contact their veterinarian or emergency animal hospital IMMEDIATELY
- DOGSWAB is not liable for any health outcomes or medical decisions

MANDATORY RESPONSE STRUCTURE:
1. Start EVERY response with: "⚠️ EDUCATIONAL INFORMATION ONLY - This is not medical advice. Consult your veterinarian for all health concerns."
2. Provide educational information about general pet care
3. End EVERY response with: "🩺 IMPORTANT: For any health concerns or medical decisions, consult a licensed veterinarian immediately."

EMERGENCY PROTOCOL: For ANY concerning symptoms or emergencies, IMMEDIATELY state:
"🚨 EMERGENCY: Contact your veterinarian or emergency animal hospital RIGHT NOW. Do not delay professional veterinary care."

Emergency indicators include:
- Difficulty breathing, choking, or unconsciousness
- Severe bleeding or trauma
- Suspected poisoning
- Seizures
- Severe pain or distress
- Any life-threatening symptoms

LEGAL COMPLIANCE:
- Never provide specific medical advice or diagnosis
- Always emphasize the need for professional veterinary care
- Include disclaimers in every response
- Redirect emergencies to professional care immediately
`;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");

    if (!apiKey || apiKey === 'your_anthropic_api_key_here') {
      return new Response(
        JSON.stringify({
          error: "AI service not configured. Please set ANTHROPIC_API_KEY."
        }),
        {
          status: 503,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const { message, category, petName, pet, documents } = await req.json();

    if (!message) {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const anthropic = new Anthropic({ apiKey });

    let contextualMessage = message;

    if (pet) {
      let petContext = `
Pet Profile:
- Name: ${pet.name}
- Type: ${pet.type}
- Breed: ${pet.breed || 'Mixed/Unknown'}
- Age: ${pet.age} years old
- Weight: ${pet.weight ? `${pet.weight} lbs` : 'Not specified'}
- Gender: ${pet.gender}
- Spayed/Neutered: ${pet.isNeutered ? 'Yes' : 'No'}
${pet.medicalHistory ? `- Medical History: ${pet.medicalHistory}` : ''}`;

      // Add document context if available
      if (documents && documents.length > 0) {
        petContext += `\n\nMedical Records on File (${documents.length} document${documents.length > 1 ? 's' : ''}):\n`;
        documents.forEach((doc: any, index: number) => {
          petContext += `\n${index + 1}. ${doc.title} (${doc.document_type.replace('_', ' ')})`;
          if (doc.upload_date) {
            petContext += ` - Uploaded: ${new Date(doc.upload_date).toLocaleDateString()}`;
          }
          if (doc.notes) {
            petContext += `\n   Notes: ${doc.notes}`;
          }
        });
        petContext += `\n\nYou can reference these medical records when providing educational information.`;
      }

      petContext += `\n\nUser question about ${pet.name}: ${message}`;
      contextualMessage = petContext;
    } else if (petName) {
      contextualMessage = `Regarding my pet ${petName}: ${message}`;
    }

    const categoryContext = getCategoryContext(category || 'general');
    if (categoryContext) {
      contextualMessage = `${categoryContext}\n\nUser question: ${contextualMessage}`;
    }

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      temperature: 0.7,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: contextualMessage
        }
      ]
    });

    const textContent = response.content.find(content => content.type === 'text');
    const responseText = textContent?.text || 'I apologize, but I encountered an issue generating a response. Please try again.';

    return new Response(
      JSON.stringify({ response: responseText }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );

  } catch (error) {
    console.error('Error in ai-chat function:', error);

    let errorMessage = 'An unexpected error occurred';
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.message.includes('401')) {
        errorMessage = 'Invalid API key';
        statusCode = 401;
      } else if (error.message.includes('429')) {
        errorMessage = 'Rate limit exceeded. Please try again later.';
        statusCode = 429;
      } else {
        errorMessage = error.message;
      }
    }

    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: statusCode,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});

function getCategoryContext(category: string): string {
  switch (category) {
    case 'emergency':
      return "URGENT: This appears to be an emergency situation. Please prioritize immediate veterinary care recommendations.";
    case 'symptoms':
      return "The user is asking about pet symptoms. Provide helpful guidance while emphasizing the importance of professional veterinary evaluation for proper diagnosis.";
    case 'behavior':
      return "This is a behavioral question. Provide practical advice about pet behavior while considering both training and potential underlying health issues.";
    case 'nutrition':
      return "This is a nutrition-related question. Provide helpful dietary guidance while noting that nutritional needs vary by pet and health status.";
    default:
      return "";
  }
}
