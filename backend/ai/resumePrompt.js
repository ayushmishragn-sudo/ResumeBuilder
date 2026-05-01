const SYSTEM_PROMPT = `You are an expert resume writer and career coach. Transform raw user input into a highly professional, ATS-optimized resume. 

STRICT RULES:
1. Follow the EXACT structure provided
2. Use strong action verbs (Developed, Engineered, Architected, Implemented, Optimized, etc.)
3. Quantify achievements wherever possible
4. Keep bullet points concise and impactful (1-2 lines max)
5. Maintain clean, professional formatting
6. Ensure ATS-friendly structure
7. Categorize skills properly
8. Use impact-based writing
9. NEVER invent or fabricate data for any section. If the user did not provide data for a section (certifications, achievements, leadership, internships, etc.), return an EMPTY array [] for that section. Only enhance data the user actually provided.

OUTPUT FORMAT:
Return ONLY valid JSON with this exact structure:
{
  "header": {
    "name": "Full Name",
    "college": "College/University Name",
    "location": "City, State",
    "phone": "Phone Number",
    "email": "email@example.com",
    "linkedin": "linkedin.com/in/username",
    "github": "github.com/username"
  },
  "skills": {
    "programmingLanguages": ["Language1", "Language2"],
    "webDevelopment": ["Tech1", "Tech2"],
    "toolsPlatforms": ["Tool1", "Tool2"]
  },
  "projects": [
    {
      "title": "Project Name",
      "description": "Brief one-line description",
      "isGroup": false,
      "techStack": ["Tech1", "Tech2", "Tech3"],
      "bullets": [
        "Strong action verb + what was done + impact/result",
        "Another achievement bullet point"
      ]
    }
  ],
  "internships": [
    {
      "role": "Intern Title",
      "organization": "Company Name",
      "year": "Month Year - Month Year",
      "description": "Brief description of work done"
    }
  ],
  "education": [
    {
      "degree": "Degree Name",
      "institution": "Institution Name",
      "year": "Year - Year",
      "location": "City, State",
      "details": "GPA/Percentage or other details"
    }
  ],
  "certifications": [
    "Certification name — Issuing organization"
  ],
  "achievements": [
    "Achievement description with impact"
  ],
  "leadership": [
    "Leadership role or extracurricular activity"
  ]
}`;

const buildUserPrompt = (userData) => {
  return `Transform the following raw user input into a polished, professional resume following the EXACT JSON structure specified.

USER INPUT:
${JSON.stringify(userData, null, 2)}

IMPORTANT:
- Enhance all bullet points with strong action verbs
- Quantify achievements where possible
- Maintain professional tone throughout
- Categorize skills appropriately
- Keep the exact JSON structure as specified
- CRITICAL: If the user has NOT provided any data for a section (e.g. certifications, achievements, leadership, internships), return an EMPTY array [] for that section. Do NOT invent, fabricate, or auto-generate any placeholder content. Only include data that the user has actually provided.
- If a section has empty strings or blank entries, filter them out. If all entries are blank, return an empty array [].
- Return ONLY the JSON object, no additional text`;
};

const buildSuggestionPrompt = (section, content) => {
  return `As an expert resume writer, provide 3 improved versions of the following ${section} content. Make each suggestion more impactful, using stronger action verbs and quantified results where possible.

CURRENT CONTENT:
${JSON.stringify(content)}

Return ONLY a JSON array of 3 improved versions. Each version should be a string.`;
};

const buildScorePrompt = (resumeData) => {
  return `Analyze this resume for ATS compatibility and provide a detailed score.

RESUME:
${JSON.stringify(resumeData, null, 2)}

Return ONLY valid JSON:
{
  "overallScore": 85,
  "breakdown": {
    "formatting": { "score": 90, "feedback": "..." },
    "keywords": { "score": 80, "feedback": "..." },
    "impact": { "score": 85, "feedback": "..." },
    "completeness": { "score": 85, "feedback": "..." }
  },
  "topSuggestions": ["suggestion1", "suggestion2", "suggestion3"]
}`;
};

module.exports = { SYSTEM_PROMPT, buildUserPrompt, buildSuggestionPrompt, buildScorePrompt };
