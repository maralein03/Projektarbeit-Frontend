import React, { useState, useEffect } from 'react';
import { Question } from '../types';
import { questionService } from '../services/questionService';
import { useAuth } from '../context/AuthContext';
import '../styles/QuestionList.css';

interface QuestionListProps {
  todoId: number;
}

export const QuestionList: React.FC<QuestionListProps> = ({ todoId }) => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQuestions();
  }, [todoId]);

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await questionService.getQuestionsByTodoId(todoId);
      setQuestions(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Fehler beim Abrufen von Fragen';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newQuestion.trim()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      const question = await questionService.createQuestion(
        todoId,
        newQuestion,
        user?.username || 'Anonymous'
      );
      setQuestions((prev) => [...prev, question]);
      setNewQuestion('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Fehler beim Speichern der Frage';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="question-list">
      <h3>💬 Fragen & Chat ({questions.length})</h3>

      <div className="questions">
        {isLoading && <p className="loading">Wird geladen...</p>}
        {questions.length === 0 && !isLoading && (
          <p className="no-questions">Keine Fragen vorhanden</p>
        )}

        {questions.map((q) => (
          <div key={q.id} className="question-item">
            <div className="question-header">
              <span className="question-author">{q.author}</span>
              <span className="question-time">
                {new Date(q.timestamp).toLocaleString('de-DE')}
              </span>
            </div>
            <p className="question-content">{q.content}</p>
          </div>
        ))}
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmitQuestion} className="question-form">
        <textarea
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder="Schreibe eine Frage oder einen Kommentar..."
          rows={3}
        />
        <button
          type="submit"
          disabled={isSubmitting || !newQuestion.trim()}
          className="btn-primary"
        >
          {isSubmitting ? 'Wird gesendet...' : 'Frage stellen'}
        </button>
      </form>
    </div>
  );
};
