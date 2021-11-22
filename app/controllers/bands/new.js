import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import fetch from 'fetch';
export default class BandsNewController extends Controller {
  @service catalog;
  @service router;

  @tracked name;
  @tracked imagePreviewSrc;
  imageToUpload;

  constructor() {
    super(...arguments);
    this.router.on('routeWillChange', (transition) => {
      if (transition.isAborted) {
        return;
      }
      if (this.confirmedLeave) {
        return;
      }
      if (transition.from?.name === 'bands.new') {
        if (this.name) {
          let leave = window.confirm('You have unsaved changes. Are you sure?');
          if (leave) {
            this.confirmedLeave = true;
          } else {
            transition.abort();
          }
        }
      }
    });
  }

  @action
  updateName(event) {
    this.name = event.target.value;
  }

  @action
  didUploadImage(event) {
    let [file] = event.target.files;
    this.imageToUpload = file;
    this.imagePreviewSrc = URL.createObjectURL(file);
  }

  @action
  async saveBand(event) {
    event.preventDefault();
    //TODO: The actual file only needs to be passed if we want to restrict
    // handing out presigned URLs based on it (type, size, etc.)
    let response = await fetch('/presigned-aws-url', {
      method: 'POST',
    });
    let { url, url_fields: urlFields } = await response.json();

    let formData = new FormData();
    for (let field in urlFields) {
      formData.append(field, urlFields[field]);
    }
    formData.append('file', this.imageToUpload);

    let imageUploadResponse = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    await imageUploadResponse.json();
    //TODO: Get the `Location` response header which is where the uploaded image lives
    //TODO: If the upload was successful, then we should reset `this.imageToUpload`

    let band = await this.catalog.create('band', { name: this.name });
    this.confirmedLeave = true;
    this.router.transitionTo('bands.band.songs', band.id);
  }
}
