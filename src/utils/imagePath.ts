
/**
 * Helper function to get the correct path for images, considering the BASE_URL
 * This helps when deploying to different environments
 */
export const getImagePath = (path: string): string => {
  // If path already includes http or https, it's an external URL
  if (path.startsWith('http')) {
    return path;
  }
  
  // If path already has the BASE_URL, return as is
  if (path.startsWith(import.meta.env.BASE_URL || '')) {
    return path;
  }
  
  // If path starts with /, make sure we don't double up with BASE_URL
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Combine BASE_URL with the path
  return `${import.meta.env.BASE_URL || ''}${cleanPath}`;
};
