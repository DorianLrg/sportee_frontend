import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: { sports: [null, null, null, null], habits: [], level: '', sliderValue: 5, selectedOption: '', selectedParticipants: [] },
  dateTime: null
}

export const preferencesSlice = createSlice({
  name: 'preferences',

  initialState,
  reducers: {
    addSport: (state, action) => {
      const { sportIndex, sport } = action.payload
      state.value.sports.splice(sportIndex, 1, sport)
    },
    removeSport: (state, action) => {
      state.value.sports.splice(action.payload.sportIndex, 1, null)
    },
    removeAllSports: (state) => {
      state.value.sports = [null, null, null, null]
    },
    addHabit: (state, action) => {
      state.value.habits.push(action.payload)
    },
    removeHabit: (state, action) => {
      state.value.habits = state.value.habits.filter(e => e !== action.payload)
    },
    removeAllHabits: (state) => {
      state.value.habits = []
    },
    selectLevel: (state, action) => {
      state.value.level = action.payload
    },
    updateSliderValue: (state, action) => {
      state.value.sliderValue = action.payload
    },
    setDateTime: (state, action) => {
      state.dateTime = action.payload
    },
    setSlotOption: (state, action) => {
      state.value.selectedOption = action.payload
    },
    setSelectedParticipants: (state, action) => {
      state.value.selectedParticipants = action.payload
    },
  },
})

export const { addSport, removeSport, removeAllSports, addHabit, removeHabit, removeAllHabits, selectLevel, updateSliderValue, setDateTime, setSlotOption, setSelectedParticipants } = preferencesSlice.actions;
export default preferencesSlice.reducer;