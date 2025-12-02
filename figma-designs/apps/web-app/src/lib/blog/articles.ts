export interface Author {
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  social?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
}

export interface BlogArticle {
  slug: string;
  title: string;
  metaDescription: string;
  featuredImage: string;
  category: 'Contracts' | 'Liftouts' | 'Teamwork';
  tags: string[];
  author: Author;
  publishDate: string;
  modifiedDate?: string;
  content: string;
}

// Authors
export const authors: Record<string, Author> = {
  nick: {
    name: 'Nick Acimovic',
    email: 'nick@liftout.com',
    bio: 'Co-founder of Liftout and Managing Partner at Jovian Capital Management. Nick holds a master\'s degree in finance from Florida State University.',
    avatar: '/images/blog/Nick-Acimovic.png',
    social: {
      linkedin: 'https://www.linkedin.com/in/nicholas-acimovic-a6a64b18/',
      twitter: 'https://twitter.com/Team_Liftout',
      instagram: 'https://www.instagram.com/liftoutdotcom/',
    },
  },
  team: {
    name: 'Liftout Team',
    email: 'admin@liftout.com',
    bio: 'The Liftout team is dedicated to revolutionizing how companies hire and how teams move together.',
  },
};

export const blogArticles: BlogArticle[] = [
  {
    slug: 'steve-jobs-steve-wozniak-apple-teamwork',
    title: 'Steve & Woz: What the Original Dream Team Teaches Us About Hiring',
    metaDescription: 'The Jobs-Wozniak partnership built a $3 trillion company. Here\'s what their complementary skills and productive tension teach us about assembling great teams.',
    featuredImage: '/images/blog/Steve-Jobs-and-Woz-Dream-Team-1024x768.jpg',
    category: 'Teamwork',
    tags: ['Steve Jobs', 'Steve Wozniak', 'Apple', 'Dream Team', 'Team Building'],
    author: authors.nick,
    publishDate: '2024-11-25',
    modifiedDate: '2024-11-25',
    content: `## Two Guys in a Garage Changed Everything

In 1976, two very different people built the first Apple computer in a Los Altos garage. Steve Wozniak was the engineering genius who could make hardware sing. Steve Jobs was the visionary who saw what computers could become—and had the relentless drive to make people care.

Neither could have built Apple alone. Together, they launched a company now worth over $3 trillion.

Their partnership offers lessons that are just as relevant in 2024 as they were in 1976.

## The Power of Complementary Skills

Woz and Jobs weren't similar. They were **complementary**:

**Wozniak brought:**
- Extraordinary engineering talent (he built the Apple I single-handedly)
- Deep technical knowledge that made breakthrough hardware possible
- Patience for the painstaking work of making things work

**Jobs brought:**
- Vision for how technology could transform human experience
- Obsessive attention to design and user experience
- Commercial instincts and salesmanship that turned inventions into products

This wasn't a case of two engineers collaborating or two business minds strategizing. It was a true partnership where each person contributed what the other lacked.

## Productive Tension, Not Harmony

Here's what most "dream team" narratives miss: Jobs and Wozniak argued. A lot.

They disagreed about design decisions, business strategy, and priorities. Jobs pushed for aesthetic perfection; Woz pushed for technical elegance. Jobs wanted to change the world; Woz wanted to build cool things.

But their disagreements were **productive**. They challenged each other's assumptions. They forced better thinking. The products that emerged—the Apple II, the Macintosh—were better because neither vision dominated unchallenged.

Great teams don't avoid conflict. They channel it.

## Why This Matters for Team Hiring

Most hiring still happens one person at a time. You find an engineer. Then a product manager. Then a designer. Then hope they gel into a functioning team.

The Jobs-Woz story suggests a different approach: **hire for complementarity, not just individual excellence.**

When you acquire an intact team—a liftout—you're not just getting skills. You're getting:

- **Established working relationships** that took years to build
- **Complementary strengths** already identified and leveraged
- **Productive conflict patterns** already developed
- **Trust** that allows people to challenge each other without politics

Jobs and Woz didn't have to learn to work together after Apple hired them. They brought their working relationship with them.

## The Legacy That Persists

After Jobs left Apple in 1985 (and before he returned in 1997), the company struggled. It wasn't that Apple lacked talented individuals. It lacked the **team dynamic** that made Jobs and Wozniak effective together.

When Jobs returned, he rebuilt that dynamic—most notably with designer Jony Ive. Their partnership produced the iMac, iPod, iPhone, and iPad. Again: complementary skills, productive tension, shared commitment.

Today, under Tim Cook, Apple continues prioritizing cross-functional collaboration. The Vision Pro, launched in 2024, required coordination across hardware engineering, software development, design, and content—the kind of integration that traces directly back to how Jobs and Woz worked together.

## What You Can Learn

Whether you're building a team or looking to make a move as one:

**For companies:**
- Look beyond individual credentials to team dynamics
- Value complementary skills over uniform expertise
- Don't fear productive disagreement—fear artificial consensus
- Consider acquiring intact teams rather than building from scratch

**For teams:**
- Recognize and articulate your complementary strengths
- Develop your ability to disagree productively
- Build trust that allows challenge without damage
- Present yourselves as a unit, not a collection of individuals

## The Dream Team Model

Jobs and Woz weren't friends who decided to start a company. They were collaborators who discovered that together they could do what neither could do alone.

That's the dream team model: not people who agree on everything, but people whose differences make them stronger together.

Nearly fifty years later, that lesson is more relevant than ever. In a world where companies are competing for talent and talent is competing for opportunity, the teams that move together—and the companies smart enough to hire them—have an edge.

*The original dream team built a revolution in a garage. What could yours build?*`,
  },
  {
    slug: 'non-compete-violation-penalties-2024',
    title: 'Non-Compete Violation Penalties in 2024: What Employers Risk',
    metaDescription: 'States are imposing increasingly steep penalties on employers who violate non-compete laws. Here\'s what companies need to know about compliance in 2024.',
    featuredImage: '/images/blog/Non-Compete-Fines-1024x684.jpg',
    category: 'Contracts',
    tags: ['Non-Compete', 'Legal', 'Compliance', 'State Laws', 'Penalties'],
    author: authors.nick,
    publishDate: '2024-11-24',
    modifiedDate: '2024-11-24',
    content: `## Non-Compete Laws Now Have Real Teeth

It used to be that the worst thing that could happen if you included an unenforceable non-compete in an employment agreement was... nothing. The clause simply wouldn't be enforced if challenged.

That's changed dramatically. A growing number of states now impose **significant financial penalties** on employers who violate non-compete restrictions. Some even allow criminal charges.

For multi-state employers, the compliance stakes have never been higher.

## State-by-State Penalty Overview

### California: Up to $2,500 Per Violation
California's 2024 laws (AB 1076 and SB 699) made enforcement of non-competes not just void but **unlawful**. Employers who fail to notify employees of void non-competes face penalties up to $2,500 per violation. Employees can also sue for actual damages and attorney's fees.

### Colorado: Up to $5,000 Per Violation
Colorado imposes penalties of up to $5,000 for each non-compete that violates state law. The state also requires specific disclosures to employees about non-compete terms before hiring.

### Illinois: Civil Penalties + Attorney's Fees
Employers who violate the Illinois Freedom to Work Act face civil penalties. Employees can recover actual damages plus reasonable attorney's fees—which often exceed the underlying damages.

### Washington State: Void + Actual Damages
Non-competes against workers earning below the state threshold are void. Employers must pay actual damages or $5,000, whichever is greater, plus attorney's fees if they try to enforce prohibited agreements.

### Washington D.C.: Among the Strictest
D.C.'s Ban on Non-Compete Agreements Amendment Act imposes fines of $350-$1,000 per violation for first offenses, escalating for repeat violations. The act also requires posting and training requirements.

### Minnesota: Injunctive Relief + Attorney's Fees
While Minnesota doesn't impose statutory fines, employees can seek injunctive relief and recover attorney's fees. The 2024 expansion to service provider contracts created additional compliance requirements.

### Oregon: Void + Potential Penalties
Non-competes that don't meet Oregon's requirements are voidable. Employers face potential liability for attempting to enforce non-compliant agreements.

### Nevada: Criminal Misdemeanor Possible
Nevada can treat certain non-compete violations as misdemeanors, creating potential criminal liability for employers—not just civil penalties.

## Beyond Statutory Penalties: Litigation Risk

Even in states without specific penalty provisions, aggressive non-compete enforcement carries risks:

**Tortious interference claims**: If a new employer encourages an employee to breach a non-compete, the former employer may sue the new employer directly.

**Declaratory judgment costs**: Employees increasingly file preemptive lawsuits seeking declarations that non-competes are unenforceable. Defending these costs money even if you win.

**Reputational damage**: Word spreads. Companies known for aggressive non-compete enforcement face challenges attracting talent.

**Morale impact**: Threatening former employees with legal action affects current employees' perceptions of the company.

## What This Means for Employers

### Immediate Actions

1. **Audit all employment agreements**—identify non-compete clauses state by state
2. **Review hire locations**—different rules apply in different jurisdictions
3. **Update templates**—ensure agreements comply with the strictest applicable law
4. **Train HR teams**—ensure hiring managers understand what can and cannot be required
5. **Send required notices**—California required notices by February 2024; other states have similar requirements

### Strategic Considerations

**Consider whether you need non-competes at all**. Many companies have abandoned them entirely, finding that:
- NDAs adequately protect trade secrets
- Non-solicitation clauses protect client relationships
- Competitive compensation retains talent better than legal threats
- The compliance burden outweighs the benefits

**If you do use non-competes**, narrow them:
- Apply only to truly senior employees with access to sensitive information
- Limit duration to the minimum necessary (12 months or less)
- Define scope narrowly—specific competitors, not entire industries
- Provide adequate consideration beyond initial employment

### What About Multi-State Employers?

The patchwork of state laws creates genuine compliance challenges. Options include:

**Apply the strictest standard everywhere**: Simplifies compliance but may give away protections in permissive states.

**Customize by state**: More protective but requires robust tracking of employee locations.

**Abandon non-competes entirely**: Increasingly popular, especially in competitive talent markets.

## What Workers Should Know

If your employer asks you to sign a non-compete in a state that restricts them:

1. **Know your rights**—you may have leverage
2. **Document everything**—save copies of all employment agreements
3. **Don't be intimidated**—penalties exist to protect you
4. **Consider reporting**—some states have formal complaint mechanisms
5. **Consult an attorney**—especially if you believe your employer is violating state law

## The Trend Is Clear

States are no longer content to simply declare non-competes unenforceable. They're actively penalizing employers who try to use them anyway.

For companies, this means compliance isn't optional. For workers, it means the balance of power is shifting.

*Note: Penalty amounts and enforcement mechanisms change. Consult employment counsel for current requirements in your jurisdiction.*`,
  },
  {
    slug: 'new-york-non-compete-ban-vetoed',
    title: 'New York Non-Compete Ban Vetoed: What Happened and What\'s Next',
    metaDescription: 'Governor Hochul vetoed New York\'s sweeping non-compete ban in December 2023. Here\'s what workers need to know and what may come next.',
    featuredImage: '/images/blog/Non-Compete-Agreements-1024x778.jpg',
    category: 'Contracts',
    tags: ['Non-Compete', 'New York', 'Legislation', 'Employee Rights'],
    author: authors.nick,
    publishDate: '2024-11-18',
    modifiedDate: '2024-11-18',
    content: `## The Bill That Almost Changed Everything

In June 2023, the New York State legislature passed one of the most sweeping non-compete bans in the country. Assembly Bill A1278B would have prohibited virtually all non-compete agreements—for everyone from entry-level workers to C-suite executives.

For months, the bill sat on Governor Kathy Hochul's desk. Then, on December 22, 2023, she vetoed it.

## Why Hochul Said No

In her veto message, Governor Hochul explained that while she supports limiting non-competes for "middle-class and low-wage workers," she couldn't sign a blanket ban that ignored New York's "highly competitive economic climate" and companies' "legitimate interests" in retaining highly compensated talent.

Behind the scenes, negotiations broke down over the income threshold. Reports indicate Governor Hochul wanted to cap the ban at workers earning under $250,000. Bill sponsors countered with $300,000. The sticking point? How to count bonuses and stock options.

Neither side budged, and the bill died.

## What This Means for New York Workers

The practical reality is clear: **non-compete agreements remain enforceable in New York**—at least for now. If you've signed one, it likely still binds you, subject to the state's existing common law reasonableness tests.

New York courts have historically required non-competes to be:
- No broader than necessary to protect legitimate business interests
- Reasonable in time and geographic scope
- Not harmful to the general public
- Not unreasonably burdensome to the employee

This means overly aggressive non-competes may still be challenged—but there's no automatic protection.

## NYC Takes Up the Fight

Following the state-level veto, New York City lawmakers introduced their own legislation. Int. No. 0140-2024 would prohibit employers from entering into non-compete agreements with workers—including unpaid workers and independent contractors—within city limits.

The bill is still in committee, but if passed, it could create a patchwork situation where non-competes are banned in the city but enforceable in the rest of the state.

## What's Coming in 2024 and Beyond

Senator Sean Ryan, who sponsored the original bill, has pledged to reintroduce non-compete legislation. The question is whether a compromise can be reached—perhaps a ban that protects workers below a certain income threshold while allowing agreements for highly compensated executives.

Several developments to watch:
- **Federal landscape**: The FTC's proposed nationwide ban was struck down by a Texas court in August 2024, reducing pressure for state action
- **NYC legislation**: Could move forward independently of state efforts
- **Business lobbying**: Significant opposition from financial services and tech companies

## Practical Advice for New York Professionals

If you're currently bound by a non-compete in New York:

1. **Review your agreement carefully**—many are drafted too broadly to be enforceable
2. **Document any overreach**—if your employer has applied the non-compete unreasonably
3. **Consult an employment attorney**—especially before making a move to a competitor
4. **Negotiate on the way out**—employers sometimes waive non-competes during amicable departures
5. **Consider team-based moves**—collective transitions can provide leverage and support

## The Bigger Picture

New York's veto underscores a reality: non-compete reform is complicated. Protecting low-wage workers from overreaching restrictions is broadly popular. Banning agreements for executives earning millions in finance and tech? That's where the consensus breaks down.

For workers seeking mobility, the message is clear: don't wait for legislation to save you. Understand your specific agreement, know your state's case law, and be strategic about your career moves.

*Sources: [Jackson Lewis](https://www.jacksonlewis.com/insights/step-too-far-governor-hochul-vetoes-new-york-non-compete-ban), [Crowell & Moring](https://www.crowell.com/en/insights/client-alerts/governor-hochul-vetoes-bill-banning-non-competes-in-new-york), [Ogletree Deakins](https://ogletree.com/insights-resources/blog-posts/new-york-city-to-consider-its-own-ban-on-employer-noncompete-agreements-following-governors-veto/)*`,
  },
  {
    slug: 'non-compete-state-laws-2024-guide',
    title: 'Non-Compete State Laws in 2024: A Complete Guide',
    metaDescription: 'A comprehensive guide to non-compete laws across all 50 states in 2024, including recent bans, restrictions, and what professionals need to know.',
    featuredImage: '/images/blog/AdobeStock_474582113-1024x683.jpg',
    category: 'Contracts',
    tags: ['Non-Compete', 'State Laws', 'Employee Mobility', '2024 Guide'],
    author: authors.nick,
    publishDate: '2024-11-22',
    modifiedDate: '2024-11-22',
    content: `## The Non-Compete Landscape Has Never Been More Complex

With the FTC's federal ban struck down in August 2024, non-compete law remains a state-by-state puzzle. Some states ban them entirely. Others restrict them to high earners. Many still enforce them fully.

Here's what you need to know in 2024.

## States That Effectively Ban Non-Competes

### California
The gold standard for worker mobility. Non-competes are void—period. New 2024 laws (AB 1076 and SB 699) made enforcement not just void but **unlawful**, with civil penalties up to $2,500 per violation. California won't even enforce out-of-state non-competes against California workers.

### Minnesota
Banned non-competes for agreements entered after July 1, 2023. In 2024, expanded protections to ban certain non-solicitation clauses in service provider contracts. No salary threshold—all workers protected.

### North Dakota
One of the oldest bans in the country. Only allows non-competes in business sale contexts with reasonable time and geographic limits.

### Oklahoma
Renders most non-competes unenforceable. Employers can only prevent solicitation of established customers.

## States with Significant Restrictions

### Colorado
Workers earning below ~$123,750 (adjusted annually) cannot be bound by non-competes. Higher earners can, but employers must provide advance written notice. Violations can result in penalties of up to $5,000 per violation.

### Illinois
Prohibits non-competes for employees earning at or below $75,000 (increasing to $80,000 in 2027). Non-solicitation agreements banned for those earning under $45,000. Employers must advise workers to consult an attorney and provide 14 days to review.

### Maine
Bans non-competes for workers earning at or below 400% of the federal poverty level (~$60,000 for an individual). Requires notice to employees before hiring.

### Maryland
Cannot enforce non-competes against employees earning $15/hour or less, or the minimum wage, whichever is greater.

### Massachusetts
Limits non-competes to 12 months maximum. Requires "garden leave" pay (50% of highest salary) during the restriction period. Cannot apply to nonexempt employees, laid-off workers, or those terminated without cause.

### Nevada
Prohibits non-competes for hourly workers. Limits duration for salaried employees and requires compensation during the restricted period in some cases.

### New Hampshire
Bans non-competes for low-wage workers (earning at or below 200% of federal minimum wage).

### Oregon
Cannot enforce non-competes against employees earning below roughly $100,533 (adjusted annually). Maximum duration of 18 months. Employer must provide written notice.

### Rhode Island
Prohibits non-competes for nonexempt employees, undergraduate students, those under 18, and low-wage workers.

### Virginia
Bans non-competes for low-wage workers (earning less than the average weekly wage).

### Washington State
Bans non-competes for workers earning below $116,593 (or $291,483 for independent contractors). Void if employee is terminated without cause.

### Washington D.C.
One of the strictest—effectively bans non-competes for all workers except "highly compensated" employees earning over $150,000.

## States with Proposed Legislation

### New York
Governor Hochul vetoed a comprehensive ban in December 2023. NYC is considering its own ban (Int. No. 0140-2024). Legislation likely to be reintroduced in 2025.

### Pennsylvania
Bills proposed to limit non-competes for healthcare workers and workers below certain income thresholds. No comprehensive action yet.

### New Jersey
Various bills proposed but not enacted. Courts have narrowed enforceability through case law.

## States That Generally Enforce Non-Competes

Florida, Georgia, Texas, and most Southern states generally enforce reasonable non-competes. Courts look at:
- Legitimate business interest being protected
- Reasonable duration (typically 1-2 years)
- Reasonable geographic scope
- Whether it causes undue hardship to the employee

## What This Means for You

### If You're an Employee

1. **Know your state's rules**—protection varies dramatically
2. **Review before you sign**—negotiate narrower terms when possible
3. **Understand enforceability**—many agreements are drafted too broadly
4. **Document everything**—keep copies of all employment agreements
5. **Consider relocation**—moving to a ban state can provide an exit

### If You're an Employer

1. **Audit your agreements**—ensure state-by-state compliance
2. **Don't use one-size-fits-all**—customize for each jurisdiction
3. **Provide required notices**—many states mandate advance disclosure
4. **Consider alternatives**—NDAs and trade secret protections may be sufficient
5. **Focus on retention**—competitive compensation beats legal restrictions

## The Bigger Picture

The trend is clear: non-compete restrictions are expanding. Whether through state legislation, court decisions, or (someday) federal action, the balance of power is shifting toward worker mobility.

For professionals seeking opportunities and companies seeking talent, understanding this landscape isn't optional—it's essential.

*Note: This guide provides general information. Laws change frequently. Consult an employment attorney for advice specific to your situation.*`,
  },
  {
    slug: 'north-dakota-strictly-limits-non-compete-agreements',
    title: 'North Dakota Limits Enforceability of Non-Competes',
    metaDescription: 'With only narrow exceptions, North Dakota prohibits restraint of trade agreements like non-competes, signaling a future where merit, not legal limits, determines career paths.',
    featuredImage: '/images/blog/AdobeStock_402034033-1024x693.jpg',
    category: 'Contracts',
    tags: ['Non-Compete', 'North Dakota', 'State Laws'],
    author: authors.nick,
    publishDate: '2023-10-17',
    content: `## Non-Competes Constrain Careers

Non-compete agreements prevent employees from working for competitors or launching similar businesses for a defined period after employment ends. These restrictions can arbitrarily limit professionals from pursuing roles and ventures aligned with their aspirations.

Employers have leveraged non-competes to control career trajectories based on legal constraints rather than talent engagement. North Dakota's rigorous framework helps address this disparity.

## The Rules in North Dakota

North Dakota law broadly prohibits contracts restricting someone from engaging in a lawful profession, trade, or business. Limited exceptions exist only for business sales or partnership dissolutions.

Even then, restrictions must remain reasonable regarding duration and geographic scope. A five-year limitation within one city for an Italian restaurant sale was upheld as reasonable. However, a 25-mile, one-year restriction on an insurance agent was invalidated.

Non-disclosure and non-solicitation agreements continue protecting proprietary information. General non-competes face strict examination, with policy strongly disfavoring enforcement.

## Implications for Employees

This approach grants North Dakota professionals substantially greater career autonomy. Individual skills and objectives—rather than ex-employer legal barriers—can guide professional trajectories.

Platforms enabling team-based opportunities allow North Dakota professionals to explore fitting possibilities without non-compete obstacles impeding advancement.

## Adapting Strategies for Businesses

Concerned employers can adjust by attracting and retaining talent through engagement rather than legal restrictions.

North Dakota exemplifies an emerging landscape where worker capability remains unrestrained. Innovation flourishes through empowerment and mobility rather than limitations. This benefits ambitious professionals, consumers, and the broader economy.

As worker freedom expands, retention models centered on restrictions require transformation. North Dakota offers insight into a world where talent thrives through creation rather than constraint.`,
  },
  {
    slug: 'oklahoma-bans-non-compete-agreements',
    title: 'Oklahoma Strictly Limits Non-Compete Agreements',
    metaDescription: 'Oklahoma law renders most non-compete agreements unenforceable, giving professionals far greater career autonomy and signaling a future with fewer constraints.',
    featuredImage: '/images/blog/Liftout-Hire-1024x536.jpg',
    category: 'Contracts',
    tags: ['Non-Compete', 'Oklahoma', 'State Laws'],
    author: authors.nick,
    publishDate: '2023-10-17',
    content: `## Non-Competes Constrain Opportunity

Non-compete agreements function as career barriers by preventing professionals from working with competitors or launching similar ventures after employment ends. These restrictive covenants have traditionally allowed employers to control talent mobility through legal mechanisms rather than competitive advantages like culture and growth potential. Oklahoma's legal framework addresses this imbalance by limiting enforceability.

## The Rules in Oklahoma

Oklahoma's approach prohibits enforcing non-compete restrictions that prevent workers from pursuing their field. The sole exception permits employers to prevent former staff from soliciting established clientele.

Business sale contexts maintain partial non-compete enforceability—new owners can restrict former proprietors from competing within reasonable geographic and temporal bounds.

The state permits non-disclosure and non-solicitation agreements designed to shield legitimate business interests including trade secrets. However, sweeping non-compete clauses face strict prohibition.

## Implications for Employees

Workers gain substantial control over professional trajectories. Career advancement depends on competence and ambition rather than contractual constraints imposed by previous employers.

Platforms connecting talent with opportunities—such as Liftout—enable Oklahoma teams to pursue positions aligned with their objectives without non-compete obstacles. Professionals demonstrating commitment and flexibility access expanded career pathways.

## Adapting Strategies for Businesses

Organizations concerned about Oklahoma's restrictions can pivot toward talent retention through engagement and development rather than legal constraints.

The state's direction reflects emerging workforce trends: competitive advantage flows from empowerment and opportunity rather than legal barriers. Companies attracting driven professionals by offering growth will strengthen long-term performance.

As employee freedom expands, outdated retention models dependent on constraints require evolution. Oklahoma demonstrates a trajectory where worker potential operates without encumbrances.`,
  },
  {
    slug: 'minnesota-non-compete-ban-2024-update',
    title: 'Minnesota\'s Non-Compete Ban: What\'s Changed After One Year',
    metaDescription: 'Minnesota banned most non-competes in July 2023 and expanded restrictions in 2024. Here\'s what professionals and employers need to know now.',
    featuredImage: '/images/blog/AdobeStock_303326413-1024x768.jpg',
    category: 'Contracts',
    tags: ['Non-Compete', 'Minnesota', 'Legislation', 'Employee Rights'],
    author: authors.nick,
    publishDate: '2024-11-21',
    modifiedDate: '2024-11-21',
    content: `## Minnesota Made History—And It's Going Further

When Minnesota banned most non-compete agreements on July 1, 2023, it became the first state in over a century to take such sweeping action. The law affected nearly 300,000 workers estimated to have been bound by non-competes.

One year later, Minnesota doubled down. A new law taking effect July 1, 2024, expanded protections even further.

## What the Original 2023 Ban Covered

The Minnesota law prohibits enforcement of non-compete agreements entered into **on or after July 1, 2023**. Key provisions:

- **Broad definition of "employee"**: Covers any individual performing services, including independent contractors
- **Applies to all workers**: No salary threshold—protection extends from entry-level to executive
- **Narrow exceptions**: Only business sales and partnership dissolutions can include non-competes
- **Forum selection limits**: Employers can't force Minnesota workers to litigate in other states
- **Remedies**: Workers can seek injunctive relief and attorney's fees

**Critical caveat**: The law isn't retroactive. If you signed a non-compete before July 1, 2023, it remains enforceable (if reasonable under existing law).

## The 2024 Expansion: Non-Solicitation Provisions Now Targeted

On July 1, 2024, Minnesota went further with MN SF 3852, which bans certain **non-solicitation agreements** between service providers and their clients.

Under the new law, service providers (staffing agencies, consulting firms, IT contractors, etc.) cannot include contract provisions that:
- Prevent clients from soliciting or hiring the service provider's employees
- Restrict clients from directly employing workers who provided services to them

**Why this matters**: Companies often worked around non-compete bans by using non-solicitation clauses that effectively achieved the same result. Minnesota is closing that loophole.

**Exception**: Computer professionals meeting certain criteria may still be subject to limited restrictions.

## What Still Works for Employers

Even with Minnesota's aggressive stance, employers retain tools to protect legitimate business interests:

- **Non-disclosure agreements**: Trade secret and confidential information protections remain enforceable
- **Non-solicitation of customers**: Direct employee-to-customer non-solicitation may still be valid (distinct from the 2024 service provider restriction)
- **Pre-July 2023 agreements**: Existing non-competes remain in force if reasonable
- **During-employment covenants**: Restrictions on moonlighting while employed

## Impact on the Minnesota Labor Market

According to the Federal Reserve Bank of Minneapolis, the ban marks a "historic change for low- and moderate-income workers" who were disproportionately affected by non-competes despite having limited access to trade secrets or specialized knowledge.

Early indicators suggest:
- Increased job mobility in sectors previously heavy on non-competes (healthcare, tech services)
- Employers shifting focus to competitive compensation and culture
- Some employers relocating certain roles to other states (though this creates its own complications)

## Practical Guidance

### For Minnesota Workers

If you started a job after July 1, 2023:
- You cannot be bound by a non-compete (with rare exceptions)
- If your employer tries to enforce one, consult an employment attorney
- You may be entitled to injunctive relief and attorney's fees

If you signed a non-compete before July 1, 2023:
- That agreement may still be enforceable
- Review it for reasonableness—overbroad provisions are challengeable
- Consider negotiating a release when you leave

### For Employers

- Review all employment agreements for compliance
- Update templates to remove prohibited provisions
- Focus on NDAs and trade secret protections instead
- Audit service provider contracts for newly prohibited non-solicitation clauses
- Consider whether competitive compensation is a better retention strategy than legal restrictions

## Minnesota as a Model

Minnesota's approach is being watched nationally. As the federal FTC ban was struck down in 2024, state-level action remains the primary path to non-compete reform.

For workers seeking mobility and companies seeking talent, Minnesota represents a different model: compete on culture, compensation, and opportunity—not legal restrictions.

*Sources: [Federal Reserve Bank of Minneapolis](https://www.minneapolisfed.org/article/2024/minnesotas-ban-on-non-competes-marks-historic-change-for-low--and-moderate-income-workers), [Epstein Becker Green](https://www.tradesecretsandemployeemobility.com/after-banning-noncompetes-last-year-minnesota-strikes-again-prohibiting-non-solicitation-provisions-in-agreements-between-service-providers-and-their-customers), [Lathrop GPM](https://www.lathropgpm.com/insights/beyond-non-competes-new-mn-law-bans-non-solicitation-by-service-providers/)*`,
  },
  {
    slug: 'non-compete-reform-2024-outlook',
    title: 'Non-Compete Reform in 2024: Where We Are and What\'s Next',
    metaDescription: 'After the FTC ban was blocked and state laws expanded, here\'s the current state of non-compete reform and what to expect going forward.',
    featuredImage: '/images/blog/Successful_Team_Liftout-1024x512.jpg',
    category: 'Contracts',
    tags: ['Non-Compete', 'FTC', 'State Laws', 'Employment Law'],
    author: authors.nick,
    publishDate: '2024-11-23',
    modifiedDate: '2024-11-23',
    content: `## The Federal Ban Failed. Now What?

In April 2024, the FTC finalized a rule that would have banned most non-compete agreements nationwide, affecting an estimated 30 million workers. By September, that rule was supposed to free millions of professionals from restrictive contracts.

It didn't happen. A Texas federal court struck down the rule in August 2024, finding the FTC exceeded its authority. The FTC appealed, but most legal experts expect the rule will ultimately fail.

So where does that leave workers and employers?

## The New Reality: It's All State by State

With federal action stalled, non-compete law remains a 50-state puzzle. And that puzzle is getting more complex every year.

**States that have banned or heavily restricted non-competes:**
- California (strongest protections, expanded in 2024)
- Minnesota (banned 2023, expanded 2024)
- North Dakota and Oklahoma (longstanding bans)
- Colorado, Washington, Oregon, Illinois, Maine, Massachusetts (income thresholds and restrictions)
- Washington D.C. (near-complete ban for workers under $150K)

**States where non-competes remain fully enforceable:**
- Florida, Georgia, Texas, and most Southern states
- Many Midwestern states
- States without specific legislation

**States with pending legislation:**
- New York (vetoed 2023, expected to return)
- Pennsylvania, New Jersey (various proposals)

## What's Driving the Reform Movement?

The economic argument against non-competes has only gotten stronger:

**Worker mobility**: Studies consistently show non-competes reduce job switching by 8-11%, suppressing wages and limiting career growth.

**Innovation**: California's tech sector flourished partly because non-competes are unenforceable there. Talent moves freely, ideas spread, and new companies form.

**Wage suppression**: The FTC estimated its rule would have increased wages by $300 billion annually. Even if that number is debatable, the directional impact is clear.

**Disproportionate impact**: Low-wage workers are often bound by non-competes despite having no access to trade secrets. This restricts their mobility without any legitimate business justification.

## The Employer Perspective

Not all opposition to non-compete reform is misguided. Legitimate concerns include:

**Investment protection**: Companies that invest heavily in training want some assurance employees won't immediately leave for competitors.

**Trade secrets**: While NDAs protect confidential information, non-competes provide an additional layer of protection for truly sensitive knowledge.

**Client relationships**: In professional services, client relationships are built over years. Non-solicitation agreements (which typically survive non-compete bans) may not fully protect these investments.

**Competitive dynamics**: In some industries, preventing talent from moving to direct competitors serves genuine business purposes.

## What Smart Companies Are Doing

Forward-thinking employers aren't waiting for laws to force change:

**Focusing on retention, not restriction**: Competitive compensation, career development, and positive culture retain talent better than legal threats.

**Using narrower restrictions**: Targeted NDAs and reasonable non-solicitation agreements often provide adequate protection without the backlash of broad non-competes.

**Geographic flexibility**: Relocating employees to non-compete ban states when those workers need mobility.

**Transparent policies**: Clearly communicating what restrictions exist and why, rather than burying them in onboarding paperwork.

## What Workers Should Do Now

If you're bound by or considering signing a non-compete:

1. **Know your state's law**—protection varies dramatically by jurisdiction
2. **Read before signing**—many non-competes are negotiable
3. **Question unreasonable terms**—courts increasingly reject overbroad restrictions
4. **Keep copies**—document all employment agreements
5. **Consult an attorney**—especially before making career moves
6. **Consider geography**—relocating to a ban state may provide an exit

## Looking Ahead

The FTC's loss doesn't end the debate. Several factors will shape the future:

**State momentum**: More states are likely to restrict non-competes, especially for low and mid-wage workers.

**Court evolution**: Judges are increasingly skeptical of overreaching agreements, even in states that enforce non-competes.

**Corporate policy**: Some major employers have voluntarily abandoned non-competes to attract talent.

**Political pressure**: Non-compete reform has bipartisan appeal—a rare area where progressive labor advocates and free-market conservatives often agree.

## The Bottom Line

The fight for worker mobility isn't over. The battlefield has simply shifted from federal rulemaking to state legislatures, courtrooms, and corporate policy.

For workers, this means staying informed about your specific state's protections. For employers, this means preparing for a future where restrictive covenants face increasing scrutiny.

The direction is clear, even if the timeline isn't. Non-competes as we know them are on borrowed time.`,
  },
  {
    slug: 'ftc-non-compete-ban',
    title: 'FTC Non-Compete Ban Blocked: What It Means for Workers',
    metaDescription: 'The FTC\'s nationwide non-compete ban was struck down by a Texas federal court in August 2024. Here\'s what happened and what it means for your career mobility.',
    featuredImage: '/images/blog/People-Liftout-Hire-together-1024x471.jpg',
    category: 'Contracts',
    tags: ['Non-Compete', 'FTC', 'Federal Ban', 'Regulation'],
    author: authors.nick,
    publishDate: '2024-11-15',
    modifiedDate: '2024-11-15',
    content: `## The FTC's Bold Move—and Its Defeat

In April 2024, the Federal Trade Commission finalized a rule that would have banned most non-compete clauses nationwide. The rule was set to take effect on September 4, 2024, and would have freed an estimated 30 million American workers from these restrictive agreements.

But on August 20, 2024, U.S. District Judge Ada Brown in Texas struck down the rule entirely, setting it aside on a nationwide basis. The court found that the FTC exceeded its statutory authority and that the rule was "arbitrary and capricious."

## What the Court Said

Judge Brown's ruling centered on two key findings:

- **Lack of Authority**: The court concluded that while the FTC has "some authority" to promulgate rules about unfair competition, Section 6(g) of the FTC Act is merely a "housekeeping statute" that doesn't grant substantive rulemaking power of this magnitude.

- **Arbitrary and Capricious**: The court found the FTC's "one-size-fits-all approach with no end date" failed to establish a rational connection between the evidence and the sweeping prohibition. Rather than targeting specific harmful non-competes, the FTC chose a blanket ban without adequate justification.

## The FTC's Appeal

On October 18, 2024, the FTC filed a notice of appeal to the Fifth Circuit Court of Appeals. However, most legal experts believe the rule will ultimately fail—the Fifth Circuit is generally viewed as unfavorable to expansive agency authority, and the Supreme Court's recent decisions have trended toward limiting federal agency power.

## What This Means for Workers

The practical implications are clear: **non-compete agreements remain enforceable** in most states, and there's no imminent federal rescue coming.

For professionals currently bound by non-competes, your options remain:

1. **Review your agreement carefully**—many non-competes contain unenforceable provisions
2. **Know your state's laws**—California, Minnesota, North Dakota, and Oklahoma effectively ban most non-competes
3. **Negotiate before signing**—shorter duration, narrower scope, or geographic limitations
4. **Consult an employment attorney**—particularly if you're considering a move to a competitor

## The State-Level Momentum Continues

While the federal ban failed, state-level reform continues gaining steam. California strengthened its ban in 2024 with new laws taking effect January 1st. More states are introducing legislation to limit non-competes, particularly for lower-wage workers.

## The Bigger Picture

This ruling underscores an important reality: meaningful change in employment law often happens state by state, not through sweeping federal action. Workers seeking mobility should focus on:

- Understanding their specific state's protections
- Building relationships and skills that transcend any single employer
- Considering team-based career moves that provide leverage and support

The fight for worker mobility isn't over—it's just being fought on different battlefields.

*Sources: [Holland & Knight](https://www.hklaw.com/en/insights/publications/2024/08/district-court-in-texas-sets-aside-ftc-non-compete-rule), [Morrison Foerster](https://www.mofo.com/resources/insights/241022-ftc-appeals-texas-court-s-ruling), [Foley & Lardner](https://www.foley.com/insights/publications/2024/08/federal-judge-in-texas-blocks-ftcs-noncompete-rule/)*`,
  },
  {
    slug: 'california-non-compete-laws-2024',
    title: 'California\'s 2024 Non-Compete Laws: What Changed and What You Need to Know',
    metaDescription: 'California\'s AB 1076 and SB 699 took effect January 1, 2024, dramatically expanding non-compete protections. Here\'s what employees and employers need to know.',
    featuredImage: '/images/blog/Liftout_Hire_Team-1024x536.jpg',
    category: 'Contracts',
    tags: ['Non-Compete', 'California', 'SB 699', 'AB 1076', 'Employee Rights'],
    author: authors.nick,
    publishDate: '2024-11-20',
    modifiedDate: '2024-11-20',
    content: `## California Just Made the Strongest Move Yet Against Non-Competes

While other states debate whether to restrict non-compete agreements, California went further in 2024. Two new laws—Assembly Bill 1076 and Senate Bill 699—took effect on January 1, 2024, making California's non-compete prohibition the most aggressive in the nation.

Here's what changed and why it matters.

## What AB 1076 Does

AB 1076 codifies the *Edwards v. Arthur Andersen LLP* decision, which held that **any non-compete agreement is void in California**, no matter how narrowly tailored—unless it falls within very limited exceptions.

But the law goes further than simply restating existing case law:

- **Makes non-competes not just void, but unlawful**—creating exposure for employers who try to enforce them
- **Requires employers to notify employees** of void non-compete clauses
- **Creates civil penalties** of up to $2,500 per violation for failure to comply

### The February 2024 Notice Deadline

If you're an employer with California employees who signed non-competes after January 1, 2022, you were required to send written notice by **February 14, 2024** informing them their non-compete is void.

This notice had to be:
- Individualized (not a mass email)
- Sent to the employee's last known address AND email
- Clear about which clause is void

Many employers missed this deadline—creating potential liability.

## What SB 699 Does

SB 699 is even more aggressive. It makes void non-competes unenforceable **regardless of where or when the contract was signed**.

This is huge. It means:

- An employee who signed a non-compete in Texas can move to California and invoke California law to avoid enforcement
- Out-of-state employers cannot use choice-of-law provisions to get around California's prohibition
- California courts won't enforce out-of-state non-competes against California workers

### New Enforcement Rights for Employees

SB 699 gives employees powerful new remedies:
- **Private right of action** to sue employers who include unenforceable non-competes
- **Injunctive relief** to stop employers from enforcing void agreements
- **Actual damages** for harm caused by the non-compete
- **Attorney's fees** for successful lawsuits

This shifts the dynamic significantly. Before, employees had to wait for employers to sue them. Now they can go on offense.

## What's Still Enforceable in California

The only non-competes that survive in California:

1. **Sale of business**: When selling a business, the seller can agree not to compete within a defined geographic area and time
2. **Partnership dissolution**: Partners can agree to non-competes when dissolving a partnership or LLC

That's it. Every other non-compete is void.

**Still enforceable** (because they're not technically non-competes):
- **Non-disclosure agreements** protecting trade secrets
- **Non-solicitation of customers** (though these face increasing scrutiny)
- **In-term covenants** restricting moonlighting during employment

## What This Means for You

### If You're a California Employee

You're protected. If your employer is trying to enforce a non-compete against you:
1. Point them to Section 16600 of the Business and Professions Code
2. Remind them that enforcement is now unlawful, not just unenforceable
3. Consider consulting an employment attorney about your options under SB 699

### If You're Moving to California

Even if you signed a non-compete elsewhere, California won't enforce it while you work in the state. This makes California an attractive destination for talent bound by restrictive agreements elsewhere.

### If You're an Employer

Review all existing employment agreements with California employees. If they contain non-competes:
- Send the required notice immediately if you haven't already
- Remove non-compete provisions from future agreements
- Consider whether non-solicitation and NDA provisions provide adequate protection
- Train hiring managers to avoid verbal representations about non-competes

## The National Significance

California's aggressive stance matters beyond state lines. As the FTC's federal ban was struck down in Texas, California is showing that states can effectively eliminate non-competes on their own.

Other states are watching. And for mobile professionals, California just became an even more attractive destination.

*Sources: [Fisher Phillips](https://www.fisherphillips.com/en/news-insights/employers-need-to-know-new-noncompete-laws-california.html), [Wilson Sonsini](https://www.wsgr.com/en/insights/california-extends-prohibition-on-noncompete-agreements.html), [National Law Review](https://natlawreview.com/article/why-you-may-have-comply-californias-new-noncompete-laws-february-14-deadline)*`,
  },
  {
    slug: 'how-to-ethically-resign-as-a-team',
    title: 'How to Resign as a Team: A Step-by-Step Guide to Ethical Liftouts',
    metaDescription: 'Leaving together requires planning and professionalism. Here\'s how teams can make a collective move while maintaining integrity and minimizing disruption.',
    featuredImage: '/images/blog/Successful_Team_Liftout-1024x512.jpg',
    category: 'Liftouts',
    tags: ['Liftout', 'Resignation', 'Team Transition', 'Career', 'Ethics'],
    author: authors.nick,
    publishDate: '2024-11-28',
    modifiedDate: '2024-11-28',
    content: `## The Question Every Team Eventually Faces

You've built something special with your colleagues. Real trust. Genuine collaboration. The kind of working relationships that take years to develop.

But your current situation isn't working anymore—maybe it's compensation, leadership, growth opportunities, or company direction. And you're not the only one feeling it.

The question becomes: do you go your separate ways, or do you move together?

Moving together is increasingly common—and increasingly accepted. But doing it ethically requires planning, communication, and professionalism.

Here's how to make a team transition the right way.

## Step 1: Have Honest Conversations (Privately)

Before anything else, talk candidly with your potential co-movers:

**Clarify motivations**
- Why does each person want to leave?
- Are the concerns fixable at your current company?
- Is everyone genuinely ready to move, or are some people just venting?

**Assess alignment**
- Do you want the same things from a new opportunity?
- Are salary expectations compatible?
- Does everyone have the same timeline?

**Evaluate commitment**
- Will everyone follow through if offers come?
- What happens if one person gets a better individual offer?
- How do you handle a partial move if not everyone receives offers?

These conversations need to happen in person, off company property, outside work hours. Don't use company email or Slack.

## Step 2: Consider Your Current Employer's Perspective

Ethical team departures acknowledge the impact on the organization you're leaving:

**Timing matters**
- Are you in the middle of a critical project?
- Has the company just invested heavily in your team?
- Is there a particularly difficult moment you should avoid (earnings, major launches, restructuring)?

**Minimize disruption where possible**
- Can you time departures to allow knowledge transfer?
- Are you willing to help recruit or train replacements?
- Can you stagger departures if that reduces impact?

You don't owe your employer indefinite loyalty. But burning bridges unnecessarily helps no one—and your professional reputation follows you.

## Step 3: Explore Opportunities Strategically

**Start quietly**
- Begin exploring opportunities 2-3 months before you'd ideally move
- Use personal networks and platforms designed for confidential job searches
- Be clear with potential employers that you're exploring as a team

**Present your collective value**
- What do you accomplish together that you couldn't alone?
- What problems can you solve for a new employer?
- What's your track record as a unit?

**Negotiate as a package**
- Understand each person's minimum requirements
- Be prepared to walk away if the offer doesn't work for everyone
- Clarify reporting structures and working arrangements upfront

## Step 4: Get Offers in Writing Before Resigning

This is critical: **never resign until you have confirmed offers for everyone who's moving**.

Things that can go wrong:
- Verbal commitments that evaporate
- Offers that come through for some but not all team members
- Terms that change between verbal agreement and written offer
- Background check or reference issues

Once you have written offers accepted by everyone:
- Coordinate resignation timing
- Plan to give appropriate notice (typically 2-4 weeks depending on seniority)
- Prepare transition documentation

## Step 5: Resign Individually, Professionally

When the time comes, each person should:

**Resign separately**
- Don't announce together or resign in the same meeting
- Each person should speak privately with their direct manager
- Avoid appearing coordinated (even though you are)

**Keep it professional**
- Express genuine gratitude for opportunities and growth
- Focus on moving toward something, not away from problems
- Don't mention that others are leaving—let them have their own conversations

**Commit to strong finishes**
- Offer to help with transitions
- Document processes and knowledge
- Complete ongoing work where possible
- Train replacements if time allows

**Sample language**: *"I've accepted an opportunity that aligns with my career goals. I want to thank you for [specific positives]. I'm committed to making this transition as smooth as possible over the next [notice period]."*

## Step 6: Handle the Aftermath Gracefully

When word gets around that multiple people are leaving:

**If asked directly about coordination**
- Don't lie, but don't over-explain either
- Something like: "We've worked well together and were exploring similar opportunities" is honest without being dramatic

**Maintain relationships**
- Your former employer may be a future client, partner, or reference
- Former colleagues may join you someday
- Industry relationships matter

**Focus forward**
- Once you've resigned, pour your energy into finishing strong and preparing for what's next
- Don't engage in retrospective criticism

## Common Pitfalls to Avoid

**❌ Using company resources to plan your departure**
Company email, Slack, and equipment are monitored. Keep all departure planning on personal devices and accounts.

**❌ Bad-mouthing your current employer**
To potential employers, to each other, or especially online. It reflects poorly on you and accomplishes nothing.

**❌ Revealing who else is leaving**
Let each person control their own narrative and timing.

**❌ Poaching aggressively**
Be careful about recruiting colleagues who aren't already part of the moving group—this can create legal and ethical complications.

**❌ Violating non-competes or NDAs**
Understand your contractual obligations. Seek legal advice if you're uncertain.

## The Ethical Foundation

Moving as a team isn't inherently disloyal or unethical. Employers regularly lay off entire teams when it serves business interests. They restructure, merge, and eliminate positions without considering team chemistry.

What employees owe employers is:
- Honest work for honest pay while employed
- Appropriate notice when departing
- Reasonable transition support
- Confidentiality of genuinely proprietary information

What employees don't owe:
- Indefinite loyalty regardless of circumstances
- Sacrificing career growth for employer convenience
- Breaking up valuable working relationships

## The Bottom Line

Team moves happen because the modern workplace doesn't reward loyalty the way it once did—and because talented teams are worth more together than apart.

Done ethically, a team liftout can be a win for everyone:
- Your team advances together, preserving valuable relationships
- Your new employer gets proven chemistry and immediate productivity
- Your former employer gets professional transitions and (often) some advance warning to plan

The key is professionalism at every step. How you leave shapes your reputation as much as how you perform.

*Leave the way you'd want someone to leave from your company.*`,
  },
  {
    slug: 'employment-contracts-2024-guide',
    title: 'Employment Contracts in 2024: What You Must Know Before Signing',
    metaDescription: 'The rules around non-competes, NDAs, and restrictive covenants changed dramatically in 2024. Here\'s what professionals need to know before signing any employment agreement.',
    featuredImage: '/images/blog/Non-Compete-Agreements-1024x778.jpg',
    category: 'Contracts',
    tags: ['Employment Contract', 'NDA', 'Non-Compete', 'Legal', '2024 Guide'],
    author: authors.nick,
    publishDate: '2024-11-26',
    modifiedDate: '2024-11-26',
    content: `## The Employment Contract Landscape Has Shifted

If you're signing an employment contract in 2024, you need to know: the rules have changed significantly. State laws around non-competes expanded throughout 2023 and 2024. The FTC tried (and failed) to ban non-competes federally. New notice requirements kicked in.

Whether you're joining a company, negotiating a raise, or considering a move, here's what you need to understand.

## Non-Compete Agreements: Know Your State

Non-competes restrict you from working for competitors or starting competing businesses after you leave. But enforceability varies dramatically by state:

**States that ban or severely limit non-competes:**
- California, Minnesota, North Dakota, Oklahoma (near-total bans)
- Colorado, Washington, Oregon, Illinois (income thresholds)
- Massachusetts (requires "garden leave" pay)
- Washington D.C. (banned for most workers under $150K)

**States that still generally enforce them:**
- Florida, Georgia, Texas, and most Southern states
- Most states without specific legislation

**Key 2024 changes:**
- California now requires employers to notify employees of void non-competes (deadline was February 2024)
- California won't enforce out-of-state non-competes against California workers
- Minnesota expanded restrictions to cover certain service provider contracts

**What to do:** Before signing, research your state's specific rules. If you're in a ban state, don't let an employer intimidate you with unenforceable provisions.

## Non-Disclosure Agreements: Legitimate but Limited

NDAs prevent you from sharing confidential business information. Unlike non-competes, they're generally enforceable everywhere—but with important limits.

**What NDAs can legitimately protect:**
- Trade secrets and proprietary information
- Client lists and business strategies
- Product development details
- Financial information

**What NDAs generally cannot do:**
- Prevent you from reporting illegal activity to regulators (whistleblower protections)
- Stop you from discussing wages with coworkers (NLRA rights)
- Silence you about workplace harassment or discrimination (many states have limited these)
- Cover information that's publicly available or that you knew before employment

**Red flags to watch:**
- Overly broad definitions of "confidential information" (everything you ever learn)
- Unlimited duration (should be reasonable based on information type)
- No carve-outs for legally protected disclosures
- Excessive penalties for breach

## Non-Solicitation Agreements: The Middle Ground

Non-solicitation clauses typically restrict two things:
1. **Customer non-solicitation**: Can't actively pursue the company's clients
2. **Employee non-solicitation**: Can't recruit former colleagues

These are generally more enforceable than non-competes because they're narrower. But enforcement still varies:

- Some states (like California) are increasingly skeptical of customer non-solicitation
- Minnesota's 2024 law bans certain non-solicitation provisions in service contracts
- Courts look at whether restrictions are reasonable in scope and duration

**Negotiating tip:** If you're asked to sign a non-compete, propose non-solicitation instead. It protects the employer's legitimate interests without blocking your entire career path.

## Critical Clauses to Watch

### Choice of Law / Forum Selection
These determine which state's law applies and where disputes are litigated. An employer might try to specify that Texas law applies even if you work in California—though California's 2024 laws specifically prevent this for non-compete purposes.

### Severability
If one provision is invalid, the rest of the contract survives. This is standard but watch for "blue pencil" provisions that let courts rewrite overbroad restrictions.

### Integration / Merger Clause
Says the written contract is the entire agreement—verbal promises don't count. Get everything important in writing.

### Assignment
Can the employer transfer your contract to another company (like in an acquisition)? This matters if your deal was based on working for specific people.

### Termination Provisions
What happens when employment ends? Notice periods, post-termination obligations, return of equipment—all should be clear.

### Intellectual Property Assignment
Who owns what you create? Standard in tech, but watch for overreach into personal projects or work done outside company time.

## Your 2024 Negotiation Checklist

**Before you sign:**

1. **Research your state's laws**—know what's enforceable
2. **Ask for time to review**—rushing is a red flag
3. **Request clarification**—if something's unclear, get it in writing
4. **Negotiate what matters**—non-competes, geographic scope, duration
5. **Keep copies of everything**—including versions exchanged before signing
6. **Consider legal review**—especially for senior roles or restrictive terms

**During negotiation:**

- Don't assume everything is non-negotiable—it often isn't
- Focus on the most restrictive provisions first
- Propose alternatives that address employer concerns with less restriction
- Document any verbal commitments in writing

**When leaving:**

- Review your agreements before job searching
- Understand what you're bound by
- Consider negotiating a release from restrictive provisions
- Keep confidential information confidential (that's usually legitimate)

## The Bottom Line

Employment contracts are more negotiable and less enforceable than many employers suggest. The 2024 legal landscape heavily favors workers in many states.

Know your rights. Negotiate what matters. And don't let fear of unenforceable provisions hold you back from career opportunities.

*Disclaimer: This is educational content, not legal advice. Consult an employment attorney for guidance specific to your situation.*`,
  },
  {
    slug: 'team-moves-non-compete-guide',
    title: 'Making Team Moves When Non-Competes Are Involved',
    metaDescription: 'How teams can navigate non-compete and non-solicitation agreements when moving together. Practical strategies and 2024 legal landscape updates.',
    featuredImage: '/images/blog/Non-Compete-Fines-1024x684.jpg',
    category: 'Liftouts',
    tags: ['Non-Compete', 'Non-Solicitation', 'Career Strategy', 'Team Moves'],
    author: authors.nick,
    publishDate: '2024-11-28',
    modifiedDate: '2024-11-28',
    content: `## The Challenge: You Want to Move Together, But There Are Contracts

Your team has decided to explore new opportunities together. Great. But then someone checks their employment agreement and finds a non-compete. Or a non-solicitation clause. Or both.

Does that kill the plan?

Not necessarily. Here's how to navigate these restrictions in 2024.

## Step 1: Understand What You Actually Signed

Before panicking, actually read your agreements:

**Non-compete clauses** typically restrict:
- Working for direct competitors
- Starting competing businesses
- Usually for a specific duration (6 months to 2 years)
- Often in a specific geographic area

**Non-solicitation clauses** typically restrict:
- Actively recruiting former colleagues to join you
- Pursuing former clients or customers
- Usually narrower than non-competes

**Non-disclosure agreements** restrict:
- Sharing confidential business information
- Using trade secrets at a new employer

These are different things with different implications. Know what you're dealing with.

## Step 2: Know Your State's Rules (2024 Update)

Non-compete law varies dramatically by state—and the landscape shifted significantly in 2023-2024:

**States where non-competes are essentially banned:**
- **California**: Void and now unlawful to enforce. Won't even honor out-of-state non-competes.
- **Minnesota**: Banned for agreements after July 2023
- **North Dakota**: Longstanding ban
- **Oklahoma**: Most non-competes unenforceable

**States with significant restrictions:**
- **Colorado, Washington, Oregon, Illinois**: Income thresholds protect lower-earning workers
- **Massachusetts**: Requires "garden leave" pay
- **Washington D.C.**: Banned for workers under $150K

**States that generally enforce them:**
- Florida, Georgia, Texas, and most Southern states
- But even here, courts scrutinize reasonableness

**The FTC situation**: The federal non-compete ban was struck down by a Texas court in August 2024. So there's no federal rescue coming—state law is what matters.

## Step 3: Assess Actual Risk

Even in states that enforce non-competes, not all agreements are enforceable:

**Factors that weaken non-competes:**
- Overly broad geographic scope (entire country? industry?)
- Excessive duration (3+ years is often unreasonable)
- Applied to workers without access to trade secrets
- No legitimate business interest being protected
- Signed without adequate consideration (did you get something for signing?)

**Questions to ask:**
- Would your former employer actually sue?
- Do they have a track record of enforcement?
- What would they actually be protecting?
- Is the restriction reasonable given your role?

Many employers use aggressive non-competes as deterrents but never actually enforce them. That doesn't mean you should ignore them—but it's context.

## Step 4: Strategies for Teams

### Option 1: Move to a Ban State
If your team can work remotely and you're in a restrictive state, relocating to California, Minnesota, or another ban state may void your non-competes. California specifically won't enforce out-of-state non-competes against California workers.

### Option 2: Negotiate a Release
When you leave, ask for a release from your non-compete. Employers often agree, especially if:
- You're leaving on good terms
- You offer extended notice or transition support
- The departure is amicable
- They know the agreement might not hold up anyway

### Option 3: Wait It Out
If the non-compete has a 6-12 month duration, the team might choose to wait. Some employers will hire you during the restricted period with a delayed start date; others will pay a "garden leave" salary while you wait.

### Option 4: Challenge Enforceability
With legal counsel, assess whether your non-compete is actually enforceable. Many aren't. This is especially worth exploring if:
- You're in a state with recent reform
- The terms are unreasonable
- You didn't have access to trade secrets
- You were terminated without cause

### Option 5: Work Around the Scope
If your non-compete prohibits working for "direct competitors in the financial services industry," maybe the opportunity you're pursuing is adjacent enough to not trigger it. Carefully analyze the actual language.

## Step 5: Handle Non-Solicitation Carefully

Non-solicitation is different from non-compete, and violations can be clearer:

**DO NOT:**
- Recruit colleagues who aren't already part of your moving group
- Contact former clients saying "come work with us at our new company"
- Use customer lists from your former employer
- Coordinate recruiting before you've resigned

**YOU CAN USUALLY:**
- Respond if former colleagues reach out to you
- Accept clients who independently seek you out
- Maintain personal relationships with former co-workers
- Build your network at the new company

The distinction between "soliciting" and "responding" matters legally.

## Step 6: Protect Yourself

**Document everything:**
- Keep copies of all employment agreements
- Note any verbal representations made during hiring
- Save communications about the non-compete

**Get legal advice:**
- Employment attorneys can assess your specific situation
- Cost of a consultation is much less than cost of litigation
- Some attorneys specialize in non-compete issues

**Communicate with your new employer:**
- Be transparent about your restrictions
- Many companies have experience helping employees navigate this
- They may indemnify you or adjust your role/timing

## The Bottom Line for Teams

Non-competes and non-solicitations add complexity to team moves, but they rarely make them impossible. The 2024 legal landscape is more favorable to workers than ever, and many agreements are unenforceable even in states that allow them.

The key is:
1. Know what you actually signed
2. Understand your state's current law
3. Assess the realistic enforcement risk
4. Choose the right strategy for your situation
5. Get professional advice when needed

Don't let fear of contractual language stop you from exploring opportunities. But don't be reckless either.

*Disclaimer: This is educational content, not legal advice. Consult an employment attorney for guidance specific to your situation.*`,
  },
  {
    slug: 'team-hiring-2024-complete-guide',
    title: 'Team Hiring in 2024: Why More Companies Are Acquiring Intact Teams',
    metaDescription: 'With time-to-fill averaging 41 days and quality of hire the top metric, team hiring offers a faster path to productivity. Here\'s what you need to know.',
    featuredImage: '/images/blog/People-Liftout-Hire-together-1024x471.jpg',
    category: 'Liftouts',
    tags: ['Hiring Teams', 'Team Building', 'Liftout', 'Talent Acquisition'],
    author: authors.nick,
    publishDate: '2024-11-27',
    modifiedDate: '2024-11-27',
    content: `## The Traditional Hiring Model Is Breaking Down

Here's the reality of individual hiring in 2024:

- **Average time to fill: 41 days** per role (Employ 2024 Recruiter Nation Report)
- **37% of recruiters** cite competition from other employers as their biggest challenge
- **Quality of hire** is now the #1 metric companies track—because bad hires are expensive
- Even after hiring, teams take **6-12 months** to reach full productivity as people learn to work together

What if you could skip most of that?

## Enter Team Hiring

Team hiring—sometimes called a "liftout"—means acquiring an **intact, high-performing team** rather than building one person by person.

Instead of:
1. Hire engineer #1 → wait 41 days → onboard → hope they work out
2. Hire engineer #2 → wait 41 days → onboard → hope they gel with #1
3. Repeat until you have a team → wait 6+ months for them to gel

You do:
1. Identify a proven team that already works together
2. Hire them as a unit
3. They're productive almost immediately

It's not a new concept—professional services firms have done this for decades. What's new is that technology and changing workforce dynamics are making it accessible to more companies.

## Why Team Hiring Works

### 1. Proven Chemistry
The hardest thing about building teams isn't finding skilled individuals—it's getting those individuals to work effectively together. Team hiring eliminates this variable. You're not betting on chemistry; you're acquiring it.

### 2. Immediate Productivity
A team that's already collaborated for years doesn't need months to figure out communication patterns, decision-making processes, and conflict resolution. They can start producing from day one.

### 3. Reduced Risk
Individual hiring is inherently uncertain. Cultural fit, skills claims, and interview performance don't always predict on-the-job success. With team hiring, you can evaluate **actual results**—what the team has accomplished together.

### 4. Competitive Advantage
While competitors spend months building teams, you can deploy fully functional units immediately. In fast-moving markets, this speed advantage compounds.

### 5. Lower Total Cost
Yes, acquiring a team requires upfront investment. But consider the full cost of individual hiring: recruiter fees, time-to-fill delays, onboarding expenses, and the hidden cost of slow team formation. Team hiring often wins on total cost.

## When Team Hiring Makes Sense

Team hiring isn't always the answer. It works best when:

**✓ You need to move fast**
Market opportunities don't wait. If you need capabilities in weeks, not months, team hiring delivers.

**✓ The domain is specialized**
Finding one expert is hard. Finding five who work well together? Exponentially harder. Acquiring intact specialized teams solves this.

**✓ Execution matters more than integration**
If you need a team to operate somewhat autonomously—a new product line, a geographic expansion, a specialized function—team hiring provides that.

**✓ You value proven performance**
Resumes show potential. Team track records show reality.

## Potential Challenges

Team hiring isn't without complications:

**Budget concentration**: Acquiring a team requires investing in multiple hires simultaneously. This requires budget commitment and confidence.

**Cultural integration**: A cohesive team may have its own culture that doesn't perfectly align with yours. This can be a strength (fresh perspective) or friction point.

**All-or-nothing dynamics**: If one team member doesn't work out, it can affect the others. Clear expectations upfront help.

**Existing employee concerns**: Your current staff may wonder about their place. Communication and inclusion matter.

## Making Team Hiring Work

For companies considering team hiring:

1. **Define what you need**—capabilities, timeline, and autonomy level
2. **Evaluate teams on results**—what have they actually accomplished together?
3. **Assess cultural fit carefully**—shared values matter more than identical personalities
4. **Plan integration**—even a self-sufficient team needs connection to your broader organization
5. **Set clear expectations**—for both the incoming team and existing employees

For teams considering a collective move:

1. **Articulate your value**—what do you achieve together that you couldn't alone?
2. **Demonstrate chemistry**—show, don't just tell
3. **Align on goals**—make sure everyone wants the same things from a move
4. **Present as a unit**—while maintaining individual professional identities

## The 2024 Talent Landscape

According to Lighthouse Research's 2024 Talent Acquisition Trends study (1,234 global employers surveyed), top-performing recruitment teams—those hitting 75%+ of their hiring goals—are 40% more likely to invest in upgrading their hiring approaches.

Team hiring represents one of the most significant upgrades available. It's not about being faster at the same game; it's about changing the game entirely.

## The Bottom Line

In a market where competition for talent remains fierce and quality of hire is the top priority, team hiring offers something traditional recruiting can't: **certainty**.

You're not hoping people will work well together. You're hiring people who already do.

*Ready to explore team hiring? Liftout connects companies seeking proven teams with high-performing teams ready for new opportunities.*`,
  },
  {
    slug: 'what-is-a-liftout',
    title: 'What Is a Liftout? The Complete Guide to Team Acquisitions',
    metaDescription: 'A liftout is the strategic acquisition of an intact, high-performing team from another organization. Here\'s everything you need to know about this powerful talent strategy.',
    featuredImage: '/images/blog/Liftout-Hire-1024x536.jpg',
    category: 'Liftouts',
    tags: ['Liftout', 'Team Hiring', 'Recruitment', 'Talent Acquisition'],
    author: authors.nick,
    publishDate: '2024-11-28',
    modifiedDate: '2024-11-28',
    content: `## What Is a Liftout?

A **liftout** is the strategic acquisition of an intact, high-performing team from another organization—typically a competitor or company in an adjacent space.

Unlike traditional hiring (one person at a time) or corporate acquisitions (buying entire companies), a liftout targets a specific team: the people who work together, trust each other, and produce results as a unit.

Think of it as acquiring a capability, not just filling positions.

## A Brief History

Liftouts aren't new. The term originated in professional services—law firms, investment banks, and consulting firms have been lifting out teams for decades. When a managing partner moves from one law firm to another, they often bring associates, partners, and support staff with them. The same pattern plays out in investment banking, accounting, and management consulting.

What's changed is that liftouts are now spreading beyond professional services into technology, healthcare, finance, and virtually every industry where specialized teams create disproportionate value.

## Why Liftouts Are Accelerating

Several forces are making liftouts more common:

**Talent scarcity**
Finding skilled individuals is hard. Finding skilled individuals who work well together is exponentially harder. Liftouts bypass the team-building challenge entirely.

**Speed requirements**
Markets move fast. Building a team from scratch takes months of hiring plus months of team formation. Liftouts compress this dramatically.

**Reduced M&A appetite**
After the 2022-2023 market correction, many companies became cautious about full acquisitions. Liftouts offer a lighter-weight alternative to acquire capabilities without buying companies.

**Remote work enabling mobility**
Geographic constraints matter less. A team in Austin can move to a San Francisco company without relocating if both operate remotely.

**Non-compete reform**
As more states restrict non-competes, teams have greater legal freedom to move together.

## What Makes a Successful Liftout

Not every group of colleagues is a liftout candidate. Successful liftouts typically share certain characteristics:

**For the team:**
- Strong working relationships built over years
- Complementary skills that create value together
- Track record of results as a unit
- Shared values and professional goals
- Aligned motivations for moving

**For the opportunity:**
- Clear strategic rationale (capability gap, market expansion, etc.)
- Competitive compensation and growth opportunity
- Organizational support for the incoming team
- Reasonable autonomy to continue working effectively
- Cultural compatibility (or at least tolerance for differences)

## The Anatomy of a Liftout

### Stage 1: Identification
Either the team initiates (looking for new opportunities) or the company initiates (targeting a specific capability). Initial conversations happen discreetly.

### Stage 2: Exploration
Both sides assess fit. The team evaluates the opportunity, culture, and terms. The company evaluates the team's capabilities, chemistry, and alignment with strategic needs.

### Stage 3: Negotiation
Terms are structured for the team as a unit—though individual offers are typically made to each team member. Key discussions include compensation, reporting structure, autonomy, and success metrics.

### Stage 4: Commitment
Written offers extended and accepted. Critical: **everyone should have confirmed offers before anyone resigns**.

### Stage 5: Transition
Coordinated resignations (handled professionally and individually), followed by onboarding at the new organization. Good liftouts include transition support for the departing organization.

### Stage 6: Integration
The team begins work at the new company. Early wins matter—demonstrating value quickly builds organizational confidence.

## Benefits for Companies

**Speed**
Deploy functional capabilities in weeks, not the 12-18 months required to build from scratch.

**Reduced risk**
You're not betting on whether individuals will work together. You're acquiring proven chemistry.

**Strategic impact**
Liftouts can accelerate market entry, build new capabilities, and sometimes weaken competitors.

**Better economics**
While individual compensation may be competitive, total cost often beats the alternative of failed hires, slow team formation, and extended time-to-productivity.

**Knowledge transfer**
Teams bring not just skills but institutional knowledge, client relationships, and industry expertise.

## Benefits for Teams

**Collective mobility**
Preserve relationships that took years to build. Don't sacrifice team chemistry for career advancement.

**Negotiating power**
Teams have more leverage than individuals. A company that needs your capabilities needs all of you.

**Reduced transition risk**
Starting a new job alone is scary. Starting with trusted colleagues provides a built-in support network.

**Career acceleration**
Liftouts often come with increased responsibility, compensation, and opportunity.

**Cultural continuity**
Your working norms travel with you. You don't have to learn entirely new ways of operating.

## Challenges and Considerations

**For companies:**
- Budget concentration (multiple hires at once)
- Cultural integration (the team has its own culture)
- Existing employee concerns (will I be overshadowed?)
- Legal complexity (non-competes, non-solicitation)
- Integration planning (how does this team connect to the broader organization?)

**For teams:**
- All-or-nothing dynamics (what if not everyone gets offers?)
- Coordination complexity (aligning multiple people's timelines and requirements)
- Professional reputation (will you be seen as "job-hopping"?)
- Counteroffers (your current employer may try to retain you)
- Legal obligations (non-competes, NDA compliance)

## Industries Where Liftouts Are Common

**Professional services**: Law, investment banking, consulting, accounting—the original liftout domains

**Technology**: Engineering teams, product teams, AI/ML specialists

**Healthcare**: Medical practices, research teams, specialized clinical groups

**Financial services**: Trading desks, portfolio management teams, fintech specialists

**Advertising/Marketing**: Creative teams, account teams, specialized practices

**Real estate**: Brokerage teams, development groups

## How Liftout Helps

Finding the right match—between teams seeking opportunities and companies seeking capabilities—isn't easy. That's where Liftout comes in.

**For teams**: Confidentially explore opportunities without risking your current position. Present your collective value to companies that are actually looking for what you offer.

**For companies**: Access pre-vetted teams with proven chemistry and relevant capabilities. Reduce the search time and uncertainty of traditional recruiting.

**For both**: A structured process that respects confidentiality, facilitates evaluation, and enables successful transitions.

## The Future of Talent Acquisition

Individual hiring will always have its place. But for specialized capabilities, strategic initiatives, and situations where speed matters, liftouts offer something traditional recruiting can't match.

You're not assembling a team. You're acquiring one.

*Interested in exploring liftout opportunities—as a team or as a company? Visit Liftout.com to learn more.*`,
  },
  {
    slug: 'liftout-process-guide',
    title: 'The Liftout Process: A Step-by-Step Guide for Companies and Teams',
    metaDescription: 'From initial exploration to successful integration, here\'s exactly how the liftout process works—for both companies acquiring teams and teams making moves.',
    featuredImage: '/images/blog/AdobeStock_474582113-1024x683.jpg',
    category: 'Liftouts',
    tags: ['Liftout', 'Process', 'Guide', 'How-To'],
    author: authors.nick,
    publishDate: '2024-11-28',
    modifiedDate: '2024-11-28',
    content: `## How a Liftout Actually Happens

The concept is simple: acquire an intact team rather than building one from scratch. But the execution requires coordination, timing, and attention to detail.

Here's how the process works, from both perspectives.

---

## Part 1: The Company Perspective

### Phase 1: Strategic Identification

Before looking for teams, clarify what you need:

**Define the capability gap**
- What specific skills or expertise are you missing?
- What would this team accomplish in their first year?
- What's the business case for acquiring this capability quickly vs. building it?

**Determine team parameters**
- What size team do you need? (3-5 people? 10-15? Larger?)
- What roles must be included?
- What industry experience matters?
- What geographic constraints exist (if any)?

**Set budget expectations**
- What's your total compensation budget for this team?
- Can you offer equity or other incentives?
- What's the cost of NOT filling this gap quickly?

### Phase 2: Search and Outreach

**Identify target teams**
- Use industry networks and platforms designed for team connections
- Research competitors and adjacent companies
- Look for teams with relevant track records and visibility

**Make confidential contact**
- Initial outreach should be discreet and professional
- Gauge interest before extensive discussions
- Be clear about what you're looking for and why

**Evaluate fit**
- Assess not just skills but team dynamics
- Understand how they work together
- Check cultural alignment with your organization

### Phase 3: Courtship and Negotiation

**Sell the opportunity**
- What makes your company attractive?
- What will this team be able to accomplish here?
- What growth and autonomy can you offer?

**Structure the package**
- Individual offers for each team member
- Address different needs (some prioritize salary, others equity or flexibility)
- Clarify reporting structures and decision-making authority

**Handle legal considerations**
- Understand any non-compete or non-solicitation issues
- Involve legal counsel early
- Plan for potential pushback from the team's current employer

### Phase 4: Closing and Transition

**Get commitments**
- Written offers to each team member
- Clear acceptance deadlines
- Ensure everyone commits before anyone resigns

**Plan the transition**
- Coordinate resignation timing with the team
- Prepare onboarding processes
- Communicate with existing employees about the new team

**Support integration**
- Connect the team with key stakeholders
- Provide resources and access quickly
- Create early opportunities to demonstrate value

---

## Part 2: The Team Perspective

### Phase 1: Internal Alignment

Before exploring opportunities, get your house in order:

**Have honest conversations**
- Is everyone genuinely interested in moving?
- What are each person's priorities (compensation, growth, stability)?
- What's the timeline that works for everyone?

**Assess your value proposition**
- What do you accomplish together that individuals couldn't?
- What's your track record as a unit?
- Why would a company want to hire you as a team?

**Set ground rules**
- How will you make decisions?
- What happens if not everyone receives offers?
- How will you handle counteroffers?

### Phase 2: Exploration

**Define what you're looking for**
- What kind of company? (Size, stage, industry)
- What problems do you want to solve?
- What matters most: compensation? Mission? Autonomy? Growth?

**Begin discreet outreach**
- Use personal networks and team-focused platforms
- Be clear that you're exploring as a unit
- Gauge interest before deep engagement

**Evaluate opportunities**
- Does this company need what you offer?
- Would you have the autonomy to work effectively?
- Is the culture compatible with your team's norms?

### Phase 3: Negotiation

**Present your value as a team**
- Lead with what you can accomplish together
- Share relevant metrics and achievements
- Demonstrate your working relationships

**Negotiate as a package**
- Understand everyone's minimum requirements
- Be willing to walk away if terms don't work for all
- Clarify working arrangements upfront

**Handle legal obligations**
- Understand your non-compete and NDA situations
- Seek legal advice if uncertain
- Don't violate legitimate obligations

### Phase 4: Transition

**Coordinate resignations**
- Time them appropriately (same week, not same day)
- Each person resigns individually and professionally
- Don't announce as a group or make it dramatic

**Support your former employer**
- Offer reasonable transition assistance
- Document processes and knowledge
- Don't burn bridges

**Start strong at the new company**
- Be visible and deliver early wins
- Build relationships beyond your team
- Demonstrate that the company made the right choice

---

## Common Questions

### How long does a liftout take?

From initial contact to start date, typically 2-4 months. Rushed processes create problems; overly slow ones lose momentum.

### What if only some team members receive offers?

Discuss this scenario upfront. Some teams only move if everyone is included; others accept partial moves. Clarity prevents awkwardness.

### How do you handle non-competes?

Know your state's laws. Many non-competes are unenforceable or have been significantly restricted (California, Minnesota, etc.). Consult employment counsel.

### What about counteroffers?

Expect them. Discuss as a team how you'll respond. Generally, if you've decided to move, counteroffers rarely address the underlying issues.

### How do companies prevent liftouts of their own teams?

The best defense isn't legal restrictions—it's creating an environment where top teams don't want to leave. Compensation, growth opportunities, and strong leadership matter more than contracts.

---

## Making It Work

Successful liftouts require:

**For companies**: Clear strategic vision, competitive packages, and thoughtful integration planning.

**For teams**: Honest alignment, professional execution, and strong presentation of collective value.

**For both**: Respect for confidentiality, patience with the process, and commitment to making the transition work for everyone involved.

The liftout model isn't for every situation. But when it works, it works remarkably well—companies get immediate capability, and teams get to advance their careers together.

*Ready to explore? Liftout connects companies seeking proven teams with teams ready for new opportunities.*`,
  },
];

