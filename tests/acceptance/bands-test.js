import { module, test } from 'qunit';
import {
  visit,
  waitFor,
  click,
  fillIn,
  triggerEvent,
} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { getPageTitle } from 'ember-page-title/test-support';

module('Acceptance | bands', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('List bands', async function (assert) {
    this.server.create('band', { name: 'Radiohead' });
    this.server.create('band', { name: 'Long Distance Calling' });

    await visit('/');
    assert.equal(getPageTitle(), 'Bands | Rock & Roll with Octane');

    assert
      .dom('[data-test-rr="band-link"]')
      .exists({ count: 2 }, 'All band links are rendered');
    assert
      .dom('[data-test-rr="band-list-item"]:first-child')
      .hasText('Radiohead', 'The first band link contains the band name');
    assert
      .dom('[data-test-rr="band-list-item"]:last-child')
      .hasText(
        'Long Distance Calling',
        'The other band link contains the band name'
      );
  });

  test('Create a band', async function (assert) {
    this.server.create('band', { name: 'Royal Blood' });

    await visit('/');
    await click('[data-test-rr="new-band-button"]');
    await fillIn('[data-test-rr="new-band-name"]', 'Red Hot Chili Peppers');
    let image = new File([], 'red-hot-chilli-peppers.jpg', {
      size: 343697,
      type: 'image/jpeg',
    });
    await triggerEvent('[name="file-upload"]', 'change', { files: [image] });

    await click('[data-test-rr="save-band-button"]');
    await waitFor('[data-test-rr="no-songs-text"]');

    assert
      .dom('[data-test-rr="band-list-item"]')
      .exists({ count: 2 }, 'A new band link is rendered');
    assert
      .dom('[data-test-rr="band-list-item"]:last-child')
      .hasText(
        'Red Hot Chili Peppers',
        'The new band link is rendered as the last item'
      );
    assert
      .dom('[data-test-rr="songs-nav-item"] > .active')
      .exists('The Songs tab is active');
  });
});
