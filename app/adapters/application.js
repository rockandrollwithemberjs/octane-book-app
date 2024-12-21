import JSONAPIAdapter from '@ember-data/adapter/json-api';
import ENV from 'rarwe/config/environment';

export default class ApplicationAdapter extends JSONAPIAdapter {
  host = ENV.apiHost;
}
