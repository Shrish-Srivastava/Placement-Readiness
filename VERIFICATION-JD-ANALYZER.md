# JD Analyzer — Verification Guide

## Skill Extraction

**Keywords detected (case-insensitive):**

| Category | Keywords |
|----------|----------|
| Core CS | DSA, OOP, DBMS, OS, Networks, Data Structures, Algorithms, Operating System |
| Languages | Java, Python, JavaScript, TypeScript, C++, C#, Go, Rust |
| Web | React, Next.js, Node.js, Express, REST, GraphQL, Vue, Angular |
| Data | SQL, MongoDB, PostgreSQL, MySQL, Redis, NoSQL |
| Cloud/DevOps | AWS, Azure, GCP, Docker, Kubernetes, CI/CD, Linux, Git, Jenkins |
| Testing | Selenium, Cypress, Playwright, JUnit, PyTest, Jest |

If no keywords detected → shows "General fresher stack".

## Readiness Score (0–100)

- Base: 35
- +5 per detected category (max 30)
- +10 if company provided
- +10 if role provided
- +10 if JD length > 800 chars
- Cap at 100

## History Persistence

- Stored in `localStorage` under key `placement-readiness-history`
- Survives page refresh and browser restart
- Each entry: id, createdAt, company, role, jdText, extractedSkills, plan, checklist, questions, readinessScore

## Steps to Verify

### 1. Run JD Analyzer

1. `npm run dev`
2. Go to `/dashboard` → click **JD Analyzer** in sidebar
3. Paste sample JD below
4. (Optional) Enter Company: `Google`, Role: `SDE`
5. Click **Analyze**

### 2. Sample JD (copy-paste)

```
Software Engineer - Backend

Requirements:
- Strong DSA and problem-solving skills
- Proficiency in Python, Java, or Go
- Experience with SQL, PostgreSQL, MongoDB
- Knowledge of REST APIs, GraphQL
- Familiarity with Docker, Kubernetes, AWS
- Experience with React or Node.js
- Unit testing with PyTest or JUnit

Nice to have:
- CI/CD pipelines, Linux
- System Design, DBMS, OOP
```

Expected skills: Core CS (DSA, OOP, DBMS), Languages (Python, Java, Go), Web (REST, GraphQL, React, Node.js), Data (SQL, PostgreSQL, MongoDB), Cloud/DevOps (Docker, Kubernetes, AWS, CI/CD, Linux), Testing (PyTest, JUnit).

### 3. Verify Results

- Readiness score ~80–100 (company + role + JD > 800 chars + multiple categories)
- Key skills: tags grouped by category
- Round-wise checklist: 4 rounds, 5–8 items each
- 7-day plan: Day 1–2 through Day 7
- 10 likely interview questions (e.g., SQL indexing, React state, DSA optimization)

### 4. Verify History Persistence

1. Go to **History** in sidebar
2. Confirm entry appears with date, company, role, score
3. Click entry → opens Results with that analysis
4. Refresh page (F5) → history still visible
5. Open new tab, go to `/dashboard/history` → history persists

### 5. General Fresher Stack (no keywords)

Paste: `We are looking for a motivated fresher to join our team.`

- Skills: "General fresher stack"
- Readiness score: 35 (base) + company/role/JD bonuses if provided

## Routes (unchanged, added only)

- `/dashboard/analyzer` — JD Analyzer input
- `/dashboard/history` — Analysis history list
- `/dashboard/results?id=<uuid>` — Results for specific entry (or latest if no id)
