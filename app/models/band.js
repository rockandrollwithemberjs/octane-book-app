import Model, { attr, hasMany } from '@ember-data/model';

export default class Band extends Model {
  @attr name;
  @attr description;
  @hasMany('song', { async: true, inverse: 'band' }) songs;
}
