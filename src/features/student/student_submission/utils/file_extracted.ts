export const getSubmissionFileName = (fileName: string): string => {
  return fileName.split("_").pop() ?? fileName;
};