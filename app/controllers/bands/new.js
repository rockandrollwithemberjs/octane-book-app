import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import fetch from 'fetch';

const MAX_IMAGE_SIZE = 1 * 1024 * 1024;
export default class BandsNewController extends Controller {
  @service catalog;
  @service router;

  @tracked name;
  @tracked imagePreviewSrc;
  imageToUpload;

  @tracked validationError;

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
    this.validationError = '';
    let [file] = event.target.files;
    if (file.size > MAX_IMAGE_SIZE) {
      this.validationError = 'Image should be smaller than 2MB.';
      return;
    }
    this.imageToUpload = file;
    this.imagePreviewSrc = URL.createObjectURL(file);
  }

  @action
  async saveBand(event) {
    event.preventDefault();
    let response = await fetch('/presign-aws-request', {
      method: 'POST',
    });
    let { url, url_fields: urlFields } = await response.json();
    let bandProperties = {
      name: this.name,
    };

    let formData = new FormData();
    for (let field in urlFields) {
      formData.append(field, urlFields[field]);
    }
    formData.append('file', this.imageToUpload);

    let imageUploadResponse = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (imageUploadResponse.ok) {
      bandProperties['image-url'] = imageUploadResponse.headers.get('Location');
      this.imageToUpload = null;
    }

    let band = await this.catalog.create('band', bandProperties);
    this.confirmedLeave = true;
    this.router.transitionTo('bands.band.songs', band.id);
  }
}
