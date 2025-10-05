# Decouple AlternateCoreProduct into Separate Next.js Pages Implementation Plan

## Overview

Currently, [AlternateCoreProduct.tsx](../src/app/components/AlternateCoreProduct.tsx) is a monolithic component managing the entire video analysis workflow through 13 useState hooks. This plan decouples it into three distinct Next.js pages with clean state management and navigation flow.

## Current State Analysis

### Existing Components:
- **AlternateCoreProduct.tsx**: Monolithic orchestrator with all state (13 useState hooks)
- **AlternateCenteredVideoAnalysis.tsx**: Video upload and prompt input UI
- **NetworkVisualization.tsx**: 3D network of people personas
- **InteractiveNetworkViz.tsx**: Alternative interactive network (unused in new flow)

### Current State (13 hooks in AlternateCoreProduct):
1. `uploadedVideo` - File object
2. `prompt` - Search query string
3. `isSimulating` - Boolean simulation state
4. `progress` - Number 0-100
5. `selectedPerson` - Person for modal
6. `showFeedback` - Boolean for FeedbackPanel
7. `allPeople` - Complete dataset (mockPeople)
8. `filteredPeople` - Filtered results
9. `foundCount` - Number of matches
10. `showSearchProgress` - Boolean
11. `showProfilesStream` - Boolean
12. `showAnalysisReport` - Boolean
13. `showExpandedReport` - Boolean

### Key Discoveries:
- All navigation is programmatic via `router.push()` (no Link components)
- Route params accessed via `useParams()` from `next/navigation`
- All pages use `"use client"` directive
- No nested layouts exist in the project routes
- State flows unidirectionally parent → child via props

## Desired End State

### Three Separate Pages:

#### 1. Upload Page (`/[username]/projects/[projectId]/upload`)
**Content:**
- File input (video upload)
- Text input (prompt)
- "Run Simulation" button

**State:**
- `uploadedVideo`: File | null
- `prompt`: string

**Success on submission:**
- Navigate to `/[username]/projects/[projectId]/dashboard`
- Pass video + prompt via router state or URL params

#### 2. Dashboard Page (`/[username]/projects/[projectId]/dashboard`)
**Content:**
- NetworkVisualization component (full screen, left side)
- Mission Status sidebar (right side)
- Fixed position "Run Simulation" button (bottom)

**State:**
- `filteredPeople`: Person[]
- `selectedPerson`: Person | null (for modal)
- Receives video + prompt from upload page

**Success on Run Simulation:**
- Navigate to `/[username]/projects/[projectId]/simulation`
- Pass all state forward

#### 3. Simulation Page (`/[username]/projects/[projectId]/simulation`)
**Content:**
- Video preview (plays uploaded video)
- Video description: "A cinematic iPhone ad focusing on design and emotional connection."
- Sidebar with analysis results

**State:**
- `uploadedVideo`: File | null
- `prompt`: string
- `filteredPeople`: Person[]
- `showSearchProgress`: boolean
- `showProfilesStream`: boolean
- `showAnalysisReport`: boolean
- `progress`: number

**Flow:**
- Show SearchProgress modal
- → ProfilesStream modal
- → AnalysisReport modal
- Display final results in sidebar

## What We're NOT Doing

- NOT modifying the NetworkVisualization component logic
- NOT changing the parseSearchQuery function (will extract to utility)
- NOT altering the mockPeople data structure
- NOT implementing actual API calls (using mock data simulation)
- NOT modifying UI component library files
- NOT creating new shared state management (Context/Redux)

## Implementation Approach

Decouple the monolithic component into three separate Next.js pages, each responsible for its own UI and local state. State persistence between pages will be handled externally (not part of this decoupling plan).

## Phase 1: Extract Shared Utilities and Types

### Overview
Create reusable utilities and ensure type consistency across pages.

### Changes Required:

#### 1. Create Utility File for Query Parsing

**File**: `src/lib/parseSearchQuery.ts`
**Changes**: Extract parseSearchQuery function from AlternateCoreProduct

```typescript
import type { Person } from "@/types/shared";

export function parseSearchQuery(query: string, allPeople: Person[]): Person[] {
  const lowerQuery = query.toLowerCase();

  // Extract filters from the query
  let ageMin: number | null = null;
  let ageMax: number | null = null;
  let gender: string | null = null;
  let generation: string | null = null;
  let location: string | null = null;
  let industry: string | null = null;

  // Age range patterns
  const ageRangeMatch = lowerQuery.match(
    /age\s+(?:range\s+)?(?:around\s+|between\s+)?(\d+)[-–\s]*(?:to\s+)?(\d+)/
  );
  if (ageRangeMatch) {
    ageMin = parseInt(ageRangeMatch[1]);
    ageMax = parseInt(ageRangeMatch[2]);
  } else {
    const singleAgeMatch = lowerQuery.match(/age\s+(?:around\s+|about\s+)?(\d+)/);
    if (singleAgeMatch) {
      const age = parseInt(singleAgeMatch[1]);
      ageMin = age - 2;
      ageMax = age + 2;
    }
  }

  // Gender patterns
  if (lowerQuery.includes("women") || lowerQuery.includes("female")) {
    gender = "Women";
  } else if (lowerQuery.includes("men") || lowerQuery.includes("male")) {
    gender = "Men";
  }

  // Generation patterns
  if (lowerQuery.includes("gen z") || lowerQuery.includes("generation z")) {
    generation = "Gen Z";
  } else if (lowerQuery.includes("millennial") || lowerQuery.includes("gen y")) {
    generation = "Millennial";
  } else if (lowerQuery.includes("gen x") || lowerQuery.includes("generation x")) {
    generation = "Gen X";
  }

  // Location patterns
  const canadianCities = [
    "toronto", "vancouver", "montreal", "calgary", "ottawa",
    "edmonton", "winnipeg", "quebec", "hamilton", "kitchener",
    "london", "halifax",
  ];
  const canadianProvinces = [
    "ontario", "quebec", "british columbia", "alberta",
    "manitoba", "saskatchewan", "nova scotia", "new brunswick",
    "newfoundland", "prince edward island",
  ];

  for (const city of canadianCities) {
    if (lowerQuery.includes(city)) {
      location = city;
      break;
    }
  }

  if (!location) {
    for (const province of canadianProvinces) {
      if (lowerQuery.includes(province)) {
        location = province;
        break;
      }
    }
  }

  if (lowerQuery.includes("canada") || lowerQuery.includes("canadian")) {
    location = location || "canada";
  }

  // Industry patterns
  const industries = [
    "fintech", "finance", "technology", "tech",
    "software", "marketing", "design", "operations",
  ];
  for (const ind of industries) {
    if (lowerQuery.includes(ind)) {
      industry = ind;
      break;
    }
  }

  // Filter people based on extracted criteria
  return allPeople.filter((person) => {
    let matches = true;

    if (ageMin !== null && ageMax !== null) {
      matches = matches && person.age >= ageMin && person.age <= ageMax;
    }

    if (gender) {
      matches = matches && person.gender.toLowerCase() === gender.toLowerCase();
    }

    if (generation) {
      matches = matches && person.generation.toLowerCase() === generation.toLowerCase();
    }

    if (location && location !== "canada") {
      matches = matches && person.location.toLowerCase().includes(location.toLowerCase());
    }

    if (industry) {
      matches = matches && person.industry.toLowerCase().includes(industry.toLowerCase());
    }

    return matches;
  });
}
```

