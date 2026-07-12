const prisma = require('../../config/prisma');

const generateAssetTag = async (tx, organizationId) => {
  const latest = await tx.asset.findFirst({
    where: {
      organizationId,
      assetTag: { startsWith: 'AF-' },
    },
    orderBy: { assetTag: 'desc' },
    select: { assetTag: true },
  });

  let nextNumber = 1;
  if (latest) {
    const match = latest.assetTag.match(/^AF-(\d+)$/);
    if (match) {
      nextNumber = parseInt(match[1], 10) + 1;
    }
  }

  return `AF-${String(nextNumber).padStart(4, '0')}`;
};

module.exports = { generateAssetTag };
