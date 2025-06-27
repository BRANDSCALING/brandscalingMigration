import React from 'react';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PathType } from './QuizContainer';

interface Props {
  onComplete: (path: PathType) => void;
}

const PathChoiceBlock: React.FC<Props> = ({ onComplete }) => {
  return (
    <div className="p-8">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold text-gray-800 mb-4">
          Tell us where you're at in your business journey…
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="max-w-2xl mx-auto space-y-4">
          <Button
            variant="outline"
            className="w-full p-8 text-left justify-start hover:scale-[1.02] transition-all duration-200 hover:shadow-lg"
            onClick={() => onComplete('Early')}
          >
            <div>
              <h3 className="text-lg font-semibold mb-2">Early-stage Entrepreneur</h3>
              <p className="text-gray-600">Less than 1–2 years experience or no team</p>
            </div>
          </Button>

          <Button
            variant="outline"
            className="w-full p-8 text-left justify-start hover:scale-[1.02] transition-all duration-200 hover:shadow-lg"
            onClick={() => onComplete('Developed')}
          >
            <div>
              <h3 className="text-lg font-semibold mb-2">Developed Entrepreneur</h3>
              <p className="text-gray-600">2+ years experience or a team in place</p>
            </div>
          </Button>
        </div>
      </CardContent>
    </div>
  );
};

export default PathChoiceBlock;