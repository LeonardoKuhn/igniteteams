import React, { useCallback, useState } from 'react';
import { FlatList } from 'react-native'
import { useNavigation, useFocusEffect } from '@react-navigation/native'

import { GroupCard } from '@components/GroupCard';
import { Header } from '@components/Header';
import { Highlight } from '@components/Highlight';
import { ListEmpty } from '@components/ListEmpty';
import { Button } from '@components/Button';
import { groupsGetAll } from '@storage/group/groupsGetAll';

import { Container } from './styles'
import { Loading } from '@components/Loading';

export function Groups() {
  const [isLoading, setIsLoading] = useState(true)

  const [groups, setGroups] = useState<string[]>([])

  const navigation = useNavigation();

  function handleNewGroup() {
    navigation.navigate('new')
  }

  async function fetchGroups() {
    try {
      setIsLoading(true)
      const storedGroups = await groupsGetAll()
      setGroups(storedGroups)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  function handleOpenGroup(group: string) {
    navigation.navigate('players', {group})
  }

  useFocusEffect(useCallback(() => {
    fetchGroups()
  }, []))

  return (
    <Container>
      <Header />

      <Highlight 
        title="Turmas" 
        subtitle="Jogue com a sua turma"
      />

      {
        isLoading ? <Loading /> :
      
        <FlatList 
          data={groups}
          keyExtractor={item => item}
          renderItem={({item}) => (
            <GroupCard 
              title={item}
              onPress={() => handleOpenGroup(item)}
            />
          )}
          contentContainerStyle={groups?.length === 0 && {flex: 1}}
          ListEmptyComponent={() => (
            <ListEmpty 
              message='Nenhuma turma por enquanto :('
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      }
      <Button 
        title='Criar nova turma'
        type='PRIMARY'
        onPress={handleNewGroup}
      />
    </Container>
  );
}

