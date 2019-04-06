import React, { Component } from 'react';

import {
    StyleSheet, Text, View,
} from 'react-native';
import { Actions, ActionConst, Router, Scene, Modal } from 'react-native-router-flux';
import SynchronizeData_Index from './src/pages/SynchronizeData/Index';
import MH1 from './src/pages/Login';
import MH2 from './src/pages/Main';
import PurchaseOrderIndex from './src/pages/PurchaseOrder/Index';
import ListPurchaseOrder from './src/pages/ListPurchaseOrder';
import ProductInvoice_Create from './src/pages/ProductInvoice/Create';
import ReceiveAssignment from './src/pages/ReceiveAssignment';
import ListReceiveAssignment from './src/pages/ListReceiveAssignment';
import ChangePassword from './src/pages/ChangePassword';
import DetailEquipment from './src/pages/DetailEquipment';
import Menu from './src/pages/Menu';


export const AppFlux = () => {
    return(
      
        
      
        <Router>
            <Scene key="root">
                <Scene 
                    initial={true}
                    key="login"
                    hideNavBar
                    hideTabBar
                    component={MH1}
                    navigationBarStyle={styles.navigationBar}
                ></Scene>

                <Scene
                    // initial
                    key="drawer"
                    drawer
                    contentComponent={Menu}
                    // drawerIcon={}
                    drawerWidth={300}
                    hideNavBar >

                    <Scene 
                        key = "manhinh3"
                        component ={MH2}
                        hideNavBar
                        title="Man hinh main"
                        />

                    <Scene 
                        key="ListReceiveAssignment"
                        hideNavBar
                        hideTabBar
                        title="Page 3"
                        component={ListReceiveAssignment}
                        // hideBackImage
                        // title={'DANH SÁCH NHẬN PHÂN CÔNG'}
                        // backTitle={'Trở về'}
                        // backButtonTextStyle={styles.backButtonText}
                        // navBarButtonColor={'#fff'}
                        // titleStyle={styles.title} 
                        />

                   

                  

                    <Scene 
                        key="ProductInvoice_Create"
                        hideNavBar
                        component={ProductInvoice_Create}
                        // hideBackImage
                        // title={'TẠO ĐƠN BÁN HÀNG'}
                        // navigationBarStyle={styles.navigationBar}
                        // backTitle={'Trở về'}
                        // backButtonTextStyle={styles.backButtonText}
                        // navBarButtonColor={'#fff'}
                        // titleStyle={styles.title}
                        />

                    <Scene 
                        key="PurchaseOrderIndex"
                        hideNavBar
                        component={PurchaseOrderIndex}
                        // hideBackImage
                        // title={'DANH SÁCH ĐƠN HÀNG'}
                        // backTitle={'Trở về'}
                        // backButtonTextStyle={styles.backButtonText}
                        // navBarButtonColor={'#fff'}
                        // titleStyle={styles.title}
                        />

                     <Scene 
                        key="ChangePassword"
                        hideNavBar
                        component={ChangePassword}
                        // hideBackImage
                        // title={'ĐỔI MẬT KHẨU'}
                        // backTitle={'Trở về'}
                        // backButtonTextStyle={styles.backButtonText}
                        // navBarButtonColor={'#fff'}
                        // titleStyle={styles.title}
                        />
                
                    <Scene 
                        key = "manhinh2"
                        component ={SynchronizeData_Index}
                        hideNavBar
                        title="Man hinh dong bo"
                    />

                </Scene>

                <Scene 
                        key="ReceiveAssignment"
                        hideNavBar
                        component={ReceiveAssignment}
                        // hideBackImage
                        // title={'NHẬN PHÂN CÔNG'}
                        // backTitle={'Trở về'}
                        // backButtonTextStyle={styles.backButtonText}
                        // navBarButtonColor={'#fff'}
                        // titleStyle={styles.title}
                        />

                       <Scene 
                        key="DetailEquipment"
                        hideNavBar
                        component={DetailEquipment}
                        // hideBackImage
                        // title={'DANH SÁCH THIẾT BỊ'}
                        // backTitle={'Trở về'}
                        // backButtonTextStyle={styles.backButtonText}
                        // navBarButtonColor={'#fff'}
                        // titleStyle={styles.title}
                        />

                <Scene 
                key = "manhinh1"
                component ={MH1}
                hideNavBar
                />

                <Scene key="main"
                    hideNavBar
                    hideTabBar
                    component={MH2}
                    title={'THỐNG KÊ HÔM NAY'}
                ></Scene>

                <Scene key="listpurchaseorder" 
                    component={ListPurchaseOrder} 
                    title={'DANH SÁCH HOÁ ĐƠN'}
                    navigationBarStyle={styles.navigationBar}
                    backTitle={'Trở về'}
                    backButtonTextStyle={styles.backButtonText}
                    navBarButtonColor={'#fff'}
                    titleStyle={styles.title}
                ></Scene>

           

            </Scene>
        </Router>
    )
}


const styles = StyleSheet.create({
    navigationBar:{
        backgroundColor: 'grey',
    },
    backButtonText:{
        color:'#fff'
    },
    title:{
        color:'blue'
    }
})

export default AppFlux;
