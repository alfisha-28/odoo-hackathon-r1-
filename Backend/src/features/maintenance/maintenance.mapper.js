const mapMaintenanceList = (request) => ({
  id: request.id,
  asset: request.asset ? {
    id: request.asset.id,
    assetTag: request.asset.assetTag,
    name: request.asset.name,
  } : null,
  raisedBy: request.raisedBy ? {
    id: request.raisedBy.id,
    name: request.raisedBy.name,
  } : null,
  issueDescription: request.issueDescription,
  priority: request.priority,
  status: request.status,
  photoUrl: request.photoUrl ?? null,
  createdAt: request.createdAt,
});

const mapMaintenanceDetail = (request) => ({
  ...mapMaintenanceList(request),
  approvedBy: request.approvedBy ? {
    id: request.approvedBy.id,
    name: request.approvedBy.name,
  } : null,
  approvedAt: request.approvedAt ?? null,
  rejectionReason: request.rejectionReason ?? null,
  technician: request.technician ? {
    id: request.technician.id,
    name: request.technician.name,
  } : null,
  technicianName: request.technicianName ?? null,
  resolvedAt: request.resolvedAt ?? null,
  resolutionNotes: request.resolutionNotes ?? null,
  updatedAt: request.updatedAt,
});

module.exports = { mapMaintenanceList, mapMaintenanceDetail };
