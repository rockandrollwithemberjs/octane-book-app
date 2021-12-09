import { tracked } from '@glimmer/tracking';

export default class Band {
  @tracked name;
  @tracked songs;

  constructor(attributes, relationships = {}) {
    let { id, name, songs, description } = attributes;
    this.id = id;
    this.name = name;
    this.imageUrl = attributes['image-url'];
    this.songs = songs || [];
    this.relationships = relationships;
    this.description = description;
  }
}
