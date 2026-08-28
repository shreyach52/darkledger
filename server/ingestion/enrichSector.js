const SECTOR_KEYWORDS = {
  Healthcare: ['hospital', 'health', 'medical', 'clinic', 'dental', 'dentist', 'cancer', 'cardiology', 'urgent care', 'ophthalmology'],
  Manufacturing: ['manufactur', 'foundry', 'fabrication', 'industrial equipment', 'metal', 'steel', 'machining'],
  Construction: ['construction', 'paving', 'building materials', 'contractor'],
  Legal: ['law firm', 'llp', 'legal', 'attorney', 'studio legale'],
  Finance: ['bank', 'financial', 'nbfc', 'capital', 'accounting', 'insurance', 'settlement'],
  Technology: ['software', 'it company', 'saas', 'cloud', 'engineering software', 'sap', 'erp'],
  Retail: ['fashion', 'supermarket', 'apparel', 'retail', 'brand'],
  Government: ['government', 'public administrative', 'ministry', 'council'],
  Education: ['college', 'university', 'school', 'education'],
  Automotive: ['automobile', 'automotive', 'dealers', 'honda', 'vehicle'],
  Agriculture: ['agriculture', 'agroland', 'farm', 'organic food'],
  Energy: ['power generation', 'energy', 'terminal', 'fuel', 'oil'],
};

function deriveSector(description) {
  const text = (description || '').toLowerCase();
  for (const [sector, keywords] of Object.entries(SECTOR_KEYWORDS)) {
    if (keywords.some((kw) => text.includes(kw))) return sector;
  }
  return 'Unclassified';
}

module.exports = { deriveSector, SECTOR_KEYWORDS };