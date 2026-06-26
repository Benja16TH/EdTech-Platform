import { CheckCircle, XCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { FinalAssessment, UserAssessmentAttempt } from '../types';

interface AssessmentResultsProps {
  courseTitle: string;
  assessment: FinalAssessment;
  attempt: UserAssessmentAttempt;
  onRetake?: () => void;
  onContinue: () => void;
}

export default function AssessmentResults({
  courseTitle,
  assessment,
  attempt,
  onRetake,
  onContinue,
}: AssessmentResultsProps) {
  const percentage = attempt.score;
  const passed = attempt.passed;
  const correctAnswers = assessment.questions.filter((q, idx) => attempt.answers[idx] === q.correctAnswerIndex).length;
  const totalQuestions = assessment.questions.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className={`rounded-2xl shadow-2xl overflow-hidden ${passed ? 'bg-gradient-to-br from-green-50 to-emerald-50' : 'bg-gradient-to-br from-red-50 to-rose-50'}`}>
          <div className={`pt-12 pb-8 px-8 text-center ${passed ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-red-500 to-rose-600'}`}>
            <div className="flex justify-center mb-4">
              {passed ? (
                <CheckCircle className="w-24 h-24 text-white" strokeWidth={1.5} />
              ) : (
                <XCircle className="w-24 h-24 text-white" strokeWidth={1.5} />
              )}
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              {passed ? 'Felicitaciones' : 'No aprobado'}
            </h1>
            <p className="text-lg text-white/90">
              {passed
                ? 'Has completado exitosamente el curso'
                : 'Por favor intenta nuevamente'}
            </p>
          </div>

          <div className="px-8 py-12">
            <div className="text-center mb-8">
              <p className="text-gray-600 text-sm font-semibold uppercase tracking-wider mb-2">
                Puntuación Final
              </p>
              <div className="text-6xl font-bold mb-2 flex items-center justify-center gap-1">
                <span className={passed ? 'text-green-600' : 'text-red-600'}>
                  {Math.round(percentage)}%
                </span>
              </div>
              <p className="text-gray-600">
                Porcentaje mínimo requerido: <span className="font-semibold">{assessment.passingPercentage}%</span>
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                <p className="text-2xl font-bold text-green-600">{correctAnswers}</p>
                <p className="text-sm text-gray-600 font-medium">Respuestas Correctas</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                <p className="text-2xl font-bold text-red-600">{totalQuestions - correctAnswers}</p>
                <p className="text-sm text-gray-600 font-medium">Respuestas Incorrectas</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                <p className="text-2xl font-bold text-blue-600">{totalQuestions}</p>
                <p className="text-sm text-gray-600 font-medium">Total de Preguntas</p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
              <h3 className="font-semibold text-gray-800 mb-4">Resumen del Curso</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Curso:</span>
                  <span className="font-semibold text-gray-800">{courseTitle}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Total de preguntas:</span>
                  <span className="font-semibold text-gray-800">{totalQuestions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Preguntas correctas:</span>
                  <span className={`font-semibold ${passed ? 'text-green-600' : 'text-red-600'}`}>
                    {correctAnswers} de {totalQuestions}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-gray-700 font-semibold">Estado:</span>
                  <span className={`font-bold ${passed ? 'text-green-600' : 'text-red-600'}`}>
                    {passed ? 'APROBADO' : 'NO APROBADO'}
                  </span>
                </div>
              </div>
            </div>

            {passed ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-green-800">
                  Excelente trabajo. Has demostrado comprensión del material y estás listo para aplicar lo aprendido.
                </p>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-800">
                  Necesitas obtener al menos {assessment.passingPercentage}% para aprobar. Revisa el material nuevamente e intenta una vez más.
                </p>
              </div>
            )}

            <div className={`flex gap-4 ${passed ? 'flex-row-reverse' : ''}`}>
              {!passed && onRetake && (
                <button
                  onClick={onRetake}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105"
                >
                  <RotateCcw className="w-5 h-5" />
                  Intentar de Nuevo
                </button>
              )}
              <button
                onClick={onContinue}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-lg transition-all transform hover:scale-105 ${
                  passed
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700'
                    : 'bg-white border-2 border-gray-300 text-gray-800 hover:bg-gray-50'
                }`}
              >
                <ArrowRight className="w-5 h-5" />
                {passed ? 'Completar Curso' : 'Volver'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
