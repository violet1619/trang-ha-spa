import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { Actions} from 'react-native-router-flux';

export const goToMainPage = () => {
    console.log('da vao main 2 moi nhat day da len 2');
    console.log(Actions.manhinh3);
    Actions.manhinh3();

}

export const goToMainPageSys = () => {
    console.log('da vao main 2 moi nhat day da len 2');
    console.log(Actions.manhinh3);
    Actions.manhinh2();

}


export const goToMainPage2 = () => {
    console.log('da vao main 2 moi nhat day da len 2');
    console.log(Actions.manhinh3);
    Actions.manhinh3();

}

export const onBack = () => {
    Actions.manhinh3();
}

export const onBackList = () => {
    Actions.ListReceiveAssignment();
}

export const goToLoginPage = () => {
    console.log('da la login');
    Actions.login();
}

const Main2 = () => {
    return (
        <View>
             
        </View>
    );
};

export default Main2;
