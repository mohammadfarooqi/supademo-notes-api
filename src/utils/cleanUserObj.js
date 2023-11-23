import _ from 'lodash';

function cleanUserObj(user) {
  return _.omit(user, ['password']);
}

export default cleanUserObj;
