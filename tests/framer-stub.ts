// Runtime stand-in for the "framer" module, which Framer provides in the editor and
// the npm package only types. Tests just need the calls to be harmless.
export const ControlType = new Proxy({}, { get: (_t, k) => String(k) }) as Record<string, string>
export function addPropertyControls(component: any, controls: any) {
    component.propertyControls = controls
}
