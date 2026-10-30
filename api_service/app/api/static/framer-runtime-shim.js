// The published Framer component only needs these editor APIs when it is hosted
// inside Framer. Keep its browser rendering and WebGL implementation untouched.
export const ControlType = new Proxy({}, { get: (_target, name) => name });
export const addPropertyControls = () => {};
export const useIsStaticRenderer = () => false;
