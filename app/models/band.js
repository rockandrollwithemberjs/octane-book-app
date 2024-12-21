import Model, { attr, hasMany } from '@ember-data/model';

export default class Band extends Model {
  @attr name;
  @attr description;

  @hasMany('song', { async: true, inverse: 'band' }) songs;

  get songCount() {
    console.log('songCount', this.name, this.songs.length);
    return this.songs.length;
  }
}
