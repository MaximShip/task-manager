import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useNavigate } from 'react-router-dom';
import { useTask } from '../../contexts/TaskContext';
import { formatDate } from '../../utils/dateHelpers';

function Calendar({ showNotification }) {
  const { tasks, fetchTasks } = useTask();
  const [calendarEvents, setCalendarEvents] = useState([]);
  const navigate = useNavigate();

  // Загрузка задач при монтировании компонента
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Преобразование задач в формат событий календаря
  useEffect(() => {
    if (tasks.length > 0) {
      const events = tasks
        .filter(task => task.dueDate) // Только задачи с установленной датой
        .map(task => {
          // Определение цвета в зависимости от статуса
          let color;
          switch (task.status) {
            case 'новая':
              color = '#0d6efd'; // синий
              break;
            case 'в процессе':
              color = '#ffc107'; // желтый
              break;
            case 'завершена':
              color = '#198754'; // зеленый
              break;
            default:
              color = '#6c757d'; // серый
          }

          return {
            id: task.id,
            title: task.title,
            start: formatDate(task.dueDate),
            color: color,
            extendedProps: {
              description: task.description,
              status: task.status
            }
          };
        });

      setCalendarEvents(events);
    }
  }, [tasks]);

  // Обработчик клика по событию
  const handleEventClick = (info) => {
    const taskId = info.event.id;
    navigate(`/tasks/edit/${taskId}`);
  };

  // Обработчик клика по дате
  const handleDateClick = (info) => {
    // Перенаправление на форму создания новой задачи
    // с предустановленной датой выполнения
    navigate('/tasks/add', { 
      state: { dueDate: info.dateStr } 
    });
  };

  return (
    <div className="calendar-container">
      <div className="mb-4">
        <h1>Календарь задач</h1>
        <p className="text-muted">
          Нажмите на дату, чтобы создать новую задачу, или на существующую задачу, чтобы редактировать её.
        </p>
      </div>

      <div className="card">
        <div className="card-body">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={calendarEvents}
            eventClick={handleEventClick}
            dateClick={handleDateClick}
            height="auto"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,dayGridWeek'
            }}
            buttonText={{
              today: 'Сегодня',
              month: 'Месяц',
              week: 'Неделя'
            }}
            locale="ru"
            firstDay={1} // Начинать неделю с понедельника
            eventTimeFormat={{
              hour: '2-digit',
              minute: '2-digit',
              meridiem: false
            }}
          />
        </div>
      </div>

      <div className="calendar-legend mt-4">
        <h5>Обозначения:</h5>
        <div className="d-flex flex-wrap">
          <div className="me-3 mb-2">
            <span className="badge bg-primary me-1">&nbsp;</span>
            <span>Новые задачи</span>
          </div>
          <div className="me-3 mb-2">
            <span className="badge bg-warning me-1">&nbsp;</span>
            <span>Задачи в процессе</span>
          </div>
          <div className="me-3 mb-2">
            <span className="badge bg-success me-1">&nbsp;</span>
            <span>Завершенные задачи</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Calendar;