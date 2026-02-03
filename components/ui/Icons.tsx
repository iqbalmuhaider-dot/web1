import React from 'react';
import { 
  Users, Monitor, Trophy, Layout, Image as ImageIcon, 
  Type, Phone, ArrowUp, ArrowDown, Trash2, Plus, 
  Eye, Edit3, Save, Sparkles, X, Check, Globe,
  Code, HardDrive, Video, MapPin, Mail, Youtube,
  Star, Heart, Shield, Zap, Home, Book, Clock, Calendar,
  LogIn, Activity, BarChart, Link, MessageSquare, Briefcase,
  UserPlus, FileText, HelpCircle, Megaphone, Timer, StickyNote,
  Table, Grid, List, Download, Quote, Newspaper, Tag, Flag
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
  Flag
};

export const iconList = Object.keys(Icons);

export const getIconByName = (name: string, className?: string) => {
  // Check if it is a URL (Direct Link)
  if (name.startsWith('http') || name.startsWith('data:image')) {
    return <img src={name} alt="icon" className={`${className} object-contain`} />;
  }

  // Handle Lucide Icons
  const normalized = name.charAt(0).toUpperCase() + name.slice(1);
  const IconComponent = (Icons as any)[normalized];
  return IconComponent ? <IconComponent className={className} /> : <Icons.Sparkles className={className} />;
};