import {copyFile, mkdir} from 'node:fs/promises';
import path from 'node:path';

export default function rawDocsPlugin(context) {
  let docs = [];

  return {
    name: 'raw-docs',
    allContentLoaded({allContent}) {
      const docsContent = allContent['docusaurus-plugin-content-docs'].default;
      docs = docsContent.loadedVersions.flatMap((version) => version.docs);
    },
    async postBuild({outDir}) {
      await Promise.all(docs.map(async (doc) => {
        const source = path.join(context.siteDir, doc.source.replace(/^@site\//, ''));
        const rawPath = `${doc.permalink.replace(/^\//, '').replace(/\/$/, '')}.mdx`;
        const destination = path.join(outDir, rawPath);

        await mkdir(path.dirname(destination), {recursive: true});
        await copyFile(source, destination);
      }));
    },
  };
}