#### 2. Create Mock Data File

**File**: `src/lib/mockPeople.ts`
**Changes**: Extract mockPeople array from AlternateCoreProduct

```typescript
import type { Person } from "@/types/shared";

export const mockPeople: Person[] = [
  {
    id: "1",
    name: "James Wilson",
    age: 25,
    gender: "Men",
    location: "Toronto, Canada",
    title: "CEO",
    generation: "Gen Z",
    industry: "Fintech",
    feedback: "When he got his first job he didn't know what to do... all they told him was \"here are some boxes figure out what to do with them\" lol but from there he kept going until he created his own business. Gotta keep going to keep growing and if you're not stacking you're lackin'",
    reaction: "intrigued",
    fullReaction: "James Wilson, a Gen Z fintech CEO with a high risk tolerance and interest in innovation, is likely to be intrigued by an idea that targets his generation with a fintech app.",
    position: { x: 0.3, y: 0.4, z: 0.6 },
  },
  {
    id: "2",
    name: "Sarah Chen",
    age: 32,
    gender: "Women",
    location: "Clovis, CA",
    title: "Software Engineer",
    generation: "Millennial",
    industry: "Software Development",
    feedback: "In the beginning, where he was just going to work for a little while to save up so he could travel and stayed 50 plus years. Amazing how someone can be inspired to stay with a company for so long.",
    reaction: "inspired",
    fullReaction: "Sarah Chen, a millennial software engineer who values financial planning and career growth, is likely to be inspired by an app that helps her demographic manage finances effectively.",
    position: { x: -0.2, y: 0.7, z: -0.3 },
  },
  {
    id: "3",
    name: "Marcus Thompson",
    age: 28,
    gender: "Men",
    location: "Montreal, Quebec",
    title: "Product Manager",
    generation: "Gen Z",
    industry: "Technology",
    feedback: "The most important thing is building something that people actually want to use. You can have the best technology in the world but if it doesn't solve a real problem, nobody cares.",
    reaction: "interested",
    fullReaction: "Marcus Thompson, a Gen Z product manager in tech, is likely to be interested in evaluating the product-market fit and user experience of a new fintech solution.",
    position: { x: 0.8, y: -0.2, z: 0.1 },
  },
  {
    id: "4",
    name: "Emily Rodriguez",
    age: 29,
    gender: "Women",
    location: "Vancouver, BC",
    title: "Marketing Director",
    generation: "Gen Z",
    industry: "Marketing",
    feedback: "Gen X in Canada is such an underserved market. Most apps focus on millennials or boomers, but Gen X has real money and specific needs that nobody talks about.",
    reaction: "excited",
    fullReaction: "Emily Rodriguez, a Gen Z marketing director, is likely to be excited about the market opportunity and positioning strategy of targeting Gen X Canadians.",
    position: { x: -0.5, y: 0.3, z: 0.8 },
  },
  {
    id: "5",
    name: "David Kim",
    age: 35,
    gender: "Men",
    location: "Calgary, Alberta",
    title: "Financial Advisor",
    generation: "Millennial",
    industry: "Financial Services",
    feedback: "Canadian financial regulations are complex, and Gen X clients often feel overwhelmed by existing solutions. A simple, compliant app could really help bridge that gap.",
    reaction: "analytical",
    fullReaction: "David Kim, a millennial financial advisor, is likely to take an analytical approach to evaluating the compliance and practical utility of the proposed fintech solution.",
    position: { x: 0.1, y: -0.6, z: -0.4 },
  },
  {
    id: "6",
    name: "Lisa Wang",
    age: 31,
    gender: "Women",
    location: "Ottawa, Ontario",
    title: "UX Designer",
    generation: "Millennial",
    industry: "Design",
    feedback: "The key is making sure the interface doesn't alienate Gen X users who might not be as tech-savvy as younger generations. Clean, simple design with clear value props.",
    reaction: "thoughtful",
    fullReaction: "Lisa Wang, a millennial UX designer, is likely to be thoughtful about the user experience considerations and design challenges for serving Gen X users.",
    position: { x: -0.7, y: -0.1, z: 0.5 },
  },
  {
    id: "7",
    name: "Ryan O'Connor",
    age: 26,
    gender: "Men",
    location: "Halifax, Nova Scotia",
    title: "Business Analyst",
    generation: "Gen Z",
    industry: "Finance",
    feedback: "Atlantic Canada has different economic pressures than Toronto or Vancouver. Regional considerations could be a major differentiator for this type of product.",
    reaction: "strategic",
    fullReaction: "Ryan O'Connor, a Gen Z business analyst in finance, is likely to think strategically about regional market differences and competitive positioning.",
    position: { x: 0.6, y: 0.5, z: -0.7 },
  },
  {
    id: "8",
    name: "Jessica Brown",
    age: 33,
    gender: "Women",
    location: "Winnipeg, Manitoba",
    title: "Operations Manager",
    generation: "Millennial",
    industry: "Operations",
    feedback: "Execution is everything. Lots of fintech startups have good ideas but fail on the operational side. Customer support, onboarding, compliance - that's where you win or lose.",
    reaction: "practical",
    fullReaction: "Jessica Brown, a millennial operations manager, is likely to focus on the practical execution challenges and operational requirements for launching a successful fintech product.",
    position: { x: -0.3, y: 0.8, z: 0.2 },
  },
];
```

