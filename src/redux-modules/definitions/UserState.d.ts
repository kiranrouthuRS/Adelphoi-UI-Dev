// import { Dictionary } from 'lodash';

import * as Types from '../../api/definitions'; // CRA does not support abs paths for typescript yet.

export default interface UserState {
  user: Types.User;
}
