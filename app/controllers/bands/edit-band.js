import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class BandsEditBandController extends Controller {
  @service catalog;
  @service router;

  @action
  async updateBand(band, attributes) {
    await this.catalog.update('band', band, attributes);
    this.router.transitionTo('bands.band.details', band.id);
  }
}
