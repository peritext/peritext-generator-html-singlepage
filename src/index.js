import { writeFile, readFile } from 'fs-extra';

import {
  loadAssetsForEdition,
  buildHTMLMetadata,
} from 'peritext-utils';

/**
 * Generates output from the given parameter
 * @return Promise - promise of the process
 */
function generateOutput ( {
  production: initialProduction = {},
  edition = {},
  // peritextConfig = {},
  locale = {},
  outputPath,
  requestAssetData,
  templatesBundlesPath,
} ) {

  let loadedProduction;
  return new Promise( ( resolve, reject ) => {
    loadAssetsForEdition( {
      production: initialProduction,
      edition,
      requestAssetData
    } )
    .then( ( loadedAssets ) => {
      loadedProduction = {
          ...initialProduction,
          assets: loadedAssets
        };
      const templatePath = `${templatesBundlesPath}/${edition.metadata.templateId}/index.html`;
      return readFile( templatePath, 'utf8' );
    } )
    .then( ( template ) => {
      const HTMLMetadata = buildHTMLMetadata( loadedProduction );
      const html = template
          .replace( '${metadata}', HTMLMetadata )
          .replace( '${productionJSON}', JSON.stringify( loadedProduction ) )
          .replace( '${editionId}', `"${edition.id}"` )
          .replace( '${locale}', JSON.stringify( locale ) );
      return writeFile( outputPath, html, 'utf8' );
    } )
    .then( resolve )
    .catch( reject );
  } );
}

module.exports = {
  meta: {
    id: 'single-page-html',
    type: 'peritext-generator',
    name: 'Single HTML page generator',
    generatorType: 'single-page-html',
    outputFormat: 'zip',
    interfaceCoverage: [ 'desktop' ]
  },
  generateOutput
};
