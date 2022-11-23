import { ButtonIcon } from '@components/ButtonIcon';
import {Container, Icon, Name} from './styles'

type Props = {
  name: string;
  onRemovePlayer: () => void;
}

export function PlayerCard({name, onRemovePlayer}: Props) {
  return(
    <Container>
      <Icon 
        name="person"
      />

      <Name>
        {name}
      </Name>

      <ButtonIcon 
        icon="close"
        type="SECONDARY"
        onPress={onRemovePlayer}
      />
    </Container>
  )
}
