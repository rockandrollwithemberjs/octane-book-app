import { helper } from '@ember/component/helper';

export function capitalize(input) {
  let words = input[0].split(/\s+/).map((word) => {
    return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
  });
  return words.join(' ');
}

export default helper(capitalize);
