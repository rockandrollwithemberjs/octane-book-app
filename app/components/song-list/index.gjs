import Component from '@glimmer/component';
import { capitalize } from '@ember/string';
import { sort } from 'ember-sort';
import { getPromiseState } from '@warp-drive/ember';

import Song from 'rarwe/models/song';
import StarRating from 'rarwe/components/star-rating';

export default class SongList extends Component {

  request = this.args.band.songs;

  <template>
    {{#let (getPromiseState this.request) as |state|}}
      {{#if state.isPending}}
        Loading...
      {{else if state.isError}}
        Error loading songs
      {{else}}
        <ul>
          {{#each state.result as |song|}}
            <li class="mb-2" data-test-rr="song-list-item">
              {{capitalize song.title}}
              <span class="float-right">
                <StarRating
                  @rating={{song.rating}}
                  @onUpdate={{fn this.updateRating song}}
                />
              </span>
            </li>
          {{/each}}
        </ul>
      {{/if}}
    {{/let}}
  </template>
}
