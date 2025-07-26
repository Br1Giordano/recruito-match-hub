import { Badge } from "@/components/ui/badge";
import { Shield, Users, Building2 } from "lucide-react";

interface RoleBadgeProps {
  role: "admin" | "recruiter" | "company";
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

export function RoleBadge({ role, size = "md", showIcon = true }: RoleBadgeProps) {
  const getIconSize = () => {
    switch (size) {
      case "sm": return "w-3 h-3";
      case "md": return "w-4 h-4";
      case "lg": return "w-5 h-5";
      default: return "w-4 h-4";
    }
  };

  const getTextSize = () => {
    switch (size) {
      case "sm": return "text-xs";
      case "md": return "text-sm";
      case "lg": return "text-base";
      default: return "text-sm";
    }
  };

  switch (role) {
    case "admin":
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 font-medium">
          {showIcon && <Shield className={`${getIconSize()} mr-1`} />}
          <span className={getTextSize()}>Amministratore</span>
        </Badge>
      );
    case "recruiter":
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-medium">
          {showIcon && <Users className={`${getIconSize()} mr-1`} />}
          <span className={getTextSize()}>Recruiter</span>
        </Badge>
      );
    case "company":
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 font-medium">
          {showIcon && <Building2 className={`${getIconSize()} mr-1`} />}
          <span className={getTextSize()}>Azienda</span>
        </Badge>
      );
    default:
      return null;
  }
}

export default RoleBadge;