
export interface FormData {
  biblePassage: string;
  audience: string;
  message: string;
  currentTopics: string;
  specialOccasion?: string;
}

export interface DeepAnalysis {
  title: string;
  content: string;
  sources: string[];
}

export interface HomileticSection {
  main: string;
  deep: DeepAnalysis;
}

export interface ReferenceItem {
  reference: string;
  explanation: string;
}

export interface SermonStructureResult {
  introduction: {
    points: { title: string; description: string }[];
  };
  mainPart: {
    points: { title: string; description: string }[];
  };
  conclusion: {
    summary: string;
    punchyLines: string[];
  };
  interestingReferences: {
    bibleReferences: ReferenceItem[];
    catechismReferences: ReferenceItem[];
  };
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface HomileticResult {
  biblePassage: string;
  bibleWord: string;
  message: string;
  backgrounds: HomileticSection;
  exegesis: HomileticSection;
  context: HomileticSection;
  genre: HomileticSection;
  originalText: HomileticSection;
  theologicalAspects: HomileticSection;
  catechismRef: HomileticSection;
  nacTodayRefs: HomileticSection;
  meditation: HomileticSection;
  communityTransfer: string;
  furtherImpulses: {
    missingWord: string;
    irritatingParts: string;
    goodNews: string;
  };
  translationComparison: {
    zuercher: string;
    guteNachricht: string;
    elberfelder: string;
    volxbibel: string;
  };
  groundingSources?: GroundingSource[];
}
