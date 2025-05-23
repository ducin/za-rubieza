/**
 * Main application logic for the podcast browser
 */

// Application state
const state = {
  episodes: [...episodes], // Copy of all episodes
  filteredEpisodes: [], // Episodes after filtering
  currentPage: 1,
  episodesPerPage: 9,
  searchTerm: '',
  selectedSeries: '',
  totalPages: 0
};

// DOM Elements
let searchInput;
let clearSearchButton;
let seriesSelect;
let episodesContainer;
let noResultsElement;
let backToTopButton;
let loadingElement;

/**
 * Initialize the application
 */
function init() {
  // Get DOM elements
  searchInput = getElement('search');
  clearSearchButton = getElement('clear-search');
  seriesSelect = getElement('series-select');
  episodesContainer = getElement('episodes-container');
  noResultsElement = getElement('no-results');
  backToTopButton = getElement('back-to-top');
  loadingElement = getElement('loading');

  // Set up event listeners
  searchInput.addEventListener('input', debounce(handleSearchInput, 300));
  clearSearchButton.addEventListener('click', clearSearch);
  backToTopButton.addEventListener('click', scrollToTop);
  
  // Handle scroll events for back-to-top button
  window.addEventListener('scroll', handleScroll);
  
  // Populate series dropdown
  populateSeriesSelect(series, handleSeriesChange);
  
  // Initialize filtered episodes
  state.filteredEpisodes = [...state.episodes];
  
  // Calculate total pages
  updateTotalPages();
  
  // Initial render
  renderEpisodes();
}

/**
 * Update the total pages based on filtered episodes
 */
function updateTotalPages() {
  state.totalPages = Math.ceil(state.filteredEpisodes.length / state.episodesPerPage);
}

/**
 * Handle search input
 */
function handleSearchInput() {
  state.searchTerm = searchInput.value.trim().toLowerCase();
  updateFilters();
  
  // Show/hide clear button
  if (state.searchTerm) {
    clearSearchButton.classList.add('visible');
  } else {
    clearSearchButton.classList.remove('visible');
  }
}

/**
 * Handle series selection change
 */
function handleSeriesChange() {
  state.selectedSeries = seriesSelect.value;
  updateFilters();
}

/**
 * Update filters and re-render episodes
 */
function updateFilters() {
  // Apply filters
  state.filteredEpisodes = state.episodes.filter(episode => {
    const matchesSearch = state.searchTerm === '' || 
      episode.title.toLowerCase().includes(state.searchTerm) || 
      (episode.description && episode.description.toLowerCase().includes(state.searchTerm));
    
    const matchesSeries = state.selectedSeries === '' || 
      episode.series_code === state.selectedSeries;
    
    return matchesSearch && matchesSeries;
  });
  
  // Reset to first page when filters change
  state.currentPage = 1;
  
  // Update total pages
  updateTotalPages();
  
  // Render episodes
  renderEpisodes();
}

/**
 * Clear search input and reset search filter
 */
function clearSearch() {
  searchInput.value = '';
  state.searchTerm = '';
  clearSearchButton.classList.remove('visible');
  updateFilters();
}

/**
 * Handle scroll events for back-to-top button visibility
 */
function handleScroll() {
  if (window.scrollY > 300) {
    backToTopButton.classList.add('visible');
  } else {
    backToTopButton.classList.remove('visible');
  }
}

/**
 * Get episodes for the current page
 * @returns {Array} Episodes for current page
 */
function getCurrentPageEpisodes() {
  const startIndex = (state.currentPage - 1) * state.episodesPerPage;
  const endIndex = startIndex + state.episodesPerPage;
  return state.filteredEpisodes.slice(startIndex, endIndex);
}

/**
 * Go to the previous page
 */
function goToPrevPage() {
  if (state.currentPage > 1) {
    state.currentPage--;
    renderEpisodes();
    scrollToTop();
  }
}

/**
 * Go to the next page
 */
function goToNextPage() {
  if (state.currentPage < state.totalPages) {
    state.currentPage++;
    renderEpisodes();
    scrollToTop();
  }
}

/**
 * Render episodes for the current page
 */
function renderEpisodes() {
  // Show loading indicator
  loadingElement.classList.remove('hidden');
  
  // Clear the container
  episodesContainer.innerHTML = '';
  
  // Get episodes for the current page
  const currentEpisodes = getCurrentPageEpisodes();
  
  // Check if there are any episodes to display
  if (state.filteredEpisodes.length === 0) {
    // Show no results message
    noResultsElement.classList.remove('hidden');
  } else {
    // Hide no results message
    noResultsElement.classList.add('hidden');
    
    // Create and append episode cards
    currentEpisodes.forEach(episode => {
      const card = createEpisodeCard(episode);
      episodesContainer.appendChild(card);
    });
  }
  
  // Hide loading indicator
  loadingElement.classList.add('hidden');
  
  // Update episode stats
  updateEpisodeStats(state.filteredEpisodes.length, state.episodes.length);
  
  // Update pagination controls
  updatePaginationControls(state.currentPage, state.totalPages, goToPrevPage, goToNextPage);
  
  // Hide pagination when there are no results
  const paginationContainer = document.querySelector('.pagination');
  if (state.filteredEpisodes.length === 0) {
    paginationContainer.classList.add('hidden');
  } else {
    paginationContainer.classList.remove('hidden');
  }
}

// Initialize the application when the DOM is ready
document.addEventListener('DOMContentLoaded', init);