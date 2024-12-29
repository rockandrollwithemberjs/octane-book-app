import Component from '@glimmer/component';
import { service } from '@ember/service';
import { LinkTo } from '@ember/routing';
import { capitalize } from '@ember/string';

export default class BandListComponent extends Component {
  @service router;

  get bands() {
    return this.args.bands.map((band) => {
      return {
        band,
        isActive: this.router.isActive('bands.band', band),
      };
    });
  }

  <template>

    <ul class="pl-2 pr-8">
      {{#each this.bands as |item|}}
        <li class="mb-2" data-test-rr="band-list-item">
          <LinkTo
            class={{if item.isActive "border-purple-400 border-l-4 pl-2"}}
            @route="bands.band"
            @model={{item.band.id}}
            data-test-rr="band-link"
          >
            {{capitalize item.band.name}}
            ({{item.band.songCount}})
          </LinkTo>
        </li>
      {{/each}}
    </ul>
  </template>
}
