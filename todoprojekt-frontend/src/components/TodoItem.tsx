import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip, 
  Button, 
  CircularProgress 
} from '@mui/material';
import { 
  PlayArrow as PlayIcon, 
  CheckCircle as CheckIcon, 
  AssignmentTurnedIn as AcceptIcon,
  RestartAlt as ResetIcon,
  Edit as EditIcon 
} from '@mui/icons-material';
import { Todo, TodoStatus } from '../types';
import { todoService } from '../services/todoService';

interface TodoItemProps {
  todo: Todo;
  onUpdate: (todo: Todo) => void;
  onSelect: (todo: Todo) => void;
  isInstructor: boolean;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onUpdate,
  onSelect,
  isInstructor,
}) => {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const handleStatusChange = async (newStatus: TodoStatus) => {
    try {
      setIsUpdatingStatus(true);
      const updated = await todoService.updateTodoStatus(todo.id, newStatus);
      onUpdate(updated);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Fehler beim Aktualisieren des Status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleAccept = async () => {
    try {
      setIsUpdatingStatus(true);
      const updated = await todoService.acceptTodo(todo.id);
      onUpdate(updated);
    } catch (error) {
      console.error('Error accepting todo:', error);
      alert('Fehler beim Annehmen der Aufgabe');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getStatusColor = (status: TodoStatus): "error" | "warning" | "success" | "primary" | "default" => {
    const colors: Record<TodoStatus, "error" | "warning" | "success" | "primary"> = {
      OPEN: 'error',
      IN_PROGRESS: 'warning',
      DONE: 'success',
      ACCEPTED: 'primary',
    };
    return colors[status] || 'default';
  };

  return (
    <Card 
      sx={{ 
        marginBottom: 2, 
        boxShadow: 2, 
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4,
        }
      }}
    >
      <CardContent>
        {/* Header: Titel und Status-Badge */}
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start', 
            marginBottom: 2 
          }}
        >
          <Typography 
            variant="h6" 
            component="h3" 
            onClick={() => onSelect(todo)}
            sx={{ 
              cursor: 'pointer', 
              fontWeight: 600,
              '&:hover': { color: 'primary.main', textDecoration: 'underline' } 
            }}
          >
            {todo.title}
          </Typography>
          <Chip 
            label={todo.status} 
            color={getStatusColor(todo.status)} 
            size="small" 
            sx={{ fontWeight: 'bold' }}
          />
        </Box>

        {/* Beschreibung */}
        <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2, wordBreak: 'break-word' }}>
          {todo.description}
        </Typography>

        {/* Metadaten (Zuweisung & Datum) */}
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            flexWrap: 'wrap', 
            gap: 1, 
            marginBottom: 2.5 
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Zugewiesen an: <strong>{todo.assignedTo}</strong>
          </Typography>
          <Typography variant="caption" color="text.disabled">
            Erstellt: {new Date(todo.createdAt).toLocaleDateString('de-DE')}
          </Typography>
        </Box>

        {/* Trennlinie & Buttons */}
        <Box 
          sx={{ 
            display: 'flex', 
            gap: 1, 
            justifyContent: 'flex-start', 
            flexWrap: 'wrap', 
            paddingTop: 1.5, 
            borderTop: '1px solid', 
            borderColor: 'divider' 
          }}
        >
          {isUpdatingStatus ? (
            <Box sx={{ display: 'flex', alignItems: 'center', paddingTop: 0.5, paddingLeft: 1 }}>
              <CircularProgress size={24} sx={{ marginRight: 1 }} />
              <Typography variant="caption">Aktualisiere...</Typography>
            </Box>
          ) : (
            <>
              {/* LERNENDER BUTTONS */}
              {!isInstructor && (
                <>
                  <Button
                    variant="outlined"
                    color="warning"
                    size="small"
                    startIcon={<PlayIcon />}
                    onClick={() => handleStatusChange('IN_PROGRESS')}
                    disabled={todo.status === 'DONE' || todo.status === 'ACCEPTED'}
                  >
                    In Bearbeitung
                  </Button>
                  <Button
                    variant="outlined"
                    color="success"
                    size="small"
                    startIcon={<CheckIcon />}
                    onClick={() => handleStatusChange('DONE')}
                    disabled={todo.status === 'DONE' || todo.status === 'ACCEPTED'}
                  >
                    Erledigt
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    startIcon={<AcceptIcon />}
                    onClick={handleAccept}
                    disabled={todo.status !== 'DONE'}
                  >
                    Annehmen
                  </Button>
                </>
              )}

              {/* AUSBILDER BUTTONS */}
              {isInstructor && (
                <>
                  <Button
                    variant="outlined"
                    color="secondary"
                    size="small"
                    startIcon={<ResetIcon />}
                    onClick={() => handleStatusChange('OPEN')}
                  >
                    Zurücksetzen
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => onSelect(todo)}
                  >
                    Bearbeiten
                  </Button>
                </>
              )}
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};