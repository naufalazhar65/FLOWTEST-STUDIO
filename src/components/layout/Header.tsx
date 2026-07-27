// import { File, FolderOpen, Save } from "lucide-react";
// import { exportProject } from "../../features/flow/services/exportService";
// import { useFlowStore } from "../../features/flow/store/useFlowStore";
// import { openJsonFile } from "../../features/flow/services/filePicker";
// import { importProject } from "../../features/flow/services/importService";

// export function Header() {
//     const {
//   saveProject,
//   loadProject,
// } = useFlowStore();
//     return (
//         <header
//             style={{
//                 height: 48,
//                 background: "#0D1117",
//                 borderBottom: "1px solid #30363D",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 padding: "0 18px",
//             }}
//         >
//             <div
//                 style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 10,
//                     color: "#FFF",
//                     fontWeight: 700,
//                     fontSize: 15,
//                 }}
//             >
//                 <File size={18} />
//                 FlowTest Studio
//             </div>

//             <div
//                 style={{
//                     display: "flex",
//                     gap: 10,
//                 }}
//             >
//                 <button
//                     style={buttonStyle}
//                     onClick={async () => {
//                         const file = await openJsonFile();

//                         if (!file) return;

//                         const project =
//                             await importProject(file);

//                         loadProject(project);
//                     }}
//                 >
//                     <FolderOpen size={16} />
//                     Open
//                 </button>

//                 <button
//                     style={buttonStyle}
//                     onClick={() =>
//                         exportProject(
//                             saveProject("Untitled")
//                         )
//                     }
//                 >
//                     <Save size={16} />
//                     Save
//                 </button>
//             </div>
//         </header>
//     );
// }

// const buttonStyle: React.CSSProperties = {
//     display: "flex",
//     alignItems: "center",
//     gap: 8,
//     background: "#202632",
//     border: "1px solid #313847",
//     color: "#FFF",
//     borderRadius: 8,
//     padding: "8px 12px",
//     cursor: "pointer",
// };