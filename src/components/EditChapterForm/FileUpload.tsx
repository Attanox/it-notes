import React from "react";

import Spinner from "components/Spinner";
import { getImageUrl, uploadImage } from "lib/supabase";

const FILES_ACCEPT = ".gif,.jpg,.jpeg";

const FileUpload = () => {
  const [uploadedFile, setUploadedFile] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const onUploadChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    if (selectedFile) {
      setLoading(true);
      const { data } = await uploadImage(selectedFile);
      if (data?.Key) setUploadedFile(data.Key);
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col sm:flex-row items-start sm:items-center">
      <div className="form-control w-full max-w-xs flex flex-col items-start">
        <label className="label" htmlFor="image-upload">
          <span className="label-text">Upload file</span>
        </label>
        <input
          onChange={onUploadChange}
          type="file"
          accept={FILES_ACCEPT}
          className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          id="image-upload"
          name="image-upload"
          disabled={loading}
        />
        <p
          className="mt-1 text-sm text-gray-500 dark:text-gray-300"
          id="file_input_help"
        >
          {FILES_ACCEPT}
        </p>
      </div>
      <div className="w-12" />
      <div className="ml-auto pt-2">
        {uploadedFile ? (
          <div className="flex flex-row justify-end items-center">
            <button
              type="button"
              className="btn btn-sm btn-ghost gap-2"
              disabled={loading}
              onClick={() =>
                navigator.clipboard.writeText(getImageUrl(uploadedFile))
              }
            >
              Copy URL
              {loading ? (
                <Spinner width="h-5" height="h-5" />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
                  />
                </svg>
              )}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default FileUpload;
