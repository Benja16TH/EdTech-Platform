import { useState } from 'react';
import { ArrowLeft, Plus, Trash2, CreditCard as Edit2, Save, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Course, User, FinalAssessment, AssessmentQuestion } from '../types';

interface FinalAssessmentManagementProps {
  course: Course;
  assessment: FinalAssessment | null;
  user: User;
  onUpdateAssessment: (courseId: string, assessment: FinalAssessment) => void;
  onBack: () => void;
}

interface QuestionForm {
  question: string;
  options: [string, string, string, string];
  correctAnswerIndex: number;
}

export default function FinalAssessmentManagement({
  course,
  assessment,
  onUpdateAssessment,
  onBack,
}: FinalAssessmentManagementProps) {
  const [passingPercentage, setPassingPercentage] = useState(assessment?.passingPercentage ?? 70);
  const [questions, setQuestions] = useState<AssessmentQuestion[]>(assessment?.questions ?? []);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);
  const [showNewQuestion, setShowNewQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState<QuestionForm>({
    question: '',
    options: ['', '', '', ''],
    correctAnswerIndex: 0,
  });
  const [editForm, setEditForm] = useState<QuestionForm | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const toggleExpand = (questionId: string) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedQuestions(newExpanded);
  };

  const handleAddQuestion = () => {
    if (!newQuestion.question.trim() || newQuestion.options.some(opt => !opt.trim())) {
      alert('Por favor completa todos los campos');
      return;
    }

    const newQ: AssessmentQuestion = {
      id: `q_${Date.now()}`,
      courseId: course.id,
      question: newQuestion.question,
      options: newQuestion.options,
      correctAnswerIndex: newQuestion.correctAnswerIndex,
      orderIndex: questions.length,
    };

    setQuestions([...questions, newQ]);
    setShowNewQuestion(false);
    setNewQuestion({ question: '', options: ['', '', '', ''], correctAnswerIndex: 0 });
  };

  const handleEditQuestion = (question: AssessmentQuestion) => {
    setEditingQuestion(question.id);
    setEditForm({
      question: question.question,
      options: [...question.options] as [string, string, string, string],
      correctAnswerIndex: question.correctAnswerIndex,
    });
  };

  const handleSaveEdit = (questionId: string) => {
    if (!editForm || !editForm.question.trim() || editForm.options.some(opt => !opt.trim())) {
      alert('Por favor completa todos los campos');
      return;
    }

    setQuestions(questions.map(q =>
      q.id === questionId
        ? { ...q, question: editForm.question, options: editForm.options, correctAnswerIndex: editForm.correctAnswerIndex }
        : q
    ));

    setEditingQuestion(null);
    setEditForm(null);
  };

  const handleDeleteQuestion = (questionId: string) => {
    if (confirm('¿Está seguro de que desea eliminar esta pregunta?')) {
      setQuestions(questions.filter(q => q.id !== questionId));
    }
  };

  const handleMoveQuestion = (questionId: string, direction: 'up' | 'down') => {
    const index = questions.findIndex(q => q.id === questionId);
    if ((direction === 'up' && index > 0) || (direction === 'down' && index < questions.length - 1)) {
      const newQuestions = [...questions];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      [newQuestions[index], newQuestions[targetIndex]] = [newQuestions[targetIndex], newQuestions[index]];
      setQuestions(newQuestions.map((q, i) => ({ ...q, orderIndex: i })));
    }
  };

  const handleSaveAssessment = () => {
    if (questions.length === 0) {
      alert('Debe agregar al menos una pregunta');
      return;
    }

    const updatedAssessment: FinalAssessment = {
      id: assessment?.id ?? `assess_${Date.now()}`,
      courseId: course.id,
      passingPercentage,
      questions: questions.map((q, i) => ({ ...q, orderIndex: i })),
      createdAt: assessment?.createdAt ?? new Date(),
      updatedAt: new Date(),
    };

    onUpdateAssessment(course.id, updatedAssessment);

setShowSuccessMessage(true);

setTimeout(() => {
  setShowSuccessMessage(false);
}, 3000);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...newQuestion.options] as [string, string, string, string];
    newOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: newOptions });
  };

  const handleEditOptionChange = (index: number, value: string) => {
    if (editForm) {
      const newOptions = [...editForm.options] as [string, string, string, string];
      newOptions[index] = value;
      setEditForm({ ...editForm, options: newOptions });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="font-medium">Volver</span>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Evaluación Final</h1>
              <p className="text-sm text-gray-600">{course.title}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Porcentaje mínimo de aprobación
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={passingPercentage}
                  onChange={e => setPassingPercentage(parseInt(e.target.value))}
                  className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-2xl font-bold text-blue-600 w-16 text-right">{passingPercentage}%</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Los colaboradores deben obtener al menos {passingPercentage}% para aprobar el curso
              </p>
            </div>
            {showSuccessMessage && (
  <div className="px-4 py-2 bg-green-100 text-green-800 border border-green-300 rounded-lg font-medium">
    ✓ Evaluación guardada correctamente
  </div>
)}
            <button
              onClick={handleSaveAssessment}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Guardar Evaluación
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              Preguntas ({questions.length})
            </h2>
            {!showNewQuestion && (
              <button
                onClick={() => setShowNewQuestion(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Agregar Pregunta
              </button>
            )}
          </div>

          {showNewQuestion && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">Nueva Pregunta</h3>
                <button
                  onClick={() => { setShowNewQuestion(false); setNewQuestion({ question: '', options: ['', '', '', ''], correctAnswerIndex: 0 }); }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Enunciado</label>
                  <textarea
                    value={newQuestion.question}
                    onChange={e => setNewQuestion({ ...newQuestion, question: e.target.value })}
                    placeholder="Escribe la pregunta..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Alternativas</label>
                  <div className="space-y-2">
                    {newQuestion.options.map((option, idx) => (
                      <div key={idx} className="flex gap-2">
                        <span className="text-sm font-medium text-gray-600 w-8 flex items-center">
                          {String.fromCharCode(65 + idx)}.
                        </span>
                        <input
                          type="text"
                          value={option}
                          onChange={e => handleOptionChange(idx, e.target.value)}
                          placeholder={`Alternativa ${idx + 1}`}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <input
                          type="radio"
                          name="correct"
                          checked={newQuestion.correctAnswerIndex === idx}
                          onChange={() => setNewQuestion({ ...newQuestion, correctAnswerIndex: idx })}
                          title="Marcar como respuesta correcta"
                          className="w-4 h-4 cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => { setShowNewQuestion(false); setNewQuestion({ question: '', options: ['', '', '', ''], correctAnswerIndex: 0 }); }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleAddQuestion}
                    className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Agregar Pregunta
                  </button>
                </div>
              </div>
            </div>
          )}

          {questions.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-gray-500">No hay preguntas aún. Crea una para comenzar.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {questions.map((question, idx) => (
                <div key={question.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <button
                    onClick={() => toggleExpand(question.id)}
                    className="w-full bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 flex items-center justify-between hover:from-gray-100 hover:to-blue-100 transition-colors"
                  >
                    <div className="flex items-start gap-3 text-left flex-1">
                      <span className="font-bold text-gray-600 w-8 flex-shrink-0">{idx + 1}.</span>
                      <p className="font-medium text-gray-800">{question.question}</p>
                    </div>
                    {expandedQuestions.has(question.id) ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </button>

                  {expandedQuestions.has(question.id) && (
                    <div className="bg-white px-6 py-4 space-y-4 border-t">
                      {editingQuestion === question.id && editForm ? (
                        <>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Enunciado</label>
                            <textarea
                              value={editForm.question}
                              onChange={e => setEditForm({ ...editForm, question: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                              rows={3}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Alternativas</label>
                            <div className="space-y-2">
                              {editForm.options.map((option, optIdx) => (
                                <div key={optIdx} className="flex gap-2">
                                  <span className="text-sm font-medium text-gray-600 w-8 flex items-center">
                                    {String.fromCharCode(65 + optIdx)}.
                                  </span>
                                  <input
                                    type="text"
                                    value={option}
                                    onChange={e => handleEditOptionChange(optIdx, e.target.value)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                  <input
                                    type="radio"
                                    name={`correct_${question.id}`}
                                    checked={editForm.correctAnswerIndex === optIdx}
                                    onChange={() => setEditForm({ ...editForm, correctAnswerIndex: optIdx })}
                                    title="Marcar como respuesta correcta"
                                    className="w-4 h-4 cursor-pointer"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => { setEditingQuestion(null); setEditForm(null); }}
                              className="px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              Cancelar
                            </button>
                            <button
                              onClick={() => handleSaveEdit(question.id)}
                              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Guardar
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <p className="text-sm text-gray-600 font-medium mb-3">Alternativas:</p>
                            <div className="space-y-2">
                              {question.options.map((option, optIdx) => (
                                <div
                                  key={optIdx}
                                  className={`p-2 rounded flex items-start gap-2 ${
                                    optIdx === question.correctAnswerIndex
                                      ? 'bg-green-100 border border-green-300'
                                      : 'bg-gray-50 border border-gray-200'
                                  }`}
                                >
                                  <span className="font-medium text-gray-600 w-8 flex-shrink-0 pt-0.5">
                                    {String.fromCharCode(65 + optIdx)}.
                                  </span>
                                  <span className={`flex-1 ${optIdx === question.correctAnswerIndex ? 'font-semibold text-green-700' : 'text-gray-700'}`}>
                                    {option}
                                  </span>
                                  {optIdx === question.correctAnswerIndex && (
                                    <span className="text-xs font-bold text-green-700 bg-green-200 px-2 py-1 rounded whitespace-nowrap">
                                      Correcta
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-2 justify-end pt-2 border-t">
                            <div className="flex gap-2">
                              {idx > 0 && (
                                <button
                                  onClick={() => handleMoveQuestion(question.id, 'up')}
                                  title="Mover hacia arriba"
                                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                  <ChevronUp className="w-4 h-4" />
                                </button>
                              )}
                              {idx < questions.length - 1 && (
                                <button
                                  onClick={() => handleMoveQuestion(question.id, 'down')}
                                  title="Mover hacia abajo"
                                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                  <ChevronDown className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                            <button
                              onClick={() => handleEditQuestion(question)}
                              className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-semibold"
                            >
                              <Edit2 className="w-4 h-4" />
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeleteQuestion(question.id)}
                              className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-semibold"
                            >
                              <Trash2 className="w-4 h-4" />
                              Eliminar
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
