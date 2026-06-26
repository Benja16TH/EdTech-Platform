import { useState } from 'react';
import { ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { User, FinalAssessment, UserAssessmentAttempt } from '../types';

interface TakeFinalAssessmentProps {
  courseTitle: string;
  assessment: FinalAssessment;
  user: User;
  lastAttempt: UserAssessmentAttempt | null;
  onSubmit: (answers: number[]) => void;
  onBack: () => void;
}

export default function TakeFinalAssessment({
  courseTitle,
  assessment,
  lastAttempt,
  onSubmit,
  onBack,
}: TakeFinalAssessmentProps) {
  const [answers, setAnswers] = useState<(number | null)[]>(Array(assessment.questions.length).fill(null));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSelectAnswer = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < assessment.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitAssessment = () => {
    if (answers.includes(null)) {
      alert('Por favor responde todas las preguntas antes de enviar');
      return;
    }
    setShowConfirmation(true);
  };

  const handleConfirmSubmit = () => {
    onSubmit(answers as number[]);
  };

  const unansweredCount = answers.filter(a => a === null).length;
  const question = assessment.questions[currentQuestion];
  if (lastAttempt?.passed) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Evaluación ya completada
        </h2>
        <p className="text-gray-600 mb-6">
          Ya has aprobado esta evaluación y no es necesario volver a realizarla.
        </p>
        <button
          onClick={onBack}
          className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
        >
          Volver al curso
        </button>
      </div>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="font-medium">Volver</span>
            </button>
            <div className="text-center flex-1">
              <p className="text-sm text-gray-600">Evaluación Final</p>
              <p className="font-semibold text-gray-800">{courseTitle}</p>
            </div>
            <div className="text-right text-sm text-gray-600">
              <p className="font-medium text-gray-800">
                Pregunta {currentQuestion + 1} de {assessment.questions.length}
              </p>
              <p className="text-xs text-amber-600">
                {unansweredCount} sin responder
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {lastAttempt && (
          <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 border ${
            lastAttempt.passed
              ? 'bg-green-50 border-green-200'
              : 'bg-amber-50 border-amber-200'
          }`}>
            {lastAttempt.passed ? (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-semibold text-gray-800">
                {lastAttempt.passed ? 'Ya has aprobado este curso' : 'Intento anterior: No aprobado'}
              </p>
              <p className="text-sm text-gray-700">
                Puntuación: {Math.round(lastAttempt.score)}% (mínimo requerido: {assessment.passingPercentage}%)
              </p>
              {!lastAttempt.passed && (
                <p className="text-sm text-gray-600 mt-1">
                  Puedes intentar nuevamente. ¡Mucho ánimo!
                </p>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold mb-1">Porcentaje requerido</p>
            <p className="text-2xl font-bold text-blue-600">{assessment.passingPercentage}%</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold mb-1">Total de preguntas</p>
            <p className="text-2xl font-bold text-gray-800">{assessment.questions.length}</p>
          </div>
          <div className={`rounded-lg p-4 shadow-sm border ${
            unansweredCount === 0
              ? 'bg-green-50 border-green-200'
              : 'bg-amber-50 border-amber-200'
          }`}>
            <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold mb-1">Preguntas pendientes</p>
            <p className={`text-2xl font-bold ${unansweredCount === 0 ? 'text-green-600' : 'text-amber-600'}`}>
              {unansweredCount}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="mb-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {currentQuestion + 1}
              </div>
              <h2 className="text-lg font-bold text-gray-800 pt-1 flex-1">
                {question.question}
              </h2>
            </div>
          </div>

          <div className="space-y-3 mb-8">
            {question.options.map((option, idx) => {
              const isSelected = answers[currentQuestion] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectAnswer(idx)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      isSelected
                        ? 'bg-blue-500 border-blue-500'
                        : 'bg-white border-gray-300'
                    }`}>
                      {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{String.fromCharCode(65 + idx)}. {option}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="px-6 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Anterior
            </button>

            {currentQuestion === assessment.questions.length - 1 ? (
              <button
                onClick={handleSubmitAssessment}
                disabled={unansweredCount > 0}
                className="px-8 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Enviar Evaluación
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Siguiente
              </button>
            )}
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
          <p className="text-sm font-semibold text-gray-700 mb-3">Navegador de preguntas</p>
          <div className="grid grid-cols-auto gap-2">
            {assessment.questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentQuestion(idx)}
                className={`w-10 h-10 rounded-lg font-semibold text-sm transition-all ${
                  idx === currentQuestion
                    ? 'bg-blue-600 text-white'
                    : answers[idx] === null
                    ? 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    : 'bg-green-200 text-green-700 hover:bg-green-300'
                }`}
                title={answers[idx] === null ? 'Sin responder' : `Respondida: ${String.fromCharCode(65 + answers[idx]!)}`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      </main>

      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-gray-800 text-lg">Confirmar envío</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Estás a punto de enviar tu evaluación final. Verifica que hayas respondido todas las preguntas correctamente.
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6 text-sm">
              <p className="text-gray-800">
                <span className="font-semibold">Total de preguntas:</span> {assessment.questions.length}
              </p>
              <p className="text-gray-800">
                <span className="font-semibold">Porcentaje requerido para aprobar:</span> {assessment.passingPercentage}%
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmSubmit}
                className="flex-1 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
              >
                Enviar Evaluación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
