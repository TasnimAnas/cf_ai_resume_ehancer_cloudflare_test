interface ResumeRequest {
  jobDescription: string;
  userExperience: string;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  userLocation?: string;
  skills?: string;
  education?: string;
  type: 'resume' | 'cover-letter' | 'both';
}

interface ResumeResponse {
  success: boolean;
  data?: {
    resume?: string;
    coverLetter?: string;
    keywords?: string[];
    suggestions?: string[];
  };
  error?: string;
}

interface ParsedResume {
  name?: string;
  experience?: string;
  skills?: string;
  education?: string;
}

interface ParsedJob {
  description?: string;
  title?: string;
  company?: string;
}

async function generateResume(jobDescription: string, userExperience: string, skills?: string, education?: string): Promise<string> {
  try {
    console.log('🔍 Generating resume...');

    const prompt = `You are an expert resume writer and career coach. Create professional, ATS-optimized resume bullet points.

JOB DESCRIPTION:
${jobDescription}

USER'S EXPERIENCE:
${userExperience}

${skills ? `SKILLS: ${skills}` : ''}
${education ? `EDUCATION: ${education}` : ''}

Generate a professional resume with these sections:
1. PROFESSIONAL SUMMARY (2-3 sentences highlighting relevant experience)
2. KEY SKILLS (bullet points of relevant skills from job description)
3. WORK EXPERIENCE (transform user's experience into powerful bullet points using action verbs and quantifiable achievements)
4. EDUCATION (if provided)

IMPORTANT:
- Use action verbs (Led, Developed, Implemented, Achieved, etc.)
- Include metrics and numbers where possible
- Match keywords from job description
- Focus on achievements, not just responsibilities
- Make it ATS-friendly (no tables, columns, or graphics)
- Keep bullet points concise (1-2 lines each)

Format in clean markdown.`;

    const response = await fetch("https://resume-ai-worker.anasfarazi0151.workers.dev", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        prompt: prompt,
        type: 'resume'
      })
    });

    if (!response.ok) {
      throw new Error(`AI service returned status ${response.status}`);
    }

    const result = await response.json() as { response?: string };
    
    if (!result.response) {
      throw new Error("No response from AI");
    }

    console.log('✅ Resume generated successfully');
    return result.response;

  } catch (error) {
    console.error('❌ Error generating resume:', error);
    throw error;
  }
}

async function generateCoverLetter(
  jobDescription: string, 
  userExperience: string,
  userName?: string,
  companyName?: string
): Promise<string> {
  try {
    console.log('📝 Generating cover letter...');

    const name = userName || '[Your Name]';
    const company = companyName || '[Company Name]';

    const prompt = `You are an expert cover letter writer. Create a compelling, professional cover letter.

JOB DESCRIPTION:
${jobDescription}

USER'S EXPERIENCE:
${userExperience}

Generate a professional cover letter that:
1. Opens with enthusiasm for the specific role
2. Highlights 2-3 key achievements that match the job requirements
3. Shows understanding of the company/role
4. Explains why the candidate is a great fit
5. Closes with a strong call to action

IMPORTANT:
- Use the name "${name}" for the candidate
- Reference "${company}" as the company
- Be specific about how their experience matches the role
- Show genuine interest and enthusiasm
- Keep it to 3-4 paragraphs
- Professional but personable tone
- Include specific examples from their experience

Format in clean markdown with proper spacing.`;

    const response = await fetch("https://resume-ai-worker.anasfarazi0151.workers.dev", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        prompt: prompt,
        type: 'cover-letter'
      })
    });

    if (!response.ok) {
      throw new Error(`AI service returned status ${response.status}`);
    }

    const result = await response.json() as { response?: string };
    
    if (!result.response) {
      throw new Error("No response from AI");
    }

    console.log('✅ Cover letter generated successfully');
    return result.response;

  } catch (error) {
    console.error('❌ Error generating cover letter:', error);
    throw error;
  }
}

