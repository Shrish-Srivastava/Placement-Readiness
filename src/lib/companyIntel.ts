/**
 * Company Intel — heuristic inference (no external APIs)
 * Industry, size category, typical hiring focus
 */

export type CompanySize = 'startup' | 'mid-size' | 'enterprise';

export interface CompanyIntel {
  companyName: string;
  industry: string;
  sizeCategory: CompanySize;
  hiringFocus: string;
}

const ENTERPRISE_NAMES = [
  'amazon', 'infosys', 'tcs', 'wipro', 'accenture', 'capgemini', 'cognizant',
  'microsoft', 'google', 'meta', 'apple', 'netflix', 'oracle', 'sap',
  'ibm', 'hcl', 'tech mahindra', 'lti', 'mindtree', 'dell', 'hp',
  'cisco', 'vmware', 'salesforce', 'adobe', 'intel', 'nvidia', 'qualcomm',
];

const INDUSTRY_KEYWORDS: [string[], string][] = [
  [['bank', 'finance', 'fintech', 'insurance', 'investments'], 'Financial Services'],
  [['health', 'pharma', 'medical', 'hospital', 'biotech'], 'Healthcare'],
  [['retail', 'ecommerce', 'e-commerce', 'marketplace'], 'Retail / E-commerce'],
  [['education', 'edtech', 'learning'], 'Education'],
  [['travel', 'hospitality', 'hotel'], 'Travel & Hospitality'],
  [['automotive', 'vehicle', 'car'], 'Automotive'],
  [['telecom', 'telecommunication', '5g'], 'Telecommunications'],
];

export function inferCompanyIntel(company: string, jdText: string): CompanyIntel {
  const name = company.trim() || 'Unknown';
  const lower = (company + ' ' + jdText).toLowerCase();

  let industry = 'Technology Services';
  for (const [keywords, label] of INDUSTRY_KEYWORDS) {
    if (keywords.some((kw) => lower.includes(kw))) {
      industry = label;
      break;
    }
  }

  const companyLower = company.trim().toLowerCase();
  const isEnterprise = ENTERPRISE_NAMES.some((n) => companyLower.includes(n));
  const sizeCategory: CompanySize = isEnterprise ? 'enterprise' : 'startup';

  const hiringFocus =
    sizeCategory === 'enterprise'
      ? 'Structured DSA rounds, core CS fundamentals, formal HR rounds.'
      : 'Practical problem solving, stack depth, culture fit.';

  return { companyName: name, industry, sizeCategory, hiringFocus };
}
