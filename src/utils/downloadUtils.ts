
/**
 * Utility function to download data as a JSON file
 * @param data - The data object to be downloaded as JSON
 * @param filename - The name of the file to be downloaded
 */
export const downloadJson = (data: any, filename: string) => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