### Success Criteria:

#### Automated Verification:
- `src/lib/parseSearchQuery.ts` exports `parseSearchQuery` function
- `src/lib/mockPeople.ts` exports `mockPeople` array
- TypeScript compilation succeeds with no errors

#### Manual Verification:
- [ ] Extracted utilities can be imported without errors
- [ ] Type definitions match original implementation

---

## Phase 2: Create Upload Page

### Overview
Simplify the upload page to contain ONLY file input, prompt input, and Run Simulation button.

### Changes Required:

#### 1. Upload Page Component

**File**: `src/app/[username]/projects/[projectId]/upload/page.tsx`
**Changes**: Replace entire file with simplified upload flow

```typescript
"use client";

import { useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "motion/react";
import { Upload, ChevronLeft, LogOut } from "lucide-react";
import { parseSearchQuery } from "@/lib/parseSearchQuery";
import { mockPeople } from "@/lib/mockPeople";

export default function UploadPage() {
  const { username, projectId } = useParams();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
  const [prompt, setPrompt] = useState(
    "Simulate how 25 Gen Z tech enthusiasts react to this ad"
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("video/")) {
      setIsLoading(true);
      setTimeout(() => {
        setUploadedVideo(file);
        setIsLoading(false);
      }, 1000);
    }
  };

  const handleRunSimulation = () => {
    if (!uploadedVideo || !prompt.trim()) return;

    // Parse the query and filter people
    const filtered = parseSearchQuery(prompt, mockPeople);

    // TODO: Save state (video, prompt, filteredPeopleIds) to backend/storage
    // This will be implemented separately from decoupling

    // Navigate to dashboard
    router.push(`/${username}/projects/${projectId}/dashboard`);
  };

  return (
    <div className="h-screen bg-black text-white overflow-hidden relative">
      {/* Header */}
      <div className="border-b border-gray-800/50 bg-black/80 backdrop-blur-sm relative z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.push(`/${username}/projects`)}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-gray-800"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            <div>
              <h1 className="text-xl text-white">Upload Video</h1>
              <p className="text-sm text-white/60">
                Upload and configure your video analysis
              </p>
            </div>
          </div>

          <Button
            onClick={() => router.push("/")}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-gray-800 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-73px)] px-8 py-12 relative">
        {/* Orbit Ring Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            className="w-[800px] h-[800px] border border-white/5 rounded-full"
            animate={{ rotate: 360 }}
            transition={{
              duration: 120,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <motion.div
            className="absolute w-[600px] h-[600px] border border-white/3 rounded-full"
            animate={{ rotate: -360 }}
            transition={{
              duration: 80,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>

        {/* Upload Card */}
        <motion.div
          className="w-full max-w-2xl relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Video Upload Area */}
          <div
            className="relative mb-8 rounded-2xl overflow-hidden"
            style={{
              background: "rgba(11, 17, 32, 0.4)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(110, 231, 183, 0.2)",
              boxShadow: `
                0 0 40px rgba(110, 231, 183, 0.1),
                0 0 80px rgba(37, 99, 235, 0.05),
                0 0 120px rgba(168, 85, 247, 0.03)
              `,
            }}
          >
            {isLoading ? (
              <div className="aspect-video flex items-center justify-center bg-gray-900/30">
                <motion.div
                  className="w-16 h-16 border-4 border-transparent border-t-white/30 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </div>
            ) : uploadedVideo ? (
              <div className="relative aspect-video">
                <video
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                >
                  <source
                    src={URL.createObjectURL(uploadedVideo)}
                    type={uploadedVideo.type}
                  />
                </video>
                <div className="absolute top-6 left-6">
                  <h2 className="text-2xl text-white">{uploadedVideo.name}</h2>
                </div>
              </div>
            ) : (
              <div
                className="aspect-video flex flex-col items-center justify-center cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
              >
                <motion.div
                  className="mb-6"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(110, 231, 183, 0.1), rgba(37, 99, 235, 0.1), rgba(168, 85, 247, 0.1))",
                      border: "2px solid transparent",
                      backgroundClip: "padding-box",
                    }}
                  >
                    <Upload className="w-8 h-8 text-white/70" />
                  </div>
                </motion.div>
                <h3 className="text-xl text-white/70 mb-2">
                  Upload video to analyze
                </h3>
                <p className="text-sm text-white/50">
                  Supports MP4, MOV files up to 200MB
                </p>
              </div>
            )}
          </div>

          {/* Prompt Input */}
          <div
            className="rounded-2xl p-4 mb-6"
            style={{
              background: "rgba(0, 0, 0, 0.6)",
              backdropFilter: "blur(20px)",
              border: `1px solid ${
                prompt.trim() && uploadedVideo
                  ? "rgba(110, 231, 183, 0.3)"
                  : "rgba(255, 255, 255, 0.1)"
              }`,
              boxShadow:
                prompt.trim() && uploadedVideo
                  ? "0 0 40px rgba(110, 231, 183, 0.1)"
                  : "none",
            }}
          >
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Simulate how 25 Gen Z tech enthusiasts react to this ad"
              className="bg-transparent border-none text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/10"
              onKeyPress={(e) => {
                if (
                  e.key === "Enter" &&
                  prompt.trim() &&
                  uploadedVideo
                ) {
                  handleRunSimulation();
                }
              }}
            />
          </div>

          {/* Run Simulation Button */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleRunSimulation}
              disabled={!prompt.trim() || !uploadedVideo}
              className="w-full px-6 py-6 text-white border-2 border-transparent relative overflow-hidden group text-lg"
              style={{
                background:
                  "linear-gradient(135deg, #6EE7B7, #2563EB, #A855F7)",
                borderRadius: "12px",
              }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(110, 231, 183, 0.3), rgba(37, 99, 235, 0.3), rgba(168, 85, 247, 0.3))",
                  filter: "blur(4px)",
                }}
              />
              <span className="relative z-10">Run Simulation</span>
            </Button>
          </motion.div>
        </motion.div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleVideoUpload}
          className="hidden"
        />
      </div>
    </div>
  );
}
```

