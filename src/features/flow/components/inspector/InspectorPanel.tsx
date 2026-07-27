// import { useFlowStore } from "../../store/useFlowStore";

// import { InspectorField } from "./InspectorField";

// import { getNodePlugin } from "../../services/pluginRegistry";

// import { validateNode } from "../../validation/validateNode";

// export function InspectorPanel() {
//     const {
//         nodes,
//         selectedNodeId,
//         updateNodeData,
//     } = useFlowStore();

//     const node = nodes.find(
//         (node) => node.id === selectedNodeId
//     );

//     if (!node) {
//         return (
//             <div
//                 style={{
//                     padding: 24,
//                     color: "#8B949E",
//                 }}
//             >
//                 Select a node
//             </div>
//         );
//     }

//     const plugin = getNodePlugin(
//         node.data.action
//     );

//     const validation = validateNode(node.data);
//     console.log(validation);


//     if (!plugin) {
//         return (
//             <div
//                 style={{
//                     padding: 24,
//                     color: "#EF4444",
//                 }}
//             >
//                 Unknown node
//             </div>
//         );
//     }

//     return (
//         <div
//             style={{
//                 padding: 24,
//                 color: "#FFF",
//             }}
//         >
//             <h2
//                 style={{
//                     marginTop: 0,
//                 }}
//             >
//                 {plugin.title}
//             </h2>

//             <p
//                 style={{
//                     color: "#8B949E",
//                     marginBottom: 28,
//                 }}
//             >
//                 {plugin.subtitle}
//             </p>
//             <div
//                 style={{
//                     background: "red",
//                     color: "white",
//                     padding: 10,
//                     marginBottom: 20,
//                 }}
//             >
//                 TEST INSPECTOR
//             </div>

//             {!validation.valid && (
//                 <div
//                     style={{
//                         marginBottom: 20,
//                         padding: 14,
//                         borderRadius: 10,
//                         background: "#3A1618",
//                         border: "1px solid #EF4444",
//                     }}
//                 >
//                     <div
//                         style={{
//                             color: "#FCA5A5",
//                             fontWeight: 700,
//                             marginBottom: 8,
//                         }}
//                     >
//                         Validation Errors
//                     </div>

//                     {validation.errors.map((error) => (
//                         <div
//                             key={error}
//                             style={{
//                                 color: "#FCA5A5",
//                                 fontSize: 13,
//                                 marginBottom: 4,
//                             }}
//                         >
//                             • {error}
//                         </div>
//                     ))}
//                 </div>
//             )}
//             {validation.valid && (
//                 <div
//                     style={{
//                         marginBottom: 20,
//                         padding: 12,
//                         borderRadius: 10,
//                         background: "#12341F",
//                         border: "1px solid #10B981",
//                         color: "#6EE7B7",
//                         fontWeight: 600,
//                     }}
//                 >
//                     ✓ Node is valid
//                 </div>
//             )}

//             {plugin.fields.map((field) => (
//                 <InspectorField
//                     key={field.key}
//                     field={field}
//                     value={String(
//                         node.data[field.key] ?? ""
//                     )}
//                     onChange={(value) =>
//                         updateNodeData(node.id, {
//                             [field.key]: value,
//                         })
//                     }
//                 />
//             ))}
//         </div>
//     );
// }