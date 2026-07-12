const mapCategory = (cat) => ({
  id: cat.id,
  name: cat.name,
  description: cat.description ?? null,
  customFields: cat.customFields ?? null,
  organizationId: cat.organizationId,
  createdAt: cat.createdAt,
  updatedAt: cat.updatedAt,
});

module.exports = { mapCategory };
