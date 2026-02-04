export type BlockType = 'hero' | 'feature' | 'content' | 'gallery' | 'contact' | 'footer' | 'html' | 'drive' | 'video' | 'image' | 'ticker' | 'orgChart' | 'stats' | 'time' | 'visitor' | 'speech' | 'calendar' | 'downloads' | 'faq' | 'cta' | 'countdown' | 'notice' | 'table' | 'staffGrid' | 'testimonial' | 'linkList' | 'news' | 'definition' | 'divider' | 'spacer';

export interface BaseBlock {
  id: string;
  type: BlockType;
}

export interface HeroBlock extends BaseBlock {
  type: 'hero';
  data: {
    title: string;
    subtitle: string;
    bgImage: string;
    buttonText: string;
    buttonLink?: string;
    fontSize?: 'sm' | 'md' | 'lg' | 'xl';
  };
}

export interface FeatureItem {
  title: string;
  description: string;
  icon: string;
  link?: string;
}

export interface FeatureBlock extends BaseBlock {
  type: 'feature';
  data: {
    title: string;
    features: FeatureItem[];
    fontSize?: 'sm' | 'md' | 'lg' | 'xl';
  };
}

export interface ContentBlock extends BaseBlock {
  type: 'content';
  data: {
    title: string;
    body: string;
    alignment: 'left' | 'right' | 'center';
    fontSize?: 'sm' | 'md' | 'lg' | 'xl';
  };
}

export interface GalleryBlock extends BaseBlock {
  type: 'gallery';
  data: {
    title: string;
    images: string[];
  };
}

export interface ContactBlock extends BaseBlock {
  type: 'contact';
  data: {
    title: string;
    email: string;
    phone: string;
    address: string;
    mapUrl: string;
  };
}

export interface FooterBlock extends BaseBlock {
  type: 'footer';
  data: {
    copyright: string;
  };
}

export interface HtmlBlock extends BaseBlock {
  type: 'html';
  data: {
    code: string;
    height: string;
  };
}

export interface DriveBlock extends BaseBlock {
  type: 'drive';
  data: {
    title: string;
    embedUrl: string;
    height: string;
  };
}

export interface VideoBlock extends BaseBlock {
  type: 'video';
  data: {
    title: string;
    url: string;
  };
}

export interface ImageBlock extends BaseBlock {
  type: 'image';
  data: {
    url: string;
    caption: string;
    width: 'full' | 'large' | 'medium' | 'small';
    animation?: 'none' | 'zoom' | 'pan';
  };
}

export interface TickerBlock extends BaseBlock {
  type: 'ticker';
  data: {
    label: string;
    text: string;
    direction: 'left' | 'right';
    speed: number;
  };
}

export interface OrgMember {
  id: string;
  name: string;
  position: string;
  imageUrl: string;
}

export interface OrgChartBlock extends BaseBlock {
  type: 'orgChart';
  data: {
    title: string;
    members: OrgMember[];
    fontSize?: 'sm' | 'md' | 'lg' | 'xl';
  };
}

export interface StatItem {
  id: string;
  label: string;
  value: string;
  icon: string;
}

export interface StatsBlock extends BaseBlock {
  type: 'stats';
  data: {
    title: string;
    items: StatItem[];
  };
}

export interface TimeBlock extends BaseBlock {
  type: 'time';
  data: {
    format: '12h' | '24h';
    showDate: boolean;
    alignment: 'left' | 'center' | 'right';
    bgColor: string;
    textColor: string;
  };
}

export interface VisitorBlock extends BaseBlock {
  type: 'visitor';
  data: {
    label: string;
    count: number;
    showLiveIndicator: boolean;
  };
}

export interface SpeechBlock extends BaseBlock {
  type: 'speech';
  data: {
    title: string;
    text: string;
    imageUrl: string;
    authorName: string;
    authorRole: string;
    fontSize?: 'sm' | 'md' | 'lg' | 'xl';
  };
}

