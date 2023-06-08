import * as React from 'react';
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import { Audio } from 'expo-av';
import { db } from '../config';

export class Login extends React.Component {
  constructor(props) {
    super(props);
    this.email = '';
    this.senha = '';
    this.sound = null; // Estado para armazenar o objeto de áudio
  }

  async componentDidMount() {
    // Carrega o arquivo de áudio
    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync(require('../assets/giornotheme.mp3')); // Substitua "audio.mp3" pelo nome do seu arquivo de áudio
      this.sound = soundObject;
    } catch (error) {
      console.log('Erro ao carregar o áudio:', error);
    }
  }

  async componentWillUnmount() {
    // Descarrega o objeto de áudio ao desmontar o componente
    if (this.sound) {
      await this.sound.unloadAsync();
    }
  }

  login() {
    db.ref('user')
      .orderByChild('email')
      .equalTo(this.email)
      .once('value', (snapshot) => {
        let data = snapshot.val();
        if (data == null) {
          alert('Vish... Esse e-mail ainda não foi cadastrado :(');
        } else {
          let dados = Object.values(data);
          if (this.senha === dados[0].senha) {
            // alert('Logando...');
            this.props.navigation.navigate('Quiz1');
          } else {
            alert(
              'Tudo certo com o e-mail! Mas verifique essa senha aí, chefia'
            );
          }
        }
      });
  }

  reproduzirAudio = async () => {
    // Verifica se o objeto de áudio foi carregado corretamente
    if (this.sound) {
      try {
        await this.sound.playAsync(); // Reproduz o áudio
      } catch (error) {
        console.log('Erro ao reproduzir o áudio:', error);
      }
    }
  };

  render() {
    return (
      <View>
        <Image source={require('../assets/logo.png')} style={style.image} />

        <Text
          style={{
            fontFamily: 'federo',
            fontSize: '15pt',
            fontWeight: 'bold',
            alignSelf: 'center',
          }}>
          CHARACTER QUIZ
        </Text>

        <TextInput
          placeholder="E-mail"
          style={style.container}
          onChangeText={(texto) => {
            this.email = texto;
          }}
        />

        <TextInput
          placeholder="Senha"
          style={style.container}
          onChangeText={(texto) => {
            this.senha = texto;
          }}
        />

        <TouchableOpacity
          style={style.buttonLogin}
          onPress={() => {
            this.login();
            this.reproduzirAudio();
          }}>
          <Text>Login</Text>
        </TouchableOpacity>

        <Text style={{ display: 'flex', alignSelf: 'center', margin: 10 }}>
          <Text
            style={{ color: 'royalblue' }}
            onPress={() => this.props.navigation.navigate('Cadastro')}>
            Cadastre-se!
          </Text>
        </Text>
      </View>
    );
  }
}

export class Cadastrar extends React.Component {
  constructor(props) {
    super(props);
    this.nome = '';
    this.senha = '';
    this.email = '';
    this.senhaC = '';
  }

  cadastrar() {
    if (this.senha === this.senhaC) {
      db.ref('/user').push({
        nome: this.nome,
        senha: this.senha,
        email: this.email,
      });
      alert('Usuário cadastrado com sucesso :D');
      this.props.navigation.navigate('Login');
    } else {
      alert('Valores inválidos... Tente novamente');
    }
  }