### Success Criteria:

#### Automated Verification:
- TypeScript compilation succeeds
- Page renders without errors at `/[username]/projects/[projectId]/upload`

#### Manual Verification:
- [ ] Video can be uploaded via file input
- [ ] Prompt text can be edited
- [ ] Run Simulation button is disabled when video or prompt is missing
- [ ] Clicking Run Simulation navigates to dashboard page

---

## Phase 3: Create Dashboard Page

### Overview
Build the dashboard page with NetworkVisualization, Mission Status sidebar, and fixed Run Simulation button.

### Changes Required:

#### 1. Create Mission Status Sidebar Component

**File**: `src/app/components/MissionStatus.tsx`
**Changes**: Extract sidebar from AlternateCoreProduct

```typescript
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import type { Person } from "@/types/shared";

interface MissionStatusProps {
  filteredPeople: Person[];
  onViewFeedback: () => void;
}

export function MissionStatus({
  filteredPeople,
  onViewFeedback,
}: MissionStatusProps) {
  return (
    <div className="w-80 border-l border-gray-800/50 bg-black/40 backdrop-blur-sm overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Mission Status */}
        <div>
          <div className="text-sm text-white/50 mb-3 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            MISSION STATUS
            <span className="ml-auto text-white">ACTIVE</span>
          </div>
          <div className="text-xs space-y-1 text-white/70">
            <div>Progress: 100%</div>
            <div className="bg-gray-700/50 h-1 rounded overflow-hidden">
              <div
                className="bg-green-400 h-full"
                style={{ width: "100%" }}
              ></div>
            </div>
            <div className="text-white/50">Status: READY</div>
          </div>
        </div>

        {/* Feedback Summary */}
        <div>
          <div className="text-sm text-white/50 mb-2 flex items-center gap-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
            PERSONAS LOADED
          </div>
          <div className="text-xs text-white/40 mb-4">
            {filteredPeople.length} personas ready for simulation
          </div>

          {/* Glassmorphic Card Container */}
          <div
            className="relative rounded-lg p-5 backdrop-blur-sm border border-blue-400/20"
            style={{
              background:
                "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
              boxShadow:
                "inset 0 0 30px rgba(59, 130, 246, 0.1), 0 0 20px rgba(59, 130, 246, 0.15)",
            }}
          >
            <div className="relative z-10">
              <div className="text-center py-6">
                <div className="text-xs text-white/50 mb-2">
                  {filteredPeople.length} personas loaded
                </div>
                <div className="text-xs text-white/30">
                  Click Run Simulation to analyze
                </div>
              </div>
            </div>
          </div>

          {/* View All Feedback Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            className="mt-8"
          >
            <Button
              onClick={onViewFeedback}
              className="w-full bg-slate-800/80 hover:bg-slate-700/80 text-white text-sm py-3 rounded-lg border border-white/10 hover:border-blue-400/30 transition-all duration-300"
              style={{
                background:
                  "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
                boxShadow: "0 0 15px rgba(59, 130, 246, 0.15)",
              }}
            >
              View All Personas
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
```

#### 2. Dashboard Page Component

**File**: `src/app/[username]/projects/[projectId]/dashboard/page.tsx`
**Changes**: Replace entire file with dashboard implementation

```typescript
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, LogOut, Play } from "lucide-react";
import { NetworkVisualization } from "@/app/components/NetworkVisualization";
import { TowaReactionModal } from "@/app/components/TowaReactionModal";
import { FeedbackPanel } from "@/app/components/FeedbackPanel";
import { MissionStatus } from "@/app/components/MissionStatus";
import { mockPeople } from "@/lib/mockPeople";
import type { Person } from "@/types/shared";

export default function DashboardPage() {
  const { username, projectId } = useParams();
  const router = useRouter();

  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
  const [prompt, setPrompt] = useState("");
  const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // TODO: Load state from backend/storage
  useEffect(() => {
    const loadState = async () => {
      // TODO: Fetch job data from Supabase or backend
      // For now, redirect to upload if no state
      router.push(`/${username}/projects/${projectId}/upload`);
    };

    loadState();
  }, [username, projectId, router]);

  const handleRunSimulation = () => {
    // TODO: Save current state to backend/storage
    // This will be implemented separately from decoupling

    // Navigate to simulation page
    router.push(`/${username}/projects/${projectId}/simulation`);
  };

  return (
    <div className="h-screen bg-black text-white overflow-hidden relative">
      {/* Header */}
      <div className="border-b border-gray-800/50 bg-black/80 backdrop-blur-sm relative z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.push(`/${username}/projects`)}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-gray-800"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            <div>
              <h1 className="text-xl text-white">Dashboard</h1>
              <p className="text-sm text-white/60">
                Explore personas and run simulation
              </p>
            </div>
          </div>

          <Button
            onClick={() => router.push("/")}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-gray-800 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-73px)] relative">
        {/* Main Area - Network Visualization */}
        <div className="flex-1 relative">
          <NetworkVisualization
            people={filteredPeople}
            onPersonClick={setSelectedPerson}
            uploadedVideo={uploadedVideo}
            isSimulating={false}
            searchComplete={false}
          />
        </div>

        {/* Right Sidebar */}
        <MissionStatus
          filteredPeople={filteredPeople}
          onViewFeedback={() => setShowFeedback(true)}
        />
      </div>

      {/* Fixed Run Simulation Button */}
      <motion.div
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={handleRunSimulation}
            disabled={filteredPeople.length === 0}
            className="px-8 py-4 text-white border-2 border-transparent relative overflow-hidden group text-lg shadow-2xl"
            style={{
              background: "linear-gradient(135deg, #6EE7B7, #2563EB, #A855F7)",
              borderRadius: "12px",
            }}
          >
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background:
                  "linear-gradient(135deg, rgba(110, 231, 183, 0.3), rgba(37, 99, 235, 0.3), rgba(168, 85, 247, 0.3))",
                filter: "blur(4px)",
              }}
            />
            <span className="relative z-10 flex items-center gap-2">
              <Play className="w-5 h-5" />
              Run Simulation
            </span>
          </Button>
        </motion.div>
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {selectedPerson && (
          <TowaReactionModal
            person={selectedPerson}
            onClose={() => setSelectedPerson(null)}
            onAddToFeedback={(person) => {
              console.log("Adding to feedback:", person.name);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFeedback && (
          <FeedbackPanel
            people={filteredPeople}
            onClose={() => setShowFeedback(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
```

