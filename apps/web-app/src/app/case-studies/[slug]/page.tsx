import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { CaseStudyContent, CaseStudy } from '@/components/case-studies/CaseStudyContent';

// Case study data with full content
const caseStudies: Record<string, CaseStudy> = {
  'meta-scale-ai': {
    slug: 'meta-scale-ai',
    year: '2025',
    acquirer: 'Meta',
    target: 'Scale AI',
    headline: 'Meta Hires Scale AI Founder to Lead Superintelligence Efforts',
    subheadline: 'A $14.3 billion deal that brought the world\'s youngest self-made billionaire to lead Meta\'s AI ambitions',
    dealValue: '$14.3B for 49% stake',
    teamSize: 'CEO + leadership team',
    industry: 'Technology / AI',
    summary: 'In June 2025, Meta announced a landmark $14.3 billion investment in Scale AI that included hiring founder and CEO Alexandr Wang to lead Meta\'s superintelligence efforts. The deal gave Meta a 49% non-voting stake in Scale AI while bringing one of AI\'s most accomplished entrepreneurs into the fold.',
    background: [
      'Scale AI, founded in 2016 by then-19-year-old Alexandr Wang, had become the critical infrastructure layer for AI development—providing the labeled data that trained models from OpenAI, Meta, and the US Department of Defense.',
      'By 2025, Scale AI was valued at over $29 billion and had established itself as essential to virtually every major AI initiative.',
      'Meanwhile, Meta was facing a crisis. The April 2025 release of Llama 4 was widely criticized—allegations of inflated performance metrics, rushed release, and failure to keep pace with rivals like DeepSeek led many to call it "a flop."',
      'CEO Mark Zuckerberg grew frustrated that rivals like OpenAI appeared further ahead in both underlying AI models and consumer-facing applications.',
    ],
    theMove: [
      'Meta\'s relationship with Scale AI dated back to 2019, when the social media company began using Scale as a data provider for its AI efforts.',
      'In June 2025, Meta announced the unprecedented deal: $14.3 billion for a 49% stake in Scale AI, plus the hiring of Alexandr Wang himself.',
      'Critically, Meta\'s stake came with no voting power—Scale AI remained independent and continued serving its other customers.',
      'Wang would continue as a director on Scale AI\'s board while working on "superintelligence efforts" for Meta. Jason Droege, Scale\'s chief strategy officer, became interim CEO.',
    ],
    keyPlayers: [
      { name: 'Alexandr Wang', role: 'Scale AI Founder & CEO → Meta Superintelligence Lead', context: 'Became world\'s youngest self-made billionaire at 24. Known for understanding both AI\'s technical complexities and how to build a business.' },
      { name: 'Mark Zuckerberg', role: 'Meta CEO', context: 'Initiated the deal after growing frustrated with Meta\'s AI progress relative to competitors.' },
      { name: 'Jason Droege', role: 'Scale AI CSO → Interim CEO', context: 'Took over day-to-day Scale AI operations to maintain independence.' },
    ],
    whyItWorked: [
      'Wang brought both technical credibility and proven execution ability—rare in AI leadership.',
      'The non-voting stake structure preserved Scale AI\'s independence, avoiding antitrust concerns and maintaining customer relationships.',
      'Meta got talent and strategic partnership without the regulatory burden of a full acquisition.',
      'Scale AI retained its ability to serve other customers, including Meta\'s competitors.',
    ],
    challenges: [
      'Managing potential conflicts of interest with Scale AI continuing to serve competitors.',
      'Questions about whether Wang can deliver results in Meta\'s more bureaucratic environment.',
      'Scale AI must now operate under interim leadership while maintaining momentum.',
    ],
    outcome: [
      'Meta immediately gained world-class AI leadership and a strategic data partnership.',
      'The deal signaled to the market that Meta was serious about competing in AI.',
      'Scale AI continued operating independently with a significantly stronger balance sheet.',
    ],
    lessonsLearned: [
      'Creative deal structures (non-voting stakes) can solve both talent acquisition and regulatory concerns.',
      'Sometimes buying part of a company and hiring its leader beats a full acquisition.',
      'In the AI talent war, the right leader can be worth billions.',
    ],
    sources: [
      { title: 'Scale AI\'s Alexandr Wang confirms departure for Meta as part of $14.3 billion deal', url: 'https://www.cnbc.com/2025/06/12/scale-ai-founder-wang-announces-exit-for-meta-part-of-14-billion-deal.html', publication: 'CNBC', date: 'June 12, 2025' },
      { title: 'Scale AI confirms investment from Meta, says CEO Alexandr Wang is leaving', url: 'https://techcrunch.com/2025/06/13/scale-ai-confirms-significant-investment-from-meta-says-ceo-alexandr-wang-is-leaving/', publication: 'TechCrunch', date: 'June 13, 2025' },
      { title: 'Why Meta hired Scale AI CEO Alexandr Wang', url: 'https://fortune.com/2025/06/13/why-meta-hired-scale-ai-ceo-alexandr-wang/', publication: 'Fortune', date: 'June 13, 2025' },
      { title: 'The inside story of Scale AI cofounder Alexandr Wang\'s rise and the $14 billion Meta deal', url: 'https://fortune.com/2025/06/22/inside-rise-scale-alexandr-wang-meta-zuckerberg-14-billion-deal-acquihire-ai-supremacy-race/', publication: 'Fortune', date: 'June 22, 2025' },
      { title: 'A frustrated Zuckerberg makes his biggest AI bet', url: 'https://www.cnbc.com/2025/06/10/zuckerberg-makes-metas-biggest-bet-on-ai-14-billion-scale-ai-deal.html', publication: 'CNBC', date: 'June 10, 2025' },
    ],
  },
  'google-windsurf': {
    slug: 'google-windsurf',
    year: '2025',
    acquirer: 'Google',
    target: 'Windsurf (Codeium)',
    headline: 'Google Poaches Windsurf Leadership, Derailing OpenAI\'s $3B Acquisition',
    subheadline: 'A $2.4 billion talent deal that snatched 40+ engineers from under OpenAI\'s nose in just 72 hours',
    dealValue: '$2.4B (licensing + compensation)',
    teamSize: 'CEO + co-founder + 40 senior engineers',
    industry: 'Technology / AI',
    summary: 'In July 2025, Google executed a precision "reverse acquihire" that hired Windsurf\'s CEO, co-founder, and approximately 40 senior R&D staff—effectively gutting a $3 billion acquisition that OpenAI had been finalizing. The move demonstrated how talent deals can be more valuable than full acquisitions.',
    background: [
      'Windsurf (originally named Codeium) was founded in 2021 by MIT classmates Varun Mohan and Douglas Chen. The company built AI-powered coding assistants that competed directly with GitHub Copilot.',
      'By early 2025, Windsurf had become one of the hottest AI startups, with technology that enabled "agentic coding"—AI systems that act as autonomous development partners.',
      'In May 2025, Bloomberg reported that OpenAI had agreed to pay $3 billion for Windsurf. The deal would have given OpenAI talent, technology, and a user base to compete in AI-assisted coding.',
      'However, the OpenAI deal ran into a critical problem: Microsoft\'s contractual rights to any IP that OpenAI acquires, valid through 2030.',
    ],
    theMove: [
      'On Friday evening, July 11, 2025, Google announced a $2.4 billion deal—not an acquisition, but a licensing agreement and talent hire.',
      'Google specifically acquired CEO Varun Mohan, co-founder Douglas Chen, and approximately 40 senior R&D staff focused on agentic coding.',
      'The deal gave Google non-exclusive licensing rights to Windsurf\'s technology while integrating the acquired talent into DeepMind\'s Gemini coding initiatives.',
      'The payment was split roughly evenly: $1.2 billion to investors, and $1.2 billion in compensation packages for the ~40 hired employees, with substantial portions going to the co-founders.',
    ],
    keyPlayers: [
      { name: 'Varun Mohan', role: 'Windsurf CEO → Google/DeepMind', context: 'MIT graduate who built Windsurf from a dorm room idea to a $3B acquisition target.' },
      { name: 'Douglas Chen', role: 'Windsurf Co-founder → Google/DeepMind', context: 'MIT classmate of Mohan, key technical architect of Windsurf\'s agentic coding systems.' },
      { name: '~40 Senior Engineers', role: 'Windsurf R&D → Google/DeepMind', context: 'Core team focused on autonomous AI coding systems.' },
    ],
    whyItWorked: [
      'Google avoided regulatory scrutiny by structuring the deal as licensing + hiring rather than a full acquisition.',
      'The talent-focused approach gave Google what it actually needed (the people building the technology) without the burden of integrating a whole company.',
      'OpenAI\'s Microsoft obligations created an opening that Google exploited with speed and precision.',
      'By acting on a Friday evening, Google limited OpenAI\'s ability to counter-offer before the news cycle.',
    ],
    challenges: [
      'Windsurf was effectively dismembered—Cognition acquired the remaining assets and ~210 employees within 72 hours.',
      'Questions remain about whether the hired team can be as effective within Google\'s larger organization.',
      'Investors received value, but the company as an independent entity ceased to exist.',
    ],
    outcome: [
      'Google gained immediate leadership in agentic coding for DeepMind\'s Gemini project.',
      'OpenAI\'s $3 billion acquisition collapsed entirely.',
      'Cognition acquired Windsurf\'s remaining IP, product, brand, and employees for an undisclosed amount.',
      'The deal demonstrated that in the AI talent war, speed and creative structures beat traditional M&A.',
    ],
    lessonsLearned: [
      'Acqui-hires can be more valuable than full acquisitions when the goal is talent.',
      'Regulatory constraints on competitors (like OpenAI\'s Microsoft obligations) create opportunities.',
      'Speed matters—Google closed the deal before OpenAI could respond.',
      'Sometimes the best deal for everyone is splitting a company between buyers.',
    ],
    sources: [
      { title: 'Google snatches Windsurf execs in a $2.4B deal, derailing OpenAI\'s biggest acquisition yet', url: 'https://www.computerworld.com/article/4021763/google-snatches-windsurf-execs-in-a-2-4b-deal-derailing-openais-biggest-acquisition-yet.html', publication: 'Computerworld', date: 'July 12, 2025' },
      { title: 'OpenAI\'s $3 billion deal with AI coding startup Windsurf collapses, as Google swoops in', url: 'https://fortune.com/2025/07/11/the-exclusivity-on-openais-3-billion-acquisition-for-coding-startup-windsfurf-has-expired/', publication: 'Fortune', date: 'July 11, 2025' },
      { title: 'More details emerge on how Windsurf\'s VCs and founders got paid from the Google deal', url: 'https://techcrunch.com/2025/08/01/more-details-emerge-on-how-windsurfs-vcs-and-founders-got-paid-from-the-google-deal/', publication: 'TechCrunch', date: 'August 1, 2025' },
      { title: 'Who is Varun Mohan, Windsurf CEO hired by Google', url: 'https://www.business-standard.com/technology/tech-news/google-hires-windsurf-ceo-varun-mohan-gemini-ai-project-openai-douglas-chen-125071200543_1.html', publication: 'Business Standard', date: 'July 12, 2025' },
      { title: 'Windsurf AI Drama: How a $3 Billion Coding Startup Got Split Between Google, OpenAI, and Cognition', url: 'https://elephas.app/blog/windsurf-ai-3-billion-collapse-72-hours', publication: 'Elephas', date: 'July 2025' },
    ],
  },
  'crowell-reed-smith': {
    slug: 'crowell-reed-smith',
    year: '2025',
    acquirer: 'Crowell & Moring',
    target: 'Reed Smith',
    headline: '16 Partners and 24+ Associates Move as One Unit to Crowell',
    subheadline: 'The largest healthcare litigation liftout of 2025, reshaping the legal industry\'s competitive landscape',
    dealValue: '40+ lawyers',
    teamSize: '16 partners + 24+ associates',
    industry: 'Law',
    summary: 'In August 2025, Crowell & Moring announced that 16 healthcare litigation partners from Reed Smith were joining the firm, along with their team of associates—more than 40 lawyers total moving as a single unit. The move instantly created one of the largest healthcare practices in the country.',
    background: [
      'Crowell & Moring had been steadily building its healthcare practice but lacked the depth in managed care litigation to compete with the top firms.',
      'Reed Smith\'s healthcare litigation group, led by Martin J. Bishop, had built a national reputation defending managed care companies in complex litigation across all 50 states.',
      'Bishop had previously led a similar group move—bringing lawyers from Foley & Lardner to Reed Smith in 2015, where he eventually joined the executive committee.',
      'Healthcare litigation was heating up, with managed care companies facing an increasingly complex regulatory and litigation landscape.',
    ],
    theMove: [
      'On August 6, 2025, Crowell & Moring announced that 16 partners from Reed Smith\'s healthcare litigation practice were joining the firm.',
      'The move included a team that would grow to more than 40 lawyers across multiple markets: Chicago (where 8 partners joined), Los Angeles, San Francisco, and Dallas.',
      'The Dallas contingent was particularly significant—Crowell opened its first Texas office as part of this deal, with Scott Williams serving as managing partner.',
      'Martin Bishop would co-chair Crowell\'s healthcare group and bring his executive committee experience from Reed Smith.',
    ],
    keyPlayers: [
      { name: 'Martin J. Bishop', role: 'Reed Smith Executive Committee → Crowell Healthcare Co-Chair', context: 'Trial attorney who built and led Reed Smith\'s healthcare litigation practice. Known for orchestrating successful group moves.' },
      { name: 'Rebecca Hanson', role: 'Partner, Chicago', context: 'One of the core partners who originally moved with Bishop from Foley & Lardner in 2015.' },
      { name: 'Thomas Hardy', role: 'Partner, Chicago', context: 'Another Foley & Lardner alum, part of the group\'s stable core.' },
      { name: 'Scott Williams', role: 'Managing Partner, Dallas Office', context: 'Led the Texas expansion, opening Crowell\'s first Lone Star State office.' },
    ],
    whyItWorked: [
      'The team had already moved together successfully once before (Foley to Reed Smith in 2015), proving they could integrate effectively.',
      'Bishop\'s executive committee experience meant he understood firm management and could navigate the political aspects of integration.',
      'Crowell offered something Reed Smith couldn\'t—the opportunity to be the dominant healthcare practice rather than one of several strong groups.',
      'The multi-city structure (Chicago, LA, SF, Dallas) gave Crowell national coverage overnight.',
    ],
    challenges: [
      'Integrating a 40+ lawyer group requires significant administrative and cultural alignment work.',
      'The new Dallas office needs to be built out with proper infrastructure and support.',
      'Reed Smith lost significant revenue and had to reorganize its healthcare practice.',
    ],
    outcome: [
      'Crowell instantly became one of the largest healthcare litigation practices in the country.',
      'The firm expanded its geographic footprint with a new Texas presence.',
      'The deal was described as "reshaping this sector of the legal industry nationally."',
      'Crowell nearly doubled the size of its healthcare team in Chicago alone.',
    ],
    lessonsLearned: [
      'Teams that have moved together before are lower-risk liftout targets.',
      'A leader with management experience (like Bishop\'s executive committee role) can navigate integration challenges.',
      'Opening new offices as part of a liftout can be more effective than trying to build from scratch.',
      'Law firm group moves continue to accelerate—this was part of a 13.9% year-over-year increase.',
    ],
    sources: [
      { title: 'Leading Health Care Practices Combine to Provide Comprehensive Counsel', url: 'https://www.crowell.com/en/insights/firm-news/leading-health-care-practices-combine-to-provide-comprehensive-counsel-to-clients-at-a-time-of-tremendous-change-across-the-industry', publication: 'Crowell & Moring', date: 'August 6, 2025' },
      { title: 'Crowell adds 16 healthcare litigation partners across US from Reed Smith', url: 'https://www.globallegalpost.com/news/crowell-adds-16-healthcare-litigation-partners-across-us-from-reed-smith-987962187', publication: 'Global Legal Post', date: 'August 2025' },
      { title: 'Crowell Nabs 16 Reed Smith Partners in National Health Care Push', url: 'https://news.bloomberglaw.com/business-and-practice/crowell-nabs-16-reed-smith-partners-in-national-health-care-push', publication: 'Bloomberg Law', date: 'August 2025' },
      { title: 'Crowell Lands 16 Reed Smith Health Partners Across 4 Cities', url: 'https://www.law360.com/articles/2373122/crowell-lands-16-reed-smith-health-partners-across-4-cities', publication: 'Law360', date: 'August 2025' },
      { title: 'Top Biglaw Firm Poaches 40+ Lawyers From Competitor', url: 'https://abovethelaw.com/2025/08/top-biglaw-firm-poaches-40-lawyers-from-competitor-in-latest-group-lateral-move/', publication: 'Above the Law', date: 'August 2025' },
    ],
  },
};

// Get all case study slugs for static generation
export function generateStaticParams() {
  return Object.keys(caseStudies).map((slug) => ({ slug }));
}

// Generate metadata for each case study
export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const caseStudy = caseStudies[params.slug];

  if (!caseStudy) {
    return {
      title: 'Case Study Not Found | Liftout',
    };
  }

  return {
    title: `${caseStudy.acquirer} ← ${caseStudy.target} | Liftout Case Study`,
    description: caseStudy.summary,
    openGraph: {
      title: `${caseStudy.acquirer} ← ${caseStudy.target} | Liftout Case Study`,
      description: caseStudy.headline,
    },
  };
}

export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  const caseStudy = caseStudies[params.slug];

  if (!caseStudy) {
    notFound();
  }

  // Get other case studies for navigation
  const otherStudies = Object.values(caseStudies).filter(s => s.slug !== params.slug);

  return <CaseStudyContent caseStudy={caseStudy} otherStudies={otherStudies} />;
}
