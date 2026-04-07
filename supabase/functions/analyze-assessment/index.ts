import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface Question {
  id: string;
  text: string;
}

interface Pillar {
  id: string;
  name: string;
  questions: Question[];
}

interface AnalysisRequest {
  answers: Record<string, number>;
  scores: {
    pillars: Array<{ pillar: string; percentage: number }>;
    overall: number;
  };
  pillars: Pillar[];
}

interface PillarAnalysis {
  pillar: string;
  strength: string;
  opportunity: string;
}

interface ActionItem {
  questionId: string;
  problem: string;
  action: string;
  timeline: string;
  impact: string;
}

interface AIAnalysis {
  pillarAnalyses: PillarAnalysis[];
  topActions: ActionItem[];
  quickWin: string;
  doraComparison: string;
}

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

async function generateWithGemini(prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY not configured");
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

function generateBasicAnalysis(data: AnalysisRequest): AIAnalysis {
  const pillarAnalyses: PillarAnalysis[] = data.scores.pillars.map((pillarScore) => {
    const pillar = data.pillars.find((p) => p.name === pillarScore.pillar);
    if (!pillar) {
      return {
        pillar: pillarScore.pillar,
        strength: "Your team has made progress in this area.",
        opportunity: "There is room for improvement across multiple aspects.",
      };
    }

    const pillarQuestionIds = pillar.questions.map((q) => q.id);
    const pillarAnswers = pillarQuestionIds.map((id) => ({
      id,
      score: data.answers[id] || 0,
    }));

    const highest = pillarAnswers.reduce((max, curr) =>
      curr.score > max.score ? curr : max
    );
    const lowest = pillarAnswers.reduce((min, curr) =>
      curr.score < min.score ? curr : min
    );

    let strength = "";
    let opportunity = "";

    if (highest.score >= 3) {
      strength = `Your team shows strength in this pillar, particularly in areas where you've implemented more mature practices. This indicates a good foundation to build upon.`;
    } else {
      strength = `Your team has identified areas of focus in this pillar. Even basic implementations provide value and set the stage for future improvements.`;
    }

    if (lowest.score <= 2) {
      opportunity = `The biggest opportunity lies in addressing gaps where practices are still developing. Focusing on these areas will deliver significant improvements in overall maturity.`;
    } else {
      opportunity = `Your team can enhance performance by moving from good practices to elite-level automation and optimization in this area.`;
    }

    return { pillar: pillarScore.pillar, strength, opportunity };
  });

  const allAnswers = Object.entries(data.answers).map(([id, score]) => ({
    id,
    score,
  }));
  const lowestScored = allAnswers
    .filter((a) => a.score > 0)
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);

  const topActions: ActionItem[] = lowestScored.map((item, index) => {
    const timelines = ["Quick (1-2 weeks)", "Medium (3-4 weeks)", "Long (2-3 months)"];
    return {
      questionId: item.id,
      problem: `This area scored ${item.score}/4, indicating significant room for improvement.`,
      action: `Start by documenting current state, identifying specific gaps, and creating a step-by-step improvement plan with clear milestones.`,
      timeline: timelines[index % 3],
      impact: `Improving this practice will enhance reliability, reduce manual effort, and increase team confidence.`,
    };
  });

  let quickWin = "";
  if (lowestScored.length > 0 && lowestScored[0].score === 1) {
    quickWin = `Focus immediately on improving your lowest-scored area. Start by documenting the current process, identifying the most critical gap, and implementing one small improvement this week. Quick wins build momentum and demonstrate the value of DevOps maturity improvements to stakeholders.`;
  } else {
    quickWin = `Review your postmortem process. Implement a simple blameless postmortem template that focuses on system improvements rather than individual blame. This cultural shift costs nothing but delivers immediate improvements in learning and team morale.`;
  }

  const doraScore = data.scores.pillars[0].percentage;
  let doraComparison = "";
  if (doraScore >= 80) {
    doraComparison = `Your team operates at Elite DORA performance. You're among the top performers globally. Elite teams focus on continuous optimization and innovation.`;
  } else if (doraScore >= 60) {
    doraComparison = `Your team is a High performer according to DORA benchmarks. You're ahead of most organizations. The path to Elite involves further automation and cultural refinement.`;
  } else if (doraScore >= 40) {
    doraComparison = `Your team is a Medium performer. You have foundational practices in place. Focus on consistency and reducing manual intervention to reach High performance.`;
  } else {
    doraComparison = `Your team is in the Low performer band. This is an opportunity for significant improvement. Start with the fundamentals: automation, testing, and measurement.`;
  }

  return {
    pillarAnalyses,
    topActions,
    quickWin,
    doraComparison,
  };
}

async function generateAIAnalysis(data: AnalysisRequest): Promise<AIAnalysis> {
  if (!GEMINI_API_KEY) {
    return generateBasicAnalysis(data);
  }

  try {
    const prompt = `You are an expert DevOps consultant analyzing a team's DevOps maturity assessment.

The team scored ${data.scores.overall}% overall across 6 pillars:
${data.scores.pillars.map((p) => `- ${p.pillar}: ${p.percentage}%`).join("\n")}

Individual answers (1-4 scale):
${Object.entries(data.answers).map(([id, score]) => `${id}: ${score}`).join(", ")}

Generate a comprehensive analysis in JSON format with:
1. For each pillar: a 1-sentence strength and 1-sentence opportunity
2. Top 3 action items (based on lowest scores) with: problem, specific action, timeline (Quick/Medium/Long), and business impact
3. One quick win recommendation (2-3 sentences)
4. DORA comparison (1-2 sentences)

Use plain English suitable for both technical and non-technical audiences.

Return only valid JSON matching this structure:
{
  "pillarAnalyses": [{"pillar": "string", "strength": "string", "opportunity": "string"}],
  "topActions": [{"questionId": "string", "problem": "string", "action": "string", "timeline": "string", "impact": "string"}],
  "quickWin": "string",
  "doraComparison": "string"
}`;

    const response = await generateWithGemini(prompt);

    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return generateBasicAnalysis(data);
    }

    const analysis = JSON.parse(jsonMatch[0]);
    return analysis;
  } catch (error) {
    console.error("AI generation failed, using basic analysis:", error);
    return generateBasicAnalysis(data);
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const data: AnalysisRequest = await req.json();

    const analysis = await generateAIAnalysis(data);

    return new Response(JSON.stringify(analysis), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
