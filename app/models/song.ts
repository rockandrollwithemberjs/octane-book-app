import Model, { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';
import Band from './band';

export default class Song extends Model {
  @attr('string') declare title: string;
  @attr('number') declare rating: number;

  @belongsTo('band') declare band: AsyncBelongsTo<Band>;
}
