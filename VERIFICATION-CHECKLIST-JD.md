# JD Analyzer — Verification Checklist

## Skill Extraction Test

**Input**: JD containing "React, Node.js, SQL, AWS"

| Skill   | Category      | Detected |
|---------|---------------|----------|
| React   | Web           | ✓        |
| Node.js | Web           | ✓        |
| SQL     | Data          | ✓        |
| AWS     | Cloud/DevOps  | ✓        |

**Grouping**: Web (React, Node.js), Data (SQL), Cloud/DevOps (AWS) ✓

---

## Fallback Test

**Input**: "Looking for a strong leader with communication skills."

**Expected**: "General fresher stack" (no keywords match) ✓

---

## Round-wise Checklist

| Check                    | Status |
|--------------------------|--------|
| 4 rounds shown           | ✓      |
| Items specific to skills | ✓      |
| React → frontend tasks   | ✓ "Be ready for React/Node architecture questions" (Round 3) |

---

## 7-Day Plan

| Check                         | Status |
|-------------------------------|--------|
| Adapts based on skills        | ✓      |
| SQL present → DB revision     | ✓ "Revise SQL, indexing, and database transactions" (Day 1–2) |
| React present → frontend      | ✓ "Revise frontend concepts (React lifecycle, state)" (Day 5) |

---

## Interview Questions

| Check              | Status |
|--------------------|--------|
| 10 questions shown | ✓      |
| Skill-specific     | ✓ SQL, React, DSA, OOP, Docker, AWS, REST, Node.js, MongoDB |
| No generic fluff   | ✓ Fallbacks limited to 2 when needed |

---

## Readiness Score

| Scenario                        | Expected | Formula                             |
|---------------------------------|----------|-------------------------------------|
| Short JD + no company           | ~35–50   | Base 35 + categories only           |
| Long JD + company + role        | ~85–100  | 35 + 30 + 10 + 10 + 10              |
| Score caps at 100               | ✓        | `Math.min(100, score)`              |

---

## History Persistence

| Check                    | Status |
|--------------------------|--------|
| Entry listed after Analyze | ✓   |
| Still there after refresh  | ✓   |
| Click loads full analysis  | ✓   |
| Close/reopen browser       | ✓ localStorage persists |

---

## Edge Cases

| Case              | Behavior                                   |
|-------------------|--------------------------------------------|
| Empty JD          | Analyze disabled; "Job description is required to analyze." shown |
| 5000-char JD      | Handled; no overflow                       |
| Browser close     | History remains in localStorage            |

---

## Manual Test Steps

1. **Skill extraction**: Paste "React, Node.js, SQL, AWS" → Analyze → verify 4 skills in Web, Data, Cloud/DevOps.
2. **Fallback**: Paste "Looking for a strong leader" → Analyze → verify "General fresher stack".
3. **History**: Analyze → History → refresh → click entry → verify full results load.
4. **Empty JD**: Leave JD empty → verify disabled Analyze and validation message.
5. **Score**: Short JD + no company → ~40; Long JD + company + role → ~90+.
