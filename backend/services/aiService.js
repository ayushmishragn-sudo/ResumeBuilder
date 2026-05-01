const { SYSTEM_PROMPT, buildUserPrompt, buildSuggestionPrompt, buildScorePrompt } = require('../ai/resumePrompt');

// Use fetch (built-in in Node 18+) to call Anthropic API
async function callClaude(systemPrompt, userPrompt) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey || apiKey === 'your_anthropic_api_key_here') {
    // Return mock data for demo purposes
    return null;
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }]
    })
  });

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.content[0].text;
  
  // Extract JSON from response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }
  
  // Try array match
  const arrayMatch = text.match(/\[[\s\S]*\]/);
  if (arrayMatch) {
    return JSON.parse(arrayMatch[0]);
  }
  
  throw new Error('Could not parse AI response as JSON');
}

// Generate a complete resume from user input
async function generateResume(userData) {
  const result = await callClaude(SYSTEM_PROMPT, buildUserPrompt(userData));
  
  if (!result) {
    // Return enhanced mock data based on user input
    return generateMockResume(userData);
  }
  
  return result;
}

// Get AI suggestions for a specific section
async function getSuggestions(section, content) {
  const result = await callClaude(SYSTEM_PROMPT, buildSuggestionPrompt(section, content));
  
  if (!result) {
    return [
      `Enhanced version: ${typeof content === 'string' ? content : JSON.stringify(content)} — with measurable impact`,
      `Improved: Led initiative resulting in significant improvements to ${section}`,
      `Optimized: Architected solution that streamlined ${section} processes by 40%`
    ];
  }
  
  return result;
}

// Score a resume for ATS compatibility
async function scoreResume(resumeData) {
  const result = await callClaude(SYSTEM_PROMPT, buildScorePrompt(resumeData));
  
  if (!result) {
    return generateMockScore(resumeData);
  }
  
  return result;
}

function generateMockResume(userData) {
  const personal = userData.personal || {};
  const skills = userData.skills || {};
  const projects = userData.projects || [];
  const experience = userData.experience || [];
  const education = userData.education || [];
  
  return {
    header: {
      name: personal.name || 'John Doe',
      college: personal.college || 'University Name',
      location: (personal.city && personal.state) ? `${personal.city}, ${personal.state}` : (personal.city || personal.state || 'City, State'),
      phone: personal.phone || '+1 234 567 8900',
      email: personal.email || 'johndoe@email.com',
      linkedin: personal.linkedin || 'linkedin.com/in/johndoe',
      github: personal.github || 'github.com/johndoe'
    },
    skills: {
      programmingLanguages: skills.programmingLanguages?.length ? skills.programmingLanguages : ['JavaScript', 'Python', 'Java', 'C++'],
      webDevelopment: skills.webDevelopment?.length ? skills.webDevelopment : ['React', 'Node.js', 'Express', 'MongoDB'],
      toolsPlatforms: skills.toolsPlatforms?.length ? skills.toolsPlatforms : ['Git', 'VS Code', 'Docker']
    },
    projects: projects.length ? projects.map((p, i) => ({
      title: p.title || `Mock Project ${i + 1}`,
      description: p.description || 'A comprehensive full-stack application',
      isGroup: p.isGroup || false,
      techStack: p.techStack?.length ? p.techStack : ['React', 'Node.js', 'MongoDB'],
      bullets: p.bullets?.length && p.bullets[0] !== '' ? p.bullets : [
        'Developed a highly scalable system architecture handling thousands of requests',
        'Implemented **secure authentication** and optimized database queries to reduce latency by 40%',
        'Built responsive frontend interfaces matching modern UX principles'
      ]
    })) : [],
    internships: experience.length ? experience.map((e, i) => ({
      role: e.role || `Software Engineering Intern`,
      organization: e.organization || `Tech Company ${i + 1}`,
      year: e.year || '2023 - 2024',
      description: e.description || 'Contributed to the development of robust web applications using industry-standard tools.'
    })) : [],
    education: education.length ? education.map(e => ({
      degree: e.degree || 'Bachelor of Science in Computer Science',
      institution: e.institution || 'University Name',
      year: e.year || '2020 - 2024',
      location: e.location || 'City, State',
      details: e.details || 'GPA: 3.8/4.0'
    })) : [],
    certifications: userData.certifications?.length && userData.certifications[0] !== '' ? userData.certifications : [
      '**AWS Certified Developer** — Associate',
      '**Google Cloud Professional** — Architect'
    ],
    achievements: userData.achievements?.length && userData.achievements[0] !== '' ? userData.achievements : [
      'Winner of the Annual University Hackathon amongst 50+ competing teams.',
      'Solved over 300+ algorithms on competitive programming platforms.'
    ],
    leadership: userData.leadership?.length && userData.leadership[0] !== '' ? userData.leadership : [
      'President of the University Computer Science Club, organizing 20+ workshops.',
      'Mentored junior students in web development fundamentals and data structures.'
    ]
  };
}

function generateMockScore(resumeData) {
  let score = 60;
  
  if (resumeData.header?.name) score += 5;
  if (resumeData.skills && Object.keys(resumeData.skills).length > 0) score += 10;
  if (resumeData.projects?.length > 0) score += 10;
  if (resumeData.education?.length > 0) score += 5;
  if (resumeData.internships?.length > 0) score += 5;
  if (resumeData.achievements?.length > 0) score += 3;
  if (resumeData.certifications?.length > 0) score += 2;
  
  score = Math.min(score, 95);
  
  return {
    overallScore: score,
    breakdown: {
      formatting: { score: Math.min(score + 5, 100), feedback: 'Clean, ATS-friendly formatting detected' },
      keywords: { score: Math.max(score - 5, 50), feedback: 'Consider adding more industry-specific keywords' },
      impact: { score: score, feedback: 'Good use of action verbs and quantified achievements' },
      completeness: { score: Math.min(score + 3, 100), feedback: 'Most key sections are well-filled' }
    },
    topSuggestions: [
      'Add more quantified achievements (percentages, numbers, metrics)',
      'Include relevant industry keywords for better ATS matching',
      'Consider adding more technical skills specific to your target role'
    ]
  };
}

module.exports = { generateResume, getSuggestions, scoreResume };
