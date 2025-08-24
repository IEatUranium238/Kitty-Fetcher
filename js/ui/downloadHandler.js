export function setupDownloadButton(downloadBtn, getCurrentImageUrl, setStatus) {
  downloadBtn.addEventListener("click", async () => {
    const currentImg = getCurrentImageUrl();
    if (!currentImg) return;

    try {
      const response = await fetch(currentImg);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "cat-image.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (error) {
      setStatus("Failed to download image.");
      console.error("Download error:", error);
    }
  });
}
