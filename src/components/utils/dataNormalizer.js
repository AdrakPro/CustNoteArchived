import { normalize, schema } from 'normalizr';

// This scheme is for SectionPage's data
const lessons = new schema.Entity('lessons', {}, { idAttribute: 'lessonTitle' });
const sections = new schema.Entity('sections', { lessons: [lessons] }, { idAttribute: 'sectionTitle' });

function normalizeData(data) {
  return normalize(data, [sections]);
}

export default normalizeData;
