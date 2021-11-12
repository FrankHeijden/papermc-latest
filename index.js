const BASE_API_ENDPOINT = 'https://papermc.io/api/v2'
const PROJECTS_API_ENDPOINT = '/projects'
const VERSIONS_API_ENDPOINT = '/{project}'
const BUILDS_API_ENDPOINT = '/versions/{version}'
const INFORMATION_API_ENDPOINT = '/builds/{build}'
const DOWNLOAD_API_ENDPOINT = '/downloads/{download}'

addEventListener('fetch', event => {
  return event.respondWith(handleResponse(event))
})

async function handleResponse(event) {
  const request = event.request
  const url = new URL(request.url)
  const path = url.pathname.split('/')

  const api = path[1]
  if (api !== 'v1') {
    return errorResponse(
      'NotFound',
      'Not found.',
      `API version "${api}" does not exist. Must be "v1".`,
      404,
      'Not Found',
    )
  }

  let endpoint = BASE_API_ENDPOINT + PROJECTS_API_ENDPOINT

  const project = path[2]
  const projects = (await (await fetch(endpoint)).json())['projects']
  if (!projects.includes(project)) {
    return errorResponse(
      'NotFound',
      'Not found.',
      `Project "${project}" does not exist. Must be one of ${JSON.stringify(
        projects,
      )}.`,
      404,
      'Not Found',
    )
  }

  // Append version part
  endpoint += VERSIONS_API_ENDPOINT.replace('{project}', project)

  const version = path[3]
  const versions = (await (await fetch(endpoint)).json())['versions']
  if (!versions.includes(version)) {
    return errorResponse(
      'NotFound',
      'Not found.',
      `Version "${version}" does not exist. Must be one of ${JSON.stringify(
        versions,
      )}.`,
      404,
      'Not Found',
    )
  }

  // Append build part
  endpoint += BUILDS_API_ENDPOINT.replace('{version}', version)

  const builds = (await (await fetch(endpoint)).json())['builds']
  const latestBuild = Math.max(...builds)

  // Append information part
  endpoint += INFORMATION_API_ENDPOINT.replace('{build}', `${latestBuild}`)

  const download = (await (await fetch(endpoint)).json())['downloads'][
    'application'
  ]['name']

  // Append download part
  endpoint += DOWNLOAD_API_ENDPOINT.replace('{download}', download)

  return Response.redirect(endpoint, 307);
}

function errorResponse(code, message, details, status, statusText) {
  return new Response(
    JSON.stringify({
      error: {
        code: code,
        message: message,
        details: details,
      },
    }),
    {
      status: status,
      statusText: statusText,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
}
