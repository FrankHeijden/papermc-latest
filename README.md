# PaperMC Latest Download API
A wrapper for the PaperMC v2 downloads api which allows you to download the latest PaperMC version.

## Syntax
```html
https://papermc.frankheijden.workers.dev/v1/{project}/{version}
```

## Variable Explanation
- `{project}` is a [PaperMC project](https://papermc.io/api/v2/projects). Example: `paper`
- `{version}` is a specific version from the project. Example `1.17.1`

## Examples
- url: https://papermc.frankheijden.workers.dev/v1/paper/1.17.1
- curl:
  ```bash
  curl -L -o paper-1.17.1.jar https://papermc.frankheijden.workers.dev/v1/paper/1.17.1
  ```
- wget:
  ```bash
  wget -O paper-1.17.1.jar https://papermc.frankheijden.workers.dev/v1/paper/1.17.1
  ```
