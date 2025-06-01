import { Button } from '@/components/ui/button';
import { Download, Printer, BarChart3 } from 'lucide-react';
import { CSVLink } from 'react-csv';

interface InsightsHeaderProps {
  csvData: any[];
  csvFilename: string;
  onPrint: () => void;
}

export default function InsightsHeader({ csvData, csvFilename, onPrint }: InsightsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-purple-100 rounded-lg">
          <BarChart3 className="h-6 w-6 text-purple-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Platform Insights</h1>
          <p className="text-gray-600">Real-time analytics and performance metrics</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <CSVLink
          data={csvData}
          filename={csvFilename}
          className="inline-flex"
        >
          <Button variant="outline" className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </Button>
        </CSVLink>
        
        <Button
          variant="outline"
          onClick={onPrint}
          className="flex items-center space-x-2"
        >
          <Printer className="h-4 w-4" />
          <span>Print View</span>
        </Button>
      </div>
    </div>
  );
}