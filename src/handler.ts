import { notFoundResponse, elementNotFoundResponse, serverErrorResponse } from './utils'
import { Router } from 'itty-router'

export const router = Router();
const v1Router = Router({ base: '/v1' });
const projectRouter = Router({ base: '/v1/:project' });

const BASE_API_ENDPOINT = 'https://papermc.io/api/v2';
const PROJECTS_API_ENDPOINT = '/projects';
const PROJECT_API_ENDPOINT = '/{project}';
const VERSION_API_ENDPOINT = '/versions/{version}';
const BUILD_API_ENDPOINT = '/builds/{build}';
const DOWNLOAD_API_ENDPOINT = '/downloads/{download}';

router
  .get('/v1/*', v1Router.handle)
  .get('/:api?', (req) => elementNotFoundResponse(
    req.params!.api ?? '',
    ['v1'],
    'API Version',
  ))
  .get('*', () => notFoundResponse('Endpoint does not exist.'))

v1Router
  .get('/:project?/*', async (req) => {
    const endpoint = BASE_API_ENDPOINT + PROJECTS_API_ENDPOINT;

    const project = req.params?.project ?? '';
    const projects = await fetch(endpoint)
      .then(res => res.json<any>())
      .then(body => body['projects']);

    if (!projects.includes(project)) {
      return elementNotFoundResponse(project, projects, 'project');
    }

    return projectRouter.handle(req);
  })

projectRouter
  .get('/:version?', async (req) => {
    let endpoint = BASE_API_ENDPOINT + PROJECTS_API_ENDPOINT;

    // Append project part
    endpoint += PROJECT_API_ENDPOINT.replace(
      '{project}',
      req.params!.project as string
    );

    const version = req.params!.version ?? '';
    const versions = await fetch(endpoint)
      .then(res => res.json<any>())
      .then(body => body['versions']);
    if (!versions.includes(version)) {
      return elementNotFoundResponse(version, versions, 'version');
    }

    // Append version part
    endpoint += VERSION_API_ENDPOINT.replace('{version}', version);

    const builds = await fetch(endpoint)
      .then(res => res.json<any>())
      .then(body => body['builds']);
    const latestBuild = Math.max(...builds);

    // Append build part
    endpoint += BUILD_API_ENDPOINT.replace('{build}', `${latestBuild}`);

    const download = await fetch(endpoint)
      .then(res => res.json<any>())
      .then(body => body['downloads']['application']['name']);

    // Append download part
    endpoint += DOWNLOAD_API_ENDPOINT.replace('{download}', download);

    return Response.redirect(endpoint, 307);
  })

export async function handleRequest(event: FetchEvent): Promise<Response> {
  return router
    .handle(event.request)
    .catch(serverErrorResponse)
}
