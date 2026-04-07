# DevOps Maturity Scorecard

> Benchmark your engineering team against Elite DORA standards — built from real-world experience, not theory.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Try%20It%20Now-1D9E75?style=for-the-badge)](https://your-live-url.run.app)
[![Built With](https://img.shields.io/badge/Built%20With-React%20%2B%20Tailwind-378ADD?style=for-the-badge)](https://reactjs.org)
[![Hosted On](https://img.shields.io/badge/Hosted%20On-Google%20Cloud%20Run-4285F4?style=for-the-badge)](https://cloud.google.com/run)
[![DORA Aligned](https://img.shields.io/badge/Aligned%20To-Google%20DORA%20Research-534AB7?style=for-the-badge)](https://dora.dev)
[![License](https://img.shields.io/badge/License-MIT-lightgrey?style=for-the-badge)](LICENSE)

---

## What Is This?

The **DevOps Maturity Scorecard** is a free, self-service web tool that helps engineering teams honestly assess how mature their DevOps practices are across 6 key pillars — and get AI-powered, actionable recommendations to improve.

Answer 24 plain-English questions. Get an instant maturity score, a visual pillar breakdown, and a prioritised action plan in under 10 minutes.

**No sign-up. No backend. No cost.**

---

## Live Demo

**Try it now:** [your-live-url.run.app](https://your-live-url.run.app)

---

## Features

- **24 questions across 6 DevOps pillars** — written for both technical and non-technical readers
- **Instant scoring** — all logic runs client-side in JavaScript, no data leaves your browser
- **Visual results dashboard** — overall score, pillar breakdown bars, maturity level badge
- **AI-powered recommendations** — top 3 actionable improvements based on your specific answers
- **DORA benchmark comparison** — see how your team compares to Elite, High, Medium, and Low performers
- **Quick win highlight** — one improvement you can start this week with no budget
- **LinkedIn share card** — pre-written post with your real scores, ready to copy and publish
- **Fully responsive** — works on desktop and mobile

---

## The 6 Pillars

| Pillar | What It Measures |
|--------|-----------------|
| DORA Metrics | Deployment frequency, lead time, change failure rate, MTTR |
| CI/CD Pipeline | Test automation, build speed, deployment automation, rollback |
| Security Posture | Secrets management, SAST/DAST, dependency scanning, RBAC |
| Observability | Logging, monitoring, distributed tracing, alert quality |
| Team Culture | Postmortems, on-call health, documentation, knowledge sharing |
| Cloud Security | IAM, network segmentation, audit logging, compliance |

---

## Maturity Levels

| Score | Level | What It Means |
|-------|-------|---------------|
| 0–40% | Crawling | Early stage — foundational work needed, but every improvement compounds |
| 41–60% | Walking | Basics in place — focus on consistency and removing manual steps |
| 61–80% | Running | High performance — sharpen reliability, speed, and culture depth |
| 81–100% | Flying | Elite — among the top engineering organisations in the world |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Tailwind CSS |
| Scoring logic | Vanilla JavaScript (client-side, no backend) |
| Hosting | Google Cloud Run |
| CI/CD | GitHub Actions → Cloud Build → Artifact Registry → Cloud Run |
| Containerisation | Docker |
| IaC | Terraform |

---

## Getting Started

### Run Locally

```bash
# Clone the repo
git clone https://github.com/nikhil-s-patil/devops-maturity-scorecard.git
cd devops-maturity-scorecard

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

### Run with Docker

```bash
docker build -t devops-maturity-scorecard .
docker run -p 8080:8080 devops-maturity-scorecard
```

---

## Deploy to Google Cloud Run

```bash
# Authenticate
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# Build and push container
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/devops-maturity-scorecard

# Deploy to Cloud Run
gcloud run deploy devops-maturity-scorecard \
  --image gcr.io/YOUR_PROJECT_ID/devops-maturity-scorecard \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

The deploy command returns a live HTTPS URL. That's your tool, live in production.

---

## CI/CD Pipeline

Every push to `main` triggers an automated pipeline:

```
GitHub Push → GitHub Actions → Cloud Build → Artifact Registry → Cloud Run
```

The pipeline runs tests, builds the Docker image, pushes to Artifact Registry, and deploys to Cloud Run — zero manual steps.

---

## Project Structure

```
devops-maturity-scorecard/
├── src/
│   ├── components/
│   │   ├── LandingPage.jsx       # Home screen with creator card
│   │   ├── AssessmentForm.jsx    # 7-section form with progress bar
│   │   ├── ResultsDashboard.jsx  # Scorecard, charts, recommendations
│   │   └── LinkedInShare.jsx     # Share card with dynamic scores
│   ├── utils/
│   │   ├── scoring.js            # Pillar score and maturity calculations
│   │   └── recommendations.js   # Dynamic action item generation
│   ├── App.jsx
│   └── main.jsx
├── terraform/
│   └── main.tf                   # Cloud Run + IAM infrastructure
├── .github/
│   └── workflows/
│       └── deploy.yml            # GitHub Actions CI/CD pipeline
├── Dockerfile
└── README.md
```

---

## About the Creator

**Nikhil Patil** — Lead DevOps Engineer with 6+ years designing and scaling enterprise cloud platforms on AWS.

The questions, scoring framework, and benchmarks in this tool are not academic — they come from real engineering work:

- **60% AWS cost reduction** — from $300K to $130K annually through rightsizing, spot instances, and cost governance
- **200+ deployments per week** — across 60+ microservices, up from 150 per month, without increasing failure rates
- **MTTR cut from 6 hours to 15 minutes** — using Prometheus, Grafana, Datadog, and structured on-call processes
- **99.99% uptime** — zero SLA breaches across 10+ production environments over 4+ years
- **Team growth: 6 to 55 engineers** — including hiring, mentorship, and building engineering culture from scratch
- **ISO 27001 and GDPR compliant** — across a multi-account AWS platform serving 100,000+ active users in the UK

The scoring is aligned to [Google's DORA research](https://dora.dev) — the most widely cited study on software delivery performance.

**Connect:**
- Website: [nikhilpatil.me](https://nikhilpatil.me)
- LinkedIn: [linkedin.com/in/nikhil-s-patil](https://linkedin.com/in/nikhil-s-patil)
- Email: nikhilpatil0507@gmail.com

---

## Contributing

Contributions are welcome. If you have ideas for new questions, better scoring logic, or UI improvements:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-idea`
3. Commit your changes: `git commit -m 'Add: your feature description'`
4. Push to the branch: `git push origin feature/your-idea`
5. Open a Pull Request

---

## License

MIT License — free to use, fork, and build on. Attribution appreciated.

---

## Acknowledgements

- [Google DORA Research](https://dora.dev) — the industry benchmark this tool is aligned to
- [Accelerate by Nicole Forsgren, Jez Humble, Gene Kim](https://itrevolution.com/accelerate-book/) — the book behind DORA metrics
- [Google Cloud Run](https://cloud.google.com/run) — serverless hosting that makes this tool free to run at scale

---

*Built with real DevOps experience. Hosted on Google Cloud Run. Open source on GitHub.*
