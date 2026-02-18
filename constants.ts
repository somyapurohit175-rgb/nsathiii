
export const APP_NAME = "न्यायSAATHI";
export const LEGAL_DISCLAIMER = "Disclaimer: न्यायSAATHI provides information for educational purposes only. This analysis does not constitute legal advice. Please consult a certified legal professional for official guidance.";

export const SYSTEM_PROMPTS = {
  LEGAL_ANALYST: `
    Act as a Distinguished Legal Expert specializing in Indian Law (IPC and BNS). 
    Your goal is to simplify legal text for common Indian citizens.
    
    CRITICAL CONSTRAINTS:
    1. Always include the disclaimer: "This is for informational purposes and not legal advice."
    2. Categorize risk as SAFE, MODERATE, or HIGH.
    3. Map traditional IPC sections to new BNS sections where applicable.
    4. Provide explanations in simple, jargon-free English and Hindi (if requested).
    
    RESPONSE FORMAT: JSON
    - summary: A brief overview
    - riskLevel: "SAFE" | "MODERATE" | "HIGH"
    - clauses: Array of { originalText, simplifiedText, relevantLaws: string[], riskRating }
    - suggestedAction: Next steps for the citizen.
  `,
  QUIZ_GENERATOR: `
    Generate a Word-Coach style multiple-choice quiz based on the provided legal context.
    The goal is to test the user's understanding of the legal concepts simplified.
    Return JSON: Array of { question, options: string[], correctAnswer: number, explanation }
  `,
  DEEP_RESEARCHER: `
    You are a Distinguished Legal Research Assistant for law students and legal professionals in India.
    Provide academic-grade, detailed analysis of legal topics, sections, or hypothetical scenarios.
    
    When asked about a law or section:
    1. Provide the historical context (IPC 1860).
    2. Provide the modern transition (BNS 2023).
    3. Discuss relevant case laws or precedents.
    4. Analyze constitutional intersections (e.g., Fundamental Rights).
    5. Compare with international standards if relevant.
    
    Maintain a scholarly yet accessible tone. Use markdown for structuring.
  `,
  NEWS_AGGREGATOR: `
    You are a Legal News Curator specializing in Indian Judiciary, Legislative updates, and Landmark Judgments.
    Your task is to provide the most recent and relevant legal news in a structured format.
    Focus on: Supreme Court of India, High Courts, New Legislations (BNS, BNSS, BSA), and Legal Tech trends.
    
    RESPONSE FORMAT: JSON
    Array of objects:
    - title: Catchy headline
    - summary: 2-3 sentence overview
    - impact: Who it affects (Citizens, Lawyers, Corporations)
    - date: String date
    - source: Name of the likely news source
  `
};

