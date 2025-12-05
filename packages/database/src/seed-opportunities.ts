import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 15 Liftout Opportunities from Liftouts.md
const opportunities = [
  {
    title: 'Healthcare Consulting Firm Seeking Workflow Experts',
    companyName: 'Cantor Healthcare Partners',
    companySlug: 'cantor-healthcare',
    industry: 'Healthcare',
    location: 'Washington D.C.',
    description: `Our fast-growing boutique consultancy needs additional Clinical Process Improvement Principal Consultants to lead major hospital system operations optimization projects.

Seeking 4 IT-savvy MD/MBAs with 8+ years modernizing utilization protocols, boosting revenue capture, realigning care coordinator deployment and elevating patient experiences for large regional providers navigating insurance shifts.

Generous incentives offered for squad meeting aggressive commercial excellence standards. Confidential conversations accommodated on compatible team assimilation minus bureaucracy friction.`,
    teamSizeMin: 4,
    teamSizeMax: 6,
    requiredSkills: ['Clinical Workflow Optimization', 'Value-Based Care Modeling', 'Hospital Contract Negotiation', 'Patient Experience Improvement'],
    compensationMin: 250000,
    compensationMax: 400000,
    equityOffered: false,
    benefits: ['Partner-track leadership', 'High impact initiatives', 'Performance bonuses'],
    remotePolicy: 'hybrid',
    urgency: 'standard',
  },
  {
    title: 'Rocket Propulsion Lab Seeking PhD Team',
    companyName: 'Atlas Aerospace',
    companySlug: 'atlas-aerospace',
    industry: 'Aerospace',
    location: 'Huntsville, AL',
    description: `Need 5 seasoned ion engine design PhDs for expanding propulsion division. Prototyping more durable plasma thrusters enabling extended spaceflights and advanced aerospace applications required.

Candidates with in-space commercial deployment expertise, collaborative project leadership experience plus prior joint patents preferred. Flexible assimilation conversations welcomed from compatible squads.`,
    teamSizeMin: 5,
    teamSizeMax: 7,
    requiredSkills: ['Spacecraft Design', 'Propulsion Systems Simulation', 'Physics Research', 'Cross-Disciplinary Leadership'],
    compensationMin: 180000,
    compensationMax: 280000,
    equityOffered: true,
    benefits: ['$300M R&D budget access', 'Patent royalties', 'Conference travel'],
    remotePolicy: 'onsite',
    urgency: 'standard',
  },
  {
    title: 'Crypto Fund Expanding Investment Leadership',
    companyName: 'Apex Capital Partners',
    companySlug: 'apex-capital',
    industry: 'Financial Services',
    location: 'Chicago, IL',
    description: `Our blockchain investment house seeks fintech asset management directors to enhance due diligence rigor evaluating deals, governing $2B third crypto vehicle deployment and extracting alpha from radically reinventing segments.

Candidates must showcase unicorn project selection prowess plus token economics architectural creativity. Fit explorations entertained from cohesive leadership collectives.`,
    teamSizeMin: 4,
    teamSizeMax: 6,
    requiredSkills: ['Blockchain Architecture', 'Crypto Portfolio Management', 'VC Network Connections', 'Remote Team Collaboration'],
    compensationMin: 350000,
    compensationMax: 600000,
    equityOffered: true,
    benefits: ['Carry participation', 'Deal co-invest rights', 'GP economics'],
    remotePolicy: 'hybrid',
    urgency: 'high',
  },
  {
    title: 'Voice AI Startup Needs UX Architects',
    companyName: 'Cerulean Digital',
    companySlug: 'cerulean-digital',
    industry: 'Technology',
    location: 'Austin, TX',
    description: `Seeking 6 senior UX architects to evolve persona-based in-stay voice interactions improving guest experience at hospitality industry clients.

Looking for empathetic dialogue design mastery, seamless IoT orchestration skills and intuitive workflow leadership record from candidate pools demonstrating people-first principles. Fit discovery exchanges supported.`,
    teamSizeMin: 5,
    teamSizeMax: 8,
    requiredSkills: ['Conversational UI Design', 'Voice Interface Architecture', 'Empathetic User Journey Mapping', 'Generative Dialogue Engineering'],
    compensationMin: 160000,
    compensationMax: 240000,
    equityOffered: true,
    benefits: ['Ground-floor equity', 'Flexible hours', 'Remote-first culture'],
    remotePolicy: 'remote',
    urgency: 'urgent',
  },
  {
    title: 'Supply Chain Analytics Firm Needs Physicists',
    companyName: 'Kinetic',
    companySlug: 'kinetic-analytics',
    industry: 'Technology',
    location: 'Seattle, WA',
    description: `Our predictive supply chain analytics and aerospace consultancy seeks 6 PhD physicists proficient in orbital multivariable logistics flows to fulfill galactic ambitions.

Candidates should model probabilistic off-earth scenarios guiding infrastructure investment and spacecraft design lowering development risk. Ready to architect durable capabilities supporting space commercial expansion and settlement. Open to squad assimilation provided collaborative temperaments.`,
    teamSizeMin: 5,
    teamSizeMax: 8,
    requiredSkills: ['Multivariate Analytics', 'Orbital Physics', 'Aerospace Engineering', 'Cross-Disciplinary Leadership'],
    compensationMin: 200000,
    compensationMax: 320000,
    equityOffered: true,
    benefits: ['Research publication support', 'Conference sponsorship', 'Sabbatical program'],
    remotePolicy: 'hybrid',
    urgency: 'standard',
  },
  {
    title: 'Tech Law Firm Expanding IP Attorney Ranks',
    companyName: 'Alpha Legal',
    companySlug: 'alpha-legal',
    industry: 'Legal',
    location: 'Palo Alto, CA',
    description: `Looking to add 6 mid-senior patent attorneys to our 50+ IP legal squad counseling deep technology startup clientele facing extreme growth phase litigation threats.

We demand sharp prior art mastery plus speed securing ironclad claims maximizing inventor upside and defensive enforceability. Ready to welcome a cohesive attorney team integrating smoothly.`,
    teamSizeMin: 4,
    teamSizeMax: 8,
    requiredSkills: ['Prior Art Mastery', 'Patent Drafting Speed', 'Examiner Rapport', 'Litigation Protocols'],
    compensationMin: 300000,
    compensationMax: 500000,
    equityOffered: false,
    benefits: ['Partner track (4 years)', 'Profit sharing', 'Origination credit'],
    remotePolicy: 'hybrid',
    urgency: 'high',
  },
  {
    title: 'Management Consultancy Seeking Leadership Advisors',
    companyName: 'Level Solutions',
    companySlug: 'level-solutions',
    industry: 'Consulting',
    location: 'New York, NY',
    description: `Our globally revered strategic management consultancy serving elite global enterprises and unicorns has need for 8 additional leadership diagnosticians guiding CEOs through treacherous scaling journeys ripe with talent tensions and decision gridlock.

Candidates boast track records enhancing organizational design, optimizing culture and installing high performance enduring operating systems. Seeking a leadership advisory collective with cross-sector dexterity and seamless assimilation potential.`,
    teamSizeMin: 6,
    teamSizeMax: 10,
    requiredSkills: ['Revenue Growth Strategy', 'Organizational Design', 'Culture Transformation', 'Cross-Industry Dexterity'],
    compensationMin: 280000,
    compensationMax: 450000,
    equityOffered: false,
    benefits: ['Partner fast-track', 'Global travel', 'Executive coaching budget'],
    remotePolicy: 'hybrid',
    urgency: 'standard',
  },
  {
    title: 'Sports Marketing Powerhouse Establishing Athlete Division',
    companyName: 'Momentum Sports Marketing',
    companySlug: 'momentum-sports',
    industry: 'Marketing',
    location: 'Los Angeles, CA',
    description: `Seeking 5-person team to architect first-of-its-kind athlete personal branding and original content studio capitalizing on direct-to-consumer appetite explosion.

Candidates must blend analytics, legal, social media skillsets plus relationships and creative vision growing fledgling celebrity into household name brands through 360 partnership and media rights expertise. Significant autonomy guaranteed to compatible leadership squad demonstrating athlete incubation track record.`,
    teamSizeMin: 4,
    teamSizeMax: 6,
    requiredSkills: ['Sponsorship Architecture', 'Digital Channel ROI', 'Relationship Management', 'Celebrity Talent Development'],
    compensationMin: 200000,
    compensationMax: 350000,
    equityOffered: true,
    benefits: ['Division ownership stake', 'Commission structure', 'Event access'],
    remotePolicy: 'hybrid',
    urgency: 'urgent',
  },
  {
    title: 'Government Cybersecurity Team Expanding Cloud Ops',
    companyName: 'CyberFortis',
    companySlug: 'cyberfortis',
    industry: 'Government',
    location: 'Washington D.C.',
    description: `Our advanced technology branch entrusted with fortifying essential federal digital services as critical programs shift to cloud platforms urgently needs 6 elite cloud security engineers ensuring infrastructure integrity, security and accessibility.

Seeking battle-tested cloud architecture security leads ready to apply platform protection platform expertise to the unique challenges faced by heterogeneous government workloads. TS/SCI clearance required.`,
    teamSizeMin: 5,
    teamSizeMax: 8,
    requiredSkills: ['Perimeter Protection', 'Hybrid Multi-Cloud Orchestration', 'Security Remediation', 'TS/SCI Clearance'],
    compensationMin: 180000,
    compensationMax: 280000,
    equityOffered: false,
    benefits: ['Federal benefits package', 'Clearance sponsorship', 'Mission impact'],
    remotePolicy: 'hybrid',
    urgency: 'urgent',
  },
  {
    title: 'Quant Fund Expanding Data Science Ranks',
    companyName: 'Volt Analytics',
    companySlug: 'volt-analytics',
    industry: 'Financial Services',
    location: 'New York, NY',
    description: `Successful quant hedge fund based in NYC pioneering econometric trading strategies seeks physics PhDs, data scientists and computer scientists to uncover signals within noisy equities data and engineer algorithms actualizing hidden opportunities.

Strong statistical learning, financial engineering and high performance computing chops required. Ready to welcome cohesive specialty team to trading desk dialog.`,
    teamSizeMin: 4,
    teamSizeMax: 6,
    requiredSkills: ['Statistical Learning', 'Financial Engineering', 'High Performance Computing', 'Physics PhD preferred'],
    compensationMin: 400000,
    compensationMax: 800000,
    equityOffered: true,
    benefits: ['Carry economics', 'Unlimited compute resources', 'Book management path'],
    remotePolicy: 'onsite',
    urgency: 'high',
  },
  {
    title: 'Therapeutics Disruptor Needs Statistical Pros',
    companyName: 'Rex Health',
    companySlug: 'rex-health',
    industry: 'Healthcare',
    location: 'Boston, MA',
    description: `Emerging oncology biotech startup pioneering data-enhanced, relapse-thwarting therapeutic protocols seeks 5 bioinformatics or biostatistics wizards to extrapolate efficacy signals from complex RNA/DNA genomic data guiding AI-assisted clinical decisioning and speedier trial subgroup anomaly recognition.

Masters able to elevate messy omics readouts into breakthrough treatments through analytical creativity required. Open to talented team showing seamless assimilation chops.`,
    teamSizeMin: 4,
    teamSizeMax: 7,
    requiredSkills: ['Statistical Learning for Biometrics', 'Genomics/Proteomics/Metabolomics', 'Medical Software Design', 'Patient-First Mindset'],
    compensationMin: 180000,
    compensationMax: 300000,
    equityOffered: true,
    benefits: ['Publication rights', 'IP participation', 'Mission-driven culture'],
    remotePolicy: 'hybrid',
    urgency: 'standard',
  },
  {
    title: 'Media Empire Seeking M&A Attorneys',
    companyName: 'BluePoint Partners',
    companySlug: 'bluepoint-partners',
    industry: 'Legal',
    location: 'Dallas, TX',
    description: `Ambitious $100B media fund pursuing next-generation content consolidation across gaming, streaming and experiential plays seeks 4-person, battle-tested M&A attorney team to architect unprecedented umbrella deals navigating complex intellectual property, valuation and technology integration variables.

Candidates must boast meticulous contract review capabilities, proactive regulatory guidance and grace under transactional pressures. Discreet talent group lift chats entertained.`,
    teamSizeMin: 3,
    teamSizeMax: 5,
    requiredSkills: ['Contract Review', 'Domain Diversity', 'Diligence Excellence', 'Grace Under Pressure'],
    compensationMin: 350000,
    compensationMax: 600000,
    equityOffered: true,
    benefits: ['Deal completion bonuses', 'Rainmaker status', 'Career-defining work'],
    remotePolicy: 'hybrid',
    urgency: 'urgent',
  },
  {
    title: 'Sustainability Syndicate Expanding Analyst Squad',
    companyName: 'Fortuna Capital',
    companySlug: 'fortuna-capital',
    industry: 'Financial Services',
    location: 'San Francisco, CA',
    description: `Newly formed multi-billion dollar environmental and social impact fund urgently needs 6 all-star sustainable investing analysts to deploy capital into soil microbiome innovations, carbon mineralization, equitable abundance amplification, green fusion viability and associated climate redemption plays.

All-weather portfolio architects with scientific rigor able to construct catalytic pure play investment vehicles sought. Open to talent squad assimilation provided mutual passion for progress.`,
    teamSizeMin: 5,
    teamSizeMax: 8,
    requiredSkills: ['Fusion Viability Modeling', 'Carbon Transformation', 'Impact Accounting', 'Climate Commitment'],
    compensationMin: 200000,
    compensationMax: 350000,
    equityOffered: true,
    benefits: ['Generational impact', 'Mission alignment', 'Collaborative culture'],
    remotePolicy: 'remote',
    urgency: 'high',
  },
  {
    title: 'VFX Studio Expanding Costume Design Team',
    companyName: 'Velocity Pictures',
    companySlug: 'velocity-pictures',
    industry: 'Entertainment',
    location: 'Los Angeles, CA',
    description: `Our award-winning VFX studio exploring boundaries in costume creation and digital compositing seeks an 8-person costume design team supporting A-list talent on an eagerly awaited major fantasy film franchise.

Remarkably gifted stitchers, 3D visualization experts, and creature designers ready to forge attire fit for gods and monsters through cutting-edge practical techniques. Fit discovery exchanges supported.`,
    teamSizeMin: 6,
    teamSizeMax: 10,
    requiredSkills: ['Conceptual Design', 'Digital Tailoring', 'Creature Design', 'Function Meets Beauty'],
    compensationMin: 120000,
    compensationMax: 200000,
    equityOffered: false,
    benefits: ['Creative license', 'Profit participation', 'A-list collaboration'],
    remotePolicy: 'onsite',
    urgency: 'standard',
  },
  {
    title: 'AI Patent Firm Seeking Litigation Associates',
    companyName: 'Alpha IP',
    companySlug: 'alpha-ip',
    industry: 'Legal',
    location: 'Palo Alto, CA',
    description: `Our premier patent firm catering to artificial intelligence startups and tech titans seeks litigators to help inventors protect and profit from their ideas decades into future through air-tight IP fortress solutions shielding rare ingenuity from legal turbulence.

Mastery scoping prior art, navigating examiner nuance and steeling clients against litigation sorties through almost precognitive discernment of claim vulnerabilities and argument angles required.`,
    teamSizeMin: 4,
    teamSizeMax: 7,
    requiredSkills: ['Prior Art Recall', 'Preemptive Protection', 'Claims Scoping', 'Courtroom Composure'],
    compensationMin: 280000,
    compensationMax: 450000,
    equityOffered: false,
    benefits: ['Partner fast-track', 'Inventor success sharing', 'Category-defining casework'],
    remotePolicy: 'hybrid',
    urgency: 'standard',
  },
];

