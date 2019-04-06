import React, { Component } from 'react';
import { Alert, AppRegisty, StyleSheet, Text, View, Image, Dimensions, TextInput, Button, TouchableOpacity, ImageBackground, AsyncStorage, ScrollView } from 'react-native';
import { goToMainPageSys, goToAssignedServicesPage } from './Main2';
import apiCaller from '../api/apiCaller';
import Spinner from 'react-native-loading-spinner-overlay';
import { showMessage } from 'react-native-messages';

const { width, height } = Dimensions.get("window");
const background = require("../images/login1_bg.png");
const logo = require("../images/logoTrangHa.png");
const mark = require("../images/logo-nozza.png");
const lockIcon = require("../images/login1_lock.png");
const personIcon = require("../images/login1_person.png");

export default class Login extends Component<{}> {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            PlayerId: 0,
            isLoading: false
        }
    }


    componentWillMount() {
        AsyncStorage.getItem('UserLogin_UserName', (err, result) => {
            console.log(result);
            this.setState({username: result});
          });

          AsyncStorage.getItem('UserLogin_PlayerId', (err, result) => {
            console.log(result);
            this.setState({PlayerId: result});
//dhfgkfjg
          });
    }

    login = () => {
        this.setState({isLoading: true});
        if (this.state.username != '' && this.state.password != '') {
            apiCaller('user/login', 'POST',
            {
                UserName: this.state.username,
                Password: this.state.password,
                PlayerId: this.state.PlayerId
            })
            .then((response)=> {
                console.log(response);
                if(response.data != 'fail'){
                    AsyncStorage.setItem('UserLogin_BranchId', response.data.BranchId.toString());
                    AsyncStorage.setItem('UserLogin_BranchName', response.data.BranchName);
                    AsyncStorage.setItem('UserLogin_UserName', response.data.UserName);
                    AsyncStorage.setItem('UserLogin_Password', this.state.password);
                    AsyncStorage.setItem('UserLogin_FullName', response.data.FullName);
                    AsyncStorage.setItem('UserLogin_UserId', response.data.Id.toString());
                    AsyncStorage.setItem('UserLogin_UserTypeCode', response.data.UserTypeCode);

                    this.setState({isLoading: false});
                    if(response.data.UserTypeCode != 'labor'){
                        console.log('login goToMainPage');
                        goToMainPageSys();
                    }
                    else{
                        console.log('login goToAssignedServicesPage');
                        goToAssignedServicesPage();
                    }
                    
                }   
                else{
                    //showMessage('Tên đăng nhập hoặc mật khẩu chưa đúng!');
                    Alert.alert('Thông báo','Tên đăng nhập hoặc mật khẩu chưa đúng!');
                    this.setState({password: '', isLoading: false});
                }
            });
        }
        else{
            //showMessage('Vui lòng nhập đầy đủ thông tin!');
            Alert.alert('Thông báo','Vui lòng nhập đầy đủ thông tin!');
            this.setState({isLoading: false});
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <ImageBackground source={background} style={styles.background} resizeMode="cover">
                        {/* <View style={styles.markWrap}>
                            <Image source={mark} style={styles.mark} resizeMode="contain" />
                        </View> */}
                        <Image style={ styles.logo }
                            source={logo}>
                        </Image>
                        <Text style={styles.h1}>Trang Hà SPA</Text>
                        <View style={styles.wrapper}>
                            <View style={styles.inputWrap}>
                                <View style={styles.iconWrap}>
                                    <Image source={personIcon} style={styles.icon} resizeMode="contain" />
                                </View>
                                <TextInput
                                    placeholder="Tên đăng nhập"
                                    placeholderTextColor="#eee"
                                    underlineColorAndroid='transparent'
                                    style={[styles.input, {color:'#fff'}]}
                                    value={this.state.username}
                                    onChangeText={(username) => this.setState({ username })}
                                />
                            </View>
                            <View style={styles.inputWrap}>
                                <View style={styles.iconWrap}>
                                    <Image source={lockIcon} style={styles.icon} resizeMode="contain" />
                                </View>
                                <TextInput
                                    placeholderTextColor="#eee"
                                    placeholder="Mật khẩu"
                                    value={this.state.password}
                                    underlineColorAndroid='transparent'
                                    style={[styles.input, {color:'#fff'}]}
                                    secureTextEntry
                                    onChangeText={(password) => this.setState({ password })}
                                />
                            </View>
                            {/* <TouchableOpacity activeOpacity={.5}>
                                <View>
                                    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                                </View>
                            </TouchableOpacity> */}
                            <TouchableOpacity activeOpacity={.5} onPress={this.login}>
                                <View style={styles.button}>
                                    <Text style={styles.buttonText}>Đăng nhập</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        {/* <View style={styles.container}>
                            <View style={styles.signupWrap}>
                                <Text style={styles.accountText}>Don't have an account?</Text>
                                <TouchableOpacity activeOpacity={.5} >
                                    <View>
                                        <Text style={styles.signupLinkText}>Sign Up</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View> */}
                    </ImageBackground>
                </ScrollView>
                <Spinner visible={this.state.isShowLoading}
                    //textContent={''} 
                    //textStyle={{color: '#FFF', fontSize: 14}} 
                    overlayColor={'rgba(66, 139, 202, 1)'}
                    normal />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    logo: {
        alignSelf: 'center'
    },
    container: {
        flex: 1,
        marginTop: 0,
    },
    h1:{
        fontSize:20,
        textAlign:'center',
        backgroundColor: "transparent",
        // marginTop:'20%',
        color:'#fff'
    },
    markWrap: {
        flex: 1,
        paddingVertical: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    mark: {
        maxWidth: 170,
    },
    background: {
        width,
        height,
        paddingHorizontal: 30
    },
    backgroundBottom: {
        width,
        height,
    },
    wrapper: {
        paddingVertical: 30,
    },
    inputWrap: {
        flexDirection: "row",
        marginVertical: 10,
        height: 40,
        borderBottomWidth: 1,
        borderBottomColor: "#CCC"
    },
    iconWrap: {
        paddingHorizontal: 7,
        alignItems: "center",
        justifyContent: "center",
    },
    icon: {
        height: 20,
        width: 20,
    },
    input: {
        flex: 1,
        paddingHorizontal: 10,
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
    forgotPasswordText: {
        color: "#D8D8D8",
        backgroundColor: "transparent",
        textAlign: "right",
        paddingRight: 15,
    },
    signupWrap: {
        backgroundColor: "transparent",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    accountText: {
        color: "#D8D8D8"
    },
    signupLinkText: {
        color: "#FFF",
        marginLeft: 5,
    }
});
