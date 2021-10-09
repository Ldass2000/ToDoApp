
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Modal,ActivityIndicator } from 'react-native';
// import Colors from './Colors';
import { AntDesign } from 'react-native-vector-icons';

import TodoList from './components/TodoList';
import AddListModal from './components/AddListModal';
import Fire from './Fire';

export default class App extends React.Component {
  state = {
    addTodoVisible: false,
    lists: [],
    user: {},
    loading: true
  };

  componentDidMount() {
    firebase = new Fire((error, user) => {
      if (error) {
        return alert("Uh oh ,something went wrong")
      }
      firebase.getLists(lists => {
        this.setState({ lists, user }, () => {
          this.setState({ loading: false });
        })
      });

      this.setState({ user })
    });
  }

 componentWillUnmount(){
   firebase.detach();
 }


  toggleAddTodomodal() {
    this.setState({ addTodoVisible: !this.state.addTodoVisible })
  }

  renderList = list => {
    return <TodoList list={list} updateList={this.updateList} />
  };

  addList = list => {
    firebase.addList({
      name:list.name,
      color:list.color,
      todos:[]
    })
  };

  updateList = list => {
   firebase.updatelist(list);
  }

  render() {
    if (this.state.loading) {
      return(
        <View style={styles.container}>
        <ActivityIndicator size="large" color="#24A6D9" />
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <Modal
          animationType="slide"
          visible={this.state.addTodoVisible}
          onRequestClose={() => this.state.toggleAddTodomodal()}
        >
          <AddListModal closeModal={() => this.toggleAddTodomodal()} addList={this.addList} />
        </Modal>

       
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.divider} />
          <Text style={styles.title}>
            Todo
            <Text style={{ fontWeight: 'bold', color: "#24A6D9", }}> Lists</Text>
          </Text>
          <View style={styles.divider} />
        </View>
        <View style={{ marginVertical: 48 }}>
          <TouchableOpacity style={styles.addList} onPress={() => this.toggleAddTodomodal()}>
            <AntDesign name="plus" size={16} color={"#24A6D9"} />
          </TouchableOpacity>
          <Text style={styles.add}>Add List</Text>
        </View>

        <View style={{ height: 275, paddingLeft: 32 }}>
          <FlatList
            data={this.state.lists}
            keyExtractor={item => item.id.toString()}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) =>
              this.renderList(item)
            }
            keyboardShouldPersistTaps="always"
          />
        </View>

      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    backgroundColor: "#A7CBD9",
    height: 1,
    flex: 1,
    alignSelf: 'center'
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: "#2D3436",
    paddingHorizontal: 64
  },
  addList: {
    borderWidth: 2,
    borderColor: "#A7CBD9",
    borderRadius: 4,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  add: {
    color: "#24A6D9",
    fontWeight: '600',
    fontSize: 14,
    marginTop: 8
  }
});
