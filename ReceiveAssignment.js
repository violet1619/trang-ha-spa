import React, { Component } from 'react';
import { StyleSheet, Dimensions, Text, View, TouchableOpacity, Alert, TextInput, AsyncStorage, Dialog } from 'react-native';
import { onBackList } from './Main2';
import { Header, FormLabel, Icon, Button, FormInput } from 'react-native-elements';
import apiCaller from '../api/apiCaller';
import Moment from 'moment';
import { Actions} from 'react-native-router-flux';
import TimerCountdown from 'react-native-timer-countdown';
import TimerMachine from 'react-timer-machine';
import momentDurationFormatSetup from "moment-duration-format";


var Sound = require('react-native-sound');

momentDurationFormatSetup(Moment);

const deviceW = Dimensions.get('window').width;
const deviceH = Dimensions.get('window').height;
const basePx = 375;

function px2dp(px) {
    return px * deviceW / basePx;
}

function getHeight() {
    return deviceH - 208;
}

function getWidth() {
    return deviceW;
}

export default class ReceiveAssignment extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Model: [],
            Id: 0,
            SchedulingHistoryId: 0,
            UserId: 0,
            CustomerName: '',
            Type: '',
            TotalMinute: 0,
            ExpectedWorkDay: '',
            ExpectedEndDate: '',
            StaffEquipmentName: '',
            Note: '',
            isHidden: true,
            Status: '',
            isTime: false,
            isHetGio: false,
            isMeetingStarted: true,
            lblisTime: 'Bắt đầu',
            thoigianqua: 0,
            isHoanthanh: true,
        }
    }

   


    dongYPhanCong = () => {
        this.setState({isLoading: true});
        if (this.state.Id != '' && this.state.UserId != '') {
            apiCaller('SchedulingHistory/ApprovalUser', 'POST',
            {
                Id: this.state.Id
            })
            .then((response)=> {
                console.log(response);
                if(response.data === 'success'){
                    this.tuChoiPhanCongxong();
                    this.setState({Status: 'accept'});
                    Alert.alert('Thông báo','Bạn đã nhận phân công thành công, hãy bấm vào Bắt đầu để bắt đầu thực hiện liệu trình chăm sóc!');
                    this.setState({password: '', isLoading: false});
                }   
                else{
                    Alert.alert('Thông báo','Nhận phân công thất bại');
                    this.setState({password: '', isLoading: false});
                }
            });
        }
        else{
            Alert.alert('Thông báo','Vui lòng nhập đầy đủ thông tin!');
            this.setState({isLoading: false});
        }
    }

    batDauTinhGio = () => {
        this.setState({isLoading: true});
        if (this.state.Id != '' && this.state.UserId != '') {
            if (this.state.lblisTime != '' && this.state.lblisTime == 'Bắt đầu') {            
                apiCaller('SchedulingHistory/ChangeStatus', 'POST',
                {
                    Id: this.state.SchedulingHistoryId,
                    Status: 'inprogress',
                    Note: ' '
                })
                .then((response)=> {
                    console.log(response);
                    if(response.data.Status === 'inprogress'){
                        this.setState({isTime: true});
                        this.setState({lblisTime: 'Kết thúc'});
                    }   
                    else{
                        this.setState({isTime: false});
                        Alert.alert('Thông báo','Bắt đấu tính giờ thất bại');
                    }
                });
            }
        }
    }

    ketThucTinhGio = () => {
        this.setState({isLoading: true});
        if (this.state.Id != '' && this.state.UserId != '') {
            if (this.state.lblisTime != '' && this.state.lblisTime == 'Kết thúc') { 
                if ((this.state.Note.toString().trim() == '') && (this.state.isHetGio == true)) {
                    Alert.alert('Thông báo', 'Vui lòng nhập lý do quá giờ!');
                    return;
                }
                apiCaller('SchedulingHistory/ChangeStatus', 'POST',
                {
                    Id: this.state.SchedulingHistoryId,
                    Status: 'complete',
                    Note: this.state.Note 
                })
                .then((response)=> {
                    console.log(response);
                    if(response.data.Status === 'complete'){
                        this.setState({isTime: false});
                        this.setState({lblisTime: 'Kết thúc'});
                        this.setState({Status: 'complete'});
                        this.setState({Note: response.data.Note});
                        this.setState({isHetGio: false});
                        this.setState({isHoanthanh: false});
                    }   
                    else{
                        this.setState({isTime: false});
                        Alert.alert('Thông báo','Kết thúc liệu trình thất bại');
                    }
                });
            }
        }
    }

    tinhGio = () => {
        if (this.state.Model.length > 0){
            for (var i = 0; i < this.state.Model.length; i++){
                if (this.state.Model[i].Status === 'accept'){
                    this.batDauTinhGio();
                    return;
                }
                else {
                    Alert.alert(
                        'Thông báo',
                        'Còn thiết bị chưa được accept. Bạn có chắc muốn bắt đầu không?',
                        [
                            {text: 'Không', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                            {text: 'Bắt đầu', onPress: () => this.batDauTinhGio()}
                        ],
                    );
                    return;
                }
            }
        } else {
            Alert.alert(
                'Thông báo',
                'Bạn phải thêm thiết bị vào danh sách mới bắt đầu được.',
                [
                    {text: 'Không', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                    {text: 'Thêm', onPress: () => this.detailEquipment()}
                ],
            );
            return;
        }
    }

    ketThuc = () => {
        if (this.state.Model.length > 0){
            for (var i = 0; i < this.state.Model.length; i++){
                if (this.state.Model[i].Status === 'accept'){
                    this.ketThucTinhGio();
                    return;
                }
            }
        }
    }

    Hetgio = () => {
        this.setState({isLoading: true});
        this.setState({TotalMinute: 0});
        this.setState({isHetGio: true});
        this.setState({isTime: false});
        
        this.hello.play((success) => {
            if (!success) {
              console.log('Sound did not play')
            }
        });
    }

    tuChoiPhanCong = () => {
        if (this.state.Note.toString().trim() == '') {
            Alert.alert('Thông báo','Vui lòng nhập lý do từ chối!');
            return;
        }

        this.setState({isLoading: true});
        if (this.state.Id != '' && this.state.UserId != '') {
            apiCaller('SchedulingHistory/RefureUser', 'POST',
            {
                Id: this.state.Id,
                Note: this.state.Note
            })
            .then((response)=> {
                console.log(response);
                if(response.data === 'success'){
                    this.tuChoiPhanCongxong();
                    this.setState({Status: 'refure'});
                    Alert.alert('Thông báo','Bạn đã từ chối phân công thành công!');
                    this.setState({isHoanthanh: false});
                    this.setState({password: '', isLoading: false});
                }   
                else{
                    Alert.alert('Thông báo','Từ chối phân công thất bại');
                    this.setState({password: '', isLoading: false});
                }
            });
        }
        else{
            Alert.alert('Thông báo','Vui lòng nhập đầy đủ thông tin!');
            this.setState({isLoading: false});
        }
    }


    tuChoiPhanCongxong = () => {
        this.setState({isHidden: false});
    }

    detailEquipment = () => {
        Actions.DetailEquipment({dsthietbi: this.state.Model, SchedulingHistoryId: this.state.SchedulingHistoryId});
    }

    loadData = () => {
        this.setState({isShowLoading: true});
        apiCaller('SchedulingHistory/Detail', 'GET', {
            Id: this.state.Id,
            UserId: this.state.UserId
        }).then((res) => {
            if(res === undefined){
                Alert.alert('Thông báo!', 'Bạn không được phân công.');
                this.setState({isHidden: false});
                this.setState({CustomerName: ' '});
                this.setState({Type: ' '});
                this.setState({TotalMinute: ' '});
                this.setState({ExpectedWorkDay: ' '});
                this.setState({ExpectedEndDate: ' '});
                this.setState({Model: ''});
                this.setState({Id: 0});
                this.setState({Status: ' '});
                this.setState({StaffEquipmentName: ' '});
            }
            else{
                this.setState({isHidden: true});
                this.setState({Id: 0});
                
                if (res.data.StaffMadeList.length > 0){
                    for (var i = 0; i < res.data.StaffMadeList.length; i++)
                        if (res.data.StaffMadeList[i].UserId==this.state.UserId){
                            this.setState({Id: res.data.StaffMadeList[i].Id});
                            this.setState({Status: res.data.StaffMadeList[i].Status});
                        }
                }

                if (this.state.Id ==0){
                Alert.alert('Thông báo!', 'Bạn không được phân công.');
                this.setState({isHidden: false});
                this.setState({CustomerName: ' '});
                this.setState({Type: ' '});
                this.setState({TotalMinute: ' '});
                this.setState({ExpectedWorkDay: ' '});
                this.setState({ExpectedEndDate: ' '});
                this.setState({Model: ''});
                this.setState({Id: 0});
                this.setState({Status: ' '});
                this.setState({StaffEquipmentName: ' '});
                }
                else{
                    console.log('Day la ham get data ', res.data.EquipmentList);
                    this.setState({CustomerName: res.data.CustomerName});
                    this.setState({Type: res.data.ProductName});
                    if(res.data.Status == 'complete'){
                        this.setState({isHoanthanh: false});
                    }   
                    
                    this.setState({TotalMinute: res.data.TotalMinute});
                    this.setState({ExpectedWorkDay: res.data.ExpectedWorkDay});
                    this.setState({ExpectedEndDate: res.data.ExpectedEndDate});
                    var thietBi = '';
                    this.setState({Model: res.data.EquipmentList});
                    for(var i = 0; i < res.data.EquipmentList.length; i++){
                        thietBi  = thietBi + ' ' + res.data.EquipmentList[i].StaffEquipmentName;
                    }
                    
                    this.setState({StaffEquipmentName: thietBi});

                    if (this.state.Status!='pending' ){
                        this.setState({isHidden: false});
                    }
                }
            }
        });
    }

    componentDidMount() {
         AsyncStorage.getItem('UserLogin_UserId', (error, value) => {
            if(value != null){
                this.setState({UserId: value});
                this.loadData();
            }
        });

        this.hello = new Sound('theend.mp3', Sound.MAIN_BUNDLE, (error) => {
            if (error) {
              console.log('failed to load the sound', error);
              return;
            }
          });
    }

    componentWillMount() {
        console.log('Day la ham get data ', this.props.textidxeplich);
        this.setState({Id: this.props.textidxeplich});
        this.setState({SchedulingHistoryId: this.props.textidxeplich});
    }

    render() {
        return (
            // this.state.Model.length == 0 ?
            <View> 
                <Header
                    leftComponent={
                        <View style={{ marginTop: 5 }}>
                            <TouchableOpacity onPress={() => onBackList()} style={styles.btnBack}>
                                <Icon name="keyboard-arrow-left" size={40} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    }
                    centerComponent={
                        <Text style={styles.pageHeader_tilte}>NHẬN PHÂN CÔNG</Text>
                    }
                 />
                
                <View style={{ backgroundColor: '#fff' }}>
                    <View style={{ flexDirection: 'row' }}>
                        <FormLabel>Khách hàng       </FormLabel>
                        {/* <TextInput
                            style={styles.textOutput} 
                            value={this.state.CustomerName} 
                        /> */}
                        <Text style={styles.textOutput}>
                            {this.state.CustomerName}
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                        <FormLabel>Chương trình    </FormLabel>
                        <Text style={styles.textOutput}>
                            {this.state.Type}
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                        <FormLabel>Thời gian           </FormLabel>
                        <Text style={styles.textOutput}>
                            {this.state.Id > '0'? <Text>{Moment(this.state.ExpectedWorkDay).format('HH:mm')} đến {Moment(this.state.ExpectedEndDate).format('HH:mm')}</Text>: ' ' }
                        </Text>
                    </View>
                    

                    <View style={{ flexDirection: 'row' }}>
                        <FormLabel>Thời lượng        </FormLabel>
                        <Text style={styles.textOutput}>
                            {this.state.TotalMinute.toString()} phút
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                        <FormLabel>Thiết bị             </FormLabel>
                        <Text onPress={() => this.detailEquipment()} style={styles.textOutputDetail}> Nhấn để xem chi tiết </Text>
                    </View>

                     <View style={{ flexDirection: 'row' }}>
                        <FormLabel>Trạng thái        </FormLabel>
                        <Text style={styles.textOutput}> {this.state.Status} </Text>
                    </View>

                    <FormInput containerStyle={{ backgroundColor: '#fcf8e3', marginTop: 10 }} 
                            value={this.state.txtCode}
                            onChangeText={(Note) => this.setState({ Note })}
                            placeholder={'Lý do'} />

                    <View style={{ paddingTop: 15 }}>


                        { this.state.isHidden && 
                           <Button 
                           onPress={() => Alert.alert('Thông báo', 'Bạn có chắc muốn nhận phân công này không?',
                           [
                               {text: 'Không', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                               {text: 'Đồng ý', onPress: () =>{this.dongYPhanCong()} }
                           ])}
                           backgroundColor={'#659EC7'}
                           rounded={true}
                           title='Đồng ý'
                       />
                        }


                        { !this.state.isHidden && this.state.isHoanthanh && this.state.lblisTime === 'Bắt đầu' &&
                            <Button 
                                onPress={() => Alert.alert('Thông báo', 'Bạn có chắc chắn bắt đầu công việc này không?',
                                [
                                    {text: 'Không', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                    {text: 'Đồng ý', onPress: () => this.tinhGio()}
                                ])}
                                buttonStyle={{
                                    backgroundColor: "#C60000",
                                    width: 90,
                                    height: 90,
                                    borderColor: "transparent",
                                    borderWidth: 0,
                                    borderRadius: 90,
                                    alignSelf: "center"
                                }}
                                title={this.state.lblisTime}
                                large
                            />
                        }

                        { !this.state.isHidden && this.state.isHoanthanh && this.state.lblisTime === 'Kết thúc' &&
                            <Button 
                                onPress={() => Alert.alert('Thông báo', 'Bạn có chắc chắn Kết thúc công việc này không?',
                                [
                                    {text: 'Không', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                    {text: 'Đồng ý', onPress: () => this.ketThuc()}
                                ])}
                                buttonStyle={{
                                    backgroundColor: "#C60000",
                                    width: 90,
                                    height: 90,
                                    borderColor: "transparent",
                                    borderWidth: 0,
                                    borderRadius: 90,
                                    alignSelf: "center"
                                }}
                                title={this.state.lblisTime}
                                large
                            />
                        }
                    </View>

                    <View style={{ paddingTop: 15 }}>
                    { this.state.isHidden && 
                        <Button 
                            onPress={() => Alert.alert('Thông báo', 'Bạn có chắc muốn từ chối phân công này không?',
                            [
                                {text: 'Không', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                {text: 'Từ chối', onPress: () =>{this.tuChoiPhanCong()}}
                            ])}
                            backgroundColor={'#ffb90f'}
                            rounded={true}
                            title='Từ chối'
                        />
                        }
                    </View>

                    <View style={{ paddingTop: 15, paddingBottom: 15 }}>
                    { this.state.isHidden && 
                        <Button 
                            onPress={() => onBackList()}
                            backgroundColor={'#C8BBBE'}
                            rounded={true}
                            title='Hủy bỏ'
                        />
                    }
                    </View>

                    { this.state.isTime && 
                    <View style={styles.container}>
                     <Text style={styles.textTimerun}>
                    <TimerCountdown
                        initialSecondsRemaining={parseInt(this.state.TotalMinute.toString())*1000*60}
                        onTick={secondsRemaining => console.log('tick', secondsRemaining)}
                        onTimeElapsed={() => {this.Hetgio()}}
                        allowFontScaling={true}
                        style={{ fontSize: 60 }}
                    />
                    </Text>
                    </View>
                    }
                    { this.state.isHetGio &&
                     <View style={styles.container}>
                        <Text style={styles.textTime}>
                        <TimerMachine
                            timeStart={1 * 1000} // start at 10 seconds
                            timeEnd={2000 * 1000} // end at 20 seconds
                            started={this.state.isHetGio}
                            paused={false}
                            countdown={false} // use as stopwatch
                            interval={1000} // tick every 1 second
                            formatTimer={(time, ms) =>
                            Moment.duration(ms, "milliseconds").format("h:mm:ss")
                            }
                         />
                        </Text>
                    </View>
                    }
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    btnBack: {
        paddingTop: 5
    },
    pageHeader_tilte: {
        color: '#fff',
        fontSize: 18
    },
    textOutput: {
        paddingTop: 13,
        fontSize: 17
    },
    textOutputDetail: {
        paddingTop: 13,
        fontSize: 17,
        color: "#0000ff"
    },
    textTime: {
        paddingTop: 13,
        fontSize: 60,
        color: "#FF5733"
    },
    textTimerun: {
        paddingTop: 13,
        fontSize: 60,
        color: "#1f11a9"
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
      },
})