### Success Criteria:

#### Automated Verification:
- TypeScript compilation succeeds
- Page renders without errors at `/[username]/projects/[projectId]/dashboard`

#### Manual Verification:
- [ ] NetworkVisualization renders with personas
- [ ] Mission Status sidebar displays on the right
- [ ] Clicking personas opens TowaReactionModal
- [ ] View All Personas opens FeedbackPanel
- [ ] Run Simulation button is visible at bottom center
- [ ] Clicking Run Simulation navigates to simulation page

---

## Phase 4: Create Simulation Page

### Overview
Build the simulation page that shows the video, runs the analysis flow, and displays results.

### Changes Required:

#### 1. Create Video Analysis Sidebar Component

**File**: `src/app/components/VideoAnalysisSidebar.tsx`
**Changes**: Extract analysis sidebar from AlternateCoreProduct

```typescript
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import type { Person } from "@/types/shared";

interface VideoAnalysisSidebarProps {
  showAnalysisReport: boolean;
  onViewFeedback: () => void;
}

export function VideoAnalysisSidebar({
  showAnalysisReport,
  onViewFeedback,
}: VideoAnalysisSidebarProps) {
  return (
    <div className="w-80 border-l border-gray-800/50 bg-black/40 backdrop-blur-sm overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Mission Status */}
        <div>
          <div className="text-sm text-white/50 mb-3 flex items-center gap-2">
            {!showAnalysisReport && (
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            )}
            MISSION STATUS
            <span className="ml-auto text-white">ACTIVE</span>
          </div>
          <div className="text-xs space-y-1 text-white/70">
            <div>Progress: 100%</div>
            <div className="bg-gray-700/50 h-1 rounded overflow-hidden">
              <div
                className="bg-green-400 h-full"
                style={{ width: "100%" }}
              ></div>
            </div>
            <div className="text-white/50">Status: COMPLETE</div>
          </div>
        </div>

        {/* Feedback Summary */}
        <div>
          <div className="text-sm text-white/50 mb-2 flex items-center gap-2">
            {!showAnalysisReport && (
              <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
            )}
            FEEDBACK SUMMARY
          </div>
          <div className="text-xs text-white/40 mb-4">
            AI Personas' key reactions
          </div>

          {/* Glassmorphic Card Container */}
          <div
            className="relative rounded-lg p-5 backdrop-blur-sm border border-blue-400/20"
            style={{
              background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
              boxShadow:
                "inset 0 0 30px rgba(59, 130, 246, 0.1), 0 0 20px rgba(59, 130, 246, 0.15)",
            }}
          >
            <div className="relative z-10">
              {showAnalysisReport ? (
                <div className="space-y-4">
                  {/* Highlights Section */}
                  <div>
                    <div className="text-xs text-cyan-300 mb-2 font-medium">
                      Highlights
                    </div>
                    <div className="space-y-2">
                      {[
                        "Loved the emotional storytelling approach.",
                        "Strong visual identity, but message unclear.",
                        "Great potential for viral sharing.",
                      ].map((highlight, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: 0.3 + i * 0.3,
                            duration: 0.6,
                            ease: "easeOut",
                          }}
                          className="text-xs text-white/70 flex items-start gap-2"
                        >
                          <div className="w-1 h-1 bg-cyan-400 rounded-full mt-1.5 flex-shrink-0" />
                          <span>"{highlight}"</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Themes (Tags) */}
                  <div>
                    <div className="text-xs text-cyan-300 mb-2 font-medium">
                      Themes
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {["Innovation", "Emotion", "BrandTrust", "Lifestyle"].map(
                        (tag, i) => (
                          <motion.div
                            key={tag}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                              delay: 0.9 + i * 0.1,
                              duration: 0.4,
                            }}
                            className="px-2 py-1 rounded-full text-xs border border-white/20 text-white/70 cursor-pointer hover:border-cyan-400/50 hover:text-cyan-300 hover:bg-cyan-400/5 transition-all duration-300"
                            style={{
                              background: "rgba(110, 231, 183, 0.05)",
                            }}
                          >
                            #{tag}
                          </motion.div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Sentiment Overview */}
                  <div>
                    <div className="text-xs text-cyan-300 mb-2 font-medium">
                      Sentiment Overview
                    </div>
                    <div className="space-y-2">
                      {[
                        { label: "Positive", value: 74, color: "#22c55e" },
                        { label: "Neutral", value: 18, color: "#fbbf24" },
                        { label: "Negative", value: 8, color: "#ef4444" },
                      ].map((sentiment, i) => (
                        <div key={sentiment.label} className="flex items-center gap-3">
                          <div className="w-16 text-xs text-white/60">
                            {sentiment.label}
                          </div>
                          <div className="flex-1 bg-white/5 h-2 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ backgroundColor: sentiment.color }}
                              initial={{ width: 0 }}
                              animate={{ width: `${sentiment.value}%` }}
                              transition={{
                                delay: 1.2 + i * 0.2,
                                duration: 0.6,
                                ease: "easeOut",
                              }}
                            />
                          </div>
                          <div className="w-8 text-xs text-white/80 text-right">
                            {sentiment.value}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Demographic Reactions */}
                  <div>
                    <div className="text-xs text-cyan-300 mb-2 font-medium">
                      Demographic Reactions
                    </div>
                    <div className="space-y-2">
                      {[
                        { label: "Gen Z Engagement", value: 86, color: "#a855f7" },
                        { label: "Millennials", value: 64, color: "#2563eb" },
                      ].map((demo, i) => (
                        <div key={demo.label} className="flex items-center gap-3">
                          <div className="w-20 text-xs text-white/60">
                            {demo.label}
                          </div>
                          <div className="flex-1 bg-white/5 h-2 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ backgroundColor: demo.color }}
                              initial={{ width: 0 }}
                              animate={{ width: `${demo.value}%` }}
                              transition={{
                                delay: 1.8 + i * 0.2,
                                duration: 0.6,
                                ease: "easeOut",
                              }}
                            />
                          </div>
                          <div className="w-8 text-xs text-white/80 text-right">
                            {demo.value}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="text-xs text-white/50 mb-2">
                    Running simulation...
                  </div>
                  <div className="text-xs text-white/30">
                    Analyzing persona reactions
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: showAnalysisReport ? 2.8 : 0.5,
              duration: 0.6,
            }}
            className="text-xs text-white/30 mt-6 leading-relaxed"
          >
            Generated by AI personas trained on audience profiles.
          </motion.div>

          {/* View All Feedback Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: showAnalysisReport ? 3.0 : 0.7,
              duration: 0.4,
            }}
            className="mt-8"
          >
            <Button
              onClick={onViewFeedback}
              className="w-full bg-slate-800/80 hover:bg-slate-700/80 text-white text-sm py-3 rounded-lg border border-white/10 hover:border-blue-400/30 transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
                boxShadow: "0 0 15px rgba(59, 130, 246, 0.15)",
              }}
            >
              View All Feedback
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
```

