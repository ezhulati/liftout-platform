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
  'mayer-brown-dechert': {
    slug: 'mayer-brown-dechert',
    year: '2025',
    acquirer: 'Mayer Brown',
    target: 'Dechert',
    headline: 'Mayer Brown Hires Three Dechert Partners to Build Private Capital Powerhouse',
    subheadline: 'A strategic trio hire from Dechert\'s global leveraged finance leadership to dominate Europe\'s private capital market',
    dealValue: '3 partners',
    teamSize: '3 partners + team',
    industry: 'Law',
    summary: 'In 2025, Mayer Brown executed a strategic hire of three senior partners from Dechert in London, including the co-heads of Dechert\'s global leveraged finance practice. The move was part of Mayer Brown\'s strategy to "double down" on private capital and position itself at the forefront of Europe\'s direct lending market.',
    background: [
      'Private capital has become one of the fastest-growing areas of legal practice, with direct lending and private credit reshaping how companies access financing.',
      'Dechert had built one of the leading global leveraged finance practices, with Philip Butler and David Miles serving as co-heads.',
      'Mayer Brown saw an opportunity to rapidly accelerate its private capital capabilities by acquiring proven leadership rather than building organically.',
      'The European private capital market was experiencing explosive growth, creating intense competition for specialized legal talent.',
    ],
    theMove: [
      'Mayer Brown hired Philip Butler and David Miles, who co-led Dechert\'s global leveraged finance practice, along with Mark Evans from Dechert\'s private equity group.',
      'Philip Butler had more than three decades of experience and also served as Co-Head of London Corporate & Securities at Dechert.',
      'The hires followed earlier 2025 additions including Corporate Trustee partner Kevin Ng and Structured Finance partners Chris McGarry and Adam Farrell.',
      'London managing partner Dominic Griffiths described the strategy as "doubling down" on financial services and private capital.',
    ],
    keyPlayers: [
      { name: 'Philip Butler', role: 'Dechert Global Leveraged Finance Co-Head → Mayer Brown Partner', context: 'Three decades of experience in leveraged finance. Also served as Co-Head of London Corporate & Securities at Dechert.' },
      { name: 'David Miles', role: 'Dechert Global Leveraged Finance Co-Head → Mayer Brown Partner', context: 'Co-led Dechert\'s global leveraged finance practice alongside Butler.' },
      { name: 'Mark Evans', role: 'Dechert Private Equity → Mayer Brown Partner', context: 'Focuses on fund acquisitions, co-investment, joint ventures, and equity and debt financing.' },
    ],
    whyItWorked: [
      'The hires brought recognized leadership—Butler and Miles were known as "leaders in their fields" with international experience.',
      'The trio\'s experience aligned perfectly with Mayer Brown\'s strategic plan to lead in European private capital.',
      'By hiring the co-heads of a competing practice, Mayer Brown immediately gained credibility with clients.',
      'The move was part of a coordinated buildup, not an isolated hire, signaling sustained commitment to the practice area.',
    ],
    challenges: [
      'Integrating partners from a different firm culture while maintaining their existing client relationships.',
      'Competition for private capital work is intense—the team needed to deliver results quickly.',
      'Dechert\'s leveraged finance practice lost significant leadership that had to be rebuilt.',
    ],
    outcome: [
      'Mayer Brown significantly strengthened its position in European private capital and direct lending.',
      'The firm demonstrated ability to attract top talent through strategic positioning rather than just compensation.',
      'The coordinated series of hires created a cohesive private capital team rather than isolated additions.',
    ],
    lessonsLearned: [
      'Hiring practice group co-heads together preserves working relationships and institutional knowledge.',
      'A series of coordinated hires is more effective than one-off additions for building a new practice.',
      'Publicly articulating strategy ("doubling down") helps attract talent aligned with firm direction.',
    ],
    sources: [
      { title: 'Mayer Brown further strengthens private capital capabilities with appointments of Philip Butler and David Miles', url: 'https://www.mayerbrown.com/en/news/2025/09/mayer-brown-further-strengthens-private-capital-capabilities-with-appointments-of-philip-butler-and-david-miles', publication: 'Mayer Brown', date: 'September 2025' },
      { title: '\'Doubling down on private capital\': Mayer Brown adds three partners from Dechert', url: 'https://www.nonbillable.co.uk/news/mayer-browns-hires-three-partners-from-dechert', publication: 'Nonbillable', date: '2025' },
      { title: 'Mayer Brown snaps up transactional trio from Dechert', url: 'https://www.thelawyer.com/mayer-brown-snaps-up-transactional-trio-from-dechert/', publication: 'The Lawyer', date: '2025' },
      { title: 'Mayer Brown continues private capital push with appointment of Mark Evans', url: 'https://www.mayerbrown.com/en/news/2025/10/mayer-brown-continues-private-capital-push-with-appointment-of-mark-evans', publication: 'Mayer Brown', date: 'October 2025' },
    ],
  },
  'microsoft-inflection': {
    slug: 'microsoft-inflection',
    year: '2024',
    acquirer: 'Microsoft',
    target: 'Inflection AI',
    headline: 'Microsoft Pays $650M to Hire Inflection AI\'s Entire Leadership and Most of Its Staff',
    subheadline: 'A creative deal structure that brought DeepMind co-founder Mustafa Suleyman to lead Microsoft\'s consumer AI while avoiding antitrust scrutiny',
    dealValue: '$650M',
    teamSize: 'CEO + most of 70 employees',
    industry: 'Technology / AI',
    summary: 'In March 2024, Microsoft stunned the AI world by hiring Inflection AI\'s co-founders Mustafa Suleyman and Karén Simonyan, along with most of the startup\'s 70 employees. Microsoft paid approximately $650 million—$620 million to license Inflection\'s AI models and $30 million for legal waivers—while leaving Inflection intact as a company to avoid regulatory scrutiny.',
    background: [
      'Inflection AI was founded in 2022 by Reid Hoffman, Mustafa Suleyman (DeepMind co-founder), and Karén Simonyan. In June 2023, it raised $1.3 billion at a $4 billion valuation.',
      'The startup had positioned itself as a competitor to OpenAI and Anthropic, developing Pi, a chatbot focused on emotional support and conversational AI.',
      'Suleyman had co-founded DeepMind, which Google acquired for over $500 million in 2014. He was one of the most respected leaders in AI.',
      'Microsoft, despite its partnership with OpenAI, wanted to build its own consumer AI capabilities with proven leadership.',
    ],
    theMove: [
      'On March 19, 2024, Microsoft announced it had hired Suleyman and Simonyan to form a new organization called Microsoft AI, focused on Copilot and consumer AI products.',
      'Most of Inflection\'s approximately 70 employees joined Microsoft alongside the founders.',
      'Microsoft paid $620 million to license Inflection\'s AI models and approximately $30 million for legal waivers related to the mass hiring.',
      'Critically, Inflection remained intact as a company—Microsoft absorbed the staff without formally acquiring the entity, avoiding automatic regulatory review.',
    ],
    keyPlayers: [
      { name: 'Mustafa Suleyman', role: 'Inflection AI CEO & Co-founder → Microsoft EVP & CEO of Microsoft AI', context: 'DeepMind co-founder, one of the most influential figures in AI. Now leads Microsoft\'s consumer AI efforts.' },
      { name: 'Karén Simonyan', role: 'Inflection AI Co-founder → Microsoft AI', context: 'Technical co-founder who helped build Inflection\'s AI capabilities.' },
      { name: 'Reid Hoffman', role: 'Inflection AI Co-founder & Board Member', context: 'LinkedIn co-founder who also sits on Microsoft\'s board, creating alignment between the companies.' },
    ],
    whyItWorked: [
      'The deal structure avoided antitrust scrutiny—Microsoft hired staff and licensed tech without acquiring Inflection.',
      'Suleyman brought instant credibility and leadership to Microsoft\'s consumer AI efforts.',
      'Reid Hoffman\'s presence on both sides helped facilitate an arrangement that worked for all parties.',
      'Microsoft got proven AI talent and technology while Inflection investors received value.',
    ],
    challenges: [
      'UK\'s Competition and Markets Authority launched a probe, though it concluded the deal didn\'t threaten competition.',
      'Inflection pivoted to enterprise AI for business workflows with a skeleton crew.',
      'Questions about whether this sets a precedent for avoiding M&A regulation through creative structures.',
    ],
    outcome: [
      'Suleyman became EVP and CEO of Microsoft AI, immediately leading Copilot development.',
      'Microsoft gained world-class AI leadership without the regulatory burden of an acquisition.',
      'The deal demonstrated how "acqui-hire" structures can work at billion-dollar scale.',
      'Inflection survived as a company, pivoting to enterprise AI under new leadership.',
    ],
    lessonsLearned: [
      'Creative deal structures (licensing + hiring) can achieve acquisition outcomes without acquisition scrutiny.',
      'Having aligned stakeholders (like Hoffman on both sides) enables complex negotiations.',
      'The most valuable asset in AI companies is often the people, not the technology itself.',
      'Leaving the target company intact preserves optionality and reduces regulatory risk.',
    ],
    sources: [
      { title: 'Microsoft Pays Inflection AI $650 Million, Hires Most of its Staff', url: 'https://www.deeplearning.ai/the-batch/microsoft-pays-inflection-ai-650-million-hires-most-of-its-staff/', publication: 'The Batch (DeepLearning.AI)', date: 'March 2024' },
      { title: 'Mustafa Suleyman, DeepMind and Inflection Co-founder, joins Microsoft to lead Copilot', url: 'https://blogs.microsoft.com/blog/2024/03/19/mustafa-suleyman-deepmind-and-inflection-co-founder-joins-microsoft-to-lead-copilot/', publication: 'Microsoft Blog', date: 'March 19, 2024' },
      { title: 'Microsoft hires Inflection founders to run new consumer AI division', url: 'https://techcrunch.com/2024/03/19/microsoft-hires-inflection-founders-to-run-new-consumer-ai-division/', publication: 'TechCrunch', date: 'March 19, 2024' },
      { title: 'Microsoft to pay Inflection AI $650 mn after scooping up most of staff', url: 'https://www.business-standard.com/world-news/microsoft-to-pay-inflection-ai-650-mn-after-scooping-up-most-of-staff-124032200098_1.html', publication: 'Business Standard', date: 'March 22, 2024' },
      { title: 'Microsoft Pays $650 Million to Inflection AI for Software Licensing, Staff Hiring', url: 'https://www.techtimes.com/articles/302841/20240321/microsoft-pays-650-million-inflection-ai-software-licensing-staff-hiring.htm', publication: 'Tech Times', date: 'March 21, 2024' },
    ],
  },
  'google-character-ai': {
    slug: 'google-character-ai',
    year: '2024',
    acquirer: 'Google',
    target: 'Character.AI',
    headline: 'Google Pays $2.7B to Rehire the Inventors of Transformer Architecture',
    subheadline: 'A reverse acqui-hire that brought back Noam Shazeer, co-author of "Attention Is All You Need," to lead Google\'s Gemini project',
    dealValue: '$2.7B',
    teamSize: 'Founders + key employees',
    industry: 'Technology / AI',
    summary: 'In August 2024, Google signed a $2.7 billion deal with Character.AI to license the startup\'s technology and hire its co-founders Noam Shazeer and Daniel De Freitas—both former Google researchers who had left in 2021. The deal brought back one of the inventors of the transformer architecture that powers modern AI to lead Google\'s Gemini project.',
    background: [
      'In 2017, Noam Shazeer was one of the lead authors of "Attention Is All You Need," the seminal paper that introduced the transformer architecture—the foundation of ChatGPT, Gemini, and virtually all modern AI.',
      'Shazeer first joined Google in 2000, just two years after its founding. He spent 20 years at the company before leaving.',
      'At Google, Shazeer and Daniel De Freitas built a chatbot named Meena. When Google refused to release it publicly, they left in 2021 to found Character.AI.',
      'Character.AI became a popular platform allowing users to chat with AI-powered versions of celebrities and fictional characters, reaching millions of users.',
    ],
    theMove: [
      'In August 2024, Google confirmed a $2.7 billion cash deal to license Character.AI\'s technology and hire Shazeer, De Freitas, and other key employees.',
      'Shazeer was appointed as technical lead on Gemini, alongside Jeff Dean and Oriol Vinyals—putting him at the center of Google\'s AI efforts.',
      'The deal was structured as a "reverse acqui-hire"—licensing plus hiring rather than a full acquisition—to avoid regulatory concerns.',
      'Shazeer, who owned 30-40% of Character.AI, reportedly netted $750 million to $1 billion from the deal personally.',
    ],
    keyPlayers: [
      { name: 'Noam Shazeer', role: 'Character.AI Co-founder → Google Technical Lead on Gemini', context: 'Co-author of "Attention Is All You Need." One of the inventors of transformer architecture. 20-year Google veteran who returned for $2.7B.' },
      { name: 'Daniel De Freitas', role: 'Character.AI Co-founder → Google', context: 'Former Google researcher who built Meena chatbot with Shazeer before leaving to found Character.AI.' },
    ],
    whyItWorked: [
      'Google was rehiring someone who had literally invented core AI technology, eliminating integration risk.',
      'Shazeer knew Google\'s systems and culture from 20 years of experience—he could be productive immediately.',
      'The reverse acqui-hire structure avoided regulatory scrutiny that a full acquisition would trigger.',
      'Character.AI got significant value for shareholders while the founders returned to a well-resourced environment.',
    ],
    challenges: [
      'The U.S. Department of Justice is investigating whether this deal circumvented regulatory oversight.',
      'Character.AI had to continue operating with reduced leadership and resources.',
      'Questions about whether paying this much for rehires sets unsustainable talent market expectations.',
    ],
    outcome: [
      'Google gained one of the world\'s foremost AI researchers to lead its most important AI project.',
      'Shazeer immediately became technical lead on Gemini, Google\'s answer to ChatGPT.',
      'The deal demonstrated that former employees can become billion-dollar assets.',
      'Character.AI continued operating independently with Google\'s licensing investment.',
    ],
    lessonsLearned: [
      'Former employees who left to build competitors can become the most valuable acquisition targets.',
      'Inventors of foundational technology command extraordinary premiums in talent markets.',
      'Reverse acqui-hires can be used to bring back talent that wouldn\'t consider traditional employment.',
      'The cost of letting key talent leave can be measured in billions.',
    ],
    sources: [
      { title: 'Google Confirms $2.7 Billion Deal to Hire Character Co-Founders', url: 'https://www.theinformation.com/briefings/google-confirms-2-7-billion-deal-to-hire-character-co-founders', publication: 'The Information', date: 'August 2024' },
      { title: 'Google Reportedly Spent $2.7 Billion to Rehire Character.AI Founder', url: 'https://www.pymnts.com/artificial-intelligence-2/2024/google-reportedly-spent-2-7-billion-to-rehire-character-ai-founder/', publication: 'PYMNTS', date: 'September 2024' },
      { title: 'Why Google Paid $2.7 Billion To Reclaim Its Lost AI Genius', url: 'https://dataconomy.com/2024/09/26/why-google-paid-2-7-billion-to-reclaim-its-lost-ai-genius/', publication: 'Dataconomy', date: 'September 26, 2024' },
      { title: 'Meet Noam Shazeer, the AI genius whom Google reportedly paid $2.7 billion to rehire', url: 'https://www.businesstoday.in/technology/news/story/meet-noam-shazeer-the-ai-genius-whom-google-reportedly-paid-27-billion-to-rehire-check-details-447863-2024-09-27', publication: 'Business Today', date: 'September 27, 2024' },
      { title: 'Noam Shazeer: After 20 years at Google, he walked away, then came back for $2.7 billion', url: 'https://gulfnews.com/special-reports/noam-shazeer-after-20-years-at-google-he-walked-away-then-came-back-for-27-billion-1.1734670875849', publication: 'Gulf News', date: '2024' },
    ],
  },
  'polsinelli-holland-knight': {
    slug: 'polsinelli-holland-knight',
    year: '2024',
    acquirer: 'Polsinelli',
    target: 'Holland & Knight',
    headline: '47 Lawyers Move to Polsinelli in One of the Biggest Law Firm Hires of the Year',
    subheadline: 'A rocket ship firm adds 30 partners and launches a Philadelphia office in a single strategic move',
    dealValue: '47 lawyers',
    teamSize: '30 partners + 17 associates/counsel',
    industry: 'Law',
    summary: 'In August 2024, Polsinelli confirmed that 47 lawyers joined the firm from Holland & Knight, including 30 partners. The move launched Polsinelli\'s Philadelphia office and nearly halved Holland & Knight\'s presence in the city. Reuters called it "one of the biggest mass law firm hires of the year."',
    background: [
      'Polsinelli had been on an aggressive growth trajectory, having grown revenue nearly 165% over 10 years to $856 million in 2023.',
      'The firm had already opened offices in Fort Worth, Texas and Park City, Utah earlier in 2024, demonstrating appetite for expansion.',
      'Holland & Knight had a significant Philadelphia presence, but key partners were exploring opportunities for greater autonomy and growth.',
      'Legal recruiter Gary Miles, who brokered the move, described Polsinelli as "a rocket ship right now."',
    ],
    theMove: [
      'In August 2024, Polsinelli announced that 47 lawyers were joining from Holland & Knight: 30 partners, one counsel, and 16 associates.',
      'The move launched Polsinelli\'s Philadelphia office—the firm\'s third new city in 2024.',
      'John Martini, Holland & Knight\'s former Philadelphia office leader who also led its tax, benefits and executive compensation group, took similar roles at Polsinelli.',
      'Additional partners came from Holland & Knight offices in Chicago, Miami, Los Angeles, and New York.',
    ],
    keyPlayers: [
      { name: 'John Martini', role: 'Holland & Knight Philadelphia Leader → Polsinelli Philadelphia Leader', context: 'Led Holland & Knight\'s Philadelphia office and its tax, benefits and executive compensation group. Now serves in similar roles at Polsinelli.' },
      { name: 'Chase Simmons', role: 'Polsinelli Chief Executive', context: 'Led the firm\'s aggressive growth strategy, expecting record performance in 2024.' },
      { name: 'Gary Miles', role: 'Legal Recruiter', context: 'Brokered the landmark move, calling Polsinelli "a rocket ship right now."' },
    ],
    whyItWorked: [
      'Polsinelli offered growth opportunity and autonomy that a larger, more established firm couldn\'t match.',
      'The firm\'s track record of 165% revenue growth over 10 years demonstrated a winning formula.',
      'Bringing the office leader (Martini) ensured continuity of client relationships and internal leadership.',
      'The multi-city scope of the hire showed Polsinelli could coordinate complex moves.',
    ],
    challenges: [
      'Integrating 47 lawyers from a different firm culture requires significant management attention.',
      'Holland & Knight lost nearly half its Philadelphia lawyers, creating pressure to rebuild.',
      'Polsinelli must deliver on the growth expectations that attracted these partners.',
    ],
    outcome: [
      'Polsinelli established instant presence in Philadelphia, its third new market of 2024.',
      'The firm demonstrated ability to execute landmark group hires, enhancing its reputation.',
      'Holland & Knight faced significant disruption in Philadelphia, needing to rebuild its practice.',
      'The move accelerated the trend of mid-sized firms challenging Am Law 100 giants through group hires.',
    ],
    lessonsLearned: [
      'Growth-oriented firms can attract talent from larger competitors by offering opportunity over stability.',
      'Bringing the office leader is crucial for maintaining client relationships and team cohesion.',
      'A track record of growth and successful hires creates momentum that attracts more talent.',
      'Geographic expansion through group hires is faster and less risky than organic growth.',
    ],
    sources: [
      { title: 'Polsinelli\'s 47-Lawyer Hire Challenges Rivals With Rapid Growth', url: 'https://news.bloomberglaw.com/business-and-practice/polsinellis-47-lawyer-hire-challenges-rivals-with-rapid-growth', publication: 'Bloomberg Law', date: 'August 2024' },
      { title: 'Polsinelli Lateral Group from Holland & Knight Totals 47, Includes Philly Leader', url: 'https://www.law.com/americanlawyer/2024/08/08/polsinelli-lateral-group-from-holland-knight-totals-47-includes-philly-leader/', publication: 'The American Lawyer', date: 'August 8, 2024' },
      { title: '47 Attorneys Are Joining Polsinelli in Major Lateral Move', url: 'https://www.polsinelli.com/news/47-attorneys-are-joining-polsinelli-in-major-lateral-move-expanding-several-key-practices-and-launching-polsinellis-philadelphia-office', publication: 'Polsinelli', date: 'August 2024' },
      { title: 'Holland & Knight loses about half its Philadelphia lawyers to this firm', url: 'https://www.abajournal.com/news/article/holland-knight-loses-about-half-its-philadelphia-lawyers-to-this-firm', publication: 'ABA Journal', date: '2024' },
      { title: 'Holland & Knight\'s Philly Leader Among 47 Joining Polsinelli', url: 'https://www.law360.com/pulse/florida-pulse/articles/1867702/holland-knight-s-philly-leader-among-47-joining-polsinelli', publication: 'Law360', date: '2024' },
    ],
  },
  'paul-hastings-vinson-elkins': {
    slug: 'paul-hastings-vinson-elkins',
    year: '2024',
    acquirer: 'Paul Hastings',
    target: 'Vinson & Elkins',
    headline: '8 Partners Lead 25-Lawyer Finance Team Move in Largest Texas Practice Group Transfer Ever',
    subheadline: 'Paul Hastings opens Dallas office and triples Texas headcount by hiring Vinson & Elkins\' energy finance leadership',
    dealValue: '25 lawyers',
    teamSize: '8 partners + 17 associates/counsel',
    industry: 'Law',
    summary: 'In early 2024, Paul Hastings hired an eight-partner, 25-lawyer finance team from Vinson & Elkins in Dallas and Houston—reportedly the largest single practice group move in Texas history. The hire included current and former co-chairs of V&E\'s global finance practice and launched Paul Hastings\' Dallas office.',
    background: [
      'Vinson & Elkins had built one of the preeminent energy finance practices in Texas, with deep expertise in oil and gas transactions.',
      'Paul Hastings had been aggressively expanding in Texas but needed senior finance leadership to compete with established players.',
      'The energy finance market was experiencing strong demand as private credit funds increasingly competed with traditional banks.',
      'Paul Hastings had only 25 lawyers in Texas before this move—the hire would transform its market position.',
    ],
    theMove: [
      'On March 28, 2024, Paul Hastings announced the arrival of the eight-partner finance team from Vinson & Elkins.',
      'Four partners would anchor the firm\'s new Dallas office, while four others joined in Houston.',
      'The team included Brian Moss, Erec Winandy, Christopher Dewar, and Guy Gribov—current and former co-chairs of V&E\'s global finance practice.',
      'Paul Hastings expected to have more than 100 lawyers in Texas by Q1 2025, up from just 25 before the hire.',
    ],
    keyPlayers: [
      { name: 'Brian Moss', role: 'V&E Global Finance Co-Chair → Paul Hastings Partner', context: 'One of the current co-chairs of V&E\'s global finance practice who led the move to Paul Hastings.' },
      { name: 'Christopher Dewar', role: 'V&E Global Finance → Paul Hastings Partner', context: 'Former co-chair of V&E\'s global finance practice, part of the leadership team.' },
      { name: 'Erec Winandy', role: 'V&E Global Finance Co-Chair → Paul Hastings Partner', context: 'Current co-chair who joined with Moss to bring the practice to Paul Hastings.' },
      { name: 'Guy Gribov', role: 'V&E Global Finance → Paul Hastings Partner', context: 'Part of the leadership team with deep energy finance expertise.' },
    ],
    whyItWorked: [
      'Paul Hastings offered a platform for growth that V&E couldn\'t match—tripling their Texas presence.',
      'Bringing both current and former practice co-chairs provided continuity and credibility with clients.',
      'The team\'s expertise in energy finance aligned with Paul Hastings\' strategic focus areas.',
      'Opening a Dallas office as part of the move gave the team geographic expansion they couldn\'t achieve at V&E.',
    ],
    challenges: [
      'Vinson & Elkins lost leadership of one of its signature practices to a direct competitor.',
      'Paul Hastings needed to build out Dallas infrastructure rapidly to support the new office.',
      'The aggressive Texas expansion created pressure to deliver strong financial results quickly.',
    ],
    outcome: [
      'Paul Hastings more than tripled its Texas headcount, from 25 lawyers to over 100 expected.',
      'The firm established a Dallas presence overnight with proven leadership.',
      'Paul Hastings instantly became a major player in Texas energy finance.',
      'The move was widely reported as the largest practice group transfer in Texas legal history.',
    ],
    lessonsLearned: [
      'Practice group co-chairs who move together bring instant credibility and client confidence.',
      'Opening a new office as part of a group hire reduces execution risk versus organic expansion.',
      'Texas energy finance expertise is highly portable—clients follow relationships.',
      'Ambitious growth targets can attract partners seeking opportunity over stability.',
    ],
    sources: [
      { title: 'Paul Hastings Adds Elite 8-Partner Band 1 Finance Team in Texas', url: 'https://www.paulhastings.com/news/paul-hastings-adds-elite-8-partner-band-1-finance-team-in-texas', publication: 'Paul Hastings', date: 'March 2024' },
      { title: 'Vinson & Elkins Finance Team Arrives at Paul Hastings', url: 'https://www.law.com/texaslawyer/2024/03/28/vinson-elkins-finance-team-arrives-at-paul-hastings/', publication: 'Texas Lawyer', date: 'March 28, 2024' },
      { title: 'Paul Hastings Bulks Up In Texas With V&E Team', url: 'https://www.law360.com/articles/1817872', publication: 'Law360', date: '2024' },
      { title: 'Paul Hastings Adds Eight Vinson & Elkins Partners in Texas', url: 'https://news.bloomberglaw.com/business-and-practice/paul-hastings-hires-eight-partner-vinson-elkins-team-in-texas', publication: 'Bloomberg Law', date: '2024' },
      { title: 'Paul Hastings Adds 8-Partner Global Finance Team From Vinson & Elkins in Texas', url: 'https://www.law.com/texaslawyer/2024/02/26/paul-hastings-adds-8-partner-global-finance-team-from-vinson-elkins-in-texas/', publication: 'Texas Lawyer', date: 'February 26, 2024' },
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
