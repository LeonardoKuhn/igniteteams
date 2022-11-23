import { TouchableOpacityProps } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'

import { Container, ButtonIconTypeStyleProps, Icon } from './styles'

interface Props extends TouchableOpacityProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  type?: ButtonIconTypeStyleProps
}

export function ButtonIcon({icon, type = 'PRIMARY', ...rest}: Props) {
  return(
    <Container type={type} {...rest}>
      <Icon name={icon} type={type}/>
    </Container>
  )
}