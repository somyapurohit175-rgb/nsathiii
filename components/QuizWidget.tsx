
import React, { useState } from 'react';
import { QuizQuestion } from '../types';

interface QuizWidgetProps {
  questions: QuizQuestion[];
  onComplete: () => void;
}

const QuizWidget: React.FC<QuizWidgetProps> = ({ questions, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const handleOptionSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    if (idx === questions[currentIndex].correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      onComplete();
    }
  };

  const question = questions[currentIndex];

  return (
    <div className="glass rounded-3xl p-8 apple-shadow max-w-xl mx-auto border border-white/50 animate-fadeIn">
      <div className="flex justify-between items-center mb-8">
        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">Legal Word Coach</span>
        <span className="text-xs font-bold text-gray-400">Step {currentIndex + 1} of {questions.length}</span>
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-8 leading-tight tracking-tight">{question.question}</h3>

      <div className="space-y-4">
        {question.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => handleOptionSelect(idx)}
            className={`w-full p-5 text-left rounded-2xl border transition-all duration-300 font-medium ${
              isAnswered
                ? idx === question.correctAnswer
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 shadow-sm'
                  : selectedOption === idx
                    ? 'bg-red-500/10 border-red-500/30 text-red-700'
                    : 'bg-gray-50/30 border-gray-100 text-gray-400 opacity-60'
                : 'bg-white/40 border-white/60 text-gray-800 hover:border-indigo-400 hover:bg-white/80 hover:translate-x-1'
            }`}
          >
            <div className="flex items-center">
              <span className="w-8 h-8 rounded-lg bg-black/5 flex items-center justify-center mr-4 text-xs font-bold text-gray-500">
                {String.fromCharCode(65 + idx)}
              </span>
              {option}
            </div>
          </button>
        ))}
      </div>

      {isAnswered && (
        <div className="mt-8 animate-fadeIn">
          <div className={`p-5 rounded-2xl mb-6 border backdrop-blur-sm ${selectedOption === question.correctAnswer ? 'bg-emerald-50/50 border-emerald-200 text-emerald-800' : 'bg-red-50/50 border-red-200 text-red-800'}`}>
            <p className="text-sm font-medium leading-relaxed">{question.explanation}</p>
          </div>
          <button
            onClick={nextQuestion}
            className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center group"
          >
            {currentIndex === questions.length - 1 ? 'Finish Module' : 'Continue'}
            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizWidget;
