const IconCivil = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M8 3L4 21" strokeLinecap="round" />
    <path d="M16 3L20 21" strokeLinecap="round" />
    <path d="M12 6v2M12 11v2M12 16v2" strokeLinecap="round" />
  </svg>
);

const IconGeomatics = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="4" r="2" />
    <path d="M12 6v5" strokeLinecap="round" />
    <path d="M12 11L5 21M12 11l7 10M7 17h10" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconEnvironmental = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M5 19C5 10 12 4 20 4c0 8-6 15-15 15Z" strokeLinejoin="round" />
    <path d="M5 19c3-5 7-8 12-10" strokeLinecap="round" />
  </svg>
);

const IconGeneral = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M4 21V7l8-4 8 4v14" strokeLinejoin="round" />
    <path d="M9 21v-6h6v6" strokeLinejoin="round" />
  </svg>
);

const categoryIcons = {
  'Civil Engineering': IconCivil,
  'Geomatics & Design': IconGeomatics,
  Environmental: IconEnvironmental,
};

export function CategoryIcon({ category }) {
  const Icon = categoryIcons[category] || IconGeneral;
  return <Icon />;
}
