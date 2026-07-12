const getPaginationData = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  const skip = (page - 1) * limit;

  return {
    skip,
    take: limit,
    meta: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};

module.exports = {
  getPaginationData,
};
