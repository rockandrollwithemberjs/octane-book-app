import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { capitalize } from 'rarwe/helpers/capitalize';

export default class BandsBandSongsController extends Controller {
  @tracked showAddSong = true;
  @tracked title = '';
  @tracked sortBy = 'title';
  @tracked searchTerm = '';

  get hasNoTitle() {
    return !this.title;
  }

  @service store;

  get matchingSongs() {
    let searchTerm = this.searchTerm.toLowerCase();
    return this.model.songs.filter((song) => {
      return song.title.toLowerCase().includes(searchTerm);
    });
  }

  get sortedSongs() {
    let sortBy = this.sortBy;
    let isDescendingSort = false;
    if (sortBy.charAt(0) === '-') {
      sortBy = this.sortBy.slice(1);
      isDescendingSort = true;
    }
    return this.matchingSongs.sort((song1, song2) => {
      if (song1[sortBy] < song2[sortBy]) {
        return isDescendingSort ? 1 : -1;
      }
      if (song1[sortBy] > song2[sortBy]) {
        return isDescendingSort ? -1 : 1;
      }
      return 0;
    });
  }

  get newSongPlaceholder() {
    let bandName = this.model.name;
    return `New ${capitalize([bandName])} song`;
  }

  @action
  async updateRating(song, rating) {
    song.rating = rating;
    await song.save();
  }

  @action
  updateSearchTerm(event) {
    this.searchTerm = event.target.value;
  }

  @action
  updateTitle(event) {
    this.title = event.target.value;
  }

  @action
  async saveSong() {
    let song = this.store.createRecord('song', {
      title: this.title,
      band: this.model,
    });
    await song.save();
    this.title = '';
    this.showAddSong = true;
  }

  @action
  cancel() {
    this.title = '';
    this.showAddSong = true;
  }
}
