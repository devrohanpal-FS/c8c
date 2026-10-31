export interface VideoMediaItem {
  id: string;
  title?: string;
  thumbnailUrl: string;
  videoUrl: string;
  caption?: string;
}

export interface FeaturedWorkDetail {
  id: string;
  slug: string;
  title: string;
  subtitleTag: string;
  client: string;
  category: string;
  year: string;
  description: string;
  fullDescription?: string;
  creativeDirectionHeader?: string;
  creativeDirectionBody1?: string;
  creativeDirectionSubhead?: string;
  creativeDirectionBody2?: string;
  tagline?: string;
  videos: VideoMediaItem[];
  quote?: {
    text: string;
    author: string;
    role: string;
    company: string;
  };
  services: string[];
  credits?: string;
  nextProject: {
    slug: string;
    title: string;
    category: string;
    thumbnailUrl: string;
  };
}

export const featuredWorkDetailsMap: Record<string, FeaturedWorkDetail> = {
  'the-players-club': {
    id: '1',
    slug: 'the-players-club',
    title: 'THE PLAYERS CLUB',
    subtitleTag: '• SC EDUCATION LOTTERY •',
    client: 'SC Education Lottery',
    category: 'Commercial Direction',
    year: '2025',
    description: 'High-stakes broadcast commercial direction and cinematic storytelling for SC Education Lottery.',
    fullDescription: 'The Players Club campaign delivered record-breaking engagement through high-energy broadcast direction, stylized set design, and cutting-edge visual effects.',
    creativeDirectionHeader: 'THE CHALLENGE',
    creativeDirectionBody1: 'How do we convince someone to throw out another empty lottery ticket into the trash? Well, you show them how to properly recycle it! Oh, and all these 2-3 figure cash prizes. And then we have those who win 2nd chance prizes to win a trip to a game show: live and re-airing phase. So what\'s the harm in joining a club where you always get more than what you expect...',
    creativeDirectionSubhead: 'GETTING THEM TO DO SOMETHING',
    creativeDirectionBody2: 'Oh yeah, join the SCEL Players Club you\'ll always get more than what you expect. Like MORE chances to win, free games to play, AND 2nd chance drawings to win cash prizes! We created content with "The Play Suits". Connecting Players Club for non-ticket buyers. All you gotta do is join The Club.',
    tagline: 'Because when you play, you really do get more.',
    videos: [
      {
        id: 'v1',
        title: 'Main Broadcast Spot',
        thumbnailUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
        videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
        caption: '30s Commercial Broadcast Cut'
      },
      {
        id: 'v2',
        title: 'Behind the Scenes & Motion Craft',
        thumbnailUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1600&q=80',
        videoUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
        caption: 'Stylized Set & High-Speed Rigging'
      },
      {
        id: 'v3',
        title: 'Character Vignettes & Socials',
        thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
        videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
        caption: 'Targeted Digital Cuts'
      },
      {
        id: 'v4',
        title: 'VFX & Color Pass Reel',
        thumbnailUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1600&q=80',
        videoUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
        caption: 'Volumetric Smoke & Color Grading'
      }
    ],
    quote: {
      text: 'Mad Monkey has the unique ability to create and execute a successful campaign that hits the mark on all of our needs at the Lottery. They have helped produce some of the most iconic lottery commercials in our industry and we are fortunate to have a true partner like these guys.',
      author: 'SALLY W. SWEENEY',
      role: 'VP OF SALES AND MARKETING',
      company: 'SC EDUCATION LOTTERY'
    },
    services: [
      'Creative Concept Development',
      'Production & Post Production',
      'Animation & VFX',
      'Scriptwriting'
    ],
    nextProject: {
      slug: 'skyla-credit-union',
      title: 'SKYLA CREDIT UNION',
      category: 'Brand Strategy & Film',
      thumbnailUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1600&q=80'
    }
  },
  'skyla-credit-union': {
    id: '2',
    slug: 'skyla-credit-union',
    title: 'SKYLA CREDIT UNION',
    subtitleTag: '+ BRAND STRATEGY & FILM +',
    client: 'Skyla Financial',
    category: 'Brand Strategy & Film',
    year: '2025',
    description: 'Complete brand strategy, anthem video production, and visual identity refresh for Skyla Credit Union.',
    fullDescription: 'Rebranding Skyla required a human-centered creative direction, combining candid lifestyle cinematography with modern typography and motion assets.',
    creativeDirectionHeader: 'CREATIVE DIRECTION',
    creativeDirectionBody1: 'Rebranding a premier financial institution requires bridging human warmth with financial confidence. We developed a candid lifestyle cinematography approach that captures real community stories across regional hubs.',
    creativeDirectionSubhead: 'HUMAN-FIRST FINANCIAL BRANDING',
    creativeDirectionBody2: 'By pairing warm 35mm filmic tones with crisp modern serif typography, the brand anthem positions Skyla as a modern financial partner devoted to personal growth and local prosperity.',
    tagline: 'SKYLA: BANKING THAT CELEBRATES HUMAN AMBITION',
    videos: [
      {
        id: 'v1',
        title: 'Brand Anthem Film',
        thumbnailUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1600&q=80',
        videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
        caption: '60s Cinema Anthem Cut'
      },
      {
        id: 'v2',
        title: 'Community Stories',
        thumbnailUrl: 'https://images.unsplash.com/photo-1556742049-0a67daf40955?auto=format&fit=crop&w=1600&q=80',
        videoUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
        caption: 'Documentary Member Spotlight'
      },
      {
        id: 'v3',
        title: 'Visual Identity System',
        thumbnailUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80',
        videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
        caption: 'Motion Graphics & Brand Guidelines'
      }
    ],
    quote: {
      text: 'Working with Cre8tiveCove was easily the most seamless and rewarding creative partnership our marketing team has ever experienced. They took a complex message and turned it into an award-winning campaign that crushed our conversion metrics.',
      author: 'SARAH JENKINS',
      role: 'VP OF MARKETING',
      company: 'SKYLA CREDIT UNION'
    },
    services: [
      'Brand Strategy & Positioning',
      'Film Production & Broadcast',
      'Visual Identity & Systems',
      'Digital Ad Campaign Suite'
    ],
    nextProject: {
      slug: 'conversations',
      title: 'CONVERSATIONS',
      category: 'Public Awareness Campaign',
      thumbnailUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1600&q=80'
    }
  },
  'conversations': {
    id: '3',
    slug: 'conversations',
    title: 'CONVERSATIONS',
    subtitleTag: '+ DOCUMENTARY & AWARENESS +',
    client: 'DAODAS',
    category: 'Public Awareness Campaign',
    year: '2024',
    description: 'Impactful public health campaign featuring multi-channel video spots and digital story arcs.',
    fullDescription: 'Conversations was engineered to drive meaningful dialogue across state channels using documentary-style filmmaking and emotional resonance.',
    creativeDirectionHeader: 'CREATIVE DIRECTION',
    creativeDirectionBody1: 'Addressing public health challenges requires authentic storytelling that breaks through stigma. Conversations brought real voices to light through intimate documentary cinema.',
    creativeDirectionSubhead: 'EMPATHY THROUGH CINEMATOGRAPHY',
    creativeDirectionBody2: 'High-contrast monochrome lighting and raw, unscripted interviews created an emotional narrative arc that drove unprecedented public participation across state channels.',
    tagline: 'CONVERSATIONS: DIALOGUE THAT TRANSFORMS COMMUNITIES',
    videos: [
      {
        id: 'v1',
        title: 'Hero Campaign Film',
        thumbnailUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1600&q=80',
        videoUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
        caption: 'Main Documentary Short'
      },
      {
        id: 'v2',
        title: 'Intimate Micro-Doc Vignettes',
        thumbnailUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1600&q=80',
        videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
        caption: 'Personal Testimonials'
      },
      {
        id: 'v3',
        title: 'Community Impact Stories',
        thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
        videoUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
        caption: 'Statewide Broadcast Series'
      }
    ],
    quote: {
      text: 'The depth of emotional resonance Cre8tiveCove achieved in this campaign set a new standard for public interest communications.',
      author: 'MARCUS VANCE',
      role: 'CAMPAIGN DIRECTOR',
      company: 'DAODAS HEALTH INITIATIVE'
    },
    services: [
      'Documentary Direction',
      'Cinematography & Lighting',
      'Sound Design & Scoring',
      'Multi-channel Distribution'
    ],
    nextProject: {
      slug: 'midlands-tech',
      title: 'MIDLANDS TECH',
      category: '3D WebGL & Motion Craft',
      thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1600&q=80'
    }
  },
  'midlands-tech': {
    id: '4',
    slug: 'midlands-tech',
    title: 'MIDLANDS TECH',
    subtitleTag: '+ 3D WEBGL & MOTION CRAFT +',
    client: 'Follow Your Inner Maverick',
    category: '3D WebGL & Motion Craft',
    year: '2024',
    description: 'Interactive 3D campus web platform and kinetic campaign spot for Midlands Technical College.',
    fullDescription: 'Empowering students to follow their inner maverick with immersive 3D WebGL web experiences, dynamic motion graphics, and bold visual branding.',
    creativeDirectionHeader: 'CREATIVE DIRECTION',
    creativeDirectionBody1: 'How do we inspire the next generation of technical mavericks? By immersing them in interactive 3D WebGL environments paired with high-voltage motion design.',
    creativeDirectionSubhead: 'FOLLOW YOUR INNER MAVERICK',
    creativeDirectionBody2: 'Neon accent lighting, kinetic dynamic typography, and real-time 3D campus navigation created an award-winning recruitment experience.',
    tagline: 'MIDLANDS TECH: UNLEASH YOUR INNER MAVERICK',
    videos: [
      {
        id: 'v1',
        title: '3D WebGL Reel',
        thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1600&q=80',
        videoUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
        caption: 'Interactive 3D Campus Experience'
      },
      {
        id: 'v2',
        title: 'Recruitment Spot',
        thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=80',
        videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
        caption: 'Kinetic Motion Graphic Spot'
      },
      {
        id: 'v3',
        title: 'Interactive Web Prototype',
        thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=80',
        videoUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
        caption: 'UI/UX & Shader Performance'
      }
    ],
    quote: {
      text: 'Cre8tiveCove transformed our student outreach with an immersive digital experience that generated record-breaking prospective student engagement.',
      author: 'ELENA ROSTOVA',
      role: 'DIRECTOR OF COMMUNICATIONS',
      company: 'MIDLANDS TECHNICAL COLLEGE'
    },
    services: [
      '3D WebGL Development',
      'Motion Design & Graphics',
      'Recruitment Broadcast',
      'Interactive Prototyping'
    ],
    nextProject: {
      slug: 'work-doesnt-work',
      title: "WORK DOESN'T WORK",
      category: 'Cinematography & VFX',
      thumbnailUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80'
    }
  },
  'work-doesnt-work': {
    id: '5',
    slug: 'work-doesnt-work',
    title: "WORK DOESN'T WORK",
    subtitleTag: '+ CINEMATOGRAPHY & VFX +',
    client: 'SC DHEC',
    category: 'Cinematography & VFX',
    year: '2023',
    description: 'High-concept anti-vaping commercial featuring surreal VFX and intense dark-mode cinematography.',
    fullDescription: "Work Doesn't Work captured youth culture through high-speed camera rigging, volumetric lighting, and customized particle VFX.",
    creativeDirectionHeader: 'CREATIVE DIRECTION',
    creativeDirectionBody1: 'Capturing youth culture requires cutting-edge cinematic techniques. We built customized camera rigs and atmospheric smoke VFX to depict workplace stress.',
    creativeDirectionSubhead: 'HIGH-CONCEPT VISUAL EFFECTS',
    creativeDirectionBody2: 'Moody cyan tones, deep blacks, and volumetric light shafts created a dark-mode cinematic world that resonated powerfully with target audiences.',
    tagline: "WORK DOESN'T WORK: REIMAGINING PUBLIC HEALTH BROADCASTS",
    videos: [
      {
        id: 'v1',
        title: 'Broadcast Commercial',
        thumbnailUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80',
        videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
        caption: '30s Television Broadcast'
      },
      {
        id: 'v2',
        title: 'VFX Compositing Breakdown',
        thumbnailUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
        videoUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
        caption: 'Particle & Volumetric Pass'
      },
      {
        id: 'v3',
        title: 'Cinematography Reel',
        thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
        videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
        caption: 'High-Speed Camera Rigging'
      }
    ],
    quote: {
      text: 'The visual storytelling and VFX execution were nothing short of extraordinary. The campaign won multiple regional and national advertising awards.',
      author: 'DAVID CHEN',
      role: 'EXECUTIVE CREATIVE DIRECTOR',
      company: 'SC DHEC'
    },
    services: [
      'Cinematography & Lighting',
      'VFX Supervision & Compositing',
      '3D Motion Craft',
      'Sound Design & Master'
    ],
    nextProject: {
      slug: 'the-players-club',
      title: 'THE PLAYERS CLUB',
      category: 'Commercial Direction',
      thumbnailUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80'
    }
  }
};

export function getFeaturedWorkDetailBySlug(slug: string): FeaturedWorkDetail | null {
  if (slug === 'sc-education-lottery-players-club') {
    return featuredWorkDetailsMap['the-players-club'];
  }
  return featuredWorkDetailsMap[slug] || null;
}
