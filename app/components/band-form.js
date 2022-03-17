import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import fetch from 'fetch';
import ENV from 'rarwe/config/environment';

const MAX_IMAGE_SIZE_MB = 1;
const MAX_IMAGE_SIZE = MAX_IMAGE_SIZE_MB * 1024 * 1024;

export default class BandFormComponent extends Component {
  @service catalog;
  @service router;

  @tracked name;
  @tracked imagePreviewSrc;
  imageToUpload;

  @tracked validationError;

  constructor() {
    super(...arguments);
    if (!this.args.band) {
      return;
    }
    let { name, imageUrl } = this.args.band;
    this.name = name;
    this.imagePreviewSrc = imageUrl;
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
      this.validationError = `Image should be smaller than ${MAX_IMAGE_SIZE} MB.`;
      return;
    }
    this.imageToUpload = file;
    this.imagePreviewSrc = URL.createObjectURL(file);
  }

  @action
  async save(event) {
    event.preventDefault();
    let bandProperties = {
      name: this.name,
    };

    if (this.imageToUpload) {
      let response = await fetch(`${ENV.apiHost}/presign-aws-request`, {
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

      if (imageUploadResponse.ok) {
        bandProperties['image-url'] =
          imageUploadResponse.headers.get('Location');
        this.imageToUpload = null;
      }
    }

    return await this.args.onSave(bandProperties);
  }
}
