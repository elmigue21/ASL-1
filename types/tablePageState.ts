export interface TablePageState {
  data: Record<number, any[]>; // Store pages in a dictionary { pageNumber: data[] }
//   status: "idle" | "loading" | "succeeded" | "failed";
}
