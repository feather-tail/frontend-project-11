import * as yup from 'yup';

const buildSchema = (existingUrls) =>
  yup.object().shape({
    url: yup.string().required().url().notOneOf(existingUrls),
  });

export default buildSchema;