export interface CalendarEvent {
  date: string;
  month: string;
  title: string;
  desc: string;
}

export interface CalendarBlock extends BaseBlock {
  type: 'calendar';
  data: {
    title: string;
    events: CalendarEvent[];
  };
}

export interface DownloadItem {
  title: string;
  url: string;
  type: 'PDF' | 'DOC' | 'FORM';
}

export interface DownloadsBlock extends BaseBlock {
  type: 'downloads';
  data: {
    title: string;
    items: DownloadItem[];
  };
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqBlock extends BaseBlock {
  type: 'faq';
  data: {
    title: string;
    items: FaqItem[];
  };
}

export interface CtaBlock extends BaseBlock {
  type: 'cta';
  data: {
    text: string;
    buttonLabel: string;
    buttonLink: string;
    bgColor: string;
  };
}

export interface CountdownBlock extends BaseBlock {
  type: 'countdown';
  data: {
    title: string;
    targetDate: string;
  };
}

export interface NoticeBlock extends BaseBlock {
  type: 'notice';
  data: {
    title: string;
    content: string;
    color: 'yellow' | 'blue' | 'red' | 'green';
    fontSize?: 'sm' | 'md' | 'lg' | 'xl';
  };
}

export interface TableRow {
  col1: string;
  col2: string;
  col3: string;
}

export interface TableBlock extends BaseBlock {
  type: 'table';
  data: {
    title: string;
    headers: [string, string, string];
    rows: TableRow[];
  };
}

export interface StaffGridBlock extends BaseBlock {
  type: 'staffGrid';
  data: {
    title: string;
    members: OrgMember[];
  };
}

export interface TestimonialBlock extends BaseBlock {
  type: 'testimonial';
  data: {
    quote: string;
    author: string;
    role: string;
  };
}

export interface LinkListItem {
  label: string;
  url: string;
}

export interface LinkListBlock extends BaseBlock {
  type: 'linkList';
  data: {
    title: string;
    links: LinkListItem[];
  };
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  tag: 'KUR' | 'HEM' | 'KOK' | 'PENT';
  content: string;
}

export interface NewsBlock extends BaseBlock {
  type: 'news';
  data: {
    title: string;
    items: NewsItem[];
  };
}

export interface DefinitionItem {
  term: string;
  definition: string;
}

export interface DefinitionBlock extends BaseBlock {
  type: 'definition';
  data: {
    title: string;
    imageUrl: string;
    items: DefinitionItem[];
  };
}

// NEW WIDGETS
export interface DividerBlock extends BaseBlock {
  type: 'divider';
  data: {
    style: 'solid' | 'dashed' | 'dotted';
    color: string;
    thickness: number;
  };
}

export interface SpacerBlock extends BaseBlock {
  type: 'spacer';
  data: {
    height: number;
  };
}

export type SectionBlock = 
  | HeroBlock 
  | FeatureBlock 
  | ContentBlock 
  | GalleryBlock 
  | ContactBlock 
  | FooterBlock 
  | HtmlBlock
  | DriveBlock
  | VideoBlock
  | ImageBlock
  | TickerBlock
  | OrgChartBlock
  | StatsBlock
  | TimeBlock
  | VisitorBlock
  | SpeechBlock
  | CalendarBlock
  | DownloadsBlock
  | FaqBlock
  | CtaBlock
  | CountdownBlock
  | NoticeBlock
  | TableBlock
  | StaffGridBlock
  | TestimonialBlock
  | LinkListBlock
  | NewsBlock
  | DefinitionBlock
  | DividerBlock
  | SpacerBlock;

export interface Page {
  id: string;
  name: string;
  slug: string;
  sections: SectionBlock[];
  subPages?: Page[];
  isOpen?: boolean;
}

export interface WebsiteData {
  title: string;
  font: string; // 'sans', 'serif', 'mono'
  primaryColor?: string;
  secondaryColor?: string;
  pages: Page[];
}