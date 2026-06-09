function buildQueries(scene) {

  const queries = [];

  if (scene.keywords?.length) {
    queries.push(
      scene.keywords.join(" ")
    );

    queries.push(
      ...scene.keywords
    );
  }

  return [
    ...new Set(queries)
  ];
}

module.exports = {
  buildQueries
};