async function extractKeywords(jobDescription: string): Promise<string[]> {
  try {
    console.log('🔑 Extracting keywords...');

    const prompt = `Extract the most important keywords and skills from this job description for ATS (Applicant Tracking System) optimization.

JOB DESCRIPTION:
${jobDescription}

Return ONLY a comma-separated list of keywords (no explanations, no numbering, just keywords).
Focus on:
- Technical skills
- Required qualifications
- Important tools/technologies
- Key responsibilities
- Industry terms

Example format: JavaScript, React, Team Leadership, Agile, AWS, Problem Solving`;

    const response = await fetch("https://resume-ai-worker.anasfarazi0151.workers.dev", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        prompt: prompt,
        type: 'keywords'
      })
    });

    if (!response.ok) {
      throw new Error(`AI service returned status ${response.status}`);
    }

    const result = await response.json() as { response?: string };
    
    if (!result.response) {
      return [];
    }

    const keywords = result.response
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0)
      .slice(0, 15);

    console.log(`✅ Extracted ${keywords.length} keywords`);
    return keywords;

  } catch (error) {
    console.error('❌ Error extracting keywords:', error);
    return [];
  }
}

async function generateSuggestions(jobDescription: string, userExperience: string): Promise<string[]> {
  try {
    console.log('💡 Generating suggestions...');

    const prompt = `You are a career coach. Analyze this job application and provide 3-5 specific, actionable suggestions to improve the candidate's chances.

JOB DESCRIPTION:
${jobDescription}

USER'S EXPERIENCE:
${userExperience}

Provide suggestions as a simple list (one per line, no numbering, no bullets).
Focus on:
- Missing skills to highlight
- Better ways to phrase experience
- Additional qualifications to mention
- Gaps to address
- Strengths to emphasize

Example format:
Emphasize your project management experience more prominently
Quantify your achievements with specific metrics
Highlight your experience with cloud technologies`;

    const response = await fetch("https://resume-ai-worker.anasfarazi0151.workers.dev", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        prompt: prompt,
        type: 'suggestions'
      })
    });

    if (!response.ok) {
      return [];
    }

    const result = await response.json() as { response?: string };
    
    if (!result.response) {
      return [];
    }

    const suggestions = result.response
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .slice(0, 5);

    console.log(`✅ Generated ${suggestions.length} suggestions`);
    return suggestions;

  } catch (error) {
    console.error('❌ Error generating suggestions:', error);
    return [];
  }
}

async function parseResume(text: string): Promise<ParsedResume> {
  try {
    console.log('📄 Parsing resume...');

    const prompt = `Extract structured information from this resume text. Return ONLY a JSON object with these fields: name, experience, skills, education.

RESUME TEXT:
${text}

Return format (JSON only, no markdown, no explanation):
{
  "name": "Full Name",
  "experience": "All work experience descriptions combined",
  "skills": "Comma-separated list of skills",
  "education": "Education details"
}`;

    const response = await fetch("https://resume-ai-worker.anasfarazi0151.workers.dev", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        prompt: prompt,
        type: 'parse'
      })
    });

    if (!response.ok) {
      throw new Error(`AI service returned status ${response.status}`);
    }

    const result = await response.json() as { response?: string };
    
    if (!result.response) {
      throw new Error("No response from AI");
    }

    const cleanedResponse = result.response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleanedResponse) as ParsedResume;

    console.log('✅ Resume parsed successfully');
    return parsed;

  } catch (error) {
    console.error('❌ Error parsing resume:', error);
    return {};
  }
}

