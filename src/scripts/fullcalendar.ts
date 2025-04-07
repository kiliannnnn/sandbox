import { Calendar } from 'fullcalendar-scheduler';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';

document.addEventListener('DOMContentLoaded', function () {
  let calendarEl: HTMLElement = document.getElementById('calendar')!;

  let calendar = new Calendar(calendarEl, {
    plugins: [dayGridPlugin, timeGridPlugin],
    nowIndicator: true,
    initialView: 'timeGridWeek',
    firstDay: 1,
    hiddenDays: [0, 1],
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
    // datesSet: function (info) {
    //   applyCustomStyles(info);
    // },
    eventDidMount: function (info) {
      applyCustomStyles(info);
    }
  });

  let timePair = getRandomTimePair();
  calendar.addEvent({
    title: 'RDV',
    start: formatTime('2025-03-28', timePair.start),
    end: formatTime('2025-03-28', timePair.end),
    displayEventTime: true,
    displayEventEnd: true,
  });

  timePair = getRandomTimePair();
  calendar.addEvent({
    title: 'RDV',
    start: formatTime('2025-03-26', timePair.start),
    end: formatTime('2025-03-26', timePair.end),
    displayEventTime: true,
    displayEventEnd: true,
  });

  timePair = getRandomTimePair();
  calendar.addEvent({
    title: 'RDV',
    start: formatTime('2025-03-25', timePair.start),
    end: formatTime('2025-03-25', timePair.end),
    displayEventTime: true,
    displayEventEnd: true,
  });

  timePair = getRandomTimePair();
  calendar.addEvent({
    title: 'RDV',
    start: formatTime('2025-03-27', timePair.start),
    end: formatTime('2025-03-27', timePair.end),
    displayEventTime: true,
    displayEventEnd: true,
  });

  calendar.addEvent({
    title: createEventElement(formatTime('2025-03-22', getRandomTime()), formatTime('2025-03-27', getRandomTime()), 'SB-ED', 'SB-ED', ''),
    start: formatTime('2025-03-04', getRandomTime()),
    end: formatTime('2025-03-27', getRandomTime()), // bug lorsque 26 ou 25
    allDay: true,
  });

  calendar.addEvent({
    title: createEventElement(formatTime('2025-03-22', getRandomTime()), formatTime('2025-03-27', getRandomTime()), 'SB-ED', 'SB-ED', ''),
    start: formatTime('2025-03-22', getRandomTime()),
    end: formatTime('2025-03-27', getRandomTime()),
    allDay: true,
  });

  calendar.addEvent({
    title: createEventElement(formatTime('2025-03-26', getRandomTime()), formatTime('2025-03-31', getRandomTime()), 'SD-EA', 'SD-EA', ''),
    start: formatTime('2025-03-26', getRandomTime()),
    end: formatTime('2025-03-31', getRandomTime()),
    allDay: true,
  });

  calendar.addEvent({
    title: createEventElement(formatTime('2025-03-25', { hours: 7, minutes: 0 }), formatTime('2025-03-28', getRandomTime()), 'SD-ED', 'SD-ED', ''),
    start: formatTime('2025-03-25', getRandomTime()),
    end: formatTime('2025-03-28', getRandomTime()),
    allDay: true,
  });

  calendar.addEvent({
    title: createEventElement(formatTime('2025-03-20', getRandomTime()), formatTime('2025-04-05', getRandomTime()), 'SB-EA', 'SB-EA', ''),
    start: formatTime('2025-03-20', getRandomTime()),
    end: formatTime('2025-04-05', getRandomTime()),
    allDay: true,
  });

  calendar.render();

  document.getElementById('create-event')!.addEventListener('click', function () {
    const start = (document.getElementById('event-start') as HTMLInputElement).value;
    const end = (document.getElementById('event-end') as HTMLInputElement).value;
    const title = (document.getElementById('event-title') as HTMLInputElement).value || 'No Title';
    const type = (document.getElementById('event-type') as HTMLSelectElement).value;

    if (start && end) {
      calendar.addEvent({
        title: createEventElement(start, end, title, title, ''),
        start: start,
        end: end,
        displayEventTime: true,
        displayEventEnd: true,
        allDay: type === 'absence',
      });
    } else {
      alert('Please provide both start and end dates.');
    }
  });
});

