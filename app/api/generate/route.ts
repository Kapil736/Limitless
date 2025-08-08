import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs'; 

const ollama = new OpenAI({
  apiKey: 'ollama',
  baseURL: 'http://localhost:11434/v1',
  timeout: 30 * 60 * 1000, // 30 minutes to be safe
});

// --- TOOL DEFINITIONS ---

// Tool 1: Web Search
async function performWebSearch(query: string): Promise<string> {
  console.log(`Performing web search for: "${query}"`);
  try {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: process.env.TAVILY_API_KEY,
        query: query,
        search_depth: "advanced",
        max_results: 5,
      }),
    });
    const data = await response.json();
    return JSON.stringify(data.results);
  } catch (error) {
    console.error("Web search failed:", error);
    return "Web search failed.";
  }
}

// Tool 2: Image Generation
async function generateImage(prompt: string, filePath: string) {
  console.log(`Generating image for prompt: "${prompt}"`);
  try {
    const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-v1-6/text-to-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.STABILITY_API_KEY}`,
      },
      body: JSON.stringify({
        text_prompts: [{ text: prompt }],
        cfg_scale: 7,
        height: 512,
        width: 512,
        samples: 1,
        steps: 30,
      }),
    });

    if (!response.ok) throw new Error(`Stability AI Error: ${response.statusText}`);
    const data: any = await response.json();
    const image = data.artifacts[0];
    fs.writeFileSync(filePath, Buffer.from(image.base64, 'base64'));
  } catch (error) {
    console.error("Image generation failed:", error);
  }
}

function ensureDirExists(filePath: string) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// --- MAIN AGENT ORCHESTRATOR ---

export async function POST(req: Request) {
  const { prompt, projectId } = await req.json();

  const ARCHITECT_MODEL = 'llama3:latest';
  const CODE_AGENT_MODEL = 'qwen2.5-coder:latest';

  if (!prompt || !projectId) {
    return new Response("Prompt and Project ID are required.", { status: 400 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const sendStatusUpdate = (message: string) => {
        console.log(message);
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: message })}\n\n`));
      };

      try {
        const projectDir = path.join(process.cwd(), 'projects', projectId);
        const prdPath = path.join(projectDir, 'prd.json');
        let prdContent: any;

        sendStatusUpdate("Architect Agent: Starting research...");
        const searchQueryGenPrompt = `Based on the user request "${prompt}", generate a JSON object with a "queries" key, containing an array of 3-5 concise, high-quality web search queries to research top-tier features, modern UI/UX patterns, and the best tech stack. Return ONLY the raw JSON object.`;
        const searchQueryResponse = await ollama.chat.completions.create({
          model: ARCHITECT_MODEL,
          messages: [{ role: 'user', content: searchQueryGenPrompt }],
          response_format: { type: 'json_object' },
        });
        const searchQueries = JSON.parse(searchQueryResponse.choices[0].message.content || '{"queries":[]}').queries;

        let searchResults = '';
        for (const query of searchQueries) {
          searchResults += await performWebSearch(query) + '\n\n';
        }
        sendStatusUpdate("Architect Agent: Research complete. Generating project plan...");

        const prdPrompt = `You are a world-class principal software architect. Your work is held to the highest standards. Based on the user's request and the following web research, create a comprehensive and top-tier Project Requirements Document (PRD) in JSON format. The plan must be detailed and reflect modern best practices. The JSON object must include "projectName", "description", "inspiration" (a summary of key takeaways from the research), "coreFeatures", and "techStack", and "visualMockupPrompts" (an array of 2-3 detailed prompts for an image generation AI to create UI mockups). \n\nUser Request: "${prompt}"\n\nWeb Research Results:\n${searchResults}\n\nReturn ONLY the raw, high-quality JSON PRD.`;
        const prdResponse = await ollama.chat.completions.create({
          model: ARCHITECT_MODEL,
          messages: [{ role: 'user', content: prdPrompt }],
          response_format: { type: 'json_object' },
        });
        prdContent = JSON.parse(prdResponse.choices[0].message.content || '{}');
        ensureDirExists(prdPath);
        fs.writeFileSync(prdPath, JSON.stringify(prdContent, null, 2));
        sendStatusUpdate("Architect Agent: High-standard project plan created.");

        sendStatusUpdate("Planner Agent: Creating file structure plan...");
        const plannerPrompt = `Based on the PRD below, generate a JSON object with a "filePaths" key, containing an array of all file path strings needed. Include code files (html, css, js) and image files for the mockups (e.g., "assets/mockup1.png"). PRD: ${JSON.stringify(prdContent)} \n\nReturn ONLY the raw JSON object.`;
        const plannerResponse = await ollama.chat.completions.create({
          model: ARCHITECT_MODEL,
          messages: [{ role: 'user', content: plannerPrompt }],
          response_format: { type: 'json_object' },
        });
        
        let fileList: string[] = [];
        const plannerContent = plannerResponse.choices[0].message.content || '{}';
        console.log("Planner Agent Raw Output:", plannerContent);
        try {
          const parsedResponse = JSON.parse(plannerContent);
          if (parsedResponse && Array.isArray(parsedResponse.filePaths)) {
            fileList = parsedResponse.filePaths.filter((p: any) => typeof p === 'string' && p.trim().length > 0);
          }
        } catch (e) {
          sendStatusUpdate("Error: Could not parse the file plan from the AI.");
          console.error("Failed to parse Planner Agent JSON:", e);
        }

        sendStatusUpdate(`Planner Agent: Plan complete. ${fileList.length} files to be created.`);
        
        let mockupPromptIndex = 0;
        for (const filePath of fileList) {
          const absoluteFilePath = path.join(projectDir, filePath);
          ensureDirExists(absoluteFilePath);

          if (path.extname(filePath).match(/\.(png|jpg|jpeg|webp)$/)) {
            sendStatusUpdate(`Image Agent: Generating ${filePath}...`);
            let mockupPrompt = prdContent.visualMockupPrompts[mockupPromptIndex % prdContent.visualMockupPrompts.length];
            
            if (typeof mockupPrompt === 'object' && mockupPrompt !== null) {
              mockupPrompt = Object.values(mockupPrompt)[0] as string || "a modern user interface mockup";
            }
            
            await generateImage(mockupPrompt, absoluteFilePath);
            mockupPromptIndex++;
          } else {
            sendStatusUpdate(`Code Agent: Generating ${filePath}...`);

            // Updated Code Agent Prompt with stricter instructions
            const codeAgentPrompt = `
              Based on the PRD below, generate the complete code for the file specified at "File Path".
              Your response must be ONLY the raw code for this single file.
              Do NOT include any explanatory text, comments, or markdown formatting like \`\`\` or \`\`\`json in your response.
              The entire response will be saved directly into a file, so it must be 100% valid, raw code.

              PRD:
              ${JSON.stringify(prdContent)}

              File Path: "${filePath}"
            `;

            const codeResponse = await ollama.chat.completions.create({ 
              model: CODE_AGENT_MODEL, 
              messages: [{ role: 'user', content: codeAgentPrompt }] 
            });

            // Clean the AI's output
            let codeContent = codeResponse.choices[0].message.content || '';
            codeContent = codeContent.replace(/^```(?:\w+\n)?/, '').replace(/\n```$/, '');
            
            fs.writeFileSync(absoluteFilePath, codeContent.trim());
          }
        }
        sendStatusUpdate("Project build complete!");
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        sendStatusUpdate(`Error: ${errorMessage}`);
        console.error("Error in generate route:", error);
      } finally {
        controller.close();
      }
    }
  });
  return new Response(stream, { 
    headers: { 
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache'
    } 
  });
}