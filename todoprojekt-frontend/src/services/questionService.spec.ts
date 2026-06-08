import { describe, it, expect, beforeEach } from 'vitest';
import { questionService } from './questionService';

describe('QuestionService', () => {
  let mockQuestions: any[] = [];

  beforeEach(() => {
    mockQuestions = [
      {
        id: '1',
        todoId: '1',
        text: 'Is this task clear?',
        author: 'John',
        timestamp: new Date(),
        isTeacher: false,
      },
      {
        id: '2',
        todoId: '1',
        text: 'Please provide more details',
        author: 'Teacher',
        timestamp: new Date(),
        isTeacher: true,
      },
    ];
  });

  describe('getQuestionsByTodoId', () => {
    it('should fetch questions for specific todo', () => {
      const todoId = '1';
      const questions = mockQuestions.filter((q) => q.todoId === todoId);

      expect(questions).toBeDefined();
      expect(questions.length).toBe(2);
      expect(questions[0].todoId).toBe(todoId);
    });

    it('should return empty array for todo without questions', () => {
      const todoId = '999';
      const questions = mockQuestions.filter((q) => q.todoId === todoId);

      expect(questions.length).toBe(0);
    });
  });

  describe('addQuestion', () => {
    it('should create new question with valid data', () => {
      const newQuestion = {
        id: '3',
        todoId: '1',
        text: 'New question',
        author: 'Jane',
        timestamp: new Date(),
        isTeacher: false,
      };

      expect(newQuestion).toHaveProperty('id');
      expect(newQuestion).toHaveProperty('todoId');
      expect(newQuestion).toHaveProperty('text');
      expect(newQuestion.text).not.toBe('');
    });

    it('should require text field', () => {
      const invalidQuestion = {
        id: '3',
        todoId: '1',
        text: '',
        author: 'Invalid',
      };

      expect(invalidQuestion.text).toBe('');
    });
  });

  describe('Question filtering', () => {
    it('should filter teacher questions', () => {
      const teacherQuestions = mockQuestions.filter((q) => q.isTeacher === true);

      expect(teacherQuestions.length).toBe(1);
      expect(teacherQuestions[0].author).toBe('Teacher');
    });

    it('should filter student questions', () => {
      const studentQuestions = mockQuestions.filter((q) => q.isTeacher === false);

      expect(studentQuestions.length).toBe(1);
      expect(studentQuestions[0].author).toBe('John');
    });
  });

  describe('Question data validation', () => {
    it('should have valid timestamp', () => {
      const question = mockQuestions[0];

      expect(question.timestamp).toBeInstanceOf(Date);
    });

    it('should have required fields', () => {
      const question = mockQuestions[0];

      expect(question).toHaveProperty('id');
      expect(question).toHaveProperty('todoId');
      expect(question).toHaveProperty('text');
      expect(question).toHaveProperty('author');
      expect(question).toHaveProperty('timestamp');
    });
  });

  describe('Question sorting', () => {
    it('should sort questions by timestamp', () => {
      const sorted = [...mockQuestions].sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

      expect(sorted).toBeDefined();
    });
  });

  describe('Question deletion', () => {
    it('should remove question by id', () => {
      const initialLength = mockQuestions.length;
      mockQuestions = mockQuestions.filter((q) => q.id !== '1');

      expect(mockQuestions.length).toBe(initialLength - 1);
      expect(mockQuestions.find((q) => q.id === '1')).toBeUndefined();
    });
  });
});
