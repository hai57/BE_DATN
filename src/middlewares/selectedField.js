
const selectFieldsMiddleware = (selectedFields) => {
  return (req, res, next) => {
    if (res.locals.data) {
      if (Array.isArray(res.locals.data)) {
        res.locals.data = res.locals.data.map(item => selectFields(item, selectedFields));
      } else {
        res.locals.data = selectFields(res.locals.data, selectedFields);
      }
    }
    next();
  };
};

const selectFields = (object, selectedFields) => {
  const selectedObject = {};
  selectedFields.forEach(field => {
    if (object.hasOwnProperty(field)) {
      selectedObject[field] = object[field];
    }
  });
  return selectedObject;
};

export default selectFieldsMiddleware;
