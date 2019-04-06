import React, { Component } from 'react';
import { View, AsyncStorage, Alert } from 'react-native';
import { Content, List, ListItem, Thumbnail, Text, Icon, Left, Body, Button } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { goToLoginPage } from './Main2';

class Menu extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            FullName: '',
            UserLogin_UserTypeCode: ''
        };
    }

    componentDidMount() {
        this.loadInitialState().done();
    }

    loadInitialState = async () => {
        var UserLogin_FullName = await AsyncStorage.getItem('UserLogin_FullName');
        if (UserLogin_FullName != null)
            this.setState({ FullName: UserLogin_FullName });
        else
            this.setState({ FullName: '' });

        var UserLogin_UserTypeCode = await AsyncStorage.getItem('UserLogin_UserTypeCode');
        if (UserLogin_UserTypeCode != null)
            this.setState({ UserLogin_UserTypeCode: UserLogin_UserTypeCode });
        else
            this.setState({ UserLogin_UserTypeCode: '' });
    }

    logOut = async () => {
        await AsyncStorage.removeItem('UserLogin_FullName');
        await AsyncStorage.removeItem('UserLogin_UserId');
        await AsyncStorage.removeItem('UserLogin_UserTypeCode');
        //Actions.drawerClose();
        goToLoginPage();
    }

    render() {
        return(
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1, backgroundColor: '#189EFF', justifyContent: 'center', alignItems: 'center' }}>
                    <Thumbnail 
                        style={{ width: 100, height: 100, borderRadius: 100/2, marginTop: 15 }}
                        source={require('../images/user.png')}
                        />
                    <Text style={{ color: '#FFF', fontSize: 15, marginTop: 5 }}>{this.state.FullName}</Text>
                    <Icon style={{ marginRight: -250, marginTop: -25, color: '#FFF' }} 
                        active name="arrow-forward"
                        onPress={() => Actions.drawerClose()} />
                </View>

                <View style={{ flex: 3 }}>
                    <Content>
                        <List>

                            <ListItem noBorder icon onPress={() => Actions.manhinh3()}>
                               <Left>
                                    <Button style={{ backgroundColor: "#189EFF" }}>
                                        <Icon active name="home" />
                                    </Button>
                               </Left>
                               <Body>
                                    <Text>Home</Text>
                                </Body>
                            </ListItem>

                            <ListItem noBorder icon onPress={() => Actions.ListReceiveAssignment()}>
                               <Left>
                                    <Button style={{ backgroundColor: "#189EFF" }}>
                                        <Icon active name="list" />
                                    </Button>
                               </Left>
                               <Body>
                                    <Text>Danh sách nhận phân công</Text>
                                </Body>
                            </ListItem>

                            <ListItem noBorder icon onPress={() => Actions.ProductInvoice_Create()}>
                               <Left>
                                    <Button style={{ backgroundColor: "#189EFF" }}>
                                        <Icon active name="create" />
                                    </Button>
                               </Left>
                               <Body>
                                    <Text>Tạo đơn bán hàng</Text>
                                </Body>
                            </ListItem>

                            <ListItem noBorder icon onPress={() => Actions.PurchaseOrderIndex()}>
                               <Left>
                                    <Button style={{ backgroundColor: "#189EFF" }}>
                                        <Icon active name="list" />
                                    </Button>
                               </Left>
                               <Body>
                                    <Text>Danh sách đơn hàng</Text>
                                </Body>
                            </ListItem>

                            <ListItem noBorder icon onPress={() => Actions.manhinh2()}>
                               <Left>
                                    <Button style={{ backgroundColor: "#189EFF" }}>
                                        <Icon active name="sync" />
                                    </Button>
                               </Left>
                               <Body>
                                    <Text>Đồng bộ dữ liệu danh mục</Text>
                                </Body>
                            </ListItem>

                            <ListItem noBorder icon onPress={() => Actions.ChangePassword()}>
                               <Left>
                                    <Button style={{ backgroundColor: "#189EFF" }}>
                                        <Icon active name="information-circle" />
                                    </Button>
                               </Left>
                               <Body>
                                    <Text>Đổi mật khẩu</Text>
                                </Body>
                            </ListItem>

                            <ListItem noBorder icon onPress={() => Alert.alert(
                                                        'Thông báo!',
                                                        'Bạn có chắc muốn đăng xuất?',
                                                        [
                                                            {text: 'Không', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                                            {text: 'Có', onPress: () => this.logOut()}
                                                        ]
                                                        )}>
                               <Left>
                                    <Button style={{ backgroundColor: "#189EFF" }}>
                                        <Icon active name="exit" />
                                    </Button>
                               </Left>
                               <Body>
                                    <Text>Đăng xuất</Text>
                                </Body>
                            </ListItem>

                        </List>
                    </Content>
                </View>
            </View>
        )
    }
}

const mapDispathToProps = (dispatch, props) => {
    return {
        fetchCloseSubMenu: () => {
            dispatch(actCloseSubMenu());
        }
    }
}

export default connect(null, mapDispathToProps)(Menu);
