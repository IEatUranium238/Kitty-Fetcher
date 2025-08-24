import * as dom from "./ui/domElements.js";

import { fetchCatImageURL } from "./api/catApi.js";
import { setupDownloadButton } from "./ui/downloadHandler.js";
import { CatIDResult } from "./utils/getCatIDFromURL.js";

// Buttons and image elements
const refreshBtn = document.getElementById("refreshBtn");
const modifyBtn = document.getElementById("applyBtn");
const resultImg = document.getElementById("imgResult");
const loadingMessage = document.getElementById("loadingMessage");
const dropdownFilters = document.getElementById("filtersSelect");

// Variables to keep track of current image state
let currentImageUrl = null;
let currentCatID = null;

/**
 * Updates the status line text and sets ARIA live region for screen readers.
 * @param {string} message - The status message to display.
 */
function setStatus(message) {
  statusLine.textContent = message;
  // Announce status change for screen readers
  statusLine.setAttribute("aria-live", "polite");
}

/**
 * Fetches and updates the cat image based on current input values.
 * @param {boolean} isModify - Whether this is a modification of the current image.
 */
async function updateCatImage(isModify) {
  loadingMessage.textContent = "Loading...";
  loadingMessage.style.display = "block";
  resultImg.style.display = "none";
  setStatus("Loading cat image...");

  //Set all custom filter settings into array if custom filter is selected
  let customFiltersArr = [];
  if (dropdownFilters.value === "custom") {
    customFiltersArr.push(dom.brightness.value);
    customFiltersArr.push(dom.lightness.value);
    customFiltersArr.push(dom.saturation.value);
    customFiltersArr.push(dom.hue.value);
    customFiltersArr.push(dom.red.value);
    customFiltersArr.push(dom.green.value);
    customFiltersArr.push(dom.blue.value);
  }

  try {
    // Fetch new cat image URL with parameters from inputs
    const url = await fetchCatImageURL({
      tagsInputValue: tagsInput.value.trim(),
      textValue: dom.textInput.value,
      sizeValue: Number(dom.sizeInput.value),
      fontValue: dom.fontInput,
      colorValue: dom.colorInput.value,
      filterValue: dom.filterSelect.value,
      isGifChecked: dom.gifCheckbox.checked,
      customFilters: customFiltersArr,
      isModification: isModify,
      originalID: currentCatID,
      setStatus,
    });

    if (url) {
      currentImageUrl = url;
      resultImg.src = url;
      currentCatID = CatIDResult(url);

      // Set alt text for accessibility
      resultImg.alt = `Cat image with tags: ${
        dom.tagsInput.value.trim() || "none"
      }`;

      // Show image once loaded
      resultImg.onload = () => {
        loadingMessage.style.display = "none";
        resultImg.style.display = "inline-block";
        // Move keyboard focus to the image for accessibility
        resultImg.focus();
      };

      // Handle image load errors
      resultImg.onerror = () => {
        setStatus("Failed to load image.");
        loadingMessage.style.display = "none";
        resultImg.style.display = "none";
      };
    } else {
      // No URL returned
      loadingMessage.textContent = "No image URL returned.";
    }
  } catch (error) {
    setStatus("Failed to load cat image URL.");
    loadingMessage.style.display = "none";
    resultImg.style.display = "none";
  }
}

// Event listeners for buttons
refreshBtn.addEventListener("click", () => {
  updateCatImage(false);
});

modifyBtn.addEventListener("click", () => {
  updateCatImage(true);
});

// Initialize image on page load
updateCatImage(false);

// Setup download button handler with status updates
setupDownloadButton(downloadBtn, () => currentImageUrl, setStatus);
