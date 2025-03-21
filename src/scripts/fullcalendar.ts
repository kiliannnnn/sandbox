import { Calendar } from 'fullcalendar-scheduler';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';

document.addEventListener('DOMContentLoaded', function () {
  let calendarEl: HTMLElement = document.getElementById('calendar')!;

  let calendar = new Calendar(calendarEl, {
    plugins: [dayGridPlugin, timeGridPlugin],
    nowIndicator: true,
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    slotDuration: '00:15:00',
    height: calendarEl.parentElement.clientHeight,
    themeSystem: 'bootstrap4',
    locale: 'fr',
    eventColor: '#363454',
    slotLabelFormat: {
      hour: '2-digit',
      minute: '2-digit',
    },
    eventContent: function (arg) {
      return {
        html: `<div class="fc-content">
          <div class="fc-title">${arg.event.title}</div>
          <div class="fc-time">${arg.timeText}</div>
        </div>`
      }
    },
    datesSet: function (viewInfo) {      
      applyCustomStyles(viewInfo.view.type);
    }
  });

  calendar.addEvent(
    {
      allDay: true,
      title: 'event 1',
      start: '2025-03-17T10:00:00',
      end: '2025-03-19T17:00:00',
      displayEventTime: true,
      displayEventEnd: true,
    }
  )

  calendar.render();
});

function applyCustomStyles(viewType) {
  let calendarContainer = document.getElementById('calendar');

  // Reset styles
  calendarContainer.classList.remove('custom-month', 'custom-week', 'custom-day');

  // Apply styles based on the view type
  if (viewType === 'dayGridMonth') {
    console.log('month');
    calendarContainer.classList.add('custom-month');
  } else if (viewType === 'timeGridWeek') {
    console.log('week');
    calendarContainer.classList.add('custom-week');
  } else if (viewType === 'timeGridDay') {
    console.log('day');
    calendarContainer.classList.add('custom-day');
  }
}