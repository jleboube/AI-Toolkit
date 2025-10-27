
import { HeadshotStyle } from './types';

export const HEADSHOT_STYLES: HeadshotStyle[] = [
  {
    id: 'corporate_grey',
    name: 'Corporate Grey',
    description: 'A classic professional look with a neutral grey backdrop.',
    prompt: 'A professional corporate headshot of the person in the image. The background should be a clean, solid, slightly out-of-focus medium grey. The lighting should be soft and flattering, creating a professional and trustworthy appearance. The subject should be wearing professional business attire.'
  },
  {
    id: 'tech_office',
    name: 'Modern Tech Office',
    description: 'A contemporary headshot set in a modern office environment.',
    prompt: 'A professional headshot of the person in the image, taken in a modern tech office environment. The background should be a bright, stylish office with elements like glass walls, modern furniture, and blurred-out computer screens. The lighting should be natural and bright. The subject should be wearing smart casual business attire.'
  },
  {
    id: 'outdoor_natural',
    name: 'Outdoor Natural Light',
    description: 'A friendly and approachable headshot with an outdoor, natural setting.',
    prompt: 'A professional headshot of the person in the image, taken outdoors with beautiful natural light. The background should be a pleasant, out-of-focus natural scene, like a park or green space. The lighting should be soft, golden-hour style. The subject should appear approachable and friendly in casual or business-casual attire.'
  },
  {
    id: 'black_white',
    name: 'Classic Black & White',
    description: 'A timeless and dramatic black and white studio portrait.',
    prompt: 'A dramatic and classic black and white studio headshot of the person in the image. Use strong, artistic lighting (like Rembrandt or split lighting) to create depth and character. The background should be dark and non-distracting. The focus should be on the subject\'s expression.'
  },
];