  render() {
    return (
      <View>
        <br></br>

        <Text
          style={{
            fontFamily: 'federo',
            fontSize: '15pt',
            fontWeight: 'bold',
            alignSelf: 'center',
          }}>
          CHARACTER QUIZ
        </Text>

        <TextInput
          placeholder="Usuário"
          style={style.container}
          onChangeText={(texto) => {
            this.nome = texto;
          }}
        />

        <TextInput
          placeholder="E-mail"
          style={style.container}
          onChangeText={(texto) => {
            this.email = texto;
          }}
        />

        <TextInput
          placeholder="Digite sua senha"
          style={style.container}
          onChangeText={(texto) => {
            this.senha = texto;
          }}
        />

        <TextInput
          placeholder="Repita a senha"
          style={style.container}
          onChangeText={(texto) => {
            this.senhaC = texto;
          }}
        />

        <TouchableOpacity
          style={style.buttonCadastro}
          onPress={() => this.cadastrar()}>
          <Text>Cadastrar</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

// QUIZ 1 - GIORNO GIOVANNA
export class Quiz1 extends React.Component {
  constructor(props) {
    super(props);
    this.resp = '';
    this.state = {
      tentativa: [],
      alternativas: [
        'Giorno Giovanna',
        'Bruno Bucciarati',
        'Panacota Fugo',
        'Risotto Nero',
      ],
    };
  }

  armazenar() {
    db.ref('/tentativa').push({
      // resp: this.resp
      resp: 1,
    });
  }

  componentDidMount() {
    db.ref('tentativa').on('value', (snapshot) => {
      let data = snapshot.val();
      let dados = Object.values(data);
      this.setState({ tentativa: dados });
    });
  }

  verificar() {
    if (this.resp === 'Giorno Giovanna') {
      alert('Resposta correta!');
      this.armazenar();
      this.props.navigation.navigate('Quiz2');
    } else {
      alert('Resposta incorreta :(');
      this.props.navigation.navigate('Quiz2');
    }
  }

  render() {
    return (
      <View>
        <Text
          style={{
            fontFamily: 'federo',
            fontSize: '15pt',
            fontWeight: 'bold',
            alignSelf: 'center',
            marginTop: 15,
          }}>
          Quem é esse personagem?
        </Text>
        <br></br>

        <Image
          source={require('../assets/giorno.jpg')}
          style={style.imageJojo}
        />
        <FlatList
          data={this.state.alternativas}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={style.buttonAlternativa1}
              onPress={() => {
                this.resp = item;
                this.verificar();
              }}>
              <Text style={{ color: '#D82355' }}>{item}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
}

// QUIZ 2 -> JOSUKE HIGASHIKATA
export class Quiz2 extends React.Component {
  constructor(props) {
    super(props);
    this.resp = '';
    this.state = {
      tentativa: [],
      alternativas: [
        'Koichi Hirose',
        'Hayato Kawajiri',
        'Josuke Higashikata',
        'Okuyasu Nijimura',
      ],
    };
  }

  armazenar() {
    db.ref('/tentativa').push({
      // resp: this.resp
      resp: 1,
    });
  }

  componentDidMount() {
    db.ref('tentativa').on('value', (snapshot) => {
      let data = snapshot.val();
      let dados = Object.values(data);
      this.setState({ tentativa: dados });
    });
  }

  verificar() {
    if (this.resp === 'Josuke Higashikata') {
      alert('Resposta correta!');
      this.armazenar();
      this.props.navigation.navigate('Quiz3');
    } else {
      alert('Resposta incorreta :(');
      this.props.navigation.navigate('Quiz3');
    }
  }

  render() {
    return (
      <View>
        <Text
          style={{
            fontFamily: 'federo',
            fontSize: '15pt',
            fontWeight: 'bold',
            alignSelf: 'center',
            marginTop: 15,
          }}>
          Quem é esse personagem?
        </Text>
        <br></br>

        <Image
          source={require('../assets/josuke.png')}
          style={{ alignSelf: 'center', width: '200px', height: '300px' }}
        />

        <FlatList
          data={this.state.alternativas}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={style.buttonAlternativa2}
              onPress={() => {
                this.resp = item;
                this.verificar();
              }}>
              <Text style={{ color: '#1E2A34' }}>{item}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
}

// QUIZ 3 -> JOTARO KUJO
export class Quiz3 extends React.Component {
  constructor(props) {
    super(props);
    this.resp = '';
    this.state = {
      tentativa: [],
      alternativas: [
        'Noriaki Kakyoin',
        'Jotaro Kujo',
        'Muhammad Avdol',
        'Jean Pierre Polnareff',
      ],
    };
  }

  armazenar() {
    db.ref('/tentativa').push({
      // resp: this.resp
      resp: 1,
    });
  }

  componentDidMount() {
    db.ref('tentativa').on('value', (snapshot) => {
      let data = snapshot.val();
      let dados = Object.values(data);
      this.setState({ tentativa: dados });
    });
  }

  verificar() {
    if (this.resp === 'Jotaro Kujo') {
      alert('Resposta correta!');
      this.armazenar();
      this.props.navigation.navigate('Quiz4');
      // Adicione aqui a lógica para navegar para a próxima tela ou executar outras ações desejadas
    } else {
      alert('Resposta incorreta :(');
      this.props.navigation.navigate('Quiz4');
    }
  }

  render() {
    return (
      <View>
        <Text
          style={{
            fontFamily: 'federo',
            fontSize: '15pt',
            fontWeight: 'bold',
            alignSelf: 'center',
            marginTop: 15,
          }}>
          Quem é esse personagem?
        </Text>
        <br></br>

        <Image
          source={require('../assets/jotaro.webp')}
          style={{ alignSelf: 'center', width: '200px', height: '300px' }}
        />

        <FlatList
          data={this.state.alternativas}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={style.buttonAlternativa3}
              onPress={() => {
                this.resp = item;
                this.verificar();
              }}>
              <Text style={{ color: '#273825' }}>{item}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
}

// QUIZ 4 -> JOSEPH SOESTAR
export class Quiz4 extends React.Component {
  constructor(props) {
    super(props);
    this.resp = '';
    this.state = {
      tentativa: [],
      alternativas: ['Caesar Zeppeli', 'Lisa Lisa', 'Wammu', 'Joseph Joestar'],
    };
  }

  armazenar() {
    db.ref('/tentativa').push({
      // resp: this.resp
      resp: 1,
    });
  }

  componentDidMount() {
    db.ref('tentativa').on('value', (snapshot) => {
      let data = snapshot.val();
      let dados = Object.values(data);
      this.setState({ tentativa: dados });
    });
  }

  verificar() {
    if (this.resp === 'Joseph Joestar') {
      alert('Resposta correta!');
      this.armazenar();
      this.props.navigation.navigate('Quiz5');
      // Adicione aqui a lógica para navegar para a próxima tela ou executar outras ações desejadas
    } else {
      alert('Resposta incorreta :(');
      this.props.navigation.navigate('Quiz5');
    }
  }

  render() {
    return (
      <View>
        <Text
          style={{
            fontFamily: 'federo',
            fontSize: '15pt',
            fontWeight: 'bold',
            alignSelf: 'center',
            marginTop: 15,
          }}>
          Quem é esse personagem?
        </Text>
        <br></br>

        <Image
          source={require('../assets/joseph.jpg')}
          style={{ alignSelf: 'center', width: '200px', height: '300px' }}
        />

        <FlatList
          data={this.state.alternativas}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={style.buttonAlternativa4}
              onPress={() => {
                this.resp = item;
                this.verificar();
              }}>
              <Text style={{ color: '#4F4624' }}>{item}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
}

// QUIZ 5 -> KONO DIO DA
export class Quiz5 extends React.Component {
  constructor(props) {
    super(props);
    this.resp = '';
    this.state = {
      tentativa: [],
      alternativas: ['Dio Brando', 'Yoshikage Kira', 'Kars', 'Diavolo'],
      sound: null, // Estado para armazenar o objeto de áudio
    };
  }

  async componentDidMount() {
    // Carrega o arquivo de áudio
    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync(require('../assets/konodioda.mp3')); // Substitua "exemplo.mp3" pelo nome do seu arquivo de áudio
      this.setState({ sound: soundObject });
    } catch (error) {
      console.log('Erro ao carregar o áudio:', error);
    }

    db.ref('tentativa').on('value', (snapshot) => {
      let data = snapshot.val();
      let dados = Object.values(data);
      this.setState({ tentativa: dados });
    });
  }

  async componentWillUnmount() {
    // Descarrega o objeto de áudio ao desmontar o componente
    if (this.state.sound) {
      await this.state.sound.unloadAsync();
    }
  }

  armazenar() {
    db.ref('/tentativa').push({
      // resp: this.resp
      resp: 1,
    });
  }

  verificar() {
    if (this.resp === 'Dio Brando') {
      alert('Resposta correta!');
      this.armazenar();
      this.props.navigation.navigate('Quiz6');
    } else {
      alert('Resposta incorreta :(');
      this.props.navigation.navigate('Quiz6');
    }
  }

  reproduzirAudio = async () => {
    // Verifica se o objeto de áudio foi carregado corretamente
    if (this.state.sound) {
      try {
        await this.state.sound.playAsync(); // Reproduz o áudio
      } catch (error) {
        console.log('Erro ao reproduzir o áudio:', error);
      }
    }
  };

  render() {
    return (
      <View>
        <Text
          style={{
            fontFamily: 'federo',
            fontSize: '15pt',
            fontWeight: 'bold',
            alignSelf: 'center',
            marginTop: 15,
          }}>
          Quem diz esta frase?
        </Text>
        <br></br>

        <Image
          source={require('../assets/sounds.png')}
          style={{ alignSelf: 'center', width: '100%', height: '200px' }}
        />

        <TouchableOpacity
          style={style.buttonAudio}
          onPress={this.reproduzirAudio}>
          <Text style={{ color: 'white' }}>Reproduzir Áudio</Text>
        </TouchableOpacity>
        <br></br>

        <FlatList
          data={this.state.alternativas}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={style.buttonAlternativa5}
              onPress={() => {
                this.resp = item;
                this.verificar();
              }}>
              <Text style={{ color: '#3C1E17' }}>{item}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
}

// QUIZ 6 -> ORA ORA ORA
export class Quiz6 extends React.Component {
  constructor(props) {
    super(props);
    this.resp = '';
    this.state = {
      tentativa: [],
      alternativas: [
        'Purple Smoke',
        'The World',
        'Star Platinum',
        'Hierophant Green',
      ],
      sound: null, // Estado para armazenar o objeto de áudio
    };
  }

  async componentDidMount() {
    // Carrega o arquivo de áudio
    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync(require('../assets/oraora.mp3')); // Substitua "exemplo.mp3" pelo nome do seu arquivo de áudio
      this.setState({ sound: soundObject });
    } catch (error) {
      console.log('Erro ao carregar o áudio:', error);
    }

    db.ref('tentativa').on('value', (snapshot) => {
      let data = snapshot.val();
      let dados = Object.values(data);
      this.setState({ tentativa: dados });
    });
  }

  async componentWillUnmount() {
    // Descarrega o objeto de áudio ao desmontar o componente
    if (this.state.sound) {
      await this.state.sound.unloadAsync();
    }
  }

  armazenar() {
    db.ref('/tentativa').push({
      // resp: this.resp
      resp: 1,
    });
  }

  verificar() {
    if (this.resp === 'Star Platinum') {
      alert('Resposta correta!');
      this.armazenar();
      this.props.navigation.navigate('Quiz7');
    } else {
      alert('Resposta incorreta :(');
      this.props.navigation.navigate('Quiz7');
    }
  }

  reproduzirAudio = async () => {
    // Verifica se o objeto de áudio foi carregado corretamente
    if (this.state.sound) {
      try {
        await this.state.sound.playAsync(); // Reproduz o áudio
      } catch (error) {
        console.log('Erro ao reproduzir o áudio:', error);
      }
    }
  };

  render() {
    return (
      <View>
        <Text
          style={{
            fontFamily: 'federo',
            fontSize: '15pt',
            fontWeight: 'bold',
            alignSelf: 'center',
            marginTop: 15,
          }}>
          Qual o nome desse Stand?
        </Text>
        <br></br>

        <Image
          source={require('../assets/jotaroora.gif')}
          style={{ alignSelf: 'center', width: '100%', height: '200px' }}
        />

        <TouchableOpacity
          style={style.buttonAudio}
          onPress={this.reproduzirAudio}>
          <Text style={{ color: 'white' }}>Reproduzir Áudio</Text>
        </TouchableOpacity>
        <br></br>

        <FlatList
          data={this.state.alternativas}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={style.buttonAlternativa6}
              onPress={() => {
                this.resp = item;
                this.verificar();
              }}>
              <Text style={{ color: '#3C2E65' }}>{item}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
}

// QUIZ 7 -> MUDA MUDA MUDA
export class Quiz7 extends React.Component {
  constructor(props) {
    super(props);
    this.resp = '';
    this.state = {
      tentativa: [],
      alternativas: [
        'Sex Pistols',
        'Golden Experience',
        'Aerosmith',
        'Spice Girl',
      ],
      sound: null, // Estado para armazenar o objeto de áudio
    };
  }

  async componentDidMount() {
    // Carrega o arquivo de áudio
    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync(require('../assets/giornomuda.mp3')); // Substitua "exemplo.mp3" pelo nome do seu arquivo de áudio
      this.setState({ sound: soundObject });
    } catch (error) {
      console.log('Erro ao carregar o áudio:', error);
    }

    db.ref('tentativa').on('value', (snapshot) => {
      let data = snapshot.val();
      let dados = Object.values(data);
      this.setState({ tentativa: dados });
    });
  }

  async componentWillUnmount() {
    // Descarrega o objeto de áudio ao desmontar o componente
    if (this.state.sound) {
      await this.state.sound.unloadAsync();
    }
  }

  armazenar() {
    db.ref('/tentativa').push({
      // resp: this.resp
      resp: 1,
    });
  }

  verificar() {
    if (this.resp === 'Golden Experience') {
      alert('Resposta correta!');
      this.armazenar();
      this.props.navigation.navigate('Quiz8');
    } else {
      alert('Resposta incorreta :(');
      this.props.navigation.navigate('Quiz8');
    }
  }

  reproduzirAudio = async () => {
    // Verifica se o objeto de áudio foi carregado corretamente
    if (this.state.sound) {
      try {
        await this.state.sound.playAsync(); // Reproduz o áudio
      } catch (error) {
        console.log('Erro ao reproduzir o áudio:', error);
      }
    }
  };

  render() {
    return (
      <View>
        <Text
          style={{
            fontFamily: 'federo',
            fontSize: '15pt',
            fontWeight: 'bold',
            alignSelf: 'center',
            marginTop: 15,
          }}>
          Qual o nome desse Stand?
        </Text>
        <br></br>

        <Image
          source={require('../assets/giornomuda.gif')}
          style={{ alignSelf: 'center', width: '100%', height: '200px' }}
        />

        <TouchableOpacity
          style={style.buttonAudio}
          onPress={this.reproduzirAudio}>
          <Text style={{ color: 'white' }}>Reproduzir Áudio</Text>
        </TouchableOpacity>
        <br></br>

        <FlatList
          data={this.state.alternativas}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={style.buttonAlternativa7}
              onPress={() => {
                this.resp = item;
                this.verificar();
              }}>
              <Text style={{ color: '#70283E' }}>{item}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
}

// QUIZ 8 -> JOELYNE KUJO
export class Quiz8 extends React.Component {
  constructor(props) {
    super(props);
    this.resp = '';
    this.state = {
      tentativa: [],
      alternativas: [
        'Jolyne Kujo',
        'Ermes Costello',
        'Foo Fighters',
        'Holy Kujo',
      ],
    };
  }

  armazenar() {
    db.ref('/tentativa').push({
      // resp: this.resp
      resp: 1,
    });
  }

  componentDidMount() {
    db.ref('tentativa').on('value', (snapshot) => {
      let data = snapshot.val();
      let dados = Object.values(data);
      this.setState({ tentativa: dados });
    });
  }

  verificar() {
    if (this.resp === 'Jolyne Kujo') {
      alert('Resposta correta!');
      this.armazenar();
      this.props.navigation.navigate('Quiz9');
    } else {
      alert('Resposta incorreta :(');
      this.props.navigation.navigate('Quiz9');
    }
  }

  render() {
    return (
      <View>
        <Text
          style={{
            fontFamily: 'federo',
            fontSize: '15pt',
            fontWeight: 'bold',
            alignSelf: 'center',
            marginTop: 15,
          }}>
          Quem é essa personagem?
        </Text>
        <br></br>

        <Image
          source={require('../assets/jolyne.jpg')}
          style={{ width: '200px', height: '300px', alignSelf: 'center' }}
        />
        <FlatList
          data={this.state.alternativas}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={style.buttonAlternativa8}
              onPress={() => {
                this.resp = item;
                this.verificar();
              }}>
              <Text style={{ color: '#BB2F65' }}>{item}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
}

// QUIZ 9 -> CRUSADERS LAUGHING
export class Quiz9 extends React.Component {
  constructor(props) {
    super(props);
    this.resp = '';
    this.state = {
      tentativa: [],
      alternativas: ['Um vulcão', 'O Sol', 'Um Palhaço', 'Uma Pedra'],
    };
  }

  armazenar() {
    db.ref('/tentativa').push({
      // resp: this.resp
      resp: 1,
    });
  }

  componentDidMount() {
    db.ref('tentativa').on('value', (snapshot) => {
      let data = snapshot.val();
      let dados = Object.values(data);
      this.setState({ tentativa: dados });
    });
  }

  verificar() {
    if (this.resp === 'Uma Pedra') {
      alert('Resposta correta!');
      this.armazenar();
      this.props.navigation.navigate('Quiz10');
    } else {
      alert('Resposta incorreta :(');
      this.props.navigation.navigate('Quiz10');
    }
  }

  render() {
    return (
      <View>
        <Text
          style={{
            fontFamily: 'federo',
            fontSize: '15pt',
            fontWeight: 'bold',
            alignSelf: 'center',
            marginTop: 15,
          }}>
          Do que esses personagens estão rindo?
        </Text>
        <br></br>

        <Image
          source={require('../assets/jojolaugh.gif')}
          style={{ alignSelf: 'center', width: '100%', height: '200px' }}
        />
        <FlatList
          data={this.state.alternativas}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={style.buttonAlternativa9}
              onPress={() => {
                this.resp = item;
                this.verificar();
              }}>
              <Text style={{ color: '#261D1D' }}>{item}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
}

// QUIZ 10 -> ARAKI
export class Quiz10 extends React.Component {
  constructor(props) {
    super(props);
    this.resp = '';
    this.state = {
      tentativa: [],
      alternativas: ['Modelo', 'Cantor', 'Figurante', 'Autor de JoJo'],
    };
  }

  armazenar() {
    db.ref('/tentativa').push({
      // resp: this.resp
      resp: 1,
    });
  }

  componentDidMount() {
    db.ref('tentativa').on('value', (snapshot) => {
      let data = snapshot.val();
      let dados = Object.values(data);
      this.setState({ tentativa: dados });
    });
  }

  verificar() {
    if (this.resp === "Autor de JoJo") {
      alert('Resposta correta!');
      this.armazenar();
      this.props.navigation.navigate('Resultados');
    } else {
      alert('Resposta incorreta :(');
      this.props.navigation.navigate('Resultados');
    }
  }

  render() {
    return (
      <View>
        <Text
          style={{
            fontFamily: 'federo',
            fontSize: '15pt',
            fontWeight: 'bold',
            alignSelf: 'center',
            marginTop: 15,
          }}>
          Quem é ARAKI?
        </Text>
        <br></br>

        <Image
          source={require('../assets/araki.png')}
          style={{ alignSelf: 'center', width: '200px', height: '300px' }}
        />
        <FlatList
          data={this.state.alternativas}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={style.buttonAlternativa10}
              onPress={() => {
                this.resp = item;
                this.verificar();
              }}>
              <Text style={{ color: '#171319' }}>{item}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
}

// RESULTADOS
export class Resultados extends React.Component {
  constructor(props) {
    super(props);
    this.resp = '';
    this.state = {
      tentativa: [],
      item: '',
      count: 0,
    };
  }

  armazenar() {
    db.ref('/tentativa').push({
      // resp: this.resp
      resp: 1,
    });
  }

  componentDidMount() {
    db.ref('tentativa').on('value', (snapshot) => {
      const count = snapshot.numChildren();
      this.setState({ count });
    });
  }

  verificarPontuacao() {
    db.ref('tentativa')
      .once('value')
      .then((snapshot) => {
        const pontos = snapshot.val();
        // Faça algo com os valores de "users"
        console.log(pontos);
      })
      .catch((error) => {
        // Trate os erros, se houver algum
      });
  }

  apagarPontuacao() {
    db.ref('tentativa')
      .remove()
      .then(() => {
        alert('Padre Pucci resetou o mundo e tudo foi perdido...');
      })
      .catch((error) => {
        console.log('Erro ao apagar a pontuação:', error);
      });
  }

  render() {
    return (
      <View>
        <Text
          style={{
            fontFamily: 'federo',
            fontSize: '15pt',
            fontWeight: 'bold',
            alignSelf: 'center',
            marginTop: 15,
          }}>
          PADRE PUCCI APARECE
        </Text>
        <Text
          style={{
            fontFamily: 'federo',
            fontSize: '15pt',
            fontWeight: 'bold',
            alignSelf: 'center',
            marginTop: 15,
          }}>
          E IRÁ RESETAR O MUNDO TODO!
        </Text>
        <br></br>

        <Image
          source={require('../assets/pucci.gif')}
          style={{ alignSelf: 'center', width: '200px', height: '300px' }}
        />
        <View>
          <br></br>

          <Text style={style.buttonFinal}>Pontuação Global acumulada:</Text>
          <Text style={style.buttonPontuacao}>{this.state.count}</Text>

          <TouchableOpacity
            style={style.buttonReset}
            onPress={() => {
              this.apagarPontuacao();
              this.props.navigation.navigate('Login');
            }}>
            <Text>Tentar Fugir!</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const style = StyleSheet.create({
  container: {
    fontFamily: 'Cascadia Code',
    flex: 1,
    justifyContent: 'center',
    paddingTop: 5,
    padding: 8,
    color: '#6C6C74',
    backgroundColor: '#E2E0E5',
    borderColor: '#F304EA',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 15,
    marginLeft: '8%',
    marginRight: '8%',
  },

  buttonLogin: {
    flex: 1,
    width: '40%',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: '#F1D9E9',
    borderColor: '#F403E9',
    borderWidth: 2,
    borderRadius: 10,
    marginTop: 15,
  },

  buttonCadastro: {
    flex: 1,
    width: '40%',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: '#F1D9E9',
    borderColor: '#F403E9',
    borderWidth: 2,
    borderRadius: 10,
    marginTop: 15,
  },

  image: {
    height: '70%',
    width: '100%',
  },

  buttonFinal: {
    flex: 1,
    width: '61%',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    padding: 8,
    color: '#CDE412',
    backgroundColor: '#61272E',
    borderColor: '#4076C1',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 15,
  },

  buttonPontuacao: {
    flex: 1,
    width: '15%',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 16,
    backgroundColor: '#F0EEF1',
    borderColor: '#61272E',
    borderWidth: 1,
    borderRadius: 100,
    marginTop: 15,
  },

  buttonAlternativa1: {
    flex: 1,
    width: '50%',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: '#ECCED9',
    borderColor: '#2D8D89',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 15,
  },

  buttonAlternativa2: {
    flex: 1,
    width: '50%',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: '#8ED2D5',
    borderColor: '#5B2475',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 15,
  },

  buttonAlternativa3: {
    flex: 1,
    width: '50%',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: '#4FAC78',
    borderColor: '#F6D01F',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 15,
  },

  buttonAlternativa4: {
    flex: 1,
    width: '50%',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: '#BB9FC5',
    borderColor: '#DF877B',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 15,
  },

  buttonAlternativa5: {
    flex: 1,
    width: '50%',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: '#D1C6CB',
    borderColor: '#BF1D1B',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 15,
  },

  buttonAlternativa6: {
    flex: 1,
    width: '50%',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: '#E5CEDC',
    borderColor: '#6955D4',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 15,
  },

  buttonAlternativa7: {
    flex: 1,
    width: '50%',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: '#D4BDA8',
    borderColor: '#91652C',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 15,
  },

  buttonAlternativa8: {
    flex: 1,
    width: '50%',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: '#E0A4A7',
    borderColor: '#3E97B8',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 15,
  },

  buttonAlternativa9: {
    flex: 1,
    width: '50%',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: '#8F7F86',
    borderColor: '#33342B',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 15,
  },

  buttonAlternativa10: {
    flex: 1,
    width: '50%',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: '#747C8C',
    borderColor: '#995231',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 15,
  },

  imageJojo: {
    alignSelf: 'center',
    width: '70%',
    heigth: '20%',
  },

  buttonAudio: {
    flex: 1,
    width: '60%',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: 'royalblue',
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 15,
  },

  buttonReset: {
    flex: 1,
    width: '50%',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#F1D9E9',
    borderColor: '#F403E9',
    borderWidth: 2,
    borderRadius: 10,
    marginTop: 15,
  },
});
