// Comprehensive Skills Database - Organized by category
// Based on LinkedIn skills taxonomy and industry standards

export interface SkillCategory {
  name: string;
  subcategories?: string[];
  skills: string[];
}

export const SKILL_CATEGORIES: SkillCategory[] = [
  // Technology & Engineering
  {
    name: 'Programming Languages',
    skills: [
      'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'C',
      'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin', 'Scala', 'PHP', 'Perl',
      'R', 'MATLAB', 'Julia', 'Lua', 'Haskell', 'Clojure', 'Elixir',
      'Dart', 'Objective-C', 'Assembly', 'COBOL', 'Fortran', 'F#',
      'Groovy', 'Shell Scripting', 'Bash', 'PowerShell', 'SQL', 'PL/SQL',
      'T-SQL', 'GraphQL', 'Solidity', 'Erlang', 'Prolog', 'Lisp',
    ],
  },
  {
    name: 'Web Development',
    skills: [
      'React', 'Angular', 'Vue.js', 'Next.js', 'Nuxt.js', 'Svelte',
      'Node.js', 'Express.js', 'Django', 'Flask', 'FastAPI', 'Ruby on Rails',
      'Spring Boot', 'ASP.NET', 'Laravel', 'Symfony', 'WordPress',
      'HTML5', 'CSS3', 'SASS', 'LESS', 'Tailwind CSS', 'Bootstrap',
      'Material UI', 'Chakra UI', 'Styled Components', 'Webpack', 'Vite',
      'Babel', 'Jest', 'Cypress', 'Playwright', 'Selenium',
      'REST API', 'GraphQL API', 'WebSockets', 'OAuth', 'JWT',
      'Progressive Web Apps', 'Single Page Applications', 'Server-Side Rendering',
      'Static Site Generation', 'Jamstack', 'Headless CMS',
    ],
  },
  {
    name: 'Mobile Development',
    skills: [
      'iOS Development', 'Android Development', 'React Native', 'Flutter',
      'Xamarin', 'Ionic', 'Swift UI', 'Jetpack Compose', 'Mobile UI/UX',
      'App Store Optimization', 'Push Notifications', 'Mobile Security',
      'Cross-Platform Development', 'Cordova', 'NativeScript',
    ],
  },
  {
    name: 'Cloud & DevOps',
    skills: [
      'Amazon Web Services (AWS)', 'Microsoft Azure', 'Google Cloud Platform',
      'Docker', 'Kubernetes', 'Terraform', 'Ansible', 'Jenkins', 'GitLab CI/CD',
      'GitHub Actions', 'CircleCI', 'Travis CI', 'Prometheus', 'Grafana',
      'ELK Stack', 'Splunk', 'Datadog', 'New Relic', 'PagerDuty',
      'Infrastructure as Code', 'Serverless Architecture', 'Microservices',
      'Service Mesh', 'Istio', 'Helm', 'ArgoCD', 'Pulumi', 'CloudFormation',
      'Linux Administration', 'Windows Server', 'Nginx', 'Apache',
      'Load Balancing', 'CDN', 'DNS Management', 'SSL/TLS',
    ],
  },
  {
    name: 'Data & Analytics',
    skills: [
      'Data Analysis', 'Data Visualization', 'Business Intelligence',
      'Tableau', 'Power BI', 'Looker', 'Mode', 'Metabase', 'Superset',
      'Apache Spark', 'Apache Kafka', 'Apache Airflow', 'Apache Flink',
      'Hadoop', 'Hive', 'Presto', 'Databricks', 'Snowflake', 'Redshift',
      'BigQuery', 'Data Warehousing', 'ETL', 'Data Pipelines',
      'dbt', 'Fivetran', 'Stitch', 'Airbyte', 'Data Modeling',
      'Statistical Analysis', 'A/B Testing', 'Experimentation',
      'Google Analytics', 'Mixpanel', 'Amplitude', 'Segment', 'Heap',
    ],
  },
  {
    name: 'Machine Learning & AI',
    skills: [
      'Machine Learning', 'Deep Learning', 'Natural Language Processing',
      'Computer Vision', 'Neural Networks', 'TensorFlow', 'PyTorch',
      'Keras', 'scikit-learn', 'XGBoost', 'LightGBM', 'CatBoost',
      'OpenCV', 'Hugging Face', 'GPT', 'BERT', 'Transformers',
      'Large Language Models', 'Prompt Engineering', 'MLOps',
      'Model Deployment', 'Feature Engineering', 'Hyperparameter Tuning',
      'Reinforcement Learning', 'Generative AI', 'RAG', 'Vector Databases',
      'LangChain', 'Pandas', 'NumPy', 'SciPy', 'Matplotlib', 'Seaborn',
    ],
  },
  {
    name: 'Databases',
    skills: [
      'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch',
      'Oracle Database', 'SQL Server', 'SQLite', 'Cassandra', 'DynamoDB',
      'Firebase', 'Supabase', 'CockroachDB', 'Neo4j', 'ArangoDB',
      'InfluxDB', 'TimescaleDB', 'Pinecone', 'Weaviate', 'Milvus',
      'Database Design', 'Database Administration', 'Query Optimization',
      'Data Migration', 'Replication', 'Sharding', 'Indexing',
    ],
  },
  {
    name: 'Cybersecurity',
    skills: [
      'Information Security', 'Network Security', 'Application Security',
      'Cloud Security', 'Penetration Testing', 'Vulnerability Assessment',
      'Security Auditing', 'Incident Response', 'Threat Modeling',
      'SIEM', 'Firewall Management', 'Identity & Access Management',
      'Encryption', 'Zero Trust Architecture', 'SOC Operations',
      'Compliance', 'GDPR', 'HIPAA', 'SOC 2', 'PCI DSS', 'ISO 27001',
    ],
  },

  // Business & Management
  {
    name: 'Leadership & Management',
    skills: [
      'Team Leadership', 'People Management', 'Executive Leadership',
      'Strategic Planning', 'Change Management', 'Organizational Development',
      'Performance Management', 'Talent Development', 'Succession Planning',
      'Cross-functional Collaboration', 'Stakeholder Management',
      'Decision Making', 'Problem Solving', 'Critical Thinking',
      'Conflict Resolution', 'Negotiation', 'Delegation',
      'Coaching', 'Mentoring', 'Employee Engagement',
    ],
  },
  {
    name: 'Project Management',
    skills: [
      'Project Management', 'Program Management', 'Portfolio Management',
      'Agile Methodology', 'Scrum', 'Kanban', 'Lean', 'Six Sigma',
      'Waterfall', 'Prince2', 'PMP', 'Risk Management', 'Budget Management',
      'Resource Allocation', 'Timeline Management', 'Scope Management',
      'Jira', 'Asana', 'Monday.com', 'Trello', 'Confluence', 'Notion',
      'Microsoft Project', 'Smartsheet', 'Gantt Charts', 'OKRs', 'KPIs',
    ],
  },
  {
    name: 'Product Management',
    skills: [
      'Product Strategy', 'Product Development', 'Product Roadmap',
      'Product Launch', 'Product Analytics', 'User Research',
      'Market Research', 'Competitive Analysis', 'Feature Prioritization',
      'Requirements Gathering', 'User Stories', 'Product-Market Fit',
      'Go-to-Market Strategy', 'Product Lifecycle Management',
      'A/B Testing', 'Experimentation', 'Growth Product Management',
      'Platform Product Management', 'B2B Product Management', 'B2C Product Management',
    ],
  },
  {
    name: 'Finance & Accounting',
    skills: [
      'Financial Analysis', 'Financial Modeling', 'Financial Planning',
      'Budgeting', 'Forecasting', 'Cash Flow Management', 'P&L Management',
      'Investment Analysis', 'Valuation', 'Due Diligence', 'M&A',
      'Accounting', 'GAAP', 'IFRS', 'Tax Planning', 'Audit',
      'Treasury Management', 'Risk Management', 'Financial Reporting',
      'Excel', 'Bloomberg Terminal', 'Capital IQ', 'FactSet',
      'QuickBooks', 'SAP', 'Oracle Financials', 'NetSuite',
      'Private Equity', 'Venture Capital', 'Investment Banking',
    ],
  },
  {
    name: 'Marketing',
    skills: [
      'Digital Marketing', 'Content Marketing', 'Social Media Marketing',
      'SEO', 'SEM', 'PPC', 'Google Ads', 'Facebook Ads', 'LinkedIn Ads',
      'Email Marketing', 'Marketing Automation', 'CRM', 'HubSpot',
      'Salesforce', 'Marketo', 'Mailchimp', 'Brand Management',
      'Marketing Strategy', 'Growth Marketing', 'Product Marketing',
      'Demand Generation', 'Lead Generation', 'Conversion Optimization',
      'Marketing Analytics', 'Attribution Modeling', 'Customer Segmentation',
      'Influencer Marketing', 'Affiliate Marketing', 'Partnership Marketing',
      'PR', 'Communications', 'Copywriting', 'Content Strategy',
    ],
  },
  {
    name: 'Sales',
    skills: [
      'Sales', 'Business Development', 'Account Management',
      'Enterprise Sales', 'Inside Sales', 'Field Sales', 'Retail Sales',
      'Sales Strategy', 'Sales Operations', 'Sales Enablement',
      'Pipeline Management', 'Forecasting', 'Quota Attainment',
      'Cold Calling', 'Prospecting', 'Lead Qualification',
      'Negotiation', 'Closing', 'Contract Negotiation',
      'CRM', 'Salesforce', 'HubSpot Sales', 'Outreach', 'Gong',
      'Sales Presentations', 'Proposal Writing', 'RFP Response',
    ],
  },
  {
    name: 'Human Resources',
    skills: [
      'Human Resources', 'Talent Acquisition', 'Recruiting', 'Sourcing',
      'Employer Branding', 'Employee Relations', 'HR Operations',
      'Compensation & Benefits', 'Payroll', 'HRIS', 'Workday',
      'Performance Management', 'Learning & Development', 'Training',
      'Organizational Design', 'Workforce Planning', 'HR Analytics',
      'Employee Engagement', 'Culture Development', 'DEI',
      'Labor Law', 'Employment Law', 'Compliance', 'Policy Development',
    ],
  },
  {
    name: 'Operations',
    skills: [
      'Operations Management', 'Business Operations', 'Process Improvement',
      'Supply Chain Management', 'Logistics', 'Inventory Management',
      'Procurement', 'Vendor Management', 'Quality Assurance',
      'Lean Operations', 'Six Sigma', 'Continuous Improvement',
      'Capacity Planning', 'Demand Planning', 'S&OP',
      'Facilities Management', 'Fleet Management', 'Warehouse Management',
    ],
  },

  // Design & Creative
  {
    name: 'Design',
    skills: [
      'UI Design', 'UX Design', 'Product Design', 'Web Design',
      'Mobile Design', 'Visual Design', 'Interaction Design',
      'User Research', 'Usability Testing', 'Wireframing', 'Prototyping',
      'Design Systems', 'Design Thinking', 'Information Architecture',
      'Figma', 'Sketch', 'Adobe XD', 'InVision', 'Framer',
      'Adobe Photoshop', 'Adobe Illustrator', 'Adobe InDesign',
      'Motion Design', 'Animation', 'After Effects', 'Principle',
      'Graphic Design', 'Brand Design', 'Logo Design', 'Typography',
      'Color Theory', 'Layout Design', 'Print Design', 'Packaging Design',
    ],
  },
  {
    name: 'Content & Writing',
    skills: [
      'Technical Writing', 'Content Writing', 'Copywriting', 'Blog Writing',
      'Grant Writing', 'Report Writing', 'Business Writing', 'Editing',
      'Proofreading', 'Content Strategy', 'SEO Writing', 'UX Writing',
      'Documentation', 'API Documentation', 'User Guides',
      'Storytelling', 'Journalism', 'Ghostwriting', 'Scriptwriting',
    ],
  },
  {
    name: 'Video & Multimedia',
    skills: [
      'Video Production', 'Video Editing', 'Adobe Premiere Pro',
      'Final Cut Pro', 'DaVinci Resolve', 'After Effects',
      'Motion Graphics', '3D Animation', 'Cinema 4D', 'Blender',
      'Photography', 'Lightroom', 'Audio Production', 'Audio Editing',
      'Podcasting', 'Live Streaming', 'YouTube Content Creation',
    ],
  },

  // Industry-Specific
  {
    name: 'Healthcare',
    skills: [
      'Healthcare Administration', 'Clinical Operations', 'Patient Care',
      'Medical Records', 'EHR/EMR', 'Epic', 'Cerner', 'HIPAA Compliance',
      'Healthcare IT', 'Medical Billing', 'Medical Coding', 'ICD-10',
      'Clinical Research', 'Drug Development', 'Regulatory Affairs',
      'FDA Compliance', 'Quality Management', 'Pharmacovigilance',
      'Health Informatics', 'Telemedicine', 'Population Health',
    ],
  },
  {
    name: 'Legal',
    skills: [
      'Legal Research', 'Legal Writing', 'Contract Law', 'Corporate Law',
      'Litigation', 'Compliance', 'Regulatory Affairs', 'Intellectual Property',
      'M&A', 'Due Diligence', 'Legal Operations', 'eDiscovery',
      'Privacy Law', 'Data Protection', 'Employment Law', 'Tax Law',
      'Real Estate Law', 'Securities Law', 'Bankruptcy', 'Immigration Law',
    ],
  },
  {
    name: 'Consulting',
    skills: [
      'Management Consulting', 'Strategy Consulting', 'IT Consulting',
      'Business Analysis', 'Process Consulting', 'Implementation',
      'Client Management', 'Stakeholder Engagement', 'Workshop Facilitation',
      'Business Case Development', 'Benchmarking', 'Best Practices',
      'Digital Transformation', 'Organizational Change', 'Cost Optimization',
    ],
  },

  // Soft Skills
  {
    name: 'Communication',
    skills: [
      'Communication', 'Public Speaking', 'Presentation Skills',
      'Written Communication', 'Verbal Communication', 'Active Listening',
      'Interpersonal Skills', 'Cross-cultural Communication',
      'Executive Communication', 'Storytelling', 'Persuasion',
    ],
  },
  {
    name: 'Collaboration',
    skills: [
      'Teamwork', 'Collaboration', 'Cross-functional Collaboration',
      'Remote Collaboration', 'Virtual Teams', 'Partnership Building',
      'Relationship Building', 'Networking', 'Stakeholder Management',
    ],
  },
  {
    name: 'Personal Development',
    skills: [
      'Time Management', 'Organization', 'Prioritization',
      'Self-motivation', 'Adaptability', 'Flexibility', 'Resilience',
      'Emotional Intelligence', 'Self-awareness', 'Growth Mindset',
      'Continuous Learning', 'Curiosity', 'Initiative', 'Accountability',
    ],
  },
];

