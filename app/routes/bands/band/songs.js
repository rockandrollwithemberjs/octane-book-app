import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class BandsBandSongsRoute extends Route {
  @service store;

  queryParams = {
    sortBy: {
      as: 's',
    },
    searchTerm: {
      as: 'q',
    },
  };

  async model() {
    let band = this.modelFor('bands.band');
    return band;
  }

  resetController(controller) {
    controller.title = '';
    controller.showAddSong = true;
  }
}
