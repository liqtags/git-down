interface IDownloadRepoZipOptions {
    output_dir: string,
    repoName: string,
    repoData: ArrayBuffer
}

export const downloadRepoZip = async ({
    options
}: {
    options: IDownloadRepoZipOptions
}) => {
    // create a array buffer from the zip file
    const buffer = new Uint8Array(options.repoData as ArrayBuffer);
    Deno.writeFileSync(`${options.output_dir}/${options.repoName}.zip`, buffer);
    console.log(`Downloaded ${options.repoName} to ${options.output_dir}`);
}