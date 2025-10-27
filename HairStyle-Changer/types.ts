export interface Hairstyle {
  id: string;
  name: string;
  imageUrl: string;
  promptDescription: string;
  gender: 'female' | 'male' | 'unisex';
}
