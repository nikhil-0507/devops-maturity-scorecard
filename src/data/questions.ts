import { Pillar } from '../types/assessment';

export const pillars: Pillar[] = [
  {
    id: 'dora',
    name: 'DORA METRICS',
    title: 'How fast and reliably does your team ship software?',
    description: 'DORA metrics are the global gold standard for measuring software delivery performance, researched by Google. These 4 questions tell us how quickly your team can get work done and how stable your software is when it ships.',
    questions: [
      {
        id: 'q1',
        text: 'How often does your team release software to users?',
        helperText: 'Think about the last month. How many times did you push a real update to your live product that users could see or feel? This includes bug fixes, new features, or any change to production.',
        options: [
          { label: 'Once a month or less', description: 'We release rarely, often once every few weeks or months', score: 1 },
          { label: 'Once a week', description: 'We have a regular release cycle, maybe every Monday or end of sprint', score: 2 },
          { label: 'Every day', description: 'We release at least once a day, usually after a review process', score: 3 },
          { label: 'Multiple times a day', description: 'Engineers can ship whenever their code is reviewed and tested — no waiting', score: 4 }
        ]
      },
      {
        id: 'q2',
        text: 'From idea to live: how long does it take?',
        helperText: 'From the moment an engineer starts writing code for a feature or bug fix, how long until that code is actually live for users? This includes code review, testing, and deployment time.',
        options: [
          { label: 'Over a month', description: 'Changes sit in review or waiting for a release window for weeks', score: 1 },
          { label: 'One week to one month', description: 'It takes a sprint or two to get most changes live', score: 2 },
          { label: 'One day to one week', description: 'Most changes go live within a few days of being written', score: 3 },
          { label: 'Less than one day', description: 'Code written in the morning can be live by the afternoon', score: 4 }
        ]
      },
      {
        id: 'q3',
        text: 'When you release, how often does something break?',
        helperText: 'After releasing a change, how often does it cause a problem in production — like a bug that impacts users, an outage, or something that had to be rolled back?',
        options: [
          { label: 'More than 1 in 3 releases break something', description: 'Releases are scary, we often have incidents after shipping', score: 1 },
          { label: 'About 1 in 5 to 1 in 3 releases have issues', description: 'We have problems fairly often but we manage', score: 2 },
          { label: 'About 1 in 20 releases cause a problem', description: 'Most releases go smoothly with occasional hiccups', score: 3 },
          { label: 'Less than 1 in 20', description: 'Releases are routine and boring — exactly as they should be', score: 4 }
        ]
      },
      {
        id: 'q4',
        text: 'When something breaks, how fast do you fix it?',
        helperText: 'Imagine your website or app has a major problem right now that\'s affecting users. How long does it typically take your team to detect the issue, diagnose it, fix it, and restore service?',
        options: [
          { label: 'More than a week', description: 'Major incidents can drag on for days or longer', score: 1 },
          { label: 'Hours to a few days', description: 'We get there, but it\'s stressful and takes a while', score: 2 },
          { label: 'Under an hour to a few hours', description: 'We have good monitoring and can usually fix things within the day', score: 3 },
          { label: 'Under 30 minutes', description: 'We have runbooks, on-call alerts, and automated recovery so we fix things fast', score: 4 }
        ]
      }
    ]
  },
  {
    id: 'cicd',
    name: 'CI/CD PIPELINE',
    title: 'How automated is your path from code to production?',
    description: 'CI/CD stands for Continuous Integration and Continuous Delivery. Think of it as an assembly line for software — every time an engineer writes code, a series of automatic checks run to test it, package it, and prepare it for deployment. The more automated this pipeline, the faster and safer your team ships.',
    questions: [
      {
        id: 'q5',
        text: 'Does your team have automated tests?',
        helperText: 'When an engineer makes a change to the code, does the system automatically run tests to check nothing is broken — without a human manually clicking through the app? This is like a safety net that catches problems before they reach users.',
        options: [
          { label: 'No automated tests', description: 'We test by hand or mostly just trust the code works', score: 1 },
          { label: 'Some basic tests', description: 'We have a few automated tests but coverage is patchy', score: 2 },
          { label: 'Good test coverage', description: 'Most of our features have automated tests: unit tests and integration tests', score: 3 },
          { label: 'Comprehensive test suite', description: 'We have a full pyramid: unit, integration, and end-to-end tests all automated', score: 4 }
        ]
      },
      {
        id: 'q6',
        text: 'How long does it take to build and test your software?',
        helperText: 'After a developer submits their code change, how long does your automated pipeline take to run all checks and say "this is ready to deploy"? Faster pipelines mean faster feedback and less waiting around.',
        options: [
          { label: 'Over 30 minutes', description: 'Developers go make coffee and come back — builds take forever', score: 1 },
          { label: '15–30 minutes', description: 'Builds are slow but manageable', score: 2 },
          { label: '5–15 minutes', description: 'Fast enough that developers wait for it before moving on', score: 3 },
          { label: 'Under 5 minutes', description: 'Blazing fast — developers get feedback almost immediately', score: 4 }
        ]
      },
      {
        id: 'q7',
        text: 'How much of your deployment process is automated?',
        helperText: 'When it\'s time to release software, how much do humans need to manually do? Do engineers SSH into servers and run commands, or does a system handle it automatically after code is reviewed?',
        options: [
          { label: 'Fully manual', description: 'A human runs scripts or commands to deploy every time', score: 1 },
          { label: 'Some scripts', description: 'We have some automation but humans are still heavily involved', score: 2 },
          { label: 'Mostly automated with a human approval step', description: 'The pipeline does the work, but a human clicks "approve" before production', score: 3 },
          { label: 'Fully automated', description: 'Once code is reviewed and tests pass, deployment happens automatically', score: 4 }
        ]
      },
      {
        id: 'q8',
        text: 'If a release goes wrong, how quickly can you undo it?',
        helperText: 'Imagine you just released a broken version of your app. How quickly and easily can your team go back to the previous working version? This is called a rollback — the faster and more automated, the better.',
        options: [
          { label: 'We don\'t have a reliable rollback process', description: 'Rolling back is painful and risky', score: 1 },
          { label: 'Manual rollback', description: 'We can do it, but someone has to run commands or scripts manually', score: 2 },
          { label: 'Semi-automated', description: 'We have a process, it just needs a few steps', score: 3 },
          { label: 'One-click or automatic rollback', description: 'We can be back to the previous version in seconds', score: 4 }
        ]
      }
    ]
  },
  {
    id: 'security',
    name: 'SECURITY POSTURE',
    title: 'How well is your software protected from threats?',
    description: 'Security isn\'t just about firewalls. In modern DevOps, security is built into every stage of development — often called DevSecOps. These questions assess how proactively your team protects your software, your users\' data, and your infrastructure.',
    questions: [
      {
        id: 'q9',
        text: 'How do you manage passwords, API keys, and secrets?',
        helperText: 'Your software needs passwords and access keys to connect to databases, external services, and APIs. Where do you keep these? Secrets left in code files or shared in Slack are a major security risk.',
        options: [
          { label: 'Secrets are in code files or shared informally', description: 'API keys are in config files checked into Git, or shared via Slack/email', score: 1 },
          { label: 'Environment variables', description: 'Secrets are set as environment variables on servers, not in the code itself', score: 2 },
          { label: 'A secrets manager', description: 'We use a tool like HashiCorp Vault, AWS Secrets Manager, or GCP Secret Manager', score: 3 },
          { label: 'Dynamic, rotating secrets', description: 'Secrets are automatically rotated and never long-lived', score: 4 }
        ]
      },
      {
        id: 'q10',
        text: 'Does your pipeline automatically scan code for security issues?',
        helperText: 'SAST means Static Application Security Testing — tools that read your code and flag known security vulnerabilities automatically, like a spell-checker but for security holes. Does this happen automatically every time someone pushes code?',
        options: [
          { label: 'No security scanning', description: 'We don\'t scan code for vulnerabilities automatically', score: 1 },
          { label: 'Manual scans occasionally', description: 'Someone runs a scan tool sometimes, but it\'s not systematic', score: 2 },
          { label: 'Automated scans in the pipeline', description: 'Every code change is automatically scanned for vulnerabilities', score: 3 },
          { label: 'Scans block deployment on failure', description: 'If a critical vulnerability is found, the pipeline stops and won\'t deploy', score: 4 }
        ]
      },
      {
        id: 'q11',
        text: 'Do you check your software dependencies for vulnerabilities?',
        helperText: 'Most software is built using third-party libraries and packages (like npm packages or Python libraries). These can contain known security vulnerabilities. Does your team automatically check for these and get alerted?',
        options: [
          { label: 'No', description: 'We don\'t regularly check third-party packages for vulnerabilities', score: 1 },
          { label: 'Manual checks', description: 'We check sometimes, but not automatically', score: 2 },
          { label: 'Automated scanning', description: 'Every build automatically checks for vulnerable dependencies', score: 3 },
          { label: 'Policy enforced', description: 'Builds fail if vulnerable dependencies are found above a severity threshold', score: 4 }
        ]
      },
      {
        id: 'q12',
        text: 'Who can access what in your systems?',
        helperText: 'Think about your cloud infrastructure, databases, and internal tools. Does everyone on the team have broad admin access, or does each person only have exactly the permissions they need to do their specific job? Least privilege means giving the minimum access necessary.',
        options: [
          { label: 'Shared or admin access for most people', description: 'Most people have admin or very broad access to most systems', score: 1 },
          { label: 'Basic role separation', description: 'We have some roles (admin vs developer) but it\'s not fine-grained', score: 2 },
          { label: 'Least privilege enforced', description: 'Each person and system has only the access they genuinely need', score: 3 },
          { label: 'Just-in-time access', description: 'Access is granted temporarily when needed and automatically revoked', score: 4 }
        ]
      }
    ]
  },
  {
    id: 'observability',
    name: 'OBSERVABILITY',
    title: 'Can you see what\'s happening inside your systems?',
    description: 'Observability is about how well you can understand what your software is doing at any moment. If something goes wrong at 3am, can your team immediately see what failed, why, and where? Good observability turns guesswork into knowledge.',
    questions: [
      {
        id: 'q13',
        text: 'How does your team track application logs?',
        helperText: 'Logs are records of everything your software does — every request, error, and event. When something breaks, engineers read logs to understand what happened. Where do your logs go, and can your team easily search them?',
        options: [
          { label: 'Logs are on individual servers or not collected', description: 'To see logs we SSH into a server and look at files', score: 1 },
          { label: 'Centralized logging', description: 'All logs go to one place like CloudWatch, Datadog, or Splunk', score: 2 },
          { label: 'Structured and searchable', description: 'Logs are in a consistent format and easy to filter and search', score: 3 },
          { label: 'Correlated with alerts', description: 'Logs automatically trigger alerts and are linked to traces and metrics', score: 4 }
        ]
      },
      {
        id: 'q14',
        text: 'How well do you monitor the health of your systems?',
        helperText: 'Do you have dashboards showing you in real time whether your application is working well? Things like: how many requests per second, how long responses take, how much CPU is being used, and how many errors are occurring.',
        options: [
          { label: 'Minimal or no monitoring', description: 'We mostly find out about problems when users complain', score: 1 },
          { label: 'Basic uptime checks', description: 'We monitor if the service is up or down, but not much else', score: 2 },
          { label: 'Detailed metrics', description: 'We track request rates, error rates, and latency across services', score: 3 },
          { label: 'SLOs and error budgets', description: 'We have formal targets (SLOs) and track our reliability budget automatically', score: 4 }
        ]
      },
      {
        id: 'q15',
        text: 'Can you trace a request end-to-end through your system?',
        helperText: 'When a user clicks a button in your app, that action might pass through 5 or 10 different services before a response is returned. If something is slow or broken, can you trace exactly where in that journey the problem occurred?',
        options: [
          { label: 'No tracing', description: 'We can\'t follow a request across services', score: 1 },
          { label: 'Basic application monitoring', description: 'We have some APM tool but it doesn\'t trace across services', score: 2 },
          { label: 'End-to-end distributed tracing', description: 'We can see the full journey of a request across all services', score: 3 },
          { label: 'Tracing drives decisions', description: 'We actively use traces to find performance bottlenecks and improve', score: 4 }
        ]
      },
      {
        id: 'q16',
        text: 'How useful and accurate are your alerts?',
        helperText: 'Alerts wake your engineers up at night when something goes wrong. But bad alerts are worse than none — false alarms burn out teams fast. How well tuned are your alerts? Do they fire when something actually needs attention?',
        options: [
          { label: 'Alert fatigue', description: 'We get so many alerts that engineers often ignore them or turn them off', score: 1 },
          { label: 'Basic threshold alerts', description: 'We alert on obvious things like CPU over 90%, but it\'s noisy', score: 2 },
          { label: 'Actionable and well-tuned alerts', description: 'Alerts fire when something actually needs attention with context on what to do', score: 3 },
          { label: 'Automated runbooks and remediation', description: 'Many alerts auto-resolve or come with step-by-step runbooks to follow', score: 4 }
        ]
      }
    ]
  },
  {
    id: 'culture',
    name: 'TEAM CULTURE',
    title: 'How does your team learn, grow, and work together?',
    description: 'The best DevOps teams aren\'t just technically strong — they have a culture of learning, psychological safety, and continuous improvement. These questions measure the human side of engineering: how your team handles failure, stress, documentation, and knowledge.',
    questions: [
      {
        id: 'q17',
        text: 'What happens after an outage or major incident?',
        helperText: 'Something went wrong and users were affected. Once it\'s fixed, what does your team do? Do you review it carefully to learn from it, or do you move on quickly and hope it doesn\'t happen again?',
        options: [
          { label: 'We move on', description: 'Incidents are resolved and we get back to work without formal review', score: 1 },
          { label: 'We review it but focus on blame', description: 'There\'s usually a post-incident discussion but it tends to focus on who made the mistake', score: 2 },
          { label: 'Blameless postmortems', description: 'We document what happened, focus on the system not the person, and identify fixes', score: 3 },
          { label: 'Systematic learning culture', description: 'Postmortems produce action items that are tracked, and learnings are shared across the company', score: 4 }
        ]
      },
      {
        id: 'q18',
        text: 'How sustainable is your on-call experience?',
        helperText: 'On-call means being responsible for fixing problems outside normal working hours — nights and weekends. This is necessary in engineering, but it can cause serious burnout if not managed well. How is your team\'s on-call health?',
        options: [
          { label: 'Unsustainable or chaotic', description: 'People are burning out from constant interruptions or unclear responsibilities', score: 1 },
          { label: 'Informal rotation', description: 'We share on-call duties but it\'s not formally structured', score: 2 },
          { label: 'Defined and fair rotation', description: 'We have a clear schedule, escalation paths, and basic tooling', score: 3 },
          { label: 'Sustainable and well-supported', description: 'Low alert noise, clear runbooks, and engineers can actually sleep during on-call', score: 4 }
        ]
      },
      {
        id: 'q19',
        text: 'How good is your team\'s documentation?',
        helperText: 'Can a new person join your team and understand how everything works within their first week? Documentation includes runbooks (how to do things), architecture diagrams, and guides for common tasks. Is yours up to date and actually useful?',
        options: [
          { label: 'Little to no documentation', description: 'Most knowledge lives in people\'s heads', score: 1 },
          { label: 'Some documentation, often outdated', description: 'Docs exist but they\'re hard to find and may not be accurate', score: 2 },
          { label: 'Maintained runbooks and guides', description: 'Key processes are documented and kept reasonably current', score: 3 },
          { label: 'Auto-generated and reviewed', description: 'Documentation is part of the development process, automatically generated where possible', score: 4 }
        ]
      },
      {
        id: 'q20',
        text: 'How well does your team share knowledge?',
        helperText: 'When one engineer becomes the expert in a critical system, that\'s a single point of failure — called a "bus factor". If that person leaves or gets sick, everything stops. How well does your team spread knowledge across multiple people?',
        options: [
          { label: 'Knowledge is siloed', description: 'A few people hold all the critical knowledge and it\'s a constant risk', score: 1 },
          { label: 'Informal sharing', description: 'People share informally but there\'s no system for it', score: 2 },
          { label: 'Regular knowledge sharing sessions', description: 'We have tech talks, pair programming, or brown bags regularly', score: 3 },
          { label: 'Knowledge sharing is embedded in culture', description: 'Cross-training, pair work, and documentation are part of how we work every day', score: 4 }
        ]
      }
    ]
  },
  {
    id: 'cloud',
    name: 'CLOUD SECURITY',
    title: 'How secure is your cloud infrastructure?',
    description: 'This section is about the security of your cloud environment — not just your application code, but the underlying infrastructure: who can access what, how networks are configured, and whether you meet compliance standards.',
    questions: [
      {
        id: 'q21',
        text: 'How strictly controlled is access to your cloud environment?',
        helperText: 'Think about your AWS, GCP, or Azure account. Who has admin access? Can everyone on the team create or delete resources? The principle of least privilege means giving each person and system only the minimum access they need.',
        options: [
          { label: 'Most people have broad or admin access', description: 'Many people can do almost anything in our cloud environment', score: 1 },
          { label: 'Basic role separation', description: 'We have admins vs users but access isn\'t tightly controlled', score: 2 },
          { label: 'Least privilege enforced', description: 'Access is carefully scoped — people can only access what their role requires', score: 3 },
          { label: 'Zero trust architecture', description: 'Every access is verified, temporary, and logged — nothing is trusted by default', score: 4 }
        ]
      },
      {
        id: 'q22',
        text: 'How is your network set up to limit risk?',
        helperText: 'Network segmentation means dividing your systems into isolated zones so that if one part is compromised, attackers can\'t easily move to other parts. Think of it like waterproof compartments in a ship.',
        options: [
          { label: 'Flat network', description: 'Everything can talk to everything with minimal restrictions', score: 1 },
          { label: 'Basic network separation', description: 'We have separate networks (VPCs) for different environments', score: 2 },
          { label: 'Fine-grained segmentation', description: 'Services are isolated and can only communicate with what they need to', score: 3 },
          { label: 'Service mesh with mutual TLS', description: 'All service-to-service traffic is encrypted, authenticated, and policy-controlled', score: 4 }
        ]
      },
      {
        id: 'q23',
        text: 'Do you have a full audit trail of what happens in your systems?',
        helperText: 'Audit logs record who did what, when, and where across your infrastructure. If someone deletes a database or changes a firewall rule, can you see exactly who did it and when? This is critical for both security and compliance.',
        options: [
          { label: 'No audit logs', description: 'We don\'t have a systematic way to track who did what', score: 1 },
          { label: 'Basic logs', description: 'Some actions are logged but coverage is incomplete', score: 2 },
          { label: 'Cloud audit logs enabled', description: 'All major infrastructure actions are captured in cloud audit logs', score: 3 },
          { label: 'SIEM integrated', description: 'Audit logs feed into a security platform that detects suspicious behaviour automatically', score: 4 }
        ]
      },
      {
        id: 'q24',
        text: 'Where do you stand on compliance and security standards?',
        helperText: 'Standards like SOC 2, ISO 27001, or PCI DSS are frameworks that prove your security practices meet a recognised benchmark. Even if you\'re not aiming for certification, following these frameworks shows maturity. Where does your team stand?',
        options: [
          { label: 'We haven\'t thought about this', description: 'Compliance isn\'t something we\'ve formally addressed', score: 1 },
          { label: 'We\'re aware but not compliant', description: 'We know about these standards but haven\'t implemented them', score: 2 },
          { label: 'Partially implemented', description: 'We follow many of the controls but aren\'t formally certified', score: 3 },
          { label: 'Certified and automated', description: 'We hold certifications and use automated tools to maintain compliance continuously', score: 4 }
        ]
      }
    ]
  }
];
