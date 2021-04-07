import { normalize, schema } from 'normalizr';

// This scheme is for SectionPage's data
const lessons = new schema.Entity('lessons', {}, { idAttribute: 'title' });
const sections = new schema.Entity('sections', { lessons: [lessons] }, { idAttribute: 'title' });

function normalizeData(data) {
  return normalize(data, [sections]);
}

export default normalizeData;
