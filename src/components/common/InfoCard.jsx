import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function InfoCard({ icon, title, subtitle, badge }) {
  return (
    <Card className="border-gray-200 bg-white">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-3 text-3xl">{icon}</div>
            <h3 className="mb-1 text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">{subtitle}</p>
          </div>
          {badge && (
            <Badge className="ml-2 bg-gray-300 text-gray-900 hover:bg-gray-400">
              {badge}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
