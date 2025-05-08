import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { fetchMissions } from "../api/missions";
import type { Mission } from "../types/missions";

interface IState {
    isMapping: boolean,
    path: { x: number; y: number; theta?: number }[],
    missionRunning: boolean,
    start: { x: number, y: number } | null,
    end: { x: number, y: number } | null,
    pose: { x: number; y: number; theta: number }
    allMission: Mission[]

}


const initialState: IState = {
    isMapping: false,
    path: [],
    missionRunning: false,
    end: null,
    start: null,
    pose: { x: 5.5, y: 5.5, theta: 0 },
    allMission: []

}

export const getAllmission = createAsyncThunk("fetch mission", async () => {

    return await fetchMissions()


})

export const buttonSlice = createSlice({
    name: "button/slice",
    initialState,
    reducers: {
        setIsMapping: (state, action: PayloadAction<boolean>) => {
            state.isMapping = action.payload
        },
        setMissionRunning: (state, action: PayloadAction<boolean>) => {
            state.missionRunning = action.payload
        },
        setStation: (state) => {
            const offsetX = state.pose.x - 5.5;
            const offsetY = state.pose.y - 5.5;
            const pos = { x: offsetX, y: offsetY }
            if (state.isMapping === false) {
                state.isMapping = true
                state.start = pos
            } else {
                state.isMapping = false
                state.end = pos
            }


        }, setPose: (state, action) => {
            if (state.pose !== action.payload) {
                state.pose = action.payload
            }
        },
        setPath: (state, action: PayloadAction<{ x: number; y: number; theta: number }>) => {
            const last = state.path[state.path.length - 1];
            const current = action.payload;

            const rounded = {
                x: parseFloat(current.x.toFixed(2)),
                y: parseFloat(current.y.toFixed(2)),
                theta: parseFloat(current.theta.toFixed(2)),
            };

            if (!last || Math.abs(last.x - rounded.x) > 0.05 || Math.abs(last.y - rounded.y) > 0.05) {
                state.path.push(rounded);
            }
        }, setStart: (state, action: PayloadAction<{ x: number; y: number }>) => {
            state.start = action.payload;
        },

        setEnd: (state, action: PayloadAction<{ x: number; y: number }>) => {
            state.end = action.payload;
        },

        setPathBulk: (state, action: PayloadAction<{ x: number; y: number; theta?: number }[]>) => {
            state.path = action.payload;
        },
        resetState: (state) => {
            state.isMapping = false
            state.path = []
            state.missionRunning = false
            state.end = null
            state.start = null

        }

    },
    extraReducers: (builder) => {
        builder.addCase(getAllmission.fulfilled, (state, action) => {
            state.allMission = action.payload
        })
    }
})


export const {
    setIsMapping,
    setMissionRunning,
    resetState,
    setPath,
    setStation,
    setPose,
    setStart,
    setEnd,
    setPathBulk
} = buttonSlice.actions;

export const buttonReducer = buttonSlice.reducer