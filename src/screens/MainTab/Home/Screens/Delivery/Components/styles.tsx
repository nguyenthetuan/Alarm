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
    backgroundColor: Colors.redF3,
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
  headerStatus: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.greyEE,
  },
  btnDetail: {
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infor: {
    color: Colors.grey85,
  },
});
export default styles;
