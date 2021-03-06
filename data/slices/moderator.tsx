import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ModPerm, InterfaceSettings, ModeratorData } from '../../utils/other'

interface ModeratorState {
  authorized?: boolean
  permissions?: ModPerm[]
  mode?: string
  retryPath?: string
}

const initialState = {} as ModeratorState

export const moderatorSlice = createSlice({
  name: "moderator",
  initialState,
  reducers: {
    signIn: (state, action: PayloadAction<ModeratorData>) => {
      state.authorized = true
      state.retryPath = undefined
      state.permissions = [...action.payload.permissions]
      if (action.payload.mode !== undefined) state.mode = action.payload.mode
    },
    fail: (state, action: PayloadAction<string | undefined>) => {
      state.authorized = false
      if (action.payload !== undefined) state.retryPath = action.payload
    },
    signOut: state => {
      state.authorized = false
      state.retryPath = undefined
      state.permissions = undefined
    },
    settings: (state, action: PayloadAction<InterfaceSettings>) => {
      if (action.payload.mode !== undefined) state.mode = action.payload.mode
    }
  }
})

export const { signIn, fail, signOut, settings } = moderatorSlice.actions

export default moderatorSlice.reducer
