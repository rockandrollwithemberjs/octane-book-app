import JSONAPISerializer from '@ember-data/serializer/json-api';

export default class ApplicationSerializer extends JSONAPISerializer {
  payloadKeyFromModelName(modelName) {
    return `${modelName}s`;
  }
}
