// Minimal stub for withTestDetails used by tests.
// This returns the metadata object so test wrappers that accept
// (name, meta, fn) continue to work.
export const withTestDetails = (meta: Record<string, unknown>) => meta;

export default withTestDetails;