// Flatten all skills for search
export const ALL_SKILLS: string[] = SKILL_CATEGORIES.flatMap(cat => cat.skills);

// Create a searchable skills map with categories
export const SKILLS_WITH_CATEGORIES: { skill: string; category: string }[] =
  SKILL_CATEGORIES.flatMap(cat =>
    cat.skills.map(skill => ({ skill, category: cat.name }))
  );

// Search function for skills with fuzzy matching
export function searchSkills(query: string, limit: number = 20): { skill: string; category: string }[] {
  if (!query || query.length < 1) return [];

  const lowerQuery = query.toLowerCase();

  // Exact match first, then starts with, then contains
  const exactMatches: { skill: string; category: string }[] = [];
  const startsWithMatches: { skill: string; category: string }[] = [];
  const containsMatches: { skill: string; category: string }[] = [];

  for (const item of SKILLS_WITH_CATEGORIES) {
    const lowerSkill = item.skill.toLowerCase();

    if (lowerSkill === lowerQuery) {
      exactMatches.push(item);
    } else if (lowerSkill.startsWith(lowerQuery)) {
      startsWithMatches.push(item);
    } else if (lowerSkill.includes(lowerQuery)) {
      containsMatches.push(item);
    }
  }

  return [...exactMatches, ...startsWithMatches, ...containsMatches].slice(0, limit);
}

// Get skills by category
export function getSkillsByCategory(category: string): string[] {
  const cat = SKILL_CATEGORIES.find(c => c.name === category);
  return cat?.skills || [];
}

// Get all category names
export function getAllCategories(): string[] {
  return SKILL_CATEGORIES.map(cat => cat.name);
}

// Popular/Trending skills (commonly searched)
export const POPULAR_SKILLS = [
  'JavaScript', 'Python', 'React', 'Machine Learning', 'Data Analysis',
  'Project Management', 'SQL', 'AWS', 'Product Management', 'Leadership',
  'Communication', 'Agile', 'Node.js', 'TypeScript', 'Docker',
];
