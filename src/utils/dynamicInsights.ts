import { Answers, PillarAnalysis } from '../types/assessment';

export function generateDynamicInsights(answers: Answers): PillarAnalysis[] {
  return [
    getDoraInsights(answers),
    getCicdInsights(answers),
    getSecurityInsights(answers),
    getObservabilityInsights(answers),
    getCultureInsights(answers),
    getCloudInsights(answers),
  ];
}

function getInsight(
  answers: Answers,
  pillarName: string,
  rules: { id: string; high: string; low: string }[]
): PillarAnalysis {
  let highestScore = -1;
  let highestId = '';
  
  let lowestScore = 5;
  let lowestId = '';

  // Evaluate scores for this pillar's questions
  for (const rule of rules) {
    const score = answers[rule.id] || 0;
    if (score > highestScore) {
      highestScore = score;
      highestId = rule.id;
    }
    if (score < lowestScore) {
      lowestScore = score;
      lowestId = rule.id;
    }
  }

  // If all scores are equal (e.g. all 2s or all 3s), highestId and lowestId will just pick the first rule processed.
  // The rules array should be ordered exactly as requested in the prompt:
  
  const bestRule = rules.find((r) => r.id === highestId) || rules[0];
  const worstRule = rules.find((r) => r.id === lowestId) || rules[0];

  return {
    pillar: pillarName,
    strength: highestScore >= 3 ? bestRule.high : 'Your team has foundational elements in place, but there is room to grow across all areas.',
    opportunity: lowestScore <= 2 ? worstRule.low : 'Your team is performing exceptionally well across the board. Focus on fine-tuning and expanding these practices.'
  };
}

function getDoraInsights(answers: Answers): PillarAnalysis {
  return getInsight(answers, 'DORA METRICS', [
    {
      id: 'q1',
      high: 'Your team ships frequently which reduces batch size and risk',
      low: 'Increasing deployment frequency — even to weekly — dramatically reduces risk per release'
    },
    {
      id: 'q4',
      high: 'Your recovery time is strong — fast MTTR is a hallmark of high-performing teams',
      low: 'Improving MTTR through runbooks and alerting will have the biggest immediate impact on reliability'
    },
    {
      id: 'q3',
      high: 'A low change failure rate shows your testing and review process is working',
      low: 'A high change failure rate usually points to gaps in automated testing or code review — address this before increasing deploy frequency'
    },
    {
      id: 'q2',
      high: 'Fast lead time means your pipeline is not slowing your engineers down',
      low: 'Long lead times are usually caused by manual approval steps or slow builds — both are fixable'
    }
  ]);
}

function getCicdInsights(answers: Answers): PillarAnalysis {
  return getInsight(answers, 'CI/CD PIPELINE', [
    {
      id: 'q7',
      high: 'Your deployment automation reduces human error and speeds up delivery',
      low: 'Automating your deployment pipeline is the single highest-leverage improvement most teams can make'
    },
    {
      id: 'q5',
      high: 'Good test coverage gives your team confidence to ship without fear',
      low: 'Investing in automated tests pays back quickly — every bug caught in CI is one that doesn\'t reach production'
    },
    {
      id: 'q8',
      high: 'Fast rollback capability means incidents stay short even when things go wrong',
      low: 'Without reliable rollback, every deployment carries more risk — this is often a quick win to implement'
    },
    {
      id: 'q6',
      high: 'Fast build times keep your engineers in flow and reduce feedback loops',
      low: 'Slow builds frustrate engineers and slow delivery — parallelisation and caching are usually quick fixes'
    }
  ]);
}

