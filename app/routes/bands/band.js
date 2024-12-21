import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class BandsBandRoute extends Route {
  @service store;

  async model(params) {
    return this.store.findRecord('band', params.id);
  }
}
