import {
  Factory, Cpu, Briefcase, Hammer, Car, HardHat, Zap, FlaskConical, Plane,
  Wheat, Truck, Bot, Code2, Brain, Cloud, ShieldCheck, BarChart3, Server,
  Radio, CircuitBoard, Blocks, Lightbulb, Wallet, Scale, Megaphone,
  Stethoscope, Building2, ShoppingCart, Hotel, Clapperboard, Settings,
  GraduationCap, Users, Target, TrendingUp, PackageSearch, Ship, Mountain,
  Flame, Leaf, Crosshair, MonitorSmartphone, type LucideIcon, type LucideProps,
} from "lucide-react";

const registry: Record<string, LucideIcon> = {
  Factory, Cpu, Briefcase, Hammer, Car, HardHat, Zap, FlaskConical, Plane,
  Wheat, Truck, Bot, Code2, Brain, Cloud, ShieldCheck, BarChart3, Server,
  Radio, CircuitBoard, Blocks, Lightbulb, Wallet, Scale, Megaphone,
  Stethoscope, Building2, ShoppingCart, Hotel, Clapperboard, Settings,
  GraduationCap, Users, Target, TrendingUp, PackageSearch, Ship, Mountain,
  Flame, Leaf, Crosshair, MonitorSmartphone,
};

export function DynamicIcon({ name, ...props }: { name: string } & LucideProps) {
  const Icon = registry[name] ?? Briefcase;
  return <Icon {...props} />;
}
