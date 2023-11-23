import Joi from 'joi';

const paginationObj = {
  page: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).default(10),
  sortByDate: Joi.string().valid('asc', 'desc').default('asc'),
};
const paginationSchema = Joi.object(paginationObj);

const notesCreateSchema = Joi.object({
  title: Joi.string().max(255).required(),
  body: Joi.string().required(),
});

const notesUpdateSchema = Joi.object({
  title: Joi.string().max(255).required(),
  body: Joi.string().required(),
});

export { notesCreateSchema, notesUpdateSchema, paginationSchema };
