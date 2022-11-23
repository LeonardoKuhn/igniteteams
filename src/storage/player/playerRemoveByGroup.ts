import AsyncStorage from "@react-native-async-storage/async-storage";

import { PLAYER_COLLECTION } from "@storage/storageConfig";
import { playersGetByGroup } from "./playerGetByGroup";

export async function playersRemoveByGroup(group: string, playerName: string) {
  try {
    const storedPlayers = await playersGetByGroup(group)

    const players = storedPlayers.filter(player => player.name !== playerName)

    const storage = JSON.stringify(players)

    await AsyncStorage.setItem(`${PLAYER_COLLECTION}-${group}`, storage)
  } catch (error) {
    throw error
  }
}