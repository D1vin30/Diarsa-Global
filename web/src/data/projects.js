export const projects = [
  {
    slug: 'ekpoma-iruekpen-road',
    cat: 'Civil Engineering',
    title: 'Reconstruction of Ekpoma–Iruekpen Road',
    client: 'Edo State Ministry of Roads & Bridges',
    year: '2022',
    scope: 'Supervising Consultant — review engineering design and working drawings alongside main contractor Setraco Nigeria Limited.',
    overview: [
      'Diarsa Global served as Supervising Consultant on the reconstruction of the Ekpoma–Iruekpen Road, working alongside Setraco Nigeria Limited, one of the country\'s largest construction firms.',
      'Our role covered review of engineering design and working drawings, ensuring the rebuilt corridor meets the durability and drainage standards required for one of Edo State\'s busier inter-town routes.',
    ],
    specs: { location: 'Ekpoma–Iruekpen, Edo State', duration: '2022', discipline: 'Civil / Structural Engineering' },
    outcome: '',
    image: '/projects/road-1.jpg',
    gallery: ['/projects/road-2.jpg'],
    fineprint: '/projects/nigeria-scenic-3.jpg',
  },
  {
    slug: 'edsogpadec-short-roads',
    cat: 'Geomatics & Design',
    title: 'Design of Short Roads, EDSOGPADEC',
    client: 'Edo State Oil & Gas Producing Areas Development Commission',
    year: '2020',
    scope: 'Design data capturing — survey works, soil tests, geotechnical and geophysical survey, and full design reports.',
    overview: [
      'For EDSOGPADEC, Diarsa Global carried out the full design-data capture stage for a set of short access roads across the Commission\'s oil and gas producing areas.',
      'Work included topographic survey, soil testing, and geotechnical and geophysical investigation, feeding into complete design reports used for the roads\' engineering design.',
    ],
    specs: { location: 'Edo State oil & gas producing areas', duration: '2020', discipline: 'Geomatics & Design' },
    outcome: '',
    image: '/projects/survey-1.jpg',
    gallery: ['/projects/survey-2.jpg'],
    fineprint: '/projects/nigeria-scenic-1.jpg',
  },
  {
    slug: 'okhoro-gully-reclamation',
    cat: 'Environmental',
    title: 'Gully Reclamation & Erosion Control, Okhoro Central',
    client: 'Benin City, Edo State',
    year: '2019',
    scope: 'Study and engineering design for flood and erosion control across Okhoro Road, Friendship Street, and surrounding streets.',
    overview: [
      'Okhoro Central was experiencing active gully erosion threatening roads and property across Okhoro Road, Friendship Street, and the surrounding neighbourhood.',
      'Diarsa Global carried out the environmental study and engineering design for flood and erosion control, providing the technical basis for reclamation works in the area.',
    ],
    specs: { location: 'Okhoro Central, Benin City, Edo State', duration: '2019', discipline: 'Environmental Engineering' },
    outcome: '',
    image: '/projects/gully-2.jpg',
    gallery: ['/projects/gully-1.jpg'],
    fineprint: '/projects/nigeria-scenic-2.jpg',
  },
];

export function getProjectBySlug(slug) {
  return projects.find((p) => p.slug === slug);
}
