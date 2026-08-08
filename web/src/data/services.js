export const services = [
  {
    slug: 'civil-engineering-consultancy',
    num: '01',
    title: 'Civil Engineering Consultancy',
    tagline:
      'Highway design, bridge engineering, drainage and flood control — planning, design, and construction supervision for Edo State\'s road and civil infrastructure.',
    image: '/services/civil-structural.jpg',
    overview: [
      'Civil engineering is where most of our engagements start and end — roads, bridges, and the drainage systems that keep them standing through Nigeria\'s rainy season.',
      'We carry projects from early design through construction supervision, working alongside contractors rather than handing off a design and walking away.',
    ],
    stats: [
      { value: '7', label: 'Core Capabilities' },
      { value: 'Design Through Supervision', label: 'Full Project Lifecycle' },
    ],
    capabilities: [
      'Highway & Road Engineering',
      'Drainage & Stormwater Management',
      'Bridges & Culverts',
      'Structural Engineering',
      'Construction Supervision',
      'Infrastructure Planning',
      'Traffic Studies & Road Furniture',
    ],
    whyItMatters: {
      heading: 'Infrastructure That Has to Work Through the Rains',
      body: [
        'Edo State\'s roads and bridges carry heavy daily traffic through a long wet season. A design that looks right on paper can fail within a few rainy seasons if drainage, foundations, and pavement structure aren\'t sized to the real ground and rainfall conditions.',
        'Clients need a civil engineering partner who designs for how a road actually behaves under Nigerian traffic and Nigerian weather, not a generic template.',
      ],
    },
    approach: {
      heading: 'From Design Table to Site Supervision',
      body: [
        'We handle highway and road design, bridge and structural engineering, drainage and flood control, and traffic studies in-house, then stay on through construction supervision to keep the built work aligned with the approved design intent.',
      ],
      lifecycle: [
        { stage: 'Plan & Design', text: 'Highway, drainage, and structural design sized to the site\'s real traffic and rainfall conditions.' },
        { stage: 'Construct & Supervise', text: 'Site supervision and drawing review through earthworks, structure, and pavement stages.' },
        { stage: 'Maintain & Advise', text: 'Post-completion technical advisory as roads and structures come under live traffic.' },
      ],
    },
    quote: {
      text: 'A road is only as good as the drainage nobody sees. That\'s where we spend most of our design attention.',
      role: 'Civil Engineering Team, Diarsa Global',
    },
    outcome:
      'Our civil engineering work has carried projects like the Ekpoma–Iruekpen Road reconstruction from design review through to a rebuilt, trafficked corridor.',
    relatedProjectSlugs: ['ekpoma-iruekpen-road'],
  },
  {
    slug: 'geomatics-engineering',
    num: '02',
    title: 'Geomatics Engineering',
    tagline: 'Topographic, cadastral, hydrographic, and marine geophysical survey — the precise spatial data every design starts from.',
    image: '/services/geomatics.jpg',
    overview: [
      'No design — road, drainage, or building — is better than the survey data it\'s built on. Our geomatics team captures that ground truth before a single design drawing is made.',
      'Because survey and design sit under one roof at Diarsa Global, field data moves straight into engineering work without the delays of an outside survey contractor.',
    ],
    stats: [
      { value: '8', label: 'Core Capabilities' },
      { value: 'Field to Report', label: 'Full Data Lifecycle' },
    ],
    capabilities: [
      'Topographic & Route Survey',
      'Hydrographic & Bathymetric Survey',
      'Cadastral & Legal Survey',
      'Marine Geophysical Survey',
      'Drone (UAV) Survey',
      '3D Laser Scanning',
      'Construction Setting-Out',
      'Control Networks & Deformation Monitoring',
    ],
    whyItMatters: {
      heading: 'Every Design Starts With Accurate Ground Data',
      body: [
        'Inaccurate topographic or cadastral survey doesn\'t show up until later — as cost overruns, boundary disputes, or designs that don\'t match the ground they\'re built on.',
        'Clients need spatial data captured once, correctly, in a form their engineers and design team can actually use.',
      ],
    },
    approach: {
      heading: 'Field Data That Feeds Straight Into Design',
      body: [
        'We carry out topographic, cadastral, hydrographic, and marine geophysical survey, drone-based capture, and 3D laser scanning, using the same team from field capture through to the maps and reports engineers design from.',
      ],
      lifecycle: [
        { stage: 'Capture', text: 'Topographic, cadastral, hydrographic, and drone-based field survey.' },
        { stage: 'Process', text: 'Control networks, setting-out, and deformation monitoring against the captured data.' },
        { stage: 'Deliver', text: 'Design-ready survey reports and models handed straight to the engineering team.' },
      ],
    },
    quote: {
      text: 'Good survey work is invisible when it\'s done right — the design just fits the ground the first time.',
      role: 'Geomatics Team, Diarsa Global',
    },
    outcome:
      'Our geomatics work gave EDSOGPADEC a complete, design-ready data package for its short-roads programme.',
    relatedProjectSlugs: ['edsogpadec-short-roads'],
  },
  {
    slug: 'gis-digital-mapping',
    num: '03',
    title: 'GIS & Digital Mapping',
    tagline: 'Digital mapping, spatial analysis, and satellite imagery — turning raw geospatial data into decisions clients can act on.',
    image: '/services/gis-mapping.jpg',
    overview: [
      'Survey data only becomes useful once it\'s organised, layered, and made queryable. Our GIS team turns raw geospatial capture into maps and systems that clients actually use.',
      'From satellite imagery to asset registers, this is the layer that lets an organisation see its own land, infrastructure, and risk in one place.',
    ],
    stats: [
      { value: '7', label: 'Core Capabilities' },
      { value: 'Data to Decision', label: 'Full GIS Pipeline' },
    ],
    capabilities: [
      'Digital & Satellite Mapping',
      'Spatial Analysis',
      'Drone Mapping & Orthophotography',
      'Land Information Systems',
      'Asset Mapping',
      'DEMs, DSMs & 3D Models',
      'Geo-Information Policy',
    ],
    whyItMatters: {
      heading: 'Data Without a System Is Just a File',
      body: [
        'Organisations that capture survey and satellite data without a proper GIS behind it end up with folders of disconnected files instead of a usable spatial record.',
        'Clients need their land, assets, and infrastructure mapped into a system that can answer real questions — not just a static drawing.',
      ],
    },
    approach: {
      heading: 'Building Maps That Get Used, Not Filed Away',
      body: [
        'We build digital and satellite mapping, spatial analysis, and land information systems around the client\'s actual decisions, backed by drone orthophotography and elevation models where the terrain calls for it.',
      ],
      lifecycle: [
        { stage: 'Acquire', text: 'Satellite imagery, drone mapping, and elevation model capture.' },
        { stage: 'Structure', text: 'Spatial analysis and land information systems built around client-specific layers.' },
        { stage: 'Apply', text: 'Asset mapping and geo-information policy support for ongoing decisions.' },
      ],
    },
    quote: {
      text: 'A map that only shows what exists is a picture. A map you can query is a decision tool.',
      role: 'GIS & Mapping Team, Diarsa Global',
    },
    outcome: 'This service is early-stage at Diarsa Global — case studies will be added as GIS-specific engagements complete.',
    relatedProjectSlugs: [],
  },
  {
    slug: 'hydrological-water-resources',
    num: '04',
    title: 'Hydrological & Water Resources Studies',
    tagline: 'Flood risk modelling, hydraulic design, and river engineering — water studies built for Nigeria\'s rainfall, not generic templates.',
    image: '/services/hydrology.jpg',
    overview: [
      'Flooding, gully erosion, and drainage failure are recurring threats to roads, property, and communities across Edo State — not edge cases a generic engineering approach can safely ignore.',
      'Effective flood and erosion control starts with genuinely understanding how water moves through a site, not applying a standard fix and hoping it holds.',
    ],
    stats: [
      { value: '6', label: 'Core Capabilities' },
      { value: 'Study to Design', label: 'Full Technical Basis' },
    ],
    capabilities: [
      'Flood Risk Assessment & Modelling',
      'Hydraulic Design',
      'Watershed Analysis',
      'Stormwater Management',
      'River Engineering',
      'Erosion & Gully Reclamation',
    ],
    whyItMatters: {
      heading: 'Water Doesn\'t Follow Generic Designs',
      body: [
        'Gully erosion and flooding advance on their own logic — the way stormwater actually reaches and enlarges a drainage or erosion system on a specific site, not how a standard textbook case behaves.',
        'A technical basis grounded in real hydraulic and watershed data is what separates a fix that holds from one that fails the next rainy season.',
      ],
    },
    approach: {
      heading: 'Studying the Water Before Designing the Fix',
      body: [
        'We carry out flood risk assessment, hydraulic design, watershed analysis, and river engineering studies, grounded in how stormwater actually behaves on each site, feeding directly into erosion and drainage control designs.',
      ],
      lifecycle: [
        { stage: 'Study', text: 'Watershed analysis and flood risk assessment across the affected catchment.' },
        { stage: 'Model', text: 'Hydraulic design and flood modelling sized to the site\'s real conditions.' },
        { stage: 'Design', text: 'Stormwater, river engineering, and erosion control measures built from the study.' },
      ],
    },
    quote: {
      text: 'Erosion control only works if the design respects how water actually moves through a site.',
      role: 'Water Resources Team, Diarsa Global',
    },
    outcome:
      'This work gave Okhoro Central a technical basis for erosion and flood control targeted at the streets most at risk.',
    relatedProjectSlugs: ['okhoro-gully-reclamation'],
  },
  {
    slug: 'environmental-consultancy',
    num: '05',
    title: 'Environmental Consultancy',
    tagline: 'Environmental impact assessment and ecological studies — engineering that accounts for Nigeria\'s terrain and climate, not around it.',
    image: '/services/environmental-consultancy.jpg',
    overview: [
      'Infrastructure projects don\'t happen in isolation from the land and communities around them. Our environmental team assesses that impact before it becomes a problem, not after.',
      'From impact assessments to climate adaptation planning, this is the discipline that keeps a project accountable to the environment it\'s built in.',
    ],
    stats: [
      { value: '5', label: 'Core Capabilities' },
      { value: 'Assessment to Plan', label: 'Full Study Basis' },
    ],
    capabilities: [
      'Environmental Impact Assessment (EIA)',
      'Environmental Management Plans',
      'Ecological & Social Impact Studies',
      'Climate Change Adaptation',
      'Sustainability Assessment',
    ],
    whyItMatters: {
      heading: 'Projects Are Accountable to the Land They\'re Built On',
      body: [
        'Skipping or rushing an environmental assessment doesn\'t make a project\'s impact disappear — it just means that impact gets discovered later, when it\'s harder and more expensive to address.',
        'Clients need an honest, technically grounded read on a project\'s ecological and social footprint before construction starts.',
      ],
    },
    approach: {
      heading: 'Assessing the Impact Before It Happens',
      body: [
        'We carry out environmental impact assessments, ecological and social impact studies, and climate change adaptation planning, producing management plans that give clients a clear, defensible basis for how a project addresses its footprint.',
      ],
      lifecycle: [
        { stage: 'Assess', text: 'Environmental and social impact assessment across the project footprint.' },
        { stage: 'Plan', text: 'Environmental management plans addressing the assessed risks.' },
        { stage: 'Adapt', text: 'Climate change adaptation and sustainability recommendations built into the project.' },
      ],
    },
    quote: {
      text: 'An impact assessment is only useful if it changes the design. Ours are written to be acted on.',
      role: 'Environmental Team, Diarsa Global',
    },
    outcome:
      'Our environmental study work has underpinned reclamation efforts like the Okhoro Central erosion and flood control project.',
    relatedProjectSlugs: ['okhoro-gully-reclamation'],
  },
  {
    slug: 'project-planning-advisory',
    num: '06',
    title: 'Project Planning & Advisory',
    tagline: 'Contract administration, quality control, and technical advisory — carrying projects from design through delivery.',
    image: '/services/project-management.jpg',
    overview: [
      'Even a sound engineering design can go wrong on site without disciplined contract administration and quality control.',
      'This is the discipline that ties our civil, geomatics, and environmental work together into projects that are actually delivered — on specification, not just on paper.',
    ],
    stats: [
      { value: '6', label: 'Core Capabilities' },
      { value: 'Design to Delivery', label: 'End-to-End Oversight' },
    ],
    capabilities: [
      'Contract Administration & BEME',
      'Quality Assurance & Quality Control',
      'Construction Monitoring',
      'Project Evaluation',
      'Technical Advisory Services',
      'Valuation & Estate Management',
    ],
    whyItMatters: {
      heading: 'Good Design Still Needs Careful Delivery',
      body: [
        'Even a sound engineering design can go wrong on site without disciplined contract administration and quality control. Clients need oversight that catches problems early, not after they\'re built into the structure.',
        'That oversight has to be backed by real technical evaluation — decisions made on evidence, not assumption.',
      ],
    },
    approach: {
      heading: 'Carrying Projects From Design Through Delivery',
      body: [
        'We provide contract administration and Bill of Engineering Measurement and Evaluation (BEME), quality assurance, construction monitoring, and technical advisory across a project\'s life.',
      ],
      lifecycle: [
        { stage: 'Administer', text: 'Contract administration and BEME set up against the approved scope.' },
        { stage: 'Monitor', text: 'Quality assurance and construction monitoring through delivery.' },
        { stage: 'Evaluate', text: 'Project evaluation and technical advisory once works are complete.' },
      ],
    },
    quote: {
      text: 'Every drawing we review and every stage we supervise has one goal: a project that still works long after we\'ve moved on.',
      role: 'Project Advisory Team, Diarsa Global',
    },
    outcome:
      'Our supervision role on the Ekpoma–Iruekpen Road reconstruction is a direct example of this discipline in practice.',
    relatedProjectSlugs: ['ekpoma-iruekpen-road'],
  },
  {
    slug: 'research-development',
    num: '07',
    title: 'Research & Development',
    tagline: 'Engineering research, data analytics, and decision support — the analytical layer behind our other six disciplines.',
    image: '/services/research-development.jpg',
    overview: [
      'Every discipline at Diarsa Global draws on the same analytical foundation — engineering research, data analytics, and geospatial modelling that inform how we approach a site before design work begins.',
      'This is also where we invest in capacity building, developing the technical skills that keep the rest of the firm current.',
    ],
    stats: [
      { value: '4', label: 'Core Capabilities' },
      { value: 'Firm-Wide', label: 'Analytical Backbone' },
    ],
    capabilities: ['Engineering Research', 'Data Analytics & Geospatial Modelling', 'Decision Support Systems', 'Capacity Building & Training'],
    whyItMatters: {
      heading: 'Decisions Are Only as Good as the Data Behind Them',
      body: [
        'Engineering judgement improves when it\'s backed by real data and modelling, not intuition alone. Firms that skip this layer end up re-learning the same lessons project after project.',
        'Clients benefit from a consultancy that treats research and data analysis as part of the deliverable, not an afterthought.',
      ],
    },
    approach: {
      heading: 'The Analytical Layer Behind Every Discipline',
      body: [
        'We invest in engineering research, data analytics, and geospatial modelling that feed into decision support for our civil, geomatics, environmental, and advisory work, alongside ongoing capacity building for our technical team.',
      ],
      lifecycle: [
        { stage: 'Research', text: 'Engineering research grounding our approach to each new site or problem.' },
        { stage: 'Model', text: 'Data analytics and geospatial modelling applied to the project at hand.' },
        { stage: 'Support', text: 'Decision support and capacity building carried back into the firm.' },
      ],
    },
    quote: {
      text: 'Every discipline we offer gets sharper when it\'s backed by real research, not just experience.',
      role: 'Research & Development Team, Diarsa Global',
    },
    outcome: 'This capability underpins how we approach every engagement — a dedicated case study will follow as R&D-specific work is documented.',
    relatedProjectSlugs: [],
  },
];

export function getServiceBySlug(slug) {
  return services.find((s) => s.slug === slug);
}
