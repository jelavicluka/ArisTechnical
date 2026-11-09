export const defaultCategories = [
  {
    title: 'ARIS Administration',
    shortTitle: 'Administration',
    slug: 'administration',
    description:
      'ARIS method and filter configuration, including model and object types, symbols, databases and related conventions.',
    sortOrder: 10,
  },
  {
    title: 'ARIS Custom Reports & Scripts',
    shortTitle: 'Reports & Scripts',
    slug: 'scripting',
    description:
      'Custom reports, macros, JavaScript, Java packages and maintenance required after ARIS version changes.',
    sortOrder: 20,
  },
  {
    title: 'ARIS APG Automation',
    shortTitle: 'APG Automation',
    slug: 'apg-automation',
    description: 'Automated processes, governance workflows and operational improvements built with ARIS APG.',
    sortOrder: 30,
  },
  {
    title: 'ARIS REST API & Integrations',
    shortTitle: 'API & Integrations',
    slug: 'rest-api-integrations',
    description: 'Reliable integrations between ARIS and surrounding business systems using supported interfaces.',
    sortOrder: 40,
  },
  {
    title: 'ARIS Installation & Setup',
    shortTitle: 'Installation & Setup',
    slug: 'installation-setup',
    description: 'Installation, upgrades, configuration and environment setup for maintainable ARIS platforms.',
    sortOrder: 50,
  },
  {
    title: 'ARIS Connect Customization',
    shortTitle: 'Connect Customization',
    slug: 'connect-customization',
    description: 'Practical guidance for tailoring ARIS Connect portal styling, navigation and appearance.',
    sortOrder: 60,
  },
] as const
