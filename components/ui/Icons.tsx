import React from 'react';
import { 
  Users, Monitor, Trophy, Layout, Image as ImageIcon, 
  Type, Phone, ArrowUp, ArrowDown, Trash2, Plus, 
  Eye, Edit3, Save, Sparkles, X, Check, Globe,
  Code, HardDrive, Video, MapPin, Mail, Youtube,
  Star, Heart, Shield, Zap, Home, Book, Clock, Calendar,
  LogIn, Activity, BarChart, Link, MessageSquare, Briefcase,
  UserPlus, FileText, HelpCircle, Megaphone, Timer, StickyNote,
  Table, Grid, List, Download, Quote, Newspaper, Tag, Flag,
  Settings, AlertTriangle, Info, AlignLeft, AlignCenter, AlignJustify,
  ExternalLink, ChevronDown, Columns, AlignRight, Music, ChevronsUp, ChevronsDown,
  Facebook, Instagram, Twitter, Linkedin, Github,
  ArrowRight, PlusCircle
} from 'lucide-react';

export const Icons = {
  Users,
  Monitor,
  Trophy,
  Layout,
  Image: ImageIcon,
  Type,
  Phone,
  ArrowUp,
  ArrowDown,
  Trash2,
  Plus,
  Eye,
  Edit: Edit3,
  Save,
  Sparkles,
  X,
  Check,
  Globe,
  Code,
  Drive: HardDrive,
  Video,
  MapPin,
  Mail,
  Youtube,
  Star,
  Heart,
  Shield,
  Zap,
  Home,
  Book,
  Clock,
  Calendar,
  LogIn,
  Activity,
  BarChart,
  Link,
  MessageSquare,
  Briefcase,
  UserPlus,
  FileText,
  HelpCircle,
  Megaphone,
  Timer,
  StickyNote,
  Table,
  Grid,
  List,
  Download,
  Quote,
  Newspaper,
  Tag,
  Flag,
  Settings,
  AlertTriangle,
  Info,
  AlignLeft,
  AlignCenter,
  AlignJustify,
  ExternalLink,
  ChevronDown,
  Columns,
  AlignRight,
  Music,
  ChevronsUp,
  ChevronsDown,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Github,
  ArrowRight,
  PlusCircle
};

export const iconList = Object.keys(Icons);

export const getIconByName = (name: string, className?: string) => {
  // Check if it is a URL (Direct Link)
  if (name.startsWith('http') || name.startsWith('data:image')) {
    return <img src={name} alt="icon" className={`${className} object-contain`} />;
  }

  // Handle Lucide Icons (Case insensitive lookup)
  const normalized = name.charAt(0).toUpperCase() + name.slice(1);
  // Try exact match first, then case insensitive keys
  let IconComponent = (Icons as any)[normalized];
  
  if (!IconComponent) {
     const key = Object.keys(Icons).find(k => k.toLowerCase() === name.toLowerCase());
     if (key) IconComponent = (Icons as any)[key];
  }

  return IconComponent ? <IconComponent className={className} /> : <Icons.Sparkles className={className} />;
};