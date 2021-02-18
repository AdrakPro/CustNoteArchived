import { normalize, schema } from 'normalizr';

// This scheme is for SectionPage's data
const lessons = new schema.Entity('lessons', {}, { idAttribute: 'lessonTitle' });
const sections = new schema.Entity('sections', { lessons: [lessons] }, { idAttribute: 'sectionTitle' });

// This scheme is for LessonPage's data
const subjects = new schema.Entity('subjects', {}, { idAttribute: 'subjectTitle' });
const modules = new schema.Entity('modules', { subjects: [subjects] }, { idAttribute: 'moduleTitle' });

const SECTIONS_SCHEME = 'sections';
const MODULES_SCHEME = 'modules';

function normalizeData(data, schemeType) {
  const scheme = schemeType === SECTIONS_SCHEME ? sections : modules;
  return normalize(data, [scheme]);
}

export default normalizeData;

export {
  SECTIONS_SCHEME,
  MODULES_SCHEME,
};