async function parseJobLink(url: string): Promise<ParsedJob> {
  try {
    console.log('🔗 Parsing job link...');

    const response = await fetch(url);
    const html = await response.text();

    const textContent = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const prompt = `Extract the job description from this webpage content. Return ONLY a JSON object with these fields: description, title, company.

WEBPAGE CONTENT:
${textContent.slice(0, 5000)}

Return format (JSON only, no markdown, no explanation):
{
  "description": "Full job description text",
  "title": "Job title",
  "company": "Company name"
}`;

    const aiResponse = await fetch("https://resume-ai-worker.anasfarazi0151.workers.dev", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        prompt: prompt,
        type: 'parse'
      })
    });

    if (!aiResponse.ok) {
      throw new Error(`AI service returned status ${aiResponse.status}`);
    }

    const result = await aiResponse.json() as { response?: string };
    
    if (!result.response) {
      throw new Error("No response from AI");
    }

    const cleanedResponse = result.response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleanedResponse) as ParsedJob;

    console.log('✅ Job link parsed successfully');
    return parsed;

  } catch (error) {
    console.error('❌ Error parsing job link:', error);
    throw error;
  }
}

async function generatePDF(content: string, type: string): Promise<Uint8Array> {
  const pdfLib = await import('pdf-lib');
  const { PDFDocument, rgb, StandardFonts } = pdfLib;
  
  const pdfDoc = await PDFDocument.create();
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesRomanBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  
  const lines = content.split('\n');
  let page = pdfDoc.addPage([612, 792]);
  const { height } = page.getSize();
  let y = height - 50;
  
  const lineHeight = 14;
  const margin = 50;
  const maxWidth = 512;
  
  for (const line of lines) {
    if (y < 50) {
      page = pdfDoc.addPage([612, 792]);
      y = height - 50;
    }
    
    const trimmedLine = line.trim();
    if (!trimmedLine) {
      y -= lineHeight / 2;
      continue;
    }
    
    let fontSize = 11;
    let font = timesRomanFont;
    let text = trimmedLine;
    
    if (trimmedLine.startsWith('# ')) {
      fontSize = 18;
      font = timesRomanBoldFont;
      text = trimmedLine.slice(2);
    } else if (trimmedLine.startsWith('## ')) {
      fontSize = 14;
      font = timesRomanBoldFont;
      text = trimmedLine.slice(3);
    } else if (trimmedLine.startsWith('### ')) {
      fontSize = 12;
      font = timesRomanBoldFont;
      text = trimmedLine.slice(4);
    } else if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
      font = timesRomanBoldFont;
      text = trimmedLine.slice(2, -2);
    } else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('• ')) {
      text = '  • ' + trimmedLine.slice(2);
    }
    
    const words = text.split(' ');
    let currentLine = '';
    
    for (const word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const width = font.widthOfTextAtSize(testLine, fontSize);
      
      if (width > maxWidth && currentLine) {
        page.drawText(currentLine, {
          x: margin,
          y: y,
          size: fontSize,
          font: font,
          color: rgb(0, 0, 0),
        });
        y -= lineHeight;
        currentLine = word;
        
        if (y < 50) {
          page = pdfDoc.addPage([612, 792]);
          y = height - 50;
        }
      } else {
        currentLine = testLine;
      }
    }
    
    if (currentLine) {
      page.drawText(currentLine, {
        x: margin,
        y: y,
        size: fontSize,
        font: font,
        color: rgb(0, 0, 0),
      });
      y -= lineHeight;
    }
    
    y -= lineHeight / 4;
  }
  
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

async function generateDocuments(request: ResumeRequest): Promise<ResumeResponse> {
  try {
    console.log(`📄 Generating ${request.type}...`);

    const results: {
      resume?: string;
      coverLetter?: string;
      keywords?: string[];
      suggestions?: string[];
    } = {};

    const companyMatch = request.jobDescription.match(/(?:company|organization|at)\s+([A-Z][a-zA-Z\s&]+?)(?:\s+is|\s+seeks|\s+looking|\.|,)/i);
    const companyName = companyMatch ? companyMatch[1].trim() : undefined;

    if (request.type === 'resume' || request.type === 'both') {
      results.resume = await generateResume(
        request.jobDescription,
        request.userExperience,
        request.skills,
        request.education
      );
    }

    if (request.type === 'cover-letter' || request.type === 'both') {
      results.coverLetter = await generateCoverLetter(
        request.jobDescription,
        request.userExperience,
        request.userName,
        companyName
      );
    }

    const [keywords, suggestions] = await Promise.all([
      extractKeywords(request.jobDescription),
      generateSuggestions(request.jobDescription, request.userExperience)
    ]);

    results.keywords = keywords;
    results.suggestions = suggestions;

    console.log('✅ All documents generated successfully');

    return {
      success: true,
      data: results
    };

  } catch (error) {
    console.error('❌ Error generating documents:', error);
    return {
      success: false,
      error: `Failed to generate documents: ${error}`
    };
  }
}

