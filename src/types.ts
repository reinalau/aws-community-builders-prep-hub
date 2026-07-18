export interface Slide {
  id: number;
  title: string;
  subtitle?: string;
  category: string;
  content: string[];
  notes: string;
  layout?: "title" | "content" | "interactive" | "bento" | "quote";
  iconName?: string;
}

export interface ContributionLink {
  id: string;
  url: string;
  type: "blog" | "video" | "talk" | "open-source" | "community" | "podcast" | "other";
}

export interface ApplicationDraft {
  track: string;
  contributions: string;
  motivation: string;
  links: ContributionLink[];
}

export interface TrackInfo {
  name: string;
  key: string;
  iconName: string;
  description: string;
  examples: string[];
}

export interface AIReviewResult {
  score: number;
  nailed: string[];
  improvements: string[];
  polishedContributions: string;
  polishedMotivation: string;
  encouragement: string;
}

export interface UsefulLink {
  id: string;
  title: string;
  description: string;
  url: string;
  category: "Creadores" | "Cursos y Aprendizaje" | "Comunidades" | "Ideas y Contenido";
  author?: string;
}

