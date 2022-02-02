import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class BandsEditBandRoute extends Route {
  @service catalog;

  model(params) {
    return this.catalog.find('band', (band) => band.id === params.id);
  }
}
