let files: File[] = [];

export const setFiles = (newFiles: File[]) => {
  files = newFiles;
  console.log(files);
};

export const getFiles = () => files;

export const clearFiles = () => {
  files = [];
};