#### 2. Simulation Page Component

**File**: `src/app/[username]/projects/[projectId]/simulation/page.tsx`
**Changes**: Replace entire file with simulation implementation

```typescript
"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, LogOut, Play, Pause } from "lucide-react";
import { NetworkVisualization } from "@/app/components/NetworkVisualization";
import { TowaReactionModal } from "@/app/components/TowaReactionModal";
import { FeedbackPanel } from "@/app/components/FeedbackPanel";
import { SearchProgress } from "@/app/components/SearchProgress";
import { ProfilesStream } from "@/app/components/ProfilesStream";
import { AnalysisReport, ExpandedReport } from "@/app/components/AnalysisReport";
import { VideoAnalysisSidebar } from "@/app/components/VideoAnalysisSidebar";
import { mockPeople } from "@/lib/mockPeople";
import type { Person } from "@/types/shared";

export default function SimulationPage() {
  const { username, projectId } = useParams();
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
  const [prompt, setPrompt] = useState("");
  const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const [isSimulating, setIsSimulating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [foundCount, setFoundCount] = useState(0);
  const [showSearchProgress, setShowSearchProgress] = useState(false);
  const [showProfilesStream, setShowProfilesStream] = useState(false);
  const [showAnalysisReport, setShowAnalysisReport] = useState(false);
  const [showExpandedReport, setShowExpandedReport] = useState(false);

  const [isPlaying, setIsPlaying] = useState(true);

  // TODO: Load state from backend/storage
  useEffect(() => {
    const loadState = async () => {
      // TODO: Fetch job data from Supabase or backend
      // For now, redirect to upload if no state
      router.push(`/${username}/projects/${projectId}/upload`);
    };

    loadState();
  }, [username, projectId, router]);

  const startSimulation = (people: Person[]) => {
    setIsSimulating(true);
    setShowSearchProgress(true);
    setShowProfilesStream(false);
    setShowAnalysisReport(false);
    setProgress(0);
    setFoundCount(people.length);

    // Simulate search progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          setTimeout(() => {
            setShowSearchProgress(false);
            setShowProfilesStream(true);

            setTimeout(() => {
              setShowProfilesStream(false);
              setShowAnalysisReport(true);
              setIsSimulating(false);
            }, 3000);
          }, 1000);
          return 100;
        }
        return prev + Math.random() * 8 + 2;
      });
    }, 300);
  };

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="h-screen bg-black text-white overflow-hidden relative">
      {/* Header */}
      <div className="border-b border-gray-800/50 bg-black/80 backdrop-blur-sm relative z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.push(`/${username}/projects/${projectId}/dashboard`)}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-gray-800"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            <div>
              <h1 className="text-xl text-white">Simulation</h1>
              <p className="text-sm text-white/60">
                Analyzing persona reactions
              </p>
            </div>
          </div>

          <Button
            onClick={() => router.push("/")}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-gray-800 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-73px)] relative">
        {/* Main Content Area */}
        <div className="flex-1 relative overflow-auto">
          <div className="flex flex-col items-center justify-start min-h-full px-8 py-12">
            {/* Video Player */}
            <motion.div
              className="w-full max-w-2xl mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{
                  background: "rgba(11, 17, 32, 0.4)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(110, 231, 183, 0.2)",
                  boxShadow: "0 0 40px rgba(110, 231, 183, 0.1)",
                }}
              >
                {uploadedVideo && (
                  <div
                    className="relative aspect-video cursor-pointer group"
                    onClick={handleVideoClick}
                  >
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      autoPlay
                      muted
                      loop
                    >
                      <source
                        src={URL.createObjectURL(uploadedVideo)}
                        type={uploadedVideo.type}
                      />
                    </video>

                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-200" />

                    {/* Play/Pause Control */}
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div
                        className="bg-black/60 backdrop-blur-sm rounded-full p-4"
                        style={{
                          border: "1px solid rgba(110, 231, 183, 0.3)",
                        }}
                      >
                        {isPlaying ? (
                          <Pause className="w-8 h-8 text-white" />
                        ) : (
                          <Play className="w-8 h-8 text-white" />
                        )}
                      </div>
                    </motion.div>

                    {/* Video Title */}
                    <div className="absolute top-6 left-6">
                      <h2 className="text-2xl text-white">
                        {uploadedVideo.name}
                      </h2>
                    </div>

                    {/* Analyzing Badge */}
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="absolute top-6 right-6"
                    >
                      <div
                        className="px-4 py-2 backdrop-blur-sm border rounded-full text-sm text-white"
                        style={{
                          background: "rgba(37, 99, 235, 0.2)",
                          borderColor: "rgba(37, 99, 235, 0.4)",
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <motion.div
                            className="w-2 h-2 bg-blue-400 rounded-full"
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                            }}
                          />
                          <span>Analyzing…</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Video Description */}
            <motion.div
              className="w-full max-w-2xl mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div
                className="rounded-2xl p-6"
                style={{
                  background: "rgba(11, 17, 32, 0.4)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(110, 231, 183, 0.2)",
                }}
              >
                <p className="text-white/80 leading-relaxed text-center">
                  A cinematic iPhone ad focusing on design and emotional connection.
                </p>
              </div>
            </motion.div>

            {/* Network Visualization Background */}
            <div className="absolute inset-0 z-0 opacity-30">
              <NetworkVisualization
                people={filteredPeople}
                onPersonClick={setSelectedPerson}
                uploadedVideo={uploadedVideo}
                isSimulating={isSimulating}
                searchComplete={!isSimulating && showAnalysisReport}
              />
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <VideoAnalysisSidebar
          showAnalysisReport={showAnalysisReport}
          onViewFeedback={() => setShowFeedback(true)}
        />
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showSearchProgress && (
          <SearchProgress
            progress={progress}
            foundCount={foundCount}
            searchQuery={prompt}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showProfilesStream && (
          <ProfilesStream
            people={filteredPeople}
            onComplete={() => {
              setShowProfilesStream(false);
              setShowAnalysisReport(true);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAnalysisReport && (
          <AnalysisReport
            people={filteredPeople}
            searchQuery={prompt}
            onExpand={() => setShowExpandedReport(true)}
            onClose={() => setShowAnalysisReport(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showExpandedReport && (
          <ExpandedReport
            people={filteredPeople}
            searchQuery={prompt}
            onClose={() => setShowExpandedReport(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedPerson && (
          <TowaReactionModal
            person={selectedPerson}
            onClose={() => setSelectedPerson(null)}
            onAddToFeedback={(person) => {
              console.log("Adding to feedback:", person.name);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFeedback && (
          <FeedbackPanel
            people={filteredPeople}
            onClose={() => setShowFeedback(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
```

