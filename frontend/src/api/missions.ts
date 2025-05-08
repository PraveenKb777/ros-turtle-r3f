import axios from 'axios';
import type { Mission } from '../types/missions';


const API_URL = 'http://localhost:4000/missions';

export const fetchMissions = async (): Promise<Mission[]> => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const saveMission = async (mission: Mission): Promise<Mission> => {
  const res = await axios.post(API_URL, mission);
  return res.data;
};
