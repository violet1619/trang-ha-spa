import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, AsyncStorage, Alert, ScrollView } from 'react-native';
import { Header, Icon } from 'react-native-elements';
import apiCaller from '../api/apiCaller';
import { onBack, goToMainPage } from './Main2';

export default class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      oldpassword: '',
      newpassword: '',
      confirmpassword: '',
      isLoading: false
    };
    this.myTextInput = React.createRef();
  }


  componentWillMount() {
    AsyncStorage.getItem('UserLogin_UserName', (err, result) => {
      console.log(result);
      this.setState({username: result});
    });     
  }

  changePassword = () => {
    this.setState({isLoading: true});
    if (this.state.username != '' && this.state.oldpassword != '' 
    && this.state.newpassword != '' && this.state.confirmpassword != ''
    && this.state.newpassword == this.state.confirmpassword) {
      apiCaller('User/ChangePassword', 'POST',
      {
        UserName: this.state.username,
        ConfirmPassword: this.state.newpassword,
        Password: this.state.oldpassword
      })
      .then((response)=> {
        console.log(response);
        if(response.data != 'fail'){
          AsyncStorage.setItem('UserLogin_BranchId', response.data.BranchId);
          AsyncStorage.setItem('UserLogin_UserName', response.data.UserName);
          AsyncStorage.setItem('UserLogin_Password', this.state.password);
          AsyncStorage.setItem('UserLogin_FullName', response.data.FullName);
          AsyncStorage.setItem('UserLogin_UserId', response.data.Id.toString());
          AsyncStorage.setItem('UserLogin_UserTypeCode', response.data.UserTypeCode);
          
          this.setState({isLoading: false});

          if(this.state.newpassword == this.state.confirmpassword) {
            Alert.alert(
              'Thông báo',
              'Đã đổi mật khẩu thành công!',
              [
                {text: 'OK', onPress: () => goToMainPage()},
              ],);
          }
        }   
        else{
          Alert.alert('Thông báo','Mật khẩu cũ chưa đúng!');
          this.setState({password: '', isLoading: false});
        }
      });
    }
    else{
      if ( this.state.newpassword != this.state.confirmpassword) {
        Alert.alert('Thông báo','Mật khấu mới và xác nhận lại không giống nhau!');
        return;

      }else
      {
        Alert.alert('Thông báo','Vui lòng nhập đầy đủ thông tin!');
      }
        this.setState({isLoading: false});
      }
  }

  render() {
    return (
      <View style={styles.container}>
        <Header 
          leftComponent={
            <View style={{ marginTop: 5 }}>
              <TouchableOpacity onPress={() => onBack()} style={styles.btnBack}>
                <Icon name="keyboard-arrow-left" size={40} color="#fff" />
              </TouchableOpacity>
            </View>
          }
          centerComponent={
            <Text style={styles.pageHeader_title}>ĐỔI MẬT KHẨU</Text>
          }
        />

        <ScrollView>
          <View style={styles.inputWrap}>
            <Text style={styles.title}>Tên đăng nhập</Text>
              <TextInput
                style={styles.textinput}
                placeholder="UserName"
                placeholderTextColor="#000"
                style={[styles.inputdisable, {color:'#000'}]}
                value={this.state.username}
                editable={false}
              />
            </View>

            <View style={styles.inputWrap}>
              <Text style={styles.title}>Mật khẩu cũ</Text>
              <TextInput
                style={styles.textinput}
                placeholder="Old Password"
                placeholderTextColor="#bbb"
                style={[styles.input, {color:'#000'}]}
                secureTextEntry
                value={this.state.oldpassword}
                onChangeText={(oldpassword) => this.setState({ oldpassword })}
              />
            </View>

            <View style={styles.inputWrap}>
              <Text style={styles.title}>Mật khẩu mới</Text>
              <TextInput
                style={styles.textinput}
                placeholder="New Password"
                placeholderTextColor="#bbb"
                style={[styles.input, {color:'#000'}]}
                secureTextEntry
                value={this.state.newpassword}
                onChangeText={(newpassword) => this.setState({ newpassword })}
              />
            </View>

            <View style={styles.inputWrap}>
              <Text style={styles.title}>Nhập lại mật khẩu mới</Text>
              <TextInput
                style={styles.textinput}
                placeholder="New Password"
                placeholderTextColor="#bbb"
                style={[styles.input, {color:'#000'}]}
                secureTextEntry
                value={this.state.confirmpassword}
                onChangeText={(confirmpassword) => this.setState({ confirmpassword })}
              />
            </View>

            <TouchableOpacity activeOpacity={.5} onPress={this.changePassword}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Đổi mật khẩu</Text>
              </View>
            </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  btnBack: {
    paddingTop: 5
  },
  pageHeader_title: {
    color: "#fff",
    fontSize: 18
  },
  inputWrap: {
    flexDirection: "column",
    marginVertical: 10,
    height: 70,
    borderBottomWidth: 1,
    borderBottomColor: "#D3D3D3"
  },
  title: {
    fontSize: 15,
    color: "#000",
    paddingLeft: 10,
    paddingBottom: 3
  },
  inputdisable: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: "#fcf8e3"
  },
  input: {
    flex: 1,
    paddingHorizontal: 10
  },
  textinput: {
    height: 40,
    borderColor: "#D3D3D3",
    borderWidth: 1,
    paddingLeft: 10
  },
  button: {
    backgroundColor: "#0275d8",
    paddingVertical: 10,
    marginHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    borderRadius: 4,
    width: null
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
  },
});