function getSecurityInsights(answers: Answers): PillarAnalysis {
  return getInsight(answers, 'SECURITY POSTURE', [
    {
      id: 'q9',
      high: 'Using a secrets manager is a significant security maturity marker that many teams skip',
      low: 'Moving secrets out of code and into a proper secrets manager is the most impactful security improvement most teams can make today'
    },
    {
      id: 'q12',
      high: 'Least privilege access control limits your blast radius if credentials are ever compromised',
      low: 'Broad admin access is one of the most common causes of serious security incidents — tightening IAM is urgent'
    },
    {
      id: 'q10',
      high: 'Automated security scanning in your pipeline catches vulnerabilities before they reach production',
      low: 'Adding SAST scanning to your pipeline costs almost nothing but catches a significant portion of common vulnerabilities automatically'
    },
    {
      id: 'q11',
      high: 'Automated dependency scanning protects you from supply chain attacks without slowing down development',
      low: 'Most breaches exploit known vulnerabilities in dependencies — automated scanning is a fast, low-effort fix'
    }
  ]);
}

function getObservabilityInsights(answers: Answers): PillarAnalysis {
  return getInsight(answers, 'OBSERVABILITY', [
    {
      id: 'q14',
      high: 'Tracking RED/USE metrics means you understand your system\'s health before users report problems',
      low: 'Basic metrics — request rate, error rate, latency — are the fastest way to move from reactive to proactive operations'
    },
    {
      id: 'q16',
      high: 'Well-tuned alerts that fire only when needed protect your engineers from burnout and keep trust in your alerting system high',
      low: 'Alert fatigue is one of the most underrated engineering problems — noisy alerts cause teams to ignore real incidents'
    },
    {
      id: 'q13',
      high: 'Structured, centralised logging means your engineers can diagnose problems in minutes rather than hours',
      low: 'Centralised logging is often the first observability investment that pays back immediately — implement it before the next major incident'
    },
    {
      id: 'q15',
      high: 'End-to-end distributed tracing means you can pinpoint performance problems across services without guesswork',
      low: 'Without tracing, diagnosing latency issues in distributed systems is extremely slow — even basic APM makes a significant difference'
    }
  ]);
}

function getCultureInsights(answers: Answers): PillarAnalysis {
  return getInsight(answers, 'TEAM CULTURE', [
    {
      id: 'q17',
      high: 'Blameless postmortems are a sign of psychological safety — teams that do them learn faster and have fewer repeat incidents',
      low: 'Blame-driven incident reviews cause engineers to hide problems — shifting to blameless retrospectives is a culture change that starts with one conversation'
    },
    {
      id: 'q18',
      high: 'A sustainable on-call culture retains engineers and prevents the burnout that destroys high-performing teams',
      low: 'Unsustainable on-call is a leading cause of senior engineer attrition — fixing alert noise and rotation fairness is urgent'
    },
    {
      id: 'q20',
      high: 'Shared knowledge across the team means no single person is a critical dependency or a bus factor risk',
      low: 'Siloed knowledge is a hidden risk that usually surfaces at the worst moment — a regular 30-minute knowledge share session is an easy first step'
    },
    {
      id: 'q19',
      high: 'Maintained documentation means new team members can onboard quickly and incidents can be resolved without the right person being awake',
      low: 'Documentation does not need to be perfect to be valuable — starting with runbooks for your top 5 most common incidents is enough to make a difference'
    }
  ]);
}

function getCloudInsights(answers: Answers): PillarAnalysis {
  return getInsight(answers, 'CLOUD SECURITY', [
    {
      id: 'q21',
      high: 'Enforcing least privilege in your cloud environment limits the damage any single compromised credential can cause',
      low: 'Broad cloud admin access is the most common cause of catastrophic cloud security incidents — restricting permissions should be a top priority'
    },
    {
      id: 'q23',
      high: 'Full audit logging means you have forensic capability — you can reconstruct exactly what happened in any incident or breach',
      low: 'Without audit logs you are flying blind in any security investigation — enabling cloud audit logging is usually a one-click change'
    },
    {
      id: 'q22',
      high: 'Network segmentation means a compromise in one service cannot easily spread to the rest of your infrastructure',
      low: 'A flat network is a serious risk — even basic VPC separation between environments is a significant improvement'
    },
    {
      id: 'q24',
      high: 'Operating within a compliance framework gives your customers confidence and forces good security hygiene',
      low: 'Compliance frameworks like SOC 2 feel daunting but most controls are good practices you should be doing anyway — starting the journey is worth it'
    }
  ]);
}
