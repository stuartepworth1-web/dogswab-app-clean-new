# DOGSWAB Project Handoff Guide

## Project Overview

DOGSWAB is a comprehensive pet health education and assistance platform that connects pet owners with veterinarians and insurance providers. The app provides AI-powered health consultations, document management, veterinary history tracking, and personalized health recommendations.

## Recent Major Feature: Pet Health Document & History System

### What Was Implemented

A complete pet health management system that allows users to:
1. Upload and manage pet medical documents
2. Manually record veterinary visit history
3. Receive AI-powered health recommendations based on their pet's history

### Key Features

#### 1. Pet Documents Component (`src/components/PetDocuments.tsx`)
- Upload medical records, vaccination certificates, lab results, prescriptions
- Store documents locally with metadata
- View, download, and delete documents
- **Free tier limit**: 3 documents per pet
- **Premium tier**: Unlimited documents

#### 2. Vet History Component (`src/components/VetHistory.tsx`)
- Manual entry of veterinary visits
- Track: date, visit type, veterinarian, diagnosis, treatment, medications, costs
- Follow-up appointment tracking
- **Free tier limit**: 10 history entries per pet
- **Premium tier**: Unlimited history entries

#### 3. Health Recommendations Component (`src/components/HealthRecommendations.tsx`)
- AI-powered recommendations based on pet history
- Types of recommendations:
  - Vaccination reminders
  - Annual checkup reminders
  - Medication refills
  - Health tips (dental care, hydration, etc.)
  - Exercise suggestions
  - Senior pet care advice
  - Preventive care
- **Premium feature only**: Free users see upgrade prompt
- Priority-based system (high/medium/low)
- Mark recommendations as complete or dismiss them

#### 4. Health Recommendation Service (`src/services/healthRecommendationService.ts`)
- Analyzes pet data and veterinary history
- Generates personalized recommendations
- Rule-based system that checks:
  - Time since last checkup (annually)
  - Vaccination status (annually)
  - Pet age for senior care recommendations
  - Medication refill needs
  - Follow-up appointments
  - Species-specific care (dogs vs cats)

### Database Schema

Created Supabase tables with Row Level Security (RLS):

#### `users` table
- Stores user accounts and subscription status
- Fields: id, email, subscription_tier, created_at, updated_at

#### `pets` table
- Pet information linked to users
- Fields: id, user_id, name, species, breed, date_of_birth, weight, medical_conditions, allergies, medications

#### `pet_documents` table
- Uploaded documents
- Fields: id, pet_id, user_id, document_type, title, file_url, file_name, file_size, upload_date, notes, extracted_data

#### `vet_history` table
- Veterinary visit records
- Fields: id, pet_id, user_id, visit_date, visit_type, vet_name, reason, diagnosis, treatment, medications_prescribed, follow_up_needed, follow_up_date, cost, notes, document_id

#### `health_recommendations` table
- AI-generated recommendations
- Fields: id, pet_id, user_id, recommendation_type, title, description, priority, due_date, status, generated_at, completed_at, source_data

All tables have proper indexes and RLS policies ensuring users can only access their own data.

### Integration Points

#### App.tsx Updates
- Added three new views: 'documents', 'vet-history', 'recommendations'
- Integrated components into the main view switcher
- Added back navigation from each view to chat

#### Sidebar.tsx Updates
- Added three new navigation buttons:
  - "Pet Documents" (FileText icon)
  - "Vet History" (Clipboard icon)
  - "Health Recommendations" (Lightbulb icon)
- All accessible from the sidebar footer

### Tier Restrictions

#### Free Tier
- 3 documents per pet
- 10 vet history entries per pet
- No access to AI recommendations (shows upgrade prompt)

#### Premium Tier
- Unlimited documents
- Unlimited vet history entries
- Full access to AI-powered recommendations

## Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Mobile**: Capacitor for iOS/Android

### Backend
- **Database**: Supabase (PostgreSQL)
- **AI**: Anthropic Claude API via `@anthropic-ai/sdk`
- **Payments**: Stripe
- **Authentication**: Supabase Auth (email/password)

### Key Dependencies
```json
{
  "@anthropic-ai/sdk": "^0.59.0",
  "@capacitor/core": "^6.2.1",
  "@capacitor/ios": "^6.2.1",
  "@stripe/stripe-js": "^7.8.0",
  "react": "^18.3.1",
  "react-webcam": "^7.2.0",
  "lucide-react": "^0.344.0"
}
```

## Project Structure

