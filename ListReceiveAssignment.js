import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, StyleSheet, ScrollView, AsyncStorage } from 'react-native';
import apiCaller from '../api/apiCaller';
import { Header, Icon, List, ListItem } from 'react-native-elements';
import { onBack } from './Main2';
import Moment from 'moment';
import { Actions} from 'react-native-router-flux';

const deviceW = Dimensions.get('window').width;
const deviceH = Dimensions.get('window').height;
const basePx = 375;

function px2dp(px) {
    return px * deviceW / basePx
}

function getHeight() {
    return deviceH - 208;
}

// function getHeightCamera() {
//     return deviceH - 70;
// }

function getWidth() {
    return deviceW;
}

export default class ListReceiveAssignment extends Component{
    constructor(props) {
        super(props);
        this.state = {
            Model: [],
            isVisibleDetail: false,
            isShowLoading: false,
            ModelDetail: null,
            Id: '',
            UserId: '',
            CustomerName: '',
            FullName: '',
            Status: '',
            ExpectedWorkDay: '',
            ExpectedEndDate: '',
            SchedulingHistoryId: ''
        }
    }

    loadData = () => {
        this.setState({isShowLoading: true});
        apiCaller('/SchedulingHistory/GetListSchedulingbyUser', 'GET', {
            txtCode: ' ',
            UserId: this.state.UserId
        }).then((res) => {
            this.setState({ Model: res.data, isShowLoading: false });
            console.log(res.data);
        });
    }

    showDetail = (Id) => {
       
            Actions.ReceiveAssignment({textidxeplich: Id});
      
    }

    componentWillMount() {
        AsyncStorage.getItem('UserLogin_UserId', (error, value) => {
            if(value != null){
                this.setState({UserId: value});
                this.loadData();
            }
        });


    }

    renderList() {
        return (
            this.state.Model.length == 0 ?
            <Text style={styles.alertWarning}>Tìm thấy (0) kết quả!</Text>
            :
            <ScrollView style={{ height: getHeight() }}>
                <List containerStyle= {{marginBottom: 50 }}>
                    {
                        this.state.Model.map((obj, i) =>(
                            <ListItem 
                                onPress={() => this.showDetail(obj.SchedulingHistoryId)}
                                key={i}
                                subtitle={
                                    <View style={styles.subtitle}>
                                        <Text style={{ color: '#666', marginTop: 5 }}> Tên khách hàng:  {obj.CustomerName} </Text>
                                        <Text style={{ color: '#666', marginTop: 5 }}> Người thực hiện:  {obj.FullName} </Text>
                                        <Text style={{ color: '#666', marginTop: 5 }}> Trạng thái:             {obj.SchedulingStatus} </Text>
                                        <Text style={{ color: '#666', marginTop: 5 }}> Thời gian:              {Moment(obj.ExpectedWorkDay).format('HH:mm')} đến {Moment(obj.ExpectedEndDate).format('HH:mm')} </Text>
                                    </View>
                                } 
                            />
                        ))
                            
                    }
                </List>
            </ScrollView>
        )
    }

    render() {
        return(
            <View>
                <Header
                        leftComponent={
                            <View style={{ marginTop: 5 }}>
                                <TouchableOpacity onPress={() => onBack()} style={styles.btnBack}>
                                    <Icon name="keyboard-arrow-left" size={40} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        }
                        centerComponent={
                            <Text style={styles.pageHeader_title}>DANH SÁCH PHÂN CÔNG</Text>
                        }
                    />
                {this.renderList()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    btnBack:{
        // paddingRight: 7,
        // paddingLeft: 10,
        paddingTop: 5,
    },
    pageHeader_title:{
        color: '#fff', 
        fontSize: 18
    },
    alertWarning:{
        backgroundColor: '#fcf8e3',
        borderColor: '#faebcc',
        padding: 10,
        marginTop: 5,
        textAlign: 'center',
        color: '#8a6d3b'
    },
    alertWarning:{
        backgroundColor: '#fcf8e3',
        borderColor: '#faebcc',
        padding: 10,
        marginTop: 5,
        textAlign: 'center',
    },
    subtitle:{
        paddingLeft: 10,
        paddingTop: 5
    }
});
