let files: File[] = [];

export const setFiles = (newFiles: File[]) => {
  files = newFiles;
};

export const getFiles = () => files;

export const clearFiles = () => {
  files = [];
};
