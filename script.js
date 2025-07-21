document.addEventListener('DOMContentLoaded', () => {
  // --- Code for Selected Stock from list ---
  const tableRows = document.querySelectorAll('.stock-table tbody tr');
  tableRows.forEach(row => {
    row.addEventListener('click', () => {
      // First, remove the 'selected' class from any other row
      const currentSelected = document.querySelector('.stock-table tr.selected');
      if (currentSelected) {
        currentSelected.classList.remove('selected');
      }
      row.classList.add('selected');
    });
  });


  // --- Code for Time Selector ---
  const timeSpans = document.querySelectorAll('.time-selector span');

  timeSpans.forEach(span => {
    span.addEventListener('click', () => {
      // Find the currently active span and remove the class
      const currentActive = document.querySelector('.time-selector span.active-time');
      if (currentActive) {
        currentActive.classList.remove('active-time');
      }

      // Add the active class to the clicked span
      span.classList.add('active-time');
    });
  });

});