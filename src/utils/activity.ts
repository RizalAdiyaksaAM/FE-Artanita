// utils/activity-utils.ts
export const truncateText = (text?: string, maxLength = 50) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

export const formatDateTime = (dateTime?: string) => {
  if (!dateTime) return '-';
  try {
    return new Date(dateTime).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateTime;
  }
};

export const createInitialFormState = () => ({
  title: "",
  description: "",
  location: "",
  time: "",
  activity_images: [],
  activity_videos: [],
  imageFiles: [],
  videoFiles: []
});