import { StyleSheet } from 'react-native';
import { Colors } from 'theme';

const styles = StyleSheet.create({
  w100: {
    width: '100%',
  },
  posAbsolute: {
    position: 'absolute',
    zIndex: 90,
  },
  bo8: {
    borderRadius: 8,
  },

  selected: {
    backgroundColor: '#FFAFAF',
  },

  divider: {
    borderStyle: 'dashed',
    borderColor: Colors.greyEE,
    borderWidth: 1,
  },
  boxShadow: {
    shadowOpacity: 0.35,
    shadowRadius: 48,
  },
  btnDetail: {
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerStatus: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.greyEE,
  },
});
export default styles;
