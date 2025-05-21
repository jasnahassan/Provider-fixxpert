// import React from 'react';
// import { TouchableOpacity, Text, StyleSheet } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';

// const GradientButton = ({ title, onPress, borderRadius = 25, width = 300, margintop = 50, color = ['#093759', '#093759'] }) => {
//     return (
//         <TouchableOpacity onPress={onPress} style={{ borderRadius }}>
//             <LinearGradient 
//                 colors={color} 
//                 start={{ x: 0, y: 0 }} 
//                 end={{ x: 1, y: 1 }}
//                 style={[styles.button, { borderRadius ,width,margintop}]}
//             >
//                 <Text style={styles.buttonText}>{title}</Text>
//             </LinearGradient>
//         </TouchableOpacity>
//     );
// };

// const styles = StyleSheet.create({
//     button: { 
//         paddingVertical: 12, 
//         paddingHorizontal: 30, 
//         alignItems: 'center', 
//     },
//     buttonText: { 
//         color: '#FFF', 
//         fontWeight: 'bold', 
//         fontSize: 16 
//     }
// });

// export default GradientButton;
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const GradientButton = ({
  title,
  onPress,
  borderRadius = 25,
  width = 310,
  margintop = 50,
  color = ['#093759', '#093759'],
}) => {
  const isText = typeof title === 'string';

  return (
    <TouchableOpacity onPress={onPress} style={{ borderRadius }}>
      <LinearGradient
        colors={color}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.button, { borderRadius, width, marginTop: margintop }]}
      >
        {isText ? (
          <Text style={styles.buttonText}>{title}</Text>
        ) : (
          <View style={styles.imageWrapper}>{title}</View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  imageWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GradientButton;