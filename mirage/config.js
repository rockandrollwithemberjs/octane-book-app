import { Response } from 'miragejs';

const s3BucketUrl = 'https://rarwe-dev.s3.eu-west-1.amazonaws.com';
const bucketName = 'rarwe-dev';
const keyInBucket = 'image-uploads/69c4abfc-e900-4ec7-9263-c2506bdd4c19/';
const imageFileName = 'red-hot-chilli-peppers.jpg';

export default function () {
  this.get('/bands');
  this.get('/bands/:id');
  this.get('/bands/:id/songs', function (schema, request) {
    let id = request.params.id;
    return schema.songs.where({ bandId: id });
  });

  this.post('/bands');
  this.patch('/bands/:id');

  this.post('/presign-aws-request', function () {
    return new Response(
      200,
      {},
      {
        url: s3BucketUrl,
        url_fields: {
          key: keyInBucket + '${filename}',
          success_action_status: '201',
          policy:
            'eyJleHBpcmF0aW9uIjoiMjAyMi0wMy0xN1QxNToyMjozOFoiLCJjb25kaXRpb25zIjpbeyJidWNrZXQiOiJyYXJ3ZS1kZXYifSxbInN0YXJ0cy13aXRoIiwiJGtleSIsImltYWdlLXVwbG9hZHMvNjljNGFiZmMtZTkwMC00ZWM3LTkyNjMtYzI1MDZiZGQ0YzE5LyJdLHsic3VjY2Vzc19hY3Rpb25fc3RhdHVzIjoiMjAxIn0sWyJjb250ZW50LWxlbmd0aC1yYW5nZSIsMCwyMDk3MTUyXSx7IngtYW16LWNyZWRlbnRpYWwiOiJBS0lBWEFGVkg1TExKV0lXMkFRUS8yMDIyMDMxNy9ldS13ZXN0LTEvczMvYXdzNF9yZXF1ZXN0In0seyJ4LWFtei1hbGdvcml0aG0iOiJBV1M0LUhNQUMtU0hBMjU2In0seyJ4LWFtei1kYXRlIjoiMjAyMjAzMTdUMTUwNzM4WiJ9XX0=',
        },
      }
    );
  });

  this.post(s3BucketUrl, function (schema, request) {
    let key = request.requestBody
      .get('key')
      .replace('${filename}', imageFileName);
    let location = `${s3BucketUrl}/${encodeURIComponent(key)}`;
    return new Response(
      201,
      {
        Location: location,
      },
      `<PostResponse>
        <Location>https://rarwe-dev.s3.eu-west-1.amazonaws.com/image-uploads%2F69c4abfc-e900-4ec7-9263-c2506bdd4c19%2Fred-hot-chilli-peppers.jpg</Location>
        <Bucket>${bucketName}</Bucket>
        <Key>image-uploads/69c4abfc-e900-4ec7-9263-c2506bdd4c19/</Key>
        <ETag>"0af669d3f4786c05d779a0a7d44f6c61"</ETag>
      </PostResponse>
      `
    );
  });
}
