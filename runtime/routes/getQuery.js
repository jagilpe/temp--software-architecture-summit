'use strict';

const getQuery = function ({ viewstore }) {
  return function (req, res) {
    const { queryName: viewName } = req.params;

    const view = viewstore.getView({ viewName });

    res.json(view);
  };
};

module.exports = getQuery;
