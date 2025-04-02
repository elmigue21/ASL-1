// 'use client'
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import {TablePageState} from "../../types/tablePageState";
// import { PostgrestSingleResponse } from "@supabase/supabase-js";
// import { supabase } from "@/lib/supabase";
// import { Subscription } from "@/types/subscription";


// const initialState: TablePageState = {
//   data: {},
// };

// export const fetchPageData = createAsyncThunk(
//   "pagination/fetchPageData",
//   async (page: number, { getState }) => {
//     const state = getState() as { pagination: TablePageState };

//     console.log('fetchj page dataa', page)
//     // Check if the page is already cached
//     // if (state.pagination.data[page]) {
//     //     console.log('GOT TRUE')
//     //   return { page, data: state.pagination.data[page] };
//     // }
//     // else{
//     //     console.log('GOT FALSE')
//     // }
//     // Fetch data from Supabase
//     const { data, error }=
//       await supabase
//         .from("subscriptions")
//         .select("*")
//         .range(page * 10, (page + 1) * 10 - 1);
//     // console.log('GOT PASS FETCH!!!', data);

//     if (error) {
//       console.error("Error fetching subscriptions:", error);
//       throw new Error(error.message);
//     }

//     // console.log('fetch page data', data);

//     return { page, data: data || [] }; // Ensure 'data' is always an array
//   }
// );

// const paginationSlice = createSlice({
//   name: "pagination",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder.addCase(fetchPageData.fulfilled, (state, action) => {
//         console.log('fulfilleddd')
//       state.data[action.payload.page] = action.payload.data; // Cache the fetched page
//     });
//   },
// });

// export default paginationSlice.reducer;