### Success Criteria:

#### Automated Verification:
- TypeScript compilation succeeds
- Page renders without errors at `/[username]/projects/[projectId]/simulation`

#### Manual Verification:
- [ ] Video plays automatically on page load
- [ ] Video description displays correctly
- [ ] Simulation automatically starts on page load
- [ ] SearchProgress modal appears first
- [ ] ProfilesStream modal appears second
- [ ] AnalysisReport modal appears third
- [ ] Sidebar updates to show analysis results
- [ ] NetworkVisualization shows in background with low opacity
- [ ] All modals function correctly

---

## Phase 5: Update Component Interfaces and Fix Imports

### Overview
Fix component interfaces to match new usage patterns and ensure type compatibility.

### Changes Required:

#### 1. Update SearchProgress Component

**File**: `src/app/components/SearchProgress.tsx`
**Changes**: Update interface to match usage

```typescript
import { motion, AnimatePresence } from "motion/react";

interface SearchProgressProps {
  progress: number;
  foundCount: number;
  searchQuery: string;
}

export function SearchProgress({
  progress,
  foundCount,
  searchQuery,
}: SearchProgressProps) {
  const getETA = () => {
    const remaining = 100 - progress;
    const eta = Math.max(1, Math.round((remaining / 100) * 30));
    return `${eta}s`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50, y: -20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, x: -50, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-24 left-6 z-50"
    >
      <div className="bg-black/90 backdrop-blur-md border border-gray-600/50 rounded p-3 min-w-[280px]">
        {/* Header dots */}
        <div className="flex gap-1 mb-3">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              animate={{
                backgroundColor:
                  progress > (i + 1) * 25 ? "#ffffff" : "#ffffff40",
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>

        <div className="text-white text-sm mb-2">Processing opinions...</div>
        <div className="text-white/80 text-sm mb-2">Personas Processed</div>
        <div className="text-white text-sm mb-3">
          <motion.span
            key={foundCount}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="tabular-nums"
          >
            {foundCount}
          </motion.span>{" "}
          / 25
        </div>

        <div className="mb-3">
          <div className="h-1 bg-gray-700/60 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
        </div>

        <div className="text-white/80 text-sm">ETA: {getETA()}</div>
      </div>
    </motion.div>
  );
}
```

#### 2. Update ProfilesStream Component

**File**: `src/app/components/ProfilesStream.tsx`
**Changes**: Update interface and fix import

```typescript
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import type { Person } from "@/types/shared";

interface ProfilesStreamProps {
  people: Person[];
  onComplete: () => void;
}

interface StreamingProfile extends Person {
  streamIndex: number;
  isVisible: boolean;
}

export function ProfilesStream({ people, onComplete }: ProfilesStreamProps) {
  const [streamingProfiles, setStreamingProfiles] = useState<
    StreamingProfile[]
  >([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentIndex < people.length) {
        const newProfile: StreamingProfile = {
          ...people[currentIndex],
          streamIndex: currentIndex,
          isVisible: true,
        };

        setStreamingProfiles((prev) => {
          const updated = [...prev, newProfile];
          return updated.map((profile, index) => ({
            ...profile,
            isVisible: index >= updated.length - 5,
          }));
        });

        setCurrentIndex((prev) => prev + 1);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 1000);
      }
    }, 400);

    return () => clearInterval(interval);
  }, [currentIndex, people, onComplete]);

  const getProfileColor = (reaction: string) => {
    switch (reaction) {
      case "intrigued":
        return {
          bg: "from-green-400/20 to-green-600/20",
          border: "border-green-400/50",
          text: "text-green-400",
        };
      case "inspired":
        return {
          bg: "from-blue-400/20 to-blue-600/20",
          border: "border-blue-400/50",
          text: "text-blue-400",
        };
      default:
        return {
          bg: "from-purple-400/20 to-purple-600/20",
          border: "border-purple-400/50",
          text: "text-purple-400",
        };
    }
  };

  return (
    <div className="fixed top-24 right-6 z-40 w-80 max-h-[500px] overflow-hidden">
      <AnimatePresence mode="popLayout">
        {streamingProfiles
          .filter((profile) => profile.isVisible)
          .map((profile, index) => {
            const colors = getProfileColor(profile.reaction);

            return (
              <motion.div
                key={`${profile.id}-${profile.streamIndex}`}
                initial={{ opacity: 0, x: 100, y: -20, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, y: index * 85, scale: 1 }}
                exit={{ opacity: 0, x: -100, scale: 0.8 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute w-full"
              >
                <div
                  className={`relative bg-black/90 backdrop-blur-md border ${colors.border} rounded-lg p-3`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-full bg-gradient-to-r ${colors.bg.replace(
                        "/20",
                        "/40"
                      )} border ${
                        colors.border
                      } flex items-center justify-center text-white text-sm`}
                    >
                      {profile.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm truncate">
                        {profile.name}
                      </div>
                      <div className="text-white/60 text-xs truncate">
                        {profile.title}
                      </div>
                      <div
                        className={`text-xs ${colors.text} flex items-center gap-1 mt-1`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${colors.text.replace(
                            "text-",
                            "bg-"
                          )}`}
                        ></div>
                        <span className="capitalize">{profile.reaction}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
      </AnimatePresence>
    </div>
  );
}
```

#### 3. Update AnalysisReport Component

**File**: `src/app/components/AnalysisReport.tsx`
**Changes**: Update interfaces and fix imports

```typescript
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Expand,
  FileText,
  BarChart3,
  Users,
  TrendingUp,
  X,
} from "lucide-react";
import type { Person } from "@/types/shared";

interface AnalysisReportProps {
  people: Person[];
  searchQuery: string;
  onExpand: () => void;
  onClose: () => void;
}

interface ExpandedReportProps {
  people: Person[];
  searchQuery: string;
  onClose: () => void;
}

export function AnalysisReport({
  people,
  searchQuery,
  onExpand,
  onClose,
}: AnalysisReportProps) {
  // ... rest of implementation stays the same
}

export function ExpandedReport({
  people,
  searchQuery,
  onClose,
}: ExpandedReportProps) {
  // ... rest of implementation stays the same
}
```

### Success Criteria:

#### Automated Verification:
- TypeScript compilation succeeds with no errors
- All components compile without type errors

#### Manual Verification:
- [ ] Components render without errors
- [ ] Props are correctly typed
- [ ] No runtime errors from type mismatches

---

## Phase 6: Clean Up and Testing

### Overview
Remove unused code, test the complete flow, and verify all functionality.

### Changes Required:

#### 1. Update Projects Page Navigation

**File**: `src/app/[username]/projects/page.tsx`
**Changes**: Ensure navigation points to new upload page

Verify line 11 navigates to upload page (already correct):
```typescript
router.push(`/${username}/projects/${project.id}/upload`);
```

#### 2. Optional: Archive Old Component

**File**: `src/app/components/AlternateCoreProduct.tsx`
**Changes**: Rename to `AlternateCoreProduct.tsx.backup` or keep for reference

No immediate deletion - keep for reference during testing.

### Success Criteria:

#### Automated Verification:
- `npm run build` completes successfully
- No TypeScript errors
- No console warnings in development mode

#### Manual Verification:
- [ ] Complete flow: Projects → Upload → Dashboard → Simulation works end-to-end
- [ ] Video persists across page navigations
- [ ] Prompt persists across page navigations
- [ ] Filtered personas persist across page navigations
- [ ] All modals function correctly on each page
- [ ] Back navigation works correctly
- [ ] Logout redirects to home page
- [ ] Browser refresh on any page maintains state
- [ ] All animations and transitions work smoothly

---

## Testing Strategy

### Unit Tests:
- Test `parseSearchQuery` function with various query patterns
- Test component rendering in isolation
- Test state management within each page

### Integration Tests:
- Test navigation flow: Upload → Dashboard → Simulation
- Test modal interactions on each page
- Test component integration within each page

### Manual Testing Steps:

1. **Upload Page**:
   - [ ] Upload a video file
   - [ ] Enter a custom prompt
   - [ ] Click Run Simulation
   - [ ] Verify navigation to dashboard

2. **Dashboard Page**:
   - [ ] Verify personas are displayed in NetworkVisualization
   - [ ] Click on a persona dot to open TowaReactionModal
   - [ ] Close modal
   - [ ] Click "View All Personas" to open FeedbackPanel
   - [ ] Close FeedbackPanel
   - [ ] Click "Run Simulation" button at bottom
   - [ ] Verify navigation to simulation page

3. **Simulation Page**:
   - [ ] Verify video plays automatically
   - [ ] Verify description displays
   - [ ] Verify SearchProgress modal appears
   - [ ] Verify ProfilesStream modal appears after search
   - [ ] Verify AnalysisReport modal appears after stream
   - [ ] Verify sidebar updates with results
   - [ ] Click "View All Feedback" to open FeedbackPanel
   - [ ] Verify NetworkVisualization shows in background
   - [ ] Test clicking personas in background

4. **Edge Cases**:
   - [ ] Access dashboard without state (behavior TBD based on backend implementation)
   - [ ] Access simulation without state (behavior TBD based on backend implementation)
   - [ ] Navigate back from simulation to dashboard
   - [ ] Upload different video and verify UI updates correctly

## Performance Considerations

- Each page manages its own state independently
- NetworkVisualization rendered once per page (no re-renders)
- Modals use AnimatePresence for smooth transitions
- Video autoplay controlled per page
- State persistence strategy to be implemented separately

## Migration Notes

### Backward Compatibility:
- Old AlternateCoreProduct component kept as backup
- No changes to shared types or utilities
- UI components remain unchanged

### Rollback Plan:
If issues arise:
1. Restore `src/app/[username]/projects/[projectId]/upload/page.tsx` to use AlternateCoreProduct
2. Remove new dashboard and simulation pages
3. Keep utility files (parseSearchQuery, mockPeople) as they're beneficial

## References

- Current implementation: [AlternateCoreProduct.tsx](../src/app/components/AlternateCoreProduct.tsx)
- Routing patterns: [src/app/[username]/projects/page.tsx](../src/app/[username]/projects/page.tsx)
- Network visualization: [NetworkVisualization.tsx](../src/app/components/NetworkVisualization.tsx)
- Type definitions: [src/types/shared.ts](../src/types/shared.ts)
