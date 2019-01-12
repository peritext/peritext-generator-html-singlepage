"use strict";

var _fsExtra = require("fs-extra");

var _peritextUtils = require("peritext-utils");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Generates output from the given parameter
 * @return Promise - promise of the process
 */
function generateOutput({
  production: initialProduction = {},
  edition = {},
  // peritextConfig = {},
  locale = {},
  outputPath,
  requestAssetData,
  basePath
}) {
  let loadedProduction;
  return new Promise((resolve, reject) => {
    (0, _peritextUtils.loadAssetsForEdition)({
      production: initialProduction,
      edition,
      requestAssetData
    }).then(loadedAssets => {
      loadedProduction = _objectSpread({}, initialProduction, {
        assets: loadedAssets
      });
      const templatePath = `${basePath}/app/htmlBuilds/single-page-html/${edition.metadata.templateId}/index.html`;
      return (0, _fsExtra.readFile)(templatePath, 'utf8');
    }).then(template => {
      const HTMLMetadata = (0, _peritextUtils.buildHTMLMetadata)(loadedProduction);
      const html = template.replace('${metadata}', HTMLMetadata).replace('${productionJSON}', JSON.stringify(loadedProduction)).replace('${editionId}', `"${edition.id}"`).replace('${locale}', JSON.stringify(locale));
      return (0, _fsExtra.writeFile)(outputPath, html, 'utf8');
    }).then(resolve).catch(reject);
  });
}

module.exports = {
  meta: {
    id: 'single-page-html',
    type: 'peritext-generator',
    name: 'Single HTML page generator',
    generatorType: 'single-page-html',
    outputFormat: 'zip',
    interfaceCoverage: ['desktop']
  },
  generateOutput
};