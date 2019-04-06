import React, { Component } from 'react'
import { Text, StyleSheet, View, TouchableOpacity, WebView, Image, AsyncStorage } from 'react-native'
import MenuApp from '../component/MenuApp'
import { connect } from 'react-redux'
import { actOpenSubMenu, actCloseSubMenu } from '../redux/action/index';
import { Header, Button, Icon } from 'react-native-elements'
import Dashboard from './Dashboard';
import Modal from 'react-native-modal';
import { goToLoginPage } from '../../Router';
import { Actions } from 'react-native-router-flux';

const iconSubmenu= require("../images/sub-menu.png");

class Main extends Component<{}> {
    constructor(props) {
        super(props);
        this.state = {
            isOpenMenu: false,
            isVisible: false
        };
    }

    componentWillMount(){
        AsyncStorage.getItem('UserLogin_UserId', (error, value) => {
            console.log(value);
            if (value == null){
                goToLoginPage();
            }
            else{
                this.setState({isVisible: true});
            }
        });
    }

    componentDidMount() {
        
    }
    componentWillUnmount() {
        
    }
    openMenu = () => {
        this.setState({isOpenMenu: true});
        console.log(this.state.isOpenMenu);

    };
    closeMenu = () => {
        this.setState({isOpenMenu: false});
    };
    render() {
        return (
            this.state.isVisible ?
            <View>
                <Header
                    leftComponent={
                        <View style={{marginTop:10}}>
                            <Icon name='menu' color='#fff' size={40} onPress={() => Actions.drawerOpen()} />
                        </View>
                    }
                    centerComponent={
                        <Text style={styles.pageHeader_title}>THỐNG KÊ HÔM NAY</Text>
                    }
                />
                <Dashboard />
                {/* <Modal isVisible={this.state.isOpenMenu}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalContentInner}>
                            <View style={styles.container}>
                                <MenuApp closeMenu={()=> this.closeMenu()} />
                            </View>
                        </View>
                    </View>
                </Modal> */}
            </View>
            :null
        );
    }
}

const drawerStyles = {
    drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3},
    main: {paddingLeft: 3},
  }

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    pageHeader:{
        backgroundColor: '#428BCA',
        width: '100%',
        flexDirection: 'row',
        borderBottomColor: '#2E6589'
    },
    title: {
        width: '100%',
        fontSize: 14,
        paddingTop: 12,
        color:'#fff',
        fontWeight: 'bold',
        paddingLeft:10
    },
    btnSubmenu: {
        
    },
    iconSubmenu: {
        width: 40,
        height: 40,
    },
    pageHeader_btnLeft:{
        marginTop:30,
        borderColor:'#fff',
        borderWidth:1,
        paddingLeft:10,
        paddingRight:10,
    },
    pageHeader_title:{
        color: '#fff', 
        fontSize:18
    },
    pageHeader_btnRight:{
        marginTop:20,
        borderColor:'#fff',
        borderWidth:1,
        //borderRadius:7,
        padding:4,
        // paddingTop:2,
        // paddingBottom:2,
        // paddingLeft:10,
        // paddingRight:10,
        //width:70,
         flexDirection: 'row',
        // height:30,
        // position: 'absolute',
        // right: 7,
        // top: 6,
    },
    pageHeader_btnRight_text:{
        marginLeft:7,
        marginTop:5,
        fontWeight: 'bold',
        color:'#fff'
    },
    modalContent: {
        position: 'absolute',
        top: 0,
        right: 0,
        left:0,
        bottom:0,
        backgroundColor: '#428BCA',
    },
    modalContentInner: {
        position: 'absolute',
        top: 0,
        right: 0,
        left:0,
        bottom:0,
        backgroundColor: 'white',
    },
});

const mapStateToProps = state => {
    return {
        toggleMenu: state.toggleMenu,
    }
}

const mapDispathToProps = (dispatch, props) => {
    return {
        fetchOpenSubMenu: () => {
            dispatch(actOpenSubMenu());
        },
        fetchCloseSubMenu: () => {
            dispatch(actCloseSubMenu());
        }
    }
}

export default connect(mapStateToProps, mapDispathToProps)(Main);

