import AsyncStorage from "@react-native-async-storage/async-storage";
import { GROUP_COLLECTION } from "@storage/storageConfig";
import { groupsGetAll } from "@storage/group/groupsGetAll";
import { AppError } from "@utils/AppError";

export async function groupCreate(name: string){
  try {
    const groups = await groupsGetAll()

    if(groups.includes(name)){
      throw new AppError('Já existe um grupo cadastrado com este nome.')
    }

    groups.push(name)
    await AsyncStorage.setItem(GROUP_COLLECTION, JSON.stringify(groups))
    
  } catch (error) {
    throw error
  }
}