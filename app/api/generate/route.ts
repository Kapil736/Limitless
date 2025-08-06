import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs'; 

const ollama = new OpenAI({
  apiKey: 'ollama',
  baseURL: 'http://localhost:11434/v1',
});

// Helper function to ensure a directory exists
function ensureDirExists(filePath: string) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export async function POST(req: Request) {
  try {
    const { prompt, projectId } = await req.json();

    const PRD_AGENT_MODEL = 'mistral:latest';
    const CODE_AGENT_MODEL = 'qwen2.5-coder:7b';

    if (!prompt || !projectId) {
      return new Response("Prompt and Project ID are required.", { status: 400 });
    }

    const projectDir = path.join(process.cwd(), 'projects', projectId);
    const prdPath = path.join(projectDir, 'prd.json');
    let prdContent: string;

    // STEP 1: Check if a PRD already exists for this project
    if (fs.existsSync(prdPath)) {
      prdContent = fs.readFileSync(prdPath, 'utf-8');
      console.log(`Existing PRD found for project ${projectId}.`);
    } else {
      // If NO, run the PRD Agent with the general-purpose model
      console.log(`No PRD found. Running PRD Agent with model: ${PRD_AGENT_MODEL}...`);
      const prdPrompt = `You are a world-class product manager. Based on the following user request, create a Project Requirements Document (PRD) in a structured JSON format. The JSON object must include these exact keys: "projectName", "description", "coreFeatures" (an array of strings), and "techStack" (an array of strings). User Request: "${prompt}" \n\nReturn ONLY the raw JSON object.`;
      
      const prdResponse = await ollama.chat.completions.create({
        model: PRD_AGENT_MODEL,
        messages: [{ role: 'user', content: prdPrompt }],
        response_format: { type: 'json_object' },
      });
      
      prdContent = prdResponse.choices[0].message.content || '{}';
      ensureDirExists(prdPath);
      fs.writeFileSync(prdPath, prdContent);
      console.log(`New PRD created and saved for project ${projectId}.`);
    }

    // STEP 2: Run the Code Agent using the PRD and the specialized code model
    console.log(`Running Code Agent with model: ${CODE_AGENT_MODEL}...`);
    const codeAgentPrompt = `
      You are an expert software engineer. Based on the following Project Requirements Document (PRD) and the user's latest request, generate a complete code base.
      Your response must be a single JSON object containing a "files" key. The value of "files" should be an array of objects, where each object has "path" and "content" keys.

      PRD:
      ${prdContent}

      User Request: "${prompt}"

      Return ONLY the raw JSON object.
    `;

    const codeResponse = await ollama.chat.completions.create({
      model: CODE_AGENT_MODEL,
      messages: [{ role: 'user', content: codeAgentPrompt }],
      response_format: { type: 'json_object' },
    });

    const codeResponseContent = codeResponse.choices[0].message.content;
    if (!codeResponseContent) {
      throw new Error("Code Agent returned an empty response.");
    }

    // Write the generated files to the project directory
    const parsedCodeResponse = JSON.parse(codeResponseContent);
    const files = parsedCodeResponse.files || [];
    for (const file of files) {
      const filePath = path.join(projectDir, file.path);
      ensureDirExists(filePath);
      fs.writeFileSync(filePath, file.content);
    }
    
    const successMessage = `Project ${projectId} built successfully with ${files.length} files.`;
    console.log(successMessage);

    return new Response(JSON.stringify({ message: successMessage }), {
      headers: { 'Content-Type': 'application/json' }, status: 200,
    });

  } catch (error) {
    console.error("Error in generate route:", error);
    return new Response("An error occurred while building the project.", { status: 500 });
  }
}