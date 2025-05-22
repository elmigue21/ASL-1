// "use client";

// import * as React from "react";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// interface StatusFilterProps {
//   onFilterChangeAction: (filters: {
//     archive_status: boolean | null;
//     verified_status: boolean | null;
//   }) => void;
// }

// const options: { label: string; value: boolean | null }[] = [
//   { label: "No filter", value: null },
//   { label: "True", value: true },
//   { label: "False", value: false },
// ];

// export const StatusFilter: React.FC<StatusFilterProps> = ({
//   onFilterChangeAction,
// }) => {
//   const [archiveStatus, setArchiveStatus] = React.useState<boolean | null>(
//     null
//   );
//   const [verifiedStatus, setVerifiedStatus] = React.useState<boolean | null>(
//     null
//   );

//   const handleArchiveChange = (value: string) => {
//     const val = parseValue(value);
//     setArchiveStatus(val);
//     onFilterChangeAction({ archive_status: val, verified_status: verifiedStatus });
//   };

//   const handleVerifiedChange = (value: string) => {
//     const val = parseValue(value);
//     setVerifiedStatus(val);
//     onFilterChangeAction({ archive_status: archiveStatus, verified_status: val });
//   };

//   const parseValue = (value: string): boolean | null => {
//     if (value === "true") return true;
//     if (value === "false") return false;
//     return null;
//   };

//   return (
//     <div className="flex space-x-4">
//       <div>
//         <Select
//           value={String(archiveStatus)}
//           onValueChange={handleArchiveChange}
//         >
//           <SelectTrigger className="w-36">
//             <SelectValue placeholder="Archive Status" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectGroup>
//               <SelectLabel>Archive Status</SelectLabel>
//               {options.map((opt) => (
//                 <SelectItem key={String(opt.value)} value={String(opt.value)}>
//                   {opt.label}
//                 </SelectItem>
//               ))}
//             </SelectGroup>
//           </SelectContent>
//         </Select>
//       </div>

//       <div>
//         <Select
//           value={String(verifiedStatus)}
//           onValueChange={handleVerifiedChange}
//         >
//           <SelectTrigger className="w-36">
//             <SelectValue placeholder="Verified Status" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectGroup>
//               <SelectLabel>Verified Status</SelectLabel>
//               {options.map((opt) => (
//                 <SelectItem key={String(opt.value)} value={String(opt.value)}>
//                   {opt.label}
//                 </SelectItem>
//               ))}
//             </SelectGroup>
//           </SelectContent>
//         </Select>
//       </div>
//     </div>
//   );
// };
