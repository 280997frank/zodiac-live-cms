import { useMutation, gql } from "@apollo/client";

import { useErrorMessage } from "@/hooks";
import { MediaFolderType } from "@/types/upload";

interface FileUploadResponse {
  uploadFile: {
    url: string;
  };
}

interface MultipleFileUploadResponse {
  uploadMultiFiles: {
    urls: string[];
  };
}

interface FileInput {
  uploadFilesInput: {
    file: File;
    folder: MediaFolderType;
  };
}

interface MultipleFileInput {
  uploadFilesInput: {
    files: File[];
    folder: MediaFolderType;
  };
}

const UPLOAD_FILE = gql`
  mutation uploadFile($uploadFilesInput: UploadFilesInput!) {
    uploadFile(uploadFilesInput: $uploadFilesInput) {
      url
    }
  }
`;

const UPLOAD_MULTIPLE_FILE = gql`
  mutation uploadMultiFiles($uploadFilesInput: UploadMultiFileInput!) {
    uploadMultiFiles(uploadFilesInput: $uploadFilesInput) {
      urls
    }
  }
`;

export const useUploadFile = () => {
  const [uploadFile, { loading, error, data }] = useMutation<
    FileUploadResponse,
    FileInput
  >(UPLOAD_FILE);

  useErrorMessage(error);

  return {
    uploadFile,
    loading,
    data,
  };
};

export const useUploadMultipleFile = () => {
  const [uploadMultipleFile, { loading, error, data }] = useMutation<
    MultipleFileUploadResponse,
    MultipleFileInput
  >(UPLOAD_MULTIPLE_FILE);

  useErrorMessage(error);

  return {
    uploadMultipleFile,
    loading,
    data,
  };
};