// Helper functions
export function getArticleBySlug(slug: string): BlogArticle | undefined {
  return blogArticles.find((article) => article.slug === slug);
}

export function getArticlesByCategory(category: BlogArticle['category']): BlogArticle[] {
  return blogArticles.filter((article) => article.category === category);
}

export function getArticlesByTag(tag: string): BlogArticle[] {
  return blogArticles.filter((article) =>
    article.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
  );
}

export function getAllCategories(): BlogArticle['category'][] {
  return ['Contracts', 'Liftouts', 'Teamwork'];
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  blogArticles.forEach((article) => {
    article.tags.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
}

export function getRecentArticles(count: number = 6): BlogArticle[] {
  return [...blogArticles]
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
    .slice(0, count);
}

export function getRelatedArticles(article: BlogArticle, count: number = 3): BlogArticle[] {
  // Get articles in the same category, excluding the current article
  const sameCategoryArticles = blogArticles.filter(
    (a) => a.category === article.category && a.slug !== article.slug
  );

  // If we have enough, return them sorted by date
  if (sameCategoryArticles.length >= count) {
    return sameCategoryArticles
      .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
      .slice(0, count);
  }

  // Otherwise, add articles with matching tags
  const matchingTagArticles = blogArticles.filter(
    (a) =>
      a.slug !== article.slug &&
      !sameCategoryArticles.includes(a) &&
      a.tags.some((tag) => article.tags.includes(tag))
  );

  return [...sameCategoryArticles, ...matchingTagArticles]
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
    .slice(0, count);
}
