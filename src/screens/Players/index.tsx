import React, { useCallback, useState, useRef } from 'react'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import { FlatList, Keyboard, TextInput } from 'react-native'
import { Alert } from 'react-native';

import { Header } from '@components/Header'
import { Highlight } from '@components/Highlight'
import { ButtonIcon } from '@components/ButtonIcon'
import { Input } from '@components/Input'
import { Filter } from '@components/Filter'
import { PlayerCard } from '@components/PlayerCard'
import { ListEmpty } from '@components/ListEmpty'
import { Button } from '@components/Button'

import { playerAddByGroup } from '@storage/player/playerAddByGroup'
import { playersGetByGroup } from '@storage/player/playerGetByGroup'
import { PlayerStorageDTO } from '@storage/player/PlayerStorageDTO';
import { playersGetByGroupAndTeam } from '@storage/player/playersGetByGroupAndTeam';

import { AppError } from '@utils/AppError'

import { Container, Form, HeaderList, NumberOfPlayers } from './styles'
import { playersRemoveByGroup } from '@storage/player/playerRemoveByGroup';
import { groupRemoveByName } from '@storage/group/groupRemoveByName';
import { Loading } from '@components/Loading';

type RouteParams = {
  group: string
}

export function Players() {
  const [isLoading, setIsLoading] = useState(true)
  const navigation = useNavigation()

  const [ team, setTeam ] = useState('Time A')
  const [ newPlayerName, setNewPlayerName ] = useState('')
  const [ players, setPlayers ] = useState<PlayerStorageDTO[]>([])

  const route = useRoute();
  const { group } = route.params as RouteParams;

  const newPlayerNameInputRef = useRef<TextInput>(null)

  async function handleAddPlayer() {
    if(newPlayerName.trim().length === 0) {
      return Alert.alert('Novo Player', 'Informe o nome do Player');
    }

    const newPlayer: PlayerStorageDTO = {
      name: newPlayerName,
      team
    }

    try {
      const storedPlayers = await playersGetByGroup(group)
      const playerExists = storedPlayers.find(player => player.name === newPlayer.name)
      if(playerExists){
        return Alert.alert('Novo Player', `${playerExists.name} já está no time ${playerExists.team}`)
      }
      await playerAddByGroup(newPlayer, group)
      setNewPlayerName('')
      newPlayerNameInputRef.current?.blur()
      fetchPlayersByTeam()
    } catch (error) {
      if(error instanceof AppError){
        Alert.alert('Novo Player', error.message)
      } else {
        Alert.alert('Novo Player', 'Erro ao cadastrar novo Player')
      }
    }
  }

  async function handleRemovePlayer(playerName: string) {
    try {
      await playersRemoveByGroup(group, playerName)
      fetchPlayersByTeam()
    } catch (error) {
      if(error instanceof AppError){
        Alert.alert('Remover Player', error.message)
      } else {
        Alert.alert('Remover Player', 'Erro ao remover este Player')
      }
    }
  }

  async function handleRemoveGroup() {
    Alert.alert(
      'Remover',
      `Deseja remover a turma '${group}'?`,
      [
        {text: 'Não', style: 'cancel'},
        {text: 'Sim', onPress: () => removeGroup()}
      ] 
    )
  }

  async function removeGroup() {
    try {
      await groupRemoveByName(group)
      navigation.navigate('groups')
    } catch (error) {
      if(error instanceof AppError){
        Alert.alert('Remover Grupo', error.message)
      } else {
        Alert.alert('Remover Grupo', 'Erro ao remover este Grupo')
      }
    }
  }

  async function fetchPlayersByTeam() {
    try {
      setIsLoading(true)
      const storedPlayers = await playersGetByGroupAndTeam(group, team)
      setPlayers(storedPlayers)
    } catch (error) {
      if(error instanceof AppError){
        Alert.alert('Players', error.message)
      } else {
        Alert.alert('Players', 'Erro ao buscar os Player')
      }
    } finally {
      setIsLoading(false)
    }
  }

  useFocusEffect(useCallback(() => {
    fetchPlayersByTeam()
  }, [team]))

  return (
    <Container>
      <Header showBackButton />    

      <Highlight 
        title={group}
        subtitle='adicione a galera e separe os times'
      />

      <Form>
        <Input
          inputRef={newPlayerNameInputRef}
          value={newPlayerName}
          onChangeText={setNewPlayerName}
          placeholder='Nome do player'
          autoCorrect={false}
          onSubmitEditing={handleAddPlayer}
          returnKeyType='done'
        />
        <ButtonIcon 
          icon='add'
          onPress={handleAddPlayer}
        />
      </Form>

      <HeaderList>
        <FlatList 
          data={['Time A', 'Time B']}
          keyExtractor={item => item}
          renderItem={({item}) => (
            <Filter 
              title={item}
              isActive={item === team}
              onPress={() => setTeam(item)}
            />
          )}
          horizontal
        />

        <NumberOfPlayers>
          {players.length}
        </NumberOfPlayers>
      </HeaderList>


      {
        isLoading ? <Loading /> :
        <FlatList 
          data={players}
          keyExtractor={item => item.name}
          renderItem={({item}) => (
            <PlayerCard 
              name={item.name} 
              key={item.name}
              onRemovePlayer={() => handleRemovePlayer(item.name)}
            />
          )}
          ListEmptyComponent={() => (
            <ListEmpty 
              message='Nenhum player por enquanto :('
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            {paddingBottom: 100},
            players.length === 0 && { flex: 1 }
          ]}
        />
      }
      <Button 
        title='Remover Turma'
        type='SECONDARY'
        onPress={handleRemoveGroup}
      />
    </Container>
  )
}