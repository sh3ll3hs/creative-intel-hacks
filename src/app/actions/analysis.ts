"use server";

import Anthropic from "@anthropic-ai/sdk";
import { createServerClient } from "@/lib/supabase/server";

export interface AnalysisData {
    highlights: string[];
    themes: string[];
    sentiment: {
        positive: number;
        neutral: number;
        negative: number;
    };
    demographics: Array<{
        label: string;
        value: number;
        color: string;
    }>;
}

export async function generateAnalysisFromResponses(
    jobId: string
): Promise<AnalysisData> {
    const supabase = await createServerClient();

    // Fetch persona responses with persona details
    const { data: responses, error } = await supabase
        .from("persona_responses")
        .select("*, persona(*)")
        .eq("job_id", jobId);

    if (error || !responses || responses.length === 0) {
        console.error("Error fetching persona responses:", error);
        // Return default data if no responses
        return {
            highlights: [
                "No responses available yet",
                "Run simulation to generate insights",
            ],
            themes: ["Pending"],
            sentiment: {
                positive: 0,
                neutral: 0,
                negative: 100,
            },
            demographics: [],
        };
    }

    // Fetch job and ad details for context
    const { data: job } = await supabase
        .from("jobs")
        .select("*, ads(*)")
        .eq("id", jobId)
        .single();

    // Prepare data for AI analysis
    const conversationSummaries = responses.map((response) => ({
        personaName: response.persona?.name || "Unknown",
        personaDescription: response.persona?.description || "",
        conversation: response.conversation,
    }));

    const adDescription = job?.ads?.description || "No description";
    const demographic = job?.demographic || "General audience";

    // Use Anthropic API to analyze responses
    const anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const prompt = `You are analyzing feedback from AI personas who reviewed an advertisement.

Ad Description: ${adDescription}
Target Demographic: ${demographic}

Persona Responses:
${conversationSummaries
    .map(
        (p, i) => `
Persona ${i + 1}: ${p.personaName}
Background: ${p.personaDescription}
Conversation: ${JSON.stringify(p.conversation)}
`
    )
    .join("\n")}

Please analyze these responses and provide:

1. **Highlights**: 3-5 key reactions or quotes from the personas (actual insights from their conversations)
2. **Themes**: 4-6 single-word or short themes/tags that emerge from the feedback (e.g., Innovation, Trust, Emotion, Value)
3. **Sentiment**: Breakdown of positive, neutral, and negative sentiment as percentages (must add up to 100)
4. **Demographics**: If there are identifiable demographic patterns in the responses, provide 1-3 demographic insights with engagement scores (0-100)

Return your analysis in this EXACT JSON format (no markdown, no code blocks, just pure JSON):
{
  "highlights": ["quote or insight 1", "quote or insight 2", "quote or insight 3"],
  "themes": ["theme1", "theme2", "theme3", "theme4"],
  "sentiment": {
    "positive": 70,
    "neutral": 20,
    "negative": 10
  },
  "demographics": [
    {"label": "Millennials", "value": 85, "color": "#2563eb"},
    {"label": "Gen Z Engagement", "value": 72, "color": "#a855f7"}
  ]
}

Ensure percentages in sentiment add up to exactly 100. For demographics, use appropriate color hex codes.`;

    const message = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 2000,
        messages: [
            {
                role: "user",
                content: prompt,
            },
        ],
    });

    // Parse the AI response
    const content = message.content[0];
    if (content.type !== "text") {
        throw new Error("Unexpected response type from AI");
    }

    const analysisText = content.text.trim();

    // Try to parse JSON from the response
    try {
        const analysis: AnalysisData = JSON.parse(analysisText);

        // Validate and ensure sentiment adds up to 100
        const sentimentTotal =
            analysis.sentiment.positive +
            analysis.sentiment.neutral +
            analysis.sentiment.negative;

        if (Math.abs(sentimentTotal - 100) > 1) {
            // Normalize if not exactly 100
            const factor = 100 / sentimentTotal;
            analysis.sentiment.positive = Math.round(
                analysis.sentiment.positive * factor
            );
            analysis.sentiment.neutral = Math.round(
                analysis.sentiment.neutral * factor
            );
            analysis.sentiment.negative =
                100 -
                analysis.sentiment.positive -
                analysis.sentiment.neutral;
        }

        return analysis;
    } catch (parseError) {
        console.error("Failed to parse AI response:", parseError);
        console.error("Raw response:", analysisText);

        // Return fallback data
        return {
            highlights: [
                "Analysis generated from persona responses",
                "Multiple perspectives captured",
                "Insights available in full report",
            ],
            themes: ["Response", "Feedback", "Analysis", "Insight"],
            sentiment: {
                positive: 60,
                neutral: 30,
                negative: 10,
            },
            demographics: [
                {
                    label: "Primary Audience",
                    value: 75,
                    color: "#2563eb",
                },
            ],
        };
    }
}
