import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Login, Cadastrar, Quiz1, Quiz2, Quiz3, Quiz4, Quiz5, Quiz6, Quiz7, Quiz8, Quiz9, Quiz10, Resultados } from './components/componentes';

const Navegacao = createStackNavigator();
export default class App extends React.Component
{
  render()
  {
    return(
      <NavigationContainer>
        <Navegacao.Navigator>
          <Navegacao.Screen name="Login" component={Login} />
          <Navegacao.Screen name="Cadastro" component={Cadastrar} />
          <Navegacao.Screen name="Quiz1" component={Quiz1} />
          <Navegacao.Screen name="Quiz2" component={Quiz2} />
          <Navegacao.Screen name="Quiz3" component={Quiz3} />
          <Navegacao.Screen name="Quiz4" component={Quiz4} />
          <Navegacao.Screen name="Quiz5" component={Quiz5} />
          <Navegacao.Screen name="Quiz6" component={Quiz6} />
          <Navegacao.Screen name="Quiz7" component={Quiz7} />
          <Navegacao.Screen name="Quiz8" component={Quiz8} />
          <Navegacao.Screen name="Quiz9" component={Quiz9} />
          <Navegacao.Screen name="Quiz10" component={Quiz10} />
          <Navegacao.Screen name="Resultados" component={Resultados} />
        </Navegacao.Navigator>
      </NavigationContainer>
    )
  }
}