export default {
  async fetch(request: Request, _env: Env, _ctx: ExecutionContext) {
    const url = new URL(request.url);

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (url.pathname === "/health") {
      return Response.json(
        { 
          status: "ok", 
          message: "Resume Generator Service is running",
          features: ["Resume Generation", "Cover Letter", "Keyword Extraction", "ATS Optimization", "PDF Export", "Resume Upload", "Job Link Parsing"]
        },
        { headers: corsHeaders }
      );
    }

    if (url.pathname === "/generate" && request.method === "POST") {
      try {
        const body = await request.json() as ResumeRequest;

        if (!body.jobDescription || !body.userExperience) {
          return Response.json(
            { 
              success: false, 
              error: "Missing required fields: jobDescription and userExperience" 
            },
            { status: 400, headers: corsHeaders }
          );
        }

        if (!body.type) {
          body.type = 'both';
        }

        const result = await generateDocuments(body);
        return Response.json(result, { headers: corsHeaders });

      } catch (error) {
        return Response.json(
          { success: false, error: `Invalid request: ${error}` },
          { status: 400, headers: corsHeaders }
        );
      }
    }

    if (url.pathname === "/parse-resume" && request.method === "POST") {
      try {
        const body = await request.json() as { text: string };

        if (!body.text) {
          return Response.json(
            { success: false, error: "No text provided" },
            { status: 400, headers: corsHeaders }
          );
        }

        const text = body.text.trim();

        if (text.length < 20) {
          return Response.json(
            { 
              success: false, 
              error: "Text is too short. Please provide more content." 
            },
            { status: 400, headers: corsHeaders }
          );
        }

        console.log(`Parsing ${text.length} characters of resume text`);

        const parsed = await parseResume(text);

        return Response.json(
          { success: true, data: parsed },
          { headers: corsHeaders }
        );

      } catch (error) {
        console.error('Resume parsing error:', error);
        return Response.json(
          { success: false, error: `Failed to parse resume: ${error}` },
          { status: 400, headers: corsHeaders }
        );
      }
    }

    if (url.pathname === "/parse-job-link" && request.method === "POST") {
      try {
        const body = await request.json() as { url: string };

        if (!body.url) {
          return Response.json(
            { success: false, error: "Missing URL" },
            { status: 400, headers: corsHeaders }
          );
        }

        const parsed = await parseJobLink(body.url);

        return Response.json(
          { success: true, data: parsed },
          { headers: corsHeaders }
        );

      } catch (error) {
        return Response.json(
          { success: false, error: `Failed to parse job link: ${error}` },
          { status: 400, headers: corsHeaders }
        );
      }
    }

    if (url.pathname === "/generate-pdf" && request.method === "POST") {
      try {
        const body = await request.json() as { content: string; type: string };

        if (!body.content) {
          return Response.json(
            { success: false, error: "Missing content" },
            { status: 400, headers: corsHeaders }
          );
        }

        const pdfBytes = await generatePDF(body.content, body.type);

        return new Response(pdfBytes.buffer as ArrayBuffer, {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="${body.type}-${Date.now()}.pdf"`
          }
        });

      } catch (error) {
        return Response.json(
          { success: false, error: `Failed to generate PDF: ${error}` },
          { status: 400, headers: corsHeaders }
        );
      }
    }

    return new Response("Not found", { status: 404, headers: corsHeaders });
  }
} satisfies ExportedHandler<Env>;
