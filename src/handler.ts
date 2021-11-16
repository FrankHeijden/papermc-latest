import { notFoundResponse } from './utils';

const BASE_API_ENDPOINT = 'https://papermc.io/api/v2';
const PROJECTS_API_ENDPOINT = '/projects';
const VERSIONS_API_ENDPOINT = '/{project}';
const BUILDS_API_ENDPOINT = '/versions/{version}';
const INFORMATION_API_ENDPOINT = '/builds/{build}';
const DOWNLOAD_API_ENDPOINT = '/downloads/{download}';

export async function handleRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname.split('/');

  const api = path[1] ?? '';
  if (api !== 'v1') {
    return notFoundResponse(api, ['v1'], 'API version');
  }

  let endpoint = BASE_API_ENDPOINT + PROJECTS_API_ENDPOINT;

  const project = path[2] ?? '';
  // @ts-ignore
  const projects = (await (await fetch(endpoint)).json())['projects'];
  if (!projects.includes(project)) {
    return notFoundResponse(project, projects, 'Project');
  }

  // Append version part
  endpoint += VERSIONS_API_ENDPOINT.replace('{project}', project);

  const version = path[3] ?? '';
  // @ts-ignore
  const versions = (await (await fetch(endpoint)).json())['versions'];
  if (!versions.includes(version)) {
    return notFoundResponse(version, versions, 'Version');
  }

  // Append build part
  endpoint += BUILDS_API_ENDPOINT.replace('{version}', version);

  // @ts-ignore
  const builds = (await (await fetch(endpoint)).json())['builds'];
  const latestBuild = Math.max(...builds);

  // Append information part
  endpoint += INFORMATION_API_ENDPOINT.replace('{build}', `${latestBuild}`);

  // @ts-ignore
  const download = (await (await fetch(endpoint)).json())['downloads']['application']['name'];

  // Append download part
  endpoint += DOWNLOAD_API_ENDPOINT.replace('{download}', download);

  return Response.redirect(endpoint, 307);
}
