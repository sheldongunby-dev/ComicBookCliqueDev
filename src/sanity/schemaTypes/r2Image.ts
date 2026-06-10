import { defineType, defineField } from 'sanity';
import { R2ImageUpload } from '../components/R2ImageUpload';

export const r2Image = defineType({
  name: 'r2-image',
  title: 'R2 Media (Cloudflare)',
  type: 'object',
  components: {
    input: R2ImageUpload,
  },
  fields: [
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      hidden: true, // Hidden because the custom input handles it
    }),
    defineField({
      name: 'alt',
      title: 'Alt Text',
      type: 'string',
      description: 'Important for SEO and accessibility. Describe the image.',
    }),
  ],
});
