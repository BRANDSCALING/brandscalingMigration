import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
}

export default function StatsCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  iconColor,
  iconBg,
}: StatsCardProps) {
  const getChangeColor = () => {
    switch (changeType) {
      case "positive":
        return "text-emerald-600 bg-emerald-100";
      case "negative":
        return "text-red-600 bg-red-100";
      default:
        return "text-amber-600 bg-amber-100";
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center`}>
            <Icon className={`${iconColor} w-6 h-6`} />
          </div>
          <Badge variant="secondary" className={`text-xs font-medium ${getChangeColor()}`}>
            {change}
          </Badge>
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-1">{value}</h3>
        <p className="text-slate-600 text-sm">{title}</p>
      </CardContent>
    </Card>
  );
}
