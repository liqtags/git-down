export const fetchRepoZip = async (repoName: string, repoOwner: string, ref: string = 'main') => {
    const zip = await octokit.rest.repos.downloadZipballArchive({
        owner: repoOwner, 
        repo: repoName, 
        ref: ref
      }); 

      return zip; 
}