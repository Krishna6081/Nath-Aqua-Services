import { Alert } from 'react-native';

export const showItemAddedAlert = (productName: string, navigation: any) => {
  Alert.alert(
    'Item Added Successfully! 💧',
    `"${productName}" has been added to your cart.`,
    [
      {
        text: 'Continue Shopping',
        style: 'cancel',
      },
      {
        text: 'View Cart 🛒',
        onPress: () => navigation.navigate('Cart'),
      },
    ],
    { cancelable: true }
  );
};
