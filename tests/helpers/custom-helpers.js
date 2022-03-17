import { click, fillIn, triggerEvent } from '@ember/test-helpers';

export async function createBand({ name, image }) {
  await click('[data-test-rr="new-band-button"]');
  await fillIn('[data-test-rr="new-band-name"]', name);
  if (image) {
    await triggerEvent('[name="file-upload"]', 'change', { files: [image] });
  }
  return click('[data-test-rr="save-band-button"]');
}
