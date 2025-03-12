export const fetchRepoZip = async ({
    octokit, 
    repoName, 
    repoOwner, 
    ref = 'main'
}: {
    octokit: any, 
    repoName: string, 
    repoOwner: string, 
    ref?: string
}) => {
    const zip = await octokit.rest.repos.downloadZipballArchive({
        owner: repoOwner, 
        repo: repoName, 
        ref: ref
      }); 

      return zip; 
}