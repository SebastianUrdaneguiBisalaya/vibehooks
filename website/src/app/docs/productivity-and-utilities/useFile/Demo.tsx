'use client';

import { useFile } from "../../../../../../src";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Layout } from "@/layouts/Layout"

export default function Demo() {
  const { files, hasFiles, inputProps, reset } = useFile({
    accept: "image/*",
    multiple: true,
  });

  return (
    <Layout>
      <Layout.Title>File Upload</Layout.Title>
      <Input {...inputProps} placeholder="Click to choose files" type="file" />
      <Button.Warning disabled={!hasFiles} onClick={reset}>Clear</Button.Warning>

      <div className="flex flex-col w-full items-center gap-4">
        <Layout.Caption>List of selected files</Layout.Caption>
        {
          hasFiles ? (
            <div className="flex flex-col items-center w-full gap-2">
              {
                files.map(f => (
                  <li
                    className="text-sm text-white/80 w-full text-center"
                    key={f.name}
                  >
                    <Layout.Caption>{f.name} ({(f.size / 1024).toFixed(2)} KB)</Layout.Caption>
                  </li>
                ))
              }
            </div>
          ) : <Layout.Caption>No files selected.</Layout.Caption>
        }
      </div>
    </Layout>
  )
}