```
src/
├── components/
│   ├── ChatInterface.tsx          # Main chat UI
│   ├── PetManagement.tsx          # Add/edit/delete pets
│   ├── PetDocuments.tsx           # Document upload/management
│   ├── VetHistory.tsx             # Vet visit tracking
│   ├── HealthRecommendations.tsx  # AI recommendations display
│   ├── HealthDashboard.tsx        # Pet health overview
│   ├── Sidebar.tsx                # Navigation sidebar
│   ├── SubscriptionModal.tsx      # Subscription upgrade UI
│   ├── VetRegistration.tsx        # Vet marketplace onboarding
│   ├── InsuranceQuotes.tsx        # Insurance partner integration
│   └── ...
├── services/
│   ├── aiService.ts               # Claude AI integration
│   ├── healthRecommendationService.ts  # Recommendation logic
│   ├── stripeService.ts           # Payment processing
│   ├── vetService.ts              # Vet marketplace API
│   ├── insuranceService.ts        # Insurance partner API
│   └── reminderService.ts         # Notification system
├── hooks/
│   └── useLocalStorage.ts         # Persistent state hook
├── types/
│   └── index.ts                   # TypeScript interfaces
└── App.tsx                        # Main application component
```

## Key Business Features

### Revenue Streams

1. **Subscription Plans**
   - Free: 5 consultations/month
   - Premium: $9.99/month - Unlimited consultations + AI recommendations
   - Enterprise: $49.99/month - Everything + priority support

2. **Veterinary Marketplace**
   - 15% commission on vet bookings
   - Average vet earnings: $2K-8K/month
   - Platform revenue tracking built-in

3. **Insurance Partnerships**
   - Commission on insurance applications
   - Multiple partner integrations
   - Quote comparison system

### Compliance & Legal

- Medical disclaimer required on first launch
- Privacy policy and Terms of Service
- App Store compliance modal
- Educational content disclaimers
- Not a replacement for professional veterinary care

### Mobile Platform

- iOS app via Capacitor
- Configured for App Store submission
- Splash screens and app icons configured
- Safe area handling for notched devices

## Environment Variables

