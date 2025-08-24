/**
 * Extracts the Cat ID from a Cataas image URL.
 * 
 * The Cat ID is located between character positions 23 and 39 (16 characters).
 * 
 * @param {string} URL - The full URL string of the cat image.
 * @returns {string|null} - The extracted Cat ID or null if URL is invalid or too short.
 */
export function CatIDResult(URL) {
  if (typeof URL !== "string" || URL.length < 39) {
    console.warn("Invalid URL or URL too short to extract Cat ID.");
    return null;
  }

  // Extract substring representing the Cat ID
  const catID = URL.slice(23, 39);
  return catID;
}
