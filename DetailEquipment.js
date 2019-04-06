import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet, ScrollView, AsyncStorage, Keyboard, Alert } from 'react-native';
import { Card, List, ListItem, Button, Header, Icon, Badge, FormInput, FormLabel, FormValidationMessage } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import apiCaller from '../api/apiCaller';
import Moment from 'moment';
import Camera from 'react-native-camera';

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

function getHeightCamera() {
  return deviceH - 70;
}

export default class DetailEquipment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Model: [],
      isShowLoading: false,
      isOpenCamera: false,
      Id: '',
      SchedulingHistoryId: 0,
      UserId: '',
      StaffEquipmentName: '',
      txtProductCode: '',
      Status: '',
      Note: '',
      EquimentGroup: '',
      StaffEquipmentCode: '',
      SchedulingHistoryId: ''
    }
  }

  loadData = () => {
    this.setState({isShowLoading: true});
    apiCaller('SchedulingHistory/Detail', 'GET', {
      Id: this.state.SchedulingHistoryId,
      UserId: this.state.UserId
    }).then((res) => {
      if(res === undefined){
        this.setState({isHidden: false});
        this.setState({StaffEquipmentName: ' '});
        this.setState({EquimentGroup: ' '});
        this.setState({StaffEquipmentCode: ' '});
      }
      else{
        this.setState({isHidden: true});
        this.setState({Id: 0});
        this.setState({EquimentGroup: res.data.EquimentGroup});

        if (res.data.StaffMadeList.length > 0){
          for (var i = 0; i < res.data.StaffMadeList.length; i++) {
            if (res.data.StaffMadeList[i].UserId == this.state.UserId){
              this.setState({Id: res.data.StaffMadeList[i].Id});
              this.setState({Status: res.data.StaffMadeList[i].Status});
            }
          }
        }

        if (this.state.Id == 0){
          this.setState({isHidden: false});
          this.setState({StaffEquipmentName: ' '});
        }
        else{
          console.log('Day la ham get data ', res.data.EquipmentList);

          var thietBi = '';
          this.setState({StaffEquipmentName: thietBi});

          for(var i = 0; i < res.data.EquipmentList.length; i++){
            thietBi = thietBi + ' ' + res.data.EquipmentList[i].StaffEquipmentName;
          }
          
          this.setState({StaffEquipmentName: thietBi});

          if (this.state.Status!='pending' ){
            this.setState({isHidden: false});
          }
        }

        for(var i = 0; i < res.data.EquipmentList.length; i++){
          this.setState({StaffEquipmentCode: res.data.EquipmentList[i].StaffEquipmentCode});
        }
      }
    });
  }

  goBack = () => {
    Actions.ReceiveAssignment({textidxeplich: this.state.SchedulingHistoryId});
  }

  showDetail = (Id) => {
    apiCaller('PurchaseOrder/Detail', 'GET', { Id: Id }).then(res => {
      console.log(res.data);
      res.data.ModifiedUserId = this.state.UserId;
      this.setState({ isVisibleDetail: true, ModelDetail: res.data });
    });
  }

  nhanThietBi = () => {
    if (this.state.txtProductCode != '') {
      var thietBiId = 0;
      var txtCode = '';
      if (this.state.Model.length > 0){
        for (var i = 0; i < this.state.Model.length; i++){
          if (this.state.Model[i].StaffEquipmentCode.toUpperCase() == this.state.txtProductCode.toUpperCase()){
            thietBiId = this.state.Model[i].Id;
            this.login(thietBiId);
          } else {
            thietBiId = 0;
            txtCode = this.state.txtProductCode;
            this.login1(thietBiId, txtCode);
          }
          if (this.state.Model[i].Status === 'accept') {
            // Alert.alert('Thông báo','Thiết bị đã được accept!');
            Keyboard.dismiss();
            return;
          }
        }
      } else {
        thietBiId = 0;
        txtCode = this.state.txtProductCode;
        this.login1(thietBiId, txtCode);
      }
    } else {
      Alert.alert('Thông báo','Vui lòng nhập đầy đủ thông tin thiết bị!');
      return;
    }
  }

  login1 = (thietBiId, txtCode) => {
    this.setState({isLoading: true});
    this.state.StaffEquipmentCode = txtCode;
    if (thietBiId >= 0) {
      apiCaller('SchedulingHistory/ApprovalEquipment', 'POST',
      {
        Id: thietBiId,
        CreatedUserId: this.state.UserId,
        EquimentGroup: this.state.EquimentGroup,
        StaffEquipmentCode: this.state.StaffEquipmentCode,
        SchedulingHistoryId: this.state.SchedulingHistoryId
      })
      .then((response)=> {
        console.log(response);
        if(response.data != 'fail'){
          this.setState({Model: response.data});
        } else {
          Alert.alert(
            'Thông báo',
            'Thiết bị chưa được đẩy lên.',
            [
              {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: 'OK', onPress: () => console.log('OK Pressed'), style: 'OK'}
            ],
          );
        }
      });
    }
  }

  login = (thietBiId) => {
    this.setState({isLoading: true});
    if (thietBiId >= 0) {
      apiCaller('SchedulingHistory/ApprovalEquipment', 'POST',
      {
        Id: thietBiId,
        CreatedUserId: this.state.UserId,
        EquimentGroup: this.state.EquimentGroup,
        StaffEquipmentCode: this.state.StaffEquipmentCode,
        SchedulingHistoryId: this.state.SchedulingHistoryId
      })
      . then((response)=> {
        console.log(response);
        if(response.data != 'fail'){
          this.setState({Model: response.data});
          Keyboard.dismiss();
          // if (this.state.Model.length > 0){
          //   for (var i = 0; i < this.state.Model.length; i++){
          //     if (this.state.Model[i].Id == response.data.Id){
          //       this.state.Model[i].Status = response.data.Status;
          //       this.state.Model[i].ModifiedDate = response.data.ModifiedDate;
          //       this.state.Model[i].ModifiedUserName = response.data.ModifiedUserName;
          //       this.state.Model[i].Note = '';
                
          //       this.setState({Model: this.state.Model});
          //       Keyboard.dismiss();
          //     }
          //   }
          // }
        } else {
          Alert.alert(
            'Thông báo',
            'Thiết bị chưa được đẩy lên.',
            [
              {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: 'OK', onPress: () => console.log('OK Pressed'), style: 'OK'}
            ],
          );
        }
      });
    }
  }

  tuChoiThietBi = () => {
    if (this.state.txtProductCode == '') {
      Alert.alert('Thông báo','Vui lòng nhập đầy đủ thông tin thiết bị!');
      return;
    } else {
      Alert.alert(
        'Thông báo',
        'Bạn có chắc muốn từ chối thiết bị này không?',
        [
          {text: 'Không', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          {text: 'Từ chối', onPress: () => console.log('Refure Pressed'), style: 'refure'}
        ],);
      var thietBiId = 0;
      if (this.state.Model.length > 0){
        for (var i = 0; i < this.state.Model.length; i++){
          if (this.state.Model[i].StaffEquipmentCode.toUpperCase() == this.state.txtProductCode.toUpperCase()){
            thietBiId = this.state.Model[i].Id;
          }
        }

        this.refure(thietBiId);
      }
    }
  }

  refure = (thietBiId) => {
    if (this.state.Note.toString().trim() == '') {
      Alert.alert('Thông báo','Vui lòng nhập lý do từ chối thiết bị!');
      return;
    }
    else{
      if (thietBiId > 0) {
        apiCaller('SchedulingHistory/RefureEquipment', 'POST',
        {
          Id: thietBiId,
          Note: this.state.Note,
          CreatedUserId: this.state.UserId
        })
        .then((response)=> {
          console.log(response);
          if(response.data != 'fail'){
            if (this.state.Model.length > 0){
              for (var i = 0; i < this.state.Model.length; i++){
                if (this.state.Model[i].Id == response.data.Id){
                  this.state.Model[i].Status = response.data.Status;
                  this.state.Model[i].ModifiedDate = response.data.ModifiedDate;
                  this.state.Model[i].Note = response.data.Note;
                  
                  this.setState({Model: this.state.Model});
                  Keyboard.dismiss();
                }
              }
            }
          }
        });
      }
    }
  }

  componentDidMount() {
    AsyncStorage.getItem('UserLogin_UserId', (error, value) => {
      if(value != null){
        this.setState({UserId: value});
        this.loadData();
      }
    });
  }

  componentWillMount() {
    console.log('Day la ham get data ', this.props.dsthietbi);
    this.setState({Model: this.props.dsthietbi});
    this.setState({SchedulingHistoryId: this.props.SchedulingHistoryId});
  }

  openCamera = () => {
    this.setState({isOpenCamera: true})
  }

  closeCamera = () => {
    this.setState({ isOpenCamera: false });
  }

  onBarCodeRead(e) {
    this.setState({ isOpenCamera: false });
    var barcode = e.data;

    this.setState({txtProductCode: barcode});
    if (this.state.Model.length > 0){
      for (var i = 0; i < this.state.Model.length; i++){
        if (this.state.Model[i].StaffEquipmentCode == barcode){
          if (this.state.Model[i].Status === 'accept') {
            Alert.alert('Thông báo','Thiết bị đã được accept!');
            return;
          } else {
            this.nhanThietBi();
            return;
          }
        } else {
          Alert.alert(
            'Thông báo',
            'Hệ thống đã tìm thấy thiết bị (' + barcode + ')! Bạn có muốn đồng ý nhận không?',
            [
              {text: 'Không', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: 'Có', onPress: () => this.nhanThietBi(), style: 'approval'}
            ],
          );
        }
      }
    }
    else {
      Alert.alert(
        'Thông báo',
        'Hệ thống đã tìm thấy thiết bị (' + barcode + ')! Bạn có muốn đồng ý nhận không?',
        [
          {text: 'Không', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          {text: 'Có', onPress: () => this.nhanThietBi(), style: 'approval'}
        ],
      );
    }
  }

  renderList() {
    return (
      this.state.Model.length == 0 ?
        <Text style={styles.alertWarning}>Tìm thấy (0) kết quả!</Text>
      :
        <ScrollView style={{height:getHeight()}}>
          <List containerStyle={{ marginBottom: 50 }}>
            {
              this.state.Model.map((obj, i) => (
                <ListItem
                  key={i}
                  title={
                    <View style={{ paddingLeft: 10 }}>
                      <Text>{obj.StaffEquipmentCode}</Text>
                    </View>
                  }
                  subtitle={
                    <View style={styles.subtitle}>
                      <Text style={styles.title}>Tên thiết bị: {obj.StaffEquipmentName}</Text>
                      <Text style={styles.title}>Trạng thái: 
                        {
                          this.state.Model[i].Status === 'pending' ?
                            <Text style={styles.pendingStatus}> {obj.Status}</Text>
                          :
                            this.state.Model[i].Status === 'accept' ?
                              <Text style={styles.acceptStatus}> {obj.Status}</Text>
                            :
                              <Text style={styles.refureStatus}> {obj.Status}</Text>
                        }
                      </Text>                 
                      <Text style={styles.title}>Thời gian: {Moment(obj.ModifiedDate).format('HH:mm')}</Text>
                      <Text style={styles.title}>Người xác nhận: {obj.ModifiedUserName}</Text>
                      <Text style={styles.title}>Lý do: {obj.Note}</Text>
                    </View>
                  }
                />
              ))
            }
          </List>
        </ScrollView>
    );
  }

  render() {
    return (
      !this.state.isOpenCamera ?
      <View style={styles.container}>
        <Header 
          leftComponent={
            <View style={{ marginTop: 5 }}>
              <TouchableOpacity onPress={() => this.goBack()} style={styles.btnBack}>
                <Icon name="keyboard-arrow-left" size={40} color="#fff" />
              </TouchableOpacity>
            </View>
          }
          centerComponent={
            <Text style={styles.pageHeader_title}>CHI TIẾT THIẾT BỊ</Text>
          }
        />
        <View style={{ flex: 1, backgroundColor: '#eee', paddingTop: 5 }}>
          {this.renderList()}

          <FormInput
            containerStyle={{ backgroundColor: '#fcf8e3', marginTop: 10 }} 
            value={this.state.txtCode}
            onChangeText={(Note) => this.setState({ Note })}
            placeholder={'Lý do từ chối'} />

          <View style={styles.button}>
            <Button
              onPress={() => this.nhanThietBi()}
              backgroundColor={'#36528C'}
              rounded={true}
              title='Nhận thiết bị'
            />
            <Button
              onPress={() => this.tuChoiThietBi()}
              backgroundColor={'#36528C'}
              rounded={true}
              title='Từ chối thiết bị'
            />
          </View>
          <View style={{ position:'relative' }}>
            <FormInput containerStyle={{ backgroundColor: '#fcf8e3', marginTop: 5}}
              value={this.state.txtProductCode}
              onChangeText={(value) => { this.setState({ txtProductCode: value }) }}
              placeholder={'Nhập mã thiết bị...'}
            />
            <FormValidationMessage>{'This field is required'}</FormValidationMessage>
            <TouchableOpacity style={{ position: 'absolute', right: 80, top: 8 }} onPress={() => { this.setState({ txtProductCode: '' }) }}>
              <Icon type={'ionicon'} size={30} name={'ios-close-circle'} color={'#ccc'} />
            </TouchableOpacity>
            <TouchableOpacity style={{ position:'absolute', right:23, top:4 }} onPress={this.openCamera}>
              <Icon type={'material-community'} size={40} name={'barcode-scan'} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      :
      <View>
        <Header
          leftComponent={
            <TouchableOpacity onPress={this.closeCamera}>
              <Text style={{ fontSize: 16, paddingTop: 0, paddingLeft: 10, paddingRight: 10, paddingBottom: 5, color: '#fff' }}>Hủy</Text>
            </TouchableOpacity>
          }
        />
        <View style={[styles.preview_container, { height: getHeightCamera() }]}>
          <Camera
            ref={(cam) => {
              this.camera = cam;
            }}
            onBarCodeRead={this.onBarCodeRead.bind(this)}
            style={[styles.preview]}
            aspect={Camera.constants.Aspect.fill}>
          </Camera>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  btnBack: {
    paddingTop: 4
  },
  pageHeader_title: {
    color: "#fff",
    fontSize: 18
  },
  alertWarning:{
    backgroundColor:'#fcf8e3',
    borderColor:'#faebcc',
    padding:10,
    marginTop:5,
    textAlign:'center',
    alignItems: 'center',
    justifyContent: "center",
    color:'#8a6d3b',
    fontSize: 20
  },
  listGroup:{
    backgroundColor:'#fff',
    borderColor:'#ccc',
    padding:10,
    marginTop:5,
    textAlign:'center',
    color:'#666',
    fontSize: 17
  },
  subtitle:{
    paddingLeft:10,
    paddingTop:5
  },
  preview_container: {
    position: 'relative',
    alignItems: 'center',
  },
  preview: {
    borderWidth: 1,
    borderColor: 'red',
    position: 'absolute',
    top: 0,
    right: 0,
    left:0,
    bottom:0,
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  },
  pageHeader:{
    backgroundColor: '#428BCA',
    width: '100%',
    flexDirection: 'row',
    borderBottomColor: '#2E6589',
    height:41,
  },
  title: {
    color: "#666",
    marginTop: 5
  },
  pendingStatus: {
    color: "#ffb90f",
    marginTop: 5
  },
  acceptStatus: {
    color: "#00ff00",
    marginTop: 5
  },
  refureStatus: {
    color: "#CD2626",
    marginTop: 5
  },
  button: {
    justifyContent: "center",
    alignItems:"center",
    paddingTop:10,
    paddingBottom:10,
    flexDirection: 'row'
  },
});