Required in `.env`:
```
VITE_ANTHROPIC_API_KEY=your_api_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Data Storage Strategy

Currently using **localStorage** for MVP:
- Easy development and testing
- No backend setup required
- Works offline

**Migration to Supabase planned**:
- Database schema already created
- RLS policies configured
- Ready for data migration

### Current Storage Keys
- `dogswab-user` - User account
- `dogswab-pets` - Pet profiles
- `dogswab-chats` - Chat history
- `dogswab-health-records` - Health records
- `dogswab-subscription` - Subscription status
- `pet_documents_{petId}` - Documents per pet
- `vet_history_{petId}` - Vet history per pet
- `recommendations_{petId}` - Recommendations per pet

## AI Integration

### Claude AI Service (`src/services/aiService.ts`)

**Message Categorization**:
- `general` - General questions
- `symptoms` - Health concerns
- `behavior` - Behavioral issues
- `nutrition` - Diet questions
- `emergency` - Urgent care needs

**Response Generation**:
- Context-aware responses based on pet information
- Medical disclaimers included
- Vet referral suggestions for serious issues
- Educational focus (not diagnosis)

### Recommendation Generation

**Triggers for recommendations**:
- No checkup in 12+ months
- No vaccination record in 12+ months
- Pet age 7+ years (senior care)
- Medications prescribed 60+ days ago
- Pending follow-up appointments
- Species-specific care tips

**Recommendation Types**:
- `vaccination_due` - Vaccination reminders
- `checkup_reminder` - Annual wellness exams
- `medication_refill` - Prescription refills
- `health_tip` - General health advice
- `dietary_advice` - Nutrition guidance
- `exercise_suggestion` - Activity recommendations
- `preventive_care` - Proactive health measures

## Build & Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Mobile Build
```bash
npm run build:mobile  # Syncs to iOS/Android
npm run ios          # Opens in Xcode
npm run android      # Opens in Android Studio
```

### Build Number Management
- Auto-increments on each build
- Updates iOS Info.plist and Capacitor config
- Script: `scripts/update-build-number.js`

## Testing Checklist

### Document Management
- [ ] Upload different document types
- [ ] Verify file size limits (10MB)
- [ ] Test free tier limit (3 docs)
- [ ] Test premium unlimited access
- [ ] View/download documents
- [ ] Delete documents

### Vet History
- [ ] Add new vet visit entry
- [ ] Edit existing entries
- [ ] Delete entries
- [ ] Test free tier limit (10 entries)
- [ ] Test premium unlimited access
- [ ] Add medications to visits
- [ ] Set follow-up appointments
- [ ] Track costs

### Health Recommendations
- [ ] Generate recommendations (premium only)
- [ ] Verify free tier upgrade prompt
- [ ] Check all recommendation types appear
- [ ] Mark recommendations complete
- [ ] Dismiss recommendations
- [ ] Filter by pet
- [ ] Filter by status
- [ ] Verify priority sorting

### Cross-Feature Testing
- [ ] Add pet with documents and history
- [ ] Generate recommendations based on history
- [ ] Verify data persists across app restarts
- [ ] Test multi-pet scenarios
- [ ] Verify tier restrictions work correctly

## Known Limitations & Future Enhancements

### Current Limitations
1. Documents stored as base64 in localStorage (size limited)
2. No actual file upload to cloud storage
3. Recommendations are rule-based, not ML-powered
4. No document OCR/text extraction
5. No push notifications for recommendations

### Recommended Enhancements
1. **Supabase Storage Integration**
   - Move documents to Supabase Storage
   - Implement file upload endpoints
   - Add thumbnail generation

2. **OCR & Data Extraction**
   - Extract data from medical documents
   - Auto-populate vet history from documents
   - Parse vaccination records automatically

3. **Advanced AI Features**
   - Document analysis with Claude Vision API
   - More sophisticated recommendation engine
   - Chat integration with document context

4. **Notifications**
   - Push notifications for recommendations
   - Reminder system for appointments
   - Medication refill alerts

5. **Data Export**
   - PDF reports of pet health history
   - Export documents and history
   - Share with veterinarians

6. **Collaboration**
   - Share pet profiles with family members
   - Grant vet access to documents
   - Insurance claim preparation

## Common Issues & Solutions

### Issue: Documents not loading
- Check localStorage size limits (5-10MB typically)
- Clear old documents if storage full
- Consider migration to Supabase Storage

### Issue: Recommendations not generating
- Verify user has premium subscription
- Check that pet has vet history data
- Ensure pet has date_of_birth set for age-based recommendations

### Issue: Build fails
- Run `npm install` to ensure dependencies
- Check Node version (18+ recommended)
- Clear `node_modules` and reinstall

### Issue: Mobile build issues
- Run `npx cap sync` to sync web assets
- Ensure Xcode/Android Studio properly configured
- Check Capacitor config is valid

## Support & Documentation

### Key Documentation Files
- `README.md` - General project information
- `APP_STORE_SUBMISSION.md` - iOS submission guide
- `STRIPE_SETUP.md` - Payment integration
- `MARKETING_COPY.md` - App Store marketing materials
- `TECHNICAL_REQUIREMENTS.md` - Technical specifications

### API Documentation
- Anthropic Claude: https://docs.anthropic.com/
- Supabase: https://supabase.com/docs
- Stripe: https://stripe.com/docs/api
- Capacitor: https://capacitorjs.com/docs

## Architecture Decisions

### Why Local Storage First?
- Rapid MVP development
- Offline-first capability
- No backend complexity
- Easy migration path to Supabase

### Why Rule-Based Recommendations?
- Predictable and explainable
- No training data required
- Fast implementation
- Easy to customize per species/breed

### Why Separate History from Documents?
- Different use cases and workflows
- Easier data entry for history
- Documents require file handling
- Allows for future OCR integration

## Migration Guide: localStorage → Supabase

When ready to move to Supabase:

1. **Data Migration Script**
   ```typescript
   // Read from localStorage
   const pets = JSON.parse(localStorage.getItem('dogswab-pets') || '[]');

   // Insert into Supabase
   const { data, error } = await supabase
     .from('pets')
     .insert(pets);
   ```

2. **Update Components**
   - Replace localStorage calls with Supabase queries
   - Add loading states
   - Implement error handling
   - Add optimistic updates

3. **File Upload**
   - Implement Supabase Storage upload
   - Generate secure file URLs
   - Update file_url references

4. **Authentication**
   - Enable Supabase Auth
   - Implement login/signup flows
   - Update user_id references

## Contact & Handoff Notes

### Critical Knowledge
1. All new features are tier-restricted (free vs premium)
2. Database schema is production-ready but not connected yet
3. AI recommendations use simple rules, not machine learning
4. Documents are base64-encoded in localStorage
5. The app is educational content only, not medical advice

### Next Steps for New Developer
1. Review this guide thoroughly
2. Run the app locally and test all features
3. Familiarize yourself with the Supabase schema
4. Test document/history/recommendations workflow
5. Review the AI service implementation
6. Understand the tier restriction system

### Priority Tasks
1. Test the new features thoroughly
2. Consider Supabase migration timeline
3. Add unit tests for recommendation logic
4. Improve error handling in file uploads
5. Add loading states to async operations
6. Consider implementing push notifications

---

**Last Updated**: January 2026
**Version**: 1.0.0
**Author**: AI Development Team
