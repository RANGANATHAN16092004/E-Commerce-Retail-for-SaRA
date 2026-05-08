import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchMyOrders = createAsyncThunk('orders/fetchMy', async (_, { getState }) => {
  const { auth: { userInfo } } = getState();
  const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
  const { data } = await axios.get('/api/orders/myorders', config);
  return data;
});

const orderSlice = createSlice({
  name: 'orders',
  initialState: { myOrders: [], allOrders: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyOrders.pending, (state) => { state.loading = true; })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.myOrders = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default orderSlice.reducer;
