
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Trash2 } from "lucide-react";

interface BulkActionsBarProps {
  selectedCount: number;
  onBulkApprove: () => void;
  onBulkReject: () => void;
  onBulkDelete: () => void;
  onClearSelection: () => void;
}

export default function BulkActionsBar({
  selectedCount,
  onBulkApprove,
  onBulkReject,
  onBulkDelete,
  onClearSelection
}: BulkActionsBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {selectedCount} selezionate
          </Badge>
          <span className="text-sm text-gray-600">Azioni di gruppo:</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={onBulkApprove}
          >
            <CheckCircle className="w-4 h-4 mr-1" />
            Approva Tutto
          </Button>
          
          <Button
            size="sm"
            variant="destructive"
            onClick={onBulkReject}
          >
            <XCircle className="w-4 h-4 mr-1" />
            Rifiuta Tutto
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={onBulkDelete}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Elimina
          </Button>
          
          <Button size="sm" variant="ghost" onClick={onClearSelection}>
            Annulla
          </Button>
        </div>
      </div>
    </div>
  );
}