export const MOCK_LAWS = [
  // --- CRIMINAL LAWS (IPC DATA FROM CSV) ---
  { 
    id: 'ipc-140', 
    category: 'Criminal Laws', 
    section: 'Sec 140', 
    act: 'IPC', 
    title: 'Deceptive Military Uniform', 
    description: 'Wearing the garb or carrying any token used by a soldier, sailor or airman with intent that it may be believed that he is such a soldier, sailor or airman. Simple Words: If someone wears a military uniform to deceive others, they can be punished.', 
    punishment: '3 Months or Fine or Both' 
  },
  { 
    id: 'ipc-127', 
    category: 'Criminal Laws', 
    section: 'Sec 127', 
    act: 'IPC', 
    title: 'Receiving War Property', 
    description: 'Receiving property taken by war or depredation mentioned in sections 125 and 126. Simple Words: Receiving stolen goods from war zones knowing their origin.', 
    punishment: '7 Years + Fine + forfeiture' 
  },
  { 
    id: 'ipc-128', 
    category: 'Criminal Laws', 
    section: 'Sec 128', 
    act: 'IPC', 
    title: 'Public Servant Allowing Escape', 
    description: 'Public servant voluntarily allowing prisoner of State or war in his custody to escape. Simple Words: Intentionally letting a state prisoner go free.', 
    punishment: 'Life or 10 Years + Fine' 
  },
  { 
    id: 'ipc-302', 
    category: 'Criminal Laws', 
    section: 'Sec 302', 
    act: 'IPC', 
    title: 'Punishment for Murder', 
    description: 'Whoever commits murder shall be punished with death, or imprisonment for life. Simple Words: The most severe punishment for taking a human life intentionally.', 
    punishment: 'Death or Life Imprisonment + Fine' 
  },
  { 
    id: 'ipc-420', 
    category: 'Criminal Laws', 
    section: 'Sec 420', 
    act: 'IPC', 
    title: 'Cheating & Dishonesty', 
    description: 'Cheating and thereby dishonestly inducing delivery of property. Simple Words: Deceiving someone to give up money or property.', 
    punishment: '7 Years + Fine' 
  },
  { 
    id: 'ipc-378', 
    category: 'Criminal Laws', 
    section: 'Sec 378', 
    act: 'IPC', 
    title: 'Theft', 
    description: 'Intending to take dishonestly any movable property out of the possession of any person without consent. Simple Words: Taking someone else\'s things without asking.', 
    punishment: '3 Years or Fine' 
  },
  { 
    id: 'ipc-499', 
    category: 'Criminal Laws', 
    section: 'Sec 499', 
    act: 'IPC', 
    title: 'Defamation', 
    description: 'Words, signs, or visible representations intended to harm a person\'s reputation. Simple Words: Spreading lies or insults to ruin someone\'s image.', 
    punishment: '2 Years or Fine' 
  },
  { 
    id: 'ipc-354', 
    category: 'Criminal Laws', 
    section: 'Sec 354', 
    act: 'IPC', 
    title: 'Outraging Modesty of Woman', 
    description: 'Assault or use of criminal force to woman with intent to outrage her modesty. Simple Words: Physical attack or force intended to disrespect a woman.', 
    punishment: '1 to 5 Years + Fine' 
  },
  { 
    id: 'ipc-304B', 
    category: 'Criminal Laws', 
    section: 'Sec 304B', 
    act: 'IPC', 
    title: 'Dowry Death', 
    description: 'Death of a woman caused by burns or bodily injury within 7 years of marriage related to dowry demands.', 
    punishment: '7 Years to Life Imprisonment' 
  },
  { 
    id: 'ipc-506', 
    category: 'Criminal Laws', 
    section: 'Sec 506', 
    act: 'IPC', 
    title: 'Criminal Intimidation', 
    description: 'Threatening another with injury to person, reputation, or property to cause alarm. Simple Words: Scaring someone with threats of harm.', 
    punishment: '2 Years or Fine (7 Years if threat is of death)' 
  },

  // --- MODERN BNS EQUIVALENTS ---
  { id: 'bns-103', category: 'Criminal Laws', section: 'Sec 103', act: 'BNS', title: 'Punishment for Murder', description: 'Replaces IPC 302 in the new Bharatiya Nyaya Sanhita.', punishment: 'Death or Life Imprisonment' },
  { id: 'bns-318', category: 'Criminal Laws', section: 'Sec 318', act: 'BNS', title: 'Cheating', description: 'Modernized section replacing IPC 420.', punishment: '7 Years + Fine' },

  // --- CIVIL LAWS ---
  { id: 'civil-1', category: 'Civil Laws', section: 'Sec 10', act: 'Contract Act', title: 'Valid Contracts', description: 'Agreements made by free consent of parties competent to contract for a lawful object.', punishment: 'Agreement void if conditions not met' },
  { id: 'civil-2', category: 'Civil Laws', section: 'Sec 54', act: 'Transfer of Property', title: 'Sale of Property', description: 'Transfer of ownership in exchange for a price paid or promised.', punishment: 'Registration required' },

  // --- CORPORATE LAWS ---
  { id: 'corp-1', category: 'Corporate Laws', section: 'Sec 135', act: 'Companies Act', title: 'CSR Policy', description: 'Mandatory social responsibility spending for large companies.', punishment: 'Fines for non-compliance' },
  
  // --- FAMILY LAWS ---
  { id: 'fam-1', category: 'Family Laws', section: 'Sec 13', act: 'Hindu Marriage Act', title: 'Divorce Grounds', description: 'Legal reasons for dissolution of marriage including cruelty or desertion.', punishment: 'Legal separation' }
];

export const LEGAL_FACTS = [
  "The Constitution of India is the longest written constitution of any sovereign country in the world.",
  "Under the new BNS, 'Community Service' is introduced as a formal form of punishment for minor offences.",
  "Zero FIR allows a person to file an FIR at any police station, regardless of the jurisdiction where the crime occurred.",
  "Marrying again during the lifetime of a husband or wife is a punishable offence under IPC 494 and BNS 82.",
  "Ignorance of the law is not an excuse (Ignorantia juris non excusat) in Indian courts.",
  "The BNS 2023 replaces the colonial-era Indian Penal Code of 1860.",
  "Witnesses in India can now testify via video conferencing under modern criminal law reforms.",
  "Adultery is no longer a criminal offence in India, though it remains a valid ground for divorce."
];
