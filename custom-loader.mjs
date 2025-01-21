import { URL, pathToFileURL } from 'url';
import path from 'path';

export function resolve(specifier, context, nextResolve) {
  const { parentURL = null } = context;

  if (specifier.startsWith('@/')) {
    const projectRoot = process.cwd();
    const resolvedPath = path.join(projectRoot, 'src', specifier.slice(2));
    return nextResolve(pathToFileURL(resolvedPath).href);
  }

  return nextResolve(specifier, context);
}

export function load(url, context, nextLoad) {
  return nextLoad(url, context);
}