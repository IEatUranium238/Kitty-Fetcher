import { isValidColor } from "../utils/colorUtils.js";

/**
 * Fetches a cat image URL from the Cataas API based on provided parameters.
 *
 * @param {Object} params - Parameters for fetching the cat image.
 * @param {string} params.tagsInputValue - Comma-separated tags input by the user.
 * @param {string} params.textValue - Text to display on the cat image.
 * @param {number} params.sizeValue - Font size for the text.
 * @param {string} params.fontValue - Font used.
 * @param {string} params.colorValue - Font color for the text.
 * @param {string} params.filterValue - Filter to apply to the image ("none", "mono", "negative", "custom").
 * @param {boolean} params.isGifChecked - Whether to request a GIF image.
 * @param {Array} params.customFilters - Array with values for custom filter.
 * @param {boolean} params.isModification - Whether this is a modification of an existing image.
 * @param {string} params.originalID - The ID of the original image (for modification).
 * @param {function} params.setStatus - Function to update status messages.
 * @returns {Promise<string|null>} - URL of the cat image or null if an error occurred.
 */
export async function fetchCatImageURL({
  tagsInputValue,
  textValue,
  sizeValue,
  fontValue,
  colorValue,
  filterValue,
  isGifChecked,
  customFilters,
  isModification,
  originalID,
  setStatus,
}) {
  setStatus(""); // Clear any previous status message

  // Parse and clean tags into an array
  const tags = tagsInputValue
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);

  // Base API URL
  let apiUrl = "https://cataas.com/cat";

  // If modifying an existing image, include the original ID in the URL
  if (isModification) {
    apiUrl += `/${originalID}`;
  }

  // Handle tags and GIF logic
  if (tags.length) {
    if (!isModification) {
      apiUrl += "/";
      // If GIF is requested but "gif" tag is missing, prepend "gif,"
      if (!tags.includes("gif") && isGifChecked) {
        apiUrl += "gif,";
      }
      apiUrl += tags.join(",");
    }
  } else if (isGifChecked) {
    if (!isModification) {
      apiUrl += "/gif";
    }
  }

  // Add text overlay if provided
  if (textValue) {
    apiUrl += `/says/${encodeURIComponent(textValue)}`;
  }

  // Prepare query parameters
  const queryParams = [];

  // Validate and add font size parameter
  if (sizeValue && !isNaN(sizeValue) && sizeValue !== 0) {
    queryParams.push(`fontSize=${encodeURIComponent(sizeValue)}`);
  }

  // Validate and add font color parameter
  if (colorValue) {
    // Remove spaces from color string
    colorValue = colorValue.replace(/\s+/g, "");
    if (isValidColor(colorValue)) {
      queryParams.push(`fontColor=${encodeURIComponent(colorValue)}`);
    } else {
      setStatus("Unknown color, using white.");
      queryParams.push(`fontColor=white`);
    }
  }

  // Add filter parameter if applicable
  if (filterValue !== "none") {
    const filterMap = { mono: "mono", negative: "negate" };
    let filterParam =
      filterValue === "custom" ? "custom" : filterMap[filterValue] || "";

    if (filterParam) {
      queryParams.push(`filter=${encodeURIComponent(filterParam)}`);
    }

    if (filterValue === "custom") {
      const paramNames = [
        "brightness",
        "lightness",
        "saturation",
        "hue",
        "red",
        "green",
        "blue",
      ];
      paramNames.forEach((name, i) => {
        if (customFilters[i] != null && customFilters[i] !== "") {
          queryParams.push(
            `${name}=${encodeURIComponent(customFilters[i])}`
          );
        }
      });
    }
  }

  // Add font
  queryParams.push(`font=${encodeURIComponent(fontValue.value)}`);

  // Request JSON response
  queryParams.push("json=true");
  

  // Append query parameters to URL if any
  if (queryParams.length) {
    apiUrl += `?${queryParams.join("&")}`;
  }

  try {
    // Fetch the cat image URL from API
    const response = await fetch(apiUrl);

    if (!response.ok) {
      // Handle HTTP errors with appropriate status messages
      if (response.status === 404) {
        setStatus("Cat not found, try using different tags");
      } else {
        setStatus("Something went wrong.");
      }
      // Return a fallback HTTP cat image for error status
      return `https://http.cat/${response.status}.jpg`;
    }

    // Parse JSON response and return the image URL
    const data = await response.json();
    return data.url;
  } catch (error) {
    // Handle network or other errors
    setStatus("Something went wrong.");
    console.error("Error fetching cat image:", error);
    return null;
  }
}
