/**
 * UI Component functions for the podcast browser
 */

/**
 * Create an episode card element
 * @param {Object} episode - Episode data
 * @returns {HTMLElement} Episode card element
 */
function createEpisodeCard(episode) {
  const card = document.createElement('article');
  card.className = 'episode-card';
  card.setAttribute('data-series', episode.series_code);
  
  // Header with title only (remove Spotify link from header)
  const header = document.createElement('div');
  header.className = 'episode-header';
  
  const titleElement = document.createElement('h2');
  titleElement.className = 'episode-title';
  titleElement.textContent = episode.title;
  header.appendChild(titleElement);
  
  card.appendChild(header);
  
  // Meta information (series and date)
  const meta = document.createElement('div');
  meta.className = 'episode-meta';
  
  const seriesElement = document.createElement('span');
  seriesElement.className = 'episode-series';

  seriesElement.textContent = episode.series;
  meta.appendChild(seriesElement);
  
  const dateElement = document.createElement('time');
  dateElement.className = 'episode-date';
  dateElement.dateTime = formatDateMachine(episode.date);
  dateElement.textContent = formatDate(episode.date);
  meta.appendChild(dateElement);
  
  card.appendChild(meta);
  
  // Description
  if (episode.description) {
    const description = document.createElement('p');
    description.className = 'episode-description';
    description.textContent = episode.description;
    card.appendChild(description);
  }

  // Spotify button at the bottom
  const spotifyButton = document.createElement('a');
  spotifyButton.href = episode.link;
  spotifyButton.target = '_blank';
  spotifyButton.rel = 'noopener noreferrer';
  spotifyButton.className = 'episode-spotify-btn';
  spotifyButton.setAttribute('aria-label', `Słuchaj na Spotify "${episode.title}"`);
  spotifyButton.innerHTML = `
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" style="vertical-align:middle;margin-right:8px;">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
    </svg>
    Słuchaj na Spotify
  `;
  card.appendChild(spotifyButton);

  return card;
}

/**
 * Create Spotify icon SVG
 * @returns {string} SVG markup for the Spotify icon
 */
function createSpotifyIcon() {
  // Simple Spotify-like icon using SVG
  return `<svg class="spotify-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM16.5917 16.4083C16.3667 16.6333 16.0333 16.7417 15.7083 16.7417C15.3833 16.7417 15.05 16.6333 14.825 16.4083C14.3667 15.95 14.3667 15.2167 14.825 14.7583C16.3167 13.2667 16.3167 10.7333 14.825 9.24167C14.3667 8.78333 14.3667 8.05 14.825 7.59167C15.2833 7.13333 16.0167 7.13333 16.475 7.59167C18.8417 9.95833 18.8417 14.0417 16.475 16.4083H16.5917ZM14.1417 14.1417C13.9167 14.3667 13.5833 14.475 13.2583 14.475C12.9333 14.475 12.6 14.3667 12.375 14.1417C11.9167 13.6833 11.9167 12.95 12.375 12.4917C12.8333 12.0333 12.8333 11.3 12.375 10.8417C11.9167 10.3833 11.9167 9.65 12.375 9.19167C12.8333 8.73333 13.5667 8.73333 14.025 9.19167C15.4 10.5667 15.4 12.85 14.025 14.225L14.1417 14.1417ZM10.8417 12.375C10.6167 12.6 10.2833 12.7083 9.95833 12.7083C9.63333 12.7083 9.3 12.6 9.075 12.375C8.61667 11.9167 8.61667 11.1833 9.075 10.725C9.53333 10.2667 9.53333 9.53333 9.075 9.075C8.61667 8.61667 8.61667 7.88333 9.075 7.425C9.53333 6.96667 10.2667 6.96667 10.725 7.425C12.1 8.8 12.1 11.0833 10.725 12.4583L10.8417 12.375Z"/>
  </svg>`;
}

/**
 * Create pagination button element
 * @param {string} id - Button ID
 * @param {string} text - Button text
 * @param {Function} clickHandler - Click event handler
 * @param {boolean} disabled - Whether button is disabled
 * @returns {HTMLElement} Button element
 */
function createPaginationButton(id, text, clickHandler, disabled = false) {
  const button = document.createElement('button');
  button.id = id;
  button.textContent = text;
  button.disabled = disabled;
  button.addEventListener('click', clickHandler);
  return button;
}

/**
 * Create "No results" message
 * @returns {HTMLElement} Message element
 */
function createNoResultsMessage() {
  const container = document.createElement('div');
  container.id = 'no-results';
  container.className = 'hidden';
  
  const message = document.createElement('p');
  message.textContent = 'No episodes found. Try adjusting your search or filter.';
  container.appendChild(message);
  
  return container;
}

/**
 * Update pagination controls based on current state
 * @param {number} currentPage - Current page number
 * @param {number} totalPages - Total number of pages
 * @param {Function} prevPageHandler - Previous page handler
 * @param {Function} nextPageHandler - Next page handler
 */
function updatePaginationControls(currentPage, totalPages, prevPageHandler, nextPageHandler) {
  const prevButton = getElement('prev-page');
  const nextButton = getElement('next-page');
  const currentPageElement = getElement('current-page');
  const totalPagesElement = getElement('total-pages');
  
  prevButton.disabled = currentPage <= 1;
  nextButton.disabled = currentPage >= totalPages;
  
  currentPageElement.textContent = currentPage;
  totalPagesElement.textContent = totalPages;
  
  // Update event listeners
  prevButton.replaceWith(prevButton.cloneNode(true));
  nextButton.replaceWith(nextButton.cloneNode(true));
  
  getElement('prev-page').addEventListener('click', prevPageHandler);
  getElement('next-page').addEventListener('click', nextPageHandler);
}

/**
 * Update episode stats display
 * @param {number} shownCount - Number of episodes shown
 * @param {number} totalCount - Total number of episodes
 */
function updateEpisodeStats(shownCount, totalCount) {
  const shownCountElement = getElement('shown-count');
  const totalCountElement = getElement('total-count');
  
  shownCountElement.textContent = shownCount;
  totalCountElement.textContent = totalCount;
}

/**
 * Populate series select dropdown with options
 * @param {Array} seriesList - List of series
 * @param {Function} changeHandler - Change event handler
 */
function populateSeriesSelect(seriesList, changeHandler) {
  const select = getElement('series-select');
  
  // Add default "All Series" option
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = 'Wszystkie serie';
  select.appendChild(defaultOption);
  
  // Add options for each series
  seriesList.forEach(series => {
    const option = document.createElement('option');
    option.value = series.series_code;
    option.textContent = series.title;
    select.appendChild(option);
  });
  
  // Add change event listener
  select.addEventListener('change', changeHandler);
}