import { DNA_SUBTYPES } from '@shared/entrepreneurialDnaData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, Users, Lightbulb, AlertCircle, Target } from 'lucide-react';

interface DnaResultDisplayProps {
  result: {
    defaultType: string;
    subtype: string;
    awarenessPercentage: number;
  };
  onRetakeQuiz: () => void;
}

export default function DnaResultDisplay({ result, onRetakeQuiz }: DnaResultDisplayProps) {
  const subtypeData = DNA_SUBTYPES[result.subtype];
  
  if (!subtypeData) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-8 text-center">
          <p>Unable to load result data. Please try again.</p>
          <Button onClick={onRetakeQuiz} className="mt-4">
            Retake Quiz
          </Button>
        </CardContent>
      </Card>
    );
  }

  const getDnaColor = (category: string) => {
    switch (category) {
      case 'architect': return 'from-blue-600 to-indigo-700';
      case 'alchemist': return 'from-orange-500 to-red-600';
      case 'blurred': return 'from-purple-600 to-pink-600';
      default: return 'from-gray-600 to-gray-700';
    }
  };

  const getAwarenessLevel = (percentage: number) => {
    if (percentage >= 80) return { level: 'Master', color: 'text-green-600' };
    if (percentage >= 60) return { level: 'Advanced', color: 'text-blue-600' };
    if (percentage >= 40) return { level: 'Developing', color: 'text-yellow-600' };
    return { level: 'Emerging', color: 'text-orange-600' };
  };

  const awarenessLevel = getAwarenessLevel(result.awarenessPercentage);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Main Result Header */}
      <Card className={`bg-gradient-to-br ${getDnaColor(subtypeData.category)} text-white`}>
        <CardContent className="p-8 text-center">
          <div className="text-6xl mb-4">{subtypeData.emoji}</div>
          <h1 className="text-4xl font-bold mb-2">{subtypeData.name}</h1>
          <p className="text-xl opacity-90 mb-4">{result.defaultType}</p>
          <Badge variant="secondary" className="text-lg px-4 py-2 bg-white/20 text-white border-white/30">
            {subtypeData.operatingLoop}
          </Badge>
        </CardContent>
      </Card>

      {/* Awareness Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Opposite Mode Awareness
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Awareness Level: {awarenessLevel.level}</span>
            <span className={`font-bold ${awarenessLevel.color}`}>{result.awarenessPercentage}%</span>
          </div>
          <Progress value={result.awarenessPercentage} className="mb-4" />
          <p className="text-gray-600">
            This measures your understanding and integration of the opposite entrepreneurial mode.
            Higher awareness indicates greater adaptability and leadership range.
          </p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Core Identity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Your Core Identity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{subtypeData.coreIdentity}</p>
          </CardContent>
        </Card>

        {/* Your Edge */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Your Edge
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{subtypeData.edge}</p>
          </CardContent>
        </Card>

        {/* Opposite Awareness */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Opposite Mode Awareness
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{subtypeData.oppositeAwareness}</p>
          </CardContent>
        </Card>

        {/* Risks & Blind Spots */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Risks & Blind Spots
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{subtypeData.risks}</p>
          </CardContent>
        </Card>
      </div>

      {/* Next Steps */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">What You Need Next</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-blue-800 leading-relaxed mb-6">{subtypeData.nextSteps}</p>
          
          {subtypeData.complement && (
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">
                Best Complement: {subtypeData.complement.name}
              </h4>
              <p className="text-blue-700 text-sm">{subtypeData.complement.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
          Get Personalized Action Plan
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        <Button variant="outline" size="lg" onClick={onRetakeQuiz}>
          Retake Quiz
        </Button>
      </div>
    </div>
  );
}