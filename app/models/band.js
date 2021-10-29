import { tracked } from '@glimmer/tracking';

export default class Band {
  @tracked name;
  @tracked songs;

  constructor({ id, name, songs, imageURL, description }, relationships = {}) {
    this.id = id;
    this.name = name;
    this.imageURL = imageURL;
    this.songs = songs || [];
    this.relationships = relationships;
    this.description = description;
  }
}
