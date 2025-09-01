import { useParams } from "wouter";
import { ResumeWizard } from "@/components/ResumeWizard";

export default function ResumeWizardPage() {
  const params = useParams<{ modelId: string }>();
  
  if (!params.modelId) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Model Not Found</h3>
          <p className="text-gray-600">No model ID provided for editing.</p>
        </div>
      </div>
    );
  }

  return <ResumeWizard modelId={params.modelId} />;
}