function applyCustomStyles(info) {
  let calendarContainer = document.getElementById('calendar');
  calendarContainer.classList.remove('custom-month', 'custom-week', 'custom-day');

  if (info.view.type === 'dayGridMonth') {
    calendarContainer.classList.add('custom-month');
  } else if (info.view.type === 'timeGridWeek') {
    calendarContainer.classList.add('custom-week');
    if (info.event.allDay) {
      const eventElement = info.el;
      let eventStart = new Date(info.el.querySelector('.startDate').getAttribute('data-start'));
      let eventEnd = new Date(info.el.querySelector('.endDate').getAttribute('data-end'));
      const weekStart = new Date(info.view.currentStart);
      const weekEnd = new Date(info.view.currentEnd);

      if (eventStart < weekStart && eventEnd > weekEnd) { // Event starts before the week and ends after the week
        // no need to do anything
        // console.log('Event starts before the week and ends after the week');
      }
      if (eventStart < weekStart && eventEnd <= weekEnd) { // Event starts before the week and ends within the week
        // do not touch the left side
        // update the width to make it end on the correct day
        // console.log('Event starts before the week');

        const visibleCount = getVisibleDays(info, eventStart, eventEnd);
        console.log('visibleCount', visibleCount);

        const right = ((eventEnd.getHours() * 60 + eventEnd.getMinutes()) / 1440) * 100;
        eventElement.parentElement.style.width = `${visibleCount * 100 - right}%`;
        eventElement.style.marginLeft = '0';
        eventElement.style.paddingLeft = '0';
      }
      if (eventStart >= weekStart && eventEnd > weekEnd) { // Event starts within the week and ends after the week
        // do not touch the width
        // update the left side to make it start on the correct day
        console.log('Event ends after the week');
      }
      if (eventStart >= weekStart && eventEnd <= weekEnd) { // Event starts and ends within the week
        // update the left side to make it start on the correct day
        // update the width to make it end on the correct day
        console.log('Event starts and ends within the week');
      }

      if (!(eventStart < weekStart && eventEnd > weekEnd)) { // Event starts before the week and ends after the week
        if (eventStart < weekStart) { // Event starts before the week
          eventStart = weekStart;
        }
        if (eventEnd > weekEnd) { // Event ends after the week
          eventEnd = weekEnd;
        }

        const visibleCount = getVisibleDays(info, eventStart, eventEnd);
        console.log('visibleCount', visibleCount);
        
        const left = ((eventStart.getHours() * 60 + eventStart.getMinutes()) / 1440) * 100;
        let right = 0;
        if (left <= 0) { // need to manually reduce the width to make it end on the correct day
          right = 1 - ((eventEnd.getHours() * 60 + eventEnd.getMinutes()) / 1440) * 100;
        }

        if (eventStart == eventEnd) { // Event starts and ends on the same day
          console.log('eventStart == weekEnd');
          
        }
        if (eventEnd != weekEnd) { // Event ends after the week
          eventElement.parentElement.style.width = `${visibleCount * 100 - right}%`;
        }
        
        eventElement.parentElement.style.left = `${left}%`;
        eventElement.style.marginLeft = '0';
        eventElement.style.paddingLeft = '0';
      }
    }
  } else if (info.view.type === 'timeGridDay') {
    calendarContainer.classList.add('custom-day');
    const eventElement = info.el;
    eventElement.style.left = `0%`;
    eventElement.style.right = `0%`;
  }
}

function getRandomTime(startHour = 8, endHour = 20) {
  const hours = Math.floor(Math.random() * (endHour - startHour + 1)) + startHour;
  const minutes = Math.floor(Math.random() * 60);
  return { hours, minutes };
}

function getRandomTimePair() {
  const time1 = getRandomTime();
  const time2 = getRandomTime();
  if (time1.hours < time2.hours || (time1.hours === time2.hours && time1.minutes < time2.minutes)) {
    return { start: time1, end: time2 };
  } else {
    return { start: time2, end: time1 };
  }
}

function formatTime(date, time) {
  const newDate = new Date(date);
  newDate.setHours(time.hours);
  newDate.setMinutes(time.minutes);
  return newDate.toISOString().slice(0, 16);
}

function createEventElement(start, end, name, title, additionalTitle) {
  return `
    <div class="d-flex justify-content-between align-items-center">
      <span class="d-none d-md-inline-block startDate" data-start="${start}">${new Date(start).toLocaleString('fr-FR', { month: '2-digit', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false })}</span>
      <div class="title">
        <div title="${name}" class="d-inline-block rounded-circle border border-light bg-info" style="width: 12px; height: 12px;"></div> ${additionalTitle}
        <div class="d-inline-block">${title}</div>
      </div>
      <span class="d-none d-md-inline-block endDate" data-end="${end}">${new Date(end).toLocaleString('fr-FR', { month: '2-digit', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false })}</span>
    </div>
  `;
}

function getVisibleDays(info, start, end) {
  let visibleCount = 0;
  let currentDay = new Date(start);
  currentDay.setHours(0, 0, 0, 0);
  const endDay = new Date(end);
  endDay.setHours(0, 0, 0, 0);
  
  while (currentDay <= endDay) {
      if (!info.view.calendar.getOption('hiddenDays').includes(currentDay.getDay())) {
          visibleCount++;
      }
      currentDay.setDate(currentDay.getDate() + 1);
  }
  visibleCount--;

  return visibleCount;
}

// method pour comparer les jours visibles de la période donnée et les jours de l'event
// calendar.getOption('hiddenDays') pour récupérer les jours cachés