import Model, { attr, hasMany, AsyncHasMany } from '@ember-data/model';
import Song from './song';

export default class Band extends Model {
  @attr('string') declare name: string;
  @attr('string') declare description: string | null;

  @hasMany('song') declare songs: AsyncHasMany<Song>;

  get songCount() {
    return this.songs.length;
  }
}
