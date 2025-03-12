// add dotenv
import dotenv from "npm:dotenv";
dotenv.config();
// load octokit
import { Octokit } from "npm:octokit";
import { fetchRepoZip } from "./fetchRepoZip.ts";
import { downloadRepoZip } from "./downloadRepoZip.ts";
import { delay } from "./utils.ts";

const options = {
  auth: process.env.GITHUB_TOKEN as string,
  per_page: 100,
  owner: process.env.OWNER,
  type: process.env.TYPE,
  output_dir: process.env.OUTPUT_DIR,
  mode: process.env.MODE
}

// set some variables for the script
const allRepos: any[] = [];
const allRepoNames: any[] = [];

// array to store the failed repos
const failedToDownloadRepos: any[] = [];

const octokit = new Octokit({
  auth: options.auth,
});

// define a iterator function to get all repos
const iterator = await octokit.paginate.iterator(octokit.rest.repos.listForAuthenticatedUser, {
  owner: options.owner,
  type: options.type,
  per_page: options.per_page
});

// iterate over the repos
for await (const { data } of iterator) {
  allRepos.push(...data);

  // download the repos
  data.map(async (repo: any) => {
    try {
      const repoName = repo.full_name.split("/")[1];
      const repoFullName = repo.full_name;
      const repoOwner = repoFullName.split("/")[0];

      allRepoNames.push(repoName);

      // check if the repo is already downloaded
      if (Deno.statSync(`${options.output_dir}/${repoName}`)) {
        console.log(`Repo ${repoName} already exists`);
        return;
      }

      if (options.mode === "zip") {
        const zip = await fetchRepoZip({
          octokit,
          repoName,
          repoOwner,
        })

        await downloadRepoZip({
          options: {
            output_dir: options.output_dir as string,
            repoName: repoName as string,
            repoData: zip as ArrayBuffer
          }
        });
      }

      if (options.mode === "clone") {
        // Clone logic
      }

      await delay(1000);
    } catch (error: any) { // define custom error types once bigger scripts
      failedToDownloadRepos.push(repo.name);
      console.error(`Failed to download repo: ${repo.name}`);
    }
  });
}

// log the variables
Deno.writeTextFileSync(`./data/allRepoNames.json`, JSON.stringify(allRepoNames, null, 2));
Deno.writeTextFileSync(`./data/failedToDownloadRepos.json`, JSON.stringify(failedToDownloadRepos, null, 2));
Deno.writeTextFileSync(`./data/allRepos.json`, JSON.stringify(allRepos, null, 2));






