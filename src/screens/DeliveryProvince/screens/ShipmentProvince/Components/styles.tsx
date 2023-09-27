import { StyleSheet } from 'react-native';
import { Colors } from 'theme';

const styles = StyleSheet.create({
  wrapImage: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '1%',
  },
  imageMessage: {
    tiniColor: Colors.main,
  },
  btnCall: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: Colors.gallery,
  },
  infor: {
    color: Colors.grey85,
  },
  name: {
    color: Colors.black3A,
    fontSize: 16,
    fontWeight: '600',
  },
  textWeadth: {
    color: Colors.black3A,
    marginTop: 5,
  },
  txtPick: {
    color: Colors.black3A,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
  dot: {
    height: 16,
    width: 16,
    borderRadius: 8,
    backgroundColor: Colors.main,
  },
  editDetail: {
    color: Colors.EcornflowerBlue,
    fontSize: 12,
    fontWeight: '600',
  },
  change: {
    color: Colors.EcornflowerBlue,
    fontSize: 14,
    fontWeight: '600',
  },
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
  text: {
    fontWeight: '600',
    fontSize: 14,
  },
  subHeader: {
    fontSize: 14,
    color: Colors.main,
  },
  textInfor: {
    fontWeight: '400',
    fontSize: 12,
    color: Colors.grey85,
  },
  imagePersonSender: {
    tintColor: Colors.main,
    height: 20,
    width: 20,
  },
  line: {
    width: '100%',
    height: 1,
    backgroundColor: Colors.main,
  },
  lineBack: {
    width: '100%',
    height: 1,
    backgroundColor: Colors.greyEE,
  },
  buttoCancel: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.main,
    borderRadius: 8,
  },
});
export default styles;