async function seedOpportunities() {
  console.log('Seeding opportunities from Liftouts.md...\n');

  // Get the demo company user to be the creator
  const companyUser = await prisma.user.findUnique({
    where: { email: 'company@example.com' },
  });

  if (!companyUser) {
    console.error('Company user not found. Run main seed first.');
    process.exit(1);
  }

  for (const opp of opportunities) {
    // Create or find company
    let company = await prisma.company.findUnique({
      where: { slug: opp.companySlug },
    });

    if (!company) {
      company = await prisma.company.create({
        data: {
          name: opp.companyName,
          slug: opp.companySlug,
          description: `${opp.companyName} is a leading company in the ${opp.industry} industry.`,
          industry: opp.industry,
          companySize: 'large',
          headquartersLocation: opp.location,
          verificationStatus: 'verified',
          verifiedAt: new Date(),
          users: {
            create: {
              userId: companyUser.id,
              role: 'member',
              isPrimaryContact: false,
            },
          },
        },
      });
      console.log(`Created company: ${opp.companyName}`);
    }

    // Check if opportunity already exists
    const existingOpp = await prisma.opportunity.findFirst({
      where: {
        title: opp.title,
        companyId: company.id,
      },
    });

    if (existingOpp) {
      console.log(`Opportunity already exists: ${opp.title}`);
      continue;
    }

    // Create opportunity
    await prisma.opportunity.create({
      data: {
        companyId: company.id,
        title: opp.title,
        description: opp.description,
        industry: opp.industry,
        location: opp.location,
        teamSizeMin: opp.teamSizeMin,
        teamSizeMax: opp.teamSizeMax,
        requiredSkills: opp.requiredSkills,
        preferredSkills: [],
        niceToHaveSkills: [],
        compensationMin: opp.compensationMin,
        compensationMax: opp.compensationMax,
        compensationCurrency: 'USD',
        equityOffered: opp.equityOffered,
        benefits: opp.benefits,
        remotePolicy: opp.remotePolicy as 'remote' | 'hybrid' | 'onsite',
        urgency: opp.urgency as 'low' | 'standard' | 'high' | 'urgent',
        status: 'active',
        visibility: 'public',
        contractType: 'full_time',
        createdBy: companyUser.id,
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
      },
    });

    console.log(`Created opportunity: ${opp.title}`);
  }

  console.log('\nOpportunities seeded successfully!');
}

seedOpportunities()
  .catch((e) => {
    console.error('Error seeding opportunities:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
