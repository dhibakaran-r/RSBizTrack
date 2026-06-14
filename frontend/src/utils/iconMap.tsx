import {
  LayoutDashboard, Building2, Package,
  Tag, Ruler, Truck, BarChart3
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  Building2,
  Package,
  Tag,
  Ruler,
  Truck,
  BarChart3,
};

export const getIcon = (name: string): LucideIcon => {
  return iconMap[name] || LayoutDashboard;
};