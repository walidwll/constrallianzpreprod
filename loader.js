import { URL, pathToFileURL } from 'url';
import path from 'path';

export function resolve(specifier, context, nextResolve) {
    if (specifier.startsWith('@/')) {
        const basePath = path.resolve('./src');
        const normalizedPath = specifier.replace('@/', '');
        const fullPath = path.join(basePath, normalizedPath);
        return {
            shortCircuit: true,
            url: pathToFileURL(fullPath).href,
        };
    }
    return nextResolve(specifier);
}

export async function load(url, context, nextLoad) {
    return nextLoad(url, context);
}

export { resolve as getFormat, resolve as getSource };