import * as React from "react";

import { useUploadFile } from "@/hooks/petition/useUploadFile";
import { filesize } from "filesize";
import { CloudUpload, File, X } from "lucide-react";
import { Button } from "./button";

function FileInput({ accept, id }: React.ComponentProps<"input">) {
  const [file, setFile] = React.useState<File | null>(null);
  const [uploadClicked, setUploadClicked] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const mutation = useUploadFile();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.files);
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const resetInput = () => {
    setUploadClicked(false);
    setFile(null);
    if (inputRef.current) {
      inputRef.current.value = ""; // Reset the input value
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    if (!id) return;
    console.log("Uploading file:", file);
    mutation.mutate({ file, filetype: id });
    setUploadClicked(true);
    setFile(null);
  };

  return (
    <div className="rounded p-5">
      <div className="items-center justify-center w-full mb-2">
        <label
          htmlFor={id}
          className="flex justify-center h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-200 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
        >
          <div className="flex flex-col items-center justify-center">
            <CloudUpload />
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {accept} files only
            </p>
          </div>
          <input
            id={id}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept={accept}
            ref={inputRef}
          />
        </label>
      </div>

      {file && (
        <div>
          <div className="border-gray-500 border-2 p-5 mb-2 rounded-lg flex flex-row items-center">
            <File />
            <p className="ml-4 mb-0 flex flex-col text-left">
              {file.name}
              <sub>{filesize(file.size)}</sub>
            </p>
            <Button
              variant="destructive"
              className="flex-end ml-auto"
              onClick={resetInput}
            >
              <X />
            </Button>
          </div>
          <Button
            className="mb-2 items-center justify-center w-full bg-blue-500 text-white hover:bg-blue-600"
            onClick={handleUpload}
            disabled={mutation.isPending || !file}
          >
            Upload file
          </Button>
        </div>
      )}

      {uploadClicked && (
        <div className="text-center text-white">
          {mutation.isPending ? (
            <div className="rounded bg-yellow-400/50 p-2">Uploading...</div>
          ) : (
            <div className="rounded">
              {mutation.isSuccess && file !== undefined ? (
                <div className="rounded bg-green-600/80 p-2 flex flex-row">
                  <div className="flex-1/2">
                    {mutation.data.message ? mutation.data.message : `✅ ${mutation.data.filename} loaded successfully!`}
                  </div>
                  <Button
                    className="ml-auto border-2 border-white"
                    onClick={resetInput}
                  >
                    <X />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-row">
                  <div className="flex-1/2">Error Uploading</div>
                  <Button
                    variant="destructive"
                    className="ml-auto border-2 border-white"
                    onClick={resetInput}
                  >
                    <X />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export { FileInput };
