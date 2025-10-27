import { Hairstyle } from './types';

// Helper to generate image URLs from prompts
const createImageUrl = (prompt: string) => {
  const encodedPrompt = encodeURIComponent(prompt + ', realistic, portrait photo');
  return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=200&height=200&nologo=true`;
};

export const HAIRSTYLES: Hairstyle[] = [
  // Female Styles
  {
    id: 'hs01',
    name: 'Blonde Bob',
    promptDescription: 'a chic, shoulder-length blonde bob hairstyle',
    imageUrl: createImageUrl('a chic, shoulder-length blonde bob hairstyle'),
    gender: 'female',
  },
  {
    id: 'hs02',
    name: 'Wavy Brunette',
    promptDescription: 'long, wavy, rich brunette hair',
    imageUrl: createImageUrl('long, wavy, rich brunette hair'),
    gender: 'female',
  },
  {
    id: 'hs03',
    name: 'Fiery Red Curls',
    promptDescription: 'vibrant, fiery red curly hair with lots of volume',
    imageUrl: createImageUrl('vibrant, fiery red curly hair with lots of volume'),
    gender: 'female',
  },
  {
    id: 'hs04',
    name: 'Pastel Pixie',
    promptDescription: 'a short, edgy pixie cut in a pastel pink color',
    imageUrl: createImageUrl('a short, edgy pixie cut in a pastel pink color'),
    gender: 'female',
  },
   {
    id: 'hs06',
    name: 'Black Braids',
    promptDescription: 'intricate, long black box braids',
    imageUrl: createImageUrl('intricate, long black box braids'),
    gender: 'female',
  },
  {
    id: 'hs14',
    name: 'Curtain Bangs',
    promptDescription: 'long hair with trendy curtain bangs framing the face',
    imageUrl: createImageUrl('long hair with trendy curtain bangs framing the face'),
    gender: 'female',
  },
  {
    id: 'hs15',
    name: 'Sleek Ponytail',
    promptDescription: 'a sleek, high ponytail hairstyle',
    imageUrl: createImageUrl('a sleek, high ponytail hairstyle'),
    gender: 'female',
  },
  {
    id: 'hs20',
    name: 'Asymmetrical Bob',
    promptDescription: 'an edgy, asymmetrical dark brown bob, shorter on one side',
    imageUrl: createImageUrl('an edgy, asymmetrical dark brown bob, shorter on one side'),
    gender: 'female',
  },
  {
    id: 'hs21',
    name: 'Top Knot Bun',
    promptDescription: 'a stylish messy top knot bun with face-framing tendrils',
    imageUrl: createImageUrl('a stylish messy top knot bun with face-framing tendrils'),
    gender: 'female',
  },

  // Male Styles
  {
    id: 'hs09',
    name: 'Crew Cut',
    promptDescription: 'a classic short male crew cut hairstyle, faded on the sides',
    imageUrl: createImageUrl('a classic short male crew cut hairstyle, faded on the sides'),
    gender: 'male',
  },
  {
    id: 'hs10',
    name: 'Slicked Back',
    promptDescription: 'a medium-length male hairstyle, slicked back with a wet look',
    imageUrl: createImageUrl('a medium-length male hairstyle, slicked back with a wet look'),
    gender: 'male',
  },
  {
    id: 'hs11',
    name: 'Tousled Waves',
    promptDescription: 'a medium-length male hairstyle with natural, tousled waves',
    imageUrl: createImageUrl('a medium-length male hairstyle with natural, tousled waves'),
    gender: 'male',
  },
    {
    id: 'hs13',
    name: 'Pompadour',
    promptDescription: 'a stylish modern pompadour hairstyle with short sides for men',
    imageUrl: createImageUrl('a stylish modern pompadour hairstyle with short sides for men'),
    gender: 'male',
  },
  {
    id: 'hs16',
    name: 'Faux Hawk',
    promptDescription: 'a short and spiky faux hawk hairstyle with a fade',
    imageUrl: createImageUrl('a short and spiky faux hawk hairstyle with a fade'),
    gender: 'male',
  },
  {
    id: 'hs17',
    name: 'Man Bun',
    promptDescription: 'a long male hairstyle tied up in a man bun',
    imageUrl: createImageUrl('a long male hairstyle tied up in a man bun'),
    gender: 'male',
  },
  {
    id: 'hs22',
    name: 'Curly Fade',
    promptDescription: 'short curly hair on top with a high skin fade on the sides',
    imageUrl: createImageUrl('short curly hair on top with a high skin fade on the sides'),
    gender: 'male',
  },
  {
    id: 'hs23',
    name: 'Caesar Cut',
    promptDescription: 'a short, textured caesar cut with a straight fringe',
    imageUrl: createImageUrl('a short, textured caesar cut with a straight fringe'),
    gender: 'male',
  },
  
  // Unisex Styles
  {
    id: 'hs05',
    name: 'Silver Undercut',
    promptDescription: 'a modern silver-gray hairstyle with an undercut',
    imageUrl: createImageUrl('a modern silver-gray hairstyle with an undercut'),
    gender: 'unisex',
  },
  {
    id: 'hs07',
    name: 'Blue Ombre',
    promptDescription: 'long straight hair with a dark to electric blue ombre effect',
    imageUrl: createImageUrl('long straight hair with a dark to electric blue ombre effect'),
    gender: 'unisex',
  },
  {
    id: 'hs08',
    name: 'Platinum Shag',
    promptDescription: 'a textured platinum blonde shag haircut with layers',
    imageUrl: createImageUrl('a textured platinum blonde shag haircut with layers'),
    gender: 'unisex',
  },
  {
    id: 'hs18',
    name: 'Vibrant Mohawk',
    promptDescription: 'a vibrant green mohawk hairstyle',
    imageUrl: createImageUrl('a vibrant green mohawk hairstyle'),
    gender: 'unisex',
  },
  {
    id: 'hs19',
    name: 'Dreadlocks',
    promptDescription: 'well-maintained, shoulder-length dreadlocks',
    imageUrl: createImageUrl('well-maintained, shoulder-length dreadlocks'),
    gender: 'unisex',
  },
  {
    id: 'hs24',
    name: 'Split Dye',
    promptDescription: 'a split-dye hairstyle, half black and half platinum blonde',
    imageUrl: createImageUrl('a split-dye hairstyle, half black and half platinum blonde'),
    gender: 'unisex',
  },
  {
    id: 'hs25',
    name: 'Galaxy Hair',
    promptDescription: 'a cosmic galaxy-inspired hair color with swirls of blue, purple, and pink',
    imageUrl: createImageUrl('a cosmic galaxy-inspired hair color with swirls of blue, purple, and pink'),
    gender: 'unisex',
  },
];