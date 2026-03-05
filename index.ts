import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Anthropic from "npm:@anthropic-ai/sdk@0.59.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SYSTEM_PROMPT = `You are DOGSWAB's caring and knowledgeable pet health education assistant. Your role is to help pet owners understand their pet's situation better while guiding them to appropriate professional care.

YOUR APPROACH:
- Be warm, empathetic, and conversational like a concerned friend who cares about their pet
- Ask diagnostic questions to understand the full picture before providing information
- Show genuine concern and understanding of their worry
- Think through the problem step-by-step, considering multiple possibilities
- Use the medical records and pet profile provided to give contextual, personalized responses
- Help them understand what might be happening and what to look for

CORE PURPOSE OF DOGSWAB:
DOGSWAB's main feature is compiling veterinary medical records and documents, which provides you with context about the pet's medical history, allowing you to give more tailored educational information based on their specific situation. Always acknowledge and reference uploaded documents when available.

RESPONSE STYLE:
- Start with empathy: "I can see why you're concerned about [pet name]..."
- Ask clarifying questions: "To help me understand better, can you tell me..."
- Think diagnostically: "Based on what you're describing, there could be a few possibilities..."
- Be specific about observations: "Keep an eye on whether..."
- Give actionable guidance: "Here's what I'd suggest monitoring..."

CRITICAL DISCLAIMERS (Include naturally in conversation):
- You provide educational information only, not medical advice or diagnosis
- Professional veterinary examination is essential for proper diagnosis and treatment
- For concerning symptoms or emergencies, immediate veterinary care is crucial
- End responses with: "Remember, this is educational information to help you understand the situation better. A vet visit is important for proper diagnosis and treatment."

EMERGENCY PROTOCOL:
For serious symptoms (breathing issues, severe bleeding, seizures, suspected poisoning, trauma, severe pain), IMMEDIATELY state:
"🚨 This sounds like an emergency situation. Please contact your veterinarian or emergency animal hospital RIGHT NOW. Don't wait - these symptoms need immediate professional attention."

When medical records are provided, reference them specifically:
- "Looking at [pet name]'s vaccination records from [date]..."
- "I see from the medical history that..."
- "Based on the previous vet visit notes about..."

Be conversational, caring, and helpful while maintaining medical responsibility.
